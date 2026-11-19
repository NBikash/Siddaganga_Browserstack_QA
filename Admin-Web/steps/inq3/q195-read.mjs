// Read-only: QRY-195 cost rows of every trip (by input index) + View Quote from the list.
import { settle, fsnap, save, load, closeDialogs } from './_i.mjs';
import { waitForm, COST, viewQuote } from './q.mjs';
export default async ({ page, shot }) => {
  const o = {};
  await page.goto('https://dari-preprod.siddagangatravels.com/dashboard/inquiry-management/update-inquiry/48f3a9cd-513a-44b4-bc82-5d33e3659ce6', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForm(page);
  o.trips = await page.evaluate(names => { const out = []; const n = document.querySelectorAll('main input[name="totalKms"]').length; for (let i = 0; i < n; i++) out.push(Object.fromEntries(names.map(k => [k, document.querySelectorAll(`main input[name="${k}"]`)[i]?.value ?? null]))); return out; }, COST);
  o.shotTrip2 = await fsnap(shot, page, 'quote', 'Q195-trip2-costs', { fullPage: true });
  for (let i = 0; i < 3; i++) { try { const v = await viewQuote(page, 'QRY-195'); o.viewQuote = v.dialog; o.row = v.rowText; break; } catch (e) { o.vqErr = String(e).slice(0, 120); } }
  if (o.viewQuote) { o.shotVQ = await fsnap(shot, page, 'quote', 'Q195-view-quote-after-trip2'); await closeDialogs(page); }
  const all = load('q195.json'); all.READ = o; save('q195.json', all); return o;
};
