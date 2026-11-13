import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  await page.goto(new URL('/dashboard/lead-management/total-lead', page.url()).href, { waitUntil: 'domcontentloaded' });
  await settle(page, 2500);
  const t = await table(page, 12);
  const inputs = await page.locator('input:visible, select:visible').evaluateAll(es => es.map(e => ({ tag: e.tagName, type: e.type, ph: e.placeholder, name: e.name })));
  const tabs = await page.locator('button:visible, [role=tab]:visible').allInnerTexts();
  const pnrInList = (await page.locator('body').innerText()).includes('MWAG650153');
  return { url: page.url(), h1: await page.locator('h1').first().innerText().catch(() => ''), inputs, buttons: tabs.map(s => s.trim()).filter(Boolean).slice(0, 40),
    headers: t?.headers, rows: t?.rows.map(r => r.map(scrub)), total: t?.total, pnrInList, shot: await snap(shot, 'S01-lead-list') };
};
