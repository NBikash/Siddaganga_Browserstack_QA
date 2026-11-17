// Module-agnostic helpers for the User-Web booking widget (Local, Outstation, Transfer P2P / By Hour, Multi-Leg).
// Safety: guard() (from ../_local.mjs) aborts every booking/inquiry/draft/payment/cancel API call, so nothing can be submitted.
// The review modal is opened and read, then closed; the final "Confirm & Submit" is never clicked.
import fs from 'node:fs';
import path from 'node:path';
import { guard } from '../_local.mjs';
import { shot as rawShot } from '../../scripts/lib.mjs';
import { cards, allCards } from '../local-cards.mjs';

export const RUN = process.env.RUN_ID || 'adhoc';
export const norm = s => (s || '').replace(/\s+/g, ' ').trim();
export const PII = s => (s || '').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/(?:\+?91[\s-]?)?[6-9]\d{4}\s?\d{5}/g, '<phone>');
const custMask = page => [page.locator('xpath=//*[contains(normalize-space(.),"Customer Details") and not(*[contains(normalize-space(.),"Customer Details")])]/..')];
export const snap = (page, name, opts = {}) => rawShot(page, `all/${RUN}/${name}`, { mask: custMask(page), ...opts });
export { guard, cards, allCards };

// Active booking pane: the visible .tab-pane holding a Book Now!/Next button.
export const pane = page => page.locator('.tab-pane.active').filter({ has: page.getByRole('button', { name: /Book Now!|^Next$/ }) }).last();

export async function open(page, tab, sub) {
  await guard(page);
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.getByText(tab, { exact: true }).first().click(); await page.waitForTimeout(700);
  if (sub) { await page.getByText(sub, { exact: true }).first().click(); await page.waitForTimeout(700); }
  await pane(page).scrollIntoViewIfNeeded().catch(() => {});
}

// Click the toggle's label; if that does not flip it (Outstation labels are not bound to the switch), click the switch itself.
export async function toggle(page, label) {
  const before = await toggleState(page, label);
  await pane(page).getByText(label, { exact: true }).first().click(); await page.waitForTimeout(700);
  if (before !== null && (await toggleState(page, label)) === before) {
    await pane(page).getByText(label, { exact: true }).first().evaluate(el => {
      let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) { c.click(); return; } }
    });
    await page.waitForTimeout(700);
    return { labelBound: false };
  }
  return { labelBound: true };
}
export async function toggleState(page, label) {
  return pane(page).getByText(label, { exact: true }).first().evaluate(el => {
    let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) return c.checked; }
    return null;
  }).catch(() => null);
}

// Places autocomplete: type, wait, choose first suggestion (or one containing `pick`).
export async function place(page, placeholder, query, pick) {
  const input = pane(page).locator(`input[placeholder="${placeholder}"]`).first();
  await input.click(); await input.fill('');
  await input.pressSequentially(query, { delay: 35 }); await page.waitForTimeout(1800);
  const opts = page.locator('.pac-container:visible .pac-item, [role=listbox]:visible [role=option], .suggestion-item:visible, ul:visible li[class*="sugg" i]');
  const list = (await opts.allInnerTexts()).map(norm);
  if (list.length) {
    const idx = pick ? Math.max(0, list.findIndex(s => s.toLowerCase().includes(pick.toLowerCase()))) : 0;
    await opts.nth(idx).click(); await page.waitForTimeout(1200);
  }
  return { query, suggestions: list.slice(0, 5), chosen: await input.inputValue() };
}

// Date inputs (value "YYYY-MM-DD") and time inputs ("h:mm AM") in DOM order inside the pane; idx selects which one.
export async function setDate(page, iso, idx = 0) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  await pane(page).locator('input[value^="20"]').nth(idx).click(); await page.waitForTimeout(500);
  for (let i = 0; i < 40; i++) {
    const cur = norm(await page.locator('.react-datepicker__current-month').first().innerText());
    if (cur === target) break;
    await page.locator('.react-datepicker__navigation--next').first().click(); await page.waitForTimeout(150);
  }
  const day = page.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`).first();
  const disabled = await day.evaluate(e => e.classList.contains('react-datepicker__day--disabled') || e.getAttribute('aria-disabled') === 'true');
  if (disabled) { await page.keyboard.press('Escape').catch(() => {}); return { requested: iso, dayDisabled: true, value: await pane(page).locator('input[value^="20"]').nth(idx).inputValue().catch(() => '') }; }
  await day.click(); await page.waitForTimeout(400);
  await page.keyboard.press('Escape').catch(() => {});
  return { requested: iso, dayDisabled: disabled, value: await pane(page).locator('input[value^="20"]').nth(idx).inputValue().catch(() => '') };
}
export async function setTime(page, label, idx = 0) {
  await pane(page).locator('input[value$="AM"], input[value$="PM"]').nth(idx).click(); await page.waitForTimeout(500);
  const items = page.locator('.react-datepicker__time-list-item').filter({ hasText: new RegExp(`^${label}$`) });
  const item = items.first();
  if (!(await item.count())) { await page.keyboard.press('Escape'); return { requested: label, available: false }; }
  const disabled = await item.evaluate(e => /disabled/.test(e.className));
  if (disabled) { await page.keyboard.press('Escape'); return { requested: label, disabled: true, value: await pane(page).locator('input[value$="AM"], input[value$="PM"]').nth(idx).inputValue().catch(() => '') }; }
  await item.scrollIntoViewIfNeeded(); await item.click(); await page.waitForTimeout(400);
  return { requested: label, disabled, value: await pane(page).locator('input[value$="AM"], input[value$="PM"]').nth(idx).inputValue().catch(() => '') };
}
export async function setMultiDates(page, list) { // [{next:0|1, d:20}]
  const p = pane(page); let month = 0;
  for (const { next, d } of list) {
    while (month < next) { await p.getByRole('button', { name: 'Next Month' }).click(); await page.waitForTimeout(300); month++; }
    await p.locator('.day-content').filter({ hasText: new RegExp(`^${d}$`) }).first().click(); await page.waitForTimeout(250);
  }
  return chipsText(page);
}
// Remove the chip for today's date (pre-selected by the app; clicking the day does not deselect it).
export async function removeTodayChip(page) {
  const label = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); // "Nov 17, 2026"
  await pane(page).locator('.selected-date-chip').filter({ hasText: label }).locator('.remove-date-btn').first().click().catch(() => {});
  await page.waitForTimeout(400);
  return chipsText(page);
}
const chipsText = async page => (await pane(page).locator('.selected-date-chip').allInnerTexts()).map(s => s.replace('×', '').trim()).join(', ');
export async function num(page, placeholder, v) {
  const i = pane(page).locator(`input[placeholder="${placeholder}"]`).first();
  await i.fill(String(v)); await page.waitForTimeout(500);
  return i.inputValue();
}

export async function msgs(page) {
  return page.evaluate(() => {
    const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
    return [...new Set([...document.querySelectorAll('.text-danger, .invalid-feedback, [class*="error-text" i], [class*="error-message" i], [role=alert], .Toastify__toast, .swal2-popup, .modal.show')]
      .filter(e => e.getBoundingClientRect().width).map(t).filter(s => s && s !== '*'))].slice(0, 10);
  }).then(a => a.map(PII));
}

// Click Book Now! and read the results page (or validation if it stays).
export async function submitSearch(page, tag) {
  const before = page.url();
  await pane(page).getByRole('button', { name: /Book Now!|^Next$/ }).first().click();
  await page.waitForURL(u => u.toString() !== before, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (page.url() === before) return { navigated: false, msgs: await msgs(page), shot: await snap(page, `${tag}-validation`) };
  await page.locator('text=/Buses Found|Vehicles Found|No .* found/i').first().waitFor({ timeout: 30000 }).catch(() => {});
  await page.locator('text=/Distance:/').first().waitFor({ timeout: 60000 }).catch(() => {}); // summary loads after the count
  await page.waitForTimeout(2500);
  const found = norm(await page.locator('text=/Buses Found|Vehicles Found/').first().innerText().catch(() => ''));
  const summary = PII(norm(await page.locator('text=/You have Searched For/').first().locator('xpath=../..').innerText().catch(() => ''))).slice(0, 700);
  const list = (await cards(page)).map(c => ({ vehicle: `${c.name} ${c.code}`.trim(), ...splitName(`${c.name} ${c.code}`), seats: c.seats, startsFrom: c.price }));
  await page.locator('text=/You have Searched For/').first().scrollIntoViewIfNeeded().catch(() => {});
  const s1 = await snap(page, `${tag}-results-summary`);
  await page.locator('text=/Recommended Vehicles/').first().scrollIntoViewIfNeeded().catch(() => {});
  const s2 = await snap(page, `${tag}-results-vehicles`);
  return { navigated: true, url: new URL(page.url()).pathname, found, summary, cards: list, msgs: await msgs(page), shots: [s1, s2] };
}

// Find the card containing `code` and click `action` on it (walks pagination).
export async function cardAction(page, code, action) {
  await page.mouse.move(2, 2); await page.waitForTimeout(400); // un-hover: the hover overlay hides the vehicle code
  const first = page.locator('ul.pagination li, .pagination button, .pagination a').filter({ hasText: /^\s*1\s*$/ }).first();
  if (await first.isVisible().catch(() => false)) { await first.click(); await page.waitForTimeout(1200); }
  for (let pg = 1; pg <= 8; pg++) {
    const ok = await page.evaluate(({ code, action }) => {
      document.querySelectorAll('[data-qa-target]').forEach(e => e.removeAttribute('data-qa-target'));
      for (const b of [...document.querySelectorAll('button, a, [role=button]')].filter(b => (b.innerText || '').trim() === action)) {
        let p = b; while (p && !/Starts From/.test(p.innerText || '')) p = p.parentElement;
        if (p && (' ' + p.innerText.replace(/\s+/g, ' ') + ' ').includes(' ' + code + ' ')) { b.setAttribute('data-qa-target', '1'); p.setAttribute('data-qa-target', 'card'); return true; }
      }
      return false;
    }, { code, action });
    if (ok) { const c = page.locator('[data-qa-target="card"]'); await c.scrollIntoViewIfNeeded(); await c.hover(); await page.waitForTimeout(500); await page.locator('[data-qa-target="1"]').click(); return pg; }
    const nb = page.locator('ul.pagination li, .pagination button, .pagination a').filter({ hasText: new RegExp(`^\\s*${pg + 1}\\s*$`) }).first();
    if (!(await nb.isVisible().catch(() => false))) break;
    await nb.click(); await page.waitForTimeout(1500);
  }
  throw new Error(`card "${code}" / "${action}" not found`);
}

const lines = t => t.split('\n').map(s => s.trim()).filter(Boolean);
async function closeModal(page) {
  const m = page.locator('.modal.show').first();
  await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(700);
  if (await page.locator('.modal.show').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
}

// View Full Vehicle Details → Fare Breakup (raw lines + labelled components).
export async function details(page, code, tag) {
  const pg = await cardAction(page, code, 'View Full Vehicle Details');
  const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(1500);
  const L = lines(await m.innerText());
  const val = re => { const i = L.findIndex(l => re.test(l)); if (i < 0) return null;
    const j = L.slice(i + 1, i + 4).findIndex(l => /^₹|^Actuals|^Additional|^NA$|^Included$/i.test(l)); return `${L[i]} = ${j < 0 ? L[i + 1] : L[i + 1 + j]}`; };
  const pricingIdx = L.findIndex(l => /Pricing|Fare Breakup|Fare Details/i.test(l));
  const fare = { heading: L[0], pricingBlock: pricingIdx < 0 ? null : L.slice(pricingIdx, pricingIdx + 26),
    baseRate: val(/^Base Rate|^Base Fare|^Per Day/i), extraKm: val(/^Extra Km/i), extraHour: val(/^Extra Hour/i), perKm: val(/per km|Rate per Km/i),
    dayBata: val(/^Day Bata|Driver Bata|^Bata/i), nightBata: val(/^Night Bata|Night Charge/i), toll: val(/^Toll/i), permit: val(/Permit|State Tax/i), gst: val(/^GST|Tax/i) };
  const fb = m.locator('text=/Pricing|Fare Breakup/').first(); await fb.scrollIntoViewIfNeeded().catch(() => {});
  const shot = await snap(page, `${tag}-fare-breakup`);
  await closeModal(page);
  return { onPage: pg, fare, shot };
}

// Book This Vehicle → review modal ("Confirm Your Trip"): read the applied fare, then close. Never submits.
export async function review(page, code, tag) {
  await cardAction(page, code, 'Book This Vehicle');
  await page.waitForTimeout(2500);
  const m = page.locator('.modal.show').first();
  if (!(await m.count())) return { opened: false, url: new URL(page.url()).pathname, msgs: await msgs(page), shot: await snap(page, `${tag}-after-book`) };
  const L = lines(PII(await m.innerText()));
  const cd = L.findIndex(l => /^Customer Details/.test(l)); if (cd >= 0) L.splice(cd + 1, 2, '<customer-name>', '<contact>'); // never keep account PII
  const ci = L.findIndex(l => /^Estimated Trip Cost|Fare Summary|Price Details/i.test(l));
  const cost = [];
  if (ci >= 0) for (let i = ci + 1; i < L.length - 1 && cost.length < 20; i += 2) { if (/Confirm|Submit|Cancel/.test(L[i])) break; cost.push(`${L[i]} = ${L[i + 1]}`); }
  const buttons = (await m.locator('button').allInnerTexts()).map(norm).filter(b => b && !/Keyboard|Map Data|km Click|Zoom|fullscreen/i.test(b));
  const s1 = await snap(page, `${tag}-review`);
  await m.locator('text=/Estimated Trip Cost/').first().scrollIntoViewIfNeeded().catch(() => {});
  const s2 = await snap(page, `${tag}-applied-fare`);
  const capacityPopup = /Capacity|not complete|insufficient/i.test(L.slice(0, 6).join(' ')) ? L.slice(0, 8).join(' ') : null;
  await closeModal(page);
  return { opened: true, title: L[0], capacityPopup, head: L.slice(0, 30), cost, buttons, shots: [s1, s2], submitClicked: false };
}

export function save(id, data) {
  const dir = path.resolve('results', RUN); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2));
}

// Card parser splits "33 Seater Deluxe Coach D35NA" as name "33" + code "Seater…"; rebuild name/code from the full text.
export function splitName(full) {
  full = full.replace(/\s+/g, ' ').trim();
  const m = full.match(/^(.*?) (D [A-Z]+)$/) || full.match(/^(.*) (\S+)$/);
  return m ? { name: m[1], code: m[2] } : { name: full, code: full };
}
// All result cards across pages; pick the first whose name matches `re` (vehicle rotation). Returns {name, code, seats, price, all}.
export async function findVehicle(page, re) {
  await page.mouse.move(2, 2); await page.waitForTimeout(400); // a hovered card hides its name/code
  const res = await allCards(page);
  const all = res.cards.map(c => ({ ...splitName(`${c.name} ${c.code}`), seats: c.seats, price: c.price }));
  const hit = all.find(c => re.test(c.name)) || null;
  return { hit, all, found: res.found };
}
export const amt = s => { const m = String(s || '').match(/₹\s*([\d,]+(?:\.\d+)?)/); return m ? Number(m[1].replace(/,/g, '')) : null; };

// Multi-leg results: pick a vehicle on every "Leg n" tab, then open the review on the last leg. Never submits.
export async function multiLegReview(page, re, legs, tag) {
  const perLeg = [];
  for (let i = 1; i <= legs; i++) {
    const tabEl = page.getByText(`Leg ${i}`, { exact: true }).first();
    if (await tabEl.isVisible().catch(() => false)) { await tabEl.click(); await page.waitForTimeout(2500); }
    const v = await findVehicle(page, re);
    if (!v.hit) { perLeg.push({ leg: i, vehicle: null, offered: v.all.length }); return { perLeg, review: null }; }
    if (i < legs) {
      await cardAction(page, v.hit.code, 'Book This Vehicle'); await page.waitForTimeout(2500);
      perLeg.push({ leg: i, vehicle: v.hit, msgs: await msgs(page) });
      if (await page.locator('.modal.show').count()) await page.keyboard.press('Escape');
    } else {
      perLeg.push({ leg: i, vehicle: v.hit });
      const r = await review(page, v.hit.code, tag);
      return { perLeg, review: r, vehicle: v.hit, all: v.all };
    }
  }
}
