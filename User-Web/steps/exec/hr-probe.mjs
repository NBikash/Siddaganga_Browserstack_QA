// Read-only probe of the Transfer → By Hour form (toggles, multi-day date selection, drop field). Network guard on.
import * as L from './ot-lib.mjs';
const ctl = page => L.active(page).evaluate(root => [...root.querySelectorAll('input,button,label,[class*=chip],[class*=date]')]
  .filter(e => e.getBoundingClientRect().width).map(e => `${e.tagName}${e.type ? ':' + e.type : ''} ph=${e.placeholder || ''} v=${(e.value || '').slice(0, 30)} t=${(e.innerText || '').trim().slice(0, 40)} c=${String(e.className).slice(0, 50)}`));
export default async ({ page }) => {
  await L.guard(page);
  await L.home(page, 'Transfer');
  await page.locator('#home-transfer-tabs-tab-hour').evaluate(e => e.click()); await page.waitForTimeout(1200);
  const base = await ctl(page); const s0 = await L.snap(page, 'PROBE-hr-form');
  const hrs = await L.active(page).locator('input[placeholder="Enter Number of Hours"]:visible').evaluate(e => ({ min: e.min, max: e.max, v: e.value, type: e.type }));
  const pax = await L.active(page).locator('input[placeholder="Enter number of passengers"]:visible').evaluate(e => ({ min: e.min, max: e.max, v: e.value }));
  await L.setToggle(page, 'Drop at different location', true); const dd = await ctl(page);
  await L.setToggle(page, 'Multi-day Trip', true); await page.waitForTimeout(800); const md = await ctl(page); const s1 = await L.snap(page, 'PROBE-hr-md-dd');
  // open the multi-day date control
  const dateInp = L.active(page).locator('input[value^="20"]:visible, input[placeholder*="date" i]:visible').first();
  await dateInp.click().catch(() => {}); await page.waitForTimeout(800);
  const picker = await page.evaluate(() => { const p = document.querySelector('.react-datepicker'); return p ? { month: p.querySelector('.react-datepicker__current-month')?.innerText, multi: p.className, sel: [...p.querySelectorAll('.react-datepicker__day--selected,.react-datepicker__day--highlighted')].map(d => d.innerText) } : null; });
  const s2 = await L.snap(page, 'PROBE-hr-md-picker');
  await page.keyboard.press('Escape');
  return { base, hrs, pax, dd, md, picker, shots: [s0, s1, s2] };
};
