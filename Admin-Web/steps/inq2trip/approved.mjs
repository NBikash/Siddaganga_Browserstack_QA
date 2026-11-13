import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const card = page.locator('main *:visible').filter({ hasText: /^\s*Approved & Track Live Trips\s*\d*\s*$/ }).last();
  await card.click(); await settle(page, 3500);
  const tabs = (await page.locator('main button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 12);
  const headers = await page.locator('thead th').allInnerTexts();
  const rows = [];
  for (let p = 1; p <= 5; p++) {
    rows.push(...(await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' ')));
    if (rows.some(r => /\bTP-111\b/.test(r))) break;
    const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2000);
  }
  const hit = rows.filter(r => /\bTP-111\b/.test(r));
  const out = { url: page.url().replace(/\?.*/, ''), tabs, headers, hit, rowsSeen: rows.length };
  if (hit.length === 1) {
    const row = page.locator('tbody tr').filter({ hasText: /\bTP-111\b/ }).first();
    out.rowButtons = await row.locator('button').evaluateAll(bs => bs.map(b => b.innerText.trim() || b.querySelector('svg')?.dataset.testid));
    const before = new Set((await page.locator('button:visible').allInnerTexts()).map(x => x.trim()));
    const k = row.locator('button:has(svg[data-testid=MoreVertIcon])');
    if (await k.count() === 1) { await k.click(); await page.waitForTimeout(1200); out.menu = (await page.locator('button:visible, li:visible').allInnerTexts()).map(x => x.trim()).filter(x => x && !before.has(x)).slice(0, 20); out.menuShot = await snap(shot, 'S16-approved-menu', { page }); await page.locator('h1').first().click(); await page.waitForTimeout(600); }
  }
  out.shot = await snap(shot, 'S16-approved-list', { page });
  return out;
};
