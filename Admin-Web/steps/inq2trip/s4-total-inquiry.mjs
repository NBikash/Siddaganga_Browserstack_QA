import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  await page.goto(new URL('/dashboard/inquiry-management/total-inquiries', page.url()).href, { waitUntil: 'domcontentloaded' });
  await settle(page, 3000);
  const out = { tabs: (await page.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 30),
    search: await page.locator('input:visible').evaluateAll(es => es.map(e => e.placeholder)) };
  const s = page.locator('input[placeholder*="Search" i]:visible').first();
  for (const q of ['MWAG650153', '932']) {
    if (!(await s.count())) break;
    await s.fill(''); await s.fill(q); await settle(page, 2500);
    const t = await table(page, 8);
    out[q] = { headers: t?.headers, rows: t?.rows.map(r => r.map(scrub)) };
    if (t?.rows.some(r => r.join(' ').includes('MWAG650153') || r.includes('932'))) { out.hit = q; break; }
  }
  out.shot = await snap(shot, 'S04-total-inquiry', { page });
  return out;
};
