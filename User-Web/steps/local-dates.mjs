import { home, panel, toggle, messages } from './_local.mjs';
export default async ({ page, shot }) => {
  const out = {};
  await home(page);
  const p = panel(page);
  // booking window (single date): click next month until it stops / all disabled
  await p.locator('input[value^="20"]').first().click(); await page.waitForTimeout(600);
  const months = [];
  for (let i = 0; i < 26; i++) {
    const info = await page.evaluate(() => {
      const dp = document.querySelector('.react-datepicker');
      const days = [...dp.querySelectorAll('.react-datepicker__day:not(.react-datepicker__day--outside-month)')];
      return { m: dp.querySelector('.react-datepicker__current-month')?.innerText, en: days.filter(d => !d.classList.contains('react-datepicker__day--disabled')).length,
        next: !!dp.querySelector('.react-datepicker__navigation--next') };
    });
    months.push(`${info.m}:${info.en}`);
    if (!info.next) break;
    await page.locator('.react-datepicker__navigation--next').click(); await page.waitForTimeout(250);
  }
  out.window = months;
  await page.keyboard.press('Escape');
  // multi-day: select dates
  await home(page);
  await toggle(page, 'Multi-day Trip');
  const sec = p.locator('div').filter({ hasText: /^Select Travel Dates/ }).first();
  const day = n => p.locator('.day-content').filter({ hasText: new RegExp(`^${n}$`) });
  const chips = async () => (await p.locator('text=/Selected Dates/').first().locator('xpath=..').innerText().catch(() => '')).replace(/\s+/g, ' ');
  out.md0 = await chips();
  // try a past day (10) and today's toggling
  await day(10).first().click().catch(() => {}); await page.waitForTimeout(300); out.mdPastClick = await chips();
  await day(12).first().click(); await page.waitForTimeout(300); out.mdTodayToggle = await chips();
  out.mdZeroSubmit = await (async () => { await p.getByRole('button', { name: 'Book Now!' }).click(); await page.waitForTimeout(800); return messages(page); })();
  for (const n of [20, 22, 25]) { await day(n).first().click(); await page.waitForTimeout(300); }
  out.md3 = await chips();
  await day(22).first().click(); await page.waitForTimeout(300); out.mdDeselect22 = await chips();
  // next month & multi-month span
  await p.getByRole('button', { name: 'Next Month' }).click(); await page.waitForTimeout(500);
  await day(3).first().click(); await page.waitForTimeout(300); out.mdCrossMonth = await chips();
  // remove chip via ×
  const x = p.locator('text=/Selected Dates/').first().locator('xpath=..').locator('button, span').filter({ hasText: '×' }).first();
  await x.click().catch(() => {}); await page.waitForTimeout(300); out.mdChipRemove = await chips();
  // how many months forward in multi-day
  let k = 0; while (k < 26 && await p.getByRole('button', { name: 'Next Month' }).isVisible().catch(() => false)) { await p.getByRole('button', { name: 'Next Month' }).click(); await page.waitForTimeout(200); k++; }
  out.mdMonthsForward = k + 1;
  out.mdLastMonth = (await sec.innerText().catch(() => '')).split('\n').find(s => /20\d\d/.test(s));
  out.shot = await shot('local/md-01-dates');
  return out;
};
