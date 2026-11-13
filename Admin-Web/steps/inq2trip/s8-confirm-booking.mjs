import { settle, scrub, snap, rowAction } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const s = page.locator('input[placeholder*="Search Booking" i]:visible').first(); await s.fill(''); await s.fill('932'); await settle(page, 2500);
  const r = await rowAction(page, 'B-932', 'Confirm Booking', 'View Booking');
  if (r.blocked) return r;
  await page.waitForTimeout(2000);
  // the confirmation is not role=dialog: read the overlay text near the visible "Confirm Booking" buttons
  const overlay = await page.evaluate(() => { const bs = [...document.querySelectorAll('button')].filter(b => b.getClientRects().length && /^Confirm Booking$/.test(b.innerText.trim())); const b = bs[bs.length - 1]; let p = b; for (let i = 0; i < 6 && p; i++) p = p.parentElement; return { n: bs.length, text: (p?.innerText || '').replace(/\s+/g, ' ').slice(0, 600), btns: p ? [...p.querySelectorAll('button')].map(x => x.innerText.trim()) : [] }; });
  const confShot = await snap(shot, 'S08-confirm-dialog', { page });
  if (/cancel/i.test(overlay.text.slice(0, 40))) return { r, overlay, confShot, stop: 'overlay looks like a cancel dialog - not confirming' };
  const btn = page.locator('button:visible:text-is("Confirm Booking")');
  if ((await btn.count()) !== 1) return { r, overlay, confShot, stop: `Confirm Booking buttons visible: ${await btn.count()}` };
  await btn.click();
  const toasts = []; for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 2500);
  return { r, overlay, toasts: toasts.map(scrub), net, confShot, shot: await snap(shot, 'S08-confirmed', { page }) };
};
