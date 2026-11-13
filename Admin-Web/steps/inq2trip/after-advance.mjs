// Decline the advance prompt, then (optionally) confirm the next dialog with CONFIRM if text matches EXPECT and it has no inputs.
import { settle, scrub, snap, declineAdvance } from './_lib.mjs';
export default async ({ page, shot }) => {
  const CONFIRM = process.env.CONFIRM, EXPECT = new RegExp(process.env.EXPECT || '^$', 'i'), TAG = process.env.TAG;
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const declined = await declineAdvance(page);
  await page.waitForTimeout(1000);
  const d = page.locator('[role=dialog]:visible').last();
  const dText = (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 1500) : null;
  const dButtons = (await d.count()) ? (await d.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean) : [];
  const fields = (await d.count()) ? await d.locator('input:visible, textarea:visible, select:visible').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, t: e.type, v: (e.value || '').slice(0, 20) }))) : [];
  const dShot = await snap(shot, TAG + '-dialog2', { page });
  if (!CONFIRM || !dText || !EXPECT.test(dText) || fields.length) return { declined, dText, dButtons, fields, dShot, stop: 'inspect only / needs input' };
  const b = d.locator(`button:visible:text-is("${CONFIRM}")`);
  if ((await b.count()) !== 1) return { declined, dText, dButtons, stop: `${CONFIRM} count ${await b.count()}` };
  await b.click();
  const toasts = []; for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 3000);
  return { declined, dText, toasts: toasts.map(scrub), net, dShot, shot: await snap(shot, TAG + '-done', { page }) };
};
