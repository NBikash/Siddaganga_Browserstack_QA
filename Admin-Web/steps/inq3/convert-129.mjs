// Approved AW-INQ-031 part 1: QRY-129 (IAJA754847, LD-346) → Send To Booking → Choose Trip(s) → Convert into Booking → Yes.
// Then: inquiry row/menu after conversion; Pre-Bookings row for the QA client (read-only).
import { go, settle, scrub, fsnap, toasts, save, load, evidence, closeMenu, table } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
import { viewQuote } from './q.mjs';
import { closeDialogs } from './_i.mjs';
export default async ({ page, shot }) => {
  const o = {};
  try {
    const v = await viewQuote(page, 'QRY-129'); o.rowBefore = v.rowText; o.viewQuote = v.dialog?.text;
    o.shotVQ = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-view-quote-before'); await closeDialogs(page);
    const { row } = await inqRow(page, 'QRY-129'); o.menuBefore = await menuOf(page, row);
    const ev = evidence(page);
    await page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: /^\s*Send To Booking\s*$/ }).click(); await settle(page, 3000);
    const dlg = page.locator('[role=dialog]:visible').last();
    o.chooseTrip = scrub(await dlg.innerText()).replace(/\s+/g, ' ');
    if (!/Choose Trip/.test(o.chooseTrip)) throw new Error('Choose Trip(s) dialog not open');
    const boxes = dlg.locator('input[type=checkbox]'); o.boxes = await boxes.evaluateAll(es => es.map(e => e.checked));
    if ((await boxes.count()) && !o.boxes.some(Boolean)) { await boxes.last().check(); await page.waitForTimeout(500); }
    o.shotChoose = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-choose-trip');
    await dlg.locator('button').filter({ hasText: /^\s*Convert into Booking\s*$/ }).click(); await page.waitForTimeout(1500);
    const conf = page.locator('[role=dialog]:visible').last();
    o.confirmText = scrub(await conf.innerText()).replace(/\s+/g, ' ');
    o.shotConfirm = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-confirm');
    const yes = conf.locator('button').filter({ hasText: /^\s*Yes\s*$/i });
    if ((await yes.count()) !== 1) throw new Error('Yes count ' + await yes.count());
    await yes.click(); o.toasts = await toasts(page, 8000); await settle(page, 3000);
    o.urlAfter = page.url().replace(/^https?:\/\/[^/]+/, '').replace(/\?.*/, ''); o.net = ev.net;
    o.shotAfter = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-after-convert');
    // inquiry after conversion
    try { const r = await inqRow(page, 'QRY-129'); o.rowAfter = r.text; o.menuAfter = await menuOf(page, r.row); o.shotMenuAfter = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-menu-after'); await closeMenu(page); }
    catch (e) { o.rowAfter = 'not listed: ' + e.message.slice(0, 80); }
    // Pre-Bookings (QA client rows only)
    await go(page, '/dashboard/booking-management/total-booking');
    const s = page.locator('input[placeholder*="Search" i]:visible').first(); await s.fill('Bikash'); await settle(page, 4000);
    o.preBookings = ((await table(page, 50))?.rows || []).filter(r => r.join(' ').includes('Bikash N')).map(r => scrub(r.join(' | ')));
    o.shotPB = await fsnap(shot, page, 'inquiry', 'CONV-QRY-129-pre-bookings');
  } finally { save('convert-129.json', o); }
  return o;
};
