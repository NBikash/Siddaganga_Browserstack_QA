// Approved AW-INQ-028 retry on QRY-135: open Cancel Inquiry, wait for the calculation, click Confirm Cancellation once,
// then capture screen, dialogs and ALL network requests (any method) for 10 s.
import { fsnap, scrub, toasts, save, load } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
export default async ({ page, shot }) => {
  const o = {}; const reqs = [];
  const { row } = await inqRow(page, 'QRY-135'); await menuOf(page, row);
  await page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: /^\s*Cancel Inquiry\s*$/ }).click();
  const d = page.locator('[role=dialog]:visible').last();
  for (let i = 0; i < 20 && !/Refund amount/.test(await d.innerText().catch(() => '')); i++) await page.waitForTimeout(500);
  o.dialog = scrub(await d.innerText()).replace(/\s+/g, ' ');
  const btn = d.locator('button:visible').filter({ hasText: /^\s*Confirm Cancellation\s*$/ });
  o.btn = { count: await btn.count(), disabled: await btn.isDisabled(), type: await btn.getAttribute('type') };
  page.on('request', r => { if (!/\.(js|css|png|svg|woff2?)(\?|$)/.test(r.url())) reqs.push(`${r.method()} ${new URL(r.url()).pathname}`); });
  page.on('response', r => { if (r.request().method() !== 'GET' && /api/.test(r.url())) reqs.push(`  ← ${r.status()} ${new URL(r.url()).pathname}`); });
  await btn.click();
  o.toasts = await toasts(page, 6000); await page.waitForTimeout(4000);
  o.dialogsAfter = await page.locator('[role=dialog]:visible').count();
  if (o.dialogsAfter) o.dialogAfterText = scrub(await page.locator('[role=dialog]:visible').last().innerText()).replace(/\s+/g, ' ').slice(0, 600);
  o.requests = [...new Set(reqs)];
  o.shot = await fsnap(shot, page, 'inquiry', 'CXL-confirm-QRY-135-after-click', { fullPage: true });
  const all = load('cxl-del.json'); all['CXL-confirm-QRY-135-retry'] = o; save('cxl-del.json', all); return o;
};
