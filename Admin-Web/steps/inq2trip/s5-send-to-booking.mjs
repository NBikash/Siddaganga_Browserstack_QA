import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const rows = page.locator('tbody tr', { hasText: 'QRY-932' });
  if ((await rows.count()) !== 1) return { blocked: 'QRY-932 rows: ' + await rows.count() };
  await rows.first().locator('td').last().locator('button').first().click(); await page.waitForTimeout(1000);
  const menu = (await page.locator('.MuiPopover-paper:visible button, .MuiMenu-paper:visible button, .MuiPopover-paper:visible li').allInnerTexts()).map(s => s.trim()).filter(Boolean);
  const mshot = await snap(shot, 'S05-inquiry-menu', { page });
  const item = page.locator('button:visible, li:visible').filter({ hasText: /^\s*Send to Booking\s*$/i }).first();
  if (!(await item.count())) return { menu, mshot, blocked: 'Send to Booking not in menu' };
  await item.click();
  await settle(page, 4000);
  const dlg = page.locator('[role=dialog]:visible').last();
  const hasDlg = await dlg.count();
  const text = scrub(hasDlg ? await dlg.innerText() : await page.locator('main').first().innerText().catch(() => page.locator('body').innerText()));
  return { menu, mshot, url: page.url().replace(/\?.*/, ''), dialog: !!hasDlg, text: text.slice(0, 3000),
    buttons: (await page.locator(hasDlg ? '[role=dialog]:visible button' : 'button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(-15),
    shot: await snap(shot, 'S05-send-to-booking-details', { page, fullPage: !hasDlg }) };
};
