import { settle, scrub, snap, logStep, PII_INPUTS } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = [];
  page.on('response', r => { if (/inquir|quote|lead/i.test(r.url()) && r.request().method() !== 'GET') net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const total = await page.locator('input[name=totalApproxCost]').inputValue();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.locator('button:visible').filter({ hasText: /^\s*Update Quote\s*$/ }).first().click();
  const toasts = [];
  for (let i = 0; i < 12; i++) { await page.waitForTimeout(500); const t = await page.locator('.Toastify__toast:visible, [role=alert]:visible, .MuiSnackbar-root:visible').allInnerTexts(); if (t.length) { toasts.push(...t); break; } }
  const dlg = page.locator('[role=dialog]:visible').last();
  const dialog = (await dlg.count()) ? scrub(await dlg.innerText()).slice(0, 800) : null;
  const s1 = await snap(shot, 'S03-update-quote-result', { page });
  await settle(page, 3000);
  const out = { totalBefore: total, toasts: toasts.map(scrub), dialog, urlAfter: page.url().replace(/\?.*/, ''), net, shot: s1, shotAfter: await snap(shot, 'S03-after-settle', { page }) };
  return out;
};
