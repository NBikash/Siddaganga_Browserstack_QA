import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const rows = page.locator('tbody tr').filter({ has: page.locator('td', { hasText: /^\s*TP-111\s*$/ }) });
  if ((await rows.count()) !== 1) return { blocked: 'TP-111 rows ' + await rows.count() };
  await rows.first().locator('button:text-is("Allocate")').click();
  await settle(page, 3000);
  const dlg = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  const inDlg = await dlg.count();
  const root = inDlg ? dlg : page.locator('main');
  return { url: page.url().replace(/\?.*/, ''), inDialog: !!inDlg, text: scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 2500),
    buttons: (await root.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 30),
    inputs: await root.locator('input:visible, select:visible, textarea:visible').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, t: e.type, v: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30) }))),
    shot: await snap(shot, 'S12-allocate-step1', { page, fullPage: !inDlg }) };
};
