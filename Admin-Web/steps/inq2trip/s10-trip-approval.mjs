import { settle, scrub, snap } from './_lib.mjs';
const text = async page => scrub(await page.locator('body').innerText());
export default async ({ page, shot }) => {
  const net = []; page.on('response', r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) net.push(`${r.request().method()} ${new URL(r.url()).pathname} ${r.status()}`); });
  await page.goto(new URL('/dashboard/booking-management/upcoming-trips', page.url()).href, { waitUntil: 'domcontentloaded' }); await settle(page, 3500);
  const rows = page.locator('tbody tr', { hasText: 'Bikash N' });
  if ((await rows.count()) !== 1) return { blocked: 'Bikash N rows ' + await rows.count() };
  await rows.first().locator('td').last().locator('button:has(svg[data-testid=MoreVertIcon])').click();
  const item = page.locator('button:visible:text-is("Send To Trip Approval")'); await item.waitFor({ timeout: 8000 });
  await item.click(); await page.waitForTimeout(2000);
  const steps = [];
  for (let i = 0; i < 3; i++) {
    const t = await text(page);
    const s = await snap(shot, `S10-popup-${i + 1}`, { page });
    if (/Record Advance Payment\?/.test(t) && await page.locator('button:visible:text-is("No, Not Now")').count()) {
      if (!/B-932/.test(t)) return { steps, stop: 'advance popup is not for B-932', s };
      steps.push({ popup: 'Record Advance Payment? (B-932)', clicked: 'No, Not Now', s });
      await page.locator('button:visible:text-is("No, Not Now")').click(); await page.waitForTimeout(2000); continue;
    }
    const yes = page.locator('button:visible:text-is("Yes")');
    if ((await yes.count()) === 1) {
      const m = t.match(/[^.?!]{0,120}(trip approval|approval)[^.?!]{0,120}[.?!]?/i)?.[0];
      steps.push({ popup: m || 'confirmation with Yes', clicked: 'Yes', s });
      await yes.click(); break;
    }
    steps.push({ popup: 'unrecognised', s }); return { steps, net, stop: 'no recognised confirmation' };
  }
  const toasts = []; for (let i = 0; i < 16; i++) { await page.waitForTimeout(500); const t = (await page.locator('.Toastify__toast:visible, [role=alert]:visible').allInnerTexts()).filter(x => x.trim()); if (t.length) { toasts.push(...t); break; } }
  await settle(page, 3000);
  return { steps, toasts: toasts.map(scrub), net, stillListed: await page.locator('tbody tr', { hasText: 'Bikash N' }).count(), shot: await snap(shot, 'S10-after', { page }) };
};
