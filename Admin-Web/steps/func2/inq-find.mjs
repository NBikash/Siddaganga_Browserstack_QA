// Find inquiries in Inquiry Management by ID (env IDS=QRY-937,...): row text and row menu items (menu closed without clicking).
import { go, settle, scrub, table } from './_f.mjs';
export default async ({ page }) => {
  const out = {};
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  const s = page.locator('input[placeholder*="Search" i]:visible').first();
  out.searchPh = await s.getAttribute('placeholder');
  out.headers = (await table(page, 1))?.headers;
  for (const id of process.env.IDS.split(',')) {
    await s.fill(''); await s.fill(id); await settle(page, 2500);
    const rows = page.locator('tbody tr').filter({ hasText: id });
    const n = await rows.count();
    const r = { n, rows: [] };
    for (let i = 0; i < n; i++) r.rows.push(scrub(await rows.nth(i).innerText()));
    if (n === 1) {
      await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
      r.menu = (await page.locator('[role=menu]:visible button, [role=menu]:visible li, .MuiPopover-paper:visible button, .MuiPopover-paper:visible li').allInnerTexts()).map(x => x.trim()).filter(Boolean);
      await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    }
    out[id] = r;
  }
  return out;
};
