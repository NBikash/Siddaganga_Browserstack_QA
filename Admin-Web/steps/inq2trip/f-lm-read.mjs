import { go, settle, scrub, fsnap, rowIndex, kebab } from './_func.mjs';
const rowsOf = async page => (await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' '));
export default async ({ page, shot }) => {
  const o = {};
  // LM-08 modal behaviour (View Lead currently open from LM-01)
  const open = async () => (await page.locator('text=Inquiry Information').count()) > 0;
  o.lm08 = { openBefore: await open() };
  await page.keyboard.press('Escape'); await page.waitForTimeout(800); o.lm08.afterEscape = await open();
  if (await open()) { const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])'); o.lm08.closeX = await x.count(); if (await x.count()) { await x.first().click(); await page.waitForTimeout(800); } o.lm08.afterX = await open(); }
  o.lm08.dialogButtons = [];
  const s = page.locator('input[placeholder="Search Lead Info"]');
  // reopen and refresh
  await s.fill('LD-353'); await settle(page, 2000);
  let h = await rowIndex(page, 'LD-353'); await kebab(page, h[0], 'View Lead'); await settle(page, 2000);
  o.lm08.dialogButtons = (await page.locator('[role=dialog]:visible button').allInnerTexts()).map(x => x.trim()).filter(Boolean);
  o.lm08.shotOpen = await fsnap(shot, page, 'lead', 'LM-08-view-lead-modal');
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page, 3000);
  o.lm08.afterRefresh = { open: await open(), search: await page.locator('input[placeholder="Search Lead Info"]').inputValue(), url: page.url().replace(/\?.*/, '') };
  // LM-03 search variants
  o.lm03 = {};
  for (const q of ['LD-353', 'LD-35', 'Bikash', 'SOQS555799', 'zzzz-no-match']) { await s.fill(''); await s.fill(q); await settle(page, 2200); const r = await rowsOf(page); o.lm03[q] = { n: r.length, first: r.slice(0, 3), showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] }; }
  o.lm03.shotNoMatch = await fsnap(shot, page, 'lead', 'LM-03-search-no-match');
  await s.fill(''); await settle(page, 2000);
  // LM-04 status dropdown
  const dd = page.locator('main [role=combobox]:visible, main .MuiSelect-select:visible').first();
  o.lm04 = { ddCount: await dd.count() };
  if (await dd.count()) {
    o.lm04.label = (await dd.innerText()).trim();
    await dd.click(); await page.waitForTimeout(800);
    o.lm04.options = (await page.locator('[role=listbox]:visible [role=option], ul[role=listbox]:visible li').allInnerTexts()).map(x => x.trim());
    o.lm04.shotOptions = await fsnap(shot, page, 'lead', 'LM-04-status-options');
    const op = page.locator('[role=listbox]:visible [role=option]').filter({ hasText: /^\s*Open\s*$/ });
    if (await op.count()) { await op.first().click(); await settle(page, 2500); const r = await rowsOf(page); o.lm04.open = { showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], statuses: [...new Set(r.map(x => x.split(' ').slice(-1)[0]))] }; }
    else await page.keyboard.press('Escape');
    await page.locator('button:visible:text-is("Reset Filter")').click(); await settle(page, 2500);
    o.lm04.afterReset = { label: (await dd.innerText()).trim(), showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] };
  }
  // LM-05 date input + rows per page
  const inputs = page.locator('main input:visible');
  o.lm05 = { inputs: await inputs.evaluateAll(es => es.map(e => ({ ph: e.placeholder, ro: e.readOnly, v: e.value }))) };
  const dateIn = inputs.nth(1);
  await dateIn.click().catch(() => {}); await page.waitForTimeout(1000);
  o.lm05.picker = (await page.locator('.react-datepicker:visible, .MuiPickersPopper-root:visible, .MuiDateCalendar-root:visible, [role=dialog]:visible').count());
  o.lm05.shotPicker = await fsnap(shot, page, 'lead', 'LM-05-date-filter');
  await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  const pp = page.locator('main [role=combobox]:visible, main .MuiSelect-select:visible').last();
  if ((await pp.innerText()).trim().match(/^\d+$/)) {
    await pp.click(); await page.waitForTimeout(700);
    o.lm05.pageSizes = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim());
    const ten = page.locator('[role=listbox]:visible [role=option]').nth(1);
    if (await ten.count()) { await ten.click(); await settle(page, 2000); o.lm05.after = { rows: (await rowsOf(page)).length, showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] }; }
  }
  o.lm05.pagerButtons = (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(x => /^\d+$/.test(x));
  // LM-06 row values
  await s.fill('LD-353'); await settle(page, 2000);
  o.lm06 = { headers: await page.locator('thead th').allInnerTexts(), row: (await rowsOf(page))[0], shot: await fsnap(shot, page, 'lead', 'LM-06-row-values') };
  return o;
};
