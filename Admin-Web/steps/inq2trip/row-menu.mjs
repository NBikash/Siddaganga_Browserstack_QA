// Open the action menu of the row containing ROW_ID; list items; optionally click ITEM and capture the dialog (no confirm).
import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const id = process.env.ROW_ID, item = process.env.ITEM, tag = process.env.TAG || 'row';
  const rows = page.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp('^\s*' + id + '\s*$') }) });
  const n = await rows.count();
  if (n !== 1) return { blocked: `${id} rows: ${n}` };
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  const before = new Set((await page.locator('button:visible').allInnerTexts()).map(s => s.trim()));
  await rows.first().locator('td').last().locator('button').last().click(); await page.waitForTimeout(1000);
  const menu = (await page.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(s => s && !before.has(s));
  const out = { menu, menuShot: await snap(shot, `${tag}-menu`, { page }) };
  if (!item) { await page.keyboard.press('Escape'); return out; }
  const el = page.locator('button:visible').filter({ hasText: new RegExp('^\s*' + item + '\s*$', 'i') }).first();
  if (!(await el.count())) { await page.keyboard.press('Escape'); return { ...out, blocked: `${item} not in menu` }; }
  await el.click(); await settle(page, 3000);
  const dlg = page.locator('[role=dialog]:visible').last();
  out.url = page.url().replace(/\?.*/, '');
  out.dialog = (await dlg.count()) ? scrub(await dlg.innerText()).slice(0, 2500) : null;
  out.buttons = (await page.locator((await dlg.count()) ? '[role=dialog]:visible button' : 'main button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 25);
  out.inputs = await page.locator(((await dlg.count()) ? '[role=dialog]:visible ' : 'main ') + ':is(input, textarea, select)').evaluateAll(es => es.filter(e => e.type !== 'hidden').map(e => ({ name: e.name, ph: e.placeholder, type: e.type, req: e.required, dis: e.disabled, val: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30), label: (e.closest('.MuiFormControl-root,label,div')?.innerText || '').trim().slice(0, 40) }))).catch(() => []);
  out.shot = await snap(shot, `${tag}-opened`, { page });
  return out;
};
