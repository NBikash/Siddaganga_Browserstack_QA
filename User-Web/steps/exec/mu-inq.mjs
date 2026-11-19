// Read-only: list My Inquiries and Drafts; look for Multi-Leg records. Guard on; no clicks that change data.
import * as L from './ot-lib.mjs';
export default async ({ page }) => {
  await L.guard(page);
  const r = await L.myInquiries(page, 'MU-PROBE');
  const types = {}; r.parsed.forEach(p => { types[p.type || 'raw'] = (types[p.type || 'raw'] || 0) + 1; });
  const tabs = await page.evaluate(() => [...document.querySelectorAll('a,button,[role=tab],li')].filter(e => e.getBoundingClientRect().width && /draft|inquir|booking|trip/i.test(e.innerText || '') && (e.innerText || '').length < 40).map(e => (e.innerText || '').trim()));
  return { total: r.total, types, multi: r.parsed.filter(p => !/^(Local|Outstation|Transfer)$/.test(p.type || '')).slice(0, 10), first: r.rows.slice(0, 3), tabs: [...new Set(tabs)], shot: r.shot };
};
