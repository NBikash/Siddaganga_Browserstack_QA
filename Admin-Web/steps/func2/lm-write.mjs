// Lead write cases. PHASE=add    -> LEA-016 create one lead "QA Test Lead" (approved by user)
//                   PHASE=delopen -> open Delete on LEAD, return dialog text/buttons, close it with Escape (nothing clicked)
//                   PHASE=deldismiss -> open Delete on LEAD, click the dialog's dismiss button (BTN), verify row still there
//                   PHASE=delconfirm -> open Delete on LEAD, click the dialog's confirm button (BTN), verify row gone after refresh
import { go, settle, scrub, fsnap, toasts, netlog } from './_f.mjs';
const LEAD = process.env.LEAD, BTN = process.env.BTN, PHASE = process.env.PHASE;
const showing = async page => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0] || null;
async function search(page, q) {
  await go(page, '/dashboard/lead-management/total-lead');
  await page.locator('input[placeholder="Search Lead Info"]').fill(q); await settle(page, 2500);
  await page.locator('tbody tr').filter({ hasText: q }).first().waitFor({ timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(800);
  const rows = page.locator('tbody tr'); const n = await rows.count(); const hit = [];
  for (let i = 0; i < n; i++) if ((await rows.nth(i).locator('td').nth(1).innerText().catch(() => '')).trim() === q) hit.push(i);
  return { rows, hit };
}
async function openDelete(page) {
  const { rows, hit } = await search(page, LEAD);
  if (hit.length !== 1) return { blocked: `rows for ${LEAD}: ${hit.length}` };
  await rows.nth(hit[0]).locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  const del = page.locator('button:visible:text-is("Delete")');
  if ((await del.count()) !== 1) return { blocked: 'Delete item count ' + await del.count() };
  await del.click(); await page.waitForTimeout(1500);
  const d = page.locator('[role=dialog]:visible').last();
  return { dialog: (await d.count()) ? scrub(await d.innerText()) : null, buttons: (await d.count()) ? (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()) : [] };
}
export default async ({ page, shot }) => {
  const o = { PHASE, LEAD };
  if (PHASE === 'add') {
    await go(page, '/dashboard/lead-management/total-lead');
    o.before = await showing(page);
    if (!(await page.locator('[role=dialog]:visible').count())) { await page.locator('button:visible:text-is("+ Add Lead")').click(); await settle(page, 1500); }
    const root = page.locator('[role=dialog]:visible').last();
    const name = root.locator('input[placeholder="Enter client name"]');
    const val = root.locator('input[placeholder="Enter expected value"]');
    o.fields = { name: await name.count(), val: await val.count() };
    await name.fill('QA Test Lead'); await val.fill('1000');
    const stage = root.locator('[role=combobox]:visible');
    o.dropdowns = await Promise.all((await stage.all()).map(async c => (await c.innerText()).trim()));
    await root.locator('[role=combobox]:visible').last().click(); await page.waitForTimeout(600);
    const openOpt = page.locator('[role=listbox]:visible [role=option]').filter({ hasText: /^\s*Open\s*$/ });
    if (await openOpt.count()) await openOpt.first().click(); else await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    o.shotFilled = await fsnap(shot, page, 'lead', 'LEA-016-add-lead-filled');
    const net = netlog(page);
    await root.locator('button:visible').filter({ hasText: /^\s*Create Lead\s*$/ }).click();
    o.toasts = await toasts(page, 8000); await settle(page, 2500);
    o.net = net; o.dialogOpen = await page.locator('[role=dialog]:visible').count();
    await go(page, '/dashboard/lead-management/total-lead');
    o.after = await showing(page);
    o.top = scrub(await page.locator('tbody tr').first().innerText());
    await page.locator('input[placeholder="Search Lead Info"]').fill('QA Test Lead'); await settle(page, 2500);
    o.search = (await page.locator('tbody tr').allInnerTexts()).map(scrub);
    o.shotList = await fsnap(shot, page, 'lead', 'LEA-016-new-lead-in-list');
    return o;
  }
  const d = await openDelete(page); Object.assign(o, d);
  if (d.blocked) return o;
  o.shotDialog = await fsnap(shot, page, 'lead', `${PHASE === 'delconfirm' && LEAD !== 'LD-397' ? 'LEA-027' : 'LEA-023'}-${LEAD}-delete-dialog`);
  if (PHASE === 'delopen') { await page.keyboard.press('Escape'); await page.waitForTimeout(800); o.stillOpen = await page.locator('[role=dialog]:visible').count(); return o; }
  const dlg = page.locator('[role=dialog]:visible').last();
  const b = dlg.locator('button:visible').filter({ hasText: new RegExp('^\\s*' + BTN + '\\s*$') });
  if ((await b.count()) !== 1) return { ...o, blocked: `button "${BTN}" count ${await b.count()}` };
  const net = netlog(page);
  await b.click(); o.toasts = await toasts(page, 6000); await settle(page, 2000);
  o.net = net; o.dialogAfter = await page.locator('[role=dialog]:visible').count();
  o.shotAfter = await fsnap(shot, page, 'lead', `${PHASE}-${LEAD}-after`);
  await page.reload({ waitUntil: 'domcontentloaded' }); await settle(page, 2500);
  const { hit } = await search(page, LEAD);
  o.rowAfterRefresh = hit.length;
  o.shotRefresh = await fsnap(shot, page, 'lead', `${PHASE}-${LEAD}-search-after-refresh`);
  return o;
};
