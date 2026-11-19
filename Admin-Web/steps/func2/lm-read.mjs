// LEA-003 search, LEA-004 status filter + reset, LEA-005 date filter / pagination (read-only).
import { go, settle, scrub, fsnap } from './_f.mjs';
const rowsOf = async page => (await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' '));
const showing = async page => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] || null;
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  o.lea003 = {};
  for (const q of ['LD-346', 'LD-34', 'Bikash', 'IAJA754847', 'zzzz-no-match']) {
    await s.fill(''); await s.fill(q); await settle(page, 2500);
    const r = await rowsOf(page);
    o.lea003[q] = { n: r.length, first: r.slice(0, 2), showing: await showing(page), noData: (await page.locator('text=/No data available/i').count()) > 0 };
    if (q === 'zzzz-no-match') o.lea003.shot = await fsnap(shot, page, 'lead', 'LEA-003-search-no-match');
    if (q === 'LD-346') o.lea003.shotId = await fsnap(shot, page, 'lead', 'LEA-003-search-lead-id');
  }
  await s.fill(''); await settle(page, 2500);
  o.lea004 = { before: await showing(page) };
  const dd = page.locator('main [role=combobox]:visible, main .MuiSelect-select:visible').first();
  if (await dd.count()) {
    o.lea004.label = (await dd.innerText()).trim();
    await dd.click(); await page.waitForTimeout(800);
    o.lea004.options = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim());
    o.lea004.shotOptions = await fsnap(shot, page, 'lead', 'LEA-004-status-options');
    await page.locator('[role=listbox]:visible [role=option]').filter({ hasText: /^\s*Open\s*$/ }).first().click(); await settle(page, 2500);
    const r = await rowsOf(page);
    o.lea004.open = { showing: await showing(page), statuses: [...new Set(r.map(x => x.split(' ').slice(-1)[0]))] };
    o.lea004.shotOpen = await fsnap(shot, page, 'lead', 'LEA-004-filter-open');
    const reset = page.locator('button:visible').filter({ hasText: /Reset/i }).first();
    o.lea004.resetBtn = await reset.count();
    if (await reset.count()) { await reset.click(); await settle(page, 2500); o.lea004.afterReset = { label: (await dd.innerText()).trim(), showing: await showing(page) }; }
  }
  o.lea005 = { dateInputs: await page.locator('main input[type=date]:visible, main input[placeholder*="date" i]:visible, main input[placeholder*="DD" i]:visible, main button[aria-label*="date" i]:visible').count() };
  const rpp = page.locator('.MuiTablePagination-select:visible, .MuiTablePagination-root [role=combobox]:visible').first();
  o.lea005.rppCount = await rpp.count();
  if (await rpp.count()) {
    o.lea005.rppBefore = (await rpp.innerText()).trim();
    await rpp.click(); await page.waitForTimeout(800);
    o.lea005.rppOptions = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim());
    await page.locator('[role=listbox]:visible [role=option]').filter({ hasText: /^\s*10\s*$/ }).first().click(); await settle(page, 2000);
    o.lea005.rows10 = (await rowsOf(page)).length; o.lea005.showing10 = await showing(page);
  } else {
    o.lea005.paginationText = (await page.locator('main').innerText()).split('\n').filter(l => /page|rows|showing|of \d+/i.test(l)).slice(0, 6);
  }
  const next = page.locator('button[aria-label="Go to next page"]:visible').first();
  if (await next.count()) { await next.click(); await settle(page, 2000); o.lea005.page2 = { showing: await showing(page), first: (await rowsOf(page))[0] }; }
  o.lea005.shot = await fsnap(shot, page, 'lead', 'LEA-005-pagination');
  return o;
};
