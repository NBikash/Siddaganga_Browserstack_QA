// QT-13 unsaved-change navigation, QT-10 edit+persistence (+total recompute on save), QT-11 preview, QT-09 add journey (no add), QT-08 calendar inspect.
import { settle, scrub, fsnap, toasts, netlog, go } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const URL_ = '/dashboard/inquiry-management/update-inquiry/dfb79d89-4159-4d5e-b39b-4eb6ada31deb';
const DESC = 'QA functional test LD-353';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 500));
export default async ({ page, shot }) => {
  const o = {};
  const desc = () => page.locator('main input[placeholder="Select or type a new description"]');
  const toll = () => page.locator('input[name=localToll]');
  const total = () => page.locator('input[name=totalApproxCost]').inputValue();
  // QT-13
  await go(page, URL_);
  let dlgSeen = null; page.once('dialog', async d => { dlgSeen = d.message(); await d.dismiss(); });
  await desc().fill('unsaved change'); await page.waitForTimeout(300);
  await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {}); await settle(page, 2500);
  o.qt13 = { browserDialog: dlgSeen, urlAfterBack: page.url().replace(/\?.*/, ''), inAppWarning: await page.locator('[role=dialog]:visible').count() };
  await go(page, URL_); o.qt13.descAfterReturn = await desc().inputValue(); P('qt13', o.qt13);
  // QT-10 edit + save
  const net = netlog(page);
  await desc().fill(DESC); await page.keyboard.press('Enter').catch(() => {}); await page.waitForTimeout(400);
  await toll().click({ clickCount: 3 }); await toll().fill('100'); await toll().blur(); await page.waitForTimeout(500);
  o.qt10 = { totalBeforeSave: await total() };
  o.qt10.shotBefore = await fsnap(shot, page, 'quote', 'QT-10-edited-before-save');
  await page.locator('main button:visible:text-is("Update Quote")').click();
  o.qt10.toasts = await toasts(page, 6000); await settle(page, 2000); o.qt10.urlAfter = page.url().replace(/\?.*/, ''); o.qt10.net = [...net];
  await go(page, URL_); await page.reload(); await settle(page, 3000);
  o.qt10.afterReopen = { desc: await desc().inputValue(), toll: await toll().inputValue(), total: await total() };
  o.qt10.shotAfter = await fsnap(shot, page, 'quote', 'QT-10-after-reopen');
  P('qt10', o.qt10);
  // restore toll to 0 (keep description)
  await toll().click({ clickCount: 3 }); await toll().fill('0'); await toll().blur();
  await page.locator('main button:visible:text-is("Update Quote")').click(); await toasts(page, 6000); await settle(page, 2000);
  await go(page, URL_); o.qt10.restored = { toll: await toll().inputValue(), total: await total(), desc: await desc().inputValue() }; P('restored', o.qt10.restored);
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
