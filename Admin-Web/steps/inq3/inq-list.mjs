// Read-only: Inquiry list rows of the QA client (search = client name), all pages; plus searches given in env Q (comma list).
import { go, settle, scrub, table, save } from './_i.mjs';
export default async ({ page }) => {
  await go(page, '/dashboard/inquiry-management/total-inquiries'); await settle(page, 1500);
  const s = page.locator('input[placeholder="Search Inquiry Info"]'); const o = { headers: (await table(page, 1))?.headers, kpi: (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Inquiries.{0,160}/)?.[0] };
  o.unfiltered = (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  await s.fill('Bikash'); await settle(page, 3500);
  o.showing = (await page.locator('text=/Showing .* entries/').allInnerTexts())[0]; o.rows = [];
  for (let p = 0; p < 10; p++) {
    o.rows.push(...((await table(page, 50))?.rows || []).filter(r => r.join(' ').includes('Bikash N')).map(r => scrub(r.join(' | '))));
    const next = page.locator('button[aria-label="Go to next page"]').first();
    if (!(await next.count()) || await next.isDisabled()) break; await next.click(); await settle(page, 2000);
  }
  for (const q of (process.env.Q || '').split(',').filter(Boolean)) { await s.fill(''); await settle(page, 1200); await s.fill(q); await settle(page, 3000); o['q:' + q] = { showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], rows: ((await table(page, 10))?.rows || []).filter(r => r.join(' ').includes('Bikash N')).map(r => scrub(r.join(' | '))) }; }
  return o;
};
