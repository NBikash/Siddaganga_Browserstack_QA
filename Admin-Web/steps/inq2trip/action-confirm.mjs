// On current approved-trips tab: TP-111 row > ITEM; then click CONFIRM (exact) in the resulting dialog if its text matches EXPECT.
import { settle, scrub, snap, rowIndex, kebab } from './_lib.mjs';
export default async ({ page, shot }) => {
  const ITEM = process.env.ITEM, CONFIRM = process.env.CONFIRM, EXPECT = new RegExp(process.env.EXPECT || '.', 'i'), TAG = process.env.TAG;
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  const hits = await rowIndex(page, 'TP-111');
  if (hits.length !== 1) return { blocked: 'TP-111 rows ' + hits.length };
  const k = await kebab(page, hits[0], ITEM);
  if (k.blocked) { await page.locator('h1').first().click(); return k; }
  await page.waitForTimeout(2000);
  const d = page.locator('[role=dialog]:visible').last();
  const dText = (await d.count()) ? scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 1500) : null;
  const dShot = await snap(shot, TAG + '-dialog', { page });
  const dButtons = (await d.count()) ? (await d.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean) : [];
  const fields = (await d.count()) ? await d.locator('input:visible, textarea:visible, select:visible').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, t: e.type, v: (e.value || '').slice(0, 20), req: e.required }))) : [];
  if (!CONFIRM || !dText || !EXPECT.test(dText) || fields.length) return { menu: k.menu, dText, dButtons, fields, dShot, net, stop: 'inspect only / needs input' };
  const b = d.locator(`button:visible:text-is("${CONFIRM}")`);
  if ((await b.count()) !== 1) return { menu: k.menu, dText, dButtons, dShot, stop: `${CONFIRM} count ${await b.count()}` };
  await b.click();
  const toasts = []; for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 3000);
  return { menu: k.menu, dText, toasts: toasts.map(scrub), net, dShot, shot: await snap(shot, TAG + '-done', { page }) };
};
