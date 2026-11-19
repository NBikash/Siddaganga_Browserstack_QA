// Shared quote helpers: open Edit / View Quote for a QA inquiry, read dialogs, read the cost table.
import { settle, scrub, closeMenu, closeDialogs } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
import { waitForm, formDump } from './form.mjs';
export { waitForm, formDump };
export async function menuClick(page, inq, item) {
  const { row, text } = await inqRow(page, inq);
  const menu = await menuOf(page, row);
  const it = page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: new RegExp('^\\s*' + item + '\\s*$') });
  if ((await it.count()) !== 1) { await closeMenu(page); throw new Error(`${item} count ${await it.count()} in ${menu.join('/')}`); }
  await it.click(); return { rowText: text, menu };
}
export async function openEdit(page, inq) {
  const r = await menuClick(page, inq, 'Edit');
  await page.waitForURL(/update-inquiry/, { timeout: 30000 }); await waitForm(page);
  r.url = page.url().replace(/^https?:\/\/[^/]+/, '').replace(/\?.*/, ''); return r;
}
export async function dialogText(page) {
  const d = page.locator('[role=dialog]:visible').last();
  for (let i = 0; i < 20 && !(await d.count()); i++) await page.waitForTimeout(500);
  if (!(await d.count())) return null;
  await page.waitForTimeout(1500);
  return { text: scrub(await d.innerText()).replace(/\s+/g, ' '), buttons: (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean) };
}
export async function viewQuote(page, inq) {
  const { row, text } = await inqRow(page, inq);
  const b = row.locator('button:visible').filter({ hasText: /^\s*View Quote\s*$/ });
  if ((await b.count()) !== 1) throw new Error('View Quote button count ' + await b.count());
  await b.click(); await settle(page, 2000); return { rowText: text, dialog: await dialogText(page) };
}
// numeric quote fields by input name
export const COST = ['totalKms', 'minimumPerDay', 'perKm', 'extraKms', 'driver', 'dayBataDays', 'noOfDays', 'toll', 'totalStateTax', 'extra', 'fixedCost', 'totalApproxCost'];
export async function costs(page) {
  return page.evaluate(names => Object.fromEntries(names.map(n => { const e = document.querySelector(`main input[name="${n}"]`); return [n, e ? e.value : null]; })), COST);
}
export async function setNum(page, name, v) {
  const e = page.locator(`main input[name="${name}"]`).first();
  await e.click({ clickCount: 3 }); await e.fill(String(v)); await e.blur(); await page.waitForTimeout(700);
}
export { closeDialogs };
