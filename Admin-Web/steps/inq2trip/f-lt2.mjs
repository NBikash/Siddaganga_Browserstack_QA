// Live Trips: LT-01 row, LT-02..05 open each form (blank-validate only, never submit valid data), LT-06 Complete Trip.
import fs from 'node:fs';
import path from 'node:path';
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts, netlog, FRUN } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const OUT = path.resolve('results', FRUN, 'lt.part2.json');
const o = {}; const save = () => fs.writeFileSync(OUT, JSON.stringify(o, null, 2));
const U = '/dashboard/fleet-vehicle-management/approved-trips';
async function tab(page) { await go(page, U); await page.waitForTimeout(1500); await page.locator('main button:visible:text-is("Live Trips")').click(); await settle(page, 3000); return rowIndex(page, 'TP-112'); }
async function closeAll(page) { for (let i = 0; i < 4 && await page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').count(); i++) { const d = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last(); const x = d.locator('button:visible:has(svg[data-testid=CloseIcon])'); if (await x.count()) await x.first().click(); else await page.keyboard.press('Escape'); await page.waitForTimeout(700); } }
const BLANK_OK = /Emergency Alerts|Breakdown Protocol|Notify Service Manager|Send Notification|Refuel Request/;
export default async ({ page, shot }) => {
  let h = await tab(page);
  o.lt01 = { rows: h.length, headers: await page.locator('thead th').allInnerTexts(), row: h.length ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : null, shot: await fsnap(shot, page, 'live', 'LT-01-live-row') };
  if (h.length !== 1) { save(); return o; }
  o.menu = (await kebab(page, h[0])).menu; await page.keyboard.press('Escape'); await page.waitForTimeout(500); save();
  const items = ['Breakdown Protocol', 'Notify Service Manager', 'Send Notification'];
  for (const it of items) {
    if (!o.menu.includes(it)) { o[it] = 'not in menu'; continue; }
    h = await tab(page); if (h.length !== 1) { o[it] = 'row missing'; continue; }
    await kebab(page, h[0], it); await page.waitForTimeout(2500);
    const r = { adv: await declineAdvance(page, 'TP-112') }; await page.waitForTimeout(2500);
    const d = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
    r.url = page.url().replace(/\?.*/, ''); r.dialog = await d.count();
    const root = (await d.count()) ? d : page.locator('main');
    r.text = scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 600);
    r.buttons = (await root.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 12);
    r.fields = await root.locator('input:visible, textarea:visible').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => ({ n: e.name || e.placeholder || e.type, v: (e.value || '').slice(0, 25), ro: e.readOnly || e.disabled })));
    const slug = it.replace(/\s+/g, '-').toLowerCase();
    r.shot = await fsnap(shot, page, 'live', 'LT-' + slug);
    if (BLANK_OK.test(it) && (await d.count())) {
      const sb = d.locator('button:visible').filter({ hasText: /^\s*(Submit|Send|Send Request|Send Alert|Notify|Save|Raise Alert|Add Alert|Add Request|Report|Send Notification)\s*$/i });
      if ((await sb.count()) === 1) { r.submitLabel = (await sb.innerText()).trim(); r.submitDisabled = await sb.isDisabled(); if (!r.submitDisabled) { const net = netlog(page); await sb.click(); await page.waitForTimeout(1500); r.blank = { errors: await errs(d), toasts: await toasts(page, 3000), net: [...net], open: await d.isVisible().catch(() => false) }; r.shotBlank = await fsnap(shot, page, 'live', 'LT-' + slug + '-blank'); } }
    }
    o[it] = r; save();
    await closeAll(page);
    if (!/approved-trips/.test(page.url())) await page.goBack().catch(() => {});
  }
  // LT-06 Complete Trip
  h = await tab(page);
  await kebab(page, h[0], 'Complete Trip'); await page.waitForTimeout(2500); await declineAdvance(page, 'TP-112'); await page.waitForTimeout(1500);
  const c = page.locator('[role=dialog]:visible').last();
  o.lt06 = { confirm: scrub(await c.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200) };
  if (/complete this trip/i.test(o.lt06.confirm)) { o.lt06.shotConfirm = await fsnap(shot, page, 'live', 'LT-06-complete-confirm'); const net = netlog(page); await c.locator('button:visible:text-is("Confirm")').click(); o.lt06.toasts = await toasts(page, 7000); await settle(page, 2500); o.lt06.net = [...net]; }
  save();
  return o;
};
