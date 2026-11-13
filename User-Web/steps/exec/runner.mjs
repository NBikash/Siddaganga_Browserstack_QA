// Generic Local test-case runner. Executes one search scenario end to end and stops BEFORE "Confirm & Submit Booking".
// Booking / inquiry / draft API calls stay blocked by guard(). Never clicks submit, Save As Draft or Custom Quote submit.
import fs from 'node:fs';
import path from 'node:path';
import { home, panel, toggle, toggleState, messages, place, cardAction, guard } from '../_local.mjs';
import { shot as rawShot } from '../../scripts/lib.mjs';

export const RUN = process.env.RUN_ID;
const SHOT_DIR = `local/${RUN}`;
const mask = page => [page.locator('xpath=//*[contains(normalize-space(.),"Customer Details") and not(*[contains(normalize-space(.),"Customer Details")])]/..')];
export const snap = (page, name, opts = {}) => rawShot(page, `${SHOT_DIR}/${name}`, { mask: mask(page), ...opts });
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
const PII = s => s.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/(?:\+?91[\s-]?)?[6-9]\d{4}\s?\d{5}/g, '<phone>');

export async function setSingleDate(page, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  await panel(page).locator('input[value^="20"]').first().click(); await page.waitForTimeout(500);
  for (let i = 0; i < 40; i++) {
    const cur = await page.locator('.react-datepicker__current-month').first().innerText();
    if (cur.trim() === target) break;
    await page.locator('.react-datepicker__navigation--next').click(); await page.waitForTimeout(150);
  }
  await page.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`).first().click();
  await page.waitForTimeout(400);
}
export async function setTime(page, label) {
  await panel(page).locator('input[value$="AM"], input[value$="PM"]').first().click(); await page.waitForTimeout(500);
  const item = page.locator('.react-datepicker__time-list-item').filter({ hasText: new RegExp(`^${label}$`) }).first();
  await item.scrollIntoViewIfNeeded(); await item.click(); await page.waitForTimeout(400);
}
// mdDates: [{ next: 0|1|2, d: 20 }]; today is always pre-selected by the app
export async function setMultiDates(page, mdDates) {
  const p = panel(page); let month = 0;
  for (const { next, d } of mdDates) {
    while (month < next) { await p.getByRole('button', { name: 'Next Month' }).click(); await page.waitForTimeout(300); month++; }
    await p.locator('.day-content').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await page.waitForTimeout(250);
  }
}
export async function formState(page) {
  const p = panel(page);
  const v = async sel => (await p.locator(sel).first().inputValue().catch(() => '')) || '';
  return {
    multiDay: await toggleState(page, 'Multi-day Trip'), differentDrop: await toggleState(page, 'Drop at different location'),
    pickup: await v('input[placeholder="Search pickup location"]'), drop: await v('input[placeholder="Search drop location"]'),
    date: await v('input[value^="20"]'), time: await v('input[value$="AM"], input[value$="PM"]'),
    selectedDates: norm(await p.locator('text=/Selected Dates/').first().locator('xpath=..').innerText().catch(() => '')),
    pax: await v('input[placeholder="Enter number of passengers"]'), hours: await v('input[placeholder="Enter Number of Hours"]'),
  };
}

export async function fillForm(page, s) {
  await home(page);
  if (s.md) await toggle(page, 'Multi-day Trip');
  if (s.dd) await toggle(page, 'Drop at different location');
  const r = {};
  if (s.pickup) r.pickupSuggest = await place(page, 'Search pickup location', s.pickup, s.pickupPick);
  if (s.drop) r.dropSuggest = await place(page, 'Search drop location', s.drop, s.dropPick);
  if (s.date) await setSingleDate(page, s.date);
  if (s.mdDates) await setMultiDates(page, s.mdDates);
  if (s.time) await setTime(page, s.time);
  const p = panel(page);
  if (s.pax != null) await p.locator('input[placeholder="Enter number of passengers"]').fill(String(s.pax));
  if (s.hrs != null) await p.locator('input[placeholder="Enter Number of Hours"]').fill(String(s.hrs));
  // Integrity check: the app may overwrite typed values afterwards (observed once: hours 8 → 24). Verify, re-enter, record.
  await page.waitForTimeout(1500);
  r.integrity = [];
  for (const [key, sel, want] of [['pax', 'input[placeholder="Enter number of passengers"]', s.pax], ['hours', 'input[placeholder="Enter Number of Hours"]', s.hrs]]) {
    if (want == null) continue;
    const got = await p.locator(sel).inputValue();
    if (got !== String(want)) { r.integrity.push({ field: key, entered: String(want), foundAfter: got }); await p.locator(sel).fill(String(want)); await page.waitForTimeout(800); }
  }
  r.form = await formState(page);
  return r;
}

export async function search(page, tag) {
  await panel(page).getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForURL(/send-inquiry/, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (!/send-inquiry/.test(page.url())) return { navigated: false, msgs: await messages(page), shot: await snap(page, `${tag}-validation`) };
  await page.locator('text=/Buses Found/').first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(2500);
  const summary = norm(await page.locator('text=/Distance:/').first().locator('xpath=../..').innerText().catch(() => ''));
  const found = norm(await page.locator('text=/Buses Found/').first().innerText());
  const { cards } = await import('../local-cards.mjs');
  const page1 = (await cards(page)).map(c => ({ vehicle: `${c.name} ${c.code}`.trim(), seats: c.seats, startsFrom: c.price }));
  await page.locator('text=/You have Searched For/').first().scrollIntoViewIfNeeded().catch(() => {});
  const sShot = await snap(page, `${tag}-results-summary`);
  await page.locator('text=/Recommended Vehicles/').first().scrollIntoViewIfNeeded().catch(() => {});
  const cShot = await snap(page, `${tag}-results-vehicles`);
  return { navigated: true, summary, found, page1, shots: [sShot, cShot] };
}

function parseLines(text) { return text.split('\n').map(s => s.trim()).filter(Boolean); }

export async function vehicleDetails(page, code, tag) {
  const pg = await cardAction(page, code, 'View Full Vehicle Details');
  const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(1500);
  const lines = parseLines(await m.innerText());
  const pick = re => { const i = lines.findIndex(l => re.test(l)); return i < 0 ? null : { label: lines[i], value: lines[i + 1] }; };
  const fb = {
    header: lines[0], subtitle: lines[1], tags: lines.slice(2, 5),
    package: lines.find(l => /Local Trip –|Hrs \/|Hr\//.test(l) && !/Base Rate/.test(l)) || null,
    baseRate: (() => { const i = lines.findIndex(l => /^Base Rate/.test(l)); return i < 0 ? null : { label: `${lines[i]} ${lines[i + 1]}`, value: lines[i + 2] }; })(),
    extraKm: pick(/^Extra Km/), extraHour: pick(/^Extra Hour/), dayBata: pick(/^Day Bata/), nightBata: pick(/^Night Bata/),
    toll: pick(/^Toll/), gst: pick(/^GST/), other: lines.filter(l => /permit|night charge|allowance/i.test(l) && !/Bata|Included/.test(l)),
    comfortRaw: lines.filter(l => /\{"min"/.test(l)),
  };
  const fbBox = m.locator('text=/Local Trip Pricing/').first();
  await fbBox.scrollIntoViewIfNeeded().catch(() => {});
  const shotFB = await snap(page, `${tag}-fare-breakup`);
  await m.evaluate(el => el.scrollTo?.(0, el.scrollHeight)); await page.mouse.wheel(0, 1500); await page.waitForTimeout(500);
  const shotSpecs = await snap(page, `${tag}-vehicle-specs`);
  await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(async () => page.keyboard.press('Escape'));
  await page.waitForTimeout(800);
  if (await page.locator('.modal.show').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  return { onPage: pg, fareBreakup: fb, shots: [shotFB, shotSpecs] };
}

export async function bookVehicle(page, code, tag) {
  await cardAction(page, code, 'Book This Vehicle');
  const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(2500);
  const lines = parseLines(PII(await m.innerText()));
  const after = h => { const i = lines.findIndex(l => l.startsWith(h)); return i < 0 ? null : lines[i + 1]; };
  const costStart = lines.findIndex(l => /^Estimated Trip Cost/.test(l));
  const cost = [];
  if (costStart >= 0) for (let i = costStart + 1; i < lines.length - 1; i += 2) { if (/Confirm|Submit/.test(lines[i])) break; cost.push({ label: lines[i], value: lines[i + 1] }); }
  const buttons = (await m.locator('button').allInnerTexts()).map(norm).filter(b => b && !/Keyboard|Map Data|km Click/.test(b));
  const applied = { title: lines[0], selected: lines.find(l => /^Selected Vehicles/.test(l)), dates: after('Dates'), passenger: after('Passenger'),
    pickup: after('Pickup Location'), drop: after('Drop Location'), note: lines.find(l => /^Estimated total/.test(l)), cost, buttons,
    hasGST: lines.some(l => /GST|Tax/i.test(l)), hasExtraHr: lines.some(l => /Extra Hour/i.test(l)), hasExtraKm: lines.some(l => /Extra K/i.test(l)),
    distance: lines.find(l => /\bKM\b|Distance/i.test(l)) || null, raw: lines.slice(0, 80) };
  const sTop = await snap(page, `${tag}-confirm-trip`);
  const total = m.getByText('Estimated Grand Total', { exact: false }).last();
  await total.evaluate(el => el.scrollIntoView({ block: 'end' })).catch(() => {});
  await page.waitForTimeout(500);
  const sCost = await snap(page, `${tag}-applied-fare`);
  if (process.env.SUBMIT === '1') return { applied, shots: [sTop, sCost], submission: await submitInquiry(page, m, tag) };
  // close without submitting
  await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(async () => page.keyboard.press('Escape'));
  await page.waitForTimeout(800);
  if (await page.locator('.modal.show').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  return { applied, shots: [sTop, sCost], submitClicked: false };
}

// Approved final step: click the submit CTA on "Confirm Your Trip & Selected Vehicles" and record the outcome.
// Stops after the result is shown. Never proceeds into payment (payment/cancel calls stay blocked by guard()).
export async function submitInquiry(page, m, tag) {
  const calls = [];
  const onResp = async r => { const q = r.request(); if (q.method() === 'GET' || !/siddaganga/.test(r.url())) return;
    let body = ''; try { body = (await r.text()).slice(0, 600); } catch {}
    calls.push({ method: q.method(), url: r.url().split('?')[0].replace(/.*\/api\/v1/, ''), status: r.status(), body: PII(body) }); };
  page.on('response', onResp);
  const btn = m.getByRole('button', { name: /Submit/i }).last();
  const label = norm(await btn.innerText());
  const urlBefore = page.url();
  await btn.click();
  await page.waitForTimeout(7000);
  page.off('response', onResp);
  const visible = await page.locator('.modal.show, [role=dialog], .swal2-popup, .Toastify__toast, [role=alert]').allInnerTexts().catch(() => []);
  const bodyText = norm(await page.locator('body').innerText()).slice(0, 1500);
  const msg = visible.map(v => PII(norm(v))).filter(Boolean).slice(0, 4);
  const idMatch = (msg.join(' ') + ' ' + calls.map(c => c.body).join(' ')).match(/(?:inquiry|enquiry|booking)[ _-]?(?:id|no|number)?["':\s#]*([A-Z]{0,6}[-_]?\d{3,})/i);
  const shot = await snap(page, `${tag}-submit-result`);
  const paymentShown = /pay now|payment|razorpay|upi|card number/i.test(bodyText + msg.join(' '));
  return { ctaLabel: label, urlBefore, urlAfter: page.url(), messages: msg, apiCalls: calls, inquiryRef: idMatch ? idMatch[1] : null, paymentShown, shot,
    success: calls.some(c => c.status >= 200 && c.status < 300 && !/draft|pricing|fcm|popular|explore/.test(c.url)) && !calls.some(c => c.status >= 400) };
}

export function save(id, data) {
  const dir = path.resolve('results', RUN); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2));
}
export { guard, messages, panel, toggle, home, place, formState as state };
