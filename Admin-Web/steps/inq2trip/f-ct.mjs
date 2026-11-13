// Completed Trips: CT-01 row, CT-02 View Trip Summary (TP-112 and closed TP-111 read-only), CT-03..05 close-sheet validation, CT-06 close, CT-07 cost.
import fs from 'node:fs';
import path from 'node:path';
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts, netlog, FRUN } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const OUT = path.resolve('results', FRUN, 'ct.out.json'); const o = {}; const save = () => fs.writeFileSync(OUT, JSON.stringify(o, null, 2));
const U = '/dashboard/fleet-vehicle-management/approved-trips';
async function tab(page, id = 'TP-112') { await go(page, U); await page.waitForTimeout(1500); await page.locator('main button:visible:text-is("Completed Trips")').click(); await settle(page, 3000); for (let p = 1; p <= 4; p++) { const h = await rowIndex(page, id); if (h.length) return h; const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2000); } return []; }
async function closeAll(page) { for (let i = 0; i < 4 && await page.locator('[role=dialog]:visible').count(); i++) { const d = page.locator('[role=dialog]:visible').last(); const x = d.locator('button:visible:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(700); } }
export default async ({ page, shot }) => {
  let h = await tab(page);
  o.ct01 = { rows: h.length, headers: await page.locator('thead th').allInnerTexts(), row: h.length ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : null, shot: await fsnap(shot, page, 'completed', 'CT-01-completed-row') };
  if (h.length !== 1) { save(); return o; }
  o.ct01.menu = (await kebab(page, h[0])).menu; await page.keyboard.press('Escape'); await page.waitForTimeout(500); save();
  // CT-02 summary TP-112 and TP-111 (read-only)
  for (const id of ['TP-112', 'TP-111']) {
    h = await tab(page, id); if (h.length !== 1) { o['sum_' + id] = 'rows ' + h.length; continue; }
    await kebab(page, h[0], 'View Trip Summary'); await page.waitForTimeout(2500); await declineAdvance(page, id); await page.waitForTimeout(2500);
    const d = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
    o['sum_' + id] = { dialog: await d.count(), url: page.url().replace(/\?.*/, ''), text: scrub(await ((await d.count()) ? d : page.locator('main')).innerText()).replace(/\s+/g, ' ').slice(0, 1600), buttons: (await page.locator('[role=dialog]:visible button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 10) };
    o['sum_' + id].shot = await fsnap(shot, page, 'completed', 'CT-02-trip-summary-' + id, { fullPage: !(await d.count()) });
    save(); await closeAll(page); if (!/approved-trips/.test(page.url())) await page.goBack().catch(() => {});
  }
  // CT-03..05 Close Trip sheet validation
  h = await tab(page);
  await kebab(page, h[0], 'Close Trip'); await page.waitForTimeout(2500); o.closeAdv = await declineAdvance(page, 'TP-112'); await page.waitForTimeout(2500);
  const d = page.locator('[role=dialog]:visible').last();
  if (!/Close Trip Sheet/.test(await d.innerText().catch(() => ''))) { o.stop = 'close sheet not open'; save(); return o; }
  o.chk = { note: await d.locator('textarea[name=note]').inputValue().catch(() => null), safety: await d.locator('input[type=checkbox]').first().isChecked().catch(() => null) };
  await d.locator('button:visible:text-is("Next")').click(); await page.waitForTimeout(1500);
  const f = n => d.locator(`input[name=${n}]`);
  o.sheet = await d.locator('input[name]').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => e.name + '=' + e.value + (e.readOnly ? '(RO)' : '')));
  const submit = d.locator('button:visible').filter({ hasText: /Generate Trip Sheet|Close Trip|Submit/ }).last();
  o.submitLabel = (await submit.innerText()).trim();
  const net = netlog(page);
  // CT-03a: closing km below opening km
  await f('closingKm').fill('19990'); await f('totalKm').fill('10'); await f('presentDieselInput').fill('20'); await f('closingKm').blur(); await page.waitForTimeout(500);
  await submit.click(); await page.waitForTimeout(1500);
  o.ct03a = { errors: await errs(d), toasts: await toasts(page, 4000), net: [...net], open: await d.isVisible().catch(() => false) }; o.ct03a.shot = await fsnap(shot, page, 'completed', 'CT-03-closing-below-opening');
  save();
  if (!(await d.isVisible().catch(() => false))) { o.stop = 'invalid close was accepted - dialog closed'; save(); return o; }
  // CT-03b: negative diesel + total km mismatch (closing 20040, total 5)
  net.length = 0; await f('closingKm').fill('20040'); await f('totalKm').fill('5'); await f('presentDieselInput').fill('-5'); await f('presentDieselInput').blur(); await page.waitForTimeout(500);
  o.ct03b = { totalKmAuto: await f('totalKm').inputValue(), diesel: await f('presentDieselInput').inputValue() };
  await submit.click(); await page.waitForTimeout(1500);
  Object.assign(o.ct03b, { errors: await errs(d), toasts: await toasts(page, 4000), net: [...net], open: await d.isVisible().catch(() => false) }); o.ct03b.shot = await fsnap(shot, page, 'completed', 'CT-03-negative-diesel-km-mismatch');
  save();
  if (!(await d.isVisible().catch(() => false))) { o.stop = 'invalid close accepted (b)'; save(); return o; }
  // CT-05 bata recompute
  const bata = d.locator('input[name=DriverBata]'), bataDays = d.locator('input[name=DriverBataDay]');
  const totalBata = async () => (await d.innerText()).match(/Total Driver Bata Cost:\s*([\d.,]+)/)?.[1];
  o.ct05 = { before: { bata: await bata.inputValue(), days: await bataDays.inputValue(), total: await totalBata() } };
  await bataDays.fill('2'); await bataDays.blur(); await page.waitForTimeout(600); o.ct05.days2 = await totalBata();
  await bataDays.fill('1'); await bataDays.blur(); await page.waitForTimeout(600); o.ct05.restored = await totalBata();
  // CT-04 Add Expense (form + blank only)
  const ae = d.locator('button:visible:text-is("Add Expense")');
  if (await ae.count()) { await ae.click(); await page.waitForTimeout(1200); o.ct04 = { text: scrub(await d.innerText()).replace(/\s+/g, ' ').match(/Add Extra Expenses.{0,400}/)?.[0], fields: await d.locator('input:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => e.name || e.placeholder || e.getAttribute('role'))).catch(() => []) }; o.ct04.shot = await fsnap(shot, page, 'completed', 'CT-04-add-expense'); const typ = d.locator('[role=combobox]').last(); if (await typ.count()) { await typ.click(); await page.waitForTimeout(800); o.ct04.types = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()); await page.keyboard.press('Escape'); await page.waitForTimeout(400); } }
  save();
  // CT-06 valid close: remove any added expense row
  const rmExp = d.locator('button:visible').filter({ hasText: /^\s*(Remove|Delete)\s*$/ }).filter({ hasNot: page.locator('text=Document') });
  o.expenseRowsBeforeClose = (await d.innerText()).includes('No extra expenses added');
  net.length = 0;
  await f('closingKm').fill('20040'); await f('totalKm').fill('40'); await f('presentDieselInput').fill('20'); await f('presentDieselInput').blur(); await page.waitForTimeout(600);
  o.ct06 = { values: await d.locator('input[name]').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => e.name + '=' + e.value)), permit: /qa-test-permit/.test(await d.innerText()) };
  o.ct06.shotBefore = await fsnap(shot, page, 'completed', 'CT-06-close-sheet-valid');
  if (!o.expenseRowsBeforeClose) { o.stop = 'an expense row exists - not closing'; save(); return o; }
  await submit.click();
  const seen = []; for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); for (const t of await page.locator('.Toastify__toast:visible').allInnerTexts()) { const x = scrub(t).replace(/\s+/g, ' '); if (!seen.includes(x)) seen.push(x); } if (seen.some(x => /invoice|closed|success|not allowed|required/i.test(x))) break; }
  o.ct06.toasts = seen; o.ct06.net = [...net]; await settle(page, 3000); o.ct06.dialogOpen = await page.locator('[role=dialog]:visible').count();
  save();
  await closeAll(page);
  h = await tab(page);
  o.ct07 = { row: h.length ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : null };
  if (h.length) { o.ct07.menuAfterClose = (await kebab(page, h[0])).menu; await page.keyboard.press('Escape'); }
  o.ct07.shot = await fsnap(shot, page, 'completed', 'CT-07-after-close');
  save();
  return o;
};
