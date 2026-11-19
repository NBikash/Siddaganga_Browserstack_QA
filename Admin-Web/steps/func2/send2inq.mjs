// LEA-010 transition for one lead (env LEAD): Search Lead Info -> row menu Send To Inquiry -> Update Quote (values unchanged).
// Then re-open the lead's menu to see whether Send To Inquiry is still offered (LEA-022 evidence).
import { go, settle, scrub, fsnap, toasts, netlog } from './_f.mjs';
const LEAD = process.env.LEAD;
const rowOf = page => page.locator('tbody tr').filter({ has: page.locator('td', { hasText: LEAD }) });
async function openMenu(page) {
  await go(page, '/dashboard/lead-management/total-lead');
  await page.locator('input[placeholder="Search Lead Info"]').fill(LEAD); await settle(page, 2000);
  await rowOf(page).first().waitFor({ timeout: 15000 }).catch(() => {}); await page.waitForTimeout(1000);
  const rows = rowOf(page); const n = await rows.count();
  const exact = [];
  for (let i = 0; i < n; i++) if ((await rows.nth(i).locator('td').nth(1).innerText()).trim() === LEAD) exact.push(i);
  if (exact.length !== 1) return { blocked: `rows for ${LEAD}: ${exact.length}` };
  const row = rows.nth(exact[0]);
  const rowText = scrub(await row.innerText());
  await row.locator('button:has(svg[data-testid=MoreVertIcon])').click(); await page.waitForTimeout(1000);
  const menu = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(x => ['View Lead', 'Send To Inquiry', 'Assign', 'Delete'].includes(x));
  return { rowText, menu };
}
export default async ({ page, shot }) => {
  const o = { lead: LEAD };
  const m = await openMenu(page); o.before = m; if (m.blocked) return o;
  if (!m.menu.includes('Send To Inquiry')) return { ...o, blocked: 'Send To Inquiry not in menu' };
  await page.locator('button:visible:text-is("Send To Inquiry")').click();
  await page.waitForURL(/update-inquiry/, { timeout: 20000 }).catch(() => {}); await settle(page, 3000);
  o.url = page.url().replace(/^https?:\/\/[^/]+/, '');
  o.shotForm = await fsnap(shot, page, 'lead', `LEA-010-${LEAD}-update-quote-form`, { fullPage: true });
  const net = netlog(page);
  const btn = page.locator('main button:visible').filter({ hasText: /^\s*Update Quote\s*$/ });
  o.updateBtn = await btn.count();
  if (o.updateBtn !== 1) return { ...o, blocked: 'Update Quote button count ' + o.updateBtn };
  await btn.click(); o.toasts = await toasts(page, 8000); await settle(page, 3000);
  o.net = net; o.urlAfter = page.url().replace(/^https?:\/\/[^/]+/, '');
  o.shotAfter = await fsnap(shot, page, 'lead', `LEA-010-${LEAD}-after-update-quote`);
  const m2 = await openMenu(page); o.after = m2;
  o.shotMenuAfter = await fsnap(shot, page, 'lead', `LEA-022-${LEAD}-menu-after-send`);
  await page.keyboard.press('Escape');
  return o;
};
