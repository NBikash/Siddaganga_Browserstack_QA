// Read-only: for each booking tab / sub-tab, record fields, toggles (and fields revealed by each), empty-submit validation.
import { guard } from '../_local.mjs';
const TABS = [['Local'], ['Outstation'], ['Transfer', 'Point To Point'], ['Transfer', 'By Hour'], ['Multi-Leg']];
const fieldsOf = page => page.evaluate(() => {
  const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
  const root = [...document.querySelectorAll('.tab-pane.active')].find(e => /Book Now|Next|Pickup|From/i.test(e.innerText)) || document.querySelector('form') || document.body;
  const out = [];
  for (const el of root.querySelectorAll('input, select, textarea, button, label, [role=switch]')) {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (el.tagName === 'LABEL') { out.push(`LABEL "${t(el).slice(0, 50)}"`); continue; }
    out.push(`${el.tagName}:${el.type || ''} ph="${el.placeholder || ''}" val="${(el.value || '').slice(0, 25)}" min=${el.min || ''} max=${el.max || ''} ${el.checked ? 'CHECKED' : ''} txt="${t(el).slice(0, 30)}"`);
  }
  return { rootText: t(root).slice(0, 600), fields: out };
});
const msgs = page => page.evaluate(() => {
  const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
  return [...document.querySelectorAll('.text-danger, .invalid-feedback, .error, [class*="error" i], [role=alert], .Toastify__toast, .swal2-popup, .modal.show')]
    .filter(e => e.getBoundingClientRect().width).map(t).filter(Boolean).slice(0, 10);
});
export default async ({ page, shot }) => {
  await guard(page);
  const out = {};
  for (const [tab, sub] of TABS) {
    const key = sub ? `${tab}/${sub}` : tab;
    await page.goto(process.env.USER_WEB_URL, { waitUntil: 'domcontentloaded' });
    await page.locator('.brand-loading-signature').first().waitFor({ state: 'hidden', timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2000);
    await page.getByText(tab, { exact: true }).first().click(); await page.waitForTimeout(800);
    if (sub) { await page.getByText(sub, { exact: true }).first().click(); await page.waitForTimeout(800); }
    const r = { base: await fieldsOf(page) };
    r.shot = await shot(`explore/tab-${key.replace(/\W+/g, '-')}`);
    // toggles
    const sw = page.locator('.tab-pane.active input[type=checkbox], input.form-check-input[type=checkbox]').filter({ visible: true });
    const n = await sw.count(); r.toggles = [];
    for (let i = 0; i < n; i++) {
      const lbl = await sw.nth(i).evaluate(e => { let p = e; for (let k = 0; k < 4 && p; k++, p = p.parentElement) { const s = (p.innerText || '').trim(); if (s) return s.replace(/\s+/g, ' ').slice(0, 50); } return ''; });
      await sw.nth(i).click({ force: true }).catch(() => {}); await page.waitForTimeout(800);
      r.toggles.push({ lbl, after: (await fieldsOf(page)).fields, shot: await shot(`explore/tab-${key.replace(/\W+/g, '-')}-toggle${i + 1}`) });
      await sw.nth(i).click({ force: true }).catch(() => {}); await page.waitForTimeout(500);
    }
    // empty submit
    const btn = page.getByRole('button', { name: /Book Now!|^Next$/ }).filter({ visible: true }).first();
    const before = page.url();
    await btn.click().catch(e => r.submitErr = String(e).slice(0, 100)); await page.waitForTimeout(1500);
    r.emptySubmit = { msgs: await msgs(page), urlChanged: page.url() !== before ? page.url() : false, shot: await shot(`explore/tab-${key.replace(/\W+/g, '-')}-empty-submit`) };
    out[key] = r;
  }
  return out;
};
