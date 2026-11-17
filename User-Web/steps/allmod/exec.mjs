// Execute test cases: RUN_ID=<id> IDS='TC_LOC_,TC_OUT_003' node scripts/run.mjs steps/allmod/exec.mjs
// Each result → results/<RUN_ID>/<TC>.json. Exceptions are recorded as status "Error" for manual triage (never auto-Pass/Fail).
import fs from 'node:fs';
import path from 'node:path';
import { CASES as B } from './cases-booking.mjs';
import { CASES as S } from './cases-site.mjs';
import * as ui from './ui.mjs';
export const ALL = [...S, ...B];
export default async ({ page, context }) => {
  const sel = (process.env.IDS || '').split(',').filter(Boolean);
  const list = ALL.filter(c => !sel.length || sel.some(s => c.id.startsWith(s)));
  const skipDone = process.env.SKIP_DONE === '1';
  const dir = path.resolve('results', ui.RUN); fs.mkdirSync(dir, { recursive: true });
  const summary = [];
  for (const c of list) {
    const file = path.join(dir, `${c.id}.json`);
    if (skipDone && fs.existsSync(file) && JSON.parse(fs.readFileSync(file)).status !== 'Error') continue;
    const t0 = Date.now(); let r;
    try { r = await c.run({ page, context, shot: (n, o) => ui.snap(page, n, o) }); }
    catch (e) { r = { status: 'Error', error: String(e).split('\n')[0].slice(0, 400), evidence: [await ui.snap(page, `${c.id}-error`).catch(() => null)].filter(Boolean), checks: [] };
      await page.keyboard.press('Escape').catch(() => {}); await page.setViewportSize({ width: 1440, height: 900 }).catch(() => {}); }
    const { run, ...meta } = c;
    const rec = { ...meta, ...r, durationSec: Math.round((Date.now() - t0) / 1000), executedAt: new Date().toISOString() };
    fs.writeFileSync(file, JSON.stringify(rec, null, 2));
    summary.push(`${c.id} ${rec.status}${rec.error ? ' :: ' + rec.error.slice(0, 120) : ''}${(rec.checks || []).filter(x => !x.pass).map(x => ` ✗${x.label}: ${x.detail.slice(0, 90)}`).join('')}`);
    console.error(summary.at(-1));
  }
  return summary.join('\n');
};
