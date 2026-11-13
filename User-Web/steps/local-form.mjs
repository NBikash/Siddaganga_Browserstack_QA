// Read-only: describe the Local booking form on the home page (fields, toggles, buttons).
export default async ({ page, shot }) => {
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  const tab = page.getByText('Local', { exact: true }).first();
  await tab.click(); await page.waitForTimeout(800);
  const form = page.locator('form').filter({ hasText: 'Pickup Location' }).first();
  const box = (await form.count()) ? form : page.locator('body');
  const desc = await box.evaluate(root => {
    const out = [];
    for (const el of root.querySelectorAll('input, select, textarea, button, [role=switch], [role=combobox], [role=checkbox]')) {
      const r = el.getBoundingClientRect(); if (!r.width) continue;
      out.push({ tag: el.tagName, type: el.type, name: el.name, id: el.id, ph: el.placeholder, role: el.getAttribute('role'),
        checked: el.checked, value: el.type === 'password' ? '***' : el.value, min: el.min, max: el.max, step: el.step,
        readonly: el.readOnly, disabled: el.disabled, aria: el.getAttribute('aria-label'),
        text: (el.innerText || '').trim().slice(0, 40), cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 60) });
    }
    return { html: root.outerHTML.length, items: out };
  });
  const s = await shot('local/01-local-form');
  return { ...desc, shot: s };
};
