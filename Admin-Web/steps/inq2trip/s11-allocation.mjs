import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  await page.goto(new URL('/dashboard/fleet-vehicle-management/vehicle-allocation', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 4000);
  const tabs = (await page.locator('main button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 25);
  const search = await page.locator('input:visible').evaluateAll(es => es.map(e => e.placeholder));
  const t = await table(page, 40);
  const hits = (t?.rows || []).map((r, i) => ({ i, r: r.map(scrub) })).filter(x => /TP-111|B-932|Bikash N/.test(x.r.join(' ')));
  let rowCtl = null;
  if (hits.length === 1) {
    const row = page.locator('tbody tr').nth(hits[0].i);
    rowCtl = await row.locator('button, a').evaluateAll(bs => bs.map(b => ({ t: (b.innerText || b.getAttribute('aria-label') || '').trim(), dis: b.disabled || b.getAttribute('aria-disabled') === 'true' || /disabled/i.test(b.className) })));
  }
  return { url: page.url().replace(/\?.*/, ''), h: (await page.locator('h1, main h2, main h3, main h4').allInnerTexts()).slice(0, 8), tabs, search, headers: t?.headers, total: t?.total, hits, rowCtl, pag: await page.locator('text=/Showing .* entries/').allInnerTexts(), shot: await snap(shot, 'S11-allocation-portal', { page }) };
};
