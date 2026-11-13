import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  if (!/confirm-booking/.test(page.url())) return { stop: 'not on confirm-booking page' };
  const top = page.locator('button:visible:text-is("Confirm Booking")');
  if ((await top.count()) !== 1) return { stop: 'top Confirm Booking count ' + await top.count() };
  await page.evaluate(() => window.scrollTo(0, 0));
  await top.click(); await page.waitForTimeout(2000);
  const dlg = page.locator('[role=dialog]:visible, .MuiDialog-paper:visible, .MuiModal-root:visible').last();
  const dText = (await dlg.count()) ? scrub(await dlg.innerText()) : null;
  const dShot = await snap(shot, 'S08-confirm-popup', { page });
  const toasts1 = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()).map(scrub);
  let clicked = false;
  if (dText && /confirm/i.test(dText) && !/cancel(lation)? reason|cancel and notify/i.test(dText)) {
    const b = dlg.locator('button').filter({ hasText: /^\s*(Confirm Booking|Confirm|Yes)\s*$/ });
    if ((await b.count()) === 1) { await b.click(); clicked = true; }
  }
  const toasts = []; for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 3000);
  return { dText, clicked, toasts1, toasts: toasts.map(scrub), url: page.url().replace(/\?.*/, ''), net, dShot, shot: await snap(shot, 'S08-after-confirm', { page }) };
};
