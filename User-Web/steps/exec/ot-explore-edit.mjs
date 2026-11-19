// READ-ONLY: Edit Inquiry page of an existing inquiry — expand the Outstation journey card and list its editable controls.
// Nothing is saved: "Update Inquiry" is never clicked and update/save calls stay blocked by the guard.
import fs from 'node:fs';
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  const ID = process.env.INQ || 'DDEV675048';
  await L.guard(page);
  await L.myInquiries(page);
  const e0 = await L.openEdit(page, ID, 'XE');
  const out = { id: ID, before: e0.text.slice(0, 1500) };
  const hdr = page.locator('text=/Outstation Journey/').first();
  out.hdrFound = await hdr.count();
  if (out.hdrFound) { await hdr.click(); await page.waitForTimeout(2000); }
  out.controls = await page.locator('main, body').first().evaluate(root => {
    const t = e => (e.innerText || '').trim().replace(/\s+/g, ' ');
    const start = [...root.querySelectorAll('*')].find(e => /Journey Details/.test(e.innerText || '') && e.children.length < 6);
    const scope = start?.parentElement || root;
    return [...scope.querySelectorAll('input, select, textarea, button')].filter(e => e.getBoundingClientRect().width)
      .map(e => ({ tag: e.tagName, ph: e.placeholder || '', name: e.name || '', type: e.type, v: e.tagName === 'SELECT' ? e.options[e.selectedIndex]?.text : (e.type === 'checkbox' ? e.checked : e.value), text: t(e).slice(0, 40) }));
  });
  out.after = L.norm(await page.locator('body').innerText()).match(/Journey Details.*?(?=About Siddaganga)/)?.[0]?.slice(0, 2500);
  out.shot = await L.snap(page, 'XE-edit-journey-expanded', { fullPage: true });
  out.net = L.netLog.slice(-10);
  fs.writeFileSync('exploration-logs/raw/ot-explore-edit.json', JSON.stringify(out, null, 2));
  return out;
};
