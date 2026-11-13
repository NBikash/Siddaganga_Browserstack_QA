// Duplicate-PNR check: open View Lead on every lead of the same client created the same day, read its PNR.
import { settle, table, scrub } from './_lib.mjs';
const PNR = 'MWAG650153';
async function closeDetails(page) {
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  if (await page.locator('text=Inquiry Information').count()) {
    await page.locator('button:visible').filter({ hasText: /^\s*(Close|Back|Cancel)\s*$/ }).first().click().catch(() => {});
    await page.locator('[data-testid=CloseIcon]:visible, [aria-label=close i]:visible').first().click().catch(() => {});
    await page.waitForTimeout(800);
  }
}
export default async ({ page }) => {
  await closeDetails(page);
  const out = { stillOpen: await page.locator('text=Inquiry Information').count(), checked: [] };
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill(''); await s.fill('Bikash'); await settle(page, 2500);
  const ids = new Set();
  for (let p = 0; p < 10; p++) {
    const t = await table(page, 50);
    for (const r of t?.rows || []) if (/^LD-/.test(r[1] || '') && r[5] === '12/11/2026') ids.add(r[1]);
    const next = page.locator('button[aria-label*="next" i]:visible:not([disabled])').first();
    if (!(await next.count())) break; await next.click(); await settle(page, 1500);
  }
  out.candidates = [...ids];
  for (const id of ids) {
    await s.fill(''); await s.fill(id); await settle(page, 2000);
    const row = page.locator('tbody tr', { hasText: id }).first();
    await row.locator('td').last().locator('button').first().click(); await page.waitForTimeout(800);
    await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click(); await settle(page, 2000);
    const text = scrub(await page.locator('body').innerText());
    out.checked.push({ id, pnr: text.match(/Inquiry PNR\s*:?\s*([A-Z0-9-]+)/i)?.[1] ?? null, inquiryId: text.match(/Inquiry ID\s*:?\s*(\d+)/i)?.[1] ?? null });
    await closeDetails(page);
  }
  out.exactMatches = out.checked.filter(c => c.pnr === PNR).map(c => c.id);
  await s.fill(''); await s.fill('LD-341'); await settle(page, 2000);
  return out;
};
