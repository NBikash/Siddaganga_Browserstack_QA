// Read-only: QA client inquiry row (env INQ) -> row menu items (closed without clicking) + row cells.
import { go, settle, scrub, table, closeMenu, fsnap } from './_i.mjs';
export const MENU = ['View Quote', 'Edit', 'Send To Booking', 'Record Advance', 'Send Quote', 'Send Proforma Invoice', 'Download Proforma Invoice', 'Send Bus Images', 'Cancel Inquiry', 'Delete'];
export async function inqRow(page, inq) {
  let err;
  for (let i = 0; i < 3; i++) { try { return await inqRowOnce(page, inq); } catch (e) { err = e; if (/refused/.test(e.message)) throw e; await page.waitForTimeout(2000); } }
  throw err;
}
async function inqRowOnce(page, inq) {
  // QA client only: Client filter = "Bikash N", then 20 rows per page (searching + page size returns no data; paging was flaky)
  await go(page, '/dashboard/inquiry-management/total-inquiries'); await settle(page, 1500);
  const cl = page.locator('input[placeholder="Select client by name or mobile"]');
  await cl.click(); await cl.fill('Bikash'); await page.waitForTimeout(2500);
  const opt = page.locator('.MuiAutocomplete-popper:visible li.MuiAutocomplete-option').filter({ hasText: /Bikash N/ });
  if ((await opt.count()) !== 1) throw new Error('QA client option count ' + await opt.count());
  await opt.click(); await page.waitForTimeout(3500);
  const rpp = page.locator('main [role=combobox]').filter({ hasText: /^\s*0?5\s*$/ });
  if ((await rpp.count()) === 1) { await rpp.click(); await page.waitForTimeout(800); await page.locator('.MuiMenu-root:visible [role=option]').filter({ hasText: /^\s*20\s*$/ }).click(); await page.waitForTimeout(3500); }
  const qa = async () => { const n = (await page.locator('tbody tr td:nth-child(3)').allInnerTexts()).map(x => x.trim()); return n.length > 0 && n.every(x => x === 'Bikash N'); };
  for (let k = 0; k < 20 && !(await qa()); k++) await page.waitForTimeout(500);
  if (!(await qa())) throw new Error('client filter did not apply');
  const rows = page.locator('tbody tr').filter({ has: page.locator('td:nth-child(2)', { hasText: new RegExp('^\s*' + inq + '\s*$') }) });
  if ((await rows.count()) !== 1) throw new Error(`rows for ${inq}: ${await rows.count()}`);
  const r = rows.first(); const t = scrub(await r.innerText()).replace(/\s+/g, ' ');
  if (!t.includes('Bikash N')) throw new Error('not a QA client inquiry: refused');
  return { row: r, text: t };
}
export async function menuOf(page, row) {
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1200);
  return (await page.locator('.MuiMenu-root:visible [role=menuitem]').allInnerTexts()).map(x => x.trim()).filter(Boolean);
}
export default async ({ page, shot }) => {
  const { row, text } = await inqRow(page, process.env.INQ);
  const menu = await menuOf(page, row);
  const s = await fsnap(shot, page, 'inquiry', `MENU-${process.env.INQ}-row-menu`);
  await closeMenu(page);
  return { text, menu, shot: s };
};
