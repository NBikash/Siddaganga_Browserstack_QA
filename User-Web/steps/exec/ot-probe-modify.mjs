// READ-ONLY probe: what does "Modify Inquiry" on the results page open? (no submission; saves blocked by guard)
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  await L.guard(page);
  await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']], dates: ['2026-12-20', '2026-12-21'], times: ['9:00 AM', '8:00 PM'], pax: 5 });
  const res = await L.search(page, 'PROBE-modify');
  const btn = page.getByText('Modify Inquiry', { exact: false }).first();
  const info = { found: res.found, btnTag: await btn.evaluate(e => e.tagName + ' ' + e.className) };
  await btn.click(); await page.waitForTimeout(4000);
  info.url = page.url();
  info.modal = await page.locator('.modal.show').count();
  info.panes = await page.locator('.tab-pane.active').count();
  info.inputs = await page.locator('input:visible').evaluateAll(els => els.map(e => ({ ph: e.placeholder, v: e.type === 'checkbox' ? e.checked : e.value })).slice(0, 20));
  info.shot = await L.snap(page, 'PROBE-modify-after-click');
  info.text = L.norm(await (info.modal ? page.locator('.modal.show').first() : page.locator('body')).innerText()).slice(0, 800);
  return info;
};
