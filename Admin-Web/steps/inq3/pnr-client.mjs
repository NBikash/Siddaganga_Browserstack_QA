// Step 1 (read-only, QA client only): Search Lead Info = QA client; View Lead only on rows whose client is the QA client.
import { go, settle, scrub, fsnap, table, save, load, closeDialogs } from './_i.mjs';
const CLIENT = 'Bikash N';
const WANT = ['UMNF499106','NCCC102640','BGVS613665','SIVM916255','LJWN815154','ORZS120376','YOIT928679','ZLPS490392'];
export default async ({ page, shot }) => {
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]'); await settle(page, 1500); await s.fill('Bikash'); await settle(page, 3500);
  for (let i = 0; i < 10 && !/of 2d entries|of 1d entries/.test((await page.locator('text=/Showing .* entries/').allInnerTexts())[0] || ''); i++) await page.waitForTimeout(800);
  const showing = (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  const leads = {}, other = { rowsSkipped: 0 };
  for (let p = 0; p < 20; p++) {
    const t = await table(page, 50);
    for (const r of t?.rows || []) {
      const lid = r.join(' ').match(/LD-\d+/)?.[0]; if (!lid) continue;
      if ((r[2] || '').trim() !== CLIENT) { other.rowsSkipped++; continue; }   // never open another client's lead
      const row = page.locator('tbody tr').filter({ hasText: new RegExp(lid + '(?!\d)') }).first();
      await row.locator('button:has(svg[data-testid=MoreVertIcon])').click();
      const v = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ });
      await v.first().waitFor({ timeout: 8000 }); await v.first().click(); await settle(page, 1500);
      const d = page.locator('[role=dialog]:visible').last();
      for (let i = 0; i < 20 && !/Inquiry PNR\s*[A-Z]{4}\d{6}|Inquiry Information\s*(No|-)/.test(await d.innerText().catch(() => '')); i++) await page.waitForTimeout(500);
      const text = scrub(await d.innerText()).replace(/\s+/g, ' ');
      const pnr = (text.match(/Inquiry PNR\s*:?\s*([A-Z]{4}\d{6})/i) || [])[1] || null;
      leads[lid] = { head: pnr ? undefined : text.slice(0, 600), pnr, inquiryId: (text.match(/Inquiry ID\s*(QRY-\d+)/) || [])[1] || null, status: (text.match(/Inquiry Information.*?Status (.+?) Client Type/) || [])[1] || null, created: r[5] };
      if (WANT.includes(pnr)) { leads[lid].details = text; leads[lid].shot = await fsnap(shot, page, 'inquiry', `PNR-${pnr}-${lid}-view-lead`, { fullPage: true }); }
      await closeDialogs(page);
    }
    const next = page.locator('button[aria-label="Go to next page"]').first();
    if (!(await next.count()) || await next.isDisabled()) break;
    await next.click(); await settle(page, 2000);
  }
  const byPnr = Object.fromEntries(Object.entries(leads).filter(([, v]) => v.pnr).map(([k, v]) => [v.pnr, k]));
  const out = { search: 'Bikash', showing, leads, missing: WANT.filter(p => !byPnr[p]), other };
  save('pnr-client.json', out);
  return { showing, missing: out.missing, other, leads: Object.fromEntries(Object.entries(leads).map(([k, v]) => [k, `${v.pnr} ${v.inquiryId} ${v.status} ${v.created}`])) };
};
