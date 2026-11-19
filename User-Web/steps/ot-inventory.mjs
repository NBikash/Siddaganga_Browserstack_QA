// Read-only: trip tab list, Outstation form, Transfer form (all sub-modes) inventory.
import { openTab, describe, active } from './_ot.mjs';
export default async ({ page, shot }) => {
  const out = {};
  await openTab(page, 'Local');
  out.tabs = await page.evaluate(() => [...document.querySelectorAll('[role=tab], .nav-link, .nav-item')]
    .filter(e => e.getBoundingClientRect().width).map(e => e.innerText.trim()).filter(Boolean).slice(0, 20));
  await openTab(page, 'Outstation');
  out.outstation = await describe(page);
  out.outShot = await shot('validation-ot/01-outstation-form', { fullPage: false });
  await openTab(page, 'Transfer');
  out.transfer = await describe(page);
  out.trfShot = await shot('validation-ot/02-transfer-form');
  return out;
};
