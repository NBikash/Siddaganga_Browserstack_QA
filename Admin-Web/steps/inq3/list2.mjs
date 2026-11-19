// AW-INQ-026 (Status filter) and AW-INQ-036 (sorting), read-only; merged into list.json.
import { go, settle, table, fsnap, save, load, closeMenu } from './_i.mjs';
const QA = 'Bikash N';
export default async ({ page, shot }) => {
  const o = load('list.json');
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  const qaRows = async () => ((await table(page, 50))?.rows || []).filter(r => r[2] === QA).map(r => `${r[1]} | ${r[4]} | ${r[7]} | ${r[9]}`);
  const reset = async () => { await page.locator('button:visible').filter({ hasText: /^\s*Reset Filter/ }).first().click(); await settle(page, 3000); };
  const box = () => page.locator('main [role=combobox]').filter({ hasText: /Status/ });
  const opts = () => page.locator('.MuiMenu-root:visible [role=option], [role=listbox]:visible [role=option]');
  try {
    await go(page, '/dashboard/inquiry-management/total-inquiries'); await settle(page, 2500);
    o.status = { comboboxes: await page.locator('main [role=combobox]').allInnerTexts() };
    if ((await box().count()) !== 1) throw new Error('status combobox count ' + await box().count());
    await box().click(); await page.waitForTimeout(1000);
    o.status.options = (await opts().allInnerTexts()).map(x => x.trim()).filter(x => x && !/^Select /.test(x));
    o.status.shotOptions = await fsnap(shot, page, 'inquiry', 'INQ-026-status-options');
    await closeMenu(page);
    for (const lab of o.status.options) {
      await reset(); await box().click(); await page.waitForTimeout(900);
      const op = opts().filter({ hasText: new RegExp('^\\s*' + lab + '\\s*$') });
      if ((await op.count()) !== 1) { o.status[lab] = 'option count ' + await op.count(); await closeMenu(page); continue; }
      await op.click(); await settle(page, 3500);
      const r = (await table(page, 50))?.rows || [];
      o.status[lab] = { showing: await showing(), statusesOnPage1: [...new Set(r.map(x => x[9]).filter(Boolean))], noData: r.some(x => /No data/.test(x.join(' '))), qaRowsPage1: await qaRows() };
      o.status[lab].shot = await fsnap(shot, page, 'inquiry', `INQ-026-status-${lab.replace(/\W+/g, '-')}`);
    }
    await reset(); o.status.afterReset = await showing();
    // 036 sorting on the QA client search
    const s = page.locator('input[placeholder="Search Inquiry Info"]'); await s.fill('Bikash'); await settle(page, 3500);
    o.sort = { default: (await qaRows()).map(x => x.split(' | ').slice(0, 3).join(' ')) };
    for (const h of ['INQUIRY ID', 'INQUIRY START DATE', 'CLIENT NAME']) {
      const th = page.locator('thead th').filter({ hasText: new RegExp('^\\s*' + h + '\\s*$', 'i') }).first();
      o.sort[h] = { sortLabel: await th.locator('.MuiTableSortLabel-root').count(), icons: await th.locator('svg').count(), cursor: await th.evaluate(e => getComputedStyle(e).cursor) };
      await th.click(); await settle(page, 2000); o.sort[h].afterClick = (await qaRows()).map(x => x.split(' | ')[0]);
    }
    o.sort.shot = await fsnap(shot, page, 'inquiry', 'INQ-036-after-header-clicks');
  } finally { save('list.json', o); }
  return { status: o.status, sort: o.sort };
};
