// Approved: env INQ (QA inquiry), LEAD, ACTION ('Cancel Inquiry' | 'Delete'), MODE ('dismiss' | 'confirm').
// Captures the original record first (row, View Quote, menu, KPI, lead), then runs the dialog, then verifies list / status filter / KPI / lead.
import { go, settle, scrub, fsnap, toasts, save, load, evidence, closeDialogs, closeMenu, table } from './_i.mjs';
import { inqRow, menuOf } from './inq-menu.mjs';
import { viewQuote } from './q.mjs';
const { INQ, LEAD, ACTION, MODE } = process.env;
const tag = `${ACTION === 'Delete' ? 'DEL' : 'CXL'}-${MODE}-${INQ}`;
const kpi = async page => { await go(page, '/dashboard/inquiry-management/total-inquiries'); return (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Inquiries \d+ Conversion Rate \S+ Pending Approvals \S+ Total Quote Value \S+/)?.[0]; };
async function leadView(page) {
  await go(page, '/dashboard/lead-management/total-lead');
  const s = page.locator('input[placeholder="Search Lead Info"]');
  const rows = page.locator('tbody tr').filter({ hasText: new RegExp(LEAD + '(?!\\d)') });
  for (let i = 0; i < 4 && (await rows.count()) !== 1; i++) { await s.fill(''); await settle(page, 1000); await s.fill(LEAD); await settle(page, 3500); }
  if ((await rows.count()) !== 1) return { found: false, rows: await rows.count() };
  const rt = scrub(await rows.first().innerText()).replace(/\s+/g, ' ');
  if (!rt.includes('Bikash N')) throw new Error('not the QA lead');
  await rows.first().locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  const menu = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x));
  await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click(); await settle(page, 1500);
  const d = page.locator('[role=dialog]:visible').last();
  for (let i = 0; i < 20 && !/Inquiry (PNR\s*[A-Z]{4}\d{6}|Information\s*(No|-))/.test(await d.innerText().catch(() => '')); i++) await page.waitForTimeout(500);
  const t = scrub(await d.innerText()).replace(/\s+/g, ' ');
  const r = { found: true, row: rt, menu, pnr: t.match(/Inquiry PNR\s*([A-Z]{4}\d{6})/)?.[1] || null, inquiryId: t.match(/Inquiry ID\s*(QRY-\d+)/)?.[1] || null, status: t.match(/Inquiry Information.*?Status (.+?) Client Type/)?.[1] || null };
  r.shot = await fsnap(shot_, page, 'inquiry', `${tag}-lead-${LEAD}`, { fullPage: true });
  await closeDialogs(page); return r;
}
let shot_;
export default async ({ page, shot }) => {
  shot_ = shot; const o = { inq: INQ, lead: LEAD, action: ACTION, mode: MODE };
  const all = (() => { try { return load('cxl-del.json'); } catch { return {}; } })();
  try {
    // ---- original record
    o.kpiBefore = await kpi(page);
    const v = await viewQuote(page, INQ); o.rowBefore = v.rowText; o.viewQuoteBefore = v.dialog?.text;
    o.shotVQ = await fsnap(shot, page, 'inquiry', `${tag}-view-quote-before`); await closeDialogs(page);
    o.leadBefore = await leadView(page);
    // ---- action
    const { row, text } = await inqRow(page, INQ); o.rowAtAction = text;
    o.menuBefore = await menuOf(page, row);
    o.shotMenu = await fsnap(shot, page, 'inquiry', `${tag}-menu`);
    const it = page.locator('.MuiMenu-root:visible [role=menuitem]').filter({ hasText: new RegExp('^\\s*' + ACTION + '\\s*$') });
    if ((await it.count()) !== 1) throw new Error(`${ACTION} count ${await it.count()}`);
    const ev = evidence(page);
    await it.click(); await page.waitForTimeout(1500);
    const d = page.locator('[role=dialog]:visible').last();
    for (let i = 0; i < 16 && !(await d.count()); i++) await page.waitForTimeout(500);
    o.dialog = (await d.count()) ? { text: scrub(await d.innerText()).replace(/\s+/g, ' '), buttons: (await d.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean), inputs: await d.locator('input:visible, textarea:visible').count() } : null;
    o.shotDialog = await fsnap(shot, page, 'inquiry', `${tag}-dialog`);
    if (!o.dialog) { o.noDialog = true; o.toasts = await toasts(page, 6000); }
    else if (MODE === 'dismiss') {
      const no = d.locator('button:visible').filter({ hasText: /^\s*(No|Cancel|Close|No, Keep.*|Keep.*)\s*$/i });
      if ((await no.count()) >= 1) { o.dismissWith = (await no.first().innerText()).trim(); await no.first().click(); } else { o.dismissWith = 'Escape'; await page.keyboard.press('Escape'); }
      await page.waitForTimeout(1500); o.dialogsAfter = await page.locator('[role=dialog]:visible').count();
    } else {
      // wait for the refund calculation, record it; type only into the reason text field (never tick the penalty waiver)
      for (let i = 0; i < 16 && !/Refund amount|Delete/i.test(await d.innerText()); i++) await page.waitForTimeout(500);
      o.dialogFull = scrub(await d.innerText()).replace(/\s+/g, ' ');
      o.checkboxes = await d.locator('input[type=checkbox]').evaluateAll(es => es.map(e => e.checked));
      const reason = d.locator('textarea:visible, input[type=text]:visible');
      if (await reason.count()) { await reason.first().fill('QA functional test – approved ' + ACTION.toLowerCase() + ' (19 Nov 2026)'); o.reason = true; }
      o.shotDialogFilled = await fsnap(shot, page, 'inquiry', `${tag}-dialog-before-confirm`);
      const yes = d.locator('button:visible').filter({ hasText: /^\s*(Yes.*|Confirm.*|Cancel Inquiry|Delete.*|Submit|OK)\s*$/i }).filter({ hasNotText: /^\s*(No|Close)\s*$/i });
      if ((await yes.count()) !== 1) throw new Error('confirm button count ' + await yes.count() + ' in ' + o.dialog.buttons.join('/'));
      o.confirmWith = (await yes.innerText()).trim(); await yes.click();
      o.toasts = await toasts(page, 8000); await settle(page, 3000);
    }
    o.net = ev.net; o.console = ev.cons.filter(x => !/AWS/.test(x));
    // ---- verification
    try { const r2 = await inqRow(page, INQ); o.rowAfter = r2.text; o.menuAfter = await menuOf(page, r2.row); o.shotRowAfter = await fsnap(shot, page, 'inquiry', `${tag}-row-after`); await closeMenu(page); }
    catch (e) { o.rowAfter = 'not listed: ' + String(e.message).slice(0, 80); o.shotRowAfter = await fsnap(shot, page, 'inquiry', `${tag}-list-after`); }
    const names = (await page.locator('tbody tr td:nth-child(2)').allInnerTexts()).map(x => x.trim()); o.qaListAfter = names;
    o.kpiAfter = await kpi(page);
    o.leadAfter = await leadView(page);
  } finally { all[tag] = o; save('cxl-del.json', all); }
  return o;
};
