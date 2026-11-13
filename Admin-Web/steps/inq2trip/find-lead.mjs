import { settle, table, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  const out = {};
  const s = page.locator('input[placeholder="Search Lead Info"]');
  for (const q of ['MWAG650153', 'LD-341']) {
    await s.fill(''); await s.fill(q); await settle(page, 2500);
    const t = await table(page, 10);
    out[q] = { rows: t?.rows.map(r => r.map(scrub)), empty: (await page.locator('text=/no (data|record|lead)/i').count()) > 0 };
  }
  // menu on the LD-341 row (inspect only: list the options, then close)
  const row = page.locator('tbody tr', { hasText: 'LD-341' }).first();
  if (await row.count()) {
    const btns = row.locator('td').last().locator('button, svg, [role=button]');
    out.actionEls = await row.locator('td').last().evaluate(td => td.innerHTML.slice(0, 600));
    await row.locator('td').last().locator('button, [role=button], svg').first().click();
    await page.waitForTimeout(1000);
    out.menu = (await page.locator('[role=menu]:visible, .dropdown-menu.show, ul:visible li').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(0, 20);
    out.shot = await snap(shot, 'S01-LD-341-menu');
  }
  return out;
};
