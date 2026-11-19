// Transfer → By Hours execution (HRS-01 … HRS-14), workbook v3.2.
//   TC=HRS-02 RUN_ID=... node scripts/run.mjs steps/exec/hr-cases.mjs     (ONLY=<regex> re-runs matching steps → <TC>-rerun.json)
// Submission ONLY in HRS-02 (workbook main path; user instruction 18 Nov 2026: submit wherever the use case requires it).
// All other cases stop at the Confirm screen. Network guard (ot-lib): payment/cancel always blocked; save-inquiry only during the approved submit.
import * as L from './ot-lib.mjs';
const { snap, norm } = L;
const D = n => { const d = new Date(2026, 10, 18 + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const PH = { p: 'Search pickup location', x: 'Search drop location', h: 'Enter Number of Hours', n: 'Enter number of passengers' };
const P = { WF: ['Whitefield', 'Whitefield'], EC1: ['Electronic City Phase 1', 'Electronic City'], PEE: ['Peenya', 'Peenya'], MG: ['MG Road', 'MG Road'], DOM: ['Domlur', 'Domlur'],
  MYS: ['Mysuru', 'Mysuru'], KRP: ['KR Puram', 'Puram'], HYD: ['Hyderabad', 'Hyderabad'], MUN: ['Munnar', 'Munnar'], THA: ['Thanisandra', 'Thanisandra'], GOA: ['Panaji Goa', 'Panaji'],
  MAR: ['Marathahalli', 'Marathahalli'], HSR: ['HSR Layout', 'HSR Layout'], HEB: ['Hebbal', 'Hebbal'], JAY4: ['Jayanagar 4th Block', '4th Block'], SAR: ['Sarjapur Road', 'Sarjapur'],
  COORG: ['Coorg Madikeri', 'Madikeri'], IND: ['Indiranagar', 'Indiranagar'], CHE: ['Chennai', 'Chennai'], KOR: ['Koramangala', 'Koramangala'] };

async function run(rec, label, fn) {
  if (process.env.ONLY && !new RegExp(process.env.ONLY).test(label)) return {};
  // One automatic retry on an automation timeout (redesigned home page intermittently leaves controls unstable/covered).
  let s;
  for (let attempt = 1; attempt <= 2; attempt++) {
    s = { label };
    try { Object.assign(s, await fn()); } catch (e) { s.error = String(e).split('\n')[0].slice(0, 300); s.errorShot = await snap(rec.page, `${rec.id}-${label}-error`).catch(() => null); }
    if (!s.error || !/Timeout/.test(s.error) || attempt === 2) break;
    s.retriedAfter = s.error; rec.retries = (rec.retries || []).concat(`${label}: ${s.error}`);
  }
  rec.steps.push(s); return s;
}
const hourTab = async page => { await page.locator('#home-transfer-tabs-tab-hour').evaluate(e => e.click()); await page.waitForTimeout(1000); };
const vis = (page, ph) => L.active(page).locator(`input[placeholder="${ph}"]:visible`).first();
const setHours = async (page, h) => { const i = vis(page, PH.h); await i.click(); await i.fill(''); if (h !== '') await page.keyboard.type(String(h), { delay: 40 }); await page.waitForTimeout(300); };
const chips = page => L.active(page).locator('.selected-date-chip:visible').allInnerTexts().then(a => a.map(x => norm(x.replace('×', ''))));
async function removeChip(page, text) {
  const c = L.active(page).locator('.selected-date-chip:visible').filter({ hasText: text }).first();
  await c.locator('.remove-date-btn').click(); await page.waitForTimeout(500);
}
// Multi-day inline calendar: click each ISO date (navigates months forward/back). Returns chips.
async function pickDays(page, isos) {
  const cal = L.active(page).locator('.multi-day-calendar:visible').first();
  const out = [];
  for (const iso of isos) {
    const [y, m, d] = iso.split('-').map(Number);
    const target = new Date(y, m - 1, 1);
    for (let i = 0; i < 30; i++) {
      const cur = new Date(norm(await cal.locator('.react-datepicker__current-month').first().innerText()));
      if (cur.getFullYear() === target.getFullYear() && cur.getMonth() === target.getMonth()) break;
      await cal.locator(cur < target ? '.react-datepicker__navigation--next' : '.react-datepicker__navigation--previous').first().click(); await page.waitForTimeout(250);
    }
    const day = cal.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`).first();
    const disabled = await day.evaluate(e => e.className.includes('disabled') || e.getAttribute('aria-disabled') === 'true');
    await day.click().catch(() => {}); await page.waitForTimeout(400);
    out.push({ iso, disabled });
  }
  return { picked: out, chips: await chips(page) };
}
const state = async page => {
  const f = await L.formValues(page); const v = ph => f.find(x => x.ph === ph)?.v ?? null;
  return { pickup: v(PH.p), drop: v(PH.x), dt: f.filter(x => x.ph === 'text').map(x => x.v), pax: v(PH.n), hours: v(PH.h), toggles: f.filter(x => x.ph === 'checkbox').map(x => x.v), chips: await chips(page) };
};
// F = { md, dd, pickup, drop, date, time, days:[iso], keepToday, hours, pax }
async function fill(page, F, { goHome = true } = {}) {
  if (goHome) { await L.home(page, 'Transfer'); await hourTab(page); }
  const r = {};
  if (F.md != null) r.md = await L.setToggle(page, 'Multi-day Trip', F.md);
  if (F.dd != null) r.dd = await L.setToggle(page, 'Drop at different location', F.dd);
  r.places = [];
  if (F.pickup) r.places.push(await L.place(page, PH.p, ...F.pickup));
  if (F.drop) r.places.push(await L.place(page, PH.x, ...F.drop));
  if (F.md) {
    r.chipsBefore = await chips(page);
    if (F.days) r.days = await pickDays(page, F.days);
    if (!F.keepToday) for (const c of await chips(page)) if (!(F.days || []).some(iso => c === new Date(iso + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))) await removeChip(page, c).catch(() => {});
    if (F.time) r.time = await L.setTime(page, 0, F.time);
  } else {
    if (F.date) r.date = await L.setDate(page, 0, F.date);
    if (F.time) r.time = await L.setTime(page, 0, F.time);
  }
  if (F.hours != null) await setHours(page, F.hours);
  if (F.pax != null) await L.setPax(page, F.pax);
  await page.waitForTimeout(600);
  r.state = await state(page);
  return r;
}
async function results(page, tag) {
  const res = await L.search(page, tag);
  if (res.navigated) {
    const body = norm(await page.locator('body').innerText());
    res.header = body.match(/\d+ Buses Found \| [^\n]{0,40}?KM/)?.[0] || body.match(/\d+ Buses Found \| .{0,30}/)?.[0];
    res.band = res.summary?.match(/[<>]\s*30\s*KM/)?.[0] || null;
    res.hoursTxt = res.summary?.match(/Duration\s*:\s*([^:]+?)(?= Passengers| Pickup| Drop| Distance| Dates|$)/)?.[1] || null;
    res.datesTxt = res.summary?.match(/Dates\s*:\s*(.+?)(?= Pickup| Duration| Passengers|$)/)?.[1] || null;
  }
  const inp = await vis(page, PH.h).evaluate(e => ({ v: e.value, valid: e.validity.valid, msg: e.validationMessage })).catch(() => null);
  if (inp) res.hoursInput = inp;
  if (!res.navigated) res.stateAtReject = await state(page).catch(() => null);
  return res;
}
const card = (res, code) => res.page1?.find(c => (' ' + c + ' ').includes(' ' + code + ' ')) || null;
async function confirm(page, code, tag, keep = false) {
  const c = await L.confirmScreen(page, code, tag);
  c.out.text = L.PII(norm(await c.m.innerText())).slice(0, 2500);
  if (!keep) await L.closeModal(page);
  return c;
}
const searchDet = async (page, id, tag, F, veh, { det = true, conf = true } = {}) => {
  const f = await fill(page, F); const formShot = await snap(page, `${id}-${tag}-form`);
  const res = await results(page, `${id}-${tag}`); const o = { fill: f, formShot, res, card: veh ? card(res, veh) : null };
  if (res.navigated && veh) {
    if (det) o.details = await L.details(page, veh, `${id}-${tag}`).catch(e => ({ error: String(e).slice(0, 200) }));
    if (conf) o.confirm = (await confirm(page, veh, `${id}-${tag}`).catch(e => ({ out: { error: String(e).slice(0, 200) } }))).out;
  }
  return o;
};
async function myInqDetails(page, id, tag, match) {
  const list = await L.myInquiries(page, `${id}-${tag}`);
  const row = list.parsed.find(match) || list.parsed[0];
  const det = row?.id ? await L.openEdit(page, row.id, `${id}-${tag}-${row.id}`).catch(e => ({ error: String(e).slice(0, 200) })) : null;
  return { listTotal: list.total, top3: list.rows.slice(0, 3), row, details: det };
}
const modifyFields = async (page, tag) => { const pre = await L.modifyOpen(page, tag); pre.state = await state(page); return pre; };

const CASES = {
  'HRS-01': async (page, rec) => {
    await run(rec, '1-inventory', async () => {
      await L.home(page, 'Transfer'); await hourTab(page);
      const ctl = await L.active(page).evaluate(root => [...root.querySelectorAll('input,button,label')].filter(e => e.getBoundingClientRect().width)
        .map(e => `${e.tagName}${e.type ? ':' + e.type : ''} ${e.placeholder || (e.innerText || '').trim() || e.value}`.slice(0, 60)));
      const hours = await vis(page, PH.h).evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
      const pax = await vis(page, PH.n).evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
      const s0 = await snap(page, 'HRS-01-form');
      await L.setToggle(page, 'Drop at different location', true); const dd = (await L.formValues(page)).map(x => x.ph);
      await L.setToggle(page, 'Multi-day Trip', true); await page.waitForTimeout(700);
      const md = { fields: (await L.formValues(page)).map(x => x.ph), labels: await L.active(page).locator('label:visible').allInnerTexts(), chips: await chips(page) };
      const s1 = await snap(page, 'HRS-01-toggles-on');
      return { ctl, hours, pax, dd, md, shots: [s0, s1] };
    });
    await run(rec, '2-compare-local', async () => {
      await L.home(page, 'Local');
      const ctl = await L.active(page).evaluate(root => [...root.querySelectorAll('input,label')].filter(e => e.getBoundingClientRect().width).map(e => `${e.tagName}${e.type ? ':' + e.type : ''} ${e.placeholder || (e.innerText || '').trim()}`.slice(0, 60)));
      const hours = await vis(page, PH.h).evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
      const pax = await vis(page, PH.n).evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
      return { ctl, hours, pax, shot: await snap(page, 'HRS-01-local-form') };
    });
  },
  'HRS-02': async (page, rec) => {
    const F = { pickup: P.WF, dd: false, date: D(7), time: '10:00 AM', hours: 4, pax: 40 };
    await run(rec, 'search', async () => { const f = await fill(page, F); const formShot = await snap(page, 'HRS-02-form'); const res = await results(page, 'HRS-02-main');
      return { fill: f, formShot, res, card: card(res, 'P40AC'), details: res.navigated ? await L.details(page, 'P40AC', 'HRS-02-main') : null }; });
    await run(rec, 'confirm-for-submit', async () => { const c = await confirm(page, 'P40AC', 'HRS-02-main', true); rec._m = c.m; return { confirm: c.out }; });
    await run(rec, 'submit', async () => (rec._m ? { submit: await L.submit(page, rec._m, 'HRS-02-main') } : { skipped: 'no confirm modal' }));
    delete rec._m;
    await run(rec, 'my-inquiries', async () => myInqDetails(page, 'HRS-02', 'post', r => /25 Nov 2026/.test(r.dates || r.raw || '') && /40 Seater Premium/.test(r.vehicle || r.raw || '')));
  },
  'HRS-03': async (page, rec) => {
    for (const h of ['0', '1', '24', '25', '-1', '', '1.5', 'abc', '100']) await run(rec, `hours-${h === '' ? 'blank' : h}`, async () => {
      const f = await fill(page, { pickup: P.EC1, date: D(6), time: '10:00 AM', pax: 2 });
      await setHours(page, h); const typed = await vis(page, PH.h).inputValue();
      const res = await results(page, `HRS-03-${h === '' ? 'blank' : h.replace('.', '_')}`);
      return { typed, res: { navigated: res.navigated, msgs: res.msgs, hoursInput: res.hoursInput, hoursTxt: res.hoursTxt, header: res.header, shot: res.shot }, pickup: f.state.pickup };
    });
  },
  'HRS-04': async (page, rec) => {
    const base = { pickup: P.PEE, dd: false, date: D(14), time: '6:00 AM', pax: 10 };
    const prices = [];
    // Representative hour set (user choice 18 Nov 2026): 1, 2, 4, 8, 12, 16, 23, 24.
    for (const h of [1, 2, 4, 8, 12, 16, 23, 24]) await run(rec, `h${h}`, async () => {
      const full = [1, 4, 8, 12, 16, 24].includes(h);
      const o = await searchDet(page, 'HRS-04', `h${h}`, { ...base, hours: h }, 'P28AC', { det: h === 1 || h === 24, conf: full });
      prices.push([h, o.card, o.confirm?.cost]);
      if (!full) { delete o.fill; o.res = { navigated: o.res.navigated, hoursTxt: o.res.hoursTxt, header: o.res.header, msgs: o.res.msgs, shot: o.res.shot }; }
      return o;
    });
    rec.prices = prices;
  },
  'HRS-05': async (page, rec) => {
    const base = { pickup: P.MG, date: D(15), time: '9:00 AM', hours: 8, pax: 12 };
    await run(rec, 'A-no-drop', () => searchDet(page, 'HRS-05', 'A', { ...base, dd: false }, 'L12AC'));
    await run(rec, 'B-drop-Domlur', () => searchDet(page, 'HRS-05', 'B', { ...base, dd: true, drop: P.DOM }, 'L12AC'));
    await run(rec, 'C-drop-Mysuru', () => searchDet(page, 'HRS-05', 'C', { ...base, dd: true, drop: P.MYS }, 'L12AC'));
  },
  'HRS-06': async (page, rec) => {
    const base = { dd: true, date: D(16), time: '6:00 AM', pax: 30 };
    await run(rec, 'A-Hyderabad-4h', () => searchDet(page, 'HRS-06', 'A', { ...base, pickup: P.KRP, drop: P.HYD, hours: 4 }, 'L49NV'));
    await run(rec, 'B-Hyderabad-24h', () => searchDet(page, 'HRS-06', 'B', { ...base, pickup: P.KRP, drop: P.HYD, hours: 24 }, 'L49NV', { det: false }));
    await run(rec, 'C-Munnar-2h', () => searchDet(page, 'HRS-06', 'C', { ...base, pickup: P.WF, drop: P.MUN, hours: 2 }, 'L49NV', { det: false }));
    await run(rec, 'D-Goa-24h', () => searchDet(page, 'HRS-06', 'D', { ...base, pickup: P.THA, drop: P.GOA, hours: 24 }, 'L49NV', { det: false }));
  },
  'HRS-07': async (page, rec) => {
    await run(rec, '1-chips', async () => {
      const f = await fill(page, { pickup: P.MAR, dd: false, md: true, keepToday: true, days: [D(3), D(5), '2026-12-01'], time: '8:00 AM', hours: 6, pax: 35 });
      return { chipsOnToggle: f.chipsBefore, afterPick: f.days, state: f.state, shot: await snap(page, 'HRS-07-1-chips') };
    });
    await run(rec, '2-zero-dates', async () => {
      for (const c of await chips(page)) await removeChip(page, c).catch(() => {});
      const st = await state(page); const res = await results(page, 'HRS-07-2-zero');
      return { state: st, res: { navigated: res.navigated, msgs: res.msgs, shot: res.shot } };
    });
    await run(rec, '3-4-search-fare', async () => {
      const o = await searchDet(page, 'HRS-07', 'main', { pickup: P.MAR, dd: false, md: true, days: [D(3), D(5), '2026-12-01'], time: '8:00 AM', hours: 6, pax: 35 }, 'D40NA');
      return o;
    });
  },
  'HRS-08': async (page, rec) => {
    const runs = { A: ['10:00 AM', 4], B: ['7:00 PM', 4], C: ['11:00 PM', 2], D: ['4:00 AM', 2] };
    for (const [k, [t, h]] of Object.entries(runs))
      await run(rec, `run-${k}`, () => searchDet(page, 'HRS-08', k, { pickup: P.HSR, dd: false, date: D(18), time: t, hours: h, pax: 30 }, 'D35NA', { det: k === 'A' || k === 'C' }));
  },
  'HRS-09': async (page, rec) => {
    await run(rec, '1-blank-pickup', async () => { await fill(page, { hours: 4 }); return { res: await results(page, 'HRS-09-1') }; });
    await run(rec, '2-drop-blank', async () => { await fill(page, { pickup: P.HEB, dd: true, hours: 4 }); return { res: await results(page, 'HRS-09-2') }; });
    await run(rec, '3-drop-eq-pickup', async () => { const f = await fill(page, { pickup: P.HEB, dd: true, drop: P.HEB, date: D(4), time: '10:00 AM', hours: 4 }); return { state: f.state, res: await results(page, 'HRS-09-3') }; });
    await run(rec, '4a-past-date', async () => {
      await fill(page, { pickup: P.HEB, hours: 4 }); const r = await L.setDate(page, 0, D(-1));
      const inp = L.active(page).locator('input[value^="20"]:visible').first(); await inp.fill('2026-11-17').catch(() => {}); await page.keyboard.press('Tab'); await page.waitForTimeout(500);
      return { pickerDay: r, afterType: await inp.inputValue(), res: await results(page, 'HRS-09-4a') };
    });
    await run(rec, '4b-past-slot', async () => {
      await fill(page, { pickup: P.HEB, hours: 4 });
      await L.active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first().click(); await page.waitForTimeout(500);
      const slots = await page.evaluate(() => { const it = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width); const dis = it.filter(e => e.className.includes('disabled')); return { n: it.length, disabled: dis.length, lastDisabled: dis.at(-1)?.innerText }; });
      const r = await L.setTime(page, 0, '9:00 AM'); return { slots, tried: r, state: await state(page), shot: await snap(page, 'HRS-09-4b-slots') };
    });
    await run(rec, '4c-idle', async () => ({ skipped: 'Not executed: requires leaving the form idle until the default slot has passed (up to 30 min); same date component as P2P-07 / OUT-10.' }));
  },
  'HRS-10': async (page, rec) => {
    const base = { pickup: P.JAY4, dd: false, date: D(19), time: '9:00 AM', hours: 6 };
    await run(rec, '1-pax25-P25AC', () => searchDet(page, 'HRS-10', 'pax25', { ...base, pax: 25 }, 'P25AC', { det: false }));
    await run(rec, '2-pax60-multi', async () => {
      const f = await fill(page, { ...base, pax: 60 }); const paxAttr = await vis(page, PH.n).evaluate(e => ({ v: e.value, max: e.max }));
      const res = await results(page, 'HRS-10-pax60'); if (!res.navigated) return { state: f.state, paxAttr, res };
      const first = (await confirm(page, 'L45V', 'HRS-10-pax60-L45V')).out; const second = (await confirm(page, 'P25AC', 'HRS-10-pax60-plus-P25AC')).out;
      return { state: f.state, paxAttr, res, first, second };
    });
  },
  'HRS-11': async (page, rec) => {
    const F = { pickup: P.SAR, dd: true, drop: P.COORG, date: D(21), time: '7:00 AM', hours: 10, pax: 8 };
    await run(rec, '1-switching', async () => {
      const f = await fill(page, F);
      await page.locator('#home-transfer-tabs-tab-point').evaluate(e => e.click()); await page.waitForTimeout(900); const p2p = await L.formValues(page);
      await hourTab(page); const back1 = await state(page);
      await page.locator('a.nav-link').getByText('Local', { exact: true }).first().evaluate(e => e.click()); await page.waitForTimeout(1000); const local = await L.formValues(page);
      await page.locator('a.nav-link').getByText('Transfer', { exact: true }).first().evaluate(e => e.click()); await page.waitForTimeout(1000); await hourTab(page);
      const back2 = await state(page);
      return { filled: f.state, p2p, back1, local, back2, shot: await snap(page, 'HRS-11-after-switch') };
    });
    await run(rec, '2-search', async () => { const res = await results(page, 'HRS-11-first'); return { res, card: card(res, 'D MPV') }; });
    await run(rec, '3-modify-hours', async () => {
      const pre = await modifyFields(page, 'HRS-11');
      await setHours(page, 12); const after = await state(page);
      const res = await L.modifySave(page, 'HRS-11-modified');
      return { pre, after, res };
    });
    await run(rec, '4-new-fare', async () => {
      const summary = norm(await page.locator('body').innerText()).match(/You have Searched For.{0,500}/)?.[0];
      const det = await L.details(page, 'D MPV', 'HRS-11-modified').catch(e => ({ error: String(e).slice(0, 200) }));
      const c = await confirm(page, 'D MPV', 'HRS-11-modified').catch(e => ({ out: { error: String(e).slice(0, 200) } }));
      return { summary: L.PII(summary || ''), details: det, confirm: c.out };
    });
  },
  'HRS-12': async (page, rec) => {
    await run(rec, '1-local', async () => {
      await L.home(page, 'Local');
      const pl = await L.place(page, PH.p, ...P.WF); await L.setDate(page, 0, D(20)); await L.setTime(page, 0, '9:00 AM');
      await setHours(page, 8); await L.setPax(page, 10);
      const res = await results(page, 'HRS-12-local');
      const o = { place: pl, res };
      if (res.navigated) { o.details = await L.details(page, 'P16UB', 'HRS-12-local').catch(e => ({ error: String(e).slice(0, 200) })); o.confirm = (await confirm(page, 'P16UB', 'HRS-12-local').catch(e => ({ out: { error: String(e).slice(0, 200) } }))).out; }
      return o;
    });
    await run(rec, '2-by-hour', () => searchDet(page, 'HRS-12', 'byhour', { pickup: P.WF, dd: false, date: D(20), time: '9:00 AM', hours: 8, pax: 10 }, 'P16UB'));
  },
  'HRS-13': async (page, rec) => {
    const F = { pickup: P.IND, md: true, dd: true, drop: P.MYS, days: [D(24), D(25), D(26)], time: '7:00 AM', hours: 8, pax: 18 };
    await run(rec, '1-2-search', async () => { const o = await searchDet(page, 'HRS-13', 'main', F, 'P21AC', { det: true, conf: false }); o.chipsBefore = o.fill.chipsBefore; return o; });
    await run(rec, '3-4-confirm', async () => ({ confirm: (await confirm(page, 'P21AC', 'HRS-13-main')).out }));
    await run(rec, '5-modify-remove-date', async () => {
      const pre = await modifyFields(page, 'HRS-13');
      await removeChip(page, 'Dec 13, 2026').catch(e => null); const after = await state(page);
      const res = await L.modifySave(page, 'HRS-13-two-dates');
      const o = { pre, after, res };
      if (res.navigated) o.confirm = (await confirm(page, 'P21AC', 'HRS-13-two-dates').catch(e => ({ out: { error: String(e).slice(0, 200) } }))).out;
      return o;
    });
    await run(rec, '6-modify-toggles-off', async () => {
      const pre = await modifyFields(page, 'HRS-13-b');
      const dd = await L.setToggle(page, 'Drop at different location', false); const afterDd = await state(page);
      const res1 = await L.modifySave(page, 'HRS-13-dd-off');
      const o = { pre, dd, afterDd, res1 };
      if (res1.navigated) {
        const pre2 = await modifyFields(page, 'HRS-13-c');
        o.md = await L.setToggle(page, 'Multi-day Trip', false); o.afterMd = await state(page); o.pre2 = pre2;
        o.res2 = await L.modifySave(page, 'HRS-13-md-off');
      }
      return o;
    });
  },
  'HRS-14': async (page, rec) => {
    const base = { date: D(22), time: '9:00 AM', hours: 6, pax: 5 };
    await run(rec, 'A-Whitefield', async () => { const f = await fill(page, { ...base, pickup: P.WF, dd: false }); return { places: f.places, res: await results(page, 'HRS-14-A') }; });
    await run(rec, 'B-Mysuru', async () => { const f = await fill(page, { ...base, pickup: P.MYS, dd: false }); return { places: f.places, res: await results(page, 'HRS-14-B') }; });
    await run(rec, 'C-Chennai', async () => { const f = await fill(page, { ...base, pickup: P.CHE, dd: false }); return { places: f.places, res: await results(page, 'HRS-14-C') }; });
    await run(rec, 'D-Koramangala-Chennai', () => searchDet(page, 'HRS-14', 'D', { ...base, pickup: P.KOR, dd: true, drop: P.CHE }, 'P16UB', { det: true, conf: true }));
  },
};

export default async ({ page }) => {
  const id = process.env.TC; const rec = { id, page, started: new Date().toISOString(), steps: [] };
  if (!CASES[id]) throw new Error(`unknown TC ${id}`);
  await L.guard(page);
  await CASES[id](page, rec);
  delete rec.page; rec.finished = new Date().toISOString(); rec.loads = L.loads; rec.net = L.netLog.filter(l => !/GetViewportInfo|crypto|fcm|popular|explore-fleet/.test(l));
  L.save(process.env.ONLY ? `${id}-rerun` : id, rec);
  return rec.steps.map(s => ({ label: s.label, err: s.error, nav: s.res?.navigated, msgs: s.res?.msgs, header: s.res?.header, hrs: s.res?.hoursTxt, total: s.confirm?.total, popup: s.confirm?.popup, sub: s.submit?.messages }));
};
