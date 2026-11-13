import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const d = page.locator('[role=dialog]:visible').last();
  if ((await d.locator('input[name=tripId]').inputValue()) !== 'TP-111') return { stop: 'not TP-111' };
  const vals = { startOdometer: '10000', openingKm: '10000', fuelFilled: '20', lastDieselInput: '20', mileage: '12' };
  for (const [n, v] of Object.entries(vals)) await d.locator(`input[name=${n}]`).fill(v);
  const s1 = await snap(shot, 'S17-trip-sheet-filled', { page });
  await d.locator('button:text-is("Generate Trip Sheet & Mark Vehicle Ready")').click();
  await page.waitForTimeout(2500);
  const d2 = page.locator('[role=dialog]:visible').last();
  const after = (await d2.count()) ? scrub(await d2.innerText()).replace(/\s+/g, ' ').slice(0, 800) : null;
  const toasts = []; for (let i = 0; i < 16; i++) { const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } await page.waitForTimeout(500); }
  const s2 = await snap(shot, 'S17-after-submit', { page });
  await settle(page, 2500);
  return { vals, s1, after, afterButtons: (await d2.count()) ? (await d2.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean) : [], toasts: toasts.map(scrub), net, s2 };
};
