// READ-ONLY: card buttons on results after Modify Inquiry → Save! (no submission; saves blocked)
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  await L.guard(page);
  await L.fill(page, { pickup: ['Whitefield', 'Whitefield'], dests: [['Mysuru', 'Mysuru']], dates: ['2026-12-20', '2026-12-21'], times: ['9:00 AM', '8:00 PM'], pax: 5 });
  await L.search(page, 'PROBE2');
  const btns = () => page.evaluate(() => [...new Set([...document.querySelectorAll('button')].map(b => (b.innerText || '').trim()).filter(t => /Book|Select|Proceed|Vehicle|Added|Remove/i.test(t)))]);
  const before = await btns();
  await L.modifyOpen(page, 'PROBE2'); await L.setToggle(page, 'Drop at different location', false); await L.setToggle(page, 'Multi-day Trip', false);
  await L.place(page, 'Search destination 1 location', 'Mysuru', 'Mysuru');
  const r = await L.modifySave(page, 'PROBE2-after');
  const after = await btns();
  const legs = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /^Leg/.test(t)));
  return { before, after, legs, found: r.found, shot: await L.snap(page, 'PROBE2-cards-after-modify', { fullPage: true }) };
};
