// Read-only consistency check (env INQ, TAG): list row, View Quote dialog, Preview Quote Summary from the form.
import { settle, fsnap, save, load, closeDialogs } from './_i.mjs';
import { viewQuote, dialogText, openEdit, costs } from './q.mjs';
export default async ({ page, shot }) => {
  const INQ = process.env.INQ, TAG = process.env.TAG; const o = {};
  try {
    const v = await viewQuote(page, INQ); o.row = v.rowText; o.viewQuote = v.dialog;
    o.shotVQ = await fsnap(shot, page, 'quote', `${TAG}-view-quote`); await closeDialogs(page);
    await openEdit(page, INQ); o.costs = await costs(page);
    await page.locator('main button:visible').filter({ hasText: /^\s*Preview Quote Summary\s*$/ }).click(); await settle(page, 2000);
    o.preview = await dialogText(page); o.shotPV = await fsnap(shot, page, 'quote', `${TAG}-preview`); await closeDialogs(page);
  } finally { const all = (() => { try { return load('vq-check.json'); } catch { return {}; } })(); all[TAG] = o; save('vq-check.json', all); }
  return o;
};
