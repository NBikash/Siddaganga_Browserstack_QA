// QT-03..QT-07, QT-12: interactions on Update Inquiry WITHOUT clicking Update Quote. Every changed value is restored.
import { settle, scrub, fsnap } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const W = (o, k, v) => { o[k] = v; console.error(k, JSON.stringify(v).slice(0, 300)); };
export default async ({ page, shot }) => {
  const o = {};
  const main = page.locator('main');
  const total = () => page.locator('input[name=totalApproxCost]').inputValue();
  const costRow = page.locator('main table').filter({ hasText: '8 HR/ 80 KM' }).locator('tbody tr').first();
  const cell = i => costRow.locator('td').nth(i).locator('input');
  // column map from header: 2 base,3 addl km,4 extra km rate,5 addl hrs,6 extra hr rate,7 driver allow,8 day bata days,9 night allow,10 night days,11 toll,12 extras
  const setNum = async (loc, v) => { await loc.click({ clickCount: 3 }); await loc.fill(String(v)); await loc.blur(); await page.waitForTimeout(500); };
  // QT-07 dropdown options
  const combos = main.locator('[role=combobox]:visible');
  const opts = [];
  for (let i = 0; i < Math.min(await combos.count(), 3); i++) { const c = combos.nth(i); const cur = (await c.innerText()).trim(); await c.click(); await page.waitForTimeout(700); opts.push({ cur, options: (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 20) }); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
  const desc = main.locator('input[placeholder="Select or type a new description"]');
  await desc.click(); await page.waitForTimeout(800);
  W(o, 'qt07', { combos: opts, descOptions: (await page.locator('[role=listbox]:visible [role=option], .MuiAutocomplete-popper:visible li').allInnerTexts()).map(x => x.trim()).slice(0, 15) });
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  o.qt07.shot = await fsnap(shot, page, 'quote', 'QT-07-dropdowns');
  // QT-06 GST Change (inspect only)
  await main.locator('button:visible:text-is("Change")').click(); await page.waitForTimeout(1200);
  const g = page.locator('[role=dialog]:visible').last();
  W(o, 'qt06', { dialog: (await g.count()) ? scrub(await g.innerText()).replace(/\s+/g, ' ').slice(0, 400) : null, buttons: (await g.count()) ? (await g.locator('button:visible').allInnerTexts()).map(x => x.trim()) : [], gstEnabledNow: !(await page.locator('main input').filter({ has: page.locator('xpath=.') }).first().isDisabled().catch(() => true)) });
  o.qt06.shot = await fsnap(shot, page, 'quote', 'QT-06-gst-change');
  if (await g.count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(600); if (await g.isVisible().catch(() => false)) { const x = g.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.click(); } }
  o.qt06.gstAfter = await page.locator('main input[disabled]').evaluateAll(es => es.map(e => e.value).filter(v => /%/.test(v)));
  // QT-05 Apply checkbox -> fixed cost
  const fixed = page.locator('input[name=fixedCost]');
  const apply = page.locator('main table').filter({ hasText: '8 HR/ 80 KM' }).locator('thead input[type=checkbox]');
  const a0 = { applyFound: await apply.count(), fixedDisabled: await fixed.isDisabled() };
  if (await apply.count()) { await apply.check(); await page.waitForTimeout(600); a0.fixedDisabledAfterApply = await fixed.isDisabled(); if (!a0.fixedDisabledAfterApply) { await setNum(fixed, 9999); a0.totalWithFixed = await total(); } a0.shot = await fsnap(shot, page, 'quote', 'QT-05-apply-fixed-cost'); if (!a0.fixedDisabledAfterApply) await setNum(fixed, 0); await apply.uncheck(); await page.waitForTimeout(600); a0.totalAfterRevert = await total(); a0.fixedDisabledAfterUncheck = await fixed.isDisabled(); }
  W(o, 'qt05', a0);
  // QT-04 recalculation
  const base = await total(); const r = { base };
  await setNum(cell(5), 1); r.addlHr1 = await total();
  await setNum(cell(3), 10); r.addlKm10 = await total();
  await setNum(cell(11), 100); r.toll100 = await total();
  await setNum(cell(12), 50); r.extras50 = await total();
  await setNum(cell(8), 2); r.dayBata2 = await total();
  r.shot = await fsnap(shot, page, 'quote', 'QT-04-recalculated');
  for (const [i, v] of [[5, 0], [3, 0], [11, 0], [12, 0], [8, 1]]) await setNum(cell(i), v);
  r.restored = await total();
  W(o, 'qt04', r);
  // QT-03 boundary / invalid (inline only)
  const pax = page.locator('input[name=pax]'), days = page.locator('input[name=tripDuration]');
  const b = {};
  for (const v of ['0', '-1', '1.5', '100', 'abc']) { await pax.fill(''); await pax.type(v); await pax.blur(); await page.waitForTimeout(400); b['pax_' + v] = { value: await pax.inputValue(), errors: await errs(main) }; }
  await pax.fill('1'); await pax.blur();
  for (const v of ['0', '-2', '400']) { await days.fill(''); await days.type(v); await days.blur(); await page.waitForTimeout(400); b['days_' + v] = { value: await days.inputValue(), errors: await errs(main), total: await total() }; }
  await days.fill('1'); await days.blur(); await page.waitForTimeout(400);
  await setNum(cell(2), -100); b.baseNeg = { value: await cell(2).inputValue(), total: await total(), errors: await errs(main) };
  await setNum(cell(2), 7500); b.restoredTotal = await total();
  b.shot = await fsnap(shot, page, 'quote', 'QT-03-boundary');
  W(o, 'qt03', b);
  // QT-12 read-only times
  W(o, 'qt12', await page.locator('main input[placeholder*="HH"]').evaluateAll(es => es.map(e => ({ v: e.value, dis: e.disabled, ro: e.readOnly }))));
  o.finalCheck = { pax: await pax.inputValue(), days: await days.inputValue(), total: await total() };
  return o;
};
