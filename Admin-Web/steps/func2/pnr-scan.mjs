import { go, scrub, settle } from './_f.mjs';
export default async ({ page }) => {
  const ids = (process.env.IDS || '').split(',');
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  const out = {};
  for (const id of ids) {
    await s.fill(''); await s.fill(id); await settle(page, 2000);
    const rows = page.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp('^\s*' + id + '\s*$') }) });
    if ((await rows.count()) !== 1) { out[id] = 'rows ' + (await rows.count()); continue; }
    await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click();
    const v = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ });
    await v.first().waitFor({ timeout: 8000 }); await v.first().click(); await settle(page, 2000);
    const d = page.locator('[role=dialog]:visible').last();
    const txt = scrub(await (await d.count() ? d : page.locator('body')).innerText());
    const pnr = (txt.match(/Inquiry PNR\s*:?\s*([A-Z0-9]+)/i) || [])[1];
    const i = txt.indexOf('Inquiry Information');
    out[id] = { pnr, info: (i >= 0 ? txt.slice(i, i + 900) : txt.slice(0, 900)) };
    await page.keyboard.press('Escape'); await page.waitForTimeout(800);
    if (await page.locator('[role=dialog]:visible').count()) { const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); await page.waitForTimeout(600); }
  }
  return out;
};
