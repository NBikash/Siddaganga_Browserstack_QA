// Read-only: is QRY-228 the former QRY-195? Lead LD-415 View Lead + QRY-228 row menu → Edit URL (no save).
import { go, settle, scrub, fsnap, save, closeDialogs, closeMenu, table } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  const rows = page.locator('tbody tr').filter({ hasText: /LD-415(?!\d)/ });
  for (let i = 0; i < 4 && (await rows.count()) !== 1; i++) { await s.fill(''); await settle(page, 1000); await s.fill('LD-415'); await settle(page, 3500); }
  const rt = scrub(await rows.first().innerText()).replace(/\s+/g, ' ');
  if (!rt.includes('Bikash N')) throw new Error('not QA lead');
  await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click(); await settle(page, 1500);
  const d = page.locator('[role=dialog]:visible').last();
  for (let i = 0; i < 20 && !/Inquiry PNR\s*[A-Z]{4}\d{6}/.test(await d.innerText().catch(() => '')); i++) await page.waitForTimeout(500);
  const t = scrub(await d.innerText()).replace(/\s+/g, ' ');
  o.lead = { row: rt, pnr: t.match(/Inquiry PNR\s*([A-Z]{4}\d{6})/)?.[1], inquiryId: t.match(/Inquiry ID\s*(QRY-\d+)/)?.[1], status: t.match(/Inquiry Information.*?Status (.+?) Client Type/)?.[1], vehicles: t.match(/Vehicle Name [^V]+/g) };
  o.lead.shot = await fsnap(shot, page, 'quote', 'Q195-LD-415-view-lead-after-trip2', { fullPage: true });
  await closeDialogs(page);
  const { row, text } = await inqRow(page, 'QRY-228'); o.row228 = text;
  o.menu228 = await menuOf(page, row);
  await page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: /^\s*Edit\s*$/ }).click();
  await page.waitForURL(/update-inquiry/, { timeout: 30000 }); o.editUrl228 = page.url().replace(/^https?:\/\/[^/]+/, '').replace(/\?.*/, '');
  o.sameForm = o.editUrl228.includes('48f3a9cd-513a-44b4-bc82-5d33e3659ce6');
  save('check-228.json', o); return o;
};
