// Helpers for the Inquiry-to-Trip workflow (admin-web-inquiry-to-trip skill). PII-masked shots, step log.
import fs from 'node:fs';
import path from 'node:path';
export const RUN = process.env.INQ_RUN || 'admin-web-20261112-2229-INQ2TRIP';
const RES = path.resolve('results', RUN);
export const norm = s => (s || '').replace(/\s+/g, ' ').trim();
export const scrub = s => norm(s).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/(?:\+?91[\s-]?)?[6-9]\d{9}\b/g, '<phone>');
// masks PII inside form inputs too (contact number, email, client name), not only leaf text
export const PII_INPUTS = 'input[name=primaryContact], input[name=primaryEmail], input[name*=mobile i], input[name*=phone i], input[name*=email i], input[placeholder="Type to search or select from list"]';
export const snap = (shot, slug, opts = {}) => shot(`inquiry-to-trip/${RUN}/${slug}`, { ...opts, mask: [...(opts.mask || []), ...(opts.page ? [opts.page.locator(PII_INPUTS)] : [])] });
export function record(patch) { const f = path.join(RES, 'record.json'); const r = { ...JSON.parse(fs.readFileSync(f)), ...(patch || {}) }; fs.writeFileSync(f, JSON.stringify(r, null, 2)); return r; }
export function logStep(e) { const f = path.join(RES, 'steps.json'); const a = JSON.parse(fs.readFileSync(f)); a.push({ ts: new Date().toISOString(), ...e }); fs.writeFileSync(f, JSON.stringify(a, null, 2)); }
export async function settle(page, ms = 1500) { await page.waitForLoadState('networkidle').catch(() => {}); await page.waitForTimeout(ms); }
// visible table: headers + rows (scrubbed)
export async function table(page, max = 15) {
  return page.evaluate(max => {
    const t = [...document.querySelectorAll('table')].find(t => t.getClientRects().length);
    if (!t) return null;
    const h = [...t.querySelectorAll('thead th')].map(e => e.innerText.trim());
    const rows = [...t.querySelectorAll('tbody tr')].slice(0, max).map(r => [...r.querySelectorAll('td')].map(c => c.innerText.replace(/\s+/g, ' ').trim()));
    return { headers: h, rows, total: t.querySelectorAll('tbody tr').length };
  }, max);
}

// Safe row-menu action: refuses destructive/out-of-scope items, ensures a clean menu state, verifies the item exists.
export const FORBIDDEN = /cancel|delete|advance|payment|refund|proforma|finance/i;
export async function rowAction(page, rowId, item, firstItem) {
  if (FORBIDDEN.test(item)) throw new Error(`refused forbidden action: ${item}`);
  // close any open menu/dialog without triggering anything: click the page title
  for (let i = 0; i < 3 && await page.locator(`button:visible:text-is("${firstItem}")`).count(); i++) { await page.locator('h1').first().click(); await page.waitForTimeout(500); }
  if (await page.locator(`button:visible:text-is("${firstItem}")`).count()) throw new Error('a row menu is still open');
  const rows = page.locator('tbody tr').filter({ has: page.locator('td', { hasText: new RegExp('^\s*' + rowId + '\s*$') }) });
  if ((await rows.count()) !== 1) return { blocked: `${rowId} rows: ${await rows.count()}` };
  const kebab = rows.first().locator('td').last().locator('button:has(svg[data-testid=MoreVertIcon])');
  if ((await kebab.count()) !== 1) return { blocked: `kebab buttons in ${rowId} action cell: ${await kebab.count()}` };
  await kebab.click();
  await page.locator(`button:visible:text-is("${firstItem}")`).first().waitFor({ timeout: 8000 });
  const menuBox = await page.locator(`button:visible:text-is("${firstItem}")`).first().evaluate(b => [...b.parentElement.querySelectorAll('button')].map(x => x.innerText.trim()));
  const target = page.locator(`button:visible:text-is("${item}")`);
  if ((await target.count()) !== 1) return { menu: menuBox, blocked: `"${item}" visible count ${await target.count()}` };
  await target.click();
  return { menu: menuBox };
}

// index of the single tbody row whose innerText contains the trip ID (innerText keeps cell spacing)
export async function rowIndex(page, id) {
  const rows = page.locator('tbody tr'); const n = await rows.count(); const hits = [];
  for (let i = 0; i < n; i++) if (new RegExp(id.replace('-', '-\s*') + '(?!\d)').test(await rows.nth(i).innerText())) hits.push(i);
  return hits;
}
// open kebab menu of the row and return {menu}; then optionally click item (exact text) after FORBIDDEN check
export async function kebab(page, i, item) {
  const row = page.locator('tbody tr').nth(i);
  const before = new Set((await page.locator(':is(button,li,[role=menuitem]):visible').allInnerTexts()).map(x => x.trim()));
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1200);
  const menu = (await page.locator(':is(button,li,[role=menuitem]):visible').allInnerTexts()).map(x => x.trim()).filter(x => x && !before.has(x));
  if (!item) return { menu };
  if (FORBIDDEN.test(item)) throw new Error('refused ' + item);
  const el = page.locator(':is(button,li,[role=menuitem]):visible').filter({ hasText: new RegExp('^\s*' + item + '\s*$') });
  if ((await el.count()) !== 1) return { menu, blocked: `${item} count ${await el.count()}` };
  await el.click(); return { menu, clicked: item };
}

// Decline the "Record Advance Payment?" prompt for TP-111 if it is showing; returns true when declined.
export async function declineAdvance(page, id = 'TP-111') {
  const d = page.locator('[role=dialog]:visible').last();
  if (!(await d.count())) return false;
  const t = await d.innerText();
  if (!/Record Advance/.test(t) || !t.includes(id)) return false;
  const no = d.locator('button:visible').filter({ hasText: /^\s*No, (Not Now|Continue[^]*)\s*$/ });
  if ((await no.count()) !== 1) throw new Error('advance prompt without a single No button');
  await no.click(); await page.waitForTimeout(2000); return true;
}
