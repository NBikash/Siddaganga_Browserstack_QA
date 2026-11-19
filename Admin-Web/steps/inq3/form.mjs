// Read every visible field of the quote form (name/placeholder -> value), skipping PII inputs; plus visible section text.
import { scrub, PII_INPUTS } from './_i.mjs';
export async function formDump(page) {
  const fields = await page.evaluate(pii => {
    const out = {}; const skip = new Set([...document.querySelectorAll(pii)]);
    document.querySelectorAll('main input, main textarea, main select').forEach((e, i) => {
      if (skip.has(e) || !e.getClientRects().length) return;
      const k = e.name || e.placeholder || e.getAttribute('aria-label') || `${e.type}#${i}`;
      const v = e.type === 'checkbox' || e.type === 'radio' ? (e.checked ? 'checked' : 'unchecked') : e.value;
      out[out[k] !== undefined ? `${k}#${i}` : k] = { v, ro: e.readOnly || e.disabled || undefined };
    });
    return out;
  }, PII_INPUTS);
  const text = scrub(await page.locator('main').innerText()).replace(/\s+/g, ' ');
  return { fields, text: text.slice(0, 4000) };
}
// Wait until the quote form has loaded its record (pax and start date filled); throws instead of acting on an empty form.
export async function waitForm(page, ms = 30000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const ok = await page.evaluate(() => { const p = document.querySelector('main input[name=pax]'); const d = [...document.querySelectorAll('main input')].some(e => /\d{2}\/\d{2}\/\d{4}/.test(e.value)); return !!(p && p.value && d); }).catch(() => false);
    if (ok) { await page.waitForTimeout(1500); return true; }
    await page.waitForTimeout(700);
  }
  throw new Error('quote form did not load its values: refusing to act on an empty form');
}
