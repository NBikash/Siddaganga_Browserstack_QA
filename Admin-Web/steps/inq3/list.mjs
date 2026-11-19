// AW-INQ-001 / 026 / 036 (read-only). Only the QA client's rows are recorded; other results are kept as counts.
import { go, settle, scrub, table, fsnap, save, closeMenu } from './_i.mjs';
const QA = 'Bikash N';
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export default async ({ page, shot }) => {
  const o = {};
  try { return await run(page, shot, o); } finally { save('list.json', o); }
};
async function run(page, shot, o) {
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  const qaRows = async () => ((await table(page, 50))?.rows || []).filter(r => r[2] === QA).map(r => `${r[1]} | ${r[4]} | ${r[7]} | ${r[9]}`);
  const counts = async () => { const r = (await table(page, 50))?.rows || []; return { rows: r.filter(x => x[1]).length, qa: r.filter(x => x[2] === QA).length }; };
  const s = () => page.locator('input[placeholder="Search Inquiry Info"]');
  const setS = async q => { await s().fill(''); await settle(page, 1200); if (q) { await s().fill(q); await settle(page, 3500); } };
  const reset = async () => { await page.locator('button:visible').filter({ hasText: /^\s*Reset Filter/ }).first().click(); await settle(page, 3000); };
  const opts = () => page.locator('[role=listbox]:visible [role=option], .MuiMenu-list:visible li');
  await go(page, '/dashboard/inquiry-management/total-inquiries'); await settle(page, 2500);
  o.base = { showing: await showing(), kpi: (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Inquiries \d+ Conversion Rate \S+ Pending Approvals \S+ Total Quote Value \S+/)?.[0], headers: (await table(page, 1))?.headers, ...(await counts()) };
  o.base.shot = await fsnap(shot, page, 'inquiry', 'INQ-001-list-default');
  // --- 001 search
  o.search = {};
  for (const q of ['QRY-194', '194', 'Bikash', 'Bikash N', 'zzzz-no-match']) { await setS(q); o.search[q] = { showing: await showing(), ...(await counts()), qaRows: await qaRows() }; }
  await setS('QRY-194'); o.search.shotId = await fsnap(shot, page, 'inquiry', 'INQ-001-search-QRY-194');
  await setS('zzzz-no-match'); o.search.emptyState = scrub((await page.locator('tbody').innerText()).replace(/\s+/g, ' ')).slice(0, 80);
  o.search.shotEmpty = await fsnap(shot, page, 'inquiry', 'INQ-001-search-no-match');
  // pagination on the QA client search
  await setS('Bikash'); o.page = { p1: await qaRows(), showing1: await showing() };
  const nx = page.locator('button[aria-label="Go to next page"]').first();
  if (await nx.count() && !(await nx.isDisabled())) { await nx.click(); await settle(page, 2500); o.page.p2 = await qaRows(); o.page.showing2 = await showing(); o.page.shot = await fsnap(shot, page, 'inquiry', 'INQ-001-pagination-page2'); }
  // start date filter: 24/11/2026 (QRY-194)
  await setS('');
  const sd = page.locator('input[placeholder="Select Start Date"]'); await sd.click(); await page.waitForTimeout(1000);
  o.date = { picker: await page.locator('.react-datepicker:visible').count(), month: (await page.locator('.react-datepicker__current-month:visible').allInnerTexts())[0] };
  const d24 = page.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').filter({ hasText: /^24$/ });
  if (await d24.count()) {
    await d24.first().click(); await settle(page, 3000); const r = (await table(page, 50))?.rows || [];
    o.date.result = { showing: await showing(), dates: [...new Set(r.map(x => x[7]).filter(Boolean))], qaRows: await qaRows(), others: r.filter(x => x[1] && x[2] !== QA).length };
    o.date.shot = await fsnap(shot, page, 'inquiry', 'INQ-001-start-date-24-11');
  }
  await page.keyboard.press('Escape');
  await reset(); o.reset1 = { showing: await showing(), dateValue: await sd.inputValue(), search: await s().inputValue() };
  // client type filter
  await page.locator('main').getByText('Client Type', { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(1000);
  o.clientType = { options: (await opts().allInnerTexts()).map(x => x.trim()) };
  const nat = opts().filter({ hasText: /^\s*National\s*$/ });
  if (await nat.count()) { await nat.first().click(); await settle(page, 3000); const r = (await table(page, 50))?.rows || []; o.clientType.national = { showing: await showing(), types: [...new Set(r.map(x => x[3]).filter(Boolean))] }; }
  await closeMenu(page).catch(() => {}); await reset();
  // client filter (QA client)
  const cl = page.locator('input[placeholder="Select client by name or mobile"]');
  await cl.click(); await cl.fill('Bikash'); await page.waitForTimeout(2500);
  o.client = { options: await opts().count() };
  const qaOpt = opts().filter({ hasText: /Bikash N/ });
  if ((await qaOpt.count()) >= 1) {
    await qaOpt.first().click(); await settle(page, 3500); const r = (await table(page, 50))?.rows || [];
    o.client.result = { showing: await showing(), allQa: r.filter(x => x[1]).every(x => x[2] === QA), qaRows: await qaRows() };
    o.client.shot = await fsnap(shot, page, 'inquiry', 'INQ-001-client-filter');
  }
  await reset(); o.reset2 = { showing: await showing(), client: await cl.inputValue() };
  // --- 026 status filter
  const st = page.locator('main [role=combobox]').filter({ hasText: /^s*Select Statuss*$/ }).first();
  await st.click().catch(() => {}); await page.waitForTimeout(1000);
  o.status = { options: (await opts().allInnerTexts()).map(x => x.trim()).filter(x => x && !/^Select /.test(x)) };
  o.status.shotOptions = await fsnap(shot, page, 'inquiry', 'INQ-026-status-options');
  await closeMenu(page).catch(() => {});
  for (const lab of o.status.options) {
    // re-open only via the filter's own combobox (the placeholder after Reset); never click text that also exists in table rows
    await reset();
    const box = page.locator('main [role=combobox]').filter({ hasText: /^\s*Select Status\s*$/ });
    if ((await box.count()) !== 1) { o.status[lab] = 'status combobox not found'; continue; }
    await box.click(); await page.waitForTimeout(900);
    const op = opts().filter({ hasText: new RegExp('^\\s*' + esc(lab) + '\\s*$') });
    if (!(await op.count())) { await closeMenu(page).catch(() => {}); o.status[lab] = 'option not reachable'; continue; }
    await op.first().click(); await settle(page, 3500); const r = (await table(page, 50))?.rows || [];
    o.status[lab] = { showing: await showing(), statuses: [...new Set(r.map(x => x[9]).filter(Boolean))], qa: r.filter(x => x[2] === QA).length };
    if (/revised/i.test(lab)) o.status.shot = await fsnap(shot, page, 'inquiry', 'INQ-026-status-revised');
  }
  await reset(); o.reset3 = await showing();
  // --- 036 sorting (QA client search)
  await setS('Bikash');
  o.sort = { default: (await qaRows()).map(x => x.split(' | ')[0]) };
  for (const h of ['INQUIRY ID', 'INQUIRY START DATE', 'CLIENT NAME']) {
    const th = page.locator('thead th').filter({ hasText: new RegExp('^\\s*' + h + '\\s*$') }).first();
    o.sort[h] = { sortControl: await th.locator('.MuiTableSortLabel-root, svg, button').count(), cursor: await th.evaluate(e => getComputedStyle(e).cursor) };
    await th.click(); await settle(page, 2000); o.sort[h].after = (await qaRows()).map(x => x.split(' | ')[0]);
  }
  o.sort.shot = await fsnap(shot, page, 'inquiry', 'INQ-036-after-header-clicks');
  return o;
}
