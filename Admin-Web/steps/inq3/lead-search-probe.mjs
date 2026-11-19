import { go, settle, scrub, table } from './_i.mjs';
export default async ({ page }) => {
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]'); const o = {};
  const net = []; page.on('request', r => { if (/lead/i.test(r.url()) && r.method() === 'GET') net.push(new URL(r.url()).pathname + new URL(r.url()).search.replace(/(search|q)=[^&]*/i, '$1=<term>')); });
  for (const q of ['Bikash', 'Bikash N', 'LD-414', 'LD-436']) {
    await s.fill(''); await settle(page, 1500); await s.fill(q); await settle(page, 3500);
    const t = await table(page, 50);
    o[q] = { showing: (await page.locator('text=/Showing .* entries/').allInnerTexts())[0], qaRows: (t?.rows || []).filter(r => (r[2] || '').trim() === 'Bikash N').map(r => r[1] + ' ' + r[5]), otherRows: (t?.rows || []).filter(r => r[1] && (r[2] || '').trim() !== 'Bikash N').length };
  }
  o.rpp = await page.locator('text=/Rows per page/i').count(); o.net = [...new Set(net)].slice(-6);
  return o;
};
