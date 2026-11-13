import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const TAB = process.env.TAB, Q = process.env.Q || '932', TAG = process.env.TAG;
  if (!/booking-management\/total-booking/.test(page.url())) { await page.goto(new URL('/dashboard/booking-management/total-booking', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 3000); }
  const t0 = page.locator(`button:visible:text-is("${TAB}")`);
  if (await t0.count()) await t0.first().click();
  else { const c = page.locator('main *:visible').filter({ hasText: new RegExp('^\s*' + TAB + '\s*\d*\s*$') }).last(); if (!(await c.count())) return { blocked: `tab/card "${TAB}" not found` }; await c.click(); }
  await settle(page, 2500);
  const s = page.locator('input[placeholder*="Search" i]:visible').first();
  if (await s.count()) { await s.fill(''); await s.fill(Q); await settle(page, 2500); }
  const t = await table(page, 6);
  return { url: page.url().replace(/\?.*/, ''), heading: (await page.locator('main h2:visible, main h3:visible, main h4:visible, main h5:visible').allInnerTexts()).slice(0, 6), search: await page.locator('input:visible').evaluateAll(es => es.map(e => e.placeholder)), headers: t?.headers, rows: t?.rows.map(r => r.map(scrub)), shot: await snap(shot, TAG, { page }) };
};
