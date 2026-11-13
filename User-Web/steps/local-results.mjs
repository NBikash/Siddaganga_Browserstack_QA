// Read the /send-inquiry results page currently open: vehicle cards, filters, buttons.
import { guard } from './_local.mjs';
export default async ({ page, shot }) => {
  await guard(page);
  const cards = await page.evaluate(() => {
    const t = e => (e?.innerText || '').replace(/\s+/g, ' ').trim();
    const heads = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /\bSeater\b|Sedan|SUV|MPV|Urbania|Tempo/i.test(e.textContent) && e.textContent.length < 60);
    const names = [...new Set(heads.map(t))];
    const buttons = [...document.querySelectorAll('button, a.btn, [role=button]')].filter(b => b.getBoundingClientRect().width).map(t).filter(Boolean);
    const count = [...document.querySelectorAll('*')].map(t).find(s => /Buses Found/.test(s) && s.length < 80);
    return { count, names: names.slice(0, 80), buttons: [...new Set(buttons)].slice(0, 80) };
  });
  return { url: page.url(), ...cards, shot: await shot('local/results-01', { fullPage: true }) };
};
