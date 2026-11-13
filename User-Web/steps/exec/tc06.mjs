// TC-06: validations, toggle transitions with data, then recovery to a valid CFG-3 search (LOC-021 Whitefield → Mangaluru),
// MPV's selection up to the confirmation step (never submitted), then results-page refresh / browser back behaviour.
import { home, panel, toggle, messages, place, state, snap, save, search, vehicleDetails, bookVehicle, setTime } from './runner.mjs';

export default async ({ page }) => {
  const id = 'TC-06'; const out = { id, started: new Date().toISOString(), checks: [] };
  const p = () => panel(page);
  const book = () => p().getByRole('button', { name: 'Book Now!' });
  const pax = () => p().locator('input[placeholder="Enter number of passengers"]');
  const hrs = () => p().locator('input[placeholder="Enter Number of Hours"]');
  const only = (process.env.ONLY || '').split(',').filter(Boolean);
  const check = async (name, fn) => { if (only.length && !only.some(o => name.startsWith(o + ' '))) return; const c = { name }; try { Object.assign(c, await fn()); } catch (e) { c.error = String(e).split('\n')[0].slice(0, 200); } out.checks.push(c); };

  await home(page);
  await check('V1 blank pickup submit (CFG-1)', async () => { await book().click(); await page.waitForTimeout(1200);
    return { url: page.url(), msgs: await messages(page), shot: await snap(page, 'TC-06-V1-blank-pickup') }; });
  await check('V2 DD ON, drop blank', async () => { await place(page, 'Search pickup location', 'Whitefield'); await toggle(page, 'Drop at different location');
    await book().click(); await page.waitForTimeout(1200); return { url: page.url(), msgs: await messages(page), shot: await snap(page, 'TC-06-V2-blank-drop') }; });
  await check('V3 drop same as pickup (Whitefield → Whitefield)', async () => { const d = await place(page, 'Search drop location', 'Whitefield');
    const st = await state(page); const shotForm = await snap(page, 'TC-06-V3-same-pickup-drop-form');
    await book().click(); await page.waitForTimeout(4000);
    const r = { drop: d.chosen, form: st, url: page.url(), msgs: await messages(page).catch(() => ({})), shots: [shotForm] };
    if (/send-inquiry/.test(page.url())) { r.summary = (await page.locator('text=/Distance:/').first().locator('xpath=../..').innerText()).replace(/\s+/g, ' '); r.shots.push(await snap(page, 'TC-06-V3-same-pickup-drop-results')); }
    return r; });
  await home(page);
  await check('V4 passengers invalid values', async () => { const res = {}; await home(page);
    await place(page, 'Search pickup location', 'Whitefield');
    for (const v of ['', '0', '-3', '999']) { await pax().fill(v); await pax().blur(); await book().click(); await page.waitForTimeout(900); if (/send-inquiry/.test(page.url())) { res[v === '' ? 'blank' : v + '_navigated'] = true; await home(page); await place(page, 'Search pickup location', 'Whitefield'); continue; } res[v === '' ? 'blank' : v] = { valueAfter: await pax().inputValue(), msgs: (await messages(page)).inline }; if (v === '') res.shotBlank = await snap(page, 'TC-06-V4-pax-blank'); }
    await pax().fill(''); await pax().pressSequentially('abc'); res.letters = { valueAfter: await pax().inputValue() };
    await pax().fill('1'); return res; });
  await check('V5 hours invalid values', async () => { const res = {}; await home(page); await place(page, 'Search pickup location', 'Whitefield');
    for (const v of ['0', '25', '', '1.5']) { await hrs().fill(v); await hrs().blur(); await book().click(); await page.waitForTimeout(900); if (/send-inquiry/.test(page.url())) { res[(v || 'blank') + '_navigated'] = true; await home(page); await place(page, 'Search pickup location', 'Whitefield'); continue; } res[v === '' ? 'blank' : v] = { valueAfter: await hrs().inputValue(), msgs: (await messages(page)).inline };
      if (v === '25') res.shot25 = await snap(page, 'TC-06-V5-hours-25'); if (v === '') res.shotBlank = await snap(page, 'TC-06-V5-hours-blank'); }
    await hrs().fill('1'); return res; });
  await check('V6 past date typed', async () => { await home(page); const di = p().locator('input[value^="20"]').first(); const before = await di.inputValue();
    await di.click(); await di.fill('2026-11-01'); await page.keyboard.press('Enter'); await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    const after = await di.inputValue(); await di.click(); await page.waitForTimeout(500); const shot = await snap(page, 'TC-06-V6-past-date-disabled'); await page.keyboard.press('Escape');
    return { before, typed: '2026-11-01', after, shot }; });
  await check('V7 toggle transitions with data entered', async () => {
    await home(page); await place(page, 'Search pickup location', 'Whitefield'); await pax().fill('3'); await hrs().fill('2');
    const s0 = await state(page);
    await toggle(page, 'Drop at different location'); await place(page, 'Search drop location', 'Mangaluru'); const s1 = await state(page);
    await toggle(page, 'Drop at different location'); const s2 = await state(page);
    await toggle(page, 'Drop at different location'); const s3 = await state(page); const shotDDback = await snap(page, 'TC-06-V7-dd-off-on-drop-retained');
    await toggle(page, 'Multi-day Trip'); const s4 = await state(page);
    const today = p().locator('.day-content').filter({ hasText: /^12$/ }).first(); await today.click(); await page.waitForTimeout(400); const s5 = await state(page);
    const shotMD = await snap(page, 'TC-06-V7-md-today-locked');
    await toggle(page, 'Multi-day Trip'); const s6 = await state(page);
    return { cfg1_filled: s0, dd_on_with_drop: s1, dd_off: s2, dd_on_again: s3, md_on: s4, md_click_today: s5, md_off: s6, shots: [shotDDback, shotMD] }; });
  // recovery: valid CFG-3 search with LOC-021, MPV's
  await check('R1 recovery: CFG-3 Whitefield → Mangaluru, today 2:00 PM, 3 pax, 2 hrs, MPV', async () => {
    await home(page); await toggle(page, 'Drop at different location');
    const pk = await place(page, 'Search pickup location', 'Whitefield'); const dr = await place(page, 'Search drop location', 'Mangaluru');
    await setTime(page, '2:00 PM'); await pax().fill('3'); await hrs().fill('2'); const form = await state(page); const formShot = await snap(page, 'TC-06-R1-form');
    const result = await search(page, 'TC-06-R1');
    const details = result.navigated ? await vehicleDetails(page, 'D MPV', 'TC-06-R1') : null;
    const booking = result.navigated ? await bookVehicle(page, 'D MPV', 'TC-06-R1') : null;
    return { pickup: pk.chosen, drop: dr.chosen, form, formShot, result, details, booking }; });
  await check('R2 results page refresh', async () => { await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
    const t = await page.locator('body').innerText(); return { url: page.url(), stillHasResults: /Buses Found/.test(t), summaryKept: /Mangaluru/.test(t), shot: await snap(page, 'TC-06-R2-after-refresh') }; });
  await check('R3 browser back to home form', async () => { await page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => {}); await page.waitForTimeout(4000);
    let st = null; try { st = await state(page); } catch {} return { url: page.url(), form: st, shot: await snap(page, 'TC-06-R3-after-back') }; });
  out.finished = new Date().toISOString(); save(only.length ? id + '-rerun-' + only.join('') : id, out);
  return out.checks.map(c => ({ name: c.name, err: c.error }));
};
