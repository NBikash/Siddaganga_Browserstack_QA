// Read-only probe of the Multi-Leg module. Network guard on: save/submit/draft calls are blocked. Nothing is submitted.
// PROBE=<stage>; optional EVAL=<js body run with (page, pane, L)> for ad-hoc read-only steps.
import * as L from './ot-lib.mjs';
export const pane = page => page.locator('#home-inquiry-tabs-tabpane-fourth');
export const dump = (loc) => loc.evaluate(root => [...root.querySelectorAll('input,button,select,textarea,label,[role=tab],a.nav-link,h1,h2,h3,h4,h5,h6,.invalid-feedback,.text-danger,[class*=error],[class*=chip],[class*=leg]')]
  .filter(e => e.getBoundingClientRect().width)
  .map(e => `${e.tagName}${e.type ? ':' + e.type : ''}${e.id ? '#' + e.id : ''}${e.name ? ' n=' + e.name : ''} ph=${e.placeholder || ''} v=${(e.value || '').slice(0, 40)}${e.min ? ' min=' + e.min : ''}${e.max ? ' max=' + e.max : ''}${e.disabled ? ' DIS' : ''}${e.checked ? ' CHK' : ''} t=${(e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70)} c=${String(e.className).slice(0, 45)}`));
export async function openMulti(page) {
  await L.guard(page);
  await L.home(page, 'Transfer');
  await page.locator('#home-inquiry-tabs-tab-fourth').evaluate(e => e.click()); await page.waitForTimeout(1500);
}
export default async ({ page }) => {
  await openMulti(page);
  const p = pane(page);
  const out = { exists: await p.count() };
  if (process.env.EVAL) {
    const AsyncFn = Object.getPrototypeOf(async () => {}).constructor;
    out.eval = await new AsyncFn('page', 'pane', 'L', process.env.EVAL)(page, p, L);
  } else {
    out.form = await dump(p);
    out.text = L.norm(await p.innerText().catch(() => ''));
  }
  out.shot = await L.snap(page, `MU-PROBE-${process.env.PROBE || 'form'}`, { fullPage: true });
  out.net = L.netLog.filter(l => !/GET/.test(l)).slice(-30);
  return out;
};
