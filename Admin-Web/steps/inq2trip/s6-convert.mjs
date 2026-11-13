import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = [];
  page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const dlg = page.locator('[role=dialog]:visible').last();
  if (!/Choose Trip/.test(await dlg.innerText().catch(() => ''))) return { blocked: 'Choose Trip(s) dialog not open' };
  const boxes = dlg.locator('input[type=checkbox]');
  const states = await boxes.evaluateAll(es => es.map(e => e.checked));
  if ((await boxes.count()) && !states.some(Boolean)) { await boxes.last().check(); await page.waitForTimeout(500); }
  const statesAfter = await boxes.evaluateAll(es => es.map(e => e.checked));
  const pre = await snap(shot, 'S06-trip-selected', { page });
  await dlg.locator('button').filter({ hasText: /^\s*Convert into Booking\s*$/ }).click();
  await page.waitForTimeout(1500);
  const conf = page.locator('[role=dialog]:visible').last();
  const confText = scrub(await conf.innerText().catch(() => ''));
  const confShot = await snap(shot, 'S06-convert-confirm', { page });
  const yes = conf.locator('button').filter({ hasText: /^\s*Yes\s*$/i });
  if (!(await yes.count())) return { states, statesAfter, pre, confText, confShot, net, stop: 'No Yes button in confirmation' };
  await yes.first().click();
  const toasts = [];
  for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(s => s.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 2500);
  return { states, statesAfter, confText, toasts: toasts.map(scrub), url: page.url().replace(/\?.*/, ''), net, pre, confShot, shot: await snap(shot, 'S06-converted', { page }) };
};
