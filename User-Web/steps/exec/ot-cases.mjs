// Outstation use-case execution (OUT-01 … OUT-17; OUT-18 in ot-tc18.mjs).
//   TC=OUT-02 RUN_ID=... node scripts/run.mjs steps/exec/ot-cases.mjs
// Submissions only in OUT-02, OUT-15, OUT-17 (approved 17 Nov 2026); Save As Draft only in OUT-16. Payment/cancel always blocked.
import * as L from './ot-lib.mjs';
const { snap, norm } = L;
const D = n => { const d = new Date(2026, 10, 17 + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const PH = { p: 'Search pickup location', d: n => `Search destination ${n} location`, x: 'Search drop location' };

async function run(rec, label, fn) {
  const s = { label };
  try { Object.assign(s, await fn()); } catch (e) { s.error = String(e).split('\n')[0].slice(0, 300); s.errorShot = await snap(rec.page, `${rec.id}-${label}-error`).catch(() => null); }
  rec.steps.push(s); return s;
}
const fullSearch = async (page, id, tag, F, veh, { det = true, conf = true } = {}) => {
  const f = await L.fill(page, F);
  const formMap = await L.mapInfo(page, null, `${id}-${tag}-form`);
  const formShot = await snap(page, `${id}-${tag}-form`);
  const res = await L.search(page, `${id}-${tag}`);
  const o = { fill: f, formMap, formShot, res };
  if (res.navigated && veh) {
    if (det) o.details = await L.details(page, veh, `${id}-${tag}`);
    if (conf) { const { out } = await L.confirmScreen(page, veh, `${id}-${tag}`); o.confirm = out; await L.closeModal(page); }
  }
  return o;
};
async function myInqDetails(page, id, tag, match) {
  const list = await L.myInquiries(page, `${id}-${tag}`);
  const row = list.parsed.find(match) || list.parsed[0];
  const det = row?.id ? await L.openEdit(page, row.id, `${id}-${tag}-${row.id}`) : null;
  return { listTotal: list.total, top3: list.rows.slice(0, 3), row, details: det };
}

const CASES = {
  'OUT-01': async (page, rec) => {
    await run(rec, 'local-prefill', async () => {
      await L.home(page, 'Local');
      await L.place(page, PH.p, 'Whitefield', 'Whitefield');
      await L.active(page).locator('input[placeholder="Enter number of passengers"]:visible').fill('3');
      await L.active(page).locator('input[placeholder="Enter Number of Hours"]:visible').fill('2');
      return { local: await L.formValues(page) };
    });
    await run(rec, 'outstation-inventory', async () => {
      await page.getByText('Outstation', { exact: true }).first().click(); await page.waitForTimeout(1000);
      const text = norm(await L.active(page).innerText());
      const fields = await L.formValues(page);
      const buttons = (await L.active(page).locator('button:visible').allInnerTexts()).map(norm).filter(Boolean);
      const paxAttr = await L.active(page).locator('input[placeholder="Enter number of passengers"]:visible').evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
      const hours = await L.active(page).locator('input[placeholder="Enter Number of Hours"]:visible').count();
      await L.active(page).locator('input[value^="20"]:visible').first().click(); await page.waitForTimeout(600);
      const picker = await page.evaluate(() => { const p = document.querySelector('.react-datepicker'); const days = [...p.querySelectorAll('.react-datepicker__day:not(.react-datepicker__day--outside-month)')];
        return { month: p.querySelector('.react-datepicker__current-month')?.innerText, disabled: days.filter(d => d.className.includes('disabled')).map(d => d.innerText).join(','), selected: p.querySelector('.react-datepicker__day--selected')?.innerText }; });
      await page.keyboard.press('Escape');
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(600);
      const slots = await page.evaluate(() => { const it = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width); return { n: it.length, first: it[0]?.innerText, last: it.at(-1)?.innerText, disabled: it.filter(e => e.className.includes('disabled')).length }; });
      await page.keyboard.press('Escape');
      const shot = await snap(page, 'OUT-01-form');
      await L.setToggle(page, 'Drop at different location', true);
      const ddFields = (await L.formValues(page)).map(f => f.ph);
      await L.setToggle(page, 'Drop at different location', false);
      const before = (await L.formValues(page)).map(f => f.ph).join('|');
      await L.setToggle(page, 'Multi-day Trip', true);
      const mdText = norm(await L.active(page).innerText()); const mdFields = (await L.formValues(page)).map(f => f.ph).join('|');
      const mdShot = await snap(page, 'OUT-01-multiday-on');
      await L.setToggle(page, 'Multi-day Trip', false);
      return { text: text.slice(0, 600), fields, buttons, paxAttr, hoursFieldOnOutstation: hours, picker, slots, ddFields, mdChanged: before !== mdFields, mdTextDiff: mdText.length - text.length, mdFields, shot, mdShot };
    });
    await run(rec, 'tab-switch', async () => {
      await L.place(page, PH.p, 'Whitefield', 'Whitefield');
      const outBefore = await L.formValues(page);
      await page.getByText('Local', { exact: true }).first().click(); await page.waitForTimeout(900);
      const localAfter = await L.formValues(page);
      await page.getByText('Outstation', { exact: true }).first().click(); await page.waitForTimeout(900);
      return { outBefore, localAfter, outAfter: await L.formValues(page), shot: await snap(page, 'OUT-01-after-tab-switch') };
    });
  },

  'OUT-02': async (page, rec) => {
    const F = { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']], dates: [D(7), D(8)], times: ['9:00 AM', '8:00 PM'], pax: 20 };
    let m;
    await run(rec, 'search', async () => {
      const o = await fullSearch(page, 'OUT-02', 'main', F, 'P28AC', { conf: false });
      const c = await L.confirmScreen(page, 'P28AC', 'OUT-02-main'); m = c.m; o.confirm = c.out; return o;
    });
    await run(rec, 'submit', async () => (m ? { submit: await L.submit(page, m, 'OUT-02-main') } : { skipped: 'no confirm modal' }));
    await run(rec, 'track-my-booking', async () => {
      const b = page.getByText('Track My Booking', { exact: true }).first();
      if (!(await b.isVisible().catch(() => false))) return { visible: false };
      await b.click(); await page.waitForTimeout(3000); return { url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), shot: await snap(page, 'OUT-02-track-my-booking') };
    });
    await run(rec, 'my-inquiries', async () => myInqDetails(page, 'OUT-02', 'post', r => r.type === 'Outstation' && /24 Nov 2026/.test(r.dates || '')));
  },

  'OUT-03': async (page, rec) => {
    await run(rec, 'drop-blank', async () => {
      await L.fill(page, { dd: true, pickup: ['Banashankari', 'Banashankari'], dests: [['Madikeri', 'Madikeri']], dates: [D(10), D(10)], times: ['6:30 AM', '9:30 PM'], pax: 21 });
      return { res: await L.search(page, 'OUT-03-drop-blank') };
    });
    await run(rec, 'map-and-toggle', async () => {
      const ddOn0 = await L.mapInfo(page, null, 'OUT-03-dd-on-nodrop');
      await L.place(page, PH.x, 'Mysuru', 'Mysuru');
      const ddOn = await L.mapInfo(page, null, 'OUT-03-dd-on-mysuru');
      await L.setToggle(page, 'Drop at different location', false); await page.waitForTimeout(1200);
      const ddOff = await L.mapInfo(page, null, 'OUT-03-dd-off');
      await L.setToggle(page, 'Drop at different location', true); await page.waitForTimeout(1200);
      const dropAfter = await L.active(page).locator(`input[placeholder="${PH.x}"]:visible`).inputValue().catch(() => null);
      if (!dropAfter) await L.place(page, PH.x, 'Mysuru', 'Mysuru');
      const ddOn2 = await L.mapInfo(page, null, 'OUT-03-dd-on-again');
      return { ddOn0, ddOn, ddOff, dropAfterReToggle: dropAfter, ddOn2 };
    });
    await run(rec, 'search', async () => {
      const res = await L.search(page, 'OUT-03-main'); const o = { res };
      if (res.navigated) { o.details = await L.details(page, 'P21AC', 'OUT-03-main'); const { out } = await L.confirmScreen(page, 'P21AC', 'OUT-03-main'); o.confirm = out; await L.closeModal(page); }
      return o;
    });
  },

  'OUT-04': async (page, rec) => {
    const mi = t => L.mapInfo(page, null, `OUT-04-${t}`);
    await run(rec, 'build', async () => {
      await L.fill(page, { pickup: ['Jayanagar 4th Block', 'Jayanagar'], dests: [['Mysuru', 'Mysuru']], dates: [D(12), D(14)], times: ['7:00 AM', '7:00 PM'], pax: 30 });
      const m1 = await mi('1-one-dest');
      await L.addDest(page); const empty = await L.search(page, 'OUT-04-empty-dest2');
      await L.place(page, PH.d(2), 'Srirangapatna', 'Srirangapatna'); const m2 = await mi('2-two-dest');
      await L.addDest(page); await L.place(page, PH.d(3), 'Mandya', 'Mandya'); const m3 = await mi('3-three-dest');
      const delBtns = await L.active(page).evaluate(r => [1, 2, 3].map(n => { const i = r.querySelector(`input[placeholder="Search destination ${n} location"]`); if (!i) return null; let p = i.parentElement; for (let k = 0; k < 4 && p; k++, p = p.parentElement) { const b = p.querySelector('button'); if (b) return (b.innerText || b.getAttribute('aria-label') || 'icon-button').trim() || 'icon-button'; } return 'none'; }));
      await L.removeDest(page, 2); const afterDel = await L.formValues(page); const m4 = await mi('4-after-delete');
      const d2 = L.active(page).locator(`input[placeholder="${PH.d(2)}"]:visible`);
      const d2Before = await d2.inputValue().catch(() => null);
      await L.place(page, PH.d(2), 'Srirangapatna', 'Srirangapatna'); const afterChange = await L.formValues(page); const m5 = await mi('5-after-change');
      return { m1, empty, m2, m3, delBtns, afterDel, d2Before, afterChange, m5, m4 };
    });
    await run(rec, 'search-D1', async () => ({ res: await L.search(page, 'OUT-04-D1') }));
    await run(rec, 'modify-add-mandya-D2', async () => {
      const pre = await L.modifyOpen(page, 'OUT-04-D2');
      await L.setToggle(page, 'Multi-day Trip', false); await L.setToggle(page, 'Drop at different location', false);
      await L.place(page, PH.d(1), 'Mysuru', 'Mysuru');
      if (!(await L.active(page).locator(`input[placeholder="${PH.d(2)}"]:visible`).count())) await L.addDest(page);
      await L.place(page, PH.d(2), 'Srirangapatna', 'Srirangapatna');
      await L.addDest(page); await L.place(page, PH.d(3), 'Mandya', 'Mandya');
      const corrected = await L.formValues(page);
      return { prefill: pre, corrected, res: await L.modifySave(page, 'OUT-04-D2') };
    });
    await run(rec, 'modify-remove-mandya-D3', async () => {
      const pre = await L.modifyOpen(page, 'OUT-04-D3');
      await L.setToggle(page, 'Multi-day Trip', false); await L.setToggle(page, 'Drop at different location', false);
      await L.place(page, PH.d(1), 'Mysuru', 'Mysuru');
      if (!(await L.active(page).locator(`input[placeholder="${PH.d(2)}"]:visible`).count())) await L.addDest(page);
      await L.place(page, PH.d(2), 'Srirangapatna', 'Srirangapatna');
      if (await L.active(page).locator(`input[placeholder="${PH.d(3)}"]:visible`).count()) await L.removeDest(page, 3);
      const corrected = await L.formValues(page);
      const res = await L.modifySave(page, 'OUT-04-D3'); const o = { prefill: pre, corrected, res };
      if (res.navigated) { o.map = await L.mapInfo(page, null, 'OUT-04-D3-results'); o.details = await L.details(page, 'D35NA', 'OUT-04-D3'); const { out } = await L.confirmScreen(page, 'D35NA', 'OUT-04-D3'); o.confirm = out; await L.closeModal(page); }
      return o;
    });
  },

  'OUT-05': async (page, rec) => {
    await run(rec, 'five', async () => {
      await L.fill(page, { pickup: ['Koramangala', 'Koramangala'], dests: [['Tumakuru', 'Tumakuru'], ['Chitradurga', 'Chitradurga'], ['Davanagere', 'Davanagere'], ['Hosapete', 'Hosapete'], ['Badami', 'Badami']], dates: [D(20), D(24)], times: ['6:30 AM', '8:00 PM'], pax: 40 });
      return { form: await L.formValues(page), map: await L.mapInfo(page, null, 'OUT-05-five') };
    });
    await run(rec, 'extra-fields', async () => {
      const r = [];
      for (let n = 6; n <= 10; n++) {
        const b = L.active(page).locator('button').filter({ hasText: /Add Another Destination/ }).first();
        if (!(await b.isVisible().catch(() => false))) { r.push({ n, addVisible: false }); break; }
        await b.click(); await page.waitForTimeout(600);
        const has = await L.active(page).locator(`input[placeholder="${PH.d(n)}"]:visible`).count();
        if (has) await L.place(page, PH.d(n), 'Hubballi', 'Hubballi');
        r.push({ n, field: !!has, msgs: (await L.msgs(page)).toasts });
      }
      return { r, map: await L.mapInfo(page, null, 'OUT-05-ten'), shot: await snap(page, 'OUT-05-ten-fields') };
    });
    await run(rec, 'remove-extras-search', async () => {
      for (let n = 10; n >= 6; n--) if (await L.active(page).locator(`input[placeholder="${PH.d(n)}"]:visible`).count()) await L.removeDest(page, n);
      const form = await L.formValues(page); const map = await L.mapInfo(page, null, 'OUT-05-back-to-five');
      const res = await L.search(page, 'OUT-05-main'); const o = { form, map, res };
      if (res.navigated) { o.details = await L.details(page, 'P40AC', 'OUT-05-main'); const { out } = await L.confirmScreen(page, 'P40AC', 'OUT-05-main'); o.confirm = out; await L.closeModal(page); }
      return o;
    });
  },

  'OUT-06': async (page, rec) => {
    await run(rec, 'main', () => fullSearch(page, 'OUT-06', 'main', { dd: true, pickup: ['Domlur', 'Domlur'], dests: [['Hyderabad', 'Hyderabad']], drop: ['Kempegowda International Airport', 'Kempegowda'], dates: [D(15), D(18)], times: ['7:00 AM', '6:00 PM'], pax: 49 }, 'L49NV'));
  },

  'OUT-07': async (page, rec) => {
    const base = { pickup: ['Yelahanka', 'Yelahanka'], dests: [['Hassan', 'Hassan']], pax: 10 };
    for (const [lab, dd, dt, md, det] of [['A', D(22), '8:30 AM', false, true], ['B', D(22), '9:30 AM', false, false], ['C', D(23), '9:30 AM', false, false], ['D-multiday', D(22), '9:30 AM', true, false]])
      await run(rec, lab, () => fullSearch(page, 'OUT-07', lab, { ...base, md, dates: [D(21), dd], times: ['9:00 AM', dt] }, 'L12AC', { det }));
  },

  'OUT-08': async (page, rec) => {
    const base = { pickup: ['Whitefield', 'Whitefield'], dates: [D(25), D(25)], times: ['6:30 AM', '9:30 PM'], pax: 6 };
    for (const [lab, q, pick] of [['A-NandiHills', 'Nandi Hills', 'Nandi'], ['B-Mysuru', 'Mysuru', 'Mysuru'], ['C-Madikeri', 'Madikeri', 'Madikeri']])
      await run(rec, lab, () => fullSearch(page, 'OUT-08', lab, { ...base, dests: [[q, pick]] }, 'P35AC'));
  },

  'OUT-09': async (page, rec) => {
    const base = { pickup: ['Sarjapur Road', 'Sarjapur'], dests: [['Kolar', 'Kolar']], pax: 25 };
    for (const [lab, d1, t1, d2, t2, det] of [['A', 30, '8:00 AM', 30, '9:30 PM', true], ['B', 30, '8:00 AM', 30, '10:30 PM', false], ['C', 30, '11:30 PM', 31, '4:00 AM', false], ['D', 30, '5:30 AM', 30, '6:00 PM', false]])
      await run(rec, lab, () => fullSearch(page, 'OUT-09', lab, { ...base, dates: [D(d1), D(d2)], times: [t1, t2] }, 'D40NA', { det }));
  },

  'OUT-10': async (page, rec) => {
    const base = { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']], pax: 2 };
    await run(rec, '1-untouched', async () => { const f = await L.fill(page, base); return { form: f.form, res: await L.search(page, 'OUT-10-1') }; });
    await run(rec, '2-drop-before-pickup', async () => { await L.fill(page, { ...base, dates: [D(5)], times: ['10:30 AM'] }); const d = await L.setDate(page, 1, D(4)); return { dropPick: d, form: await L.formValues(page), res: await L.search(page, 'OUT-10-2') }; });
    await run(rec, '3-earlier-time', async () => { await L.fill(page, { ...base, dates: [D(5), D(5)], times: ['10:30 AM', '6:30 AM'] }); return { form: await L.formValues(page), res: await L.search(page, 'OUT-10-3') }; });
    await run(rec, '4-equal', async () => { await L.fill(page, { ...base, dates: [D(5), D(5)], times: ['10:30 AM', '10:30 AM'] }); return { form: await L.formValues(page), res: await L.search(page, 'OUT-10-4') }; });
    await run(rec, '5-past-date', async () => {
      await L.fill(page, base); const pick = await L.setDate(page, 0, D(-1));
      const inp = L.active(page).locator('input[value^="20"]:visible').first();
      await inp.click(); await inp.fill(D(-1)); await page.keyboard.press('Enter'); await page.waitForTimeout(500); await page.keyboard.press('Escape');
      return { pickerDisabled: pick.disabled, typedValue: await inp.inputValue(), shot: await snap(page, 'OUT-10-5-past-typed') };
    });
    await run(rec, '6-past-slot', async () => {
      await L.fill(page, base);
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(600);
      const s = await page.evaluate(() => { const it = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width); return { n: it.length, disabled: it.filter(e => e.className.includes('disabled')).length, firstEnabled: it.find(e => !e.className.includes('disabled'))?.innerText }; });
      const before = await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().inputValue();
      await page.locator('.react-datepicker__time-list-item:visible').first().click().catch(() => {}); await page.waitForTimeout(400); await page.keyboard.press('Escape');
      return { slots: s, before, afterClickFirst: await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().inputValue(), shot: await snap(page, 'OUT-10-6-past-slot') };
    });
    await run(rec, '7-idle-default', async () => {
      await L.fill(page, { ...base, dates: [null, D(1)], times: [null, '8:00 PM'] });
      const t0 = await L.formValues(page); await page.waitForTimeout(75000);
      return { formBefore: t0, res: await L.search(page, 'OUT-10-7') };
    });
    await run(rec, '8-pickup-after-drop', async () => {
      await L.fill(page, { ...base, dates: [D(5), D(6)], times: ['9:00 AM', '8:00 PM'] }); const before = await L.formValues(page);
      await L.setDate(page, 0, D(8)); const after = await L.formValues(page);
      return { before, after, res: await L.search(page, 'OUT-10-8') };
    });
    await run(rec, '9-drop-picker-min', async () => {
      await L.fill(page, { ...base, dates: [D(5)], times: ['9:00 AM'] });
      await L.active(page).locator('input[value^="20"]:visible').nth(1).click(); await page.waitForTimeout(600);
      const p = await page.evaluate(() => { const p = document.querySelector('.react-datepicker'); const days = [...p.querySelectorAll('.react-datepicker__day:not(.react-datepicker__day--outside-month)')]; return { month: p.querySelector('.react-datepicker__current-month')?.innerText, firstEnabled: days.find(d => !d.className.includes('disabled'))?.innerText, disabledCount: days.filter(d => d.className.includes('disabled')).length }; });
      const shot = await snap(page, 'OUT-10-9-drop-picker'); await page.keyboard.press('Escape'); return { picker: p, shot };
    });
    await run(rec, '10-earliest-valid', async () => {
      await L.fill(page, base);
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(600);
      const first = page.locator('.react-datepicker__time-list-item:visible:not(.react-datepicker__time-list-item--disabled)').first();
      const pickT = norm(await first.innerText()); await first.click(); await page.waitForTimeout(400);
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').nth(1).click(); await page.waitForTimeout(600);
      const items = page.locator('.react-datepicker__time-list-item:visible');
      const all = (await items.allInnerTexts()).map(norm); const i = all.indexOf(pickT);
      const dropT = all[i + 1]; if (dropT) await items.nth(i + 1).click(); await page.waitForTimeout(400); await page.keyboard.press('Escape');
      return { pickT, dropT, form: await L.formValues(page), res: await L.search(page, 'OUT-10-10') };
    });
  },

  'OUT-11': async (page, rec) => {
    const dt = { dates: [D(5), D(6)], times: ['9:00 AM', '8:00 PM'], pax: 2 };
    await run(rec, '1-blank-pickup', async () => { await L.fill(page, { dests: [['Mysuru', 'Mysuru']], ...dt }); return { res: await L.search(page, 'OUT-11-1') }; });
    await run(rec, '2-blank-dest', async () => { await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], ...dt }); return { res: await L.search(page, 'OUT-11-2') }; });
    await run(rec, '3-dest-eq-pickup', async () => { await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], dests: [['Whitefield', 'Whitefield']], ...dt }); return { res: await L.search(page, 'OUT-11-3') }; });
    await run(rec, '4-free-text', async () => { await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], ...dt }); const v = await L.typeNoPick(page, PH.d(1), 'Xyzabc123'); return { typed: v, res: await L.search(page, 'OUT-11-4') }; });
    await run(rec, '5-toggle-off', async () => {
      await L.fill(page, { dd: true, pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']], drop: ['Mysuru', 'Mysuru'], ...dt });
      await L.setToggle(page, 'Drop at different location', false);
      return { dropFieldVisible: await L.active(page).locator(`input[placeholder="${PH.x}"]:visible`).count(), res: await L.search(page, 'OUT-11-5') };
    });
  },

  'OUT-12': async (page, rec) => {
    const F = { pickup: ['Hebbal', 'Hebbal'], dests: [['Hassan', 'Hassan'], ['Belur', 'Belur'], ['Halebidu', 'Halebidu']], dates: [D(35), D(37)], times: ['7:00 AM', '8:00 PM'] };
    for (const v of ['', '0', '-2', '2.5']) await run(rec, `pax[${v || 'blank'}]`, async () => {
      await L.fill(page, F); const inp = L.active(page).locator('input[placeholder="Enter number of passengers"]:visible');
      await inp.fill(''); if (v) await inp.pressSequentially(v); await page.keyboard.press('Tab'); await page.waitForTimeout(600);
      const fieldValue = await inp.inputValue(); const validity = await inp.evaluate(e => ({ valid: e.validity.valid, msg: e.validationMessage }));
      return { entered: v, fieldValue, validity, res: await L.search(page, `OUT-12-pax-${v || 'blank'}`) };
    });
    await run(rec, 'pax13', async () => {
      await L.fill(page, { ...F, pax: 13 }); const res = await L.search(page, 'OUT-12-pax13');
      const { cards } = await import('../local-cards.mjs');
      const o = { res };
      if (res.navigated) { const { out } = await L.confirmScreen(page, 'D12TT', 'OUT-12-pax13-D12TT'); o.capacity = out; await L.closeModal(page); }
      return o;
    });
    await run(rec, 'pax55', async () => {
      await L.fill(page, { ...F, pax: 55 }); const res = await L.search(page, 'OUT-12-pax55'); const o = { res };
      if (res.navigated) {
        const a = await L.confirmScreen(page, '45LBB', 'OUT-12-pax55-45LBB'); o.first = a.out; await L.closeModal(page);
        const b = await L.confirmScreen(page, 'D12TT', 'OUT-12-pax55-plus-D12TT'); o.second = b.out; await L.closeModal(page);
      }
      return o;
    });
  },

  'OUT-13': async (page, rec) => {
    const base = { dd: true, pickup: ['Thanisandra', 'Thanisandra'], dests: [['Panaji', 'Panaji'], ['Gokarna', 'Gokarna']], drop: ['Mangaluru', 'Mangaluru'], pax: 30, times: ['7:00 AM', '8:00 PM'] };
    for (const [lab, a, b, det] of [['A-cross-month', '2026-11-30', '2026-12-02', false], ['B-cross-year', '2026-12-31', '2027-01-02', false], ['C-31-days', D(40), D(70), true], ['D-far-future', '2028-11-15', '2028-11-17', false]])
      await run(rec, lab, () => fullSearch(page, 'OUT-13', lab, { ...base, dates: [a, b] }, 'L45NV', { det }));
  },

  'OUT-14': async (page, rec) => {
    await run(rec, 'search', () => fullSearch(page, 'OUT-14', 'orig', { dd: true, pickup: ['Electronic City', 'Electronic City'], dests: [['Nandi Hills', 'Nandi'], ['Chikkaballapur', 'Chikkaballapur'], ['Kolar', 'Kolar']], drop: ['Whitefield', 'Whitefield'], dates: [D(40), D(41)], times: ['7:00 AM', '8:00 PM'], pax: 40 }, 'L45P', { det: false, conf: false }));
    await run(rec, 'modify', async () => {
      const pre = await L.modifyOpen(page, 'OUT-14');
      await L.setToggle(page, 'Multi-day Trip', false); await L.setToggle(page, 'Drop at different location', true);
      await L.place(page, PH.d(1), 'Nandi Hills', 'Nandi');
      if (!(await L.active(page).locator(`input[placeholder="${PH.d(2)}"]:visible`).count())) await L.addDest(page);
      await L.place(page, PH.d(2), 'Chikkaballapur', 'Chikkaballapur');
      if (await L.active(page).locator(`input[placeholder="${PH.d(3)}"]:visible`).count()) await L.removeDest(page, 3);
      await L.place(page, PH.x, 'Whitefield', 'Whitefield');
      await L.setDate(page, 1, D(42)); await L.setTime(page, 1, '8:00 PM'); await L.setPax(page, 40);
      const after = await L.formValues(page);
      const res = await L.modifySave(page, 'OUT-14-modified'); const o = { prefill: pre, after, res };
      if (res.navigated) { o.map = await L.mapInfo(page, null, 'OUT-14-modified-results'); o.details = await L.details(page, 'L45P', 'OUT-14-modified'); const { out } = await L.confirmScreen(page, 'L45P', 'OUT-14-modified'); o.confirm = out; await L.closeModal(page); }
      return o;
    });
    await run(rec, 'back-refresh', async () => {
      const u0 = page.url(); await page.goBack(); await page.waitForTimeout(2500); const back = { url: page.url(), shot: await snap(page, 'OUT-14-after-back') };
      await page.goForward().catch(() => {}); await page.waitForTimeout(2500);
      await page.reload(); await page.waitForTimeout(4000);
      const refresh = { url: page.url(), found: norm(await page.locator('text=/Found/').first().innerText().catch(() => '')), body: norm(await page.locator('body').innerText()).slice(0, 300), shot: await snap(page, 'OUT-14-after-refresh') };
      return { u0, back, refresh };
    });
  },

  'OUT-15': async (page, rec) => {
    const F = { dd: true, pickup: ['Marathahalli', 'Marathahalli'], dests: [['Kotilingeshwara Temple Kolar', 'Kotilingeshwara']], drop: ['KR Puram', 'K R Puram'], dates: [D(45), D(45)], times: ['8:00 AM', '8:00 PM'], pax: 4 };
    let res;
    await run(rec, '1-zero-match-filter', async () => {
      await L.fill(page, F); res = await L.search(page, 'OUT-15-main');
      if (!res.navigated) return { res };
      const steps = [];
      const opts = page.locator('input[type=checkbox]:visible, input[type=radio]:visible');
      const n = Math.min(await opts.count(), 12);
      for (let i = 0; i < n; i++) {
        await opts.nth(i).check({ force: true }).catch(() => {}); await page.waitForTimeout(900);
        const found = norm(await page.locator('text=/Found/').first().innerText().catch(() => ''));
        steps.push({ i, found }); if (/^0\b/.test(found)) break;
      }
      const zeroShot = await snap(page, 'OUT-15-filter-state');
      const emptyText = norm(await page.locator('body').innerText()).match(/(No (vehicles|buses|results)[^.]{0,80})/i)?.[0] || null;
      const clr = page.getByText(/Clear Preferences/i).first(); const hasClear = await clr.isVisible().catch(() => false);
      if (hasClear) { await clr.click(); await page.waitForTimeout(1500); }
      return { res, steps, emptyText, zeroShot, hasClear, afterClear: norm(await page.locator('text=/Found/').first().innerText().catch(() => '')) };
    });
    await run(rec, '2-no-availability', async () => ({ skipped: 'Admin-Web no-availability setup not approved (documented as conditional).' }));
    await run(rec, '3-offline-book-now', async () => {
      await L.fill(page, F); await page.context().setOffline(true);
      await L.active(page).getByRole('button', { name: 'Book Now!' }).click(); await page.waitForTimeout(6000);
      const o = { url: page.url(), msgs: await L.msgs(page), body: norm(await page.locator('body').innerText()).slice(0, 400), shot: await snap(page, 'OUT-15-offline-book-now') };
      await page.context().setOffline(false); await page.waitForTimeout(1500); return o;
    });
    let m, before;
    await run(rec, '4-offline-submit', async () => {
      const s = await L.fill(page, F); const r = await L.search(page, 'OUT-15-pre-submit');
      const c = await L.confirmScreen(page, 'D SDN', 'OUT-15-confirm'); m = c.m;
      allowList_push(); await page.context().setOffline(true);
      await m.getByRole('button', { name: /Submit/i }).last().click(); await page.waitForTimeout(6000);
      const visible = (await page.locator('.modal.show, [role=dialog], .Toastify__toast, [role=alert]').allInnerTexts().catch(() => [])).map(norm);
      const shot = await snap(page, 'OUT-15-offline-submit');
      await page.context().setOffline(false); L.allowList.length = 0; await page.waitForTimeout(2500);
      return { res: r, confirm: c.out, offlineMessages: visible.map(L.PII).slice(0, 3), shot };
    });
    await run(rec, '5-count-before', async () => { before = await L.myInquiries(page, 'OUT-15-before'); return { total: before.total, top: before.rows.slice(0, 2) }; });
    await run(rec, '5-double-click-submit', async () => {
      await L.fill(page, F); const r = await L.search(page, 'OUT-15-submit-search');
      const c = await L.confirmScreen(page, 'D SDN', 'OUT-15-submit'); const sub = await L.submit(page, c.m, 'OUT-15-submit', { dbl: true });
      return { distance: r.distance, summary: r.summary, confirm: c.out, submit: sub };
    });
    await run(rec, '6-count-after-and-details', async () => {
      const after = await L.myInquiries(page, 'OUT-15-after');
      const row = after.parsed.find(x => x.type === 'Outstation' && x.dates?.startsWith(`${new Date(2027, 0, 1).getDate()} Jan 2027`)) || after.parsed[0];
      const dup = after.parsed.filter(x => x.type === 'Outstation' && /1 Jan 2027/.test(x.dates || '')).map(x => x.id);
      const det = row?.id ? await L.openEdit(page, row.id, `OUT-15-${row.id}`) : null;
      return { totalBefore: before?.total, totalAfter: after.total, top: after.rows.slice(0, 3), matching: dup, row, details: det };
    });
  },

  'OUT-16': async (page, rec) => {
    L.allowList.push(/draft-inquiry/);
    const F = { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru'], ['Srirangapatna', 'Srirangapatna'], ['Mandya', 'Mandya']], dates: [D(50), D(52)], times: ['7:00 AM', '7:00 PM'], pax: 12 };
    await run(rec, '1-save-draft', async () => {
      await L.fill(page, F); const n0 = L.netLog.length;
      await L.active(page).getByRole('button', { name: /Save As Draft/i }).click(); await page.waitForTimeout(3000);
      const msg = (await page.locator('.modal.show, [role=dialog], .Toastify__toast, [role=alert], .swal2-popup').allInnerTexts().catch(() => [])).map(norm).map(L.PII);
      return { msg, calls: L.netLog.slice(n0), shot: await snap(page, 'OUT-16-saved') };
    });
    await run(rec, '2-reload-restore', async () => {
      await L.home(page, 'Outstation'); await page.waitForTimeout(2000);
      const bodyHasDraft = norm(await page.locator('body').innerText()).match(/draft[^.]{0,120}/i)?.[0] || null;
      return { form: await L.formValues(page), bodyHasDraft, shot: await snap(page, 'OUT-16-after-reload') };
    });
    await run(rec, '3-autosave', async () => {
      const n0 = L.netLog.length; await L.setPax(page, 13); await page.waitForTimeout(3000);
      await page.goto(new URL('/about-us', process.env.USER_WEB_URL).href).catch(() => {}); await page.waitForTimeout(2000);
      await L.home(page, 'Outstation'); await page.waitForTimeout(2000);
      return { calls: L.netLog.slice(n0), form: await L.formValues(page), shot: await snap(page, 'OUT-16-after-return') };
    });
    await run(rec, '4-5-drafts-and-my-inquiries', async () => {
      const list = await L.myInquiries(page, 'OUT-16');
      const dash = norm(await page.locator('body').innerText()).match(/draft[^.]{0,80}/ig) || [];
      return { listTotal: list.total, top: list.rows.slice(0, 3), draftMentions: dash.slice(0, 5), deletion: 'Not performed: no drafts view found / deletion not separately approved' };
    });
    L.allowList.length = 0;
  },

  'OUT-17': async (page, rec) => {
    const F = { md: true, dd: true, pickup: ['Koramangala', 'Koramangala'], dests: [['Chikkamagaluru', 'Chikkamagaluru'], ['Belur', 'Belur']], drop: ['Hassan', 'Hassan'], dates: [D(55), D(57)], times: ['7:00 AM', '7:00 PM'], pax: 14 };
    let m;
    await run(rec, 'search', async () => {
      const f = await L.fill(page, F); const formMap = await L.mapInfo(page, null, 'OUT-17-form'); const formShot = await snap(page, 'OUT-17-form');
      const res = await L.search(page, 'OUT-17-main'); const o = { fill: f, formMap, formShot, res };
      if (res.navigated) { o.details = await L.details(page, 'P16UB', 'OUT-17-main'); const c = await L.confirmScreen(page, 'P16UB', 'OUT-17-main'); m = c.m; o.confirm = c.out; }
      return o;
    });
    await run(rec, 'submit', async () => (m ? { submit: await L.submit(page, m, 'OUT-17-main') } : { skipped: 'no confirm modal' }));
    await run(rec, 'my-inquiries', async () => myInqDetails(page, 'OUT-17', 'post', r => r.type === 'Outstation' && /11 Jan 2027/.test(r.dates || '')));
  },
};
function allowList_push() { L.allowList.push(/save-inquiry/, /draft-inquiry/); }

export default async ({ page }) => {
  const id = process.env.TC; const rec = { id, page, started: new Date().toISOString(), steps: [] };
  await L.guard(page);
  await CASES[id](page, rec);
  delete rec.page; rec.finished = new Date().toISOString(); rec.loads = L.loads; rec.net = L.netLog.filter(l => !/GetViewportInfo|crypto|fcm|popular|explore-fleet/.test(l));
  L.save(id, rec);
  return rec.steps.map(s => ({ label: s.label, err: s.error, nav: s.res?.navigated, val: s.res?.msgs, dist: s.res?.distance, dur: s.res?.duration, total: s.confirm?.total, popup: s.confirm?.popup }));
};
