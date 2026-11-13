// Plan items attached to existing cases: TC-04 Modify Inquiry round trip + multiple-vehicle check, TC-05 results filters,
// TC-01 Request Custom Quote (view only, never submitted). Read-only; booking/inquiry/draft API calls remain blocked.
import fs from 'node:fs';
import path from 'node:path';
import { fillForm, search, snap, state, RUN } from './runner.mjs';
import { panel } from '../_local.mjs';

const norm = s => (s || '').replace(/\s+/g, ' ').trim();
async function count(page) { await page.waitForTimeout(2500); return norm(await page.locator('text=/Buses Found|No .*found/i').first().innerText().catch(() => '')); }

export default async ({ page }) => {
  const out = {};
  // ---- TC-04: Modify Inquiry round trip and multiple-vehicle option
  try {
    await fillForm(page, { md: true, dd: true, pickup: 'Jayanagar 4th Block', drop: 'Mysuru Palace', mdDates: [{ next: 1, d: 5 }, { next: 1, d: 6 }], time: '1:30 PM', pax: 50, hrs: 8 });
    const r = await search(page, 'TC-04-modify-before');
    const multi = await page.evaluate(() => [...document.querySelectorAll('button, a, label, span')].map(e => (e.innerText || '').trim()).filter(t => /multiple|add (another|more)|quantity|\+ ?vehicle|combine/i.test(t)).slice(0, 10));
    await page.evaluate(() => [...document.querySelectorAll('button, a')].find(b => (b.innerText || '').trim() === 'Modify Inquiry' && b.getClientRects().length)?.click()); await page.waitForTimeout(3500);
    let st = null; try { st = await state(page); } catch {}
    out.tc04 = { before: { found: r.found, summary: r.summary }, multipleVehicleControls: multi, afterModify: { url: page.url(), form: st, shot: await snap(page, 'TC-04-modify-inquiry-form') } };
  } catch (e) { out.tc04 = { error: String(e).split('\n')[0] }; }
  // ---- TC-05: filters on the Belagavi results
  try {
    await fillForm(page, { dd: true, pickup: 'Yeshwanthpur', drop: 'Belagavi', date: '2028-11-15', time: '9:00 AM', pax: 22, hrs: 1 });
    await search(page, 'TC-05-filters-base');
    const f = {}; f.base = await count(page);
    const click = async t => { await page.getByText(t, { exact: true }).first().click(); };
    await click('Premium'); f.premium = await count(page); f.shotPremium = await snap(page, 'TC-05-filter-premium');
    await click('Premium'); await click('Volvo Bus India'); f.volvo = await count(page);
    await page.getByText('Clear Preferences', { exact: true }).first().click().catch(() => {}); f.afterClear = await count(page);
    await page.getByText('Brand New', { exact: true }).first().click().catch(() => {}); f.brandNew = await count(page); f.shotBrandNew = await snap(page, 'TC-05-filter-brand-new');
    await page.getByText('Show Advanced Filters', { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(1000);
    f.advanced = norm(await page.locator('text=/Hide Filters/').first().locator('xpath=../..').innerText().catch(() => '')).slice(0, 600); f.shotAdvanced = await snap(page, 'TC-05-filter-advanced');
    out.tc05 = f;
  } catch (e) { out.tc05 = { error: String(e).split('\n')[0] }; }
  // ---- TC-01: Request Custom Quote (view only)
  try {
    await fillForm(page, { pickup: 'Whitefield', date: '2026-11-12', time: '1:30 PM', pax: 1, hrs: 1 });
    await search(page, 'TC-01-custom-quote-base');
    await page.evaluate(() => { const b = [...document.querySelectorAll('button, a')].find(e => (e.innerText || '').trim() === 'Request Custom Quote' && e.getClientRects().length); b?.scrollIntoView({ block: 'center' }); b?.click(); }); await page.waitForTimeout(2500);
    const m = page.locator('.modal.show').first();
    const has = await m.count();
    out.tc01quote = { opened: !!has, url: page.url(), text: has ? norm(await m.innerText()).replace(/(?:\+?91[\s-]?)?[6-9]\d{4}\s?\d{5}/g, '<phone>').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').slice(0, 700) : null,
      buttons: has ? (await m.locator('button').allInnerTexts()).map(norm).filter(Boolean) : [], shot: await snap(page, 'TC-01-request-custom-quote') };
    if (has) await page.keyboard.press('Escape');
  } catch (e) { out.tc01quote = { error: String(e).split('\n')[0] }; }
  fs.writeFileSync(path.resolve('results', RUN, process.env.EXTRAS_OUT || 'extras.json'), JSON.stringify(out, null, 2));
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.error || 'ok']));
};
