import { home, panel, toggle } from './_local.mjs';
export default async ({ page, shot }) => {
  const out = {};
  await home(page);
  const p = panel(page);
  const dateIn = p.locator('input[value^="20"]').first();
  await dateIn.click(); await page.waitForTimeout(800);
  out.datePicker = await page.evaluate(() => {
    const pop = document.querySelector('.react-datepicker, .rdp, [class*="datepicker" i], [role=dialog]');
    if (!pop) return null;
    const days = [...pop.querySelectorAll('[class*="day" i]:not([class*="name" i]), [role=gridcell], td')].filter(d => /^\d+$/.test(d.innerText.trim()));
    return { cls: pop.className.toString().slice(0, 80), header: (pop.innerText || '').split('\n').slice(0, 3),
      disabled: days.filter(d => /disabled|outside/.test(d.className) || d.getAttribute('aria-disabled') === 'true').map(d => d.innerText.trim()).slice(0, 40),
      enabledCount: days.filter(d => !(/disabled/.test(d.className) || d.getAttribute('aria-disabled') === 'true')).length };
  });
  out.dateShot = await shot('local/picker-01-date');
  // can we type into the date field?
  await dateIn.fill('2020-01-01').catch(e => out.dateTypeErr = String(e).slice(0, 80));
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
  out.dateAfterPastType = await dateIn.inputValue();
  // time picker
  const timeIn = p.locator('input[value$="AM"], input[value$="PM"]').first();
  out.timeBefore = await timeIn.inputValue();
  await timeIn.click(); await page.waitForTimeout(800);
  out.timePicker = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.react-datepicker__time-list-item, [role=option], li')].filter(e => /\d{1,2}:\d{2}\s?(AM|PM)/i.test(e.innerText) && e.getBoundingClientRect().width);
    return { count: items.length, first: items.slice(0, 4).map(e => e.innerText.trim()), last: items.slice(-3).map(e => e.innerText.trim()),
      disabled: items.filter(e => /disabled/.test(e.className) || e.getAttribute('aria-disabled') === 'true').length,
      cls: items[0]?.className?.toString().slice(0, 60) };
  });
  out.timeShot = await shot('local/picker-02-time');
  await page.keyboard.press('Escape');
  // multi-day calendar
  await toggle(page, 'Multi-day Trip');
  out.multiday = await page.evaluate(() => {
    const sec = [...document.querySelectorAll('div')].find(d => /Select Travel Dates/.test(d.innerText) && d.querySelector('button'));
    const days = [...(sec?.querySelectorAll('button, td, [role=gridcell], div') || [])].filter(d => d.children.length === 0 && /^\d+$/.test(d.innerText.trim()));
    return { totalDays: days.length, disabled: days.filter(d => d.disabled || /disabled|past/.test(d.className)).map(d => d.innerText.trim()).slice(0, 15), sampleCls: days[15]?.className?.toString().slice(0, 80), tag: days[15]?.tagName };
  });
  return out;
};
