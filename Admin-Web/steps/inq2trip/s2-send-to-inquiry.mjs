// S1b + S2: re-confirm LD-341 row, click Send To Inquiry, capture what opens (no confirmation clicked here).
import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const s = page.locator('input[placeholder="Search Lead Info"]');
  await s.fill(''); await s.fill('LD-341'); await settle(page, 2000);
  const rows = page.locator('tbody tr', { hasText: 'LD-341' });
  if ((await rows.count()) !== 1) return { blocked: 'LD-341 row count ' + await rows.count() };
  const out = { s1b: await snap(shot, 'S01b-matched-lead') };
  await rows.first().locator('td').last().locator('button').first().click(); await page.waitForTimeout(800);
  await page.locator('button:visible').filter({ hasText: /^\s*Send To Inquiry\s*$/ }).first().click();
  await settle(page, 2500);
  out.url = page.url();
  const dlg = page.locator('[role=dialog]:visible, .MuiDialog-paper:visible, .MuiDrawer-paper:visible').last();
  out.dialog = (await dlg.count()) ? scrub(await dlg.innerText()).slice(0, 1500) : null;
  out.buttons = (await page.locator((await dlg.count()) ? '[role=dialog]:visible button, .MuiDrawer-paper:visible button' : 'main button:visible').allInnerTexts()).map(t => t.trim()).filter(Boolean);
  out.inputs = await page.locator('[role=dialog]:visible input, [role=dialog]:visible textarea, main input:visible').evaluateAll(es => es.map(e => ({ name: e.name, ph: e.placeholder, type: e.type, val: e.type === 'checkbox' ? e.checked : (e.value || '').slice(0, 40) }))).catch(() => []);
  out.toast = scrub((await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).join(' | '));
  out.shot = await snap(shot, 'S02-send-to-inquiry', { fullPage: true });
  return out;
};
