// Ready For Trip: RT-01 row, RT-02 Edit Tripsheet (mileage 10 -> 11, persist), RT-03 menu, RT-04 Start Trip (dismiss X, then Confirm).
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts, netlog } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 900));
const U = '/dashboard/fleet-vehicle-management/approved-trips';
async function tab(page, t) { await go(page, U); await page.waitForTimeout(1500); await page.locator(`main button:visible:text-is("${t}")`).click(); await settle(page, 3000); return rowIndex(page, 'TP-112'); }
async function closeAll(page) { for (let i = 0; i < 3 && await page.locator('[role=dialog]:visible').count(); i++) { const d = page.locator('[role=dialog]:visible').last(); const x = d.locator('button:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(700); } }
export default async ({ page, shot }) => {
  const o = {};
  let h = await tab(page, 'Ready For Trip');
  o.rt01 = { rows: h.length, headers: await page.locator('thead th').allInnerTexts(), row: h.length ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : null, shot: await fsnap(shot, page, 'ready', 'RT-01-ready-row') };
  if (h.length !== 1) return o;
  o.rt03 = { menu: (await kebab(page, h[0])).menu }; await page.keyboard.press('Escape'); await page.waitForTimeout(500);
  P('rt01', o.rt01);
  // RT-02 Edit Tripsheet
  h = await tab(page, 'Ready For Trip');
  await kebab(page, h[0], 'Edit Tripsheet'); await page.waitForTimeout(2500);
  o.rt02 = { adv: await declineAdvance(page, 'TP-112') }; await page.waitForTimeout(2000);
  let d = page.locator('[role=dialog]:visible').last();
  o.rt02.title = (await d.innerText().catch(() => '')).split('\n')[0];
  const tsBtn = d.locator('button:visible:text-is("Trip Sheet")'); if (await tsBtn.count()) { await tsBtn.click(); await page.waitForTimeout(1200); }
  o.rt02.before = await d.locator('input[name]').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => e.name + '=' + e.value));
  o.rt02.note = await d.locator('textarea[name=note]').inputValue().catch(() => null);
  const mil = d.locator('input[name=mileage]');
  if (await mil.count()) {
    await mil.fill('11'); await mil.blur();
    const sb = d.locator('button:visible').filter({ hasText: /Generate Trip Sheet|Update|Save/ }).last();
    o.rt02.saveLabel = (await sb.innerText()).trim();
    const net = netlog(page); await sb.click(); o.rt02.toasts = await toasts(page, 7000); await settle(page, 2500); o.rt02.net = [...net];
    o.rt02.dialogAfter = await page.locator('[role=dialog]:visible').count();
    await closeAll(page);
    h = await tab(page, 'Ready For Trip'); o.rt02.stillReady = h.length;
    if (h.length) { await kebab(page, h[0], 'Edit Tripsheet'); await page.waitForTimeout(2500); await declineAdvance(page, 'TP-112'); await page.waitForTimeout(2000); d = page.locator('[role=dialog]:visible').last(); const t2 = d.locator('button:visible:text-is("Trip Sheet")'); if (await t2.count()) { await t2.click(); await page.waitForTimeout(1200); } o.rt02.afterReopen = await d.locator('input[name=mileage]').inputValue().catch(() => null); o.rt02.shot = await fsnap(shot, page, 'ready', 'RT-02-edit-tripsheet-reopened'); await closeAll(page); }
  }
  P('rt02', o.rt02);
  // RT-04 Start Trip: dismiss with X, then confirm
  h = await tab(page, 'Ready For Trip');
  await kebab(page, h[0], 'Start Trip'); await page.waitForTimeout(2500); await declineAdvance(page, 'TP-112'); await page.waitForTimeout(1500);
  d = page.locator('[role=dialog]:visible').last();
  o.rt04 = { confirm: scrub(await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200) };
  if (!/start this trip/i.test(o.rt04.confirm)) { P('rt04', o.rt04); return o; }
  await closeAll(page); o.rt04.afterDismiss = { stillReady: (await tab(page, 'Ready For Trip')).length };
  h = await tab(page, 'Ready For Trip');
  await kebab(page, h[0], 'Start Trip'); await page.waitForTimeout(2500); await declineAdvance(page, 'TP-112'); await page.waitForTimeout(1500);
  d = page.locator('[role=dialog]:visible').last();
  if (!/start this trip/i.test(await d.innerText().catch(() => ''))) { o.rt04.stop = 'confirm not shown'; return o; }
  o.rt04.shotConfirm = await fsnap(shot, page, 'ready', 'RT-04-start-trip-confirm');
  const net = netlog(page); await d.locator('button:visible:text-is("Confirm")').click();
  o.rt04.toasts = await toasts(page, 7000); await settle(page, 2500); o.rt04.net = [...net];
  P('rt04', o.rt04);
  return o;
};
