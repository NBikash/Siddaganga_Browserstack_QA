// Look for TP-111 under the allocation portal tabs (read-only).
import { settle, scrub, snap } from './_lib.mjs';
async function scan(page) {
  const out = [];
  for (let p = 1; p <= 5; p++) {
    out.push(...(await page.locator('tbody tr').allInnerTexts()).map(r => scrub(r).replace(/\s+/g, ' ')));
    const nb = page.locator(`button:visible:text-is("${p + 1}")`).last();
    if (!(await nb.count())) break; await nb.click(); await settle(page, 2000);
  }
  return out;
}
export default async ({ page, shot }) => {
  const res = {};
  for (const tab of ['Pending Allocation Confirmations', 'Trip Approvals & Vehicle Assignment']) {
    await page.locator(`button:visible:text-is("${tab}")`).click(); await settle(page, 3000);
    const rows = await scan(page);
    res[tab] = { count: rows.length, hits: rows.filter(r => /TP-111|Bikash N/.test(r)), headers: await page.locator('thead th').allInnerTexts() };
    if (res[tab].hits.length) res[tab].shot = await snap(shot, 'S14-found-' + tab.split(' ')[0], { page });
  }
  res.cards = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 140);
  return res;
};
