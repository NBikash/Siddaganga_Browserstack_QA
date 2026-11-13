import { go, settle, scrub, fsnap, rec, kebab, rowIndex } from './_func.mjs';
export default async ({ page, shot }) => {
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill('LD-353'); await settle(page, 2500);
  const rows = (await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' '));
  const hits = await rowIndex(page, 'LD-353');
  if (hits.length !== 1) return { rows };
  const k = await kebab(page, hits[0], 'View Lead');
  await settle(page, 2500);
  const t = scrub(await page.locator('body').innerText()).replace(/\s+/g, ' ');
  const i = t.indexOf('Inquiry Information');
  const pnr = t.match(/Inquiry PNR\s*([A-Z0-9]+)/)?.[1], inq = t.match(/Inquiry ID\s*(\d+)/)?.[1];
  const shotV = await fsnap(shot, page, 'lead', 'LM-01-view-lead-pnr', { fullPage: true });
  return { rows, menu: k.menu, pnr, inq, exact: pnr === 'SOQS555799', details: t.slice(i, i + 1800), shotV };
};
