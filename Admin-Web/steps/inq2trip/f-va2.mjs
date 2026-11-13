// VA-06 matching + Change Bus Type / Vendor List / preference (inspect), VA-07 confirm with none, VA-08 two selections (no confirm).
import { settle, scrub, fsnap, toasts, netlog } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 900));
const tileOf = (page, reg) => page.locator('main div').filter({ hasText: new RegExp('^\\s*' + reg + '\\s*$') }).filter({ has: page.locator('input[type=checkbox]') }).last();
export default async ({ page, shot }) => {
  const o = {};
  const txt = await page.locator('main').innerText();
  if (!/Trip Number\s*:\s*TP-112/.test(txt)) return { stop: 'not on TP-112 allocation page' };
  o.va06 = { tiles: await page.evaluate(() => { const out = []; for (const cb of document.querySelectorAll('main input[type=checkbox]')) { let p = cb; for (let i = 0; i < 5 && p && !/Bus Category/.test(p.innerText); i++) p = p.parentElement; out.push(p ? p.innerText.replace(/\s+/g, ' ').replace(/ Bus Model:.*/, '') : '?'); } return out; }) };
  o.va06.matching = o.va06.tiles.filter(t => /Bus Category: 16 Seater Premium Urbania$/.test(t));
  o.va06.total = o.va06.tiles.length;
  // Change Bus Type
  await page.locator('main button:visible:text-is("Change Bus Type")').click(); await page.waitForTimeout(1500);
  let d = page.locator('[role=dialog]:visible').last();
  o.va06.changeBusType = (await d.count()) ? { text: scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 400), buttons: (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean) } : 'no dialog';
  o.va06.shotChange = await fsnap(shot, page, 'allocation', 'VA-06-change-bus-type');
  if (await d.count()) { const cb = d.locator('[role=combobox]').first(); if (await cb.count()) { await cb.click(); await page.waitForTimeout(800); o.va06.busTypeOptions = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 25); await page.keyboard.press('Escape'); } await page.keyboard.press('Escape'); await page.waitForTimeout(700); if (await d.isVisible().catch(() => false)) { const x = d.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); } }
  P('va06a', o.va06.changeBusType);
  // Vendor List
  await page.locator('main button:visible:text-is("Vendor List")').click(); await page.waitForTimeout(1800);
  d = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  o.va06.vendorList = (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 400) : 'no dialog; ' + page.url();
  o.va06.shotVendor = await fsnap(shot, page, 'allocation', 'VA-06-vendor-list');
  if (await d.count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(700); if (await d.isVisible().catch(() => false)) { const x = d.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); } }
  P('va06b', o.va06.vendorList);
  // preference dropdown
  const pref = page.locator('main [role=combobox]:visible').filter({ hasText: /All Vehicles/ }).first();
  if (await pref.count()) { await pref.click(); await page.waitForTimeout(800); o.va06.preferenceOptions = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()); await page.keyboard.press('Escape'); await page.waitForTimeout(400); }
  P('va06c', { pref: o.va06.preferenceOptions, matching: o.va06.matching, total: o.va06.total });
  // VA-07 confirm with none selected
  const net = netlog(page);
  const checked0 = await page.locator('main input[type=checkbox]:checked').count();
  o.va07 = { checkedBefore: checked0 };
  if (checked0 === 0) { const cbtn = page.locator('main button:visible:text-is("Confirm Allocation")'); o.va07.disabled = await cbtn.isDisabled(); if (!o.va07.disabled) { await cbtn.click(); o.va07.toasts = await toasts(page, 5000); await page.waitForTimeout(1500); o.va07.errors = await errs(page.locator('main')); o.va07.net = [...net]; o.va07.status = (await page.locator('main').innerText()).match(/Bus Assigned Status for this Trip\s*:\s*([^\n]*)/)?.[1]; } o.va07.shot = await fsnap(shot, page, 'allocation', 'VA-07-confirm-none-selected'); }
  P('va07', o.va07);
  // VA-08 tick two matching vehicles (no confirm), then untick both
  const [a, b] = o.va06.matching.map(t => t.split(' Bus Category')[0]);
  o.va08 = { a, b };
  if (a && b) {
    const ta = tileOf(page, a).locator('input[type=checkbox]'), tb = tileOf(page, b).locator('input[type=checkbox]');
    await ta.check(); await page.waitForTimeout(700); await tb.check().catch(e => { o.va08.secondError = String(e).slice(0, 120); }); await page.waitForTimeout(900);
    o.va08.checked = await page.locator('main input[type=checkbox]:checked').count();
    o.va08.toasts = await toasts(page, 2500);
    o.va08.text = (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/(selected|Selected|required|Required)[^.]{0,80}/g)?.slice(0, 5);
    o.va08.shot = await fsnap(shot, page, 'allocation', 'VA-08-two-vehicles-ticked');
    for (const t of [tb, ta]) if (await t.isChecked().catch(() => false)) await t.uncheck();
    await page.waitForTimeout(500); o.va08.checkedAfter = await page.locator('main input[type=checkbox]:checked').count();
  }
  P('va08', o.va08);
  return o;
};
