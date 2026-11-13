// Inspect Total Booking tabs and look for the record (PNR / QRY-932 / quote 1686) under a given tab.
import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const TAB = process.env.TAB || 'Pre';
  if (!/total-booking/.test(page.url())) { await page.goto(new URL('/dashboard/booking-management/total-booking', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 3000); }
  const cards = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.children.length <= 3 && /^(Pre-?Bookings?|Booked|Completed|Upcoming Trips?|Live Trips?|Pending Vehicle Allocations?)\b/i.test((e.innerText || '').trim()) && e.getClientRects().length).map(e => e.innerText.replace(/\s+/g, ' ').trim()).slice(0, 20));
  const tab = page.locator('main *:visible').filter({ hasText: new RegExp('^\s*' + TAB) }).last();
  await tab.click().catch(() => {}); await settle(page, 2500);
  const search = await page.locator('input:visible').evaluateAll(es => es.map(e => e.placeholder));
  const s = page.locator('input[placeholder*="Search" i]:visible').first();
  const res = {};
  for (const q of ['MWAG650153', '932', '1686']) {
    if (!(await s.count())) break;
    await s.fill(''); await s.fill(q); await settle(page, 2500);
    const t = await table(page, 6);
    res[q] = { headers: t?.headers, rows: t?.rows.map(r => r.map(scrub)) };
    if (t?.rows.length && t.rows[0].length > 1) break;
  }
  return { url: page.url().replace(/\?.*/, ''), h: await page.locator('main h2:visible, main h3:visible, main h4:visible').allInnerTexts(), cards, search, res, shot: await snap(shot, `S-${TAB}-list`, { page }) };
};
