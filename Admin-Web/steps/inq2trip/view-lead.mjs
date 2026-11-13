import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const item = page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first();
  if (!(await item.count())) {
    const row = page.locator('tbody tr', { hasText: 'LD-341' }).first();
    await row.locator('td').last().locator('button').first().click(); await page.waitForTimeout(800);
  }
  await page.locator('button:visible').filter({ hasText: /^\s*View Lead\s*$/ }).first().click();
  await settle(page, 2500);
  const text = scrub(await page.locator('body').innerText());
  const i = text.indexOf('Inquiry Information');
  const m = text.match(/Inquiry PNR\s*:?\s*([A-Z0-9]+)/i);
  const lid = text.match(/\bLD-\d+\b/g);
  const inq = text.match(/Inquiry ID\s*:?\s*#?\s*(\d+)/i);
  return { url: page.url(), pnr: m?.[1] ?? null, leadIds: [...new Set(lid || [])], inquiryId: inq?.[1] ?? null,
    inquirySection: i >= 0 ? text.slice(i, i + 700) : text.slice(0, 900), shot: await snap(shot, 'S01-view-lead-pnr', { fullPage: true }) };
};
