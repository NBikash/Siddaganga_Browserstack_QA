// Read-only: open the quote form (env URL path) and dump values after it has loaded.
import { go, fsnap, save, load } from './_i.mjs';
import { formDump, waitForm } from './form.mjs';
export default async ({ page, shot }) => {
  await page.goto(new URL(process.env.URLP, 'https://dari-preprod.siddagangatravels.com').href, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForm(page); const f = await formDump(page);
  const s = await fsnap(shot, page, 'inquiry', `${process.env.TAG}-reopen`, { fullPage: true });
  return { shot: s, fields: Object.fromEntries(Object.entries(f.fields).map(([k, v]) => [k, v.v])), text: f.text.slice(0, 1800) };
};
