// Approved-trips page: open tab TAB, locate TP-111, list its menu (no click).
import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const TAB = process.env.TAB, TAG = process.env.TAG;
  if (!/approved-trips/.test(page.url())) { await page.goto(new URL('/dashboard/fleet-vehicle-management/approved-trips', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 3500); }
  await page.locator(`main button:visible:text-is("${TAB}")`).click(); await settle(page, 3500);
  const rows = [];
  for (let p = 1; p <= 6; p++) {
    rows.push(...(await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' ')));
    if (rows.some(r => /TP-\s*111\b/.test(r))) break;
    const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2000);
  }
  const hit = rows.filter(r => /TP-\s*111\b/.test(r));
  const out = { tab: TAB, headers: await page.locator('thead th').allInnerTexts(), hit, seen: rows.length };
  if (hit.length === 1) {
    const row = page.locator('tbody tr').filter({ hasText: /TP-\s*111\b/ });
    out.rowButtons = (await row.locator('button').allInnerTexts()).map(s => s.trim()).filter(Boolean);
    const k = row.locator('button:has(svg[data-testid=MoreVertIcon])');
    if ((await k.count()) === 1) {
      const before = new Set((await page.locator(':is(button,li,[role=menuitem]):visible').allInnerTexts()).map(x => x.trim()));
      await k.click(); await page.waitForTimeout(1200);
      out.menu = (await page.locator(':is(button,li,[role=menuitem]):visible').allInnerTexts()).map(x => x.trim()).filter(x => x && !before.has(x));
      out.menuShot = await snap(shot, TAG + '-menu', { page });
      await page.locator('h1').first().click(); await page.waitForTimeout(600);
    }
  }
  out.shot = await snap(shot, TAG, { page });
  return out;
};
