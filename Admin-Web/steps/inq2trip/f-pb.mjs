// Pre-Bookings read checks: KPI cards, search/filters, row values, View Booking, + Add New Booking (inspect only).
import { go, settle, scrub, fsnap, rowIndex, kebab } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 700));
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/booking-management/total-booking'); await page.waitForTimeout(1500);
  o.cards = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 160); P('cards', o.cards);
  const s = page.locator('input[placeholder*="Search Booking" i]').first();
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  o.base = await showing();
  await s.type('B-944', { delay: 50 }); await page.waitForTimeout(4000);
  let h = await rowIndex(page, 'B-944');
  o.pb03 = { search: { rows: h.length, showing: await showing() } };
  if (h.length === 1) o.row = scrub(await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ');
  o.shotRow = await fsnap(shot, page, 'prebooking', 'PB-03-search-B-944');
  P('row', o.row);
  // filters: client autocomplete, vehicle select, date range
  const cl = page.locator('input[placeholder="Search client by name or mobile"]');
  await s.fill(''); await page.waitForTimeout(2500);
  if (await cl.count()) { await cl.type('Bikash', { delay: 50 }); await page.waitForTimeout(1800); const opts = page.locator('[role=listbox]:visible [role=option]'); o.pb03.clientOptions = await opts.count(); if (await opts.count()) { await opts.first().click(); await page.waitForTimeout(3000); o.pb03.clientFiltered = { showing: await showing(), clients: [...new Set((await page.locator('tbody tr').allInnerTexts()).map(r => r.split('\t')[2] || r.split(/\s+/).slice(2, 4).join(' ')))] }; } }
  const veh = page.locator('main [role=combobox]:visible').filter({ hasText: /Select Vehicle/ }).first();
  const vehIn = page.locator('input[placeholder="Select Vehicle"]');
  const vtarget = (await veh.count()) ? veh : vehIn;
  if (await vtarget.count()) { await vtarget.click(); await page.waitForTimeout(1200); o.pb03.vehicleOptions = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).map(x => x.trim()).slice(0, 30); await page.keyboard.press('Escape'); }
  const dr = page.locator('input[placeholder="Trip Date Range"]');
  if (await dr.count()) { await dr.click(); await page.waitForTimeout(1000); o.pb03.datePicker = await page.locator('.react-datepicker:visible, .MuiPickersPopper-root:visible, .rdrCalendarWrapper:visible, [role=dialog]:visible').count(); o.shotDate = await fsnap(shot, page, 'prebooking', 'PB-03-date-range'); await page.keyboard.press('Escape'); }
  await page.locator('main button:visible').filter({ hasText: /Reset\s*Filter/ }).first().click(); await page.waitForTimeout(3000); o.pb03.afterReset = await showing();
  P('pb03', o.pb03);
  // View Booking
  await s.fill(''); await s.type('B-944', { delay: 50 }); await page.waitForTimeout(4000);
  h = await rowIndex(page, 'B-944');
  const k = await kebab(page, h[0], 'View Booking'); o.menu = k.menu; await settle(page, 3000);
  const d = page.locator('[role=dialog]:visible').last();
  o.pb04 = { url: page.url().replace(/\?.*/, ''), dialog: await d.count() };
  const root = (await d.count()) ? d : page.locator('main');
  o.pb04.text = scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 2200);
  o.pb04.shot = await fsnap(shot, page, 'prebooking', 'PB-04-view-booking', { fullPage: !(await d.count()) });
  P('pb04', o.pb04);
  if (await d.count()) await page.keyboard.press('Escape'); else await page.goBack();
  await settle(page, 2000);
  // + Add New Booking (inspect only)
  await go(page, '/dashboard/booking-management/total-booking');
  await page.locator('main button:visible').filter({ hasText: /\+\s*Add New\s*Booking/ }).first().click(); await settle(page, 3000);
  o.pb08 = { url: page.url().replace(/\?.*/, ''), buttons: (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 12) };
  o.pb08.shot = await fsnap(shot, page, 'prebooking', 'PB-08-add-new-booking', { fullPage: true });
  P('pb08', o.pb08);
  await go(page, '/dashboard/booking-management/total-booking');
  return o;
};
