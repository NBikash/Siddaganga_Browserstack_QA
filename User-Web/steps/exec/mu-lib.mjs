// Multi-Leg execution helpers (run user-web-<ts>-MULTILEG). Reuses ot-lib (guard, snap, results, fare details, confirm,
// submit, My Inquiries). Form helpers here are scoped to the Multi-Leg pane (or the open modal, e.g. "Modify Leg n"),
// because ot-lib.active() picks the first .tab-pane.active, which is a hidden Transfer sub-pane on this page.
import * as L from './ot-lib.mjs';
export { L };
const { snap, norm } = L;

export const PANE = '#home-inquiry-tabs-tabpane-fourth';
export const scope = page => page.locator(`.modal.show, ${PANE}`).first();
// Inner active leg-type pane (Local / Outstation / Transfer) when present.
// Modal (portal, end of body) wins when open; otherwise the innermost active leg-type pane of the Multi-Leg pane.
export const legPane = page => page.locator(`.modal.show, ${PANE} .tab-pane.active`).last();

export const D = n => { const d = new Date(2026, 10, 19 + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const PH = { p: 'Search pickup location', x: 'Search drop location', h: 'Enter Number of Hours', n: 'Enter number of passengers', to: 'Search drop location' };

// A blocked Book Now! leaves sessionStorage.pendingInquiryFormData, which the app restores into the next Multi-Leg trip
// (MLG-03 observation). Cleared before each fresh start so cases stay independent; KEEP_PENDING=1 keeps it (reproduction).
export async function open(page, { keepPending = !!process.env.KEEP_PENDING } = {}) {
  if (!keepPending) await page.evaluate(() => sessionStorage.removeItem('pendingInquiryFormData')).catch(() => {});
  await L.home(page, 'Transfer');
  await page.locator('#home-inquiry-tabs-tab-fourth').evaluate(e => e.click()); await page.waitForTimeout(1500);
}
export const totalInput = page => page.locator(`${PANE} input[type=number]`).first();
export async function step1(page, total, opts) {
  await open(page, opts);
  const i = totalInput(page); await i.click(); await i.fill(''); if (total !== '') await page.keyboard.type(String(total), { delay: 40 });
  await page.waitForTimeout(300);
  const typed = await i.inputValue();
  await page.locator(PANE).getByRole('button', { name: 'Next', exact: true }).click(); await page.waitForTimeout(1800);
  const txt = norm(await page.locator(PANE).innerText());
  return { typed, after: await i.inputValue().catch(() => null), step2: /Trip Leg #/.test(txt), msgs: lines(txt).filter(isMsg), text: txt.slice(0, 300) };
}
const isMsg = s => /required|invalid|please|must|cannot|can't|minimum|maximum|exceed|least|not available|error|allowed|restricted|outside/i.test(s);
const lines = t => t.split(/(?<=[.!])\s+|\n/).map(norm).filter(Boolean);

export async function tab(page, name) { // Local | Outstation | Transfer
  await page.locator(`#left-tabs-example-tab-${name.toLowerCase()}`).evaluate(e => e.click()); await page.waitForTimeout(1000);
}
export const activeTab = page => page.locator(`${PANE} a.nav-link.active[id^="left-tabs-example-tab-"]`).first().innerText().then(norm).catch(() => null);

export async function toggleState(page, label, idx = 0) {
  return legPane(page).getByText(label, { exact: true }).nth(idx).evaluate(el => { let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) return c.checked; } return null; });
}
export async function setToggle(page, label, want, idx = 0) {
  for (let i = 0; i < 3 && (await toggleState(page, label, idx)) !== want; i++) {
    await legPane(page).getByText(label, { exact: true }).nth(idx).evaluate(el => { let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) { c.click(); return; } } });
    await page.waitForTimeout(700);
  }
  return toggleState(page, label, idx);
}
const inp = (page, ph, idx = 0) => legPane(page).locator(`input[placeholder="${ph}"]:visible`).nth(idx);
export async function place(page, ph, query, pick, idx = 0) {
  const input = inp(page, ph, idx);
  await input.scrollIntoViewIfNeeded().catch(() => {});
  await input.click({ timeout: 8000 }).catch(() => input.focus()); await input.fill('');
  await input.pressSequentially(query, { delay: 35 }); await page.waitForTimeout(1300);
  const opts = page.locator('.pac-container:visible .pac-item, [role=listbox]:visible [role=option], .suggestion-item:visible, ul:visible li[class*="sugg" i]');
  await opts.first().waitFor({ state: 'visible', timeout: 7000 }).catch(() => {});
  await page.waitForTimeout(500);
  const list = (await opts.allInnerTexts()).map(norm);
  if (list.length) {
    const i = pick ? Math.max(0, list.findIndex(s => s.toLowerCase().includes(pick.toLowerCase()))) : 0;
    await opts.nth(i).click({ timeout: 8000 }).catch(() => opts.nth(i).evaluate(e => { e.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); e.click(); }));
    await page.waitForTimeout(1300);
  }
  return { ph, idx, query, suggestions: list.slice(0, 4), chosen: await input.inputValue() };
}
export async function typeNoPick(page, ph, text, idx = 0) {
  const input = inp(page, ph, idx);
  await input.click(); await input.fill(''); await input.pressSequentially(text, { delay: 30 }); await page.waitForTimeout(1500);
  await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(5, 5); await page.waitForTimeout(500);
  return input.inputValue();
}
// Date/time inputs: idx counts the visible date (value 20xx-..) / time (..AM|PM) inputs inside the active leg pane.
export async function setDate(page, idx, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, 1);
  const el = legPane(page).locator('input[value^="20"]:visible').nth(idx);
  await el.scrollIntoViewIfNeeded().catch(() => {}); await el.click(); await page.waitForTimeout(500);
  for (let i = 0; i < 40; i++) {
    const cur = new Date(norm(await page.locator('.react-datepicker__current-month:visible').first().innerText()));
    if (cur.getFullYear() === target.getFullYear() && cur.getMonth() === target.getMonth()) break;
    await page.locator(cur < target ? '.react-datepicker__navigation--next:visible' : '.react-datepicker__navigation--previous:visible').first().click(); await page.waitForTimeout(120);
  }
  const day = page.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month):visible`).first();
  const disabled = await day.evaluate(e => e.className.includes('disabled') || e.getAttribute('aria-disabled') === 'true').catch(() => null);
  await day.click().catch(() => {}); await page.waitForTimeout(400);
  if (await page.locator('.react-datepicker-popper').count()) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(200); }
  return { iso, disabled, value: await el.inputValue().catch(() => null) };
}
export async function setTime(page, idx, label) {
  const el = legPane(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').nth(idx);
  await el.scrollIntoViewIfNeeded().catch(() => {}); await el.click(); await page.waitForTimeout(500);
  const item = page.locator('.react-datepicker__time-list-item:visible').filter({ hasText: new RegExp(`^${label}$`) }).first();
  const disabled = await item.evaluate(e => e.className.includes('disabled')).catch(() => null);
  await item.scrollIntoViewIfNeeded().catch(() => {}); await item.click().catch(() => {}); await page.waitForTimeout(400);
  if (await page.locator('.react-datepicker-popper').count()) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(200); }
  return { label, disabled, value: await el.inputValue().catch(() => null) };
}
// Type a date straight into the date input (for "yesterday typed" checks).
export async function typeDate(page, idx, text) {
  const el = legPane(page).locator('input[value^="20"]:visible').nth(idx);
  await el.click(); await page.keyboard.press('Control+A'); await page.keyboard.type(text, { delay: 40 }); await page.keyboard.press('Enter');
  await page.waitForTimeout(500); await page.keyboard.press('Escape').catch(() => {});
  return el.inputValue();
}
export async function setNum(page, ph, v, idx = 0) {
  const i = inp(page, ph, idx); await i.click(); await i.fill(''); if (v !== '') await page.keyboard.type(String(v), { delay: 40 }); await page.waitForTimeout(300);
  return i.inputValue();
}
export async function btn(page, name, wait = 1500) {
  const re = new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\!]/g, '\\$&')}\\s*$`);
  const b = scope(page).locator('button:visible').filter({ hasText: re }).first();
  await b.scrollIntoViewIfNeeded().catch(() => {}); await b.click({ timeout: 8000 }).catch(() => b.evaluate(e => e.click()));
  await page.waitForTimeout(wait);
}
export async function toasts(page) {
  const t = await page.locator('.Toastify__toast, [role=alert], .swal2-popup').allInnerTexts().catch(() => []);
  return [...new Set(t.map(L.PII).map(norm).filter(Boolean))];
}
export async function msgs(page) {
  const txt = await legPane(page).innerText().catch(() => '');
  const inline = await legPane(page).locator('.invalid-feedback:visible, .text-danger:visible, [class*=error]:visible').allInnerTexts().catch(() => []);
  return { inline: [...new Set([...inline, ...txt.split('\n').filter(isMsg)].map(norm).filter(Boolean))], toasts: await toasts(page) };
}
// Saved leg list (badges) + header
export async function legList(page) {
  return page.locator(PANE).evaluate(root => ({
    header: ((root.innerText || '').match(/Trip Leg #\d+/g) || []),
    badges: [...root.querySelectorAll('.leg-badge')].map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')),
    innerLegs: [...root.querySelectorAll('.tab-pane.active h5')].filter(e => e.getBoundingClientRect().width).map(e => (e.innerText || '').trim()),
    step1: !!root.querySelector('input[type=number]:not([placeholder])') && !/Trip Leg #/.test(root.innerText || ''),
  })).catch(() => null);
}
export async function badge(page, n) { await page.locator(`${PANE} .leg-badge`).nth(n - 1).click(); await page.waitForTimeout(1500); }
export async function deleteLeg(page, n) { await page.locator(`${PANE} .delete-leg-btn`).nth(n - 1).click(); await page.waitForTimeout(1200); }
export async function tripTrash(page) { await page.locator(`${PANE} a.trash-icon-link`).first().click(); await page.waitForTimeout(1500); }
export async function addLeg(page) { await legPane(page).locator('button').filter({ hasText: /Add Another Leg/ }).first().click(); await page.waitForTimeout(900); }
export const chips = page => legPane(page).locator('.selected-date-chip:visible').allInnerTexts().then(a => a.map(x => norm(x.replace('×', ''))));
export async function removeChip(page, text) { await legPane(page).locator('.selected-date-chip:visible').filter({ hasText: text }).first().locator('.remove-date-btn').click(); await page.waitForTimeout(500); }
export async function pickDays(page, isos) {
  // Local multi-day calendar is a custom component: month header "November 2026", "Next Month"/"Previous Month" buttons, .day-content days.
  const lp = legPane(page); const out = [];
  const curMonth = async () => { const t = norm(await lp.innerText()); const m = t.match(/(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/); return m ? new Date(`${m[1]} 1, ${m[2]}`) : null; };
  for (const iso of isos) {
    const [y, m, d] = iso.split('-').map(Number); const target = new Date(y, m - 1, 1);
    for (let i = 0; i < 24; i++) {
      const cur = await curMonth(); if (!cur || (cur.getFullYear() === target.getFullYear() && cur.getMonth() === target.getMonth())) break;
      await lp.getByRole('button', { name: cur < target ? 'Next Month' : 'Previous Month' }).first().click(); await page.waitForTimeout(300);
    }
    const day = lp.locator('.day-content').filter({ hasText: new RegExp(`^${d}$`) });
    // first match in the current month (leading days of the next month come after)
    const n = await day.count(); let el = day.first();
    if (d > 20 && n > 1) el = day.nth(0); else if (d <= 7 && n > 1) el = day.nth(n > 1 && iso.endsWith(String(d).padStart(2, '0')) ? 0 : 0);
    const disabled = await el.evaluate(e => /disabled/.test(e.className + ' ' + (e.parentElement?.className || ''))).catch(() => null);
    await el.click().catch(() => {}); await page.waitForTimeout(400); out.push({ iso, disabled });
  }
  return { picked: out, chips: await chips(page) };
}
export async function state(page) {
  return legPane(page).evaluate(root => [...root.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width)
    .map(e => `${e.placeholder || e.type}=${e.type === 'checkbox' ? e.checked : e.value}`)).catch(() => []);
}

// --- Leg fillers (current tab; goes to the tab first) ---
// LOC = { pickup:[q,pick], dd, drop:[q,pick], md, days:[iso], date, time, hours, pax }
export async function fillLocal(page, F, { go = true } = {}) {
  if (go) await tab(page, 'Local');
  const r = { places: [] };
  if (F.md != null) r.md = await setToggle(page, 'Multi-day Trip', F.md);
  if (F.dd != null) r.dd = await setToggle(page, 'Drop at different location', F.dd);
  if (F.pickup) r.places.push(await place(page, PH.p, ...F.pickup));
  if (F.drop) r.places.push(await place(page, PH.x, ...F.drop));
  if (F.date) r.date = await setDate(page, 0, F.date);
  if (F.time) r.time = await setTime(page, 0, F.time);
  if (F.hours != null) r.hours = await setNum(page, PH.h, F.hours);
  if (F.pax != null) r.pax = await setNum(page, PH.n, F.pax);
  r.state = await state(page);
  return r;
}
// OUT = { pickup, dests:[[q,pick]...], dd, drop, dates:[p,d], times:[p,d], pax, legIdx }
export async function fillOut(page, F, { go = true } = {}) {
  if (go) await tab(page, 'Outstation');
  const r = { places: [] };
  if (F.dd != null) r.dd = await setToggle(page, 'Drop at different location', F.dd, F.legIdx || 0);
  const li = F.legIdx || 0;
  if (F.pickup) r.places.push(await place(page, PH.p, ...F.pickup, li));
  for (let i = 0; i < (F.dests || []).length; i++) {
    if (i > 0) { await legPane(page).locator('button').filter({ hasText: /Add Another Destination/ }).nth(li).click(); await page.waitForTimeout(700); }
    r.places.push(await place(page, `Search destination ${i + 1} location`, ...F.dests[i], li));
  }
  if (F.drop) r.places.push(await place(page, PH.x, ...F.drop, li));
  if (F.dates?.[0]) r.d0 = await setDate(page, li * 2, F.dates[0]);
  if (F.times?.[0]) r.t0 = await setTime(page, li * 2, F.times[0]);
  if (F.dates?.[1]) r.d1 = await setDate(page, li * 2 + 1, F.dates[1]);
  if (F.times?.[1]) r.t1 = await setTime(page, li * 2 + 1, F.times[1]);
  if (F.pax != null) r.pax = await setNum(page, PH.n, F.pax, li);
  r.state = await state(page);
  return r;
}
// TRF = { from:[q,pick], to:[q,pick], date, time, dropDate, dropTime, pax, legIdx }
export async function fillTrf(page, F, { go = true } = {}) {
  if (go) await tab(page, 'Transfer');
  const li = F.legIdx || 0; const r = { places: [] };
  if (F.from) r.places.push(await place(page, PH.p, ...F.from, li));
  if (F.to) r.places.push(await place(page, PH.x, ...F.to, li));
  if (F.date) r.d0 = await setDate(page, li * 2, F.date);
  if (F.time) r.t0 = await setTime(page, li * 2, F.time);
  if (F.dropDate) r.d1 = await setDate(page, li * 2 + 1, F.dropDate);
  if (F.dropTime) r.t1 = await setTime(page, li * 2 + 1, F.dropTime);
  if (F.pax != null) r.pax = await setNum(page, PH.n, F.pax, li);
  r.state = await state(page);
  return r;
}
export async function save(page, tag) {
  await btn(page, 'Save!', 1200);
  const t = await toasts(page);
  return { toasts: t, msgs: (await msgs(page)).inline, tabAfter: await activeTab(page), legs: await legList(page), shot: await snap(page, `${tag}-saved`) };
}
export async function skip(page, name) { await btn(page, `Skip ${name}`, 1200); return { toasts: await toasts(page), tabAfter: await activeTab(page), legs: await legList(page) }; }

// --- Results page (multi-leg) ---
export async function bookNow(page, tag) {
  await btn(page, 'Book Now!', 1500);
  await page.waitForURL(/send-inquiry/, { timeout: 20000 }).catch(() => {});
  if (!/send-inquiry/.test(page.url())) return { navigated: false, toasts: await toasts(page), msgs: (await msgs(page)).inline, shot: await snap(page, `${tag}-booknow-blocked`) };
  return readResults(page, tag);
}
export async function legTabs(page) {
  return page.evaluate(() => [...document.querySelectorAll('a.nav-link, [role=tab], button')].filter(e => e.getBoundingClientRect().width && /^\s*(✓\s*)?Leg\s*\d/i.test(e.innerText || ''))
    .map(e => `${(e.innerText || '').trim().replace(/\s+/g, ' ')}${/active/.test(e.className) || e.getAttribute('aria-selected') === 'true' ? ' [active]' : ''}`));
}
export async function readResults(page, tag) {
  const r = await L.readResults(page, tag);
  const body = norm(L.PII(await page.locator('body').innerText()));
  r.legTabs = await legTabs(page);
  r.header = body.match(/\d+ Buses Found \| [^|]{0,60}/)?.[0] || null;
  r.labels = [...new Set(body.match(/Multi-?leg-?\s?\w+/gi) || [])];
  r.bodyTop = body.slice(0, 1800);
  return r;
}
export async function clickLegTab(page, n) {
  const t = page.locator('a.nav-link, [role=tab], button').filter({ hasText: new RegExp(`Leg\\s*${n}\\b`) }).first();
  await t.click().catch(() => t.evaluate(e => e.click())); await page.waitForTimeout(2500);
  return readResults(page, `leg${n}`).catch(() => null);
}
// Select a vehicle card on the current leg; returns the popup / toast / modal shown afterwards.
export async function selectVehicle(page, code, tag) {
  await L.cardActionAny(page, code, ['Book This Vehicle', 'Select Vehicle', 'Send Inquiry', 'Select']);
  await page.waitForTimeout(2500);
  const m = page.locator('.modal.show').first();
  const modal = (await m.count()) ? L.PII(norm(await m.innerText())).slice(0, 2500) : null;
  return { modal, isConfirm: /Confirm Your Trip|Route Summary|Estimated Trip Cost/i.test(modal || ''), toasts: await toasts(page), legTabs: await legTabs(page), shot: await snap(page, `${tag}-after-select`) };
}
export { snap, norm };
