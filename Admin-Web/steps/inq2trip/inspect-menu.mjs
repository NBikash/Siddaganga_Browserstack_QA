// Open the Upcoming Trips card (or CARD env), find ROW_ID, open its kebab menu, list items, close by clicking the title.
import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const CARD = process.env.CARD, ROW = process.env.ROW_ID, TAG = process.env.TAG;
  if (CARD) {
    const c = page.locator('main *:visible').filter({ hasText: new RegExp('^\s*' + CARD + '\s*\d*\s*$') }).last();
    if (!(await c.count())) return { blocked: `card ${CARD} not found` };
    await c.click(); await settle(page, 3000);
  }
  const s = page.locator('input[placeholder*="Search" i]:visible').first();
  const searchPh = await page.locator('input:visible').evaluateAll(es => es.map(e => e.placeholder));
  const t = await table(page, 30);
  const rows = page.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp('^\s*' + ROW + '\s*$') }) });
  const n = await rows.count();
  const out = { url: page.url().replace(/\?.*/, ''), searchPh, headers: t?.headers, matching: (t?.rows || []).filter(r => r.includes(ROW)).map(r => r.map(scrub)), totalRows: t?.total, n };
  if (n !== 1) { out.firstRows = (t?.rows || []).slice(0, 5).map(r => r.map(scrub)); out.shot = await snap(shot, TAG + '-list', { page }); return out; }
  const before = new Set((await page.locator('button:visible').allInnerTexts()).map(x => x.trim()));
  await rows.first().locator('td').last().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1200);
  out.menu = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => x && !before.has(x));
  out.shot = await snap(shot, TAG + '-menu', { page });
  await page.locator('h1').first().click(); await page.waitForTimeout(600);
  return out;
};
