// Lead Management read-only inspection on LD-346: sorting, row menu, View Lead controls, Assign dialog (no save).
import { go, settle, scrub, fsnap, table } from './_f.mjs';
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/lead-management/total-lead');
  const t0 = await table(page, 5); o.defaultOrder = t0.rows.map(r => r[1] + ' ' + r[5]);
  // LEA-026 sorting: which headers are clickable / have sort affordance
  o.headers = await page.locator('thead th').evaluateAll(ths => ths.map(th => ({ t: th.innerText.trim(), sortEl: !!th.querySelector('.MuiTableSortLabel-root, [aria-sort], svg, button'), aria: th.getAttribute('aria-sort'), cursor: getComputedStyle(th).cursor })));
  for (const h of ['LEAD ID', 'CREATED DATE', 'CLIENT NAME']) {
    const th = page.locator('thead th').filter({ hasText: h }).first();
    await th.click(); await settle(page, 1500);
    const t = await table(page, 5); o['afterClick_' + h] = t.rows.map(r => r[1] + ' ' + scrub(r[2]) + ' ' + r[5]);
  }
  o.shotSort = await fsnap(shot, page, 'lead', 'LEA-026-after-header-clicks');
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill('LD-346'); await settle(page, 2000);
  const row = page.locator('tbody tr').filter({ hasText: /LD-346(?!\d)/ });
  o.rowCount = await row.count(); o.row = scrub(await row.first().innerText());
  await row.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  o.menu = (await page.locator('button:visible').filter({ hasText: /^(View Lead|Send To Inquiry|Assign|Delete)$/ }).allInnerTexts());
  o.shotMenu = await fsnap(shot, page, 'lead', 'LD-346-row-menu');
  await page.locator('button:visible:text-is("View Lead")').click(); await settle(page, 1500);
  const d = page.locator('[role=dialog]:visible').last();
  o.viewControls = { buttons: (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean), inputs: await d.locator('input:visible,select:visible,[role=combobox]:visible').count() };
  o.shotView = await fsnap(shot, page, 'lead', 'LEA-025-view-lead-controls', { fullPage: true });
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  // Assign dialog (inspect only)
  await row.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(800);
  await page.locator('button:visible:text-is("Assign")').click(); await settle(page, 1500);
  const a = page.locator('[role=dialog]:visible').last();
  o.assign = { text: scrub(await a.innerText()).slice(0, 600), buttons: (await a.locator('button:visible').allInnerTexts()).map(x => x.trim()) };
  const cb = a.locator('[role=combobox]:visible, input:visible').first();
  if (await cb.count()) { await cb.click(); await page.waitForTimeout(1000); o.assign.options = (await page.locator('[role=listbox]:visible [role=option], ul[role=listbox] li:visible').allInnerTexts()).map(x => scrub(x)).slice(0, 30); }
  o.shotAssign = await fsnap(shot, page, 'lead', 'LEA-009-assign-dialog');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  o.dialogsLeft = await page.locator('[role=dialog]:visible').count();
  return o;
};
