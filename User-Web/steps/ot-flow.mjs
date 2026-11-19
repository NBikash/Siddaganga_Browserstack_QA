// Read-only flow probe for Outstation / Transfer. FLOW='<json>' node scripts/run.mjs steps/ot-flow.mjs
// Fills the form, clicks Book Now!, records validation or the results page, optionally opens vehicle details
// (Fare Breakup) and Book This Vehicle (Confirm screen), then CLOSES the modal. Never submits; guard() blocks
// inquiry/draft/booking/payment APIs. Output saved to exploration-logs/raw/ot-flow-<name>.json (git-ignored).
import fs from 'node:fs';
import { openTab, active, msgs, place, scrub } from './_ot.mjs';
import { cardAction } from './_local.mjs';
import { cards } from './local-cards.mjs';

const norm = s => (s || '').replace(/\s+/g, ' ').trim();
const lines = t => scrub(t).split('\n').map(s => s.trim()).filter(Boolean);

async function setToggle(page, label, want) {
  const box = active(page).getByText(label, { exact: true }).first();
  const state = () => box.evaluate(el => { let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) { const c = p.querySelector('input[type=checkbox]'); if (c) return c.checked; } return null; });
  for (let i = 0; i < 3 && (await state()) !== want; i++) {
    const inp = box.locator('xpath=ancestor::*[.//input[@type="checkbox"]][1]//input[@type="checkbox"]').first();
    await inp.click({ force: true }).catch(() => box.click()); await page.waitForTimeout(700);
  }
  return state();
}
async function setDate(page, idx, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  await active(page).locator('input[value^="20"]:visible').nth(idx).click(); await page.waitForTimeout(500);
  for (let i = 0; i < 40; i++) {
    const cur = await page.locator('.react-datepicker__current-month').first().innerText();
    if (cur.trim() === target) break;
    await page.locator('.react-datepicker__navigation--next').click(); await page.waitForTimeout(120);
  }
  await page.locator(`.react-datepicker__day--0${String(d).padStart(2, '0')}:not(.react-datepicker__day--outside-month)`).first().click();
  await page.waitForTimeout(400);
}
async function setTime(page, idx, label) {
  await active(page).locator('input[value$="AM"]:visible, input[value$="PM"]:visible').nth(idx).click(); await page.waitForTimeout(500);
  const item = page.locator('.react-datepicker__time-list-item:visible').filter({ hasText: new RegExp(`^${label}$`) }).first();
  await item.scrollIntoViewIfNeeded(); await item.click(); await page.waitForTimeout(400);
}
async function formValues(page) {
  return active(page).evaluate(root => [...root.querySelectorAll('input')].filter(e => e.getBoundingClientRect().width)
    .map(e => ({ ph: e.placeholder || e.type, v: e.type === 'checkbox' || e.type === 'radio' ? e.checked : e.value })));
}

export default async ({ page, shot }) => {
  const F = JSON.parse(process.env.FLOW);
  const out = { name: F.name, input: F, steps: [] };
  const snap = n => shot(`validation-ot/${F.name}-${n}`);
  const api = [];
  page.on('request', r => { if (r.method() !== 'GET' && /api/.test(r.url())) api.push(`${r.method()} ${r.url().split('?')[0].replace(/.*\/api\/v\d+/, '')}`); });
  await openTab(page, F.tab);
  if (F.sub) { await active(page).getByText(F.sub, { exact: true }).first().click(); await page.waitForTimeout(800); }
  for (const [label, want] of Object.entries(F.toggles || {})) out.steps.push({ toggle: label, now: await setToggle(page, label, want) });
  for (let i = 0; i < (F.addDest || 0); i++) { await active(page).locator('button').filter({ hasText: /Add Another Destination/ }).first().click(); await page.waitForTimeout(600); }
  for (const [ph, q, pick] of F.places || []) {
    const inp = active(page).locator(`input[placeholder="${ph}"]:visible`).first();
    out.steps.push({ place: ph, ...(await place(page, inp, q, pick)) });
  }
  for (const [i, iso] of F.dates || []) await setDate(page, i, iso);
  for (const [i, t] of F.times || []) await setTime(page, i, t);
  if (F.pax != null) await active(page).locator('input[placeholder="Enter number of passengers"]:visible').fill(String(F.pax));
  if (F.hrs != null) await active(page).locator('input[placeholder="Enter Number of Hours"]:visible').fill(String(F.hrs));
  if (F.removeDest != null) { // click the delete button of destination N (1-based)
    const btn = active(page).locator(`input[placeholder="Search destination ${F.removeDest} location"]`).locator('xpath=ancestor::div[.//button][1]//button').first();
    await btn.click().catch(e => out.removeErr = String(e).slice(0, 100)); await page.waitForTimeout(600);
  }
  await page.waitForTimeout(1200);
  out.formBefore = await formValues(page);
  out.formShot = await snap('form');
  if (F.noSubmit) { out.msgs = await msgs(page); out.api = api; fs.writeFileSync(`exploration-logs/raw/ot-flow-${F.name}.json`, JSON.stringify(out, null, 2)); return out; }
  await active(page).getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForURL(/send-inquiry/, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  out.url = new URL(page.url()).pathname;
  if (!/send-inquiry/.test(page.url())) {
    out.msgs = await msgs(page); out.formAfter = await formValues(page); out.valShot = await snap('validation');
  } else {
    await page.locator('text=/Found/').first().waitFor({ timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);
    out.summary = norm(await page.locator('text=/Distance/').first().locator('xpath=../..').innerText().catch(() => ''));
    out.found = norm(await page.locator('text=/Found/').first().innerText().catch(() => ''));
    out.bodyTop = norm(scrub(await page.locator('body').innerText())).match(/You have Searched For.{0,900}/)?.[0];
    out.page1 = (await cards(page)).map(c => `${c.name} ${c.code} ${c.seats}p ${c.price}`);
    out.resShot = await snap('results');
    if (F.vehicle) {
      try {
        await cardAction(page, F.vehicle, 'View Full Vehicle Details');
        const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(1500);
        const L = lines(await m.innerText());
        const i = L.findIndex(l => /Pricing|Fare/i.test(l));
        out.details = { tabs: (await m.locator('button, [role=tab], .nav-link').allInnerTexts()).map(norm).filter(Boolean).slice(0, 25), pricing: L.slice(Math.max(0, i - 2), i + 45) };
        await m.locator('text=/Pricing/').first().scrollIntoViewIfNeeded().catch(() => {});
        out.detailsShot = await snap('fare-breakup');
        await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape'));
        await page.waitForTimeout(800);
      } catch (e) { out.detailsErr = String(e).split('\n')[0].slice(0, 200); }
      if (F.book !== false) {
        try {
          await cardAction(page, F.vehicle, 'Book This Vehicle');
          const m = page.locator('.modal.show').first(); await m.waitFor({ timeout: 15000 }); await page.waitForTimeout(2500);
          out.confirm = lines(await m.innerText()).filter(l => !/@|Customer|Name|Phone|Mobile|Email/i.test(l)).slice(0, 90);
          out.confirmButtons = (await m.locator('button').allInnerTexts()).map(norm).filter(Boolean);
          out.confirmShot = await shot(`validation-ot/${F.name}-confirm`, { mask: [m.locator('xpath=.//*[contains(normalize-space(.),"Customer Details")]/..').first()] });
          await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape'));
          await page.waitForTimeout(800);
        } catch (e) { out.bookErr = String(e).split('\n')[0].slice(0, 200); }
      }
    }
  }
  out.api = api;
  fs.writeFileSync(`exploration-logs/raw/ot-flow-${F.name}.json`, JSON.stringify(out, null, 2));
  return { name: F.name, url: out.url, msgs: out.msgs, found: out.found, summary: out.summary?.slice(0, 500), page1: out.page1?.slice(0, 6), details: out.details, confirm: out.confirm, buttons: out.confirmButtons, err: out.detailsErr || out.bookErr, api };
};
