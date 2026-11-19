// Search Lead Info by client name, then open View Lead on each matching row and read Inquiry PNR.
import { go, scrub, settle, table } from './_f.mjs';
export default async ({ page }) => {
  const want = new Set((process.env.PNRS || '').split(','));
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill(process.env.Q); await settle(page, 2500);
  const found = {}, seen = [];
  for (let p = 0; p < 15; p++) {
    const t = await table(page, 50);
    const ids = (t?.rows || []).map(r => r.join(' ').match(/LD-\d+/)?.[0]).filter(Boolean);
    const names = (t?.rows || []).map(r => r[2]);
    for (const lid of ids) {
      const row = page.locator('tbody tr').filter({ hasText: new RegExp(lid + '(?!\d)') }).first();
      await row.locator('button:has(svg[data-testid=MoreVertIcon])').click();
      const v = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ });
      await v.first().waitFor({ timeout: 8000 }); await v.first().click(); await settle(page, 1500);
      const d = page.locator('[role=dialog]:visible').last();
      const txt = scrub(await (await d.count() ? d : page.locator('body')).innerText());
      const pnr = (txt.match(/Inquiry PNR\s*:?\s*([A-Z0-9]+)/i) || [])[1] || null;
      const inq = (txt.match(/Inquiry ID\s*:?\s*(\d+)/i) || [])[1] || null;
      seen.push(`${lid}:${pnr}`);
      if (pnr && want.has(pnr)) { const a = txt.indexOf('Status'); found[pnr] = { leadId: lid, inquiryId: inq, details: txt.slice(a, a + 1400) }; }
      await page.keyboard.press('Escape'); await page.waitForTimeout(700);
      if (await page.locator('[role=dialog]:visible').count()) { const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); await page.waitForTimeout(600); }
    }
    if (Object.keys(found).length === want.size) break;
    const next = page.locator('button[aria-label="Go to next page"]').first();
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click(); await settle(page, 2000);
  }
  return { found, missing: [...want].filter(x => !found[x]), seen };
};
