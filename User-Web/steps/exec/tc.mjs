// Runs a list of search scenarios for one test case: TC=<id> SCN='<json array>' RUN_ID=... node scripts/run.mjs steps/exec/tc.mjs
import { fillForm, search, vehicleDetails, bookVehicle, save, snap } from './runner.mjs';
import { cardAction } from '../_local.mjs';
export default async ({ page }) => {
  const id = process.env.TC; const list = JSON.parse(process.env.SCN);
  const out = { id, started: new Date().toISOString(), steps: [] };
  for (const s of list) {
    const tag = `${id}-${s.label}`; const step = { label: s.label, input: s };
    try {
      Object.assign(step, await fillForm(page, s));
      step.formShot = await snap(page, `${tag}-form`);
      step.result = await search(page, tag);
      if (step.result.navigated && s.vehicle) {
        const vs = [].concat(s.vehicle);
        if (s.details !== false) {
          step.detailsAll = [];
          for (const v of vs) step.detailsAll.push({ vehicle: v, ...(await vehicleDetails(page, v, `${tag}-${v.replace(/\s/g, '')}`)) });
          step.details = step.detailsAll[0];
        }
        // all but the last vehicle: select and record any intermediate popup (e.g. "Passenger Capacity Not Complete!")
        step.intermediate = [];
        for (const v of vs.slice(0, -1)) {
          await cardAction(page, v, 'Book This Vehicle'); await page.waitForTimeout(2500);
          const m = page.locator('.modal.show').first();
          const rec = { vehicle: v, popup: (await m.count()) ? (await m.innerText()).replace(/\s+/g, ' ').trim() : null,
            buttons: (await m.count()) ? (await m.locator('button').allInnerTexts()).map(b => b.trim()).filter(Boolean) : [], shot: await snap(page, `${tag}-${v.replace(/\s/g, '')}-after-select`) };
          if (rec.popup) { await m.locator('.btn-close, [aria-label=Close], button.close').first().click().catch(() => page.keyboard.press('Escape')); await page.waitForTimeout(800); }
          step.intermediate.push(rec);
        }
        if (s.capacityOnly) { // supplementary: select one vehicle that is too small and record the popup, no submission
          await cardAction(page, vs.at(-1), 'Book This Vehicle'); await page.waitForTimeout(2500);
          const m = page.locator('.modal.show').first();
          step.capacity = { popup: (await m.count()) ? (await m.innerText()).replace(/\s+/g, ' ').trim() : null, shot: await snap(page, `${tag}-capacity-popup`) };
        } else if (s.book !== false) step.booking = await bookVehicle(page, vs.at(-1), tag);
      }
    } catch (e) { step.error = String(e).split('\n')[0].slice(0, 300); step.errorShot = await snap(page, `${tag}-error`).catch(() => null); }
    out.steps.push(step);
  }
  out.finished = new Date().toISOString();
  save(id, out);
  return out.steps.map(s => ({ label: s.label, err: s.error, nav: s.result?.navigated, found: s.result?.found, applied: s.booking?.applied?.cost, pkg: s.details?.fareBreakup?.package }));
};
