// Read-only inspection of QRY-195 (NCCC102640): category calendar and the + Add New Journey form. Nothing is saved; page is reloaded.
import { settle, scrub, fsnap, save } from './_i.mjs';
import { openEdit, costs, formDump } from './q.mjs';
export default async ({ page, shot }) => {
  const o = {};
  const e = await openEdit(page, 'QRY-195'); o.url = e.url;
  const f = await formDump(page); o.text = f.text; o.costs = await costs(page);
  o.shotForm = await fsnap(shot, page, 'quote', 'QRY-195-form-before', { fullPage: true });
  const sec = page.locator('main').getByText('Date/Day Wise Category Assignment').locator('xpath=ancestor::div[2]');
  o.calendar = scrub(await sec.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 900);
  o.calButtons = (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(x => /Month|Selection|Assignment|Journey|Reset/.test(x));
  o.highlight = await page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.childElementCount === 0 && /^\d{1,2}$/.test(e.textContent.trim()) && getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)' && getComputedStyle(e).backgroundColor !== 'transparent').map(e => e.textContent.trim() + ':' + getComputedStyle(e).backgroundColor).slice(0, 20));
  // + Add New Journey (inspect only)
  await page.locator('main button:visible').filter({ hasText: /^\s*\+ Add New Journey\s*$/ }).click(); await settle(page, 2000);
  const d = page.locator('[role=dialog]:visible').last();
  o.journey = { dialog: await d.count() };
  o.journey.text = scrub(await ((await d.count()) ? d : page.locator('main')).innerText()).replace(/\s+/g, ' ');
  o.journey.text = o.journey.text.slice(Math.max(0, o.journey.text.indexOf('Add New Journey') - 50), o.journey.text.indexOf('Add New Journey') + 1500);
  o.journey.fields = await ((await d.count()) ? d : page.locator('main')).locator('input:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => e.name || e.placeholder || e.getAttribute('aria-label') || e.innerText || e.type).slice(-25));
  o.journey.buttons = (await ((await d.count()) ? d : page.locator('main')).locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(-25);
  o.journey.shot = await fsnap(shot, page, 'quote', 'QRY-195-add-new-journey-opened', { fullPage: true });
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page, 4000);
  o.afterReload = (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Trip-\d|Journey [A-Z]/g);
  save('inspect-195.json', o); return o;
};
