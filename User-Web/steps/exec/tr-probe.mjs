// Read-only probe of the Transfer form (selectors for tr-lib). Network guard blocks every mutating call.
//   RUN_ID=... node scripts/run.mjs steps/exec/tr-probe.mjs
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  await L.guard(page);
  await L.home(page, 'Transfer');
  const scope = L.active(page);
  const text = L.norm(await scope.innerText());
  const ctrls = await scope.evaluate(root => [...root.querySelectorAll('input, button, [role=tab], a.nav-link, label')]
    .filter(e => e.getBoundingClientRect().width)
    .map(e => ({ tag: e.tagName, type: e.type, ph: e.placeholder, name: e.name, id: e.id, txt: (e.innerText || e.value || '').trim().slice(0, 40), cls: String(e.className).slice(0, 60), checked: e.checked, title: e.title, aria: e.getAttribute('aria-label') })));
  const shot = await L.snap(page, 'PROBE-transfer-form');
  // Add Return
  const box = scope.getByText('Add Return', { exact: true }).first();
  await box.click().catch(() => {}); await page.waitForTimeout(1200);
  const afterReturn = await L.formValues(page);
  const shot2 = await L.snap(page, 'PROBE-transfer-add-return');
  return { text: text.slice(0, 1200), ctrls, afterReturn, shot, shot2, tabs: await page.locator('a.nav-link').allInnerTexts() };
};
