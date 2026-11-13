// QT-02/QT-03 submit-level validation. One invalid value at a time; if the app saves it, restore immediately.
import { settle, fsnap, toasts, netlog, go } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const URL_ = '/dashboard/inquiry-management/update-inquiry/dfb79d89-4159-4d5e-b39b-4eb6ada31deb';
export default async ({ page, shot }) => {
  const CASES = JSON.parse(process.env.CASES); // [{id, field, value}]
  const out = [];
  for (const c of CASES) {
    await go(page, URL_); await page.waitForTimeout(1500);
    const net = netlog(page);
    const f = page.locator(`input[name=${c.field}]`);
    const before = await f.inputValue();
    await f.click({ clickCount: 3 }); await f.press('Backspace'); if (c.value !== '') await f.type(c.value); await f.blur();
    await page.locator('main button:visible:text-is("Update Quote")').click();
    const t = await toasts(page, 6000);
    await page.waitForTimeout(1500);
    const r = { ...c, before, toasts: t, errors: await errs(page.locator('main')), net: [...net], url: page.url().replace(/\?.*/, '') };
    r.shot = await fsnap(shot, page, 'quote', `${c.id}-${c.field}-${c.value === '' ? 'blank' : c.value}`);
    // persisted?
    await go(page, URL_); await page.waitForTimeout(1500);
    r.afterReload = await page.locator(`input[name=${c.field}]`).inputValue();
    if (r.afterReload !== before) { // restore
      const g = page.locator(`input[name=${c.field}]`); await g.click({ clickCount: 3 }); await g.press('Backspace'); await g.type(before); await g.blur();
      await page.locator('main button:visible:text-is("Update Quote")').click(); await toasts(page, 5000); await page.waitForTimeout(1500);
      await go(page, URL_); r.restoredTo = await page.locator(`input[name=${c.field}]`).inputValue();
    }
    out.push(r); console.error(JSON.stringify(r).slice(0, 400));
  }
  return out;
};
