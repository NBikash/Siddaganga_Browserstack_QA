import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const d = page.locator('[role=dialog]:visible').last();
  if ((await d.locator('input[name=tripId]').inputValue()) !== 'TP-111') return { stop: 'not TP-111' };
  await d.locator('input[name=helper]').fill('QA Test Helper');
  const vals = await d.locator('input[name]').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => e.name + '=' + e.value));
  const s1 = await snap(shot, 'S17-helper-filled', { page });
  await d.locator('button:text-is("Generate Trip Sheet & Mark Vehicle Ready")').click();
  const toasts = []; for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 3000);
  const d2 = page.locator('[role=dialog]:visible').last();
  return { vals, s1, toasts: toasts.map(scrub), net, dialogOpen: await d2.count(), dialogTail: (await d2.count()) ? scrub(await d2.innerText()).replace(/\s+/g, ' ').slice(-250) : null, s2: await snap(shot, 'S17-dispatched-2', { page }) };
};
