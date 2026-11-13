import { settle, scrub, snap } from './_lib.mjs';
export default async ({ page, shot }) => {
  if (!/Trip Number\s*:\s*TP-111/.test(await page.locator('main').innerText())) return { stop: 'not on TP-111 allocation' };
  const card = await page.evaluate(() => {
    const leafs = [...document.querySelectorAll('main *')].filter(e => e.children.length === 0 && /^Bus Category:/.test(e.innerText || '') === false && (e.innerText || '').trim() === 'KA21AB9876');
    return leafs.length;
  });
  // the vehicle tile containing KA21AB9876 and a checkbox
  const tile = page.locator('main div').filter({ hasText: /KA21AB9876/ }).filter({ has: page.locator('input[type=checkbox]') }).last();
  const boxes = tile.locator('input[type=checkbox]');
  const n = await boxes.count();
  const tileText = scrub(await tile.evaluate(e => { let p = e; for (let i = 0; i < 4 && p && !/Bus Category/.test(p.innerText); i++) p = p.parentElement; return p.innerText; })).replace(/\s+/g, ' ').slice(0, 200);
  if (n !== 1 || !/^KA21AB9876 Bus Category: Sedan /.test(tileText)) return { stop: `tile checkboxes ${n}`, tileText, card };
  await boxes.check(); await page.waitForTimeout(1500);
  return { tileText, checked: await boxes.isChecked(), buttons: (await page.locator('main button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean), status: (await page.locator('main').innerText()).match(/Bus Assigned Status for this Trip : [^\n]+/)?.[0], shot: await snap(shot, 'S13-vehicle-selected', { page }) };
};
