// Read-only: QRY-195 → + Add New Journey → Trip-2 "Add information": capture the form. Page reloaded afterwards (nothing saved).
import { settle, scrub, fsnap, save, load } from './_i.mjs';
import { openEdit } from './q.mjs';
export default async ({ page, shot }) => {
  const o = {};
  await openEdit(page, 'QRY-195');
  await page.locator('main button:visible').filter({ hasText: /^\s*\+ Add New Journey\s*$/ }).click(); await settle(page, 1500);
  const add = page.locator('main button:visible').filter({ hasText: /^\s*Add information\s*$/ });
  o.addButtons = await add.count();
  await add.last().click(); await settle(page, 2000);
  const d = page.locator('[role=dialog]:visible').last();
  o.dialog = await d.count();
  const root = (await d.count()) ? d : page.locator('main');
  o.text = scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 2500);
  o.inputs = await root.locator('input:visible, textarea:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => ({ tag: e.tagName, name: e.name || '', ph: e.placeholder || '', label: e.getAttribute('aria-label') || '', type: e.type || '', text: (e.innerText || '').slice(0, 40), value: e.value || '' })));
  o.buttons = (await root.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean);
  o.shot = await fsnap(shot, page, 'quote', 'QRY-195-journey-add-information-form', { fullPage: true });
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page, 4000);
  o.trip2AfterReload = (await page.locator('main').innerText()).includes('Trip-2');
  save('inspect-journey.json', o); return o;
};
