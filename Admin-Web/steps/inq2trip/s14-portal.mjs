import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  await page.goto(new URL('/dashboard/fleet-vehicle-management/vehicle-allocation', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 4000);
  const found = [];
  for (let p = 1; p <= 4; p++) {
    const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' '));
    const i = rows.findIndex(r => /\bTP-111\b/.test(r));
    if (i >= 0) {
      const ctl = await page.locator('tbody tr').nth(i).locator('button').evaluateAll(bs => bs.map(b => ({ t: b.innerText.trim(), dis: b.disabled })));
      return { page: p, row: rows[i], ctl, shot: await snap(shot, 'S14-allocate-driver-available', { page }) };
    }
    found.push(...rows);
    const nb = page.locator(`button:visible:text-is("${p + 1}")`).last();
    if (!(await nb.count())) break; await nb.click(); await settle(page, 2500);
  }
  return { notFound: true, rows: found, shot: await snap(shot, 'S14-not-found', { page }) };
};
