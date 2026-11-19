// READ-ONLY: My Inquiries row actions (icons), inquiry details view and Edit Inquiry form for an EXISTING inquiry.
// guard() blocks every mutating inquiry/booking/draft call; no Save/Submit button is clicked.
import fs from 'node:fs';
import { guard, scrub } from '../_local.mjs';
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
export async function openMyInquiries(page) {
  await page.goto(new URL('/dashboard', process.env.USER_WEB_URL).href, { waitUntil: 'domcontentloaded' });
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.getByText('My Inquiries', { exact: true }).first().click();
  await page.locator('text=/Inquiry ID/').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500);
}
export default async ({ page, shot }) => {
  const ID = process.env.INQ || 'DDEV675048';
  const out = { id: ID };
  await guard(page);
  await openMyInquiries(page);
  const row = page.locator('.rdt_TableRow, [role=row], tr').filter({ hasText: ID }).first();
  out.rowText = norm(await row.innerText());
  out.actions = await row.locator('.rdt_TableCell, [role=cell], [role=gridcell], td').last().locator('button, a, svg, i, [role=button], span').evaluateAll(els => els.map(e => ({ tag: e.tagName, cls: String(e.className?.baseVal ?? e.className).slice(0, 80), title: e.getAttribute('title') || e.getAttribute('aria-label') || e.getAttribute('data-tooltip') || '', text: (e.innerText || '').trim().slice(0, 30) })));
  out.idCell = await row.locator('.rdt_TableCell, [role=cell], [role=gridcell], td').nth(1).evaluate(e => ({ html: e.innerHTML.slice(0, 300) }));
  out.s1 = await shot('exec-ot/explore/05-row-actions');
  // try clicking the inquiry ID first (common pattern), else the first action control
  const idLink = row.locator('.rdt_TableCell, [role=cell], [role=gridcell], td').nth(1).locator('a, button, span').first();
  await (await idLink.count() ? idLink : row.locator('.rdt_TableCell, [role=cell], [role=gridcell], td').last().locator('button, a, [role=button], svg').first()).click().catch(e => out.clickErr = String(e).slice(0, 120));
  await page.waitForTimeout(3000);
  out.detUrl = page.url();
  const scope = (await page.locator('.modal.show').count()) ? page.locator('.modal.show').first() : page.locator('body');
  out.detText = scrub(norm(await scope.innerText())).slice(0, 5000);
  out.detButtons = (await scope.locator('button:visible, a:visible').allInnerTexts()).map(norm).filter(Boolean).slice(0, 60);
  out.s2 = await shot('exec-ot/explore/06-details', { fullPage: true });
  const edit = scope.locator('button:visible, a:visible').filter({ hasText: /Edit/i }).first();
  if (await edit.count()) {
    out.editLabel = norm(await edit.innerText()); await edit.click(); await page.waitForTimeout(3000);
    out.editUrl = page.url();
    const es = (await page.locator('.modal.show').count()) ? page.locator('.modal.show').last() : page.locator('body');
    out.editText = scrub(norm(await es.innerText())).slice(0, 3000);
    out.editInputs = await es.locator('input:visible, select:visible, textarea:visible').evaluateAll(els => els.map(e => ({ ph: e.placeholder, name: e.name, type: e.type, v: e.type === 'checkbox' ? e.checked : e.value, dis: e.disabled, ro: e.readOnly })));
    out.editButtons = (await es.locator('button:visible').allInnerTexts()).map(norm).filter(Boolean).slice(0, 60);
    out.s3 = await shot('exec-ot/explore/07-edit-form', { fullPage: true });
  }
  fs.writeFileSync('exploration-logs/raw/ot-explore-inq2.json', JSON.stringify(out, null, 2));
  return out;
};
