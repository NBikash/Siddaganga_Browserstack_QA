// Read-only: QA client's lead rows (search 'Bikash', all pages) and the row menu items of env LEADS.
import { go, settle, scrub, table, closeDialogs, closeMenu } from './_i.mjs';
export default async ({ page }) => {
  await go(page, '/dashboard/lead-management/total-lead'); await settle(page, 2000);
  const s = page.locator('input[placeholder="Search Lead Info"]'); await s.fill('Bikash'); await settle(page, 4000);
  const o = { showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], rows: {} };
  const want = (process.env.LEADS || '').split(',');
  for (let p = 0; p < 6; p++) {
    for (const r of ((await table(page, 50))?.rows || []).filter(r => (r[2] || '').trim() === 'Bikash N')) {
      if (!want.includes(r[1])) continue;
      const row = page.locator('tbody tr').filter({ hasText: new RegExp(r[1] + '(?!\d)') }).first();
      await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1200);
      o.rows[r[1]] = { row: scrub(r.join(' | ')), menu: (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x)) };
      await closeMenu(page);
    }
    const nx = page.locator('button[aria-label="Go to next page"]').first(); if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await settle(page, 2000);
  }
  o.missing = want.filter(x => !o.rows[x]);
  return o;
};
