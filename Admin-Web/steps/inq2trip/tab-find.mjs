import { settle, scrub, snap, rowIndex, kebab } from './_lib.mjs';
export default async ({ page, shot }) => {
  const TAB = process.env.TAB, TAG = process.env.TAG;
  await page.goto(new URL('/dashboard/fleet-vehicle-management/approved-trips', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 3500);
  await page.locator(`main button:visible:text-is("${TAB}")`).click(); await settle(page, 3500);
  let hits = [];
  for (let p = 1; p <= 6; p++) { hits = await rowIndex(page, 'TP-111'); if (hits.length) break; const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2000); }
  const out = { tab: TAB, headers: await page.locator('thead th').allInnerTexts(), hits: hits.length };
  if (hits.length !== 1) { out.rows = (await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' ')).slice(0, 8); out.shot = await snap(shot, TAG, { page }); return out; }
  out.row = scrub(await page.locator('tbody tr').nth(hits[0]).innerText()).replace(/\s+/g, ' ');
  out.shot = await snap(shot, TAG, { page });
  out.menu = (await kebab(page, hits[0])).menu; out.menuShot = await snap(shot, TAG + '-menu', { page });
  await page.locator('h1').first().click(); await page.waitForTimeout(600);
  return out;
};
