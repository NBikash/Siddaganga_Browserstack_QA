import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const b = page.locator('[role=dialog]:visible button:text-is("No, Continue to Allocation")');
  if ((await b.count()) !== 1) return { stop: 'No, Continue to Allocation count ' + await b.count() };
  await b.click(); await settle(page, 3500);
  const dlg = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  const inDlg = await dlg.count();
  const root = inDlg ? dlg : page.locator('main');
  return { url: page.url().replace(/\?.*/, ''), inDialog: !!inDlg, text: scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 3000),
    buttons: (await root.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 40),
    inputs: await root.locator('input:visible, select:visible, textarea:visible').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, t: e.type, v: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30), dis: e.disabled }))),
    shot: await snap(shot, 'S12-allocate-step2', { page, fullPage: !inDlg }) };
};
