// Helpers for read-only Local exploration.
// Safety net: every mutating API request (POST/PUT/PATCH/DELETE) whose URL looks like booking/inquiry/draft/payment/cancel
// is ABORTED and logged, so no booking, draft, payment or cancellation can be created by exploration code.
import fs from 'node:fs';
import path from 'node:path';
const LOG = path.resolve('exploration-logs/raw/network.log');
// ALLOW_SUBMIT=1 (approved TC execution): inquiry submission and its API calls are allowed; only payment/cancellation stay blocked.
const DENY = process.env.ALLOW_SUBMIT === '1' ? /payment|razorpay|checkout|cancel/i : /book|inquir|enquir|draft|payment|pay|order|cancel|confirm|checkout|razorpay|lead/i;
const PII = s => s.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '<email>').replace(/(?:\+?91[\s-]?)?[6-9]\d{4}\s?\d{5}/g, '<phone>');

export async function guard(page) {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  await page.unroute('**/*').catch(() => {});
  await page.route('**/*', async route => {
    const r = route.request(); const m = r.method();
    if (m === 'GET' || m === 'OPTIONS' || m === 'HEAD') return route.continue();
    const blocked = DENY.test(r.url());
    fs.appendFileSync(LOG, `${new Date().toISOString()} ${blocked ? 'BLOCKED' : 'allowed'} ${m} ${r.url().split('?')[0]}\n`);
    return blocked ? route.abort('blockedbyclient') : route.continue();
  });
}

export async function home(page) {
  await guard(page);
  await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
  await page.getByText('Local', { exact: true }).first().click();
  await page.waitForTimeout(600);
  await page.getByText('Pickup Location', { exact: true }).first().scrollIntoViewIfNeeded();
}

export const panel = page => page.locator('.tab-pane.active').filter({ hasText: 'Pickup Location' }).first();

// Visible fields in the inquiry form, with nearest label text.
export async function fields(page) {
  return panel(page).evaluate(root => {
    const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
    const out = [];
    for (const el of root.querySelectorAll('input, select, textarea, button')) {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      let label = '', p = el.parentElement;
      for (let i = 0; i < 5 && p && !label; i++, p = p.parentElement) { const l = p.querySelector('label'); if (l && t(l).length < 60) label = t(l); }
      out.push({ label, tag: el.tagName, type: el.type, ph: el.placeholder, value: el.value, min: el.min, max: el.max, disabled: el.disabled, text: t(el).slice(0, 40) });
    }
    return out;
  });
}

// Toggle switch next to a label ("Multi-day Trip", "Drop at different location").
export async function toggle(page, label) {
  const lbl = panel(page).getByText(label, { exact: true }).first();
  await lbl.click(); await page.waitForTimeout(700);
}
export async function toggleState(page, label) {
  return panel(page).getByText(label, { exact: true }).first().evaluate(el => {
    let p = el; for (let i = 0; i < 4 && p; i++, p = p.parentElement) {
      const i2 = p.querySelector('input[type=checkbox]'); if (i2) return i2.checked;
      const sw = p.querySelector('[aria-checked]'); if (sw) return sw.getAttribute('aria-checked') === 'true';
    }
    return null;
  });
}

export async function messages(page) {
  const txt = await panel(page).innerText().catch(() => '');
  const toasts = await page.locator('[role=alert], .Toastify__toast, [class*="toast" i], .swal2-popup').allInnerTexts().catch(() => []);
  return {
    inline: txt.split('\n').map(s => s.trim()).filter(s => /required|invalid|please|must|cannot|select|enter|minimum|maximum|exceed|least|not available|error/i.test(s)),
    toasts: toasts.map(PII).map(s => s.trim()).filter(Boolean),
  };
}
export const scrub = PII;

// Type into a Places-style input and pick the first suggestion (or one matching `pick`). Returns the suggestion list.
export async function place(page, placeholder, query, pick) {
  const input = panel(page).locator(`input[placeholder="${placeholder}"]`);
  await input.click(); await input.fill('');
  await input.pressSequentially(query, { delay: 40 }); await page.waitForTimeout(1800);
  const opts = page.locator('.pac-container:visible .pac-item, [role=listbox]:visible [role=option], .suggestion-item:visible, ul:visible li[class*="sugg" i]');
  const list = (await opts.allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim());
  if (list.length) {
    const idx = pick ? Math.max(0, list.findIndex(s => s.toLowerCase().includes(pick.toLowerCase()))) : 0;
    await opts.nth(idx).click(); await page.waitForTimeout(1200);
  }
  return { query, suggestions: list.slice(0, 6), chosen: await input.inputValue() };
}

// Click an action ("View Full Vehicle Details" / "Book This Vehicle") on the card whose text contains `code` (e.g. "D SDN").
// Walks the pagination until the card is found. Returns the page number it was on.
export async function cardAction(page, code, action) {
  for (let pg = 1; pg <= 6; pg++) {
    const ok = await page.evaluate(({ code, action }) => {
      document.querySelectorAll('[data-qa-target]').forEach(e => e.removeAttribute('data-qa-target'));
      const btns = [...document.querySelectorAll('button, a, [role=button]')].filter(b => (b.innerText || '').trim() === action);
      for (const b of btns) {
        let p = b; while (p && !/Starts From/.test(p.innerText || '')) p = p.parentElement;
        if (p && (' ' + p.innerText.replace(/\s+/g, ' ') + ' ').includes(' ' + code + ' ')) { b.setAttribute('data-qa-target', '1'); p.setAttribute('data-qa-target', 'card'); return true; }
      }
      return false;
    }, { code, action });
    if (ok) { const c = page.locator('[data-qa-target="card"]'); await c.scrollIntoViewIfNeeded(); await c.hover(); await page.waitForTimeout(600); await page.locator('[data-qa-target="1"]').click(); return pg; }
    const nb = page.locator('ul.pagination li, .pagination button, .pagination a').filter({ hasText: new RegExp(`^\s*${pg + 1}\s*$`) }).first();
    if (!(await nb.isVisible().catch(() => false))) break;
    await nb.click(); await page.waitForTimeout(1500);
  }
  throw new Error(`card ${code} / ${action} not found`);
}
