import { inqRow } from './inq-menu.mjs';
import { closeMenu } from './_i.mjs';
export default async ({ page }) => {
  const { row } = await inqRow(page, 'QRY-194');
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1200);
  const e = page.locator(':is(button,li,a,[role=menuitem]):visible').filter({ hasText: /^\s*Download Proforma Invoice\s*$/ });
  const info = await e.first().evaluate(x => { const ch = []; let p = x; for (let i = 0; i < 7 && p; i++) { ch.push(p.tagName + '.' + (p.className || '').toString().slice(0, 60) + (p.getAttribute('role') ? '[role=' + p.getAttribute('role') + ']' : '')); p = p.parentElement; } return ch; });
  await closeMenu(page);
  return { info, stillOpen: await e.count() };
};
