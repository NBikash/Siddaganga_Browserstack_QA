import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const d = page.locator('[role=dialog]:visible').last();
  if (!/Initiate Vehicle Dispatch/.test(await d.innerText()) || (await d.locator('input[name=tripId]').inputValue()) !== 'TP-111') return { stop: 'not TP-111 dispatch form' };
  const cb = d.locator('label, div').filter({ hasText: /^\s*Safety equipment confirmation\s*$/ }).locator('input[type=checkbox]').first();
  const box = (await cb.count()) ? cb : d.locator('input[type=checkbox]').first();
  await box.check(); await d.locator('textarea[name=note]').fill('QA automation test dispatch (TC-01 / PNR MWAG650153)');
  const s1 = await snap(shot, 'S17-tab1-filled', { page });
  await d.locator('button:text-is("Next")').click(); await settle(page, 2500);
  const d2 = page.locator('[role=dialog]:visible').last();
  const fields = await d2.locator('input:visible, textarea:visible, select:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => {
    let p = e, lab = ''; for (let i = 0; i < 6 && p && !lab; i++) { p = p.parentElement; lab = p?.querySelector('label')?.innerText || ''; }
    return { label: lab.trim().slice(0, 60), n: e.name, ph: e.placeholder, t: e.type || e.getAttribute('role'), req: e.required || e.getAttribute('aria-required') === 'true', v: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30), dis: e.disabled || e.readOnly };
  }));
  const toasts = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()).map(scrub);
  return { checked: await box.isChecked().catch(() => null), s1, toasts, text: scrub(await d2.innerText()).replace(/\s+/g, ' ').slice(0, 3000), buttons: (await d2.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean), fields, shot: await snap(shot, 'S17-tab2', { page }) };
};
