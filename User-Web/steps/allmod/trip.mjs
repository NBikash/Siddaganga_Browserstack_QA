// Scenario engine: fill any booking tab from a spec, search, pick a vehicle, read Fare Breakup + review, evaluate the fare.
// Spec: { tab, dropToday (remove pre-selected today chip), sub, md, dd, ret, pickup, drop, dests:[], date, time, dropDate, dropTime, retDate, retTime, mdDates, pax, hrs, vehicle: RegExp }
// Never submits: guard() blocks booking/inquiry/draft calls and review() closes the modal without clicking Confirm.
import * as ui from './ui.mjs';

export const iso = n => { const d = new Date(); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-CA'); };
export const dayOf = n => { const d = new Date(); d.setDate(d.getDate() + n); return { next: (d.getFullYear() - new Date().getFullYear()) * 12 + d.getMonth() - new Date().getMonth(), d: d.getDate() }; };

export async function fill(page, s) {
  const r = {};
  await ui.open(page, s.tab, s.sub);
  r.labels = {};
  if (s.md) r.labels.md = (await ui.toggle(page, 'Multi-day Trip')).labelBound;
  if (s.dd) r.labels.dd = (await ui.toggle(page, 'Drop at different location')).labelBound;
  if (s.ret) await ui.toggle(page, 'Add Return');
  if (s.pickup) r.pickup = (await ui.place(page, 'Search pickup location', s.pickup, 'Bengaluru')).chosen;
  if (s.dests) {
    r.dests = [];
    for (let i = 0; i < s.dests.length; i++) {
      if (i > 0) { await ui.pane(page).getByRole('button', { name: '+ Add Another Destination' }).click(); await page.waitForTimeout(600); }
      r.dests.push((await ui.place(page, `Search destination ${i + 1} location`, s.dests[i])).chosen);
    }
  }
  if (s.dd && s.drop && !(await ui.pane(page).locator('input[placeholder="Search drop location"]').isVisible().catch(() => false))) {
    r.ddResetObserved = `"Drop at different location" switched itself OFF after entering ${s.dests ? 'pickup/destinations' : 'pickup'}; re-enabled`;
    await ui.toggle(page, 'Drop at different location');
  }
  if (s.drop) r.drop = (await ui.place(page, 'Search drop location', s.drop)).chosen;
  if (s.retFrom) r.retFrom = (await ui.place(page, 'Search return pickup location', s.retFrom)).chosen;
  if (s.retTo) r.retTo = (await ui.place(page, 'Search return drop location', s.retTo)).chosen;
  if (s.mdDates) r.mdDates = await ui.setMultiDates(page, s.mdDates);
  if (s.dropToday) r.mdDates = await ui.removeTodayChip(page);
  if (s.date) r.date = await ui.setDate(page, s.date, 0);
  if (s.time) r.time = await ui.setTime(page, s.time, 0);
  if (s.dropDate) r.dropDate = await ui.setDate(page, s.dropDate, 1);
  if (s.dropTime) r.dropTime = await ui.setTime(page, s.dropTime, 1);
  if (s.retDate) r.retDate = await ui.setDate(page, s.retDate, 2);
  if (s.retTime) r.retTime = await ui.setTime(page, s.retTime, 2);
  if (s.retDropDate) r.retDropDate = await ui.setDate(page, s.retDropDate, 3);
  if (s.retDropTime) r.retDropTime = await ui.setTime(page, s.retDropTime, 3);
  if (s.pax != null) r.pax = await ui.num(page, 'Enter number of passengers', s.pax);
  if (s.hrs != null) r.hrs = await ui.num(page, 'Enter Number of Hours', s.hrs);
  if (s.ret) r.returnFields = await ui.pane(page).locator('input[placeholder^="Search return"]').evaluateAll(a => a.map(e => e.value));
  await page.waitForTimeout(800);
  // the app sometimes rewrites typed numbers: re-check
  r.integrity = [];
  for (const [k, ph] of [['pax', 'Enter number of passengers'], ['hrs', 'Enter Number of Hours']]) {
    if (s[k] == null) continue;
    const got = await ui.pane(page).locator(`input[placeholder="${ph}"]`).first().inputValue().catch(() => '');
    if (got !== String(s[k])) r.integrity.push(`${k}: entered ${s[k]}, field shows ${got}`);
  }
  return r;
}

// Evaluate the applied fare against the vehicle's Fare Breakup (shared fare-verification procedure).
export function fareCheck(details, review, units, unitName) {
  const out = { breakup: details?.fare, applied: review?.cost || [], arithmetic: null, rule: null, verdict: 'Inconclusive – fare rule not confirmed', notes: [] };
  if (!review?.cost?.length) { out.notes.push('No applied fare (review modal did not show cost lines)'); return out; }
  const lines = review.cost.map(l => { const [k, v] = l.split(' = '); return { k, v, n: ui.amt(v) }; });
  const total = lines.find(l => /Grand Total|Total/i.test(l.k));
  const parts = lines.filter(l => l !== total && l.n != null);
  const sum = parts.reduce((a, b) => a + b.n, 0);
  out.arithmetic = { expr: parts.map(p => `${p.k.replace(/\(.*\)/, '').trim()} ₹${p.n}`).join(' + ') + ` = ₹${sum}`, shown: total?.n ?? null, ok: total ? sum === total.n : null };
  const baseRate = ui.amt(details?.fare?.baseRate);
  const baseApplied = lines.find(l => /Base Cost|Base Fare|Base/i.test(l.k))?.n;
  if (baseRate && baseApplied != null && units) {
    out.rule = { rule: `Base = Base Rate ₹${baseRate} × ${units} ${unitName}`, expected: baseRate * units, applied: baseApplied, ok: baseRate * units === baseApplied };
  } else out.notes.push('Base-rate rule not derivable from the Fare Breakup for this trip (rate/units not shown) – Needs business/developer clarification');
  if (out.arithmetic.ok === false) out.verdict = 'Fail';
  else if (out.rule?.ok === false) out.verdict = 'Fail';
  else if (out.arithmetic.ok && out.rule?.ok) out.verdict = 'Pass';
  return out;
}

// Full scenario. opts: { details=true, review=true, units, unitName }
export async function run(page, s, tag, opts = {}) {
  const r = { spec: { ...s, vehicle: s.vehicle ? String(s.vehicle) : undefined } };
  r.fill = await fill(page, s);
  r.search = await ui.submitSearch(page, tag);
  if (!r.search.navigated || !s.vehicle) return r;
  const v = await ui.findVehicle(page, s.vehicle);
  r.vehicles = v.all; r.vehicle = v.hit;
  if (!v.hit) return r;
  if (opts.details !== false) r.details = await ui.details(page, v.hit.code, `${tag}`).catch(e => ({ error: String(e).slice(0, 200) }));
  if (opts.review !== false) r.review = await ui.review(page, v.hit.code, `${tag}`).catch(e => ({ error: String(e).slice(0, 200) }));
  if (r.review?.opened) r.fare = fareCheck(r.details, r.review, opts.units, opts.unitName);
  return r;
}
