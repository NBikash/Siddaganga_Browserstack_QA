// LM-07 Add Lead (validation only, never saved) and LM-09 Assign (inspect + blank submit only).
import { go, settle, scrub, fsnap, rowIndex, kebab, toasts } from './_func.mjs';
export const formInfo = async root => root.locator('input:visible, textarea:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => { let p = e, l = ''; for (let i = 0; i < 6 && p && !l; i++) { p = p.parentElement; l = p?.querySelector('label')?.innerText || ''; } return { label: l.trim().slice(0, 40), n: e.name, ph: e.placeholder, t: e.type || e.getAttribute('role'), req: e.required || e.getAttribute('aria-required') === 'true', v: (e.value || '').slice(0, 25) }; }));
export const errs = async root => [...new Set((await root.locator('.Mui-error:visible, .MuiFormHelperText-root:visible, .text-red-500:visible, [class*=error]:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean))];
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/lead-management/total-lead');
  await page.locator('button:visible:text-is("+ Add Lead")').click(); await settle(page, 2000);
  let root = page.locator('[role=dialog]:visible').last(); if (!(await root.count())) root = page.locator('main');
  o.lm07 = { url: page.url().replace(/\?.*/, ''), title: (await root.locator('h1,h2,h3,h4,h5,h6').allInnerTexts()).slice(0, 3), fields: await formInfo(root), buttons: (await root.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean) };
  o.lm07.shotForm = await fsnap(shot, page, 'lead', 'LM-07-add-lead-form', { fullPage: true });
  const submit = root.locator('button:visible').filter({ hasText: /^\s*(Save|Submit|Add Lead|Create|Add|Save Lead)\s*$/i }).last();
  o.lm07.submitLabel = (await submit.count()) ? (await submit.innerText()).trim() : null;
  if (await submit.count()) {
    await submit.click(); await page.waitForTimeout(1500);
    o.lm07.blank = { errors: await errs(root), toasts: await toasts(page, 3000), url: page.url().replace(/\?.*/, '') };
    o.lm07.shotBlank = await fsnap(shot, page, 'lead', 'LM-07-add-lead-blank-submit', { fullPage: true });
    const ph = root.locator('input[name*=phone i], input[name*=mobile i], input[name*=contact i]').first();
    const em = root.locator('input[name*=email i]').first();
    if (await ph.count()) await ph.fill('12ab');
    if (await em.count()) await em.fill('not-an-email');
    if ((await ph.count()) || (await em.count())) { await submit.click(); await page.waitForTimeout(1500); o.lm07.invalid = { errors: await errs(root), toasts: await toasts(page, 3000) }; o.lm07.shotInvalid = await fsnap(shot, page, 'lead', 'LM-07-add-lead-invalid'); }
  }
  if (!/total-lead/.test(page.url())) await page.goBack();
  else { await page.keyboard.press('Escape'); const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); }
  await go(page, '/dashboard/lead-management/total-lead');
  o.lm07.topLeadAfter = (await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ').slice(0, 50);
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill('LD-353'); await settle(page, 2000);
  const h = await rowIndex(page, 'LD-353');
  await kebab(page, h[0], 'Assign'); await settle(page, 1500);
  const d = page.locator('[role=dialog]:visible').last();
  o.lm09 = { open: await d.count() };
  if (await d.count()) {
    o.lm09.text = scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 500);
    o.lm09.buttons = (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
    o.lm09.fields = await formInfo(d);
    const cb = d.locator('[role=combobox], .MuiSelect-select').first();
    if (await cb.count()) { await cb.click().catch(() => {}); await page.waitForTimeout(900); o.lm09.options = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 15); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
    o.lm09.shot = await fsnap(shot, page, 'lead', 'LM-09-assign-dialog');
    const sb = d.locator('button:visible').filter({ hasText: /^\s*(Assign|Save|Submit)\s*$/i });
    o.lm09.assignDisabledWhenEmpty = (await sb.count()) === 1 ? await sb.isDisabled() : null;
    if ((await sb.count()) === 1 && !(await sb.isDisabled())) { await sb.click(); await page.waitForTimeout(1500); o.lm09.blank = { errors: await errs(d), toasts: await toasts(page, 3000), open: await d.isVisible().catch(() => false) }; o.lm09.shotBlank = await fsnap(shot, page, 'lead', 'LM-09-assign-blank-submit'); }
  }
  await page.reload(); await settle(page, 2500); await s.fill('LD-353'); await settle(page, 2000);
  o.lm09.rowAfter = (await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ');
  return o;
};
