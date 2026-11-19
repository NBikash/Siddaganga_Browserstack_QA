// Multi-Leg execution (USER-MLG-TC-01 … 19), workbook v3.3 sheet "Multi-Leg Use Cases". MLG-20 (corporate) descoped by the user 19 Nov 2026.
//   TC=MLG-02 RUN_ID=... node scripts/run.mjs steps/exec/mu-cases.mjs     (ONLY=<regex> re-runs matching steps → <TC>-rerun.json)
// Submissions ONLY in MLG-02 and MLG-18 (workbook main paths; user instruction 19 Nov 2026: submit wherever the use case requires it).
// Explicit Save As Draft ONLY in MLG-17. Everything else stops at the Confirm screen.
// Network guard (ot-lib): payment/cancel always blocked; save-inquiry only during the approved submit; the app's automatic
// draft saves (/user/draft-inquiry/save on Next, Save!, vehicle selection) are blocked except in MLG-02/17/18 (DRAFTS=1 path).
import * as M from './mu-lib.mjs';
const { L, D, PH, snap, norm } = M;
const P = { WF: ['Whitefield', 'Whitefield'], JAY4: ['Jayanagar 4th Block', '4th Block'], MYS: ['Mysuru', 'Mysuru'], KIA: ['Kempegowda International Airport', 'Bengaluru (BLR)'],
  EC1: ['Electronic City Phase 1', 'Electronic City'], EC: ['Electronic City', 'Electronic City'], SRI: ['Srirangapatna', 'Srirangapatna'], SAR: ['Sarjapur Road', 'Sarjapur'], KOL: ['Kolar', 'Kolar'],
  NANDI: ['Nandi Hills', 'Nandi Hills'], HEB: ['Hebbal', 'Hebbal'], CHIK: ['Chikkaballapur', 'Chikkaballapur'], YEL: ['Yelahanka', 'Yelahanka'], HAS: ['Hassan', 'Hassan'],
  RAJ: ['Rajajinagar', 'Rajajinagar'], HUB: ['Hubballi', 'Hubballi'], CHE: ['Chennai', 'Chennai'], KOCHI: ['Kochi', 'Kochi'], MPAL: ['Mysuru Palace', 'Palace'],
  DOM: ['Domlur', 'Domlur'], HYD: ['Hyderabad', 'Hyderabad'], MAL: ['Malleshwaram', 'Malleshwaram'], MAR: ['Marathahalli', 'Marathahalli'], SHIV: ['Shivanasamudra Falls', 'Shivanasamudra'],
  KOR: ['Koramangala', 'Koramangala'], CHKM: ['Chikkamagaluru', 'Chikkamagaluru'], BELUR: ['Belur', 'Belur'], HSR: ['HSR Layout', 'HSR Layout'], COORG: ['Coorg Madikeri', 'Madikeri'] };

async function run(rec, label, fn) {
  if (process.env.ONLY && !new RegExp(process.env.ONLY).test(label)) return {};
  let s;
  for (let attempt = 1; attempt <= 2; attempt++) {
    s = { label };
    try { Object.assign(s, await fn()); } catch (e) { s.error = String(e).split('\n')[0].slice(0, 300); s.errorShot = await snap(rec.page, `${rec.id}-${label}-error`).catch(() => null); }
    if (!s.error || !/Timeout/.test(s.error) || attempt === 2) break;
    s.retriedAfter = s.error; rec.retries = (rec.retries || []).concat(`${label}: ${s.error}`);
  }
  rec.steps.push(s); return s;
}
const drafts = on => { const re = /draft-inquiry/; const i = L.allowList.findIndex(r => String(r) === String(re)); if (on && i < 0) L.allowList.push(re); if (!on && i >= 0) L.allowList.splice(i, 1); };
const det = (page, code, tag) => L.details(page, code, tag).catch(e => ({ error: String(e).slice(0, 200) }));
const brief = r => r && ({ navigated: r.navigated, found: r.found, header: r.header, labels: r.labels, legTabs: r.legTabs, summary: r.summary?.slice(0, 700), distance: r.distance, dates: r.dates, duration: r.duration, pax: r.pax, drop: r.drop, route: r.route, page1: r.page1, shot: r.shot, toasts: r.toasts, msgs: r.msgs });
// Book Now! as the workbook states. If blocked by the blank open form (MLG-03 defect), record it, then WORKAROUND:
// open the last saved leg's badge (pre-filled form) and press Book Now! again; legTabs show whether that leg is duplicated.
async function finish(page, tag) {
  const first = await M.bookNow(page, tag);
  if (first.navigated) return { res: first };
  const o = { blocked: first, tabAtBlock: await M.activeTab(page) };
  const legs = await M.legList(page); const n = legs?.badges?.length || 0;
  if (n) { await M.badge(page, n); o.workaround = `Book Now! blocked; opened saved leg badge ${n} (${legs.badges[n - 1]}) and pressed Book Now! again`; o.res = await M.bookNow(page, `${tag}-workaround`); o.savedLegs = legs.badges; }
  return o;
}
// Read every leg inside the Confirm pop-up (Leg n buttons) and close it unless keep.
async function confirmLegs(page, tag, keep = false) {
  const m = page.locator('.modal.show').first();
  if (!(await m.count())) return { open: false };
  const btns = m.locator('button').filter({ hasText: /^\s*Leg \d+\s*$/ });
  const n = await btns.count(); const legs = [];
  for (let i = 0; i < Math.max(n, 1); i++) {
    if (n) { await btns.nth(i).click(); await page.waitForTimeout(1300); }
    const t = L.PII(norm(await m.innerText()));
    const g = re => t.match(re)?.[1]?.trim() || null;
    legs.push({ leg: i + 1, vehicles: g(/Selected Vehicles\s*:\s*(.+?)(?= Type:| Route Summary)/), routeSummary: g(/Route Summary\s*:\s*(.+?)(?= From Garage| Pickup Location)/),
      pickup: g(/Pickup Location (.+?)(?= Dropoff Location| Back to Garage| Drop Location)/), dropoff: g(/Dropoff Location (.+?)(?= Back to Garage)/), dates: g(/Dates (.+?)(?= Passenger)/),
      passenger: g(/Passenger (\d+)/), cost: g(/Estimated Trip Cost\s*:\s*(.+?)(?= Confirm & Submit|$)/), total: g(/Estimated Grand Total (₹[\d,]+)/),
      shot: await snap(page, `${tag}-confirm-leg${i + 1}`) });
  }
  const text = L.PII(norm(await m.innerText()));
  const out = { open: true, title: text.slice(0, 40), legCount: n, legs, overallTotal: text.match(/(?:Overall|Combined|Total Trip|All Legs)[^₹]{0,40}(₹[\d,]+)/i)?.[1] || null, buttons: (await m.locator('button').allInnerTexts()).map(norm).filter(Boolean) };
  if (n) { await btns.nth(0).click(); await page.waitForTimeout(800); }
  if (!keep) await L.closeModal(page);
  return out;
}
const sel = async (page, code, tag) => M.selectVehicle(page, code, tag).catch(e => ({ error: String(e).slice(0, 200) }));
// Compare: click the compare control on a vehicle card (hover-reveal); returns toasts/compare tray text.
async function compare(page, code, tag) {
  await page.mouse.move(2, 2); await page.waitForTimeout(500);
  const found = await page.evaluate(code => {
    document.querySelectorAll('[data-qa-cmp]').forEach(e => e.removeAttribute('data-qa-cmp'));
    for (const card of [...document.querySelectorAll('*')].filter(e => /Starts From/.test(e.innerText || '') && (' ' + (e.innerText || '').replace(/\s+/g, ' ') + ' ').includes(' ' + code + ' ') && e.innerText.length < 900)) {
      const c = [...card.querySelectorAll('input[type=checkbox], button, label, span, a')].find(x => /compare/i.test((x.innerText || '') + ' ' + (x.getAttribute('aria-label') || '') + ' ' + x.className + ' ' + (x.name || '')));
      if (c) { c.setAttribute('data-qa-cmp', '1'); return (c.innerText || c.className || '').slice(0, 60); }
    }
    return null;
  }, code);
  if (!found) return { code, control: null, note: 'no compare control found on the card (page 1)' };
  await page.locator('[data-qa-cmp="1"]').first().evaluate(e => e.click()); await page.waitForTimeout(1200);
  const tray = await page.evaluate(() => [...document.querySelectorAll('[class*=compare i]')].filter(e => e.getBoundingClientRect().width).map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean).slice(0, 5));
  return { code, control: found, toasts: await M.toasts(page), tray, shot: await snap(page, `${tag}-compare-${code.replace(/\s/g, '')}`) };
}
async function myInq(page, tag) {
  const r = await L.myInquiries(page, tag);
  return { total: r.total, top: r.rows.slice(0, 4).map(L.PII), shot: r.shot };
}
const pageState = async page => ({ legs: await M.legList(page), tab: await M.activeTab(page), form: await M.state(page) });

const CASES = {
  'MLG-01': async (page, rec) => {
    await run(rec, '1-inventory', async () => {
      await M.open(page);
      const ctl = await page.locator(M.PANE).evaluate(r => [...r.querySelectorAll('input,button,label,h4')].filter(e => e.getBoundingClientRect().width).map(e => `${e.tagName}${e.type ? ':' + e.type : ''} ${(e.innerText || '').trim() || e.placeholder || ''}${e.min ? ' min=' + e.min : ''}${e.max ? ' max=' + e.max : ''}`.trim()));
      const maps = await page.locator('.gm-style').count();
      return { ctl, maps, shot: await snap(page, 'MLG-01-step1') };
    });
    await run(rec, '2-blank', async () => { const s = await M.step1(page, ''); return { ...s, shot: await snap(page, 'MLG-01-blank') }; });
    for (const v of ['0', '-2', '2.5', '1000']) await run(rec, `3-value-${v}`, async () => {
      const s = await M.step1(page, v); const leg1pax = s.step2 ? await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue().catch(() => null) : null;
      const valid = s.step2 ? null : await M.totalInput(page).evaluate(e => ({ v: e.value, valid: e.validity.valid, msg: e.validationMessage })).catch(() => null);
      return { ...s, leg1pax, valid, shot: await snap(page, `MLG-01-v${v.replace('.', '_')}`) };
    });
    await run(rec, '4-twelve', async () => {
      const s = await M.step1(page, 12);
      return { ...s, tab: await M.activeTab(page), legs: await M.legList(page), leg1pax: await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue(), shot: await snap(page, 'MLG-01-step2') };
    });
    await run(rec, '5-trash', async () => {
      await M.tripTrash(page);
      const txt = norm(await page.locator(M.PANE).innerText());
      return { text: txt.slice(0, 300), step1Back: /Enter Number of Passengers/.test(txt) && !/Trip Leg #/.test(txt), total: await M.totalInput(page).inputValue().catch(() => null), toasts: await M.toasts(page), shot: await snap(page, 'MLG-01-after-trash') };
    });
  },

  'MLG-02': async (page, rec) => {
    drafts(true);
    await run(rec, '1-step1', async () => M.step1(page, 10));
    await run(rec, '2-local', async () => { const f = await M.fillLocal(page, { pickup: P.JAY4, dd: false, date: D(7), time: '9:00 AM', hours: 8 }); return { fill: f, save: await M.save(page, 'MLG-02-l1') }; });
    await run(rec, '3-outstation', async () => { const f = await M.fillOut(page, { pickup: P.WF, dests: [P.MYS], dd: false, dates: [D(8), D(9)], times: ['7:00 AM', '8:00 PM'] }, { go: false }); return { fill: f, save: await M.save(page, 'MLG-02-l2') }; });
    await run(rec, '4-transfer-booknow', async () => {
      const f = await M.fillTrf(page, { from: P.WF, to: P.KIA, date: D(10), time: '10:00 AM' }, { go: false }); const formShot = await snap(page, 'MLG-02-l3-form');
      const fin = await finish(page, 'MLG-02'); return { fill: f, formShot, ...fin, res: brief(fin.res) };
    });
    const V = ['L12AC', 'P35AC', 'D12TT'];
    for (let i = 0; i < 3; i++) await run(rec, `5-leg${i + 1}`, async () => {
      const res = brief(await M.readResults(page, `MLG-02-leg${i + 1}`));
      const d = await det(page, V[i], `MLG-02-leg${i + 1}`);
      const s = await sel(page, V[i], `MLG-02-leg${i + 1}`);
      return { res, details: d, select: s };
    });
    await run(rec, '6-confirm', async () => ({ confirm: await confirmLegs(page, 'MLG-02', true) }));
    await run(rec, '7-submit', async () => {
      const m = page.locator('.modal.show').first();
      if (!(await m.count())) return { skipped: 'no confirm modal' };
      return { submit: await L.submit(page, m, 'MLG-02') };
    });
    drafts(false);
    await run(rec, '8-my-inquiries', async () => myInq(page, 'MLG-02-post'));
  },

  'MLG-03': async (page, rec) => {
    const LOC = { pickup: P.EC1, dd: false, date: D(9), time: '10:00 AM', hours: 4 };
    // Workbook: Transfer drop "as the app sets it". The app keeps the default drop time (page-load time + 2 h), so it is set explicitly
    // after recording the default (step 3a).
    const TRF = { from: P.EC1, to: P.MYS, date: D(9), time: '4:00 PM' };
    await run(rec, '1-2-save-local-skip-out', async () => {
      await M.step1(page, 4); await M.fillLocal(page, LOC); const s1 = await M.save(page, 'MLG-03-A-l1');
      const sk = await M.skip(page, 'Outstation'); return { save: s1, skip: sk, shot: await snap(page, 'MLG-03-A-after-skip-out') };
    });
    await run(rec, '3a-transfer-default-drop', async () => { const f = await M.fillTrf(page, TRF, { go: false }); await M.btn(page, 'Save!', 1200); return { form: f.state, msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-03-A-default-drop') }; });
    await run(rec, '3b-save-transfer', async () => { const f = await M.fillTrf(page, { dropDate: D(9), dropTime: '8:00 PM' }, { go: false }); const s = await M.save(page, 'MLG-03-A-l2'); return { form: f.state, save: s, formAfter: await M.state(page) }; });
    await run(rec, '4-booknow-blank-open-form', async () => {
      const r = await M.bookNow(page, 'MLG-03-A'); const o = { tab: await M.activeTab(page), res: brief(r) };
      if (r.navigated) o.lsuv = (r.page1 || []).find(c => / LSUV /.test(` ${c} `)) || 'LSUV not on page 1';
      return o;
    });
    await run(rec, '5-skip-transfer', async () => {
      await M.step1(page, 4); await M.fillLocal(page, LOC); const s1 = await M.save(page, 'MLG-03-B-l1');
      const so = await M.skip(page, 'Outstation'); const st = await M.skip(page, 'Transfer'); const shot = await snap(page, 'MLG-03-B-after-skip-tr');
      const r = await M.bookNow(page, 'MLG-03-B'); return { save: s1, skipOut: so, skipTr: st, shot, res: brief(r) };
    });
    await run(rec, '5b-restore-after-reload', async () => {
      // Left over from step 5: Book Now! was blocked. Reload WITHOUT clearing sessionStorage, then a new trip.
      const pending = await page.evaluate(() => (sessionStorage.getItem('pendingInquiryFormData') || '').slice(0, 300)).catch(() => null);
      const s = await M.step1(page, 4, { keepPending: true });
      return { pendingBefore: pending ? pending.replace(/"(mobile|email|phone)[^,]*/gi, '') : null, step1: s, legs: await M.legList(page), tab: await M.activeTab(page), shot: await snap(page, 'MLG-03-B-restored-after-reload') };
    });
    await run(rec, '6-unsaved-filled-local', async () => {
      await M.step1(page, 4); const f = await M.fillLocal(page, LOC); const shot = await snap(page, 'MLG-03-C-form'); const r = await M.bookNow(page, 'MLG-03-C');
      const o = { fill: f.state, shot, res: brief(r) };
      if (!r.navigated) { await page.waitForTimeout(8000); o.urlLater = page.url().replace(/[0-9a-f-]{36}/, '<id>'); o.toastsLater = await M.toasts(page); if (/send-inquiry/.test(page.url())) o.res = brief(await M.readResults(page, 'MLG-03-C-late')); }
      return o;
    });
    await run(rec, '6b-saved-plus-filled-transfer', async () => {
      // Control path (as MLG-02): saved Local leg + filled, unsaved Transfer form → Book Now!.
      await M.step1(page, 4); await M.fillLocal(page, LOC); await M.save(page, 'MLG-03-D-l1'); await M.skip(page, 'Outstation');
      await M.fillTrf(page, { ...TRF, dropDate: D(9), dropTime: '8:00 PM' }, { go: false });
      const r = await M.bookNow(page, 'MLG-03-D'); const o = { res: brief(r) };
      if (r.navigated) { o.lsuv = (r.page1 || []).find(c => / LSUV /.test(` ${c} `)) || null; o.lsuvDetails = await det(page, 'LSUV', 'MLG-03-D-LSUV'); }
      return o;
    });
  },

  'MLG-04': async (page, rec) => {
    await run(rec, '1-no-legs', async () => {
      await M.step1(page, 2);
      const a = await M.skip(page, 'Local'); const b = await M.skip(page, 'Outstation'); const c = await M.skip(page, 'Transfer');
      const r = await M.bookNow(page, 'MLG-04-1');
      return { skips: [a, b, c], res: brief(r), url: page.url().replace(/[0-9a-f-]{36}/, '<id>') };
    });
    await run(rec, '2-blank-forms', async () => {
      await M.step1(page, 2); const o = {};
      for (const t of ['Local', 'Outstation', 'Transfer']) {
        await M.tab(page, t); await M.btn(page, 'Save!', 1200);
        o[t] = { msgs: await M.msgs(page), legs: await M.legList(page), tabAfter: await M.activeTab(page), shot: await snap(page, `MLG-04-2-${t}`) };
      }
      return o;
    });
    await run(rec, '3-unresolved-text', async () => {
      await M.step1(page, 2); const o = {};
      await M.tab(page, 'Local'); o.Local = { typed: await M.typeNoPick(page, PH.p, 'Xyzabc123') };
      await M.btn(page, 'Save!', 1200); Object.assign(o.Local, { msgs: await M.msgs(page), legs: await M.legList(page), tabAfter: await M.activeTab(page), shot: await snap(page, 'MLG-04-3-Local') });
      await M.tab(page, 'Outstation'); await M.place(page, PH.p, ...P.WF); o.Outstation = { typed: await M.typeNoPick(page, 'Search destination 1 location', 'Xyzabc123') };
      await M.btn(page, 'Save!', 1200); Object.assign(o.Outstation, { msgs: await M.msgs(page), legs: await M.legList(page), tabAfter: await M.activeTab(page), shot: await snap(page, 'MLG-04-3-Outstation') });
      await M.tab(page, 'Transfer'); await M.place(page, PH.p, ...P.WF); o.Transfer = { typed: await M.typeNoPick(page, PH.x, 'Xyzabc123') };
      await M.btn(page, 'Save!', 1200); Object.assign(o.Transfer, { msgs: await M.msgs(page), legs: await M.legList(page), tabAfter: await M.activeTab(page), shot: await snap(page, 'MLG-04-3-Transfer') });
      return o;
    });
  },

  'MLG-05': async (page, rec) => {
    await run(rec, '1-2-three-legs', async () => {
      await M.step1(page, 25); await M.skip(page, 'Local');
      const a = await M.fillOut(page, { pickup: P.JAY4, dests: [P.MYS, P.SRI], dd: false, dates: [D(12), D(13)], times: ['7:00 AM', '7:00 PM'] }, { go: false });
      await M.addLeg(page);
      const b = await M.fillOut(page, { legIdx: 1, pickup: P.SAR, dests: [P.KOL], dd: false, dates: [D(14), D(14)], times: ['8:00 AM', '9:00 PM'] }, { go: false });
      await M.addLeg(page);
      const c = await M.fillOut(page, { legIdx: 2, pickup: P.EC1, dests: [P.NANDI], dd: false, dates: [D(15), D(15)], times: ['7:00 AM', '8:00 PM'] }, { go: false });
      const hdr = await M.legPane(page).evaluate(r => [...r.querySelectorAll('h5')].filter(e => e.getBoundingClientRect().width).map(h => ({ t: (h.innerText || '').trim(), remove: !!h.parentElement.querySelector('.remove-leg-btn') })));
      const pax = await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).evaluateAll(es => es.map(e => e.value));
      return { a: a.state, b: b.places, c: c.places, headers: hdr, pax, shot: await snap(page, 'MLG-05-three-legs', { fullPage: true }) };
    });
    await run(rec, '3-remove-C', async () => {
      await M.legPane(page).locator('.remove-leg-btn:visible').nth(2).click(); await page.waitForTimeout(900);
      const hdr = await M.legPane(page).evaluate(r => [...r.querySelectorAll('h5')].filter(e => e.getBoundingClientRect().width).map(h => (h.innerText || '').trim()));
      return { headers: hdr, form: await M.state(page), shot: await snap(page, 'MLG-05-after-remove-C', { fullPage: true }) };
    });
    await run(rec, '4-save', async () => ({ save: await M.save(page, 'MLG-05') }));
    await run(rec, '5-results', async () => {
      const sk = await M.skip(page, 'Transfer'); const fin = await finish(page, 'MLG-05'); const r = fin.res || {};
      const o = { skip: sk, ...fin, res: brief(r), legs: [] };
      if (r.navigated) for (let i = 1; i <= 2; i++) { const rr = brief(await M.readResults(page, `MLG-05-leg${i}`)); const s = await sel(page, 'D40NA', `MLG-05-leg${i}`); o.legs.push({ res: rr, select: s }); }
      o.confirm = await confirmLegs(page, 'MLG-05');
      return o;
    });
    await run(rec, '5b-alt-unsaved-booknow', async () => {
      // Alternative path (Book Now! defect): legs A and B entered but NOT saved; Book Now! from the Outstation tab.
      await M.step1(page, 25); await M.skip(page, 'Local');
      await M.fillOut(page, { pickup: P.JAY4, dests: [P.MYS, P.SRI], dd: false, dates: [D(12), D(13)], times: ['7:00 AM', '7:00 PM'] }, { go: false });
      await M.addLeg(page);
      await M.fillOut(page, { legIdx: 1, pickup: P.SAR, dests: [P.KOL], dd: false, dates: [D(14), D(14)], times: ['8:00 AM', '9:00 PM'] }, { go: false });
      const r = await M.bookNow(page, 'MLG-05-alt'); const o = { res: brief(r), legs: [] };
      if (r.navigated) for (let i = 1; i <= Math.min(2, r.legTabs?.length || 1); i++) { const rr = brief(await M.readResults(page, `MLG-05-alt-leg${i}`)); const s = await sel(page, 'D40NA', `MLG-05-alt-leg${i}`); o.legs.push({ res: rr, select: s }); }
      o.confirm = await confirmLegs(page, 'MLG-05-alt');
      return o;
    });
  },

  'MLG-06': async (page, rec) => {
    await run(rec, '1-two-legs', async () => {
      await M.step1(page, 6);
      await M.fillLocal(page, { pickup: P.HEB, dd: false, date: D(16), time: '8:00 AM', hours: 6 }); const s1 = await M.save(page, 'MLG-06-l1');
      const f2 = await M.fillOut(page, { pickup: P.HEB, dests: [P.CHIK], dd: true, drop: P.YEL, dates: [D(17), D(17)], times: ['7:00 AM', '9:00 PM'] }, { go: false });
      const s2 = await M.save(page, 'MLG-06-l2'); return { s1, f2: f2.state, s2 };
    });
    await run(rec, '2-edit-leg2', async () => {
      await M.badge(page, 2); const pre = await pageState(page); const preShot = await snap(page, 'MLG-06-leg2-prefill');
      const dd = await M.toggleState(page, 'Drop at different location');
      const pl = await M.place(page, 'Search destination 1 location', ...P.NANDI);
      const s = await M.save(page, 'MLG-06-leg2-updated'); return { pre, preShot, ddPrefilled: dd, place: pl, save: s };
    });
    await run(rec, '3-edit-leg1', async () => {
      await M.badge(page, 1); const pre = await pageState(page); const preShot = await snap(page, 'MLG-06-leg1-prefill');
      const h = await M.setNum(page, PH.h, 8); const s = await M.save(page, 'MLG-06-leg1-updated'); return { pre, preShot, hours: h, save: s };
    });
    await run(rec, '4-delete-leg1', async () => {
      await M.deleteLeg(page, 1); return { after: await pageState(page), toasts: await M.toasts(page), shot: await snap(page, 'MLG-06-after-delete') };
    });
    await run(rec, '5-results', async () => {
      const t = await M.activeTab(page); const sk = t === 'Transfer' ? await M.skip(page, 'Transfer') : null;
      const fin = await finish(page, 'MLG-06'); return { tabBefore: t, skip: sk, ...fin, res: brief(fin.res) };
    });
  },

  'MLG-07': async (page, rec) => {
    await run(rec, '1-build', async () => {
      await M.step1(page, 20);
      await M.fillLocal(page, { pickup: P.WF, dd: false, date: D(18), time: '9:00 AM', hours: 8 }); const s1 = await M.save(page, 'MLG-07-l1');
      await M.skip(page, 'Outstation');
      await M.fillTrf(page, { from: P.HEB, to: P.NANDI, date: D(19), time: '10:00 AM' }, { go: false });
      const fin = await finish(page, 'MLG-07'); return { s1, ...fin, res: brief(fin.res) };
    });
    await run(rec, '2-compare', async () => { const o = []; for (const c of ['L45P', '45LBB', 'L45NV', 'L49NV']) o.push(await compare(page, c, 'MLG-07')); return { compare: o }; });
    await run(rec, '3-leg1-L45V', async () => ({ select: await sel(page, 'L45V', 'MLG-07-leg1') }));
    await run(rec, '4-leg2-capacity', async () => {
      const res = brief(await M.readResults(page, 'MLG-07-leg2'));
      const small = await sel(page, 'L9UB', 'MLG-07-leg2-L9UB');
      if (page.locator('.modal.show').first()) await L.closeModal(page).catch(() => {});
      const ok = await sel(page, 'P25AC', 'MLG-07-leg2-P25AC');
      const c = ok.isConfirm ? await confirmLegs(page, 'MLG-07-a') : null;
      return { res, small, ok, confirm: c };
    });
    await run(rec, '5-change-leg1', async () => {
      const r1 = brief(await M.clickLegTab(page, 1)); const s = await sel(page, 'L45P', 'MLG-07-leg1-L45P');
      const o = { r1, select: s, tabs: await M.legTabs(page) };
      if (s.isConfirm) o.confirm = await confirmLegs(page, 'MLG-07-b');
      else { const r2 = await M.clickLegTab(page, 2); o.leg2 = brief(r2); }
      return o;
    });
  },

  'MLG-08': async (page, rec) => {
    await run(rec, '1a-standalone-local', async () => {
      await L.home(page, 'Local');
      const pl = await L.place(page, PH.p, ...P.WF); await L.setDate(page, 0, D(20)); await L.setTime(page, 0, '9:00 AM');
      const h = L.active(page).locator(`input[placeholder="${PH.h}"]:visible`).first(); await h.fill('8'); await L.setPax(page, 9);
      const res = await L.search(page, 'MLG-08-sa-local'); const o = { place: pl, res: brief(res) };
      if (res.navigated) { o.details = await det(page, 'P16UB', 'MLG-08-sa-local'); const c = await L.confirmScreen(page, 'P16UB', 'MLG-08-sa-local'); o.confirm = c.out; await L.closeModal(page); }
      return o;
    });
    await run(rec, '1b-standalone-outstation', async () => {
      const f = await L.fill(page, { dd: false, pickup: P.WF, dests: [P.MYS], dates: [D(21), D(22)], times: ['7:00 AM', '8:00 PM'], pax: 9 });
      const res = await L.search(page, 'MLG-08-sa-out'); const o = { fill: f.places, res: brief(res) };
      if (res.navigated) { o.details = await det(page, 'P28AC', 'MLG-08-sa-out'); const c = await L.confirmScreen(page, 'P28AC', 'MLG-08-sa-out'); o.confirm = c.out; await L.closeModal(page); }
      return o;
    });
    await run(rec, '1c-standalone-transfer', async () => {
      await L.home(page, 'Transfer'); await page.locator('#home-transfer-tabs-tab-point').click().catch(() => {}); await page.waitForTimeout(700);
      await L.place(page, PH.p, ...P.WF); await L.place(page, PH.x, ...P.KIA); await L.setDate(page, 0, D(23)); await L.setTime(page, 0, '10:00 AM'); await L.setPax(page, 9);
      const res = await L.search(page, 'MLG-08-sa-trf'); const o = { res: brief(res) };
      if (res.navigated) {
        o.details = await det(page, 'L9UB', 'MLG-08-sa-trf');
        try { const c = await L.confirmScreen(page, 'L9UB', 'MLG-08-sa-trf'); o.confirm = c.out; await L.closeModal(page); }
        catch (e) { o.confirmError = String(e).slice(0, 200); o.sel = await sel(page, 'L9UB', 'MLG-08-sa-trf'); if (o.sel.isConfirm) o.confirm2 = await confirmLegs(page, 'MLG-08-sa-trf'); }
      }
      return o;
    });
    await run(rec, '2-multileg', async () => {
      await M.step1(page, 9);
      await M.fillLocal(page, { pickup: P.WF, dd: false, date: D(20), time: '9:00 AM', hours: 8 }); const s1 = await M.save(page, 'MLG-08-l1');
      await M.fillOut(page, { pickup: P.WF, dests: [P.MYS], dd: false, dates: [D(21), D(22)], times: ['7:00 AM', '8:00 PM'] }, { go: false }); const s2 = await M.save(page, 'MLG-08-l2');
      await M.fillTrf(page, { from: P.WF, to: P.KIA, date: D(23), time: '10:00 AM' }, { go: false });
      const fin = await finish(page, 'MLG-08'); const o = { s1, s2, ...fin, res: brief(fin.res), legs: [] };
      const V = ['P16UB', 'P28AC', 'L9UB'];
      if (fin.res?.navigated) for (let i = 0; i < 3; i++) { const rr = brief(await M.readResults(page, `MLG-08-leg${i + 1}`)); const d = await det(page, V[i], `MLG-08-leg${i + 1}`); const s = await sel(page, V[i], `MLG-08-leg${i + 1}`); o.legs.push({ res: rr, details: d, select: s }); }
      o.confirm = await confirmLegs(page, 'MLG-08');
      return o;
    });
  },

  'MLG-09': async (page, rec) => {
    await run(rec, '1-defaults', async () => {
      await M.step1(page, 30); const o = {};
      for (const t of ['Local', 'Outstation', 'Transfer']) { await M.tab(page, t); o[t] = await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().evaluate(e => ({ v: e.value, min: e.min, max: e.max })).catch(() => null); }
      o.label = norm(await M.legPane(page).innerText()).match(/Passengers[^A-Z+]*/)?.[0];
      return o;
    });
    await run(rec, '2-legs', async () => {
      const f1 = await M.fillOut(page, { pickup: P.YEL, dests: [P.HAS], dd: false, dates: [D(24), D(25)], times: ['7:00 AM', '8:00 PM'], pax: 55 });
      const s1 = await M.save(page, 'MLG-09-l1');
      const def = await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue();
      const t21 = await M.setNum(page, PH.n, 21); await page.mouse.click(5, 5); await page.waitForTimeout(400); const k21 = await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue(); const m21 = await M.msgs(page); const shot21 = await snap(page, 'MLG-09-trf-21');
      const t30 = await M.setNum(page, PH.n, 30); await page.mouse.click(5, 5); await page.waitForTimeout(400); const k30 = await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue();
      const f2 = await M.fillTrf(page, { from: P.RAJ, to: P.HUB, date: D(26), time: '8:00 AM', pax: 21 }, { go: false });
      await M.btn(page, 'Save!', 1200); const save21 = { toasts: await M.toasts(page), msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-09-save-21') };
      let save20 = null;
      if (!save21.legs?.badges?.some(b => /Transfer/.test(b))) { await M.setNum(page, PH.n, 20); save20 = await M.save(page, 'MLG-09-save-20'); }
      return { f1pax: f1.pax, s1, transferDefault: def, typed21: t21, kept21: k21, msgs21: m21, shot21, typed30: t30, kept30: k30, f2: f2.state, save21, save20 };
    });
    await run(rec, '3-change-total', async () => {
      await M.tripTrash(page); const after = await pageState(page); const shot = await snap(page, 'MLG-09-after-trash');
      const back = /Enter Number of Passengers/.test(norm(await page.locator(M.PANE).innerText())) && !(after.legs?.header || []).length;
      let next = null;
      if (back) { const i = M.totalInput(page); await i.fill('18'); await M.btn(page, 'Next', 1500); next = await pageState(page); }
      const badges = []; for (let n = 1; n <= ((next || after).legs?.badges?.length || 0); n++) { await M.badge(page, n); badges.push({ n, pax: await M.legPane(page).locator(`input[placeholder="${PH.n}"]:visible`).first().inputValue().catch(() => null), tab: await M.activeTab(page) }); }
      return { after, shot, back, next, badges, shot2: await snap(page, 'MLG-09-after-total-18') };
    });
    await run(rec, '4-results', async () => {
      const fin = await finish(page, 'MLG-09'); const o = { ...fin, res: brief(fin.res) };
      if (fin.res?.navigated) {
        o.leg1 = brief(await M.readResults(page, 'MLG-09-leg1'));
        o.sel45 = await sel(page, '45LBB', 'MLG-09-leg1-45LBB');
        o.popupButtons = await page.locator('.modal.show button').allInnerTexts().catch(() => []);
        if (await page.locator('.modal.show').count()) await L.closeModal(page);
        o.sel12 = await sel(page, 'D12TT', 'MLG-09-leg1-D12TT');
        if (o.sel12.isConfirm) o.confirmEarly = await confirmLegs(page, 'MLG-09-early');
        else if (await page.locator('.modal.show').count()) await L.closeModal(page);
        o.tabs = await M.legTabs(page);
        o.leg2 = brief(await M.readResults(page, 'MLG-09-leg2'));
        o.sel49 = await sel(page, 'D49NA', 'MLG-09-leg2-D49NA');
        o.confirm = await confirmLegs(page, 'MLG-09');
      }
      return o;
    });
  },

  'MLG-10': async (page, rec) => {
    await run(rec, '1-local-scope', async () => {
      await M.step1(page, 5); const o = {}; const base = { date: D(27), time: '9:00 AM', hours: 4 };
      await M.fillLocal(page, { ...base, pickup: P.CHE, dd: false }); await M.btn(page, 'Save!', 1500);
      o.A = { msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-10-A-chennai') };
      await M.fillLocal(page, { ...base, pickup: P.WF, dd: true, drop: P.KOCHI }, { go: !(await M.activeTab(page) === 'Local') }); await M.btn(page, 'Save!', 1500);
      o.B = { msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-10-B-kochi') };
      if (await M.activeTab(page) !== 'Local') await M.tab(page, 'Local');
      o.C = { place: await M.place(page, PH.x, ...P.MPAL), save: null }; o.C.save = await M.save(page, 'MLG-10-C-mysuru-palace');
      return o;
    });
    await run(rec, '2-out-trf', async () => {
      if (await M.activeTab(page) !== 'Outstation') await M.tab(page, 'Outstation');
      await M.fillOut(page, { pickup: P.DOM, dests: [P.HYD], dd: false, dates: [D(28), D(30)], times: ['7:00 AM', '8:00 PM'] }, { go: false });
      const s1 = await M.save(page, 'MLG-10-out-hyd');
      await M.fillTrf(page, { from: P.MAL, to: P.CHE, date: D(31), time: '8:00 AM' }, { go: !(await M.activeTab(page) === 'Transfer') });
      const s2 = await M.save(page, 'MLG-10-trf-che'); return { s1, s2 };
    });
    await run(rec, '3-results', async () => {
      const fin = await finish(page, 'MLG-10'); const o = { ...fin, res: brief(fin.res), legs: [] };
      if (fin.res?.navigated) for (let i = 1; i <= (fin.res.legTabs?.length || 1); i++) o.legs.push(brief(await M.clickLegTab(page, i)));
      return o;
    });
  },

  'MLG-11': async (page, rec) => {
    await run(rec, '1a-out-drop-before-pickup', async () => {
      await M.step1(page, 8);
      const f = await M.fillOut(page, { pickup: P.YEL, dests: [P.HAS], dd: false, dates: [D(30), D(29)], times: ['7:00 AM', '8:00 PM'] });
      await M.btn(page, 'Save!', 1500); return { fill: f.state, d1: f.d1, msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-11-1a') };
    });
    await run(rec, '1b-trf-drop-time-before', async () => {
      const f = await M.fillTrf(page, { from: P.YEL, to: P.HAS, date: D(31), time: '10:00 AM', dropDate: D(31), dropTime: '8:00 AM' });
      await M.btn(page, 'Save!', 1500); return { fill: f.state, t1: f.t1, msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-11-1b') };
    });
    await run(rec, '1c-local-yesterday', async () => {
      await M.fillLocal(page, { pickup: P.RAJ, dd: false, hours: 2 });
      const typed = await M.typeDate(page, 0, '2026-11-18'); const picked = await M.setDate(page, 0, '2026-11-18');
      await M.btn(page, 'Save!', 1500); return { typed, picked, msgs: await M.msgs(page), legs: await M.legList(page), form: await M.state(page), shot: await snap(page, 'MLG-11-1c') };
    });
    const leg2 = { A: [D(31), '10:00 AM'], B: [D(29), '10:00 AM'], C: [D(32), '8:00 AM'] };
    for (const [k, [d, t]] of Object.entries(leg2)) await run(rec, `2-3-leg2-${k}`, async () => {
      await M.step1(page, 8); await M.skip(page, 'Local');
      await M.fillOut(page, { pickup: P.YEL, dests: [P.HAS], dd: false, dates: [D(30), D(31)], times: ['7:00 AM', '8:00 PM'] }, { go: false }); const s1 = await M.save(page, `MLG-11-${k}-l1`);
      await M.fillTrf(page, { from: P.YEL, to: P.HAS, date: d, time: t }, { go: false }); const s2 = await M.save(page, `MLG-11-${k}-l2`);
      const fin = await finish(page, `MLG-11-${k}`); const o = { s1, s2, ...fin, res: brief(fin.res) };
      if (fin.res?.navigated) {
        o.leg1 = await sel(page, 'D12TT', `MLG-11-${k}-leg1`); o.leg2res = brief(await M.readResults(page, `MLG-11-${k}-leg2`)); o.leg2 = await sel(page, 'D12TT', `MLG-11-${k}-leg2`);
        o.confirm = await confirmLegs(page, `MLG-11-${k}`);
      }
      return o;
    });
  },

  'MLG-12': async (page, rec) => {
    const base = { pickup: P.MAR, dd: true, drop: P.SHIV, date: D(33), time: '8:00 AM' };
    await run(rec, '1-hours', async () => {
      await M.step1(page, 14); await M.fillLocal(page, base); const o = {};
      for (const h of ['0', '25']) { await M.setNum(page, PH.h, h); await M.btn(page, 'Save!', 1200); o[h] = { v: await M.legPane(page).locator(`input[placeholder="${PH.h}"]:visible`).inputValue(), msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, `MLG-12-h${h}`) }; }
      await M.setNum(page, PH.h, 1); o['1'] = await M.save(page, 'MLG-12-h1');
      return o;
    });
    await run(rec, '2-multiday', async () => {
      // Fresh Local leg (the hours-1 leg above stays only as evidence of acceptance). Multi-day ON.
      await M.step1(page, 14); await M.fillLocal(page, { pickup: P.MAR, dd: true, drop: P.SHIV });
      const md = await M.setToggle(page, 'Multi-day Trip', true); await page.waitForTimeout(700); const chipsOn = await M.chips(page);
      const pick = await M.pickDays(page, [D(33), D(35)]); const shotChips = await snap(page, 'MLG-12-chips');
      for (const c of await M.chips(page)) await M.removeChip(page, c).catch(() => {});
      await M.setTime(page, 0, '8:00 AM').catch(() => null);
      await M.btn(page, 'Save!', 1200); const zero = { chips: await M.chips(page), msgs: await M.msgs(page), legs: await M.legList(page), shot: await snap(page, 'MLG-12-zero-dates') };
      const again = await M.pickDays(page, [D(33), D(35)]);
      for (const c of await M.chips(page)) if (/Nov 19, 2026/.test(c)) await M.removeChip(page, c).catch(() => {});
      await M.setNum(page, PH.h, 24);
      const s = await M.save(page, 'MLG-12-md-24h');
      return { md, chipsOn, pick, shotChips, zero, again, chipsFinal: again.chips, save: s };
    });
    await run(rec, '3-results', async () => {
      const t = await M.activeTab(page); const skips = [];
      if (t === 'Outstation') { skips.push(await M.skip(page, 'Outstation')); }
      if ((await M.activeTab(page)) === 'Transfer') skips.push(await M.skip(page, 'Transfer'));
      const fin = await finish(page, 'MLG-12'); return { tab: t, skips, ...fin, res: brief(fin.res) };
    });
  },

  'MLG-13': async (page, rec) => {
    await run(rec, '1-destinations', async () => {
      await M.step1(page, 40); await M.skip(page, 'Local');
      const f = await M.fillOut(page, { pickup: P.EC, dests: [P.NANDI, P.CHIK, P.KOL], dd: true, drop: P.WF, dates: [D(36), D(37)], times: ['7:00 AM', '8:00 PM'] }, { go: false });
      const map = await L.mapInfo(page, null, 'MLG-13-1'); return { fill: f.state, places: f.places.map(p => p.chosen), map, shot: await snap(page, 'MLG-13-1-form', { fullPage: true }) };
    });
    await run(rec, '2-remove-dest2', async () => {
      const i2 = M.legPane(page).locator('input[placeholder="Search destination 2 location"]:visible').first();
      const btn = i2.locator('xpath=ancestor::div[.//button or .//img][1]').locator('button, img').last();
      await btn.click(); await page.waitForTimeout(900);
      const afterRemove = await M.state(page); const shotA = await snap(page, 'MLG-13-2-after-remove', { fullPage: true });
      await M.legPane(page).locator('button').filter({ hasText: /Add Another Destination/ }).first().click(); await page.waitForTimeout(700);
      const n = await M.legPane(page).locator('input[placeholder^="Search destination"]:visible').count();
      const pl = await M.place(page, `Search destination ${n} location`, ...P.CHIK);
      const map = await L.mapInfo(page, null, 'MLG-13-2'); return { afterRemove, shotA, destCount: n, place: pl, final: await M.state(page), map };
    });
    await run(rec, '3-results-fare', async () => {
      const s = await M.save(page, 'MLG-13'); const sk = await M.skip(page, 'Transfer'); const fin = await finish(page, 'MLG-13');
      const o = { save: s, skip: sk, ...fin, res: brief(fin.res) };
      if (fin.res?.navigated) { o.details = await det(page, 'P40AC', 'MLG-13'); o.select = await sel(page, 'P40AC', 'MLG-13'); o.confirm = await confirmLegs(page, 'MLG-13'); }
      return o;
    });
  },

  'MLG-14': async (page, rec) => {
    await run(rec, '1-transfer-options', async () => {
      await M.step1(page, 3); await M.skip(page, 'Local'); await M.skip(page, 'Outstation');
      const opts = await M.legPane(page).evaluate(r => [...r.querySelectorAll('input[type=radio], input[type=checkbox], label, [role=tab]')].filter(e => e.getBoundingClientRect().width).map(e => `${e.tagName}:${e.type || ''} ${(e.innerText || '').trim()}${e.checked ? ' CHK' : ''}`));
      return { tab: await M.activeTab(page), opts, form: await M.state(page), shot: await snap(page, 'MLG-14-transfer-tab') };
    });
    await run(rec, '2-two-transfer-legs', async () => {
      const a = await M.fillTrf(page, { from: P.JAY4, to: P.CHIK, date: D(38), time: '9:00 AM' }, { go: false });
      await M.addLeg(page);
      const b = await M.fillTrf(page, { legIdx: 1, from: P.CHIK, to: P.JAY4, date: D(38), time: '6:00 PM', dropDate: D(38), dropTime: '9:00 PM' }, { go: false });
      const shot = await snap(page, 'MLG-14-two-legs', { fullPage: true }); const s = await M.save(page, 'MLG-14');
      return { a: a.state, b: b.state, shot, save: s };
    });
    await run(rec, '3-results-fare', async () => {
      const fin = await finish(page, 'MLG-14'); const o = { ...fin, res: brief(fin.res), legs: [] };
      if (fin.res?.navigated) for (let i = 1; i <= 2; i++) { const rr = brief(await M.readResults(page, `MLG-14-leg${i}`)); const d = await det(page, 'D SDN', `MLG-14-leg${i}`); const s = await sel(page, 'D SDN', `MLG-14-leg${i}`); o.legs.push({ res: rr, details: d, select: s }); }
      o.confirm = await confirmLegs(page, 'MLG-14');
      return o;
    });
  },

  'MLG-15': async (page, rec) => {
    await run(rec, '1-build-select', async () => {
      await M.step1(page, 20);
      await M.fillLocal(page, { pickup: P.WF, dd: false, date: D(18), time: '9:00 AM', hours: 8 }); await M.save(page, 'MLG-15-l1');
      await M.skip(page, 'Outstation'); await M.fillTrf(page, { from: P.HEB, to: P.NANDI, date: D(19), time: '10:00 AM' }, { go: false });
      const fin = await finish(page, 'MLG-15'); const o = { ...fin, res: brief(fin.res) };
      if (fin.res?.navigated) { o.select = await sel(page, 'P40AC', 'MLG-15-leg1'); o.leg2 = brief(await M.readResults(page, 'MLG-15-leg2-before')); }
      return o;
    });
    await run(rec, '2-modify-leg1', async () => {
      const r1 = brief(await M.clickLegTab(page, 1));
      const pre = await L.modifyOpen(page, 'MLG-15-leg1'); pre.state = await M.state(page);
      pre.buttons = (await page.locator('.modal.show button').allInnerTexts()).map(norm).filter(Boolean);
      const h = await M.setNum(page, PH.h, 10);
      const save = await L.modifySave(page, 'MLG-15-leg1-saved').catch(e => ({ error: String(e).slice(0, 200) }));
      const toasts = await M.toasts(page);
      return { r1, pre, hours: h, toasts, save: brief(save) || save, tabs: await M.legTabs(page), after: brief(await M.readResults(page, 'MLG-15-leg1-after')) };
    });
    await run(rec, '3-modify-leg2', async () => {
      const r2 = brief(await M.clickLegTab(page, 2));
      const pre = await L.modifyOpen(page, 'MLG-15-leg2'); pre.state = await M.state(page);
      const pl = await M.place(page, PH.x, ...P.CHIK);
      const save = await L.modifySave(page, 'MLG-15-leg2-saved').catch(e => ({ error: String(e).slice(0, 200) }));
      const toasts = await M.toasts(page);
      const after2 = brief(await M.readResults(page, 'MLG-15-leg2-after')); const after1 = brief(await M.clickLegTab(page, 1));
      return { r2, pre, place: pl, toasts, save: brief(save) || save, after2, after1, tabs: await M.legTabs(page) };
    });
    await run(rec, '4-refresh', async () => {
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
      return { url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), res: brief(await M.readResults(page, 'MLG-15-after-refresh').catch(e => ({ error: String(e).slice(0, 150) }))) };
    });
  },

  'MLG-16': async (page, rec) => {
    await run(rec, '1-save-local-switch', async () => {
      await M.step1(page, 6); await M.fillLocal(page, { pickup: P.YEL, dd: false, date: D(40), time: '10:00 AM', hours: 3 }); const s = await M.save(page, 'MLG-16-l1');
      const n0 = L.netLog.length;
      await page.locator('a.nav-link').getByText('Local', { exact: true }).first().evaluate(e => e.click()); await page.waitForTimeout(1200);
      const lp = page.locator('.tab-pane.active').first();
      const local = await lp.evaluate(r => [...r.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width).map(e => `${e.placeholder || e.type}=${e.type === 'checkbox' ? e.checked : e.value}`));
      return { save: s, standaloneLocal: local, shot: await snap(page, 'MLG-16-standalone-local'), n0 };
    });
    await run(rec, '2-enter-hsr-back', async () => {
      const pl = await L.place(page, PH.p, ...P.HSR);
      await page.locator('#home-inquiry-tabs-tab-fourth').evaluate(e => e.click()); await page.waitForTimeout(1500);
      return { place: pl.chosen, multi: await pageState(page), text: norm(await page.locator(M.PANE).innerText()).slice(0, 300), shot: await snap(page, 'MLG-16-back-to-multi') };
    });
    await run(rec, '3-byhour-back', async () => {
      await page.locator('a.nav-link').getByText('Transfer', { exact: true }).first().evaluate(e => e.click()); await page.waitForTimeout(1000);
      await page.locator('#home-transfer-tabs-tab-hour').evaluate(e => e.click()); await page.waitForTimeout(1000);
      const byHour = await page.locator('#home-transfer-tabs-tabpane-hour, .tab-pane.active').last().evaluate(r => [...r.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width).map(e => `${e.placeholder || e.type}=${e.type === 'checkbox' ? e.checked : e.value}`)).catch(() => null);
      await page.locator('#home-inquiry-tabs-tab-fourth').evaluate(e => e.click()); await page.waitForTimeout(1500);
      return { byHour, multi: await pageState(page), text: norm(await page.locator(M.PANE).innerText()).slice(0, 300), shot: await snap(page, 'MLG-16-after-byhour'), draftCalls: L.netLog.filter(l => /draft/.test(l)) };
    });
  },

  'MLG-17': async (page, rec) => {
    await run(rec, '1-step1-button', async () => { await M.open(page); return { buttons: (await page.locator(`${M.PANE} button:visible`).allInnerTexts()).map(norm), shot: await snap(page, 'MLG-17-step1') }; });
    await run(rec, '2-save-draft', async () => {
      await M.step1(page, 8);
      await M.fillLocal(page, { pickup: P.HSR, dd: false, date: D(42), time: '9:00 AM', hours: 5 }); const s1 = await M.save(page, 'MLG-17-l1');
      await M.skip(page, 'Outstation');
      await M.fillTrf(page, { from: P.HSR, to: P.COORG, date: D(43), time: '7:00 AM' }, { go: false }); const s2 = await M.save(page, 'MLG-17-l2');
      const n0 = L.netLog.length; drafts(true);
      await M.btn(page, 'Save As Draft', 4000);
      drafts(false);
      const calls = L.netLog.slice(n0).filter(l => !/GetViewport|places\.googleapis/.test(l));
      return { s1, s2, toasts: await M.toasts(page), modal: await page.locator('.modal.show').allInnerTexts().catch(() => []), calls, draftCalls: calls.filter(c => /draft/.test(c)).length, url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), shot: await snap(page, 'MLG-17-after-draft') };
    });
  },

  'MLG-18': async (page, rec) => {
    drafts(true);
    await run(rec, '1-build', async () => {
      await M.step1(page, 18); await M.skip(page, 'Local');
      const f = await M.fillOut(page, { pickup: P.KOR, dests: [P.CHKM, P.BELUR], dd: true, drop: P.HAS, dates: [D(45), D(47)], times: ['7:00 AM', '7:00 PM'] }, { go: false });
      const s = await M.save(page, 'MLG-18'); const sk = await M.skip(page, 'Transfer'); const fin = await finish(page, 'MLG-18');
      return { fill: f.state, save: s, skip: sk, ...fin, res: brief(fin.res) };
    });
    await run(rec, '2-3-confirm', async () => {
      const d = await det(page, 'P21AC', 'MLG-18'); const s = await sel(page, 'P21AC', 'MLG-18');
      return { details: d, select: s, confirm: await confirmLegs(page, 'MLG-18', true) };
    });
    await run(rec, '3-submit', async () => {
      const m = page.locator('.modal.show').first(); if (!(await m.count())) return { skipped: 'no confirm modal' };
      return { submit: await L.submit(page, m, 'MLG-18') };
    });
    drafts(false);
    await run(rec, '4-my-inquiries', async () => myInq(page, 'MLG-18-post'));
  },
};

export default async ({ page }) => {
  const id = process.env.TC; const rec = { id, page, started: new Date().toISOString(), steps: [] };
  if (!CASES[id]) throw new Error(`unknown TC ${id}`);
  await L.guard(page);
  await CASES[id](page, rec);
  delete rec.page; rec.finished = new Date().toISOString(); rec.loads = L.loads;
  rec.net = L.netLog.filter(l => !/GetViewportInfo|crypto|fcm|popular|explore-fleet|places\.googleapis/.test(l));
  L.save(process.env.ONLY ? `${id}-rerun` : id, rec);
  const j = JSON.stringify(rec.steps.map(s => ({ label: s.label, err: s.error })));
  return j;
};
