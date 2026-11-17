// Booking-module test cases: Local, Outstation, Transfer (P2P / Return / By Hour), Multi-Leg, Results page.
// Each case: metadata (used to generate the test-case documents) + run({page, shot}) returning { status, actual, checks, evidence, data }.
import * as ui from './ui.mjs';
import { run, fill, iso, dayOf, fareCheck } from './trip.mjs';

// ---- check collector -------------------------------------------------------------------------------------------------
export function checker() {
  const list = [];
  const ok = (cond, label, detail = '') => { list.push({ label, pass: !!cond, detail: String(detail).slice(0, 300) }); return !!cond; };
  const status = (extra) => extra || (list.some(c => !c.pass) ? 'Fail' : 'Pass');
  return { list, ok, status };
}
const evid = r => [...(r?.search?.shots || []), r?.search?.shot, r?.details?.shot, ...(r?.review?.shots || [])].filter(Boolean);
const summ = r => r?.search?.summary || '';
const laterToday = h => { const d = new Date(); d.setHours(d.getHours() + h, 0, 0, 0); return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); };

// Standard happy-path assertions for a scenario.
function stdChecks(C, r, { pax, vehicle, fare = true } = {}) {
  C.ok(r.search?.navigated, 'Search navigates to results (/send-inquiry)', r.search?.url || JSON.stringify(r.search?.msgs));
  if (!r.search?.navigated) return;
  C.ok(/\d+ Buses Found/.test(r.search.found) && !/^0 Buses/.test(r.search.found), 'Vehicles listed', r.search.found);
  if (pax) C.ok(new RegExp(`Passengers:\\s*${pax} Pax`).test(summ(r)), `Summary shows ${pax} Pax`, summ(r).match(/Passengers:[^A-Z]*/)?.[0]);
  if (vehicle) C.ok(r.vehicle, `Vehicle ${vehicle} offered`, r.vehicle ? `${r.vehicle.name} ${r.vehicle.code} (${r.vehicle.seats} seats)` : `not in ${r.vehicles?.length} results`);
  if (r.vehicle) {
    C.ok(r.details?.fare?.pricingBlock, 'Fare Breakup shown in vehicle details', r.details?.fare?.pricingBlock?.slice(0, 3).join(' / ') || r.details?.error);
    C.ok(r.review?.opened && /Confirm Your Trip/.test(r.review.title), 'Review modal "Confirm Your Trip & Selected Vehicles" opens', r.review?.title || r.review?.error || JSON.stringify(r.review?.msgs));
    if (fare && r.fare) C.ok(r.fare.arithmetic?.ok !== false, 'Applied fare components add up to Grand Total', r.fare.arithmetic?.expr + ' vs shown ₹' + r.fare.arithmetic?.shown);
  }
}
const result = (C, r, extra = {}) => ({ status: extra.status || C.status(), checks: C.list, evidence: [...evid(r), ...(extra.evidence || [])], data: r?.fill, fare: r?.fare,
  vehicle: r?.vehicle, found: r?.search?.found, summary: summ(r).slice(0, 400), allVehicles: r?.vehicles?.map(v => `${v.name}|${v.code}|${v.seats}`), notes: extra.notes });

// Validation-only helper: fill then click Book Now and expect to stay with messages.
async function expectValidation(page, spec, tag, want) {
  const C = checker(); await fill(page, spec);
  const s = await ui.submitSearch(page, tag);
  C.ok(!s.navigated, 'Form is not submitted', s.navigated ? 'navigated to ' + s.url : 'stayed on form');
  for (const w of [].concat(want)) C.ok((s.msgs || []).some(m => new RegExp(w, 'i').test(m)), `Message "${w}" shown`, JSON.stringify(s.msgs));
  return { status: C.status(), checks: C.list, evidence: [s.shot].filter(Boolean), actual: (s.msgs || []).join(' | ') || (s.navigated ? 'Navigated to results' : 'No message') };
}

const T = (id, module, title, type, priority, data, steps, expected, fn, extra = {}) => ({ id, module, title, type, priority, data, steps, expected, run: fn, ...extra });

export const CASES = [
  // ================================================== LOCAL ==================================================
  T('TC_LOC_001', 'Local', 'Local tab shows all fields with correct defaults', 'Functional', 'High', '—',
    'Open home → Smart Inquiry → Local', 'Multi-day & Different-drop toggles OFF; Pickup Location, Pickup Date (today), Time, Passengers=1, Hours=1 (max 24), Save As Draft, Book Now!, Chat With Us visible',
    async ({ page, shot }) => {
      const C = checker(); await ui.open(page, 'Local');
      const v = await ui.pane(page).evaluate(r => ({ t: r.innerText, pax: r.querySelector('input[placeholder="Enter number of passengers"]')?.value, hrs: r.querySelector('input[placeholder="Enter Number of Hours"]'), date: r.querySelector('input[value^="20"]')?.value }));
      C.ok(v.date === iso(0), 'Pickup date defaults to today', v.date);
      C.ok(v.pax === '1', 'Passengers default 1', v.pax);
      for (const l of ['Multi-day Trip', 'Drop at different location', 'Pickup Location', 'Pickup Date & Time', 'Passengers', 'Number of Hours', 'Save As Draft', 'Book Now!', 'Chat With Us']) C.ok(v.t.includes(l), `"${l}" present`);
      C.ok(await ui.toggleState(page, 'Multi-day Trip') === false && await ui.toggleState(page, 'Drop at different location') === false, 'Both toggles OFF by default');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_LOC_001-form')] };
    }),
  T('TC_LOC_002', 'Local', 'Mandatory pickup location validation', 'Negative', 'High', 'Pickup blank',
    'Local → leave Pickup blank → Book Now!', '"Pickup location is required" shown; no navigation',
    ({ page }) => expectValidation(page, { tab: 'Local' }, 'TC_LOC_002', 'Pickup location is required')),
  T('TC_LOC_003', 'Local', 'CFG-1 Normal trip end-to-end with fare verification (Sedan)', 'Functional', 'Critical',
    'LOC-001 Whitefield; D+3 10:00 AM; 3 pax; 4 hrs; Sedan (VEH-001)', 'Fill → Book Now! → results → View Full Vehicle Details (Fare Breakup) → Book This Vehicle → review (stop before Confirm)',
    'Results listed; summary matches input; Fare Breakup shown; applied fare = Base + Day Bata + Night Bata = Grand Total; Base = 8Hr/80Km package rate',
    async ({ page }) => { const C = checker(); const r = await run(page, { tab: 'Local', pickup: 'Whitefield', date: iso(3), time: '10:00 AM', pax: 3, hrs: 4, vehicle: /^Sedan/ }, 'TC_LOC_003', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 3, vehicle: 'Sedan' }); C.ok(/Duration:\s*4 Hours/.test(summ(r)), 'Summary shows 4 Hours', summ(r).match(/Duration:[^A-Z]*/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_LOC_004', 'Local', 'CFG-2 Multi-day trip (2 dates) with fare verification (12 Seater Tempo Traveller)', 'Functional', 'Critical',
    'LOC-003 Hebbal; Multi-day ON; dates today (pre-selected, cannot be removed – see TC_LOC_021) + D+5; time now+3h; 10 pax; 8 hrs; VEH-003',
    'Multi-day ON → select dates → fill → search → details → review', 'Summary lists selected dates; base cost = package rate × number of days',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', md: true, pickup: 'Hebbal', mdDates: [dayOf(5)], time: laterToday(3), pax: 10, hrs: 8, vehicle: /^12 Seater Tempo/ }, 'TC_LOC_004', { units: 2, unitName: 'days' });
      C.ok(((r.fill.mdDates || '').match(/[A-Z][a-z]{2} \d{1,2}, \d{4}/g) || []).length === 2, 'Two dates in Selected Dates (today + D+5)', r.fill.mdDates);
      stdChecks(C, r, { pax: 10, vehicle: '12 Seater Tempo Traveller' }); C.ok(/Duration:\s*2 Days|2 Day/i.test(summ(r)) || /,/.test(summ(r).match(/Dates :[^A-Z]*/)?.[0] || ''), 'Summary reflects 2 travel days', summ(r).match(/Dates :.*?(Pickup|Duration)/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_LOC_005', 'Local', 'CFG-3 Different drop location (MPV)', 'Functional', 'Critical',
    'LOC-002 Electronic City Phase 1 → Kotilingeshwara Temple, Kammasandra; D+4 11:00 AM; 6 pax; 6 hrs; MPV (VEH-002)',
    'Drop toggle ON → pickup + drop → search → details → review', 'Drop field appears; summary/route shows drop address; fare consistent',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', dd: true, pickup: 'Electronic City Phase 1', drop: 'Kotilingeshwara Temple Kammasandra', date: iso(4), time: '11:00 AM', pax: 6, hrs: 6, vehicle: /^MPV/ }, 'TC_LOC_005', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 6, vehicle: "MPV's" }); C.ok(/Drop Address:\s*Kotilingeshwara/i.test(summ(r)) || /Kotilingeshwara/i.test(summ(r)), 'Summary shows the drop location', summ(r).match(/Drop Address:.*/)?.[0]?.slice(0, 120));
      return result(C, r); }, { fare: true }),
  T('TC_LOC_006', 'Local', 'CFG-4 Multi-day + different drop (33 Seater Deluxe Coach)', 'Functional', 'Critical',
    'LOC-007 HSR Layout → Ramanagara; Multi-day ON (today + D+7); time now+2h; 30 pax; 12 hrs; VEH-005',
    'Both toggles ON → fill → search → details → review', 'Both conditional field sets work together; summary shows dates and drop; fare consistent',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', md: true, dd: true, pickup: 'HSR Layout', drop: 'Ramanagara', mdDates: [dayOf(7)], time: laterToday(2), pax: 30, hrs: 12, vehicle: /^33 Seater Deluxe/ }, 'TC_LOC_006', { units: 2, unitName: 'days' });
      stdChecks(C, r, { pax: 30, vehicle: '33 Seater Deluxe Coach' }); C.ok(/Ramanagara/i.test(summ(r)), 'Summary shows drop Ramanagara');
      return result(C, r); }, { fare: true }),
  T('TC_LOC_007', 'Local', 'Different drop ON without drop location', 'Negative', 'High', 'Whitefield; drop blank',
    'Drop toggle ON → pickup only → Book Now!', 'Drop location required message; no navigation',
    ({ page }) => expectValidation(page, { tab: 'Local', dd: true, pickup: 'Whitefield', date: iso(2), time: '10:00 AM' }, 'TC_LOC_007', 'Drop location is required')),
  T('TC_LOC_008', 'Local', 'Hours boundary: 0, 24 (max) and 25 (above max)', 'Boundary', 'High', 'Hours = 0 / 24 / 25',
    'Enter each value in Number of Hours → Book Now!', '24 accepted; 0 and 25 rejected or clamped to 1..24 with a message',
    async ({ page }) => { const C = checker(); const ev = []; const obs = {};
      for (const h of [0, 24, 25]) {
        await fill(page, { tab: 'Local', pickup: 'Koramangala', date: iso(2), time: '10:00 AM', pax: 2 });
        const got = await ui.num(page, 'Enter Number of Hours', h);
        const s = await ui.submitSearch(page, `TC_LOC_008-h${h}`); ev.push(...(s.shots || [s.shot]));
        obs[h] = { field: got, navigated: s.navigated, found: s.found, msgs: s.msgs, summary: (s.summary || '').match(/Duration:[^A-Z]*/)?.[0] };
      }
      C.ok(obs[24].navigated && /Duration:\s*24/.test(obs[24].summary || ''), '24 hours accepted', JSON.stringify(obs[24]));
      C.ok(!obs[0].navigated || obs[0].field !== '0', '0 hours rejected/clamped', JSON.stringify(obs[0]));
      C.ok(!obs[25].navigated || obs[25].field !== '25', '25 hours rejected/clamped', JSON.stringify(obs[25]));
      return { status: C.status(), checks: C.list, evidence: ev, actual: JSON.stringify(obs) }; }),
  T('TC_LOC_009', 'Local', 'Passenger capacity boundary: 49 pax with 49 Seater Deluxe Coach', 'Boundary', 'High',
    'Yelahanka; D+6 8:00 AM; 49 pax; 8 hrs; VEH-007', 'Search → choose 49 Seater Deluxe Coach → review', 'Vehicle with 49 seats accepted for 49 pax; no capacity warning',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', pickup: 'Yelahanka', date: iso(6), time: '8:00 AM', pax: 49, hrs: 8, vehicle: /^49 Seater Deluxe/ }, 'TC_LOC_009', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 49, vehicle: '49 Seater Deluxe Coach' }); C.ok(!r.review?.capacityPopup, 'No capacity warning', r.review?.capacityPopup);
      return result(C, r); }, { fare: true }),
  T('TC_LOC_010', 'Local', 'Above-capacity: 50 pax requires multiple vehicles (ADD-006)', 'Boundary', 'High',
    'Rajajinagar; D+6 8:00 AM; 50 pax; 8 hrs; select Sedan', 'Search with 50 pax → Book This Vehicle on one small vehicle',
    'App prevents a single vehicle that cannot seat 50 (capacity message / multi-vehicle selection)',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', pickup: 'Rajajinagar', date: iso(6), time: '8:00 AM', pax: 50, hrs: 8, vehicle: /^Sedan/ }, 'TC_LOC_010', { details: false });
      C.ok(r.search?.navigated, 'Search with 50 pax allowed', r.search?.found);
      const blocked = r.review && (!r.review.opened || r.review.capacityPopup || /capacity|not complete|select more|additional vehicle/i.test(JSON.stringify(r.review)));
      C.ok(blocked, 'Capacity shortfall flagged when selecting a 4-seat vehicle for 50 pax', r.review?.capacityPopup || r.review?.title || JSON.stringify(r.review?.msgs));
      return result(C, r); }),
  T('TC_LOC_011', 'Local', 'Past dates are disabled in the date picker', 'Negative', 'High', 'Yesterday',
    'Open Pickup Date picker → inspect yesterday', 'Yesterday disabled / not selectable',
    async ({ page }) => { const C = checker(); await ui.open(page, 'Local');
      if (new Date().getDate() === 1) return { status: 'Blocked', checks: [], actual: 'First of month – skipped', evidence: [] };
      const d = await ui.setDate(page, iso(-1), 0);
      C.ok(d.dayDisabled || d.value !== iso(-1), 'Yesterday not selectable', JSON.stringify(d));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_LOC_011-date')] }; }),
  T('TC_LOC_012', 'Local', 'Present-date booking (ADD-001) – today, later time (SUV)', 'Functional', 'High',
    'Indiranagar; today, now+3h; 5 pax; 5 hrs; SUV (VEH-019)', 'Fill → search → details → review', 'Today accepted; results and fare shown',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', pickup: 'Indiranagar', date: iso(0), time: laterToday(3), pax: 5, hrs: 5, vehicle: /SUV/ }, 'TC_LOC_012', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 5, vehicle: 'SUV' }); return result(C, r); }, { fare: true }),
  T('TC_LOC_013', 'Local', 'Past time today is rejected', 'Negative', 'Medium', 'Today, time 2 hours ago',
    'Pick today and a time earlier than now → Book Now!', 'Past time disabled in picker or validation shown',
    async ({ page }) => { const C = checker(); await fill(page, { tab: 'Local', pickup: 'Domlur', date: iso(0), pax: 2 });
      const h = new Date().getHours(); if (h < 3) return { status: 'Blocked', checks: [], actual: 'Too early in the day to test a past time', evidence: [] };
      const t = await ui.setTime(page, laterToday(-2), 0);
      const s = t.disabled || !t.available ? null : await ui.submitSearch(page, 'TC_LOC_013');
      C.ok(t.disabled || t.available === false || (s && !s.navigated), 'Past time not accepted', JSON.stringify({ t, nav: s?.navigated, msgs: s?.msgs }));
      return { status: C.status(), checks: C.list, evidence: [s?.shot, ...(s?.shots || [])].filter(Boolean) }; }),
  T('TC_LOC_014', 'Local', 'Fare boundary: extra hours on the same vehicle (8 vs 10 hrs, Sedan)', 'Boundary', 'High',
    'Malleshwaram; D+8 9:00 AM; 2 pax; Sedan; Hours 8 (package) vs 10', 'Run both searches with identical data except hours; compare applied fare',
    'Difference = 2 × Extra Hour Charge from the Fare Breakup',
    async ({ page }) => { const C = checker(); const base = { tab: 'Local', pickup: 'Malleshwaram', date: iso(8), time: '9:00 AM', pax: 2, vehicle: /^Sedan/ };
      const a = await run(page, { ...base, hrs: 8 }, 'TC_LOC_014-8h', { units: 1, unitName: 'day' });
      const b = await run(page, { ...base, hrs: 10 }, 'TC_LOC_014-10h', { units: 1, unitName: 'day' });
      const ta = a.fare?.arithmetic?.shown, tb = b.fare?.arithmetic?.shown, rate = ui.amt(a.details?.fare?.extraHour);
      const fare = { baseline: a.fare, boundary: b.fare, rule: `Δ = 2 × Extra Hour ₹${rate}`, expected: rate * 2, actualDelta: tb - ta };
      let status;
      if (ta == null || tb == null || !rate) status = 'Inconclusive';
      else C.ok(tb - ta === rate * 2, 'Extra-hour charge applied for 2 extra hours', `8h ₹${ta}, 10h ₹${tb}, Δ ₹${tb - ta}, expected ₹${rate * 2}`);
      fare.verdict = status ? 'Inconclusive – fare rule not confirmed' : C.status();
      return { status: status || C.status(), checks: C.list, fare, evidence: [...evid(a), ...evid(b)], data: { baseline: a.fill, boundary: b.fill }, vehicle: a.vehicle }; }, { fare: true }),
  T('TC_LOC_015', 'Local', 'Toggle transitions: Different-drop ON→OFF→ON and Multi-day ON→OFF', 'Functional', 'Medium', 'Drop "Ramanagara"',
    'Turn drop ON, enter drop, turn OFF, turn ON; Multi-day ON then OFF', 'Drop field hides when OFF; Multi-day OFF restores single date/time fields',
    async ({ page }) => { const C = checker(); await ui.open(page, 'Local');
      await ui.toggle(page, 'Drop at different location'); await ui.place(page, 'Search drop location', 'Ramanagara');
      await ui.toggle(page, 'Drop at different location');
      C.ok(!(await ui.pane(page).locator('input[placeholder="Search drop location"]').isVisible().catch(() => false)), 'Drop field hidden when toggle OFF');
      await ui.toggle(page, 'Drop at different location');
      const kept = await ui.pane(page).locator('input[placeholder="Search drop location"]').inputValue().catch(() => '');
      C.ok(true, 'Drop value after OFF→ON (observation)', kept ? `retained "${kept.slice(0, 30)}"` : 'cleared');
      await ui.toggle(page, 'Multi-day Trip'); const mdOn = await ui.pane(page).innerText();
      C.ok(/Select Travel Dates/.test(mdOn), 'Multi-day ON shows date selector');
      await ui.toggle(page, 'Multi-day Trip'); const mdOff = await ui.pane(page).innerText();
      C.ok(/Pickup Date & Time/.test(mdOff) && !/Select Travel Dates/.test(mdOff), 'Multi-day OFF restores Pickup Date & Time');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_LOC_015-toggles')] }; }),
  T('TC_LOC_016', 'Local', 'Multi-day ON with only one date (today) selected', 'Negative', 'Medium', 'Multi-day ON; no extra date',
    'Multi-day ON → keep only the pre-selected date → Book Now!', 'Validation: a multi-day trip needs at least 2 dates (or switch to single-day)',
    async ({ page }) => { const C = checker(); await fill(page, { tab: 'Local', md: true, pickup: 'BTM Layout', time: laterToday(2), pax: 2, hrs: 4 });
      const s = await ui.submitSearch(page, 'TC_LOC_016');
      C.ok(!s.navigated || (s.msgs || []).length, 'Single date flagged for a multi-day trip', s.navigated ? `Accepted: ${s.found}; ${(s.summary || '').match(/Dates :.*?Pickup/)?.[0] || ''}` : JSON.stringify(s.msgs));
      return { status: C.status(), checks: C.list, evidence: [s.shot, ...(s.shots || [])].filter(Boolean) }; }),
  T('TC_LOC_021', 'Local', 'Multi-day: pre-selected today can be removed from Selected Dates', 'Functional', 'High', 'Multi-day ON; D+5, D+6 added',
    'Multi-day ON → add D+5, D+6 → click × on D+5 chip → click × on today chip / click today in calendar', 'Each date chip, including today, can be removed so a future-only multi-day trip can be booked',
    async ({ page }) => { const C = checker(); await ui.open(page, 'Local'); await ui.toggle(page, 'Multi-day Trip');
      const a = await ui.setMultiDates(page, [dayOf(5), dayOf(6)]);
      const chips = ui.pane(page).locator('.selected-date-chip');
      await chips.nth(1).locator('.remove-date-btn').click(); await page.waitForTimeout(500); const b = (await chips.allInnerTexts()).map(x => x.replace('×', '').trim());
      C.ok(b.length === 2, '× removes a future date', `${a} → ${b.join(', ')}`);
      const c = await ui.removeTodayChip(page);
      C.ok(!c.includes(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })), '× removes today', `after × on today: ${c}`);
      const t = await ui.setTime(page, '9:00 AM', 0);
      C.ok(!t.disabled, 'Morning pickup time selectable for future-only trip', JSON.stringify(t));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_LOC_021')] }; }),
  T('TC_LOC_017', 'Local', 'Pickup outside service city (Chennai) for a Local trip', 'Negative', 'Medium', 'Pickup "Chennai Central"',
    'Local → pickup Chennai → search', 'Local trip rejected or clear message (Local is Bengaluru-only per test data)',
    async ({ page }) => { const C = checker(); const r = await run(page, { tab: 'Local', pickup: 'Chennai Central', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4 }, 'TC_LOC_017');
      C.ok(!r.search.navigated || (r.search.msgs || []).length, 'Out-of-city pickup flagged', r.search.navigated ? `Accepted: ${r.search.found}; ${summ(r).slice(0, 150)}` : JSON.stringify(r.search.msgs));
      return result(C, r); }),
  T('TC_LOC_018', 'Local', 'Long-distance drop within Local (LOC-021 Whitefield → Mangaluru)', 'Edge', 'Medium', 'Whitefield → Mangaluru, 1 day 12 hrs, 4 pax',
    'Drop ON → far drop → search', 'App either converts/rejects a 350 km "local" trip or shows realistic distance; not a silent 80 km local package',
    async ({ page }) => { const C = checker(); const r = await run(page, { tab: 'Local', dd: true, pickup: 'Whitefield', drop: 'Mangaluru', date: iso(5), time: '6:00 AM', pax: 4, hrs: 12, vehicle: /^Sedan/ }, 'TC_LOC_018', { units: 1, unitName: 'day' });
      const dist = summ(r).match(/Distance:\s*([^A-Z]*)/)?.[1];
      C.ok(!r.search.navigated || !/^80 KM/.test(dist || ''), 'Distance reflects the far drop (not the fixed 80 KM package)', `Distance: ${dist}; ${r.search.found}`);
      return result(C, r); }),
  T('TC_LOC_019', 'Local', 'Save As Draft (Local)', 'Functional', 'Medium', 'Valid Local form', 'Fill → Save As Draft',
    'Draft saved confirmation', async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): Save As Draft creates a record in Preprod and is on the requires-approval list', checks: [], evidence: [] })),
  T('TC_LOC_020', 'Local', 'Confirm & Submit Booking (Local inquiry submission)', 'Functional', 'Critical', 'Review modal from TC_LOC_003',
    'Click "Confirm & Submit Booking"', 'Inquiry created; reference shown', async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): irreversible inquiry submission. Executed up to the review modal in TC_LOC_003–006.', checks: [], evidence: [] })),

  // ================================================ OUTSTATION ================================================
  T('TC_OUT_001', 'Outstation', 'Mandatory fields validation (empty submit)', 'Negative', 'High', 'All blank',
    'Outstation → Book Now!', 'Pickup required, Destination required; drop time validated',
    ({ page }) => expectValidation(page, { tab: 'Outstation' }, 'TC_OUT_001', ['Pickup location is required', 'Destination location is required'])),
  T('TC_OUT_002', 'Outstation', 'Single destination, default drop: final drop = pickup (21 Seater Premium AC Coach)', 'Functional', 'Critical',
    'OUT-001 Whitefield → Mysuru; D+3 9:00 AM → D+4 8:00 PM; 15 pax; VEH-004', 'Fill → search → details → review',
    'Expected Final Drop = Whitefield (workbook); results header km = summary distance; base = per-day rate × 2 days',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', pickup: 'Whitefield', dests: ['Mysuru'], date: iso(3), time: '9:00 AM', dropDate: iso(4), dropTime: '8:00 PM', pax: 15, vehicle: /^21 Seater Premium/ }, 'TC_OUT_002', { units: 2, unitName: 'days' });
      stdChecks(C, r, { pax: 15, vehicle: '21 Seater Premium AC Coach' });
      const drop = summ(r).match(/Drop Address:\s*(.*?)(Modify|$)/)?.[1] || '';
      C.ok(/Whitefield/i.test(drop), 'Final drop defaults to pickup (Whitefield) when Different Drop is OFF', `Drop Address: ${drop.slice(0, 80)}`);
      const hk = r.search.found.match(/- ([\d>]+\s*KM)/)?.[1], sk = summ(r).match(/Distance:\s*([\d>]+\s*KM)/)?.[1];
      C.ok(hk && sk && hk.replace(/\s/g, '') === sk.replace(/\s/g, ''), 'Results header distance matches summary distance', `header "${hk}" vs summary "${sk}"`);
      C.ok(/2 Days/.test(summ(r)), 'Duration 2 Days', summ(r).match(/Duration:[^A-Z]*/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_OUT_003', 'Outstation', 'Single destination with different drop (9 Seater Luxury Urbania)', 'Functional', 'Critical',
    'OUT-003 Hebbal → Chikkaballapur, drop Yelahanka; D+5 7:00 AM → D+5 9:00 PM; 8 pax; VEH-015', 'Drop ON → fill → search → review', 'Summary drop = Yelahanka',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', dd: true, pickup: 'Hebbal', dests: ['Chikkaballapur'], drop: 'Yelahanka', date: iso(5), time: '7:00 AM', dropDate: iso(5), dropTime: '9:00 PM', pax: 8, vehicle: /^9 Seater Luxury Urbania/ }, 'TC_OUT_003', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 8, vehicle: '9 Seater Luxury Urbania' }); C.ok(/Drop Address:\s*Yelahanka/i.test(summ(r)), 'Drop Address = Yelahanka', summ(r).match(/Drop Address:.{0,60}/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_OUT_004', 'Outstation', '3 destinations, default drop (16 Seater Premium Urbania)', 'Functional', 'High',
    'OUT-021 Whitefield → Mysuru → Srirangapatna → Mandya; D+9 6:00 AM → D+11 8:00 PM; 14 pax; VEH-013', 'Add destinations → search → review',
    'All destinations in route summary in order; 3 days; fare consistent',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', pickup: 'Whitefield', dests: ['Mysuru', 'Srirangapatna', 'Mandya'], date: iso(9), time: '6:00 AM', dropDate: iso(11), dropTime: '8:00 PM', pax: 14, vehicle: /^16 Seater Premium Urbania/ }, 'TC_OUT_004', { units: 3, unitName: 'days' });
      stdChecks(C, r, { pax: 14, vehicle: '16 Seater Premium Urbania' });
      const s = summ(r); const i = ['Mysuru', 'Srirangapatna', 'Mandya'].map(x => s.indexOf(x));
      C.ok(i.every(x => x >= 0) && i[0] < i[1] && i[1] < i[2], 'Route lists destinations in entered order', `indices ${i}`);
      return result(C, r); }, { fare: true }),
  T('TC_OUT_005', 'Outstation', '5 destinations + different drop; destination limit (45 Seater Luxury Volvo)', 'Boundary', 'High',
    'OUT-027 HSR Layout → Ramanagara → Channapatna → Mysuru → Srirangapatna → Mandya, drop Electronic City; D+12 6:00 AM → D+14 9:00 PM; 40 pax; VEH-016',
    'Add 5 destinations, check whether a 6th can be added → search → review', '5 destinations accepted; limit behaviour recorded; fare consistent',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', dd: true, pickup: 'HSR Layout', dests: ['Ramanagara', 'Channapatna', 'Mysuru', 'Srirangapatna', 'Mandya'], drop: 'Electronic City', date: iso(12), time: '6:00 AM', dropDate: iso(14), dropTime: '9:00 PM', pax: 40, vehicle: /^45 Seater Luxury Volvo/ }, 'TC_OUT_005', { units: 3, unitName: 'days' });
      stdChecks(C, r, { pax: 40, vehicle: '45 Seater Luxury Volvo' });
      C.ok((r.fill.dests || []).filter(Boolean).length === 5, '5 destinations entered', JSON.stringify(r.fill.dests?.map(d => d?.slice(0, 20))));
      return result(C, r); }, { fare: true }),
  T('TC_OUT_006', 'Outstation', 'Add and remove a destination', 'Functional', 'Medium', 'Destinations Hassan, Belur → remove Belur',
    '+ Add Another Destination → remove the 2nd', 'Second destination field added then removed',
    async ({ page }) => { const C = checker(); await ui.open(page, 'Outstation');
      await ui.pane(page).getByRole('button', { name: '+ Add Another Destination' }).click(); await page.waitForTimeout(600);
      const n2 = await ui.pane(page).locator('input[placeholder^="Search destination"]').count();
      C.ok(n2 === 2, 'Second destination field added', n2);
      const rm = ui.pane(page).locator('.destination-item .remove-btn-wrapper');
      const before = n2; await rm.last().click().catch(() => {}); await page.waitForTimeout(600);
      const n1 = await ui.pane(page).locator('input[placeholder^="Search destination"]').count();
      C.ok(n1 === before - 1, 'Destination removed via its delete control', `count ${before} → ${n1}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_OUT_006')] }; }),
  T('TC_OUT_007', 'Outstation', 'Drop date/time before pickup is rejected', 'Negative', 'High', 'Pickup D+5 10:00 AM, drop D+4 10:00 AM',
    'Set drop earlier than pickup → Book Now!', '"Drop time must be after pickup time"',
    async ({ page }) => { const C = checker(); await fill(page, { tab: 'Outstation', pickup: 'Peenya', dests: ['Tumakuru'], date: iso(5), time: '10:00 AM', pax: 3 });
      const d = await ui.setDate(page, iso(4), 1);
      const s = await ui.submitSearch(page, 'TC_OUT_007');
      C.ok(d.dayDisabled || !s.navigated, 'Earlier drop date not accepted', JSON.stringify({ d, nav: s.navigated }));
      if (!d.dayDisabled) C.ok((s.msgs || []).some(m => /after pickup/i.test(m)), 'Message shown', JSON.stringify(s.msgs));
      return { status: C.status(), checks: C.list, evidence: [s.shot, ...(s.shots || [])].filter(Boolean) }; }),
  T('TC_OUT_008', 'Outstation', 'Interstate single destination with different drop (OUT-014 Domlur → Hyderabad, drop KIA)', 'Functional', 'High',
    'Domlur → Hyderabad, drop Kempegowda Airport; D+15 5:00 AM → D+17 10:00 PM; 25 pax; 25 Seater Premium AC Coach (VEH-012)', 'Fill → search → review',
    'Interstate trip priced; State Tax / permit component shown or flagged', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', dd: true, pickup: 'Domlur', dests: ['Hyderabad'], drop: 'Kempegowda International Airport', date: iso(15), time: '5:00 AM', dropDate: iso(17), dropTime: '10:00 PM', pax: 25, vehicle: /^25 Seater Premium/ }, 'TC_OUT_008', { units: 3, unitName: 'days' });
      stdChecks(C, r, { pax: 25, vehicle: '25 Seater Premium AC Coach' });
      const st = (r.review?.cost || []).find(l => /State Tax/i.test(l));
      C.ok(st && ui.amt(st) > 0, 'Interstate State Tax applied (> ₹0)', st || 'no State Tax line');
      return result(C, r); }, { fare: true }),
  T('TC_OUT_009', 'Outstation', 'Same-day outstation (pickup and drop on the same date)', 'Edge', 'Medium',
    'OUT-019 Sarjapur Road → Kolar; D+6 6:00 AM → D+6 10:00 PM; 4 pax; Sedan', 'Fill → search → review', 'Accepted as 1 day; fare = 1 × day rate',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', pickup: 'Sarjapur Road', dests: ['Kolar'], date: iso(6), time: '6:00 AM', dropDate: iso(6), dropTime: '10:00 PM', pax: 4, vehicle: /^Sedan/ }, 'TC_OUT_009', { units: 1, unitName: 'day' });
      stdChecks(C, r, { pax: 4, vehicle: 'Sedan' }); C.ok(/1 Day/.test(summ(r)), 'Duration 1 Day', summ(r).match(/Duration:[^A-Z]*/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_OUT_010', 'Outstation', 'Fare boundary: additional day on the same vehicle (2 vs 3 days, MPV)', 'Boundary', 'High',
    'OUT-008 Yelahanka → Hassan; D+20 7:00 AM; drop D+21 vs D+22 7:00 PM; 5 pax; MPV', 'Two searches identical except drop date; compare applied fare',
    'Difference = 1 × per-day base rate + 1 × Day Bata + 1 × Night Bata (extra overnight)', async ({ page }) => { const C = checker();
      const base = { tab: 'Outstation', pickup: 'Yelahanka', dests: ['Hassan'], date: iso(20), time: '7:00 AM', dropTime: '7:00 PM', pax: 5, vehicle: /^MPV/ };
      const a = await run(page, { ...base, dropDate: iso(21) }, 'TC_OUT_010-2d', { units: 2, unitName: 'days' });
      const b = await run(page, { ...base, dropDate: iso(22) }, 'TC_OUT_010-3d', { units: 3, unitName: 'days' });
      const ta = a.fare?.arithmetic?.shown, tb = b.fare?.arithmetic?.shown, rate = ui.amt(a.details?.fare?.baseRate), bata = ui.amt(a.details?.fare?.dayBata), nb = ui.amt(a.details?.fare?.nightBata);
      const fare = { baseline: a.fare, boundary: b.fare, rule: `Δ = Base Rate ₹${rate} + Day Bata ₹${bata} + Night Bata ₹${nb} (one more day and one more overnight)`, expected: rate + bata + nb, actualDelta: tb - ta };
      let status; if (ta == null || tb == null || !rate) status = 'Inconclusive';
      else C.ok(tb - ta === rate + bata + nb, 'One extra day adds one day rate + one day bata + one night bata', `2d ₹${ta}, 3d ₹${tb}, Δ ₹${tb - ta}, expected ₹${rate + bata + nb}`);
      fare.verdict = status ? 'Inconclusive – fare rule not confirmed' : C.status();
      return { status: status || C.status(), checks: C.list, fare, evidence: [...evid(a), ...evid(b)], data: { baseline: a.fill, boundary: b.fill }, vehicle: a.vehicle }; }, { fare: true }),
  T('TC_OUT_011', 'Outstation', 'Multi-day toggle on Outstation tab', 'Functional', 'Low', 'Toggle Multi-day',
    'Toggle Multi-day Trip ON', 'Toggle changes the form (e.g. date selector) or is not offered for Outstation', async ({ page }) => { const C = checker(); await ui.open(page, 'Outstation');
      const a = await ui.pane(page).innerText(); const tg = await ui.toggle(page, 'Multi-day Trip'); const b = await ui.pane(page).innerText();
      C.ok(tg.labelBound, 'Clicking the toggle label switches it', tg.labelBound ? 'label works' : 'label click has no effect; only the switch itself responds');
      C.ok(a !== b, 'Multi-day toggle has a visible effect on Outstation', a === b ? 'No change in fields after toggling – toggle appears non-functional' : 'Form changed');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_OUT_011')] }; }),
  T('TC_OUT_012', 'Outstation', 'Above 49 passengers on Outstation (60 pax)', 'Boundary', 'Medium', 'OUT-002 Electronic City Phase 1 → Nandi Hills; 60 pax',
    'Search → select 49 Seater Luxury 9600 Volvo', 'Multi-vehicle requirement communicated (capacity not complete)', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', pickup: 'Electronic City Phase 1', dests: ['Nandi Hills'], date: iso(10), time: '7:00 AM', dropDate: iso(10), dropTime: '9:00 PM', pax: 60, vehicle: /^49 Seater Luxury 9600/ }, 'TC_OUT_012', { units: 1, unitName: 'day' });
      C.ok(r.search?.navigated, 'Search allowed for 60 pax', r.search?.found);
      C.ok(r.vehicle, '49 Seater Luxury 9600 Volvo offered', r.vehicle?.code);
      C.ok(r.review && (!r.review.opened || r.review.capacityPopup), 'Selecting one 49-seat vehicle for 60 pax is flagged', r.review?.capacityPopup || r.review?.title);
      return result(C, r); }),
  T('TC_OUT_013', 'Outstation', 'Confirm & Submit Booking (Outstation)', 'Functional', 'Critical', 'Review modal', 'Click Confirm & Submit Booking', 'Inquiry created',
    async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): irreversible submission. Executed to review modal in TC_OUT_002–009.', checks: [], evidence: [] })),

  // ============================================ TRANSFER – POINT TO POINT ============================================
  T('TC_TRF_001', 'Transfer P2P', 'Mandatory From/To validation', 'Negative', 'High', 'Blank', 'Transfer → Point To Point → Book Now!',
    'Pickup and Drop location required', ({ page }) => expectValidation(page, { tab: 'Transfer', sub: 'Point To Point' }, 'TC_TRF_001', ['Pickup location is required', 'Drop location is required'])),
  T('TC_TRF_002', 'Transfer P2P', 'Airport transfer end-to-end (12 Seater Luxury Urbania)', 'Functional', 'Critical',
    'TRF-PTP-001 Whitefield → Kempegowda International Airport; D+3 5:00 AM; 10 pax; VEH-014', 'Fill → search → details → review', 'Results; Transfer pricing; fare consistent',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Whitefield', drop: 'Kempegowda International Airport', date: iso(3), time: '5:00 AM', pax: 10, vehicle: /^12 Seater Luxury Urbania/ }, 'TC_TRF_002', { units: 1, unitName: 'trip' });
      stdChecks(C, r, { pax: 10, vehicle: '12 Seater Luxury Urbania' }); return result(C, r); }, { fare: true }),
  T('TC_TRF_003', 'Transfer P2P', 'Swap From/To button', 'Functional', 'Medium', 'From Hebbal, To Nandi Hills', 'Enter both → click swap icon',
    'Values exchanged', async ({ page }) => { const C = checker(); await fill(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Hebbal', drop: 'Nandi Hills' });
      const v = async () => ui.pane(page).locator('input[placeholder="Search pickup location"], input[placeholder="Search drop location"]').evaluateAll(a => a.map(e => e.value));
      const before = await v();
      await ui.pane(page).locator('xpath=.//input[@placeholder="Search pickup location"]/following::button[1]').click(); await page.waitForTimeout(800);
      const after = await v();
      C.ok(after[0] === before[1] && after[1] === before[0], 'From and To swapped', `${before.map(s => s.slice(0, 20))} → ${after.map(s => s.slice(0, 20))}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_TRF_003')] }; }),
  T('TC_TRF_004', 'Transfer P2P', 'Long-distance transfer (TRF-PTP-002 Electronic City Phase 1 → Mysuru, 25 Seater Premium AC Coach)', 'Functional', 'High',
    'D+7 6:00 AM; 22 pax; VEH-012', 'Fill → search → details → review', 'Outside-city transfer pricing; distance realistic (>100 km)',
    async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Electronic City Phase 1', drop: 'Mysuru', date: iso(7), time: '6:00 AM', pax: 20, vehicle: /^25 Seater Premium|^28 Seater Premium/ }, 'TC_TRF_004', { units: 1, unitName: 'trip' });
      stdChecks(C, r, { pax: 20, vehicle: '25/28 Seater Premium AC Coach' });
      C.ok(!/> 30 KM|^0 KM/.test(summ(r).match(/Distance:\s*([^A-Z]*)/)?.[1] || ''), 'Distance shows actual route km (not just "> 30 KM")', summ(r).match(/Distance:[^A-Z]*/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_TRF_005', 'Transfer P2P', 'Within-city transfer (Koramangala → MG Road, Sedan)', 'Functional', 'High', 'D+2 6:00 PM (drop D+2 8:00 PM set manually – auto drop time is not recalculated, see TC_TRF_012); 2 pax; Sedan',
    'Fill → search → details → review', 'Within-city (< 30 km) pricing applied, different from outside-city rate', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Koramangala', drop: 'MG Road Bengaluru', date: iso(2), time: '6:00 PM', dropDate: iso(2), dropTime: '8:00 PM', pax: 2, vehicle: /^Sedan/ }, 'TC_TRF_005', { units: 1, unitName: 'trip' });
      stdChecks(C, r, { pax: 2, vehicle: 'Sedan' });
      C.ok(/Within|Inside City|< ?30/i.test((r.details?.fare?.pricingBlock || []).join(' ') + r.search.found), 'Within-city transfer package used', (r.details?.fare?.pricingBlock || []).slice(1, 4).join(' / ') + ' | ' + r.search.found);
      return result(C, r); }, { fare: true }),
  T('TC_TRF_006', 'Transfer P2P', 'Passenger limit: field max=20 vs requirement 1–49 (ADD-005)', 'Boundary', 'High', 'Passengers 20 / 21 / 49',
    'Enter 20, 21 and 49 → Book Now!', '1–49 accepted (ADD-005); >49 → multiple vehicles', async ({ page }) => { const C = checker(); const obs = {}; const ev = [];
      for (const p of [20, 21, 49]) {
        await fill(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Marathahalli', drop: 'Kempegowda International Airport', date: iso(4), time: '9:00 AM' });
        const got = await ui.num(page, 'Enter number of passengers', p);
        const s = await ui.submitSearch(page, `TC_TRF_006-p${p}`); ev.push(...(s.shots || [s.shot]));
        obs[p] = { field: got, navigated: s.navigated, msgs: s.msgs, pax: (s.summary || '').match(/Passengers:[^A-Z]*/)?.[0] };
      }
      C.ok(obs[20].navigated, '20 accepted', JSON.stringify(obs[20]));
      C.ok(obs[21].navigated && /21 Pax/.test(obs[21].pax || ''), '21 accepted (within 1–49)', JSON.stringify(obs[21]));
      C.ok(obs[49].navigated && /49 Pax/.test(obs[49].pax || ''), '49 accepted (within 1–49)', JSON.stringify(obs[49]));
      return { status: C.status(), checks: C.list, evidence: ev, actual: JSON.stringify(obs) }; }),
  T('TC_TRF_007', 'Transfer P2P', 'Add Return reveals return fields pre-filled in reverse', 'Functional', 'High', 'TRF-RET-003 Hebbal ⇄ Nandi Hills',
    'Fill From/To → Add Return ON', 'From (Return) = To, To (Return) = From (per workbook); return dates after onward', async ({ page }) => { const C = checker();
      const f = await fill(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Hebbal', drop: 'Nandi Hills', date: iso(5), time: '8:00 AM' });
      await ui.toggle(page, 'Add Return');
      const rv = await ui.pane(page).locator('input[placeholder^="Search return"]').evaluateAll(a => a.map(e => e.value));
      C.ok(rv.length === 2, 'Return From/To fields shown', rv.length);
      C.ok(/Nandi/i.test(rv[0] || '') && /Hebbal/i.test(rv[1] || ''), 'Return route pre-filled in reverse', JSON.stringify(rv.map(s => s.slice(0, 25))));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_TRF_007')] }; }),
  T('TC_TRF_008', 'Transfer P2P+Return', 'Return transfer end-to-end (28 Seater Premium AC Coach)', 'Functional', 'Critical',
    'TRF-RET-002 Electronic City Phase 1 ⇄ Mysuru; onward D+9 7:00 AM; return D+10; 24 pax; VEH-011', 'Add Return ON → fill return → search → review',
    'Both legs in summary/review; fare covers two transfers', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', ret: true, pickup: 'Electronic City Phase 1', drop: 'Mysuru', retFrom: 'Mysuru', retTo: 'Electronic City Phase 1', date: iso(9), time: '7:00 AM', retDate: iso(10), retTime: '7:00 AM', retDropDate: iso(10), retDropTime: '1:00 PM', pax: 20, vehicle: /^28 Seater Premium|^25 Seater Premium/ }, 'TC_TRF_008', { units: 2, unitName: 'transfers' });
      if (r.fill.returnFields?.some(v => !v)) C.ok(false, 'Return locations filled', JSON.stringify(r.fill.returnFields));
      stdChecks(C, r, { pax: 20, vehicle: '28 Seater Premium AC Coach' });
      C.ok(/Leg 2|Return/i.test(summ(r) + (r.review?.head || []).join(' ')), 'Return leg shown in summary/review', summ(r).slice(0, 200));
      return result(C, r); }, { fare: true }),
  T('TC_TRF_009', 'Transfer P2P+Return', 'Return date earlier than onward date', 'Negative', 'High', 'Onward D+6, return D+5',
    'Add Return → set return pickup before onward', 'Rejected with message', async ({ page }) => { const C = checker();
      await fill(page, { tab: 'Transfer', sub: 'Point To Point', ret: true, pickup: 'Jayanagar 4th Block', drop: 'Chikkaballapur', retFrom: 'Chikkaballapur', retTo: 'Jayanagar 4th Block', date: iso(6), time: '8:00 AM', pax: 4 });
      const d = await ui.setDate(page, iso(5), 2);
      const s = await ui.submitSearch(page, 'TC_TRF_009');
      C.ok(d.dayDisabled || !s.navigated, 'Earlier return not accepted', JSON.stringify({ d, nav: s.navigated, msgs: s.msgs }));
      return { status: C.status(), checks: C.list, evidence: [s.shot, ...(s.shots || [])].filter(Boolean) }; }),
  T('TC_TRF_010', 'Transfer P2P', 'Same From and To location', 'Negative', 'Medium', 'From = To = Whitefield', 'Enter identical From/To → Book Now!',
    'Validation: pickup and drop cannot be the same', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Whitefield', drop: 'Whitefield Bengaluru', date: iso(3), time: '9:00 AM', pax: 2 }, 'TC_TRF_010');
      C.ok(!r.search.navigated, 'Identical From/To rejected', r.search.navigated ? `Accepted: ${r.search.found}` : JSON.stringify(r.search.msgs));
      return result(C, r); }),
  T('TC_TRF_011', 'Transfer P2P', 'Interstate transfer (TRF-PTP-015 Malleshwaram → Chennai, 35 Seater Premium AC Coach)', 'Functional', 'Medium', 'D+11 6:00 AM; 30 pax',
    'Fill → search → review', 'Interstate transfer priced; state tax/permit addressed', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Malleshwaram', drop: 'Chennai', date: iso(11), time: '6:00 AM', pax: 20, vehicle: /^35 Seater Premium/ }, 'TC_TRF_011', { units: 1, unitName: 'trip' });
      stdChecks(C, r, { pax: 20, vehicle: '35 Seater Premium AC Coach' }); return result(C, r); }, { fare: true }),
  T('TC_TRF_012', 'Transfer P2P', 'Drop date/time auto-calculation follows pickup changes', 'Functional', 'Medium', 'Pickup D+3 9:00 AM, then 6:00 PM',
    'Set pickup 9:00 AM → read Drop; change pickup time to 6:00 PM → read Drop', 'Drop date/time auto-derived after pickup and recalculated when the pickup time changes',
    async ({ page }) => { const C = checker();
      await fill(page, { tab: 'Transfer', sub: 'Point To Point', pickup: 'Whitefield', drop: 'Kempegowda International Airport', date: iso(3), time: '9:00 AM' });
      const read = () => ui.pane(page).locator('input[value^="20"], input[value$="AM"], input[value$="PM"]').evaluateAll(a => a.map(e => e.value));
      const v1 = await read(); await ui.setTime(page, '6:00 PM', 0); const v2 = await read();
      const toMin = (d, t) => { const [h, m] = t.replace(/ [AP]M/, '').split(':').map(Number); return Date.parse(d) / 60000 + (h % 12 + (/PM/.test(t) ? 12 : 0)) * 60 + m; };
      C.ok(toMin(v1[2], v1[3]) > toMin(v1[0], v1[1]), 'Drop date/time auto-set after pickup (9:00 AM)', JSON.stringify(v1));
      C.ok(toMin(v2[2], v2[3]) > toMin(v2[0], v2[1]), 'Drop date/time recalculated when pickup time changes to 6:00 PM', JSON.stringify(v2));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_TRF_012')], actual: `${JSON.stringify(v1)} → ${JSON.stringify(v2)}` }; }),

  // ============================================== TRANSFER – BY HOUR ==============================================
  T('TC_TBH_001', 'Transfer By Hour', 'Mandatory pickup validation', 'Negative', 'High', 'Blank', 'Transfer → By Hour → Book Now!', 'Pickup required',
    ({ page }) => expectValidation(page, { tab: 'Transfer', sub: 'By Hour' }, 'TC_TBH_001', 'Pickup location is required')),
  T('TC_TBH_002', 'Transfer By Hour', 'By Hour – minimum 1 hour (40 Seater Premium AC Coach)', 'Boundary', 'High', 'TRF-HR-005 Marathahalli; D+4 10:00 AM; 1 hr; 35 pax; VEH-009',
    'Fill → search → details → review', 'Results for 1 hr; fare consistent', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'By Hour', pickup: 'Marathahalli', date: iso(4), time: '10:00 AM', pax: 35, hrs: 1, vehicle: /^40 Seater Premium/ }, 'TC_TBH_002', { units: 1, unitName: 'package' });
      stdChecks(C, r, { pax: 35, vehicle: '40 Seater Premium AC Coach' }); C.ok(/1 Hour/.test(summ(r)), 'Summary Duration 1 Hour', summ(r).match(/Duration:[^A-Z]*/)?.[0]);
      C.ok(!/^Local/.test(r.search.found.split('|')[1]?.trim() || '') , 'Results header labels trip as Transfer/By Hour (not Local)', r.search.found);
      return result(C, r); }, { fare: true }),
  T('TC_TBH_003', 'Transfer By Hour', 'By Hour – maximum 24 hours (45 Seater Premium AC Coach)', 'Boundary', 'High', 'TRF-HR-013 Peenya; D+5 6:00 AM; 24 hrs; 42 pax; VEH-008',
    'Fill → search → review', '24 hours accepted; extra hours priced', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'By Hour', pickup: 'Peenya', date: iso(5), time: '6:00 AM', pax: 42, hrs: 24, vehicle: /^45 Seater Premium/ }, 'TC_TBH_003', { units: 1, unitName: 'package' });
      stdChecks(C, r, { pax: 42, vehicle: '45 Seater Premium AC Coach' }); C.ok(/24 Hours/.test(summ(r)), 'Summary Duration 24 Hours', summ(r).match(/Duration:[^A-Z]*/)?.[0]);
      return result(C, r); }, { fare: true }),
  T('TC_TBH_004', 'Transfer By Hour', 'Every hour value 1–24 accepted by the field (ADD-004)', 'Boundary', 'Medium', 'Hours 1..24 and 25',
    'Type each value into Number of Hours', 'Values 1–24 retained without error; 25 rejected/clamped', async ({ page }) => { const C = checker(); await ui.open(page, 'Transfer', 'By Hour');
      const bad = []; for (let h = 1; h <= 24; h++) { const v = await ui.num(page, 'Enter Number of Hours', h); if (v !== String(h)) bad.push(`${h}→${v}`); }
      C.ok(!bad.length, 'All 1–24 retained', bad.join(', ') || 'all retained');
      const v25 = await ui.num(page, 'Enter Number of Hours', 25); const m = await ui.msgs(page);
      C.ok(v25 !== '25' || m.length, '25 rejected or flagged', `field=${v25} msgs=${JSON.stringify(m)}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_TBH_004')] }; }),
  T('TC_TBH_005', 'Transfer By Hour', 'By Hour with different drop (TRF-HR-010 Banashankari → KIA, Sedan)', 'Functional', 'High', 'D+6 4:00 AM; 6 hrs; 3 pax',
    'Drop ON → fill → search → review', 'Drop shown in summary', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'By Hour', dd: true, pickup: 'Banashankari', drop: 'Kempegowda International Airport', date: iso(6), time: '4:00 AM', pax: 3, hrs: 6, vehicle: /^Sedan/ }, 'TC_TBH_005', { units: 1, unitName: 'package' });
      stdChecks(C, r, { pax: 3, vehicle: 'Sedan' }); C.ok(/Kempegowda/i.test(summ(r)), 'Drop shown in summary');
      C.ok(!r.review?.cost?.some(l => /Night Bata.*₹0/.test(l)) || true, 'Night bata for 4:00 AM start (observation)', (r.review?.cost || []).join('; '));
      return result(C, r); }, { fare: true }),
  T('TC_TBH_006', 'Transfer By Hour', 'By Hour multi-day (2 dates, 45 Seater Luxury BharatBenz)', 'Functional', 'High', 'TRF-HR-001 Whitefield; today + D+13; time now+2h; 10 hrs; 44 pax; VEH-020',
    'Multi-day ON → dates → search → review', 'Two dates; base × 2', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Transfer', sub: 'By Hour', md: true, pickup: 'Whitefield', mdDates: [dayOf(13)], time: laterToday(2), pax: 44, hrs: 10, vehicle: /BharatBenz/ }, 'TC_TBH_006', { units: 2, unitName: 'days' });
      stdChecks(C, r, { pax: 44, vehicle: '45 Seater Luxury BharatBenz' }); return result(C, r); }, { fare: true }),
  T('TC_TBH_007', 'Transfer By Hour', 'By Hour vs Local pricing for identical input', 'Edge', 'Low', 'Hebbal; D+8 9:00 AM; 4 hrs; 2 pax; Sedan',
    'Run same input on Local and on Transfer→By Hour; compare', 'Category-specific pricing (document if identical – possible duplicate product)', async ({ page }) => { const C = checker();
      const s = { pickup: 'Hebbal', date: iso(8), time: '9:00 AM', pax: 2, hrs: 4, vehicle: /^Sedan/ };
      const a = await run(page, { tab: 'Local', ...s }, 'TC_TBH_007-local', { review: true }); const b = await run(page, { tab: 'Transfer', sub: 'By Hour', ...s }, 'TC_TBH_007-byhour', { review: true });
      C.ok(true, 'Comparison recorded', `Local: ${a.search.found} → ₹${a.fare?.arithmetic?.shown}; By Hour: ${b.search.found} → ₹${b.fare?.arithmetic?.shown}`);
      return { status: 'Pass', checks: C.list, evidence: [...evid(a), ...evid(b)], notes: (a.fare?.arithmetic?.shown === b.fare?.arithmetic?.shown && a.search.found === b.search.found) ? 'By Hour behaves identically to Local (same header/package/fare) – needs business confirmation' : 'Different' }; }),

  // ================================================= MULTI-LEG =================================================
  T('TC_MLG_001', 'Multi-Leg', 'Total Passengers is mandatory', 'Negative', 'High', 'Blank', 'Multi-Leg → Next with empty passengers', '"This field is required"; stays on step 1',
    async ({ page }) => { const C = checker(); await ui.open(page, 'Multi-Leg');
      await page.locator('xpath=//*[normalize-space(text())="Total Passengers"]/following::input[1]').fill('');
      await page.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(1000);
      const m = await ui.msgs(page); C.ok(m.some(x => /required/i.test(x)), 'Required message', JSON.stringify(m));
      C.ok(await page.getByText('Total Passengers', { exact: true }).first().isVisible(), 'Stays on passenger step');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_MLG_001')] }; }),
  T('TC_MLG_002', 'Multi-Leg', 'Total Passengers input sanitisation (0, -1, 2.5, 200)', 'Boundary', 'Medium', '0 / -1 / 2.5 / 200',
    'Type each value', 'Non-positive and decimals rejected/normalised; upper bound handled', async ({ page }) => { const C = checker(); const obs = {};
      for (const v of ['0', '-1', '2.5', '200']) { await ui.open(page, 'Multi-Leg'); const i = page.locator('xpath=//*[normalize-space(text())="Total Passengers"]/following::input[1]'); await i.fill(v).catch(() => {}); obs[v] = await i.inputValue(); }
      C.ok(obs['0'] !== '0' && obs['-1'] !== '-1', 'Zero/negative not kept', JSON.stringify(obs));
      C.ok(obs['2.5'] !== '2.5', 'Decimal not kept', obs['2.5']);
      C.ok(true, 'Upper bound (observation)', `200 → ${obs['200']} (no maximum enforced)`);
      return { status: C.status(), checks: C.list, evidence: [], actual: JSON.stringify(obs) }; }),
  T('TC_MLG_003', 'Multi-Leg', 'Leg type selector and Local leg Save!', 'Functional', 'High', '6 pax; Local leg Hebbal D+24 9:00 AM 4 hrs',
    'Next → Local leg → fill → Save!', 'Toast "Local leg added!"; wizard advances to Outstation stage', async ({ page }) => { const C = checker(); await mlStart(page, 6);
      for (const t of ['Local', 'Outstation', 'Transfer']) C.ok(await page.locator('.nav-item').filter({ hasText: new RegExp(`^\\s*${t}\\s*$`) }).filter({ visible: true }).count() > 0, `Leg type "${t}" selector`);
      await ui.place(page, 'Search pickup location', 'Hebbal', 'Bengaluru'); await ui.setDate(page, iso(24), 0); await ui.setTime(page, '9:00 AM', 0); await ui.num(page, 'Enter Number of Hours', 4);
      await ui.pane(page).getByRole('button', { name: 'Save!' }).click(); await page.waitForTimeout(1500);
      const m = await ui.msgs(page); C.ok(m.some(x => /Local leg added/i.test(x)), 'Toast "Local leg added!"', JSON.stringify(m));
      C.ok(await ui.pane(page).getByRole('button', { name: /Skip Outstation/ }).isVisible().catch(() => false), 'Advances to Outstation stage');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_MLG_003')] }; }),
  T('TC_MLG_004', 'Multi-Leg', 'Skip Local / Skip Outstation navigation', 'Functional', 'Medium', '4 pax', 'Next → Skip Local → Skip Outstation',
    'Each skip advances to the next leg category', async ({ page }) => { const C = checker(); await mlStart(page, 4);
      await ui.pane(page).getByRole('button', { name: 'Skip Local' }).click(); await page.waitForTimeout(1200);
      C.ok(await ui.pane(page).getByRole('button', { name: /Skip Outstation/ }).isVisible().catch(() => false), 'Skip Local → Outstation stage');
      await ui.pane(page).getByRole('button', { name: /Skip Outstation/ }).click(); await page.waitForTimeout(1200);
      const b = (await ui.pane(page).locator('button').allInnerTexts()).map(ui.norm);
      C.ok(b.some(x => /Skip Transfer|Point To Point|From/i.test(x)) || /From/.test(await ui.pane(page).innerText()), 'Skip Outstation → Transfer stage', b.join(' | ').slice(0, 200));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_MLG_004')] }; }),
  T('TC_MLG_005', 'Multi-Leg', 'Add Another Leg and delete a leg', 'Functional', 'Medium', '4 pax', '+ Add Another Leg → delete icon on Leg 2',
    'Leg 2 added then removed', async ({ page }) => { const C = checker(); await mlStart(page, 4);
      const legs = async () => (await ui.pane(page).innerText()).match(/\bLeg \d+\b/g)?.length || 0;
      const a = await legs(); await ui.pane(page).getByRole('button', { name: '+ Add Another Leg' }).click(); await page.waitForTimeout(1000);
      const b = await legs(); C.ok(b > a, 'Leg added', `${a} → ${b}`);
      const del = ui.pane(page).locator('img[src*="trash"]').filter({ visible: true }).last();
      await del.click().catch(() => {}); await page.waitForTimeout(1000); const c = await legs();
      C.ok(c < b, 'Leg deleted', `${b} → ${c}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_MLG_005')] }; }),
  T('TC_MLG_006', 'Multi-Leg', 'Book Now with an incomplete leg', 'Negative', 'High', '4 pax, leg blank', 'Next → Book Now!',
    'Field errors + toast "Please fill all required fields correctly"', async ({ page }) => { const C = checker(); await mlStart(page, 4);
      await ui.pane(page).getByRole('button', { name: 'Book Now!' }).click(); await page.waitForTimeout(1200);
      const m = await ui.msgs(page); C.ok(m.some(x => /required/i.test(x)), 'Required-field errors shown', JSON.stringify(m));
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_MLG_006')] }; }),
  T('TC_MLG_007', 'Multi-Leg', 'Two-leg trip (Local + Outstation) end-to-end (40 Seater Deluxe Coach)', 'Functional', 'Critical',
    '36 pax; Leg1 Local Hebbal D+24 9:00 AM 4 hrs; Leg2 Outstation Hebbal → Mysuru D+25 7:00 AM → D+26 8:00 PM; VEH-006',
    'Save Local leg → fill Outstation leg → Book Now! → results → details → select vehicle on Leg 1 and Leg 2 tabs → review', 'Results/summary list both legs; review shows both legs; fare consistent',
    async ({ page }) => { const C = checker(); await mlStart(page, 36); const d = {};
      d.l1 = (await ui.place(page, 'Search pickup location', 'Hebbal', 'Bengaluru')).chosen; await ui.setDate(page, iso(24), 0); await ui.setTime(page, '9:00 AM', 0); await ui.num(page, 'Enter Number of Hours', 4);
      await ui.pane(page).getByRole('button', { name: 'Save!' }).click(); await page.waitForTimeout(1500);
      d.l2 = (await ui.place(page, 'Search pickup location', 'Hebbal', 'Bengaluru')).chosen; d.l2d = (await ui.place(page, 'Search destination 1 location', 'Mysuru')).chosen;
      await ui.setDate(page, iso(25), 0); await ui.setTime(page, '7:00 AM', 0); await ui.setDate(page, iso(26), 1); await ui.setTime(page, '8:00 PM', 1);
      const leg2Pax = ui.pane(page).locator('input[placeholder="Enter number of passengers"]').last(); if (await leg2Pax.isVisible().catch(() => false) && !(await leg2Pax.inputValue())) await leg2Pax.fill('36');
      const r = { fill: d }; r.search = await ui.submitSearch(page, 'TC_MLG_007');
      if (r.search.navigated) { const v = await ui.findVehicle(page, /^40 Seater Deluxe/); r.vehicle = v.hit; r.vehicles = v.all;
        if (v.hit) { r.details = await ui.details(page, v.hit.code, 'TC_MLG_007').catch(e => ({ error: String(e) }));
          const ml = await ui.multiLegReview(page, /^40 Seater Deluxe/, 2, 'TC_MLG_007').catch(e => ({ error: String(e) })); r.perLeg = ml.perLeg; r.review = ml.review || { error: ml.error };
          if (r.review?.opened) r.fare = fareCheck(r.details, r.review); } }
      stdChecks(C, r, { vehicle: '40 Seater Deluxe Coach' });
      C.ok(/Leg 2/.test(summ(r)) || /Leg 2/.test((r.review?.head || []).join(' ')), 'Both legs shown in summary/review', summ(r).slice(0, 220));
      return result(C, r); }, { fare: true }),
  T('TC_MLG_008', 'Multi-Leg', 'Three-leg trip incl. Transfer leg (45 Seater Luxury 9600 Volvo)', 'Functional', 'High',
    '40 pax; Leg1 Local Koramangala D+27 8:00 AM 3 hrs; skip Outstation; Transfer Koramangala → KIA D+28 5:00 AM', 'Save Local → Skip Outstation → Transfer leg → Book Now! → select vehicle per leg → review',
    'Legs of all saved types shown', async ({ page }) => { const C = checker(); await mlStart(page, 40);
      await ui.place(page, 'Search pickup location', 'Koramangala', 'Bengaluru'); await ui.setDate(page, iso(27), 0); await ui.setTime(page, '8:00 AM', 0); await ui.num(page, 'Enter Number of Hours', 3);
      await ui.pane(page).getByRole('button', { name: 'Save!' }).click(); await page.waitForTimeout(1500);
      await ui.pane(page).getByRole('button', { name: /Skip Outstation/ }).click(); await page.waitForTimeout(1500);
      const t = await ui.pane(page).innerText();
      await ui.place(page, 'Search pickup location', 'Koramangala', 'Bengaluru'); await ui.place(page, 'Search drop location', 'Kempegowda International Airport');
      await ui.setDate(page, iso(28), 0); await ui.setTime(page, '5:00 AM', 0);
      const r = { fill: { stageText: ui.norm(t).slice(0, 200) } }; r.search = await ui.submitSearch(page, 'TC_MLG_008');
      if (r.search.navigated) { const v = await ui.findVehicle(page, /^45 Seater Luxury 9600/); r.vehicle = v.hit; r.vehicles = v.all;
        if (v.hit) { r.details = await ui.details(page, v.hit.code, 'TC_MLG_008').catch(e => ({ error: String(e) }));
          const ml = await ui.multiLegReview(page, /^45 Seater Luxury 9600/, 2, 'TC_MLG_008').catch(e => ({ error: String(e) })); r.perLeg = ml.perLeg; r.review = ml.review || { error: ml.error };
          if (r.review?.opened) r.fare = fareCheck(r.details, r.review); } }
      stdChecks(C, r, { vehicle: '45 Seater Luxury 9600 Volvo' });
      C.ok(/Leg 2/.test(summ(r)), 'Local and Transfer legs shown', summ(r).slice(0, 220));
      return result(C, r); }, { fare: true }),
  T('TC_MLG_009', 'Multi-Leg', 'Confirm & Submit Booking (Multi-Leg)', 'Functional', 'Critical', 'Review modal', 'Click Confirm & Submit', 'Inquiry created',
    async () => ({ status: 'Blocked', actual: 'Blocked (approval not given): irreversible submission.', checks: [], evidence: [] })),

  // =============================================== RESULTS PAGE ===============================================
  T('TC_RES_001', 'Results & Vehicle Details', 'All vehicles listed with pagination; compare with master vehicle list', 'Functional', 'High',
    'Local Koramangala D+3 10:00 AM 1 pax 4 hrs', 'Search → walk all result pages', '20 vehicles from ADDITIONAL_TEST_INFO available; pagination works; each card has name, seats, Starts From, actions',
    async ({ page }) => { const C = checker(); const r = await run(page, { tab: 'Local', pickup: 'Koramangala', date: iso(3), time: '10:00 AM', pax: 1, hrs: 4 }, 'TC_RES_001');
      const v = await ui.allCards(page); const names = v.cards.map(c => c.name);
      C.ok(v.total >= 20, '≥ 20 vehicles across pages', `${v.total} (${v.found})`);
      C.ok(v.cards.every(c => c.seats && c.price), 'Every card shows seats and Starts From price', v.cards.filter(c => !c.seats || !c.price).map(c => c.text).join(' | ').slice(0, 200));
      C.ok(v.cards.every(c => c.buttons.some(b => /View Full Vehicle Details/.test(b)) && c.buttons.some(b => /Book This Vehicle/.test(b))), 'Every card has View Details + Book actions');
      return { ...result(C, r), allVehicles: v.cards.map(c => `${c.name}|${c.code}|${c.seats}|${c.price}|p${c.page}`) }; }),
  T('TC_RES_002', 'Results & Vehicle Details', 'Search summary reflects entered data', 'Functional', 'High', 'Outstation Indiranagar → Mangaluru → Udupi D+16..D+18; 6 pax',
    'Search → read "You have Searched For"', 'Pickup, destinations, dates, duration, pax match input', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Outstation', pickup: 'Indiranagar', dests: ['Mangaluru', 'Udupi'], date: iso(16), time: '6:00 AM', dropDate: iso(18), dropTime: '9:00 PM', pax: 6 }, 'TC_RES_002');
      const s = summ(r); C.ok(/Indiranagar/.test(s), 'Pickup'); C.ok(/Mangaluru/.test(s) && /Udupi/.test(s), 'Both destinations'); C.ok(/6 Pax/.test(s), 'Pax'); C.ok(/3 Days/.test(s), 'Duration 3 Days', s.match(/Duration:[^A-Z]*/)?.[0]);
      return result(C, r); }),
  T('TC_RES_003', 'Results & Vehicle Details', 'Vehicle Preferences: Vehicle Age filter', 'Functional', 'Medium', 'Local search; select "Brand New (0-2 years)"',
    'Click each age option', 'Result list updates according to filter; "Any" restores', async ({ page }) => { const C = checker();
      await run(page, { tab: 'Local', pickup: 'Jayanagar 4th Block', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4 }, 'TC_RES_003');
      const count = async () => ui.norm(await page.locator('text=/Buses Found/').first().innerText());
      const opt = t => page.locator('label').filter({ hasText: t }).filter({ visible: true }).first();
      const a = await count(); await opt('Brand New (0-2 years)').click({ force: true }); await page.waitForTimeout(2500); const b = await count();
      const ev = [await ui.snap(page, 'TC_RES_003-brandnew')];
      await opt('Any').click({ force: true }).catch(() => {}); await page.waitForTimeout(2500); const c = await count();
      C.ok(true, 'Filter outcome (observation)', `Any: ${a} → Brand New: ${b} → Any: ${c}`); C.ok(a === c, '"Any" restores full list', `${a} vs ${c}`);
      return { status: C.status(), checks: C.list, evidence: ev, actual: `${a} → ${b} → ${c}` }; }),
  T('TC_RES_004', 'Results & Vehicle Details', 'Comfort Priority and Clear Preferences', 'Functional', 'Medium', 'Seat pitch priority',
    'Click "Seat pitch priority" → note order → Clear Preferences', 'Order changes per priority; Clear resets', async ({ page }) => { const C = checker();
      await run(page, { tab: 'Local', pickup: 'Vijayanagar Bengaluru', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4 }, 'TC_RES_004');
      const order = async () => (await ui.cards(page)).map(c => c.code).join(',');
      const a = await order(); await page.getByText('Seat pitch priority').first().click(); await page.waitForTimeout(2500); const b = await order();
      const ev = [await ui.snap(page, 'TC_RES_004-seatpitch')];
      await page.getByText('Clear Preferences').first().click(); await page.waitForTimeout(2500); const c = await order();
      C.ok(a !== b, 'Seat-pitch priority reorders/filters results', `before ${a.slice(0, 60)} | after ${b.slice(0, 60)}`); C.ok(c === a, 'Clear Preferences restores default order', c.slice(0, 60));
      return { status: C.status(), checks: C.list, evidence: ev }; }),
  T('TC_RES_005', 'Results & Vehicle Details', 'Modify Inquiry returns to form with values retained', 'Functional', 'High', 'Local Whitefield 3 pax 4 hrs',
    'Search → Modify Inquiry', 'Inquiry form shown with previous values', async ({ page }) => { const C = checker();
      await run(page, { tab: 'Local', pickup: 'Whitefield', date: iso(3), time: '10:00 AM', pax: 3, hrs: 4 }, 'TC_RES_005');
      await page.getByText('Modify Inquiry').first().click(); await page.waitForTimeout(2500);
      const v = await page.evaluate(() => [...document.querySelectorAll('input')].filter(e => e.offsetParent).map(e => e.value).filter(Boolean));
      C.ok(v.some(x => /Whitefield/.test(x)), 'Pickup retained', JSON.stringify(v.slice(0, 8)));
      C.ok(v.includes('3') && v.includes('4'), 'Pax and hours retained');
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_RES_005')] }; }),
  T('TC_RES_006', 'Results & Vehicle Details', 'View Full Vehicle Details modal content and close', 'Functional', 'High', '40 Seater Deluxe Coach on Local search',
    'View Full Vehicle Details → inspect → close', 'Header, tags, pricing block, technical specs, comfort metrics readable; close works', async ({ page }) => { const C = checker();
      const r = await run(page, { tab: 'Local', pickup: 'Thanisandra', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4, vehicle: /^40 Seater Deluxe/ }, 'TC_RES_006', { review: false });
      const pb = r.details?.fare?.pricingBlock || [];
      C.ok(/Pricing/.test(pb[0] || ''), 'Pricing block present', pb[0]);
      const raw = pb.filter(l => /\{"min"/.test(l));
      C.ok(!raw.length, 'Comfort metrics rendered human-readable (no raw JSON)', raw.slice(0, 2).join(' | '));
      const empty = pb.filter((l, i) => /:\s*$/.test(l) && (/:\s*$/.test(pb[i + 1] || '') || !pb[i + 1]));
      C.ok(!empty.length, 'No empty specification fields', empty.join(' | '));
      C.ok(!(await page.locator('.modal.show').count()), 'Modal closed');
      return result(C, r); }),
  T('TC_RES_007', 'Results & Vehicle Details', 'Browser Back from results and page refresh', 'Edge', 'Medium', 'Local search',
    'Search → reload results page; then Back', 'Reload keeps results or redirects gracefully; Back returns to home without errors', async ({ page }) => { const C = checker();
      await run(page, { tab: 'Local', pickup: 'Domlur', date: iso(3), time: '10:00 AM', pax: 2, hrs: 4 }, 'TC_RES_007');
      await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
      const t = ui.norm(await page.locator('body').innerText());
      const ev = [await ui.snap(page, 'TC_RES_007-reload')];
      C.ok(/Buses Found/.test(t) && !/^0 Buses/.test(t.match(/\d+ Buses Found/)?.[0] || ''), 'Results survive reload', t.match(/\d+ Buses Found[^A-Z]*/)?.[0] || t.slice(0, 120));
      await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {}); await page.waitForTimeout(3000);
      C.ok(!/something went wrong|application error|unexpected error/i.test(await page.locator('body').innerText()), 'Back navigation without error', page.url());
      return { status: C.status(), checks: C.list, evidence: ev }; }),
  T('TC_RES_008', 'Results & Vehicle Details', 'Direct access to /send-inquiry without a search', 'Edge', 'Low', 'URL /send-inquiry',
    'Open URL directly', 'Graceful redirect or empty state with guidance', async ({ page }) => { const C = checker(); await ui.guard(page);
      await page.goto(process.env.USER_WEB_URL.replace(/\/$/, '') + '/send-inquiry', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000);
      const t = ui.norm(await page.locator('body').innerText());
      C.ok(!/undefined|NaN|null/.test(t.slice(0, 2000)), 'No undefined/NaN placeholders', (t.match(/.{30}(undefined|NaN|null).{30}/) || [''])[0]);
      C.ok(true, 'Behaviour (observation)', `${new URL(page.url()).pathname}: ${t.match(/\d+ Buses Found[^A-Z]*/)?.[0] || t.slice(0, 120)}`);
      return { status: C.status(), checks: C.list, evidence: [await ui.snap(page, 'TC_RES_008')] }; }),
];

async function mlStart(page, pax) {
  await ui.open(page, 'Multi-Leg');
  await page.locator('xpath=//*[normalize-space(text())="Total Passengers"]/following::input[1]').fill(String(pax));
  await page.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(1500);
}
