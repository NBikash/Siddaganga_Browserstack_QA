// Helpers for the Inquiry Management functional run (FRUN = run id from results/CURRENT_RUN_INQ).
import "./_env.mjs";
import fs from "node:fs";
export * from '../inq2trip/_func.mjs';
import { settle, scrub } from '../inq2trip/_func.mjs';
export const RUNID = process.env.FRUN;
export const save = (name, data) => fs.writeFileSync(`results/${RUNID}/${name}`, JSON.stringify(data, null, 2));
export const load = name => JSON.parse(fs.readFileSync(`results/${RUNID}/${name}`, 'utf8'));
export const txt = async loc => scrub(await loc.innerText()).replace(/\s+/g, ' ').trim();
// every non-GET API response (method path status) + console errors, for failure evidence
export function evidence(page) {
  const net = [], cons = [];
  page.on('response', r => { const m = r.request().method(); if (m !== 'GET' && /\/api\//.test(r.url())) net.push(`${m} ${new URL(r.url()).pathname} ${r.status()}`); });
  page.on('console', m => { if (m.type() === 'error') cons.push(scrub(m.text()).slice(0, 300)); });
  return { net, cons };
}
export async function closeDialogs(page) {
  for (let i = 0; i < 3 && await page.locator('[role=dialog]:visible').count(); i++) {
    await page.keyboard.press('Escape'); await page.waitForTimeout(600);
    const x = page.locator('[role=dialog]:visible button:has(svg[data-testid=CloseIcon])');
    if (await x.count()) { await x.first().click().catch(() => {}); await page.waitForTimeout(600); }
  }
}
export { settle, scrub };
// Close an open row menu without triggering an item. The lead/inquiry menus render inline in the row as .active-trip-dropdown.
export async function closeMenu(page) {
  const open = async () => (await page.locator('.active-trip-dropdown:visible, [role=menu]:visible, .MuiMenu-root:visible').count()) + (await page.locator(':is(button,li,[role=menuitem]):visible').filter({ hasText: /^\s*(Download Proforma Invoice|Send Bus Images|Send To Inquiry|Cancel Inquiry)\s*$/ }).count());
  for (let i = 0; i < 5 && await open(); i++) {
    if (await page.locator('.MuiMenu-root:visible').count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(500); if (await page.locator('.MuiMenu-root:visible').count()) await page.locator('.MuiMenu-root:visible .MuiBackdrop-root').first().click({ position: { x: 5, y: 5 }, timeout: 3000 }).catch(() => {}); }
    else await page.locator('h1:visible').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(700);
  }
  if (await open()) throw new Error('row menu still open: stopping to avoid a mis-click');
}
// Local override of the shared go(): Preprod is slow at times, allow 60 s and one retry.
export async function go(page, route) {
  const url = new URL(route, 'https://dari-preprod.siddagangatravels.com/').href;
  for (let i = 0; i < 2; i++) {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); break; } catch (e) { if (i) throw e; }
  }
  await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(2500);
}
// Local override of fsnap: also masks the Client filter box (shows name + mobile) and every dialog input, and never
// takes a full-page shot while a dialog is open (full-page masks were misaligned on the scrolling inquiry list).
import { fsnap as fsnap0 } from '../inq2trip/_func.mjs';
export async function fsnap(shot, page, mod, slug, opts = {}) {
  const dialog = await page.locator('[role=dialog]:visible').count();
  const mask = [...(opts.mask || []), page.locator('input[placeholder="Select client by name or mobile"]'), page.locator('[role=dialog] input:not([type=checkbox]):not([type=date])')];
  return fsnap0(shot, page, mod, slug, { ...opts, fullPage: dialog ? false : opts.fullPage, mask });
}
