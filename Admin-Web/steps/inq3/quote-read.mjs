// Read-only quote checks on env INQ (default QRY-194): AW-INQ-004 View Quote, 014 dropdowns, 019 time fields, 018 Preview.
import { settle, scrub, fsnap, save, load, closeMenu, closeDialogs } from './_i.mjs';
import { openEdit, viewQuote, dialogText, costs, formDump } from './q.mjs';
const INQ = process.env.INQ || 'QRY-194';
export default async ({ page, shot }) => {
  const o = { inq: INQ }; const tag = INQ;
  try {
    // 004: View Quote from the list
    const vq = await viewQuote(page, INQ); o.viewQuote = vq;
    o.viewQuote.shot = await fsnap(shot, page, 'quote', `${tag}-view-quote`);
    await closeDialogs(page);
    // open the form via Edit
    const e = await openEdit(page, INQ); o.edit = e;
    const f = await formDump(page); o.form = Object.fromEntries(Object.entries(f.fields).map(([k, v]) => [k, v.v])); o.formText = f.text;
    o.costs = await costs(page);
    o.shotForm = await fsnap(shot, page, 'quote', `${tag}-update-quote-form`, { fullPage: true });
    // 014 dropdowns
    o.dd = {};
    for (const [key, sel] of [['Booking Type', 'main [role=combobox]:near(:text("Select Booking Type"))'], ['Month', 'main [role=combobox]:near(:text("Select Month"))']]) {
      const box = page.locator(sel).first();
      o.dd[key] = { value: (await box.innerText().catch(() => '')).trim() };
      await box.click().catch(() => {}); await page.waitForTimeout(900);
      o.dd[key].options = (await page.locator('.MuiMenu-root:visible [role=option], [role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim());
      await closeMenu(page);
    }
    const td = page.locator('main input[placeholder="Select or type a new description"]');
    await td.click(); await page.waitForTimeout(1200);
    o.dd['Trip Description'] = { value: await td.inputValue(), options: (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 15) };
    o.dd.shot = await fsnap(shot, page, 'quote', `${tag}-trip-description-options`);
    await page.keyboard.press('Escape'); await page.locator('h1:visible').first().click().catch(() => {}); await page.waitForTimeout(500);
    // 019 arrival/departure time fields
    const tf = page.locator('main input[placeholder^="HH"]');
    o.time = { count: await tf.count(), values: await tf.evaluateAll(es => es.map(e => ({ v: e.value, ro: e.readOnly, dis: e.disabled }))) };
    if (await tf.count()) { await tf.first().click({ force: false }).catch(err => { o.time.clickErr = String(err).slice(0, 120); }); await page.waitForTimeout(1000); o.time.pickerOpened = await page.locator('.react-datepicker:visible, .MuiPickersPopper-root:visible, [role=dialog]:visible, [role=listbox]:visible').count(); await page.keyboard.type('10').catch(() => {}); o.time.afterType = await tf.first().inputValue(); await page.keyboard.press('Escape'); }
    o.time.shot = await fsnap(shot, page, 'quote', `${tag}-time-fields`);
    // 018 Preview Quote Summary
    await page.locator('main button:visible').filter({ hasText: /^\s*Preview Quote Summary\s*$/ }).click(); await settle(page, 2000);
    o.preview = await dialogText(page); o.preview.shot = await fsnap(shot, page, 'quote', `${tag}-preview-quote-summary`);
    await closeDialogs(page);
  } finally { const all = (() => { try { return load('quote-read.json'); } catch { return {}; } })(); all[INQ] = o; save('quote-read.json', all); }
  return { viewQuote: o.viewQuote?.dialog, costs: o.costs, dd: o.dd, time: o.time, preview: o.preview, url: o.edit?.url };
};
