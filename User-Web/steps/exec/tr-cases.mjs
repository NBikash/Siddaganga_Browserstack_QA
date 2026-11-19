// Transfer P2P (P2P-01 … P2P-11) and With Return (RET-01 … RET-09) execution, workbook v3.2.
//   TC=P2P-02 RUN_ID=... node scripts/run.mjs steps/exec/tr-cases.mjs
// Submissions ONLY in P2P-02 and RET-02 (workbook main paths; approved by the user 18 Nov 2026).
// Everything else stops at the Confirm screen. Network guard (ot-lib): payment/cancel always blocked, other
// mutating calls blocked except /save-inquiry/ during the approved submit.
import * as L from './ot-lib.mjs';
const { snap, norm } = L;
const D = n => { const d = new Date(2026, 10, 18 + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const PH = { f: 'Search pickup location', t: 'Search drop location', rf: 'Search return pickup location', rt: 'Search return drop location' };
const P = { WF: ['Whitefield', 'Whitefield'], KIA: ['Kempegowda International Airport', 'Kempegowda'], BIA: ['Bengaluru International Airport', 'Airport'],
  EC1: ['Electronic City Phase 1', 'Electronic City'], MYS: ['Mysuru', 'Mysuru'], HEB: ['Hebbal', 'Hebbal'], NANDI: ['Nandi Hills', 'Nandi Hills'],
  MG: ['MG Road', 'MG Road'], DOM: ['Domlur', 'Domlur'], KOR: ['Koramangala', 'Koramangala'], HSR: ['HSR Layout', 'HSR Layout'],
  RAJ: ['Rajajinagar', 'Rajajinagar'], HUB: ['Hubballi', 'Hubballi'], KOCHI: ['Kochi', 'Kochi'], JAY: ['Jayanagar', 'Jayanagar'], DEL: ['Delhi', 'Delhi'],
  YEL: ['Yelahanka', 'Yelahanka'], HAS: ['Hassan', 'Hassan'], MAR: ['Marathahalli', 'Marathahalli'], MAN: ['Mangaluru', 'Mangaluru'], UDU: ['Udupi', 'Udupi'],
  JAY4: ['Jayanagar 4th Block', '4th Block'], CHIK: ['Chikkaballapur', 'Chikkaballapur'], BEL: ['Belagavi', 'Belagavi'], CHE: ['Chennai', 'Chennai'],
  KRP: ['KR Puram', 'Puram'], MAL: ['Malleshwaram', 'Malleshwaram'], COORG: ['Coorg Madikeri', 'Madikeri'] };

async function run(rec, label, fn) {
  // ONLY=<regex>: rerun just the matching steps (saved as <TC>-rerun.json, the original result is kept).
  if (process.env.ONLY && !new RegExp(process.env.ONLY).test(label)) return {};
  const s = { label };
  try { Object.assign(s, await fn()); } catch (e) { s.error = String(e).split('\n')[0].slice(0, 300); s.errorShot = await snap(rec.page, `${rec.id}-${label}-error`).catch(() => null); }
  rec.steps.push(s); return s;
}
const ret = (page, on) => L.setToggle(page, 'Add Return', on);
const swap = async page => { await L.active(page).locator('.swap-icon-link:visible').first().click(); await page.waitForTimeout(900); };
const state = async page => {
  const f = await L.formValues(page); const v = ph => f.find(x => x.ph === ph)?.v ?? null;
  const dt = f.filter(x => x.ph === 'text').map(x => x.v);
  return { from: v(PH.f), to: v(PH.t), rfrom: v(PH.rf), rto: v(PH.rt), ret: f.find(x => x.ph === 'checkbox')?.v ?? null, dt, pax: v('Enter number of passengers') };
};
// F = { ret, from, to, rfrom, rto, d:[pd,dd,rpd,rdd], t:[pt,dt,rpt,rdt], pax }
async function fill(page, F, { goHome = true } = {}) {
  if (goHome) { await L.home(page, 'Transfer'); await page.locator('#home-transfer-tabs-tab-point').click().catch(() => {}); await page.waitForTimeout(700); }
  const r = { places: [], dates: [] };
  if (F.ret != null) r.ret = await ret(page, F.ret);
  for (const [k, ph] of [['from', PH.f], ['to', PH.t], ['rfrom', PH.rf], ['rto', PH.rt]]) if (F[k]) r.places.push(await L.place(page, ph, ...F[k]));
  for (let i = 0; i < 4; i++) {
    if (F.d?.[i]) r.dates.push(await L.setDate(page, i, F.d[i]));
    if (F.t?.[i]) r.dates.push(await L.setTime(page, i, F.t[i]));
  }
  if (F.pax != null) await L.setPax(page, F.pax);
  await page.waitForTimeout(700);
  r.state = await state(page);
  return r;
}
async function results(page, tag) {
  const res = await L.search(page, tag);
  if (res.navigated) {
    const body = norm(await page.locator('body').innerText());
    res.header = body.match(/(Multi-leg-Transfer|Transfer)\s*[–-]\s*[<>]?\s*[\d.]+\s*KM/i)?.[0] || body.match(/(Multi-leg-Transfer|Transfer)[^\n]{0,30}/)?.[0];
    res.band = res.summary?.match(/[<>]\s*30\s*KM/)?.[0] || res.header?.match(/[<>]\s*30\s*KM/)?.[0] || null;
    res.durationTxt = res.summary?.match(/Duration\s*:\s*([^:]+?)(?= Passengers| Pickup| Drop| Distance|$)/)?.[1] || null;
  }
  return res;
}
// Round trip = multi-leg flow: 'Book This Vehicle' on Leg 1 marks "Leg 1 ✓" and opens Leg 2 (return) results;
// the Confirm pop-up appears only after a vehicle is chosen for Leg 2. code2 = vehicle for Leg 2 (default: same).
async function confirm(page, code, tag, keep = false, code2 = code) {
  let c, leg2 = null;
  try { c = await L.confirmScreen(page, code, tag); }
  catch (e) {
    const body = norm(await page.locator('body').innerText());
    if (!/Leg 2/.test(body)) throw e;
    const sum = body.match(/You have Searched For(.{0,700}?)(?:Vehicle Preferences|Modify Inquiry)/)?.[1];
    leg2 = { summary: L.PII(norm(sum || '')).slice(0, 600), legTabs: (await page.locator('button, a').filter({ hasText: /^Leg \d/ }).allInnerTexts()).map(norm), shot: await snap(page, `${tag}-leg2-results`) };
    leg2.details = await L.details(page, code2, `${tag}-leg2`).catch(x => ({ error: String(x).slice(0, 200) }));
    c = await L.confirmScreen(page, code2, `${tag}-leg2`);
  }
  if (leg2) c.out.leg2 = leg2;
  // Confirm pop-up of a round trip has Leg 1 / Leg 2 tabs; the cost block shows only the active leg. Read Leg 2 too.
  const tab2 = c.m.getByRole('button', { name: /^Leg 2$/ }).first();
  if (await tab2.isVisible().catch(() => false)) {
    await tab2.click(); await page.waitForTimeout(1500);
    const T = L.PII(norm(await c.m.innerText()));
    const cost = [...(T.match(/Estimated Trip Cost\s*:(.*?)Confirm & Submit/)?.[1] || '').matchAll(/([A-Za-z][A-Za-z &]+?)\s*(₹[\d,]+)/g)].map(x => [x[1].trim(), x[2]]);
    c.out.confirmLeg2 = { dates: T.match(/Dates\s+(.+?)\s+Passenger/)?.[1] || null, pickup: T.match(/Pickup Location\s+(.+?)\s+Dropoff Location/)?.[1] || null,
      dropoff: T.match(/Dropoff Location\s+(.+?)\s+Back to Garage/)?.[1] || null, cost, shot: await snap(page, `${tag}-confirm-leg2-tab`) };
    await c.m.getByText('Estimated Grand Total', { exact: false }).last().evaluate(el => el.scrollIntoView({ block: 'end' })).catch(() => {});
    c.out.confirmLeg2.shotCost = await snap(page, `${tag}-confirm-leg2-tab-cost`);
    await c.m.getByRole('button', { name: /^Leg 1$/ }).first().click().catch(() => {}); await page.waitForTimeout(800);
  }
  c.out.text = L.PII(norm(await c.m.innerText())).slice(0, 2500);
  if (!keep) await L.closeModal(page);
  return c;
}
const searchDet = async (page, id, tag, F, veh, { det = true, conf = true } = {}) => {
  const f = await fill(page, F); const formShot = await snap(page, `${id}-${tag}-form`);
  const res = await results(page, `${id}-${tag}`); const o = { fill: f, formShot, res };
  if (res.navigated && veh) {
    if (det) o.details = await L.details(page, veh, `${id}-${tag}`).catch(e => ({ error: String(e).slice(0, 200) }));
    if (conf) o.confirm = (await confirm(page, veh, `${id}-${tag}`).catch(e => ({ out: { error: String(e).slice(0, 200) } }))).out;
  }
  return o;
};
async function myInqDetails(page, id, tag, match) {
  const list = await L.myInquiries(page, `${id}-${tag}`);
  const row = list.parsed.find(match) || list.parsed[0];
  let quotation = null, det = null;
  if (row?.id) {
    det = await L.openEdit(page, row.id, `${id}-${tag}-${row.id}`).catch(e => ({ error: String(e).slice(0, 200) }));
    await L.myInquiries(page, null).catch(() => {});
    quotation = await L.openQuotation(page, row.id, `${id}-${tag}-${row.id}`).catch(e => ({ error: String(e).slice(0, 200) }));
  }
  return { listTotal: list.total, top3: list.rows.slice(0, 3), row, details: det, quotation };
}
async function trySubmit(page, rec, id, veh) {
  const s = await run(rec, 'confirm-for-submit', async () => { const c = await confirm(page, veh, `${id}-main`, true); rec._m = c.m; return { confirm: c.out }; });
  await run(rec, 'submit', async () => (rec._m ? { submit: await L.submit(page, rec._m, `${id}-main`) } : { skipped: 'no confirm modal' }));
  delete rec._m; return s;
}

const CASES = {
  // ---------------------------------------------------------------- P2P
  'P2P-01': async (page, rec) => {
    await run(rec, '1-2-inventory', async () => {
      await L.home(page, 'Transfer');
      const ctl = await L.active(page).evaluate(root => [...root.querySelectorAll('input,button,a.nav-link,label')].filter(e => e.getBoundingClientRect().width)
        .map(e => `${e.tagName}${e.type ? ':' + e.type : ''} ${e.placeholder || (e.innerText || '').trim() || e.value || e.className}`.slice(0, 70)));
      const pax = await L.active(page).locator('input[placeholder="Enter number of passengers"]:visible').evaluate(e => ({ min: e.min, max: e.max, v: e.value, required: e.required }));
      await L.active(page).locator('input[value^="20"]:visible').first().click(); await page.waitForTimeout(500);
      const picker = await page.evaluate(() => { const p = document.querySelector('.react-datepicker'); const d = [...p.querySelectorAll('.react-datepicker__day:not(.react-datepicker__day--outside-month)')];
        return { month: p.querySelector('.react-datepicker__current-month')?.innerText, disabled: d.filter(x => x.className.includes('disabled')).map(x => x.innerText).join(',') }; });
      await page.keyboard.press('Escape');
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(500);
      const slots = await page.evaluate(() => { const it = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width); return { n: it.length, first: it[0]?.innerText, second: it[1]?.innerText, disabled: it.filter(e => e.className.includes('disabled')).length }; });
      await page.keyboard.press('Escape');
      return { ctl, pax, picker, slots, state: await state(page), shot: await snap(page, 'P2P-01-form') };
    });
    await run(rec, '3-4-switching', async () => {
      const f = await fill(page, { from: P.WF, to: P.KIA, pax: 5 });
      await page.locator('#home-transfer-tabs-tab-hour').click(); await page.waitForTimeout(1000);
      const byHour = await L.formValues(page); const s1 = await snap(page, 'P2P-01-by-hour');
      await page.locator('#home-transfer-tabs-tab-point').click(); await page.waitForTimeout(1000);
      const back1 = await state(page);
      await page.locator('a.nav-link').getByText('Outstation', { exact: true }).first().click(); await page.waitForTimeout(1200);
      const out = await L.formValues(page);
      await page.locator('a.nav-link').getByText('Transfer', { exact: true }).first().click(); await page.waitForTimeout(1200);
      await page.locator('#home-transfer-tabs-tab-point').click().catch(() => {}); await page.waitForTimeout(800);
      const back2 = await state(page);
      return { filled: f.state, byHour, back1, outstation: out, back2, shot: s1, shot2: await snap(page, 'P2P-01-after-switch') };
    });
  },
  'P2P-02': async (page, rec) => {
    const F = { from: P.WF, to: P.KIA, d: [D(7)], t: ['10:00 AM'], pax: 9 };
    await run(rec, 'search', async () => { const f = await fill(page, F); const formShot = await snap(page, 'P2P-02-form'); const res = await results(page, 'P2P-02-main');
      const det = res.navigated ? await L.details(page, 'L9UB', 'P2P-02-main') : null; return { fill: f, formShot, res, details: det }; });
    await trySubmit(page, rec, 'P2P-02', 'L9UB');
    await run(rec, 'my-inquiries', async () => myInqDetails(page, 'P2P-02', 'post', r => /Whitefield|Kempegowda/i.test(r.route || r.raw || '') && /25 Nov 2026/.test(r.dates || r.raw || '')));
  },
  'P2P-03': async (page, rec) => {
    const runs = { A: [P.MG, P.DOM], B: [P.KOR, P.HSR], C: [P.HEB, P.NANDI], D: [P.WF, P.KIA], E: [P.WF, P.WF] };
    for (const [k, [a, b]] of Object.entries(runs)) await run(rec, `run-${k}`, () => searchDet(page, 'P2P-03', k, { from: a, to: b, d: [D(8)], t: ['11:00 AM'], pax: 1 }, 'D MPV'));
  },
  'P2P-04': async (page, rec) => {
    const base = { d: [D(10)], t: ['6:00 AM'], pax: 30 };
    await run(rec, 'run-A', () => searchDet(page, 'P2P-04', 'A', { ...base, from: P.RAJ, to: P.HUB }, 'L45V'));
    await run(rec, 'run-B', () => searchDet(page, 'P2P-04', 'B', { ...base, from: P.DOM, to: P.KOCHI }, 'L45V'));
    await run(rec, 'run-C-infeasible', () => searchDet(page, 'P2P-04', 'C1', { ...base, from: P.JAY, to: P.DEL, d: [D(10), D(10)], t: ['6:00 AM', '10:00 AM'] }, 'L45V'));
    await run(rec, 'run-C-feasible', () => searchDet(page, 'P2P-04', 'C2', { ...base, from: P.JAY, to: P.DEL, d: [D(10), D(12)], t: ['6:00 AM', '6:00 AM'] }, 'L45V', { det: false }));
  },
  'P2P-05': async (page, rec) => {
    const runs = { A: [D(9), '2:00 PM', D(9), '5:00 PM'], B: [D(9), '8:30 PM', D(9), '11:30 PM'], C: [D(9), '11:30 PM', D(10), '2:30 AM'], D: [D(9), '5:30 AM', D(9), '8:30 AM'] };
    for (const [k, [pd, pt, dd, dt]] of Object.entries(runs))
      await run(rec, `run-${k}`, () => searchDet(page, 'P2P-05', k, { from: P.EC1, to: P.MYS, d: [pd, dd], t: [pt, dt], pax: 20 }, 'P25AC', { det: k === 'A' || k === 'C' }));
  },
  'P2P-06': async (page, rec) => {
    await run(rec, '1-blank-from', async () => { await fill(page, { to: P.WF }); return { res: await results(page, 'P2P-06-1') }; });
    await run(rec, '2-blank-to', async () => { await fill(page, { from: P.WF }); return { res: await results(page, 'P2P-06-2') }; });
    await run(rec, '3-from-eq-to', async () => { const f = await fill(page, { from: P.WF, to: P.WF }); return { state: f.state, res: await results(page, 'P2P-06-3') }; });
    await run(rec, '4-unresolved', async () => { await fill(page, { from: P.WF }); const v = await L.typeNoPick(page, PH.t, 'Xyzabc123'); return { typed: v, res: await results(page, 'P2P-06-4') }; });
  },
  'P2P-07': async (page, rec) => {
    const base = { from: P.HEB, to: P.NANDI, pax: 2 };
    await run(rec, '1-past-date', async () => {
      await fill(page, base);
      const r = await L.setDate(page, 0, D(-1));
      const inp = L.active(page).locator('input[value^="20"]:visible').first();
      await inp.fill('2026-11-17').catch(() => {}); await page.keyboard.press('Tab'); await page.waitForTimeout(600);
      return { pickerDay: r, afterType: await inp.inputValue(), res: await results(page, 'P2P-07-1') };
    });
    await run(rec, '2-today-past-slot', async () => {
      await fill(page, base);
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(500);
      const slots = await page.evaluate(() => { const it = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width); const dis = it.filter(e => e.className.includes('disabled')); return { n: it.length, disabled: dis.length, lastDisabled: dis.at(-1)?.innerText, firstEnabled: it.find(e => !e.className.includes('disabled'))?.innerText }; });
      const r = await L.setTime(page, 0, '9:00 AM');
      return { slots, tried: r, state: await state(page), shot: await snap(page, 'P2P-07-2-slots') };
    });
    const sameDay = async (label, dd, dt) => run(rec, label, async () => {
      const f = await fill(page, { ...base, d: [D(5), dd], t: ['10:00 AM', dt] });
      return { set: f.dates, state: f.state, res: await results(page, `P2P-07-${label}`) };
    });
    await run(rec, '3-drop-date-before-pickup', async () => {
      await fill(page, { ...base, d: [D(5)], t: ['10:00 AM'] });
      const r = await L.setDate(page, 1, D(4));
      return { pickerDay: r, state: await state(page), res: await results(page, 'P2P-07-3') };
    });
    await sameDay('4-same-day-earlier', D(5), '9:30 AM');
    await sameDay('5-same-day-equal', D(5), '10:00 AM');
    await sameDay('6a-same-day-later', D(5), '10:30 AM');
    await sameDay('6b-same-day-default', D(5), '12:00 PM');
    await sameDay('7-next-day-earlier-clock', D(6), '8:00 AM');
    await run(rec, '8-pickup-after-drop', async () => {
      await fill(page, { ...base, d: [D(5), D(6)], t: ['10:00 AM', '12:00 PM'] });
      const before = await state(page); await L.setDate(page, 0, D(7)); await page.waitForTimeout(600);
      const after = await state(page);
      return { before, after, res: await results(page, 'P2P-07-8') };
    });
    await run(rec, '9-idle', async () => ({ skipped: 'Not executed: requires leaving the form idle until the default time slot has passed (up to 30 min); covered by the same component in OUT-10 run 9.' }));
    await run(rec, '10-far-future', async () => { const f = await fill(page, { ...base, d: ['2028-11-15', '2028-11-15'], t: ['10:00 AM', '12:00 PM'] }); return { set: f.dates, res: await results(page, 'P2P-07-10') }; });
  },
  'P2P-08': async (page, rec) => {
    const base = { from: P.YEL, to: P.HAS, d: [D(11)], t: ['8:00 AM'] };
    await run(rec, '1-pax20-D49NA', () => searchDet(page, 'P2P-08', 'pax20', { ...base, pax: 20 }, 'D49NA', { det: false }));
    for (const n of [21, 49]) await run(rec, `2-pax${n}`, async () => {
      const f = await fill(page, { ...base, pax: n });
      const inp = L.active(page).locator('input[placeholder="Enter number of passengers"]:visible');
      await inp.press('Tab'); await page.waitForTimeout(500);
      const attr = await inp.evaluate(e => ({ v: e.value, max: e.max, valid: e.validity.valid, msg: e.validationMessage }));
      return { attr, fillState: f.state, res: await results(page, `P2P-08-pax${n}`) };
    });
    await run(rec, '3-pax1-SUV', () => searchDet(page, 'P2P-08', 'pax1', { ...base, pax: 1 }, 'LSUV', { det: false }));
    await run(rec, '4-pax15-multi', async () => {
      const f = await fill(page, { ...base, pax: 15 }); const res = await results(page, 'P2P-08-pax15');
      const first = res.navigated ? (await confirm(page, 'D MPV', 'P2P-08-pax15-DMPV')).out : null;
      const second = res.navigated ? (await confirm(page, 'L9UB', 'P2P-08-pax15-plus-L9UB')).out : null;
      return { state: f.state, res, first, second };
    });
  },
  'P2P-09': async (page, rec) => {
    const F = { from: P.MAR, to: P.MAN, d: [D(12)], t: ['9:00 AM'], pax: 10 };
    await run(rec, '1-swap', async () => {
      const f = await fill(page, F); const before = f.state; await swap(page); const swapped = await state(page); const s1 = await snap(page, 'P2P-09-swapped');
      await swap(page); const back = await state(page); return { before, swapped, back, shot: s1 };
    });
    await run(rec, '2-search', async () => { const res = await results(page, 'P2P-09-first'); return { res, card: res.page1?.find(c => / P16UB /.test(` ${c} `)) }; });
    await run(rec, '3-modify', async () => {
      const pre = await L.modifyOpen(page, 'P2P-09');
      const pl = await L.place(page, PH.t, ...P.UDU);
      const res = await L.modifySave(page, 'P2P-09-modified');
      return { pre, change: pl, res };
    });
    await run(rec, '4-new-route', async () => {
      const det = await L.details(page, 'P16UB', 'P2P-09-modified').catch(e => ({ error: String(e).slice(0, 200) }));
      const c = await confirm(page, 'P16UB', 'P2P-09-modified').catch(e => ({ out: { error: String(e).slice(0, 200) } }));
      return { details: det, confirm: c.out, summary: norm(await page.locator('body').innerText()).match(/You have Searched For.{0,400}/)?.[0] };
    });
  },
  'P2P-10': async (page, rec) => {
    const F = { from: P.JAY4, to: P.CHIK, d: [D(9), D(9)], t: ['2:00 PM', '6:00 PM'], pax: 6 };
    await run(rec, '1-4-swap', async () => {
      const f = await fill(page, F); const s1 = f.state; const sh1 = await snap(page, 'P2P-10-1-filled');
      await swap(page); const s2 = await state(page); const sh2 = await snap(page, 'P2P-10-2-swapped');
      await swap(page); const s4 = await state(page);
      return { s1, s2, s4, shots: [sh1, sh2] };
    });
    await run(rec, '5-swapped-search', async () => { await swap(page); const st = await state(page); return { st, res: await results(page, 'P2P-10-5') }; });
    await run(rec, '6-empty-field-swap', async () => {
      await fill(page, { from: P.JAY4, to: P.CHIK, d: [D(9), D(9)], t: ['2:00 PM', '6:00 PM'], pax: 6 });
      await L.clearPlace(page, PH.t); const cleared = await state(page);
      const btn = L.active(page).locator('.swap-icon-link:visible').first();
      const disabled = await btn.isDisabled().catch(() => null);
      await swap(page); const after = await state(page);
      return { where: 'home form (Modify pop-up not used: the empty-field behaviour is the same control)', cleared, swapDisabled: disabled, after, res: await results(page, 'P2P-10-6') };
    });
  },
  'P2P-11': async (page, rec) => {
    const runs = { A: [P.WF, P.KIA], B: [P.BEL, P.WF], C: [P.CHE, P.BIA], D: [P.KOCHI, P.MYS], E: [P.MAL, P.CHE] };
    for (const [k, [a, b]] of Object.entries(runs)) await run(rec, `transfer-${k}`, async () => {
      const f = await fill(page, { from: a, to: b, d: [D(10)], t: ['9:00 AM'], pax: 4 });
      return { places: f.places, res: await results(page, `P2P-11-${k}`) };
    });
    for (const q of [P.WF, P.MYS, P.BEL, P.CHE, P.KOCHI]) await run(rec, `local-${q[0]}`, async () => {
      await L.home(page, 'Local');
      const pl = await L.place(page, PH.f, ...q);
      await L.active(page).locator('input[placeholder="Enter Number of Hours"]:visible').fill('4').catch(() => {});
      await L.setPax(page, 4);
      const res = await L.search(page, `P2P-11-local-${q[0]}`);
      return { place: pl, res: { navigated: res.navigated, msgs: res.msgs, found: res.found, summary: res.summary?.slice(0, 300), shot: res.shot } };
    });
  },
  // ---------------------------------------------------------------- RETURN
  'RET-01': async (page, rec) => {
    await run(rec, '1-tick', async () => {
      const f = await fill(page, { from: P.WF, to: P.KIA, d: [D(5)], t: ['8:00 AM'], pax: 6 });
      const r = await ret(page, true); await page.waitForTimeout(900);
      return { outward: f.state, ret: r, afterTick: await state(page), fields: (await L.formValues(page)).map(x => x.ph), shot: await snap(page, 'RET-01-1-ticked') };
    });
    await run(rec, '2-untick-retick', async () => {
      await ret(page, false); const off = await state(page); const s = await snap(page, 'RET-01-2-unticked');
      await ret(page, true); const on = await state(page); return { off, on, shot: s };
    });
    await run(rec, '3-fill-untick-search', async () => {
      await L.place(page, PH.rf, ...P.KIA); await L.place(page, PH.rt, ...P.WF);
      await L.setDate(page, 2, D(5)); await L.setTime(page, 2, '8:00 PM'); await L.setDate(page, 3, D(5)); await L.setTime(page, 3, '10:00 PM');
      const filled = await state(page); await ret(page, false); const off = await state(page);
      return { filled, off, res: await results(page, 'RET-01-3') };
    });
  },
  'RET-02': async (page, rec) => {
    const F = { ret: true, from: P.EC1, to: P.MYS, rfrom: P.MYS, rto: P.EC1, d: [D(9), D(9), D(11), D(11)], t: ['8:00 AM', '11:00 AM', '4:00 PM', '7:00 PM'], pax: 35 };
    await run(rec, 'search', async () => { const f = await fill(page, F); const formShot = await snap(page, 'RET-02-form'); const res = await results(page, 'RET-02-main');
      const det = res.navigated ? await L.details(page, 'P35AC', 'RET-02-main') : null; return { fill: f, formShot, res, details: det }; });
    await trySubmit(page, rec, 'RET-02', 'P35AC');
    await run(rec, 'my-inquiries', async () => myInqDetails(page, 'RET-02', 'post', r => /Electronic|Mysuru/i.test(r.route || r.raw || '') && /27 Nov 2026/.test(r.dates || r.raw || '')));
  },
  'RET-03': async (page, rec) => {
    const base = { ret: true, from: P.HEB, to: P.NANDI, rfrom: P.NANDI, rto: P.HEB, pax: 8 };
    const runs = {
      A: [[D(6), D(6), D(6), D(6)], ['7:00 AM', '9:00 AM', '6:00 PM', '8:00 PM'], true],
      B: [[D(6), D(6), D(6), D(6)], ['7:00 AM', '9:00 AM', '9:00 AM', '11:00 AM']],
      C: [[D(6), D(6), D(6), D(6)], ['7:00 AM', '9:00 AM', '8:30 AM', '10:30 AM']],
      D: [[D(6), D(6), D(5), D(5)], ['7:00 AM', '9:00 AM', '6:00 PM', '8:00 PM']],
      E: [[D(6), D(6), D(36), D(36)], ['7:00 AM', '9:00 AM', '6:00 PM', '8:00 PM'], true],
      G: [[D(6), D(6), D(7), D(7)], ['7:00 AM', '9:00 AM', '8:00 AM', '10:00 AM']],
    };
    for (const [k, [d, t, full]] of Object.entries(runs)) await run(rec, `run-${k}`, async () => {
      const f = await fill(page, { ...base, d, t }); const o = { set: f.dates, state: f.state, res: await results(page, `RET-03-${k}`) };
      if (full && o.res.navigated) { o.details = await L.details(page, 'L45P', `RET-03-${k}`).catch(e => ({ error: String(e).slice(0, 200) })); o.confirm = (await confirm(page, 'L45P', `RET-03-${k}`).catch(e => ({ out: { error: String(e).slice(0, 200) } }))).out; }
      return o;
    });
    await run(rec, 'run-F', async () => {
      await L.home(page, 'Transfer'); await ret(page, true);
      const defaults = await state(page);
      for (const [k, ph] of [['from', PH.f], ['to', PH.t], ['rfrom', PH.rf], ['rto', PH.rt]]) await L.place(page, ph, ...base[k]);
      await L.setDate(page, 0, D(8)); await L.setTime(page, 0, '7:00 AM'); await L.setPax(page, 8);
      const st = await state(page); return { defaults, state: st, res: await results(page, 'RET-03-F') };
    });
  },
  'RET-04': async (page, rec) => {
    const dt = { d: [D(14), null, D(16), D(16)], t: ['6:30 AM', null, '9:00 AM', '12:00 PM'], pax: 40 };
    await run(rec, 'A', async () => {
      const f = await fill(page, { ret: true, from: P.KRP, to: P.BEL, rfrom: P.BEL, rto: P.WF, ...dt });
      const res = await results(page, 'RET-04-A'); const o = { state: f.state, res };
      if (res.navigated) o.modify = await L.modifyOpen(page, 'RET-04-A').catch(e => ({ error: String(e).slice(0, 200) }));
      await L.closeModal(page).catch(() => {}); return o;
    });
    await run(rec, 'B', () => searchDet(page, 'RET-04', 'B', { ret: true, from: P.MAL, to: P.CHE, rfrom: P.CHE, rto: P.BIA, ...dt }, '45LBB'));
  },
  'RET-05': async (page, rec) => {
    await run(rec, 'baseline-one-way', () => searchDet(page, 'RET-05', 'base', { from: P.MG, to: P.DOM, d: [D(8)], t: ['10:00 AM'], pax: 2 }, 'D SDN'));
    await run(rec, 'round-trip', () => searchDet(page, 'RET-05', 'rt', { ret: true, from: P.MG, to: P.DOM, rfrom: P.DOM, rto: P.KIA, d: [D(8), D(8), D(8), D(8)], t: ['10:00 AM', '12:00 PM', '4:00 PM', '6:00 PM'], pax: 2 }, 'D SDN'));
  },
  'RET-06': async (page, rec) => {
    const b = { ret: true, from: P.JAY4, to: P.CHIK, rfrom: P.CHIK, rto: P.JAY4, pax: 12 };
    await run(rec, 'A', () => searchDet(page, 'RET-06', 'A', { ...b, d: [D(13), D(13), D(13), D(13)], t: ['9:00 AM', '11:00 AM', '6:00 PM', '8:00 PM'] }, 'D12TT'));
    await run(rec, 'B', () => searchDet(page, 'RET-06', 'B', { ...b, d: [D(13), D(13), D(13), D(14)], t: ['9:00 AM', '11:00 AM', '10:30 PM', '12:30 AM'] }, 'D12TT'));
  },
  'RET-07': async (page, rec) => {
    const b = { ret: true, from: P.MAR, to: P.MAN, rfrom: P.MAN, rto: P.MAR, d: [D(10), null, D(12), D(12)], t: ['8:00 AM', null, '8:00 AM', '11:00 AM'], pax: 5 };
    await run(rec, '1-blank-return-from', async () => { await fill(page, b); await L.clearPlace(page, PH.rf); return { state: await state(page), res: await results(page, 'RET-07-1') }; });
    await run(rec, '2-blank-return-to', async () => { await fill(page, b); await L.clearPlace(page, PH.rt); return { state: await state(page), res: await results(page, 'RET-07-2') }; });
    await run(rec, '3-return-from-eq-to', async () => { await fill(page, { ...b, rto: P.MAN }); return { state: await state(page), res: await results(page, 'RET-07-3') }; });
    await run(rec, '4-clear-return-date', async () => {
      await fill(page, b); const inp = L.active(page).locator('input[value^="20"]:visible').nth(2);
      await inp.fill('').catch(() => {}); await page.keyboard.press('Tab'); await page.waitForTimeout(500);
      return { value: await inp.inputValue().catch(() => null), res: await results(page, 'RET-07-4') };
    });
    await run(rec, '5-untick', async () => { await fill(page, b); await L.clearPlace(page, PH.rf); await ret(page, false); return { state: await state(page), res: await results(page, 'RET-07-5') }; });
  },
  'RET-08': async (page, rec) => {
    await run(rec, 'multi-vehicle', async () => {
      const f = await fill(page, { ret: true, from: P.YEL, to: P.HAS, rfrom: P.HAS, rto: P.YEL, d: [D(20), null, D(22), D(22)], t: ['7:00 AM', null, '6:00 PM', '9:00 PM'], pax: 20 });
      const res = await results(page, 'RET-08'); if (!res.navigated) return { state: f.state, res };
      const first = (await confirm(page, 'D12TT', 'RET-08-D12TT')).out; const second = (await confirm(page, 'L9UB', 'RET-08-plus-L9UB')).out;
      return { state: f.state, res, first, second };
    });
  },
  'RET-09': async (page, rec) => {
    await run(rec, '1-tick', async () => {
      const f = await fill(page, { from: P.HSR, to: P.COORG, d: [D(15)], t: ['7:00 AM'], pax: 10 });
      await ret(page, true); await page.waitForTimeout(1000); return { outward: f.state, afterTick: await state(page), shot: await snap(page, 'RET-09-1') };
    });
    await run(rec, '2-change-outward', async () => {
      await L.place(page, PH.t, ...P.HUB); await page.waitForTimeout(800); const a = await state(page);
      await L.place(page, PH.f, ...P.RAJ); await page.waitForTimeout(800); const b = await state(page);
      return { afterTo: a, afterFrom: b, shot: await snap(page, 'RET-09-2') };
    });
    await run(rec, '3-swap', async () => { await swap(page); const s = await state(page); const sh = await snap(page, 'RET-09-3'); await swap(page); return { swapped: s, back: await state(page), shot: sh }; });
    await run(rec, '4-untick-change-retick', async () => {
      await ret(page, false); await L.place(page, PH.t, ...P.COORG); await ret(page, true); await page.waitForTimeout(1000);
      return { state: await state(page), shot: await snap(page, 'RET-09-4') };
    });
    await run(rec, '5-return-dates', async () => {
      await L.setDate(page, 2, D(17)); await L.setTime(page, 2, '4:00 PM'); const set = await state(page);
      await ret(page, false); await ret(page, true); await page.waitForTimeout(800); return { set, after: await state(page) };
    });
    await run(rec, '6-manual-return-edit', async () => {
      await L.place(page, PH.rt, ...P.WF); const manual = await state(page);
      await L.place(page, PH.f, ...P.HSR); await page.waitForTimeout(800); return { manual, afterOutwardChange: await state(page), shot: await snap(page, 'RET-09-6') };
    });
    await run(rec, '7-search-then-untick', async () => {
      const st = await state(page); const res = await results(page, 'RET-09-7a'); const o = { st, res };
      if (res.navigated) {
        o.modify = await L.modifyOpen(page, 'RET-09').catch(e => ({ error: String(e).slice(0, 200) }));
        if (!o.modify.error) { o.untick = await ret(page, false).catch(() => null); o.after = await L.modifySave(page, 'RET-09-7b').catch(e => ({ error: String(e).slice(0, 200) })); }
      }
      return o;
    });
  },
};

export default async ({ page }) => {
  const id = process.env.TC; const rec = { id, page, started: new Date().toISOString(), steps: [] };
  if (!CASES[id]) throw new Error(`unknown TC ${id}`);
  await L.guard(page);
  await CASES[id](page, rec);
  delete rec.page; rec.finished = new Date().toISOString(); rec.loads = L.loads; rec.net = L.netLog.filter(l => !/GetViewportInfo|crypto|fcm|popular|explore-fleet/.test(l));
  L.save(process.env.ONLY ? `${id}-rerun` : id, rec);
  return rec.steps.map(s => ({ label: s.label, err: s.error, nav: s.res?.navigated, msgs: s.res?.msgs, band: s.res?.band, header: s.res?.header, total: s.confirm?.total, popup: s.confirm?.popup, sub: s.submit?.messages }));
};
