// Walk the Lead Management list page by page; open View Lead on each row and read Inquiry PNR.
import { go, scrub, settle } from './_f.mjs';
export default async ({ page }) => {
  const want = new Set((process.env.PNRS || '').split(','));
  const maxPages = Number(process.env.MAXP || 10);
  await go(page, '/dashboard/lead-management/total-lead');
  const found = {}, seen = [];
  for (let p = 0; p < maxPages && Object.keys(found).length < want.size; p++) {
    const n = await page.locator('tbody tr').count();
    for (let i = 0; i < n; i++) {
      const row = page.locator('tbody tr').nth(i);
      const lid = ((await row.innerText()).match(/LD-\d+/) || [])[0];
      await row.locator('button:has(svg[data-testid=MoreVertIcon])').click();
      const v = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ });
      await v.first().waitFor({ timeout: 8000 }); await v.first().click(); await settle(page, 1500);
      const d = page.locator('[role=dialog]:visible').last();
      const txt = scrub(await (await d.count() ? d : page.locator('body')).innerText());
      const pnr = (txt.match(/Inquiry PNR\s*:?\s*([A-Z0-9]+)/i) || [])[1] || null;
      const inq = (txt.match(/Inquiry ID\s*:?\s*(\d+)/i) || [])[1] || null;
      seen.push(`${lid}:${pnr}`);
      if (pnr && want.has(pnr)) {
        const g = k => (txt.match(new RegExp(k + '\s*:?\s*([^\n]+?)\s+(?=[A-Z][a-z]+ ?[A-Z(]|$)')) || [])[1];
        const i0 = txt.indexOf('Journey Details');
        found[pnr] = { leadId: lid, inquiryId: inq, summary: txt.slice(txt.indexOf('Status'), txt.indexOf('Status') + 260), journey: txt.slice(i0, i0 + 900) };
      }
      await page.keyboard.press('Escape'); await page.waitForTimeout(700);
      if (await page.locator('[role=dialog]:visible').count()) { const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); await page.waitForTimeout(600); }
    }
    const next = page.locator('button[aria-label="Go to next page"], button[aria-label*="next" i]').first();
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click(); await settle(page, 2000);
  }
  return { found, missing: [...want].filter(x => !found[x]), seen };
};
