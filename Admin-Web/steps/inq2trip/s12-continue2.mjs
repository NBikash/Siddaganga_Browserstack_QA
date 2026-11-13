import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const d = page.locator('[role=dialog]:visible').last();
  if (!/Select the type of allocation/.test(await d.innerText())) return { stop: 'unexpected dialog' };
  await d.locator('button:text-is("Continue")').click(); await settle(page, 4000);
  const dlg = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  const inDlg = await dlg.count();
  const root = inDlg ? dlg : page.locator('main');
  return { url: page.url().replace(/\?.*/, ''), inDialog: !!inDlg, text: scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 3500),
    buttons: (await root.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 50),
    inputs: await root.locator('input:visible, select:visible, textarea:visible').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, t: e.type, v: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30), dis: e.disabled }))),
    shot: await snap(shot, 'S12-allocate-step3', { page, fullPage: !inDlg }) };
};
