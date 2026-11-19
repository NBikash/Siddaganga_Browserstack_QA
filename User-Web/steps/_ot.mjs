// Read-only helpers for Outstation / Transfer validation exploration (reuses the Local guard).
// guard() aborts every POST/PUT/PATCH/DELETE to booking/inquiry/draft/payment/cancel/confirm URLs.
import { guard, scrub } from './_local.mjs';
export { guard, scrub };

export async function openTab(page, tab) {
  await guard(page);
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.getByText(tab, { exact: true }).first().click();
  await page.waitForTimeout(900);
}

export const active = page => page.locator('.tab-pane.active').first();

// Describe all visible controls in the active pane with their nearest label.
export async function describe(page) {
  return active(page).evaluate(root => {
    const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
    const out = [];
    for (const el of root.querySelectorAll('input, select, textarea, button, [role=switch], [role=tab], label')) {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      if (el.tagName === 'LABEL') { out.push({ tag: 'LABEL', text: t(el).slice(0, 70) }); continue; }
      let label = '', p = el.parentElement;
      for (let i = 0; i < 5 && p && !label; i++, p = p.parentElement) { const l = p.querySelector('label'); if (l && t(l).length < 70) label = t(l); }
      out.push({ label, tag: el.tagName, type: el.type, name: el.name, ph: el.placeholder, value: el.value, checked: el.checked,
        min: el.min, max: el.max, disabled: el.disabled, readonly: el.readOnly, text: t(el).slice(0, 50),
        options: el.tagName === 'SELECT' ? [...el.options].map(o => o.text) : undefined });
    }
    return { text: t(root).slice(0, 1500), items: out };
  });
}

export async function msgs(page) {
  const txt = await active(page).innerText().catch(() => '');
  const toasts = await page.locator('[role=alert], .Toastify__toast, [class*="toast" i], .swal2-popup').allInnerTexts().catch(() => []);
  return {
    inline: [...new Set(txt.split('\n').map(s => s.trim()).filter(s => /required|invalid|please|must|cannot|can't|select|enter|minimum|maximum|exceed|least|not available|error|same|after|before|allowed|positive/i.test(s)))],
    toasts: toasts.map(scrub).map(s => s.trim()).filter(Boolean),
  };
}

// Type into a Places input (by placeholder or nth input index) and pick a suggestion.
export async function place(page, input, query, pick) {
  await input.click(); await input.fill('');
  await input.pressSequentially(query, { delay: 35 }); await page.waitForTimeout(1200);
  const opts = page.locator('.pac-container:visible .pac-item, [role=listbox]:visible [role=option], .suggestion-item:visible, ul:visible li[class*="sugg" i]');
  await opts.first().waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(600);
  const list = (await opts.allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim());
  if (list.length) {
    const idx = pick ? Math.max(0, list.findIndex(s => s.toLowerCase().includes(pick.toLowerCase()))) : 0;
    await opts.nth(idx).click(); await page.waitForTimeout(1200);
  }
  return { query, suggestions: list.slice(0, 5), chosen: await input.inputValue() };
}

export async function clickText(page, text, scope) {
  const s = scope || page;
  const el = s.getByText(text, { exact: true }).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.click(); await page.waitForTimeout(900);
}

export async function results(page) {
  await page.waitForTimeout(2500);
  return page.evaluate(() => {
    const t = (document.body.innerText || '').replace(/\s+/g, ' ');
    const m = t.match(/You have Searched For(.{0,700})/i);
    const found = t.match(/\d+\s+Buses Found[^|]*\|[^₹]{0,60}/i);
    return { url: location.pathname, found: found?.[0], summary: m?.[1]?.slice(0, 700) };
  });
}
