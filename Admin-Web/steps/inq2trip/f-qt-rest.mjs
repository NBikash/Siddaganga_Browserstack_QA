import { settle, scrub, fsnap, toasts, go } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const URL_ = '/dashboard/inquiry-management/update-inquiry/dfb79d89-4159-4d5e-b39b-4eb6ada31deb';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 700));
export default async ({ page, shot }) => {
  const o = {};
  await go(page, URL_);
  // QT-11 preview
  await page.locator('main button:visible:text-is("Preview Quote Summary")').click(); await settle(page, 2500);
  const pv = page.locator('[role=dialog]:visible').last();
  o.qt11 = { open: await pv.count(), url: page.url().replace(/\?.*/, '') };
  if (await pv.count()) { o.qt11.text = scrub(await pv.innerText()).replace(/\s+/g, ' ').slice(0, 1500); o.qt11.buttons = (await pv.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean); }
  o.qt11.shot = await fsnap(shot, page, 'quote', 'QT-11-preview-quote-summary', { fullPage: !(await pv.count()) });
  P('qt11', o.qt11);
  if (await pv.count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(600); if (await pv.isVisible().catch(() => false)) { const x = pv.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); } }
  if (!/update-inquiry/.test(page.url())) await go(page, URL_);
  // QT-09 add new journey (validation only)
  const jBefore = await page.locator('main').getByText(/^Journey \d+$|^Local\s+\d{2}\/\d{2}\/\d{4}$/).count();
  await page.locator('main button:visible:text-is("+ Add New Journey")').click(); await settle(page, 1500);
  const jd = page.locator('[role=dialog]:visible').last();
  o.qt09 = { dialog: await jd.count() };
  const root = (await jd.count()) ? jd : page.locator('main');
  o.qt09.text = scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 900);
  o.qt09.buttons = (await root.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 20);
  o.qt09.shot = await fsnap(shot, page, 'quote', 'QT-09-add-new-journey', { fullPage: true });
  const save = root.locator('button:visible').filter({ hasText: /^\s*(Save|Add|Add Journey|Save Journey|Submit)\s*$/i });
  if ((await jd.count()) && (await save.count()) === 1) { o.qt09.saveDisabled = await save.isDisabled(); if (!o.qt09.saveDisabled) { await save.click(); await page.waitForTimeout(1500); o.qt09.blank = { errors: await errs(jd), toasts: await toasts(page, 2500) }; o.qt09.shotBlank = await fsnap(shot, page, 'quote', 'QT-09-add-journey-blank'); } }
  P('qt09', o.qt09);
  await go(page, URL_); await page.reload(); await settle(page, 3000);
  o.qt09.journeysAfterReload = await page.locator('main').getByText(/^Local\s*$/).count();
  // QT-08 calendar (inspect only)
  o.qt08 = { buttons: (await page.locator('main button:visible').allInnerTexts()).filter(x => /Month|Reset Selection|Save Assignment/.test(x)), heading: (await page.locator('main').innerText()).match(/Date\/Day Wise Category Assignment[^\n]*\n[^\n]*/)?.[0] };
  const cal = page.locator('main [role=listbox]').first();
  await cal.scrollIntoViewIfNeeded().catch(() => {});
  o.qt08.shot = await fsnap(shot, page, 'quote', 'QT-08-calendar-assignment');
  P('qt08', o.qt08);
  return o;
};
