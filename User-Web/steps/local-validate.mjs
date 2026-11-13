// Empty-form and invalid-value validations (Book Now clicked; mutating booking requests are blocked by guard()).
import { home, panel, messages } from './_local.mjs';
export default async ({ page, shot }) => {
  const out = {};
  await home(page);
  const p = panel(page);
  const book = p.getByRole('button', { name: 'Book Now!' });
  // 1. empty pickup
  await book.click(); await page.waitForTimeout(1500);
  out.emptyPickup = { url: page.url(), ...(await messages(page)), shot: await shot('local/val-01-empty-pickup') };
  // 2. passengers 0 / blank / non-numeric / huge
  const pax = p.locator('input[placeholder="Enter number of passengers"]');
  const hrs = p.locator('input[placeholder="Enter Number of Hours"]');
  for (const v of ['0', '', '-3', '999']) {
    await pax.fill(v); await pax.blur(); await page.waitForTimeout(400);
    out[`pax_${v || 'blank'}`] = { value: await pax.inputValue(), ...(await messages(page)) };
  }
  await pax.pressSequentially('abc'); out.pax_letters = { value: await pax.inputValue() };
  for (const v of ['0', '25', '', '1.5']) {
    await hrs.fill(v); await hrs.blur(); await page.waitForTimeout(400);
    out[`hrs_${v || 'blank'}`] = { value: await hrs.inputValue(), ...(await messages(page)) };
  }
  await book.click(); await page.waitForTimeout(1500);
  out.afterInvalidSubmit = { url: page.url(), ...(await messages(page)), shot: await shot('local/val-02-invalid-values') };
  return out;
};
