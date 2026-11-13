// Vehicle Dispatch VD-01..VD-06 for TP-112. Advance always declined. Final submit only with valid test values.
import fs from 'node:fs';
import path from 'node:path';
import { go, settle, scrub, fsnap, rowIndex, kebab, declineAdvance, toasts, netlog } from './_func.mjs';
import { errs } from './f-lm-forms.mjs';
const P = (k, v) => console.error(k, JSON.stringify(v).slice(0, 900));
export default async ({ page, shot }) => {
  const o = {};
  fs.writeFileSync(path.resolve('test-data/qa-not-a-pdf.txt'), 'QA negative upload test - not a PDF');
  await go(page, '/dashboard/fleet-vehicle-management/approved-trips'); await page.waitForTimeout(1500);
  const h = await rowIndex(page, 'TP-112'); if (h.length !== 1) return { blocked: 'rows ' + h.length };
  await kebab(page, h[0], 'Initiate Vehicle Dispatch'); await page.waitForTimeout(2500);
  o.adv = await declineAdvance(page, 'TP-112'); await page.waitForTimeout(2500);
  const d = page.locator('[role=dialog]:visible').last();
  if ((await d.locator('input[name=tripId]').inputValue().catch(() => '')) !== 'TP-112') return { o, stop: 'dispatch form not for TP-112' };
  o.header = { trip: await d.locator('input[name=tripId]').inputValue(), vehicle: await d.locator('input[name=vehicleNo]').inputValue() };
  // VD-01 Next without safety confirmation
  const safety = d.locator('input[type=checkbox]').first();
  o.vd01 = { safetyChecked: await safety.isChecked() };
  await d.locator('button:visible:text-is("Next")').click(); await page.waitForTimeout(1500);
  o.vd01.afterNext = { errors: await errs(d), toasts: await toasts(page, 2500), onTripSheet: await d.locator('input[name=startOdometer]').count() > 0 };
  o.vd01.shot = await fsnap(shot, page, 'dispatch', 'VD-01-next-without-safety');
  P('vd01', o.vd01);
  if (!o.vd01.afterNext.onTripSheet) { await safety.check(); await d.locator('textarea[name=note]').fill('QA functional test dispatch TP-112'); await d.locator('button:visible:text-is("Next")').click(); await page.waitForTimeout(1500); }
  o.tripSheet = (scrub(await d.innerText()).replace(/\s+/g, ' ').match(/Vehicle No\.:.*?Start Odometer/) || [''])[0];
  const submit = d.locator('button:visible:text-is("Generate Trip Sheet & Mark Vehicle Ready")');
  const net = netlog(page);
  // VD-02 blank submit
  await submit.click(); await page.waitForTimeout(1500);
  o.vd02 = { errors: await errs(d), toasts: await toasts(page, 3000), net: [...net] };
  o.vd02.shot = await fsnap(shot, page, 'dispatch', 'VD-02-blank-submit');
  P('vd02', o.vd02);
  // VD-03 invalid / boundary
  const f = n => d.locator(`input[name=${n}]`);
  const tryType = async (n, v) => { await f(n).fill(''); try { await f(n).type(v); } catch {} await f(n).blur(); return f(n).inputValue(); };
  o.vd03 = { startOdo_neg: await tryType('startOdometer', '-50'), startOdo_letters: await tryType('startOdometer', 'abc'), fuel_huge: await tryType('fuelFilled', '99999'), mileage_0: await tryType('mileage', '0') };
  await f('openingKm').fill('100'); await f('startOdometer').fill('200'); await f('helper').fill('QA Test Helper'); await f('lastDieselInput').fill('10');
  net.length = 0; await submit.click(); await page.waitForTimeout(1500);
  o.vd03.mismatchSubmit = { errors: await errs(d), toasts: await toasts(page, 3000), net: [...net] };
  o.vd03.shot = await fsnap(shot, page, 'dispatch', 'VD-03-invalid-values');
  P('vd03', o.vd03);
  // VD-04 present diesel calc
  await f('fuelFilled').fill('30'); await f('lastDieselInput').fill('10'); await f('fuelFilled').blur(); await page.waitForTimeout(600);
  o.vd04 = { last: '10', filled: '30', present: await f('presentDieselInput').inputValue(), presentDisabled: await f('presentDieselInput').isDisabled() };
  P('vd04', o.vd04);
  // VD-05 uploads
  const fi = d.locator('input[type=file]');
  o.vd05 = { accept: await fi.getAttribute('accept') };
  await fi.setInputFiles(path.resolve('test-data/qa-not-a-pdf.txt')); await page.waitForTimeout(1500);
  o.vd05.txt = { toasts: await toasts(page, 3000), errors: await errs(d), shown: (await d.innerText()).includes('qa-not-a-pdf') };
  o.vd05.shotTxt = await fsnap(shot, page, 'dispatch', 'VD-05-non-pdf-upload');
  const rm = d.locator('button:visible:text-is("Remove")'); if (await rm.count()) { await rm.click(); await page.waitForTimeout(800); }
  await d.locator('input[type=file]').setInputFiles(path.resolve('test-data/qa-test-permit.pdf')); await page.waitForTimeout(2000);
  o.vd05.pdfShown = (await d.innerText()).includes('qa-test-permit');
  const rm2 = d.locator('button:visible:text-is("Remove")'); o.vd05.removeAvailable = await rm2.count();
  if (await rm2.count()) { await rm2.click(); await page.waitForTimeout(800); o.vd05.afterRemove = (await d.innerText()).includes('qa-test-permit'); await d.locator('input[type=file]').setInputFiles(path.resolve('test-data/qa-test-permit.pdf')); await page.waitForTimeout(2000); }
  o.vd05.shotPdf = await fsnap(shot, page, 'dispatch', 'VD-05-pdf-attached');
  P('vd05', o.vd05);
  // VD-06 valid submit
  for (const [n, v] of [['startOdometer', '20000'], ['openingKm', '20000'], ['fuelFilled', '30'], ['lastDieselInput', '10'], ['mileage', '10'], ['helper', 'QA Test Helper']]) await f(n).fill(v);
  await page.waitForTimeout(600);
  o.vd06 = { values: await d.locator('input[name]').evaluateAll(es => es.filter(e => e.type !== 'file').map(e => e.name + '=' + e.value)) };
  o.vd06.shotBefore = await fsnap(shot, page, 'dispatch', 'VD-06-valid-before-submit');
  net.length = 0; await submit.click();
  const seen = []; for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); for (const t of await page.locator('.Toastify__toast:visible').allInnerTexts()) { const x = scrub(t).replace(/\s+/g, ' '); if (!seen.includes(x)) seen.push(x); } if (seen.some(x => /ready for dispatch|success/i.test(x))) break; }
  o.vd06.toasts = seen; o.vd06.net = [...net]; await settle(page, 2500);
  o.vd06.dialogOpen = await page.locator('[role=dialog]:visible').count();
  P('vd06', o.vd06);
  return o;
};
