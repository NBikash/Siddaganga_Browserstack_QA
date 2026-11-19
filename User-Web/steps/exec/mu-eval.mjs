// Read-only ad-hoc step for Multi-Leg exploration: EVAL=<async body with (page, M, L)>. Network guard on (no submit/draft).
import * as M from './mu-lib.mjs';
const { L } = M;
export default async ({ page }) => {
  await L.guard(page);
  const AsyncFn = Object.getPrototypeOf(async () => {}).constructor;
  let out; try { out = await new AsyncFn('page', 'M', 'L', process.env.EVAL)(page, M, L); } catch (e) { out = { error: String(e).split(String.fromCharCode(10))[0], modals: await page.locator('.modal.show').allInnerTexts().catch(() => []), shot: await M.snap(page, 'MU-EVAL-error') }; }
  return { out, net: L.netLog.filter(l => !/GET|GetViewport|crypto|fcm|popular|explore-fleet/.test(l)).slice(-25) };
};
