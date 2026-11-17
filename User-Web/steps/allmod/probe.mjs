import * as ui from './ui.mjs';
export default async ({ page }) => {
  const which = process.env.P; const out = {};
  if (which === 'out') {
    await ui.open(page, 'Outstation');
    out.pick = await ui.place(page, 'Search pickup location', 'Whitefield', 'Bengaluru');
    out.d1 = await ui.place(page, 'Search destination 1 location', 'Mysuru');
    out.pd = await ui.setDate(page, '2026-11-20', 0); out.pt = await ui.setTime(page, '9:00 AM', 0);
    out.dd = await ui.setDate(page, '2026-11-21', 1); out.dt = await ui.setTime(page, '8:00 PM', 1);
    out.pax = await ui.num(page, 'Enter number of passengers', 4);
  } else if (which === 'p2p') {
    await ui.open(page, 'Transfer', 'Point To Point');
    out.from = await ui.place(page, 'Search pickup location', 'Whitefield', 'Bengaluru');
    out.to = await ui.place(page, 'Search drop location', 'Kempegowda International Airport');
    out.pd = await ui.setDate(page, '2026-11-20', 0); out.pt = await ui.setTime(page, '9:00 AM', 0);
    out.dates = await ui.pane(page).locator('input[value^="20"], input[value$="M"]').evaluateAll(a => a.map(e => e.value));
    out.pax = await ui.num(page, 'Enter number of passengers', 3);
  }
  out.search = await ui.submitSearch(page, `probe-${which}`);
  if (out.search.navigated && out.search.cards.length) {
    const code = out.search.cards[0].vehicle.split(' ').slice(-2).join(' ');
    out.code = code;
    out.details = await ui.details(page, out.search.cards[0].vehicle.split(' ').pop(), `probe-${which}`).catch(e => String(e));
    out.review = await ui.review(page, out.search.cards[0].vehicle.split(' ').pop(), `probe-${which}`).catch(e => String(e));
  }
  return out;
};
