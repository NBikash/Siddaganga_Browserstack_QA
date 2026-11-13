// Vehicle Allocation Portal read checks + open allocation page for TP-112 (no confirm here).
import { go, settle, scrub, fsnap, rowIndex, declineAdvance } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 900));
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/fleet-vehicle-management/vehicle-allocation'); await page.waitForTimeout(2000);
  o.cards = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 130);
  // tabs
  o.tabs = {};
  for (const t of ['Available Vehicles', 'Pending Allocation Confirmations', 'Trip Approvals & Vehicle Assignment']) {
    await page.locator(`main button:visible:text-is("${t}")`).click(); await settle(page, 3000);
    o.tabs[t] = { headers: (await page.locator('thead th').allInnerTexts()).slice(0, 10), showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] || null, text: (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(130, 420) };
    o.tabs[t].shot = await fsnap(shot, page, 'allocation', 'VA-01-tab-' + t.split(' ')[0]);
  }
  P('tabs', o.tabs);
  // find TP-112 (pages)
  let h = [];
  for (let p = 1; p <= 4; p++) { h = await rowIndex(page, 'TP-112'); if (h.length) break; const nb = page.locator(`button:visible:text-is("${p + 1}")`).last(); if (!(await nb.count())) break; await nb.click(); await settle(page, 2500); }
  o.va03 = { rows: h.length };
  if (h.length !== 1) return o;
  const row = page.locator('tbody tr').nth(h[0]);
  o.va03.row = scrub(await row.innerText()).replace(/\s+/g, ' ');
  o.va03.ctl = await row.locator('button').evaluateAll(bs => bs.map(b => ({ t: b.innerText.trim(), dis: b.disabled })));
  o.va03.shot = await fsnap(shot, page, 'allocation', 'VA-03-TP-112-row');
  P('va03', o.va03);
  // VA-04 allocation type dialog
  await row.locator('button:text-is("Allocate")').click(); await page.waitForTimeout(2500);
  o.va04 = { advance: await declineAdvance(page, 'TP-112') }; await page.waitForTimeout(2000);
  const d = page.locator('[role=dialog]:visible').last();
  o.va04.text = (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ') : null;
  o.va04.radios = (await d.count()) ? await d.locator('input[type=radio]').evaluateAll(es => es.map(e => ({ checked: e.checked, label: (e.closest('label')?.innerText || '').trim() }))) : [];
  o.va04.shot = await fsnap(shot, page, 'allocation', 'VA-04-allocation-type');
  P('va04', o.va04);
  if (!/Select the type of allocation/.test(o.va04.text || '')) return o;
  await d.locator('button:visible:text-is("Continue")').click(); await settle(page, 4000);
  // VA-05 allocation page
  const txt = await page.locator('main').innerText();
  o.va05 = { trip: txt.match(/Trip Number\s*:\s*(\S+)/)?.[1], required: txt.match(/Bus Required for this day\s*:\s*([^\n]+)/)?.[1], age: txt.match(/Vehicle Age Preference\s*:\s*([^\n]+)/)?.[1], status: txt.match(/Bus Assigned Status for this Trip\s*:\s*([^\n]*)/)?.[1], buttons: (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 12) };
  // vehicle tiles: reg no + category
  o.va05.tiles = await page.evaluate(() => {
    const out = []; for (const cb of document.querySelectorAll('main input[type=checkbox]')) { let p = cb; for (let i = 0; i < 5 && p && !/Bus Category/.test(p.innerText); i++) p = p.parentElement; if (p) out.push(p.innerText.replace(/\s+/g, ' ').slice(0, 90)); } return out;
  });
  o.va05.matching = o.va05.tiles.filter(t => /16 Seater Premium Urbania/.test(t));
  o.va05.shot = await fsnap(shot, page, 'allocation', 'VA-05-allocation-page', { fullPage: true });
  P('va05', { ...o.va05, tiles: o.va05.tiles.length });
  return o;
};
