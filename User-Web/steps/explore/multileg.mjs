import * as ui from '../allmod/ui.mjs';
const dump = page => page.evaluate(() => {
  const t = e => (e?.innerText || '').trim().replace(/\s+/g, ' ');
  const root = [...document.querySelectorAll('.tab-pane.active')].filter(e => e.getBoundingClientRect().height).pop() || document.body;
  return { text: t(root).slice(0, 900), fields: [...root.querySelectorAll('input,select,textarea,button')].filter(e => e.getBoundingClientRect().width)
    .map(e => `${e.tagName}:${e.type} ph="${e.placeholder || ''}" val="${(e.value || '').slice(0, 20)}" min=${e.min || ''} max=${e.max || ''} "${t(e).slice(0, 30)}"`) };
});
export default async ({ page, shot }) => {
  const out = {};
  await ui.open(page, 'Multi-Leg');
  const paxL = () => page.locator('xpath=//*[normalize-space(text())="Total Passengers"]/following::input[1]');
  for (const v of ['0', '-1', '2.5', 'abc', '200']) {
    await ui.open(page, 'Multi-Leg');
    await paxL().fill(v).catch(e => null);
    const typed = await paxL().inputValue();
    await page.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(1000);
    const d = await dump(page);
    out['pax_' + v] = { typed, msgs: await ui.msgs(page), advanced: !/Total Passengers/.test(d.text), stepText: d.text.slice(0, 160), shot: await shot('explore/multileg-pax-' + v.replace(/\W/g, '_')) };
  }
  await ui.open(page, 'Multi-Leg');
  await paxL().fill('5'); await page.getByRole('button', { name: 'Next' }).click(); await page.waitForTimeout(1500);
  out.step2 = await dump(page); out.s2 = await shot('explore/multileg-step2');
  await page.getByRole('button', { name: /Next|Book Now|Continue/ }).filter({ visible: true }).last().click().catch(() => {}); await page.waitForTimeout(1200);
  out.step2Empty = { msgs: await ui.msgs(page), shot: await shot('explore/multileg-step2-empty') };
  return out;
};
