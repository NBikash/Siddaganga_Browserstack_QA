// Read-only after-state for env INQ / LEAD (and TAG): QA list row + menu, status filter options, KPI, lead View Lead + menu.
import { go, settle, scrub, fsnap, save, load, closeDialogs, closeMenu, table } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
const { INQ, LEAD, TAG } = process.env;
export default async ({ page, shot }) => {
  const o = {};
  try { const r = await inqRow(page, INQ); o.row = r.text; o.menu = await menuOf(page, r.row); await closeMenu(page); }
  catch (e) { o.row = 'not listed: ' + e.message.slice(0, 80); }
  o.qaIds = (await page.locator('tbody tr').allInnerTexts()).map(x => scrub(x).replace(/\s+/g, ' ')).filter(x => x.includes('Bikash N')).map(x => x.split(' ').slice(1, 2)[0] + ' ' + (x.match(/(Revised quotation|New quotation|Cancelled|Pending|Confirm\w*|Booked)/) || [''])[0]);
  o.shotList = await fsnap(shot, page, 'inquiry', `${TAG}-qa-list-after`);
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  o.kpi = (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Inquiries \d+ Conversion Rate \S+ Pending Approvals \S+ Total Quote Value \S+/)?.[0];
  o.unfiltered = (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  const box = page.locator('main [role=combobox]').filter({ hasText: /Status/ }); await box.click(); await page.waitForTimeout(800);
  o.statusOptions = (await page.locator('.MuiMenu-root:visible [role=option]').allInnerTexts()).map(x => x.trim()); await closeMenu(page);
  // lead
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]'); const rows = page.locator('tbody tr').filter({ hasText: new RegExp(LEAD + '(?!\\d)') });
  for (let i = 0; i < 4 && (await rows.count()) !== 1; i++) { await s.fill(''); await settle(page, 1000); await s.fill(LEAD); await settle(page, 3500); }
  if ((await rows.count()) === 1) {
    o.leadRow = scrub(await rows.first().innerText()).replace(/\s+/g, ' ');
    if (!o.leadRow.includes('Bikash N')) throw new Error('not QA lead');
    await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
    o.leadMenu = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x));
    await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click(); await settle(page, 1500);
    const d = page.locator('[role=dialog]:visible').last();
    for (let i = 0; i < 20 && !/Inquiry (PNR\s*[A-Z]{4}\d{6}|Information\s*(No|-))/.test(await d.innerText().catch(() => '')); i++) await page.waitForTimeout(500);
    const t = scrub(await d.innerText()).replace(/\s+/g, ' ');
    o.lead = { pnr: t.match(/Inquiry PNR\s*([A-Z]{4}\d{6})/)?.[1] || null, inquiryId: t.match(/Inquiry ID\s*(QRY-\d+)/)?.[1] || null, status: t.match(/Inquiry Information.*?Status (.+?) Client Type/)?.[1] || null };
    o.leadShot = await fsnap(shot, page, 'inquiry', `${TAG}-lead-${LEAD}-after`, { fullPage: true }); await closeDialogs(page);
  } else o.leadRow = 'lead rows ' + await rows.count();
  const all = (() => { try { return load('after-state.json'); } catch { return {}; } })(); all[TAG] = o; save('after-state.json', all); return o;
};
