import { go, table, scrub, settle } from './_f.mjs';
export default async ({ page }) => {
  await go(page, '/dashboard/lead-management/total-lead');
  const t = await table(page, 20);
  const pag = await page.locator('body').innerText().then(s => (s.match(/Rows per page[^\n]*\n?[^\n]*/i) || [''])[0]);
  return { headers: t?.headers, rows: t?.rows.map(r => r.map(scrub).join(' | ')), total: t?.total, pag };
};
