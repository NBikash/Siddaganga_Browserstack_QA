// Fast combined probe: drop validations, distance, passenger filtering, multi-day 1-date, hours effect.
import { home, panel, toggle, messages, place } from './_local.mjs';
import { cards } from './local-cards.mjs';
const S = async (page, cfg) => {
  await home(page); const p = panel(page);
  if (cfg.md) await toggle(page, 'Multi-day Trip');
  if (cfg.dd) await toggle(page, 'Drop at different location');
  const r = { cfg: cfg.id };
  if (cfg.pickup) r.pickup = (await place(page, 'Search pickup location', cfg.pickup)).chosen;
  if (cfg.drop) r.drop = (await place(page, 'Search drop location', cfg.drop, cfg.dropPick)).chosen;
  if (cfg.dates) for (const n of cfg.dates) { await p.locator('.day-content').filter({ hasText: new RegExp(`^${n}$`) }).first().click(); await page.waitForTimeout(250); }
  if (cfg.pax) await p.locator('input[placeholder="Enter number of passengers"]').fill(String(cfg.pax));
  if (cfg.hrs) await p.locator('input[placeholder="Enter Number of Hours"]').fill(String(cfg.hrs));
  await p.getByRole('button', { name: 'Book Now!' }).click();
  await page.waitForTimeout(4500);
  r.url = page.url().replace(process.env.USER_WEB_URL, '/');
  r.msgs = await messages(page);
  if (/send-inquiry/.test(page.url())) {
    r.found = await page.locator('text=/Buses Found/').first().innerText().catch(() => '');
    r.summary = (await page.locator('text=/Distance:/').first().locator('xpath=../..').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
    const c = await cards(page); r.page1 = c.map(x => `${x.name} ${x.code}`.trim() + ` ${x.seats}p ${x.price}`);
  }
  r.shot = await (await import('../scripts/lib.mjs')).shot(page, `local/scn-${cfg.id}`);
  return r;
};
export default async ({ page }) => {
  const list = JSON.parse(process.env.SCN);
  const out = [];
  for (const c of list) { try { out.push(await S(page, c)); } catch (e) { out.push({ cfg: c.id, error: String(e).split('\n')[0].slice(0, 160) }); } }
  return out;
};
