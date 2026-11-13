// CFG-1 with valid data → click Book Now and record what the next screen is (booking/inquiry/draft requests are blocked).
import { home, panel, messages, place } from './_local.mjs';
export default async ({ page, shot }) => {
  const out = {};
  await home(page);
  const reqs = [];
  page.on('request', r => { if (r.method() !== 'GET' && /api/.test(r.url())) reqs.push(`${r.method()} ${r.url().split('?')[0].replace(/.*\/api\/v1/, '')}`); });
  out.pickup = await place(page, 'Search pickup location', 'Whitefield');
  out.shotForm = await shot('local/book-01-filled');
  await panel(page).getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForTimeout(5000);
  out.url = page.url();
  out.msgs = await messages(page);
  out.reqs = reqs;
  out.text = (await page.locator('body').innerText()).replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').slice(0, 1500);
  out.shot = await shot('local/book-02-after-book-now');
  return out;
};
