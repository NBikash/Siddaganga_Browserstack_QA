// Outstation execution helpers (run user-web-<ts>-OUTSTATION). Reuses card helpers from the Local suite.
// Network guard (execution version):
//   * payment / razorpay / checkout / cancel: ALWAYS blocked.
//   * other mutating calls (save/submit/create/update/delete/edit/book/order/lead/confirm/draft) are BLOCKED unless the
//     URL matches a pattern currently in allowList (set only around an approved action, e.g. /save-inquiry/ for OUT-02).
//   * read calls sent as POST (get-inquiry-details, pricing, list, crypto/session, fcm, maps) are allowed.
import fs from 'node:fs';
import path from 'node:path';
import { cardAction as rawCardAction } from '../_local.mjs';
// Cards swap their content on hover (code hidden), so move the pointer away before locating a card by code.
// Visits results pages explicitly (current page first, then 1..6) because the shared helper's pagination regex is broken.
async function findOnPage(page, code, action) {
  await page.mouse.move(2, 2); await page.waitForTimeout(600);
  return page.evaluate(({ code, action }) => {
    document.querySelectorAll('[data-qa-target]').forEach(e => e.removeAttribute('data-qa-target'));
    for (const b of [...document.querySelectorAll('button, a, [role=button]')].filter(b => (b.innerText || '').trim() === action)) {
      let p = b; while (p && !/Starts From/.test(p.innerText || '')) p = p.parentElement;
      if (p && (' ' + p.innerText.replace(/\s+/g, ' ') + ' ').includes(' ' + code + ' ')) { b.setAttribute('data-qa-target', '1'); p.setAttribute('data-qa-target', 'card'); return true; }
    }
    return false;
  }, { code, action });
}
async function cardAction(page, code, action) {
  const go = async () => { const c = page.locator('[data-qa-target="card"]'); await c.scrollIntoViewIfNeeded(); await c.hover(); await page.waitForTimeout(600); await page.locator('[data-qa-target="1"]').click(); };
  if (await findOnPage(page, code, action)) return go();
  for (let pg = 1; pg <= 6; pg++) {
    const nb = page.locator('ul.pagination li, .pagination button, .pagination a').filter({ hasText: new RegExp(`^\\s*${pg}\\s*$`) }).first();
    if (!(await nb.isVisible().catch(() => false))) { if (pg > 1) break; else continue; }
    await nb.scrollIntoViewIfNeeded().catch(() => {}); await nb.click(); await page.waitForTimeout(1500);
    if (await findOnPage(page, code, action)) return go();
  }
  void rawCardAction;
  throw new Error(`card ${code} / ${action} not found on any results page`);
}
// Multi-Leg (added 19 Nov 2026): try several card CTA labels in turn; returns the label that worked.
export async function cardActionAny(page, code, actions) {
  let last;
  for (const a of actions) { try { await cardAction(page, code, a); return a; } catch (e) { last = e; } }
  throw last;
}
export const cardActionExact = (page, code, action) => cardAction(page, code, action);
import { cards } from '../local-cards.mjs';
import { shot as rawShot } from '../../scripts/lib.mjs';

export const RUN = process.env.RUN_ID;
const LOG = path.resolve('exploration-logs/raw/network.log');
const NEVER = /payment|razorpay|checkout|cancel/i;
const MUT = /save|submit|create|update|delete|edit|book|order|lead|confirm|draft/i;
const READ = /fcm-token|crypto\/session|pricing|popular-routes|explore-fleet|get-|list|fetch|details|maps\.googleapis/i;
export const allowList = [];
export const netLog = [];
export const norm = s => (s || '').replace(/\s+/g, ' ').trim();
export const PII = s => String(s || '').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/(?:\+?91[\s-]?)?[6-9]\d{4}\s?\d{5}/g, '<phone>');

export async function guard(page) {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  await page.unroute('**/*').catch(() => {});
  await page.route('**/*', async route => {
    const r = route.request(); const m = r.method(); const u = r.url().split('?')[0];
    if (m === 'GET' || m === 'OPTIONS' || m === 'HEAD') return route.continue();
    let verdict = 'allowed';
    if (NEVER.test(u)) verdict = 'BLOCKED';
    else if (/update-fcm-token/.test(u)) verdict = 'allowed';
    else if (MUT.test(u) && !(READ.test(u) && !/save|update|delete|create|submit/i.test(u))) verdict = allowList.some(re => re.test(u)) ? 'allowed(approved)' : 'BLOCKED';
    const line = `${new Date().toISOString()} ${verdict} ${m} ${u}`;
    fs.appendFileSync(LOG, line + '\n'); netLog.push(line.slice(25).replace(/https:\/\/api-preprod\.siddagangatravels\.com(\/public)?\/api\/v1/, ''));
    return verdict === 'BLOCKED' ? route.abort('blockedbyclient') : route.continue();
  });
}

const maskCust = page => [page.locator('xpath=//*[contains(normalize-space(.),"Customer Details") and not(*[contains(normalize-space(.),"Customer Details")])]/..')];
export const snap = (page, name, opts = {}) => rawShot(page, `exec-ot/${RUN}/${name}`, { mask: maskCust(page), ...opts });

export const loads = [];
export async function home(page, tab = 'Outstation') {
  for (let a = 1; a <= 3; a++) {
    const t0 = Date.now();
    await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (/\/login/.test(page.url()) || await page.locator('input[name=password]').isVisible().catch(() => false)) throw new Error('SESSION_LOGGED_OUT');
    await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 45000 }).catch(() => {});
    const t = page.locator('a.nav-link').getByText(tab, { exact: true }).first();
    // 18 Nov 2026 redesigned home page: an overlay intercepts the pointer on the inquiry tabs, so fall back to a DOM click.
    const clickTab = () => t.click({ timeout: 10000 }).catch(() => t.evaluate(e => e.click()));
    if (await t.waitFor({ state: 'visible', timeout: 45000 }).then(() => true).catch(() => false)) { await clickTab(); await page.waitForTimeout(900);
      if (tab === 'Outstation') for (let k = 0; k < 3 && !(await page.locator('.tab-pane.active input[placeholder="Search destination 1 location"]').isVisible().catch(() => false)); k++) { await clickTab(); await page.waitForTimeout(1200); }
      if (a > 1) loads.push(`home loaded on attempt ${a}`); return; }
    loads.push(`home attempt ${a}: still loading after ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  throw new Error('Home page did not finish loading after 3 attempts (environment)');
}
// Form scope: the Modify Inquiry pop-up when open (results page), else the active home tab pane.
export const active = page => page.locator('.modal.show, .tab-pane.active').first();
// Results page → Modify Inquiry → "Modify Leg 1" pop-up. Returns the pre-filled state exactly as shown.
export async function modifyOpen(page, tag) {
  await page.mouse.move(2, 2);
  await page.getByText('Modify Inquiry', { exact: false }).first().click();
  await page.locator('.modal.show').first().waitFor({ timeout: 15000 }); await page.waitForTimeout(2500);
  const m = page.locator('.modal.show').first();
  return { title: norm(await m.locator('.modal-title, h2, h3, h4').first().innerText().catch(() => '')),
    toggles: { md: await toggleState(page, 'Multi-day Trip').catch(() => null), dd: await toggleState(page, 'Drop at different location').catch(() => null) },
    fields: await formValues(page), shot: await snap(page, `${tag}-modify-prefill`) };
}
export async function modifySave(page, tag) {
  const m = page.locator('.modal.show').first();
  await m.getByRole('button', { name: /Save/i }).last().click(); await page.waitForTimeout(2000);
  const still = await page.locator('.modal.show').count();
  if (still) return { navigated: false, msgs: await msgs(page), shot: await snap(page, `${tag}-modify-validation`) };
  return readResults(page, tag);
}

export async function toggleState(page, label) {
  return active(page).getByText(label, { exact: true }).first().evaluate(el => { let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) return c.checked; } return null; });
}
export async function setToggle(page, label, want) {
  const box = active(page).getByText(label, { exact: true }).first();
  for (let i = 0; i < 3 && (await toggleState(page, label)) !== want; i++) {
    const inp = box.locator('xpath=ancestor::*[.//input[@type="checkbox"]][1]//input[@type="checkbox"]').first();
    // 18 Nov 2026 redesigned home page: overlay can intercept the pointer → DOM click fallback.
    // A forced pointer click can land on the overlay and silently do nothing, so click the checkbox through the DOM first.
    await inp.evaluate(e => e.click()).catch(() => inp.click({ force: true, timeout: 8000 })).catch(() => box.click({ timeout: 8000 })); await page.waitForTimeout(700);
  }
  return toggleState(page, label);
}
export async function place(page, ph, query, pick) {
  const input = active(page).locator(`input[placeholder="${ph}"]:visible`).first();
  await input.click({ timeout: 8000 }).catch(() => input.focus()); await input.fill('');
  await input.pressSequentially(query, { delay: 35 }); await page.waitForTimeout(1200);
  const opts = page.locator('.pac-container:visible .pac-item, [role=listbox]:visible [role=option], .suggestion-item:visible, ul:visible li[class*="sugg" i]');
  await opts.first().waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});
  await page.waitForTimeout(600);
  const list = (await opts.allInnerTexts()).map(norm);
  if (list.length) {
    const idx = pick ? Math.max(0, list.findIndex(s => s.toLowerCase().includes(pick.toLowerCase()))) : 0;
    await opts.nth(idx).click({ timeout: 8000 }).catch(() => opts.nth(idx).evaluate(e => { e.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); e.click(); })); await page.waitForTimeout(1200);
  }
  return { ph, query, suggestions: list.slice(0, 4), chosen: await input.inputValue() };
}
export async function typeNoPick(page, ph, text) {
  const input = active(page).locator(`input[placeholder="${ph}"]:visible`).first();
  await input.click(); await input.fill(''); await input.pressSequentially(text, { delay: 30 }); await page.waitForTimeout(1500);
  await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(5, 5); await page.waitForTimeout(500);
  return input.inputValue();
}
export async function clearPlace(page, ph) {
  const input = active(page).locator(`input[placeholder="${ph}"]:visible`).first();
  await input.click(); await input.fill(''); await page.keyboard.press('Tab'); await page.waitForTimeout(600);
}
export async function addDest(page) {
  await active(page).locator('button').filter({ hasText: /Add Another Destination/ }).first().click(); await page.waitForTimeout(700);
}
export async function removeDest(page, n) {
  const btn = active(page).locator(`input[placeholder="Search destination ${n} location"]`).locator('xpath=ancestor::div[.//button][1]//button').first();
  await btn.click(); await page.waitForTimeout(700);
}
export async function setDate(page, idx, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  await active(page).locator('input[value^="20"]:visible').nth(idx).click(); await page.waitForTimeout(500);
  for (let i = 0; i < 40; i++) {
    const cur = norm(await page.locator('.react-datepicker__current-month').first().innerText());
    if (cur === target) break;
    const nav = new Date(cur) < new Date(target) ? '.react-datepicker__navigation--next' : '.react-datepicker__navigation--previous';
    await page.locator(nav).click(); await page.waitForTimeout(120);
  }
  const day = page.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`).first();
  const disabled = await day.evaluate(e => e.className.includes('disabled') || e.getAttribute('aria-disabled') === 'true');
  await day.click().catch(() => {}); await page.waitForTimeout(400);
  if (await page.locator('.react-datepicker').count()) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(200); }
  return { iso, disabled, value: await active(page).locator('input[value^="20"]:visible').nth(idx).inputValue().catch(() => null) };
}
export async function setTime(page, idx, label) {
  await active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').nth(idx).click(); await page.waitForTimeout(500);
  const item = page.locator('.react-datepicker__time-list-item:visible').filter({ hasText: new RegExp(`^${label}$`) }).first();
  const disabled = await item.evaluate(e => e.className.includes('disabled')).catch(() => null);
  await item.scrollIntoViewIfNeeded().catch(() => {}); await item.click().catch(() => {}); await page.waitForTimeout(400);
  if (await page.locator('.react-datepicker').count()) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(200); }
  return { label, disabled };
}
export async function setPax(page, n) { await active(page).locator('input[placeholder="Enter number of passengers"]:visible').fill(String(n)); await page.waitForTimeout(300); }
export async function formValues(page) {
  return active(page).evaluate(root => [...root.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width)
    .map(e => ({ ph: e.placeholder || e.type, v: e.type === 'checkbox' ? e.checked : e.value })));
}
export async function msgs(page) {
  const txt = await active(page).innerText().catch(() => '');
  const toasts = await page.locator('[role=alert], .Toastify__toast, [class*="toast" i], .swal2-popup').allInnerTexts().catch(() => []);
  return { inline: [...new Set(txt.split('\n').map(norm).filter(s => /required|invalid|please|must|cannot|can't|minimum|maximum|exceed|least|not available|error|same|after|before|allowed/i.test(s)))],
    toasts: toasts.map(PII).map(norm).filter(Boolean) };
}

// Fill the Outstation form. F = { md, dd, pickup:[q,pick], dests:[[q,pick],...], drop:[q,pick], dates:[pickISO, dropISO], times:[pickT, dropT], pax }
export async function fill(page, F) {
  await home(page, 'Outstation');
  const r = { toggles: {} };
  if (F.md != null) r.toggles.md = await setToggle(page, 'Multi-day Trip', F.md);
  if (F.dd != null) r.toggles.dd = await setToggle(page, 'Drop at different location', F.dd);
  r.places = [];
  if (F.pickup) r.places.push(await place(page, 'Search pickup location', ...F.pickup));
  for (let i = 0; i < (F.dests || []).length; i++) {
    if (i > 0) await addDest(page);
    r.places.push(await place(page, `Search destination ${i + 1} location`, ...F.dests[i]));
  }
  if (F.drop) r.places.push(await place(page, 'Search drop location', ...F.drop));
  r.dates = [];
  if (F.dates?.[0]) r.dates.push(await setDate(page, 0, F.dates[0]));
  if (F.times?.[0]) r.dates.push(await setTime(page, 0, F.times[0]));
  if (F.dates?.[1]) r.dates.push(await setDate(page, 1, F.dates[1]));
  if (F.times?.[1]) r.dates.push(await setTime(page, 1, F.times[1]));
  if (F.pax != null) await setPax(page, F.pax);
  await page.waitForTimeout(800);
  r.form = await formValues(page);
  return r;
}

// Map: Google Maps container(s) and marker labels in a scope.
export async function mapInfo(page, scope, tag) {
  const s = scope || page.locator('body');
  const info = await s.evaluate(root => {
    const maps = [...root.querySelectorAll('.gm-style')].filter(m => m.getBoundingClientRect().width > 50);
    return maps.map(m => {
      const r = m.getBoundingClientRect();
      const labels = [...m.querySelectorAll('[role=button][aria-label], [title], gmp-advanced-marker, div[style*="label"], .marker-label')]
        .map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim()).filter(t => t && t.length < 60 && !/Keyboard|Map data|Terms|Report|Zoom|Toggle|Map camera|Google|Show/.test(t));
      const txt = [...m.querySelectorAll('div, span')].filter(e => !e.children.length).map(e => e.innerText.trim()).filter(t => /^[A-Z0-9]{1,2}$/.test(t));
      const poly = m.querySelectorAll('path, canvas').length;
      return { box: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)], labels: [...new Set(labels)].slice(0, 20), letters: txt, imgMarkers: m.querySelectorAll('img[src*="marker"], img[src*="pin"], img[src*="spotlight"]').length, paths: poly };
    });
  }).catch(e => ({ err: String(e).slice(0, 100) }));
  let shotPath = null;
  if (Array.isArray(info) && info.length) {
    const el = s.locator('.gm-style').first(); await el.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1200);
    shotPath = await snap(page, `${tag}-map`);
  }
  return { count: Array.isArray(info) ? info.length : 0, maps: info, shot: shotPath };
}

export async function search(page, tag) {
  await active(page).getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForURL(/send-inquiry/, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  if (!/send-inquiry/.test(page.url())) return { navigated: false, msgs: await msgs(page), form: await formValues(page), shot: await snap(page, `${tag}-validation`) };
  return readResults(page, tag);
}
export async function readResults(page, tag) {
  await page.locator('text=/Found/').first().waitFor({ timeout: 30000 }).catch(() => {});
  await page.locator('text=/[1-9]\d* Buses Found/').first().waitFor({ timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const body = norm(PII(await page.locator('body').innerText()));
  const summary = body.match(/You have Searched For(.{0,900}?)(?:Recommended|Filter|Sort|\d+ Buses Found)/)?.[1] || body.match(/You have Searched For.{0,900}/)?.[0];
  const found = norm(await page.locator('text=/Found/').first().innerText().catch(() => ''));
  const page1 = (await cards(page)).map(c => `${c.name} ${c.code} ${c.seats} ${c.price}`);
  await page.locator('text=/You have Searched For/').first().scrollIntoViewIfNeeded().catch(() => {});
  const s1 = await snap(page, `${tag}-results`);
  const pick = re => summary?.match(re)?.[1]?.trim();
  return { navigated: true, found, summary: norm(summary), distance: pick(/Distance\s*:\s*([\d,.]+\s*KM)/i), dates: pick(/Dates\s*:\s*([^A-Z]*?\d{4})/), duration: pick(/Duration\s*:\s*(\d+\s*Days?)/i),
    pax: pick(/Passengers\s*:\s*(\d+)/i), drop: pick(/Drop Address\s*:\s*(.+?)(?:$| Modify| Pickup| Duration| Passengers)/), route: summary?.match(/Garage \(Start\).*?Garage \(Return\)/)?.[0], page1, shot: s1 };
}

const lines = t => PII(t).split('\n').map(s => s.trim()).filter(Boolean);
export async function details(page, code, tag) {
  await cardAction(page, code, 'View Full Vehicle Details');
  const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(1500);
  const L = lines(await m.innerText());
  const i = L.findIndex(l => /Trip Pricing/i.test(l));
  const pricing = L.slice(Math.max(0, i), i + 30);
  await m.locator('text=/Trip Pricing/').first().scrollIntoViewIfNeeded().catch(() => {});
  const s = await snap(page, `${tag}-fare-breakup`);
  await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(800);
  if (await page.locator('.modal.show').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  return { vehicle: code, pricing, shot: s };
}

// Book This Vehicle → Confirm screen (records everything; closes unless submit requested)
export async function confirmScreen(page, code, tag) {
  // Card CTA is 'Book This Vehicle' on a fresh search but 'Send Inquiry' after Modify Inquiry → Save! (observed).
  let cta = 'Book This Vehicle';
  try { await cardAction(page, code, cta); } catch (e) { cta = 'Send Inquiry'; await cardAction(page, code, cta); }
  const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(3000);
  const L = lines(await m.innerText()).filter(l => !/^Bikash/.test(l));
  const after = h => { const i = L.findIndex(l => l === h || l.startsWith(h)); return i < 0 ? null : L[i + 1]; };
  const cs = L.findIndex(l => /^Estimated Trip Cost/.test(l)); const cost = [];
  if (cs >= 0) for (let i = cs + 1; i < L.length - 1; i += 2) { if (/Confirm|Submit/.test(L[i])) break; cost.push([L[i], L[i + 1]]); }
  const rs = L.findIndex(l => /^Route Summary/.test(l)); const re = L.findIndex(l => l === 'Dates');
  const out = { cta, title: L[0], popup: /Capacity Not Complete/.test(L[0]) ? L.slice(0, 4).join(' ') : null, selected: L.find(l => /^Selected Vehicles/.test(l)),
    route: rs >= 0 && re > rs ? L.slice(rs + 1, re) : null, dates: after('Dates'), passenger: after('Passenger'), dropoff: after('Dropoff Location'), cost,
    total: cost.find(c => /Grand Total/.test(c[0]))?.[1], buttons: (await m.locator('button').allInnerTexts()).map(norm).filter(b => b && !/Keyboard|Map Data/.test(b)),
    map: await mapInfo(page, m, `${tag}-confirm`) };
  out.shot = await snap(page, `${tag}-confirm`);
  await m.getByText('Estimated Grand Total', { exact: false }).last().evaluate(el => el.scrollIntoView({ block: 'end' })).catch(() => {});
  await page.waitForTimeout(400);
  out.shotCost = await snap(page, `${tag}-confirm-cost`);
  return { m, out };
}
export async function closeModal(page) {
  const m = page.locator('.modal.show').first();
  await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(800);
  if (await page.locator('.modal.show').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
}

// APPROVED ONLY: click Confirm & Submit Booking (dbl = double-click check). Returns success popup text.
export async function submit(page, m, tag, { dbl = false } = {}) {
  allowList.push(/save-inquiry/, /draft-inquiry/);
  const before = netLog.length;
  const btn = m.getByRole('button', { name: /Submit/i }).last();
  if (dbl) await btn.dblclick(); else await btn.click();
  await page.waitForTimeout(8000);
  allowList.length = 0;
  const visible = await page.locator('.modal.show, [role=dialog], .swal2-popup, .Toastify__toast, [role=alert]').allInnerTexts().catch(() => []);
  const msg = visible.map(v => PII(norm(v))).filter(Boolean).slice(0, 3);
  const calls = netLog.slice(before);
  return { messages: msg, calls, saveCalls: calls.filter(c => /save-inquiry/.test(c)).length, estimate: msg.join(' ').match(/Estimated Cost \(Approx\.\)\s*(₹[\d,]+)/)?.[1] || null, shot: await snap(page, `${tag}-submit-result`) };
}

// My Inquiries
export async function myInquiries(page, tag) {
  await page.goto(new URL('/dashboard', process.env.USER_WEB_URL).href, { waitUntil: 'domcontentloaded' });
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.getByText('My Inquiries', { exact: true }).first().click();
  await page.locator('text=/Inquiry ID/').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(2500);
  const rows = (await page.locator('.rdt_TableRow').allInnerTexts()).map(norm);
  const total = norm(await page.locator('text=/\\d+-\\d+ of \\d+/').first().innerText().catch(() => ''));
  const shot = tag ? await snap(page, `${tag}-my-inquiries`) : null;
  return { rows, total, shot, parsed: rows.map(r => { const p = r.match(/^(\d+) ([A-Z]{4}\d{6}) (\w+) (.+?) (\d{1,2} \w{3} \d{4} - \d{1,2} \w{3} \d{4}) (.+?) (\d+) (\d\d\/\d\d\/\d\d) (.*)$/); return p ? { sr: +p[1], id: p[2], type: p[3], route: p[4], dates: p[5], vehicle: p[6], pax: +p[7], validity: p[8], status: p[9] } : { raw: r }; }) };
}
export async function openRowMenu(page, id) {
  const row = page.locator('.rdt_TableRow').filter({ hasText: id }).first();
  await row.locator('button.dropdown-toggle').first().click(); await page.waitForTimeout(700);
  return row;
}
export async function openEdit(page, id, tag) {
  await openRowMenu(page, id);
  await page.locator('.dropdown-menu.show').getByText('Edit Inquiry', { exact: true }).first().click();
  await page.waitForURL(/update-inquiry/, { timeout: 20000 }); await page.waitForTimeout(4000);
  return readEdit(page, tag);
}
export async function readEdit(page, tag) {
  const body = PII(norm(await page.locator('body').innerText()));
  const text = body.match(/Edit Inquiry.*?(?=About Siddaganga)/)?.[0] || body.slice(0, 3000);
  const inputs = await page.locator('main input:visible, main select:visible, main textarea:visible, form input:visible, form select:visible').evaluateAll(els => els.map(e => ({ ph: e.placeholder, name: e.name, type: e.type, v: e.tagName === 'SELECT' ? (e.options[e.selectedIndex]?.text || e.value) : (e.type === 'checkbox' ? e.checked : e.value), dis: e.disabled, ro: e.readOnly })));
  const shot = tag ? await snap(page, `${tag}-edit-form`, { fullPage: true }) : null;
  return { url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), text, inputs, shot };
}
// Inquiry status cell button ("New quotation") → quotation/details view
export async function openQuotation(page, id, tag) {
  const row = page.locator('.rdt_TableRow').filter({ hasText: id }).first();
  const b = row.locator('button').filter({ hasText: /quotation|Pending/i }).first();
  await b.click(); await page.waitForTimeout(3500);
  const scope = (await page.locator('.modal.show').count()) ? page.locator('.modal.show').last() : page.locator('body');
  const text = PII(norm(await scope.innerText()));
  const shot = await snap(page, `${tag}-inquiry-details`, { fullPage: !(await page.locator('.modal.show').count()) });
  return { url: page.url().replace(/[0-9a-f-]{36}/, '<id>'), text: text.slice(0, 5000), shot, modal: (await page.locator('.modal.show').count()) > 0 };
}

export function save(id, data) {
  const dir = path.resolve('results', RUN); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(data, null, 2));
}
export function load(id) { try { return JSON.parse(fs.readFileSync(path.resolve('results', RUN, `${id}.json`), 'utf8')); } catch { return null; } }
