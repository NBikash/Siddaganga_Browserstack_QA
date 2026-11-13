// TC-04 supplementary (read-only, no submission): can a second vehicle be added for 50 passengers?
import { fillForm, search, snap, save } from './runner.mjs';
import { cardAction, guard } from '../_local.mjs';
export default async ({ page }) => {
  await guard(page); // blocking mode: nothing can be submitted here
  await fillForm(page, { md: true, dd: true, pickup: 'Jayanagar 4th Block', drop: 'Mysuru Palace', mdDates: [{ next: 1, d: 5 }, { next: 1, d: 6 }], time: '3:00 PM', pax: 50, hrs: 8 });
  await search(page, 'TC-04-multi');
  const out = {};
  await cardAction(page, 'L45V', 'Book This Vehicle'); await page.waitForTimeout(2500);
  out.popup1 = (await page.locator('.modal.show').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  await page.locator('.modal.show .btn-close, .modal.show [aria-label=Close], .modal.show button.close').first().click().catch(() => page.keyboard.press('Escape'));
  await page.waitForTimeout(1200);
  out.afterClose = await page.evaluate(() => {
    const sel = [...document.querySelectorAll('button')].filter(b => /Already Selected/.test(b.innerText || ''));
    const cards = sel.map(b => { let p = b; while (p && !/Starts From/.test(p.innerText || '')) p = p.parentElement; return (p?.innerText || '').replace(/\s+/g, ' ').slice(0, 140); });
    const qty = [...document.querySelectorAll('button, input[type=number], select')].filter(e => /^[+−-]$|qty|quantity|add/i.test((e.innerText || e.getAttribute('aria-label') || e.name || '').trim())).map(e => (e.innerText || e.getAttribute('aria-label') || e.name).trim()).slice(0, 10);
    const compare = document.querySelectorAll('input[type=checkbox]').length;
    return { alreadySelected: cards, qtyControls: qty, compareCheckboxes: compare };
  });
  out.shotAfterClose = await snap(page, 'TC-04-multi-after-close-popup');
  await cardAction(page, 'L9UB', 'Book This Vehicle'); await page.waitForTimeout(2500);
  out.popup2 = (await page.locator('.modal.show').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  out.shotPopup2 = await snap(page, 'TC-04-multi-second-vehicle-replaces-first');
  await page.keyboard.press('Escape');
  save('TC-04-supp-multivehicle', out);
  return out;
};
