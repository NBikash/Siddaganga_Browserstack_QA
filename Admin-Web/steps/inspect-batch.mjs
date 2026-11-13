// Runs steps/inspect.mjs for every entry in steps/screens.json (or the keys given as args), sequentially.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const screens = JSON.parse(fs.readFileSync('steps/screens.json', 'utf8'));
const shardArg = process.argv.find(a => a.startsWith('--shard='));
const [shard, shards] = shardArg ? shardArg.slice(8).split('/').map(Number) : [0, 1];
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
const done = new Set(fs.existsSync('exploration-logs/raw/inspect') ? fs.readdirSync('exploration-logs/raw/inspect').map(f => f.replace(/\.json$/, '')) : []);
for (const [i, s] of screens.entries()) {
  if (i % shards !== shard) continue;
  if (only.length ? !only.includes(s.key) : done.has(s.key)) continue;
  const r = spawnSync(process.execPath, ['scripts/run.mjs', 'steps/inspect.mjs'], { env: { ...process.env, ADMIN_WEB_NEW_PAGE: '1', INSPECT: JSON.stringify(s) }, encoding: 'utf8', timeout: 900000 });
  const out = (r.stdout || '') + (r.status ? `\n!! exit ${r.status} ${(r.stderr || '').split('\n').slice(0, 3).join(' ')}` : '');
  fs.appendFileSync(`exploration-logs/raw/inspect-batch-${shard}.log`, `\n===== ${s.key}\n${out}\n`);
  console.log(`${s.key}: ${r.status === 0 ? 'ok' : 'FAILED'}`);
}
