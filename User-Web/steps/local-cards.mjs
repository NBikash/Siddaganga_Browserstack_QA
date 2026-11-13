// Collect every vehicle card on /send-inquiry across pagination (read-only).
import { guard } from './_local.mjs';

export async function cards(page) {
  return page.evaluate(() => {
    const t = e => (e?.innerText || '').replace(/\s+/g, ' ').trim();
    const all = [...document.querySelectorAll('div')].filter(d => /Starts From/.test(d.innerText) && /Seater|Best For/.test(d.innerText));
    const leaf = all.filter(d => !all.some(o => o !== d && d.contains(o)));
    const cardsEl = leaf.map(d => { let p = d; while (p.parentElement && !/Best For/.test(p.innerText)) p = p.parentElement; return p; });
    return [...new Set(cardsEl)].map(c => {
      const s = t(c);
      // "<tag> Starts From ₹X <rating> <name> <code> <N> Seater <name>..."
      const m = s.match(/^(\S+) Starts From (₹[\d,]+) ([\d.]+) (.+?) (.+?) (\d+) Seater \4/) || [];
      return { name: m[4] || '', code: m[5] || '', seats: m[6] ? Number(m[6]) : null, price: m[2] || '', tag: m[1] || '',
        buttons: [...c.querySelectorAll('button, a')].map(t).filter(Boolean), text: m.length ? '' : s.slice(0, 200) };
    });
  });
}

export async function allCards(page) {
  const out = []; const seen = new Set();
  const found = await page.locator('text=/Buses Found/').first().innerText().catch(() => '');
  for (let pg = 1; pg <= 10; pg++) {
    await page.waitForTimeout(1200);
    for (const c of await cards(page)) { const k = c.name + c.code + c.price; if (!seen.has(k)) { seen.add(k); out.push({ page: pg, ...c }); } }
    const nb = page.locator('ul.pagination li, .pagination button, .pagination a, nav button, nav a')
      .filter({ hasText: new RegExp(`^\\s*${pg + 1}\\s*$`) }).first();
    if (!(await nb.isVisible().catch(() => false))) break;
    await nb.click();
  }
  return { found, total: out.length, cards: out };
}

export default async ({ page }) => { await guard(page); return allCards(page); };
