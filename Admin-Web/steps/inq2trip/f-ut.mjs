// Upcoming Trips: UT-02 filters, UT-03 Edit Booking (after advance decline), UT-04 Vehicle Allocation item, UT-05 trip approval (No, then Yes).
import { go, settle, scrub, fsnap, kebab, declineAdvance, toasts, netlog } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 700));
const U = '/dashboard/booking-management/upcoming-trips';
async function findRow(page) {
  const rows = page.locator('tbody tr'); const n = await rows.count(); const hits = [];
  for (let i = 0; i < n; i++) { const t = await rows.nth(i).innerText(); if (/Bikash N/.test(t) && /20 Nov, 2026/.test(t)) hits.push(i); }
  return hits;
}
async function openItem(page, item) {
  await go(page, U); await page.waitForTimeout(1500);
  const h = await findRow(page); if (h.length !== 1) return { blocked: 'rows ' + h.length };
  const k = await kebab(page, h[0], item); await page.waitForTimeout(2500);
  const d = page.locator('[role=dialog]:visible').last();
  const txt = (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ') : '';
  return { menu: k.menu, prompt: txt.slice(0, 250), identity: /B-944/.test(txt) };
}
export default async ({ page, shot }) => {
  const o = {};
  await go(page, U); await page.waitForTimeout(1500);
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  o.ut02 = { base: await showing(), inputs: await page.locator('main input:visible').evaluateAll(es => es.map(e => e.placeholder)) };
  const cl = page.locator('main [role=combobox]:visible, input[placeholder="Select Client Name"]').first();
  await cl.click(); await page.waitForTimeout(1200);
  const opts = page.locator('[role=listbox]:visible [role=option]');
  o.ut02.clientOptions = (await opts.allInnerTexts()).map(x => x.trim()).slice(0, 10);
  const bo = opts.filter({ hasText: /^\s*Bikash N\s*$/ });
  if (await bo.count()) { await bo.first().click(); await settle(page, 3000); o.ut02.clientFiltered = { showing: await showing(), clients: [...new Set((await page.locator('tbody tr').allInnerTexts()).map(r => /Bikash N/.test(r) ? 'Bikash N' : 'other'))] }; }
  else await page.keyboard.press('Escape');
  o.ut02.shot = await fsnap(shot, page, 'upcoming', 'UT-02-client-filter');
  await page.locator('main button:visible').filter({ hasText: /Reset\s*Filter/ }).first().click().catch(() => {}); await settle(page, 2500); o.ut02.afterReset = await showing();
  P('ut02', o.ut02);
  // UT-03 Edit Booking
  o.ut03 = await openItem(page, 'Edit Booking');
  o.ut03.declined = await declineAdvance(page, 'B-944'); await page.waitForTimeout(3000);
  o.ut03.url = page.url().replace(/\?.*/, ''); o.ut03.shot = await fsnap(shot, page, 'upcoming', 'UT-03-edit-booking-after-decline');
  P('ut03', o.ut03);
  // UT-04 Vehicle Allocation item
  o.ut04 = await openItem(page, 'Vehicle Allocation');
  o.ut04.shotPrompt = await fsnap(shot, page, 'upcoming', 'UT-04-vehicle-allocation-prompt');
  o.ut04.declined = await declineAdvance(page, 'B-944'); await page.waitForTimeout(3000);
  const d4 = page.locator('[role=dialog]:visible').last();
  o.ut04.after = { url: page.url().replace(/\?.*/, ''), dialog: (await d4.count()) ? scrub(await d4.innerText()).replace(/\s+/g, ' ').slice(0, 300) : null };
  o.ut04.shot = await fsnap(shot, page, 'upcoming', 'UT-04-vehicle-allocation-result');
  P('ut04', o.ut04);
  if (await d4.count()) { await page.keyboard.press('Escape'); await page.waitForTimeout(600); }
  // UT-05 Send To Trip Approval: No first
  o.ut05 = await openItem(page, 'Send To Trip Approval');
  o.ut05.declined = await declineAdvance(page, 'B-944'); await page.waitForTimeout(1500);
  let c = page.locator('[role=dialog]:visible').last();
  o.ut05.confirm = (await c.count()) ? scrub(await c.innerText()).replace(/\s+/g, ' ').slice(0, 200) : null;
  o.ut05.shotConfirm = await fsnap(shot, page, 'upcoming', 'UT-05-trip-approval-confirm');
  if (!/send this booking to trip approvals/i.test(o.ut05.confirm || '')) { P('ut05', o.ut05); return o; }
  await c.locator('button:visible:text-is("No")').click(); await page.waitForTimeout(1500);
  o.ut05.afterNo = { dialogs: await page.locator('[role=dialog]:visible').count(), stillListed: (await findRow(page)).length };
  // Yes
  const net = netlog(page);
  const again = await openItem(page, 'Send To Trip Approval'); o.ut05.identity2 = again.identity;
  await declineAdvance(page, 'B-944'); await page.waitForTimeout(1500);
  c = page.locator('[role=dialog]:visible').last();
  if (!/send this booking to trip approvals/i.test(await c.innerText().catch(() => ''))) { o.ut05.stop = 'confirm not shown 2nd time'; return o; }
  await c.locator('button:visible:text-is("Yes")').click();
  const seen = []; for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); for (const t of await page.locator('.Toastify__toast:visible').allInnerTexts()) { const x = scrub(t).replace(/\s+/g, ' '); if (!seen.includes(x)) seen.push(x); } if (seen.length >= 2) break; }
  o.ut05.toasts = seen; await settle(page, 3000); o.ut05.net = [...net];
  await go(page, U); await page.waitForTimeout(1500);
  const h = await findRow(page); o.ut05.rowAfter = h.length === 1 ? scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ') : 'rows ' + h.length;
  o.ut05.shot = await fsnap(shot, page, 'upcoming', 'UT-05-after-trip-approval');
  P('ut05', o.ut05);
  return o;
};
