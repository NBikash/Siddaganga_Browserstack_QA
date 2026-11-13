import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const b = page.locator('main button:visible:text-is("Confirm Allocation")');
  if ((await b.count()) !== 1) return { stop: 'Confirm Allocation count ' + await b.count() };
  await b.click(); await page.waitForTimeout(2500);
  const dlg = page.locator('[role=dialog]:visible').last();
  const toasts = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()).map(scrub);
  return { dialog: (await dlg.count()) ? scrub(await dlg.innerText()).replace(/\s+/g, ' ').slice(0, 1500) : null,
    dButtons: (await dlg.count()) ? (await dlg.locator('button').allInnerTexts()).map(s => s.trim()).filter(Boolean) : [],
    toasts, net, status: (await page.locator('main').innerText()).match(/Bus Assigned Status for this Trip : [^\n]+/)?.[0], shot: await snap(shot, 'S13-confirm-allocation-1', { page }) };
};
