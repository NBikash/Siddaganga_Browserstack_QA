// Read-only: (a) View Lead text of leads without a PNR; (b) Search Lead Info for missing lead numbers; (c) Inquiry Management search by PNR.
import { go, settle, scrub, table, save, closeDialogs } from './_i.mjs';
export default async ({ page }) => {
  const o = { nullLeads: {}, search: {}, inq: {} };
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  for (const lid of ['LD-438','LD-437','LD-435','LD-432','LD-429','LD-414']) {
    await s.fill(''); await s.fill(lid); await settle(page, 2000);
    const rows = page.locator('tbody tr').filter({ hasText: new RegExp(lid + '(?!\d)') });
    if ((await rows.count()) !== 1) { o.nullLeads[lid] = 'rows ' + await rows.count(); continue; }
    const rt = scrub(await rows.first().innerText()).replace(/\s+/g, ' ');
    await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click();
    await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click(); await settle(page, 1500);
    o.nullLeads[lid] = { rt, d: scrub(await page.locator('[role=dialog]:visible').last().innerText()).replace(/\s+/g, ' ').slice(0, 700) };
    await closeDialogs(page);
  }
  for (const q of ['LD-403','LD-405','LD-410','LD-411','LD-412','LD-413']) {
    await s.fill(''); await s.fill(q); await settle(page, 2000);
    o.search[q] = (await table(page, 5))?.rows?.map(r => scrub(r.join(' | '))) || [];
  }
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  const si = page.locator('input[placeholder*="Search" i]:visible').first();
  o.inqPh = await si.getAttribute('placeholder');
  o.inqShowing = (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  for (const q of ['UMNF499106','BGVS613665','YOIT928679','QRY-937']) {
    await si.fill(''); await si.fill(q); await settle(page, 2200);
    o.inq[q] = { showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], rows: ((await table(page, 5))?.rows || []).map(r => scrub(r.join(' | '))) };
  }
  save('pnr-probe.json', o);
  return o;
};
