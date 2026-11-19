// AW-INQ-014 (read-only): option lists of the form's select boxes (MUI menus only) and the Trip Description autocomplete.
import { fsnap, save, load, closeMenu } from './_i.mjs';
import { openEdit } from './q.mjs';
export default async ({ page, shot }) => {
  await openEdit(page, 'QRY-194');
  const o = { selects: [] };
  const boxes = page.locator('main [role=combobox]:not(input)');
  const n = await boxes.count();
  for (let i = 0; i < n; i++) {
    const b = boxes.nth(i); const value = (await b.innerText()).trim();
    await b.click(); await page.waitForTimeout(900);
    const options = (await page.locator('.MuiMenu-root:visible [role=option]').allInnerTexts()).map(x => x.trim());
    if (i === 0) o.shotSelect = await fsnap(shot, page, 'quote', 'QRY-194-booking-type-options');
    o.selects.push({ value, options }); await closeMenu(page);
  }
  const td = page.locator('main input[placeholder="Select or type a new description"]');
  o.desc = await td.inputValue();
  await td.click(); await td.fill(''); await page.waitForTimeout(1500);
  o.descOptions = (await page.locator('.MuiAutocomplete-popper:visible [role=option], .MuiAutocomplete-listbox:visible li').allInnerTexts()).map(x => x.trim()).slice(0, 20);
  o.shotDesc = await fsnap(shot, page, 'quote', 'QRY-194-trip-description-options');
  await td.fill(o.desc); await page.keyboard.press('Escape');
  // leave without saving (only the field was cleared and refilled)
  save('dd.json', o); return o;
};
