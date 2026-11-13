import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const it = page.locator(':is(button,li,[role=menuitem]):visible').filter({ hasText: /^\s*Initiate Vehicle Dispatch\s*$/ });
  if ((await it.count()) !== 1) return { stop: 'Initiate Vehicle Dispatch count ' + await it.count() };
  await it.click(); await settle(page, 3500);
  const dlg = page.locator('[role=dialog]:visible, .MuiDrawer-paper:visible').last();
  const inDlg = await dlg.count();
  const root = inDlg ? dlg : page.locator('main');
  const fields = await root.locator('input:visible, textarea:visible, select:visible, [role=combobox]:visible').evaluateAll(es => es.map(e => {
    let p = e, lab = ''; for (let i = 0; i < 5 && p && !lab; i++) { p = p.parentElement; lab = p?.querySelector('label')?.innerText || ''; }
    return { label: lab.trim().slice(0, 50), n: e.name, ph: e.placeholder, t: e.type || e.getAttribute('role'), req: e.required || e.getAttribute('aria-required') === 'true', v: ['checkbox', 'radio'].includes(e.type) ? e.checked : (e.value || '').slice(0, 30), dis: e.disabled };
  }));
  return { url: page.url().replace(/\?.*/, ''), inDialog: !!inDlg, text: scrub(await root.innerText()).replace(/\s+/g, ' ').slice(0, 3000), buttons: (await root.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 30), fields, shot: await snap(shot, 'S17-dispatch-form', { page, fullPage: !inDlg }) };
};
