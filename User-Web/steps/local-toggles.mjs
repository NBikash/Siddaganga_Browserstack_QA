import { home, fields, toggle, toggleState } from './_local.mjs';
export default async ({ page, shot }) => {
  await home(page);
  const res = {};
  const snap = async k => { res[k] = { md: await toggleState(page, 'Multi-day Trip'), dd: await toggleState(page, 'Drop at different location'), fields: await fields(page), shot: await shot(`local/cfg-${k}`) }; };
  await snap('1-normal');
  await toggle(page, 'Multi-day Trip'); await snap('2-multiday');
  await toggle(page, 'Drop at different location'); await snap('4-multiday-dd');
  await toggle(page, 'Multi-day Trip'); await snap('3-dd');
  await toggle(page, 'Drop at different location'); await snap('1-back-to-normal');
  return res;
};
