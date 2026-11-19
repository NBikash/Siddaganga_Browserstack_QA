// READ-ONLY: Dashboard → My Inquiries list, one inquiry's details and the Edit Inquiry form. guard() blocks all
// mutating inquiry/booking/draft calls, so nothing can be saved. Output: exploration-logs/raw/ot-explore-inq.json
import fs from 'node:fs';
import { guard, scrub } from '../_local.mjs';
const norm = s => (s || '').replace(/\s+/g, ' ').trim();
export default async ({ page, shot }) => {
  const out = {};
  await guard(page);
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.getByText('Dashboard', { exact: true }).first().click();
  await page.waitForTimeout(3000);
  out.dashUrl = page.url();
  out.dashText = scrub(norm(await page.locator('body').innerText())).slice(0, 2500);
  out.dashLinks = (await page.locator('a, button, [role=tab], .nav-link').allInnerTexts()).map(norm).filter(Boolean).slice(0, 80);
  out.s1 = await shot('exec-ot/explore/01-dashboard');
  const mi = page.getByText(/My Inquir/i).first();
  if (await mi.isVisible().catch(() => false)) { await mi.click(); await page.waitForTimeout(3000); }
  out.miUrl = page.url();
  out.miText = scrub(norm(await page.locator('main, body').first().innerText())).slice(0, 4000);
  out.miButtons = (await page.locator('button, a').allInnerTexts()).map(norm).filter(Boolean).slice(0, 120);
  out.s2 = await shot('exec-ot/explore/02-my-inquiries', { fullPage: true });
  // open the first inquiry's details (view only)
  const view = page.locator('button, a').filter({ hasText: /View|Details/i }).first();
  if (await view.isVisible().catch(() => false)) {
    out.viewLabel = norm(await view.innerText()); await view.click(); await page.waitForTimeout(3000);
    out.detUrl = page.url();
    out.detText = scrub(norm(await page.locator('.modal.show, main, body').first().innerText())).slice(0, 4000);
    out.detButtons = (await page.locator('.modal.show button, main button, button').allInnerTexts()).map(norm).filter(Boolean).slice(0, 80);
    out.s3 = await shot('exec-ot/explore/03-inquiry-details', { fullPage: true });
    const edit = page.locator('button, a').filter({ hasText: /Edit/i }).first();
    if (await edit.isVisible().catch(() => false)) {
      out.editLabel = norm(await edit.innerText()); await edit.click(); await page.waitForTimeout(3000);
      out.editUrl = page.url();
      out.editText = scrub(norm(await page.locator('.modal.show, main, body').first().innerText())).slice(0, 3000);
      out.editInputs = await page.locator('input:visible, select:visible, textarea:visible').evaluateAll(els => els.map(e => ({ ph: e.placeholder, type: e.type, v: e.type === 'checkbox' ? e.checked : e.value, dis: e.disabled })));
      out.editButtons = (await page.locator('button:visible').allInnerTexts()).map(norm).filter(Boolean).slice(0, 60);
      out.s4 = await shot('exec-ot/explore/04-edit-inquiry', { fullPage: true });
    }
  }
  fs.writeFileSync('exploration-logs/raw/ot-explore-inq.json', JSON.stringify(out, null, 2));
  return out;
};
