// Approved transition: Lead (env LEAD, PNR) -> Send To Inquiry -> Update Quote with pre-filled values unchanged.
// Captures the pre-filled form (before), toasts, API calls, console errors, inquiry list row after, lead menu after.
import { go, settle, scrub, fsnap, toasts, save, load, evidence, closeDialogs, closeMenu, table } from './_i.mjs';
import { formDump, waitForm } from './form.mjs';
const { LEAD, PNR } = process.env;
async function leadRow(page) {
  await go(page, '/dashboard/lead-management/total-lead'); await settle(page, 1500);
  const s = page.locator('input[placeholder="Search Lead Info"]');
  const rows = page.locator('tbody tr').filter({ hasText: new RegExp(LEAD + '(?!\d)') });
  for (let i = 0; i < 3 && (await rows.count()) !== 1; i++) { await s.fill(''); await settle(page, 1200); await s.fill(LEAD); await settle(page, 3500); }
  if ((await rows.count()) !== 1) { // fallback: QA client search + paging
    await s.fill(''); await settle(page, 1200); await s.fill('Bikash'); await settle(page, 4000);
    for (let p = 0; p < 6 && (await rows.count()) !== 1; p++) { const nx = page.locator('button[aria-label="Go to next page"]').first(); if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await settle(page, 2000); }
  }
  if ((await rows.count()) !== 1) throw new Error(`rows for ${LEAD}: ${await rows.count()}`);
  const rt = scrub(await rows.first().innerText()).replace(/\s+/g, ' ');
  if (!rt.includes('Bikash N')) throw new Error('not the QA client lead: refused');
  return { row: rows.first(), rt };
}
const keep = o => { const all = (() => { try { return load('send.json'); } catch { return {}; } })(); all[PNR] = o; save('send.json', all); };
export default async ({ page, shot }) => {
  const o = { lead: LEAD, pnr: PNR }; keep(o);
  let { row, rt } = await leadRow(page); o.rowBefore = rt;
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  o.menuBefore = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x));
  o.shotMenu = await fsnap(shot, page, 'inquiry', `S2I-${PNR}-${LEAD}-menu-before`);
  if (!o.menuBefore.includes('Send To Inquiry')) return { ...o, blocked: 'Send To Inquiry not offered' };
  await page.locator('button:visible:text-is("Send To Inquiry")').click();
  await page.waitForURL(/update-inquiry/, { timeout: 20000 }).catch(() => {}); await settle(page, 3500);
  o.url = page.url().replace(/^https?:\/\/[^/]+/, '');
  await waitForm(page); o.formBefore = await formDump(page);
  o.shotForm = await fsnap(shot, page, 'inquiry', `S2I-${PNR}-${LEAD}-update-quote-prefilled`, { fullPage: true });
  const ev = evidence(page);
  const btn = page.locator('main button:visible').filter({ hasText: /^\s*Update Quote\s*$/ });
  if ((await btn.count()) !== 1) return { ...o, blocked: 'Update Quote buttons ' + await btn.count() };
  await btn.click(); o.toasts = await toasts(page, 8000); await settle(page, 3000);
  o.net = ev.net; o.console = ev.cons; o.urlAfter = page.url().replace(/^https?:\/\/[^/]+/, '');
  o.shotAfter = await fsnap(shot, page, 'inquiry', `S2I-${PNR}-${LEAD}-after-update-quote`); keep(o);
  // inquiry list: find by the inquiry id shown on the lead
  const inq = load('data-verify.json').pnrs[PNR].inquiryId;
  await go(page, '/dashboard/inquiry-management/total-inquiries'); await settle(page, 1500);
  await page.locator('input[placeholder="Search Inquiry Info"]').fill('Bikash'); await settle(page, 3500); // ID search does not work (finding); list the QA client's rows
  o.inquiryRows = [];
  for (let p = 0; p < 6 && !o.inquiryRows.length; p++) { o.inquiryRows = ((await table(page, 50))?.rows || []).filter(r => r[1] === inq).map(r => scrub(r.join(' | '))); if (o.inquiryRows.length) break; const nx = page.locator('button[aria-label="Go to next page"]').first(); if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await settle(page, 2000); }
  o.shotList = await fsnap(shot, page, 'inquiry', `S2I-${PNR}-${inq}-inquiry-list`);
  ({ row } = await leadRow(page)); o.rowAfter = scrub(await row.innerText()).replace(/\s+/g, ' ');
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  o.menuAfter = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x)); keep(o);
  await closeMenu(page);
  return { ...o, formBefore: undefined, formKeys: Object.keys(o.formBefore.fields).length };
};
