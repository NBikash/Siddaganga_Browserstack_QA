// Approved Vehicles: AT-01 filters, AT-02 row values, AT-03..06 / DA-03 open forms (inspect + blank validation only, no save).
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 900));
const U = '/dashboard/fleet-vehicle-management/approved-trips';
async function find(page) { for (let p = 1; p <= 4; p++) { const h = await rowIndex(page, 'TP-112'); if (h.length) return h; const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2200); } return []; }
async function closeAll(page) { for (let i = 0; i < 3 && await page.locator('[role=dialog]:visible').count(); i++) { const d = page.locator('[role=dialog]:visible').last(); const x = d.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(700); } }
async function openForm(page, shot, item, tag) {
  await go(page, U); await page.waitForTimeout(1500);
  const h = await find(page); if (h.length !== 1) return { blocked: 'rows ' + h.length };
  const k = await kebab(page, h[0], item); if (k.blocked) { await page.keyboard.press('Escape'); return k; }
  await page.waitForTimeout(2500); const adv = await declineAdvance(page, 'TP-112'); await page.waitForTimeout(2000);
  const d = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  const r = { adv, url: page.url().replace(/\?.*/, ''), dialog: await d.count() };
  const root = (await d.count()) ? d : page.locator('main');
  r.text = scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 700);
  r.buttons = (await root.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 15);
  r.fields = await root.locator('input:visible, textarea:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => (e.name || e.placeholder || e.getAttribute('role') || e.type) + '=' + (e.value || '').slice(0, 20)));
  r.shot = await fsnap(shot, page, 'approved', tag);
  return r;
}
export default async ({ page, shot }) => {
  const o = {};
  await go(page, U); await page.waitForTimeout(2000);
  o.at01 = { inputs: await page.locator('main input:visible').evaluateAll(es => es.map(e => e.placeholder)) };
  const tid = page.locator('input[placeholder="Search Trip ID"]');
  await tid.type('TP-112', { delay: 50 }); await page.waitForTimeout(3500);
  o.at01.tripSearch = (await page.locator('tbody tr').allInnerTexts()).map(r => r.replace(/\s+/g, ' ').slice(0, 40));
  await tid.fill(''); await tid.type('TP-999', { delay: 50 }); await page.waitForTimeout(3500);
  o.at01.noMatch = (await page.locator('tbody tr').allInnerTexts()).map(r => r.replace(/\s+/g, ' ').slice(0, 40));
  await tid.fill(''); await page.waitForTimeout(2500);
  const combos = page.locator('main [role=combobox]:visible');
  o.at01.dropdowns = [];
  for (let i = 0; i < Math.min(await combos.count(), 2); i++) { await combos.nth(i).click(); await page.waitForTimeout(900); o.at01.dropdowns.push((await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 12)); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
  o.at01.shot = await fsnap(shot, page, 'approved', 'AT-01-filters');
  P('at01', o.at01);
  await page.reload(); await settle(page, 3000);
  const h = await find(page);
  o.at02 = { headers: await page.locator('thead th').allInnerTexts(), row: h.length ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : null };
  o.at02.shot = await fsnap(shot, page, 'approved', 'AT-02-TP-112-row');
  if (h.length) { o.at02.menu = (await kebab(page, h[0])).menu; await page.keyboard.press('Escape'); await page.waitForTimeout(500); }
  P('at02', o.at02);
  for (const [k, item, tag] of [['at04', 'Edit Bus Details', 'AT-04-edit-bus-details'], ['da03', 'Edit Driver Details', 'DA-03-edit-driver-details'], ['at05', 'Add Extra Amenities', 'AT-05-add-extra-amenities'], ['at06', 'Refuel Request', 'AT-06-refuel-request']]) {
    o[k] = await openForm(page, shot, item, tag);
    const d = page.locator('[role=dialog]:visible').last();
    const sb = d.locator('button:visible').filter({ hasText: /^\s*(Submit|Save|Update|Add|Request|Send Request|Save Changes)\s*$/i });
    if ((await d.count()) && (await sb.count()) === 1 && (k === 'at06' || k === 'at04')) {
      o[k].submitDisabledBlank = await sb.isDisabled();
      // only blank-validate forms that start empty (refuel); for edit-bus, clear nothing - inspect only
      if (k === 'at06' && !o[k].submitDisabledBlank) { await sb.click(); await page.waitForTimeout(1500); o[k].blank = { errors: await errs(d), toasts: await toasts(page, 3000), open: await d.isVisible().catch(() => false) }; o[k].shotBlank = await fsnap(shot, page, 'approved', tag + '-blank-submit'); }
    }
    P(k, o[k]);
    await closeAll(page);
  }
  // AT-03 Edit Allocation (inspect where it leads)
  await go(page, U); await page.waitForTimeout(1500);
  const h2 = await find(page);
  if (h2.length) { const ea = page.locator('tbody tr').nth(h2[0]).locator('button:visible').filter({ hasText: /^\s*Edit Allocation\s*$/ }); if (await ea.count()) { await ea.click(); await page.waitForTimeout(2500); const adv = await declineAdvance(page, 'TP-112'); await page.waitForTimeout(2500); const d = page.locator('[role=dialog]:visible').last(); o.at03 = { adv, url: page.url().replace(/\?.*/, ''), dialog: (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 400) : null, header: (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Trip Number.{0,200}/)?.[0] }; o.at03.shot = await fsnap(shot, page, 'approved', 'AT-03-edit-allocation'); P('at03', o.at03); await closeAll(page); } }
  await go(page, U);
  return o;
};
