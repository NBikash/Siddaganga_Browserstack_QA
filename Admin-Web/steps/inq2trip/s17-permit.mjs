import path from 'node:path';
import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const d = page.locator('[role=dialog]:visible').last();
  if ((await d.locator('input[name=tripId]').inputValue()) !== 'TP-111') return { stop: 'not TP-111' };
  const fi = d.locator('input[type=file]');
  const n = await fi.count();
  const accepts = await fi.evaluateAll(es => es.map(e => e.accept + '|' + e.name));
  const target = n === 1 ? fi : d.locator('input[type=file][accept*=pdf]').last();
  if (!(await target.count())) return { stop: 'no file input', n, accepts };
  await target.setInputFiles(path.resolve('test-data/qa-test-permit.pdf')); await page.waitForTimeout(2500);
  const s1 = await snap(shot, 'S17-permit-attached', { page });
  const vals = await d.locator('input[name=startOdometer], input[name=fuelFilled], input[name=mileage]').evaluateAll(es => es.map(e => e.name + '=' + e.value));
  await d.locator('button:text-is("Generate Trip Sheet & Mark Vehicle Ready")').click();
  const toasts = []; for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 2500);
  const d2 = page.locator('[role=dialog]:visible').last();
  return { n, accepts, vals, s1, toasts: toasts.map(scrub), net, dialogAfter: (await d2.count()) ? scrub(await d2.innerText()).replace(/\s+/g, ' ').slice(-300) : null, s2: await snap(shot, 'S17-dispatched', { page }) };
};
