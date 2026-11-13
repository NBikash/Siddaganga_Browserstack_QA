// PB-06 Confirm Booking (form values vs quote, then confirm), PB-07 KPI cards, BK-01..03 Booked / Completed tabs.
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts, netlog } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 700));
export default async ({ page, shot }) => {
  const o = {};
  const cards = async () => (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Bookings.{0,90}/)?.[0];
  const s = page.locator('input[placeholder*="Search Booking" i]').first();
  o.cardsBefore = 'Total Bookings 10 Live Trips 5 Upcoming Trips 14 Pending Vehicle Allocations 6 (read in PB-03)';
  if (!/confirm-booking/.test(page.url())) {
    await go(page, '/dashboard/booking-management/total-booking'); await page.waitForTimeout(1500);
    await s.type('B-944', { delay: 50 }); await page.waitForTimeout(4000);
    const h = await rowIndex(page, 'B-944'); if (h.length !== 1) return { o, blocked: 'B-944 rows ' + h.length };
    await kebab(page, h[0], 'Confirm Booking'); await page.waitForTimeout(2500);
  }
  o.advanceDeclined = await declineAdvance(page, 'B-944');
  await page.waitForURL(/confirm-booking/, { timeout: 15000 }).catch(() => {});
  await page.waitForFunction(() => document.querySelector('input[name=pax]')?.value, null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(1500);
  o.url = page.url().replace(/\?.*/, '');
  if (!/confirm-booking/.test(o.url)) { o.shot = await fsnap(shot, page, 'prebooking', 'PB-06-not-opened'); return o; }
  const row = page.locator('main table').filter({ hasText: '8 HR/ 80 KM' }).locator('tbody tr').first(); await row.waitFor({ timeout: 15000 });
  o.form = { desc: await page.locator('main input[placeholder="Select or type a new description"]').inputValue(), pax: await page.locator('input[name=pax]').inputValue(), days: await page.locator('input[name=tripDuration]').inputValue(), times: await page.locator('main input[placeholder*="HH"]').evaluateAll(es => es.map(e => e.value)), vehicle: (await row.locator('td').first().innerText()).trim(), base: await row.locator('td').nth(2).locator('input').inputValue(), total: await page.locator('input[name=totalApproxCost]').inputValue(), gst: await page.locator('main input[disabled]').evaluateAll(es => es.map(e => e.value).filter(v => /%/.test(v))) };
  o.shotForm = await fsnap(shot, page, 'prebooking', 'PB-06-confirm-booking-form');
  P('form', o.form);
  const net = netlog(page);
  const btn = page.locator('main button:visible:text-is("Confirm Booking")');
  if ((await btn.count()) !== 1) return { o, stop: 'Confirm Booking btn ' + await btn.count() };
  await page.evaluate(() => window.scrollTo(0, 0)); await btn.click();
  o.toasts = await toasts(page, 8000); await settle(page, 3000); o.net = [...net]; o.afterUrl = page.url().replace(/\?.*/, '');
  P('confirm', { toasts: o.toasts, net: o.net });
  await go(page, '/dashboard/booking-management/total-booking'); await page.waitForTimeout(1500);
  o.cardsAfter = await cards();
  await s.type('B-944', { delay: 50 }); await page.waitForTimeout(4000);
  o.stillInPre = (await rowIndex(page, 'B-944')).length;
  // Booked tab
  await page.locator('main button:visible:text-is("Booked")').click(); await settle(page, 3000);
  o.bk = { search: await page.locator('main input:visible').evaluateAll(es => es.map(e => e.placeholder)) };
  let bh = []; for (let p = 1; p <= 4; p++) { bh = await rowIndex(page, 'B-944'); if (bh.length) break; const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2000); }
  o.bk.rows = bh.length;
  if (bh.length === 1) { o.bk.row = scrub(await page.locator('tbody tr').nth(bh[0]).innerText()).replace(/\s+/g, ' '); o.bk.menu = (await kebab(page, bh[0])).menu; await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  o.bk.shot = await fsnap(shot, page, 'booked', 'BK-01-booked-B-944');
  P('bk', o.bk);
  // Completed tab (read-only: closed B-932 from run 20261112)
  await page.locator('main button:visible:text-is("Completed")').click(); await settle(page, 3000);
  o.completed = { headers: await page.locator('thead th').allInnerTexts(), showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], hasB932: (await rowIndex(page, 'B-932')).length, first: scrub((await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ')) };
  o.completed.shot = await fsnap(shot, page, 'booked', 'BK-03-completed-tab');
  P('completed', o.completed);
  return o;
};
