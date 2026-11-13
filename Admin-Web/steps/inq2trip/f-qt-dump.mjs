// Dump the Update Inquiry form (labels -> values), cost table and buttons.
import { scrub, fsnap } from './_func.mjs';
export async function dump(page) {
  return page.evaluate(() => {
    const vis = e => e.getClientRects().length;
    const lab = e => { let p = e, l = ''; for (let i = 0; i < 6 && p && !l; i++) { p = p.parentElement; const c = p?.querySelector(':scope > label, :scope > p, :scope > span'); l = c && c !== e ? c.innerText : ''; } return (l || '').trim().slice(0, 45); };
    const fields = [...document.querySelectorAll('main input, main textarea')].filter(vis).filter(e => e.type !== 'file').map(e => ({ label: lab(e), n: e.name, t: e.type, v: ['checkbox','radio'].includes(e.type) ? e.checked : e.value, dis: e.disabled || e.readOnly }));
    const tbl = [...document.querySelectorAll('main table')].map(t => ({ h: [...t.querySelectorAll('thead th')].map(x => x.innerText.trim()), r: [...t.querySelectorAll('tbody tr')].map(r => [...r.querySelectorAll('td')].map(c => (c.querySelector('input')?.value ?? c.innerText).trim())) }));
    return { fields, tbl, buttons: [...document.querySelectorAll('main button')].filter(vis).map(b => b.innerText.trim()).filter(Boolean) };
  });
}
export default async ({ page, shot }) => { const d = await dump(page); d.fields = d.fields.filter(f => !/primaryContact|primaryEmail/.test(f.n) && f.label !== 'Search or Enter Client Name'); d.shot = await fsnap(shot, page, 'quote', 'QT-01-prefilled', { fullPage: true }); return d; };
