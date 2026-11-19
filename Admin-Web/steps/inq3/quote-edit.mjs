// Approved edits on QRY-194 (UMNF499106). Stage via env STAGE=A|B|C|D|E. Every save is followed by reopen + reload.
import { settle, scrub, fsnap, toasts, save, load, evidence, closeDialogs } from './_i.mjs';
import { waitForm, formDump, costs, setNum, dialogText } from './q.mjs';
const URLP = '/dashboard/inquiry-management/update-inquiry/bea778b7-45c7-4e33-952e-628413f54388';
const BASE = 'https://dari-preprod.siddagangatravels.com';
const DESC = 'QA INQ functional test UMNF499106 (19 Nov 2026)';
const open = async page => { await page.goto(BASE + URLP, { waitUntil: 'domcontentloaded', timeout: 60000 }); await waitForm(page); };
const reopen = async page => { await open(page); await page.reload({ waitUntil: 'domcontentloaded' }); await waitForm(page); };
const desc = page => page.locator('main input[placeholder="Select or type a new description"]');
const times = page => page.locator('main input[placeholder^="HH"]').evaluateAll(es => es.map(e => e.value));
const gst = page => page.locator('main input[readonly]').filter({ hasNot: page.locator('xx') }).evaluateAll(es => es.map(e => e.value).filter(v => /%$/.test(v))[0]);
const snapState = async page => ({ desc: await desc(page).inputValue(), times: await times(page), gst: await gst(page), costs: await costs(page), applyFixed: await page.locator('main input[name="Apply fixed cost"], main input[type=checkbox]').evaluateAll(es => es.map(e => e.checked)) });
async function updateQuote(page) {
  const ev = evidence(page);
  const b = page.locator('main button:visible').filter({ hasText: /^\s*Update Quote\s*$/ });
  if ((await b.count()) !== 1) throw new Error('Update Quote count ' + await b.count());
  await b.click(); const t = await toasts(page, 8000); await settle(page, 3000);
  return { toasts: t, net: ev.net, console: ev.cons.filter(x => !/AWS/.test(x)) };
}
async function pickTime(page, idx, hh, mm, ap) {
  const f = page.locator('main input[placeholder^="HH"]').nth(idx);
  await f.click(); await page.waitForTimeout(900);
  const pop = page.locator('.MuiPaper-root:visible').filter({ hasText: /Hour/ }).filter({ hasText: /Min/ }).last();
  if (!(await pop.count())) throw new Error('time picker not open');
  const cols = pop.locator(':scope > div');
  const vals = [hh, mm, ap];
  for (let c = 0; c < 3; c++) {
    // hour and minute in their own columns; AM/PM text is unique in the picker
    const scope = c < 2 ? cols.nth(c) : pop;
    const it = scope.getByText(vals[c], { exact: true });
    if ((await it.count()) !== 1) throw new Error(`time item ${vals[c]} count ${await it.count()} in column ${c}: ${(await pop.innerText()).replace(/\s+/g, ' ').slice(-80)}`);
    await it.click(); await page.waitForTimeout(400);
  }
  await page.locator('h1:visible').first().click().catch(() => {}); await page.waitForTimeout(600);
  return f.inputValue();
}
export default async ({ page, shot }) => {
  const st = process.env.STAGE; const o = { stage: st };
  const all = (() => { try { return load('quote-edit.json'); } catch { return {}; } })();
  try {
    await open(page); o.before = await snapState(page);
    o.shotBefore = await fsnap(shot, page, 'quote', `EDIT-${st}-before`, { fullPage: true });
    if (st === 'A') { // 005 trip description + 019 times
      await desc(page).click(); await desc(page).fill(DESC); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
      o.descTyped = await desc(page).inputValue();
      o.arr = await pickTime(page, 0, '09', '00', 'AM'); o.dep = await pickTime(page, 1, '08', '00', 'PM');
      o.shotEdited = await fsnap(shot, page, 'quote', 'EDIT-A-edited-before-save', { fullPage: true });
      o.save = await updateQuote(page);
    }
    if (st === 'B') { // 013 GST change and revert (not saved)
      const ch = page.locator('main button:visible').filter({ hasText: /^\s*Change\s*$/ });
      await ch.click(); o.dlg1 = await dialogText(page);
      // GST Value is a select (combobox) inside the dialog
      const pickGst = async label => {
        const d = page.locator('[role=dialog]:visible').last();
        await d.locator('[role=combobox]').click(); await page.waitForTimeout(800);
        const opt = page.locator('[role=listbox]:visible [role=option]');
        const options = (await opt.allInnerTexts()).map(x => x.trim());
        const target = label || options.find(x => x !== '5%' && /%/.test(x));
        await opt.filter({ hasText: new RegExp('^\\s*' + target.replace('%', '\\%') + '\\s*$') }).first().click(); await page.waitForTimeout(600);
        return { options, target, shown: (await d.locator('[role=combobox]').innerText()).trim(), d };
      };
      const p1 = await pickGst(); o.gstOptions = p1.options; o.gstChosen = p1.target;
      o.shotDlg = await fsnap(shot, page, 'quote', 'EDIT-B-gst-dialog-changed');
      await p1.d.locator('button:visible').filter({ hasText: /^\s*Save\s*$/ }).click(); await page.waitForTimeout(1500);
      o.afterChange = await snapState(page); o.shotChanged = await fsnap(shot, page, 'quote', 'EDIT-B-gst-changed-applied', { fullPage: true });
      await ch.click(); await page.waitForTimeout(800);
      const p2 = await pickGst('5%');
      await p2.d.locator('button:visible').filter({ hasText: /^\s*Save\s*$/ }).click(); await page.waitForTimeout(1500);
      o.afterRevert = await snapState(page);
    }
    if (st === 'C') { // 011 recalculation + 017 persistence
      await setNum(page, 'extraKms', 50); o.liveAfterExtraKm = await costs(page);
      await setNum(page, 'toll', 500); await setNum(page, 'extra', 250); o.live = await costs(page);
      o.expected = 34200 + 50 * 52 + 500 + 250;
      o.shotEdited = await fsnap(shot, page, 'quote', 'EDIT-C-costs-changed-before-save', { fullPage: true });
      o.save = await updateQuote(page);
    }
    if (st === 'D') { // 012 apply final quote / fixed cost
      const fc = page.locator('main input[name=fixedCost]');
      o.fixedDisabledBefore = await fc.isDisabled();
      const cb = page.locator('main input[type=checkbox]:is([aria-label="Apply fixed cost"],[placeholder="Apply fixed cost"],[name="Apply fixed cost"])');
      await cb.check(); await page.waitForTimeout(700); o.fixedDisabledAfterTick = await fc.isDisabled();
      await setNum(page, 'fixedCost', 36000); o.live = await costs(page);
      o.shotEdited = await fsnap(shot, page, 'quote', 'EDIT-D-fixed-cost-before-save', { fullPage: true });
      o.save = await updateQuote(page);
    }
    if (st === 'E') { // restore original costs (description and corrected times are kept)
      const cb = page.locator('main input[type=checkbox]:is([aria-label="Apply fixed cost"],[placeholder="Apply fixed cost"],[name="Apply fixed cost"])');
      if (await cb.isChecked()) { await setNum(page, 'fixedCost', 0); await cb.uncheck(); await page.waitForTimeout(600); }
      for (const n of ['extraKms', 'toll', 'extra']) await setNum(page, n, 0);
      o.live = await costs(page); o.save = await updateQuote(page);
    }
    if (st !== 'B') { await reopen(page); o.after = await snapState(page); o.shotAfter = await fsnap(shot, page, 'quote', `EDIT-${st}-after-reopen-refresh`, { fullPage: true }); }
    else { await reopen(page); o.afterReload = await snapState(page); }
  } finally { all[st] = o; save('quote-edit.json', all); }
  return o;
};
