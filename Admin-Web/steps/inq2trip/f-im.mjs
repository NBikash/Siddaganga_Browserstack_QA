import { go, settle, scrub, fsnap, rowIndex, kebab } from './_func.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 600));
export default async ({ page, shot }) => {
  const o = {};
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  o.im02 = { cards: (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/Total Inquiries.{0,140}/)?.[0] }; P('im02', o.im02);
  o.im02.shot = await fsnap(shot, page, 'inquiry', 'IM-02-kpi-cards');
  const s = page.locator('input[placeholder*="Search Inquiry" i]').first();
  const showing = async () => (await page.locator('text=/Showing .* entries/').allInnerTexts())[0];
  o.im01 = { base: await showing() };
  for (const q of ['QRY-944', '944', 'Bikash', 'zzzz']) { await s.fill(''); await s.fill(q); await settle(page, 2200); o.im01[q] = { showing: await showing(), first: scrub((await page.locator('tbody tr').first().innerText()).replace(/\s+/g, ' ')).slice(0, 80) }; }
  await s.fill(''); await settle(page, 1500);
  // start-date filter + client filter
  const sd = page.locator('input[placeholder="Select Start Date"]');
  await sd.click(); await page.waitForTimeout(900);
  o.im01.datePicker = await page.locator('.react-datepicker:visible, .MuiPickersPopper-root:visible, [role=dialog]:visible').count();
  o.im01.shotDate = await fsnap(shot, page, 'inquiry', 'IM-01-start-date-filter');
  const day20 = page.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').filter({ hasText: /^20$/ });
  if (await day20.count()) { await day20.first().click(); await settle(page, 2500); o.im01.date20 = { showing: await showing(), dates: [...new Set((await page.locator('tbody tr').allInnerTexts()).map(r => r.match(/\d{2}\/\d{2}\/\d{4}/)?.[0]))] }; }
  await page.keyboard.press('Escape');
  const cl = page.locator('input[placeholder="Select client by name or mobile"]');
  if (await cl.count()) { await cl.fill('Bikash'); await page.waitForTimeout(1500); o.im01.clientOptions = (await page.locator('[role=listbox]:visible [role=option]').allInnerTexts()).length; await page.keyboard.press('Escape'); }
  await page.locator('button:visible:text-is("Reset Filter")').click(); await settle(page, 2500); o.im01.afterReset = await showing();
  P('im01', o.im01);
  // IM-05 Edit -> where it goes (no save)
  await s.fill('944'); await settle(page, 2500);
  const h = await rowIndex(page, 'QRY-944');
  o.im03 = { row: scrub((await page.locator('tbody tr').nth(h[0]).innerText()).replace(/\s+/g, ' ')) };
  const k = await kebab(page, h[0], 'Edit'); await settle(page, 3000);
  o.im05 = { menu: k.menu, url: page.url().replace(/\?.*/, ''), title: (await page.locator('main h1, main h2, main h3, main h4').allInnerTexts()).slice(0, 3), desc: await page.locator('main input[placeholder="Select or type a new description"]').inputValue().catch(() => null), pax: await page.locator('input[name=pax]').inputValue().catch(() => null), total: await page.locator('input[name=totalApproxCost]').inputValue().catch(() => null) };
  o.im05.shot = await fsnap(shot, page, 'inquiry', 'IM-05-edit-opens');
  P('im05', o.im05);
  // IM-06 + Add inquiry: inspect only
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  await page.locator('button:visible:text-is("+ Add inquiry")').click(); await settle(page, 3000);
  o.im06 = { url: page.url().replace(/\?.*/, ''), title: (await page.locator('main h1, main h2, main h3, main h4').allInnerTexts()).slice(0, 4), buttons: (await page.locator('main button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 15), required: await page.locator('main input[required]:visible, main [aria-required=true]:visible').count() };
  o.im06.shot = await fsnap(shot, page, 'inquiry', 'IM-06-add-inquiry-form', { fullPage: true });
  P('im06', o.im06);
  await go(page, '/dashboard/inquiry-management/total-inquiries');
  return o;
};
