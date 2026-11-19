// Read-only: toggle-dependent fields (Outstation Multi-day / Drop at different location / Add destination;
// Transfer Add Return; By Hour form incl. its toggles) and picker limits.
import { openTab, describe, active, clickText } from './_ot.mjs';

const pickers = async (page) => {
  const p = active(page);
  const out = {};
  const dateIn = p.locator('input[value^="20"]:visible').first();
  if (await dateIn.count()) {
    await dateIn.click(); await page.waitForTimeout(700);
    out.date = await page.evaluate(() => {
      const pop = document.querySelector('.react-datepicker'); if (!pop) return null;
      const days = [...pop.querySelectorAll('.react-datepicker__day')];
      return { month: pop.querySelector('.react-datepicker__current-month')?.innerText,
        disabled: days.filter(d => d.className.includes('disabled')).map(d => d.innerText).slice(0, 31).join(','), total: days.length };
    });
    await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  }
  const timeIn = p.locator('input[value$="AM"]:visible, input[value$="PM"]:visible').first();
  if (await timeIn.count()) {
    await timeIn.click(); await page.waitForTimeout(700);
    out.time = await page.evaluate(() => {
      const items = [...document.querySelectorAll('.react-datepicker__time-list-item')].filter(e => e.getBoundingClientRect().width);
      return { count: items.length, first: items.slice(0, 3).map(e => e.innerText), last: items.slice(-2).map(e => e.innerText),
        disabled: items.filter(e => e.className.includes('disabled')).length };
    });
    await page.keyboard.press('Escape');
  }
  return out;
};

export default async ({ page, shot }) => {
  const out = {};
  // Outstation toggles
  await openTab(page, 'Outstation');
  out.outPickers = await pickers(page);
  await clickText(page, 'Multi-day Trip', active(page));
  out.outMultiday = await describe(page);
  out.s1 = await shot('validation-ot/03-outstation-multiday');
  await clickText(page, 'Multi-day Trip', active(page));
  await clickText(page, 'Drop at different location', active(page));
  out.outDiffDrop = await describe(page);
  for (let i = 0; i < 2; i++) {
    const b = active(page).locator('button').filter({ hasText: /Add Another Destination/i }).first();
    out['addBtn' + i] = { count: await b.count(), visible: await b.isVisible().catch(() => false), disabled: await b.isDisabled().catch(() => null) };
    if (out['addBtn' + i].visible) { await b.click({ timeout: 5000 }).catch(e => out['addErr' + i] = String(e).slice(0, 120)); await page.waitForTimeout(700); }
  }
  out.outAddDest = (await describe(page)).items.filter(i => /Destination|Drop/i.test(i.label + i.text + (i.ph || '')));
  out.s2 = await shot('validation-ot/04-outstation-diffdrop-2dest');
  // Transfer P2P + Add Return
  await openTab(page, 'Transfer');
  out.p2pPickers = await pickers(page);
  await clickText(page, 'Add Return', active(page));
  out.p2pReturn = await describe(page);
  out.s3 = await shot('validation-ot/05-transfer-add-return');
  // By Hour
  await openTab(page, 'Transfer');
  await clickText(page, 'By Hour', active(page));
  out.byHour = await describe(page);
  out.s4 = await shot('validation-ot/06-transfer-by-hour');
  out.hourPickers = await pickers(page);
  for (const t of ['Multi-day Trip', 'Drop at different location']) {
    const has = await active(page).getByText(t, { exact: true }).count();
    if (has) { await clickText(page, t, active(page)); out['byHour_' + t] = (await describe(page)).text; }
  }
  out.s5 = await shot('validation-ot/07-by-hour-toggles-on');
  return out;
};
