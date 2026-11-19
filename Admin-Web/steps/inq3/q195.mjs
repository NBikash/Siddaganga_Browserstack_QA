// Approved edits on QRY-195 (NCCC102640). STAGE=CAL: AW-INQ-015 range 11–13 Jan → Save Assignment; reload.
//                                          STAGE=JRN: AW-INQ-038 + Add New Journey → Add information → Update → Update Quote; reopen.
import { settle, scrub, fsnap, toasts, save, load, evidence, closeDialogs } from './_i.mjs';
import { openEdit, costs, dialogText, waitForm } from './q.mjs';
const BASE = 'https://dari-preprod.siddagangatravels.com';
const mainText = async page => scrub(await page.locator('main').innerText()).replace(/\s+/g, ' ');
const tripsOf = t => ({ trips: t.match(/Trip-\d+/g) || [], journeys: t.match(/Journey [A-Z]: \w+/g) || [], dateLines: t.match(/\d{2}\/\d{2}\/\d{4}(, \d{2}\/\d{2}\/\d{4})*( - \d{2}\/\d{2}\/\d{4})?/g) || [] });
const hl = page => page.evaluate(() => [...document.querySelectorAll('main *')].filter(e => e.childElementCount === 0 && /^\d{1,2}$/.test(e.textContent.trim()) && getComputedStyle(e).backgroundColor === 'rgb(169, 117, 5)').map(e => e.textContent.trim()));
export default async ({ page, shot }) => {
  const st = process.env.STAGE; const o = { stage: st };
  const all = (() => { try { return load('q195.json'); } catch { return {}; } })();
  try {
    // QRY-195 form (URL recorded via row menu → Edit in inspect-195.json); the list lookup is flaky on page 2
    o.url = '/dashboard/inquiry-management/update-inquiry/48f3a9cd-513a-44b4-bc82-5d33e3659ce6';
    await page.goto(BASE + o.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await waitForm(page);
    if (!/11\/01\/2027/.test(await page.locator('main').innerText())) throw new Error('not the QRY-195 form');
    o.before = { ...tripsOf(await mainText(page)), highlighted: await hl(page), costs: await costs(page) };
    o.shotBefore = await fsnap(shot, page, 'quote', `Q195-${st}-before`, { fullPage: true });
    const ev = evidence(page);
    if (st === 'CAL') {
      await page.locator('main button:visible').filter({ hasText: /^\s*Range\s+Selection\s*$/ }).click(); await page.waitForTimeout(700);
      const day = n => page.locator('main [role=listbox] *, main [role=grid] *, main *').filter({ hasText: new RegExp('^\\s*' + n + '\\s*$') }).locator('visible=true');
      // calendar cells of January 2027 (11 and 13 inside the current month grid)
      const cells = page.locator('main [role=option], main [role=gridcell], main button').filter({ hasText: /^\s*\d{1,2}\s*$/ });
      o.cellCount = await cells.count();
      const pick = async n => { const c = cells.filter({ hasText: new RegExp('^\\s*' + n + '\\s*$') }); const k = await c.count(); if (!k) throw new Error('day ' + n + ' not found'); await c.nth(k > 1 ? 1 : 0).click(); await page.waitForTimeout(500); };
      await pick(11); await pick(13);
      o.afterPick = await hl(page);
      o.shotPicked = await fsnap(shot, page, 'quote', 'Q195-CAL-range-picked', { fullPage: true });
      await page.locator('main button:visible').filter({ hasText: /^\s*Save Assignment\s*$/ }).click();
      o.toasts = await toasts(page, 8000); await settle(page, 2500);
      o.afterSave = { ...tripsOf(await mainText(page)), highlighted: await hl(page) };
      o.shotSaved = await fsnap(shot, page, 'quote', 'Q195-CAL-after-save-assignment', { fullPage: true });
      if (process.env.SAVEQ) { // persist the assignment with the quote
        o.costsBeforeQuote = await costs(page);
        await page.locator('main button:visible').filter({ hasText: /^\s*Update Quote\s*$/ }).click();
        o.toastsQuote = await toasts(page, 8000); await settle(page, 3000);
      }
    }
    if (st === 'JRN') {
      await page.locator('main button:visible').filter({ hasText: /^\s*\+ Add New Journey\s*$/ }).click(); await settle(page, 1500);
      await page.locator('main button:visible').filter({ hasText: /^\s*Add information\s*$/ }).last().click(); await settle(page, 1500);
      const d = page.locator('[role=dialog]:visible').last();
      o.formBefore = await d.locator('input:visible').evaluateAll(es => es.map(e => (e.name || e.placeholder || '?') + '=' + e.value));
      // destinations: Google Places autocomplete (pickup and drop of the same trip)
      const dest = d.locator('input:visible').nth(2);
      for (const place of ['Koramangala', 'Hassan']) {
        await dest.click(); await dest.fill(place); await page.waitForTimeout(2500);
        const opt = page.locator('.MuiAutocomplete-popper:visible li.MuiAutocomplete-option').first();
        if (!(await opt.count())) throw new Error('no destination suggestion for ' + place);
        o['dest_' + place] = scrub(await opt.innerText()).replace(/\s+/g, ' ');
        await opt.click(); await page.waitForTimeout(1200);
      }
      const veh = d.locator('input[placeholder="Search or select vehicle"]');
      await veh.click(); await veh.fill('Tempo'); await page.waitForTimeout(2000);
      const vopts = page.locator('.MuiAutocomplete-popper:visible li.MuiAutocomplete-option');
      o.vehicleOptions = (await vopts.allInnerTexts()).map(x => x.trim()).slice(0, 10);
      const v = vopts.filter({ hasText: /17 Seater|Tempo Traveller/ }).first();
      if (!(await v.count())) throw new Error('no Tempo Traveller option: ' + o.vehicleOptions.join('|'));
      o.vehicle = (await v.innerText()).trim(); await v.click(); await page.waitForTimeout(1200);
      o.formFilled = scrub(await d.innerText()).replace(/\s+/g, ' ').slice(0, 1200);
      o.shotForm = await fsnap(shot, page, 'quote', 'Q195-JRN-journey-form-filled', { fullPage: true });
      await d.locator('button:visible').filter({ hasText: /^\s*Update\s*$/ }).click();
      o.toastsUpdate = await toasts(page, 6000); await settle(page, 2500);
      o.afterJourney = { ...tripsOf(await mainText(page)), costs: await costs(page), text: (await mainText(page)).match(/Trip-2.{0,900}/)?.[0] };
      o.shotAdded = await fsnap(shot, page, 'quote', 'Q195-JRN-after-update-journey', { fullPage: true });
      const b = page.locator('main button:visible').filter({ hasText: /^\s*Update Quote\s*$/ });
      await b.click(); o.toastsQuote = await toasts(page, 8000); await settle(page, 3000);
    }
    o.net = ev.net; o.console = ev.cons.filter(x => !/AWS/.test(x));
    await page.goto(BASE + o.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.reload({ waitUntil: 'domcontentloaded' }); await waitForm(page);
    const t = await mainText(page);
    o.afterReopen = { ...tripsOf(t), highlighted: await hl(page), costs: await costs(page), trip2: t.match(/Trip-2.{0,900}/)?.[0] };
    o.shotAfter = await fsnap(shot, page, 'quote', `Q195-${st}-after-reopen-refresh`, { fullPage: true });
    if (st === 'JRN') {
      await page.locator('main button:visible').filter({ hasText: /^\s*Preview Quote Summary\s*$/ }).click(); await settle(page, 2000);
      o.preview = await dialogText(page); o.shotPreview = await fsnap(shot, page, 'quote', 'Q195-JRN-preview'); await closeDialogs(page);
    }
  } finally { all[st] = o; save('q195.json', all); }
  return o;
};
