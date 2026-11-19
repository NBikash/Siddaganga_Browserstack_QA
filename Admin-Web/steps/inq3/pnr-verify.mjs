// Step 1 (read-only): newest-first scan of the lead list; View Lead on each row; match the User-Web PNRs; capture details + screenshot.
import { go, settle, scrub, fsnap, table, save, closeDialogs } from './_i.mjs';
const WANT = new Set(['UMNF499106','NCCC102640','BGVS613665','SIVM916255','LJWN815154','ORZS120376','YOIT928679','ZLPS490392']);
export default async ({ page, shot }) => {
  await go(page, '/dashboard/lead-management/total-lead');
  const found = {}, seen = [];
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  const total0 = await showing();
  for (let p = 0; p < 12; p++) {
    const t = await table(page, 50);
    const ids = (t?.rows || []).map(r => r.join(' ').match(/LD-\d+/)?.[0]).filter(Boolean);
    for (const lid of ids) {
      const row = page.locator('tbody tr').filter({ hasText: new RegExp(lid + '(?!\d)') }).first();
      const rowText = scrub(await row.innerText()).replace(/\s+/g, ' ');
      await row.locator('button:has(svg[data-testid=MoreVertIcon])').click();
      const v = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ });
      await v.first().waitFor({ timeout: 8000 }); await v.first().click(); await settle(page, 1500);
      const d = page.locator('[role=dialog]:visible').last();
      const text = scrub(await d.innerText()).replace(/\s+/g, ' ');
      const pnr = (text.match(/Inquiry PNR\s*:?\s*([A-Z]{4}\d{6})/i) || [])[1] || null;
      seen.push(`${lid}:${pnr}`);
      if (pnr && WANT.has(pnr)) {
        await d.evaluate(e => e.querySelector('[class*=DialogContent], .MuiDialogContent-root')?.scrollTo(0, 0)).catch(() => {});
        found[pnr] = { leadId: lid, rowText, details: text, shot: await fsnap(shot, page, 'inquiry', `PNR-${pnr}-${lid}-view-lead`, { fullPage: true }) };
      }
      await closeDialogs(page);
    }
    if (Object.keys(found).length === WANT.size) break;
    if (seen.some(s => /^LD-39[0-7]:/.test(s))) break; // older than the 16 Nov scan
    const next = page.locator('button[aria-label="Go to next page"]').first();
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click(); await settle(page, 2000);
  }
  const out = { total0, found, missing: [...WANT].filter(x => !found[x]), seen };
  save('pnr-verify.json', out);
  return { total0, found: Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v.leadId + ' | ' + v.rowText])), missing: out.missing, seen };
};
