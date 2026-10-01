#!/usr/bin/env node
// Run-log capture for App Live executions (standard for every run - see QA-RUN.md Â§3 "Reporting").
// The run log is the single source for the per-run results CSV, defect drafts and the HTML QA report.
//
//   node scripts/qa-log.mjs init   --platform android --run-id <id> --scope "Module: LOGIN, REG" \
//                                  --device "Google Pixel 7" --os 13 --build "app-release.apk v1.1 (uploaded APK)"
//   node scripts/qa-log.mjs case   --run <id> --json '{"id":"TC_LOGIN_002","status":"Pass","actual":"..."}'
//   node scripts/qa-log.mjs bug    --run <id> --json '{"id":"BUG-...","title":"...", ...}'
//   node scripts/qa-log.mjs cred   --run <id> --json '{"account":"QA One Time user","method":"Mobile + password"}'
//   node scripts/qa-log.mjs note   --run <id> --text "App Live input lag drops digits"
//   node scripts/qa-log.mjs approval --run <id> --text "Logout approved by user"
//   node scripts/qa-log.mjs finish --run <id>        (sets end time, then generates CSV + defects + HTML report)
//   node scripts/qa-log.mjs finish --run <id> --partial "reason"   (interim/partial report; run can be resumed and finished later)
//   Case fields for non-executed cases: status Blocked|Not Executed, blockCategory, dependency, attempted (true if started).
//   node scripts/qa-log.mjs checkpoint --run <id> --json '{"lastCompleted":"TC_X_001","current":"TC_X_002","next":"TC_X_003","state":"Home, logged in"}'
//   node scripts/qa-log.mjs recovery   --run <id> --json '{"issue":"...","detection":"...","actions":["..."],"outcome":"Recovered","affectedCase":"TC_X_002"}'
//   node scripts/qa-log.mjs show   --run <id>        (includes done case IDs + checkpoint, for resuming)
//
// --json accepts a JSON string or @path/to/file.json (case/bug also accept an array). Case/bug entries are upserted by id (fields merged).
// Never put passwords, OTPs, tokens or unmasked phone numbers/emails in the log.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATUSES = ['Pass', 'Fail', 'Blocked', 'Skipped', 'Not Executed'];

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      out[k] = v;
    } else out._.push(a);
  }
  return out;
}

export function findRunLog(runId) {
  for (const platform of ['android', 'ios']) {
    const f = join(ROOT, platform, 'results', runId, 'run-log.json');
    if (existsSync(f)) return f;
  }
  throw new Error(`run-log.json not found for run "${runId}" (run "init" first)`);
}

const load = (f) => JSON.parse(readFileSync(f, 'utf8'));
const save = (f, d) => writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
const now = () => new Date().toISOString();
function parseJson(v) {
  if (typeof v !== 'string') throw new Error('--json is required');
  return JSON.parse((v.startsWith('@') ? readFileSync(v.slice(1), 'utf8') : v).replace(/^\uFEFF/, ''));
}

function upsert(list, entry) {
  if (!entry.id) throw new Error('entry needs an "id"');
  const i = list.findIndex((e) => e.id === entry.id);
  if (i === -1) list.push(entry);
  else list[i] = { ...list[i], ...entry };
  return i === -1 ? 'added' : 'updated';
}

async function main() {
  const [cmd] = process.argv.slice(2);
  const a = args(process.argv.slice(3));

  if (cmd === 'init') {
    const platform = a.platform || 'android';
    if (!a['run-id']) throw new Error('--run-id is required');
    const dir = join(ROOT, platform, 'results', a['run-id']);
    const f = join(dir, 'run-log.json');
    if (existsSync(f)) { console.log(`exists: ${f}`); return; }
    mkdirSync(join(dir, 'defects'), { recursive: true });
    mkdirSync(join(ROOT, platform, 'evidence', a['run-id']), { recursive: true });
    save(f, {
      runId: a['run-id'], platform, scope: a.scope || '', build: a.build || '',
      device: a.device || '', osVersion: String(a.os || ''), executedBy: a.by || 'Claude Code (App Live via Claude in Chrome)',
      startedAt: a.started || now(), endedAt: null,
      credentials: [], approvals: [], environmentNotes: [], cases: [], bugs: [],
    });
    console.log(`created: ${f}`);
    return;
  }

  if (!a.run) throw new Error('--run <run-id> is required');
  const f = findRunLog(a.run);
  const log = load(f);

  switch (cmd) {
    case 'case': {
      const j = parseJson(a.json);
      for (const e of Array.isArray(j) ? j : [j]) {
        if (e.status && !STATUSES.includes(e.status)) throw new Error(`status must be one of ${STATUSES.join(', ')}`);
        if (!e.endedAt && e.status) e.endedAt = now();
        console.log(`${e.id}: ${upsert(log.cases, e)}`);
      }
      break;
    }
    case 'bug': { const j = parseJson(a.json); for (const e of Array.isArray(j) ? j : [j]) console.log(`${e.id}: ${upsert(log.bugs, e)}`); break; }
    case 'cred': log.credentials.push(parseJson(a.json)); console.log('credential usage recorded'); break;
    case 'note': log.environmentNotes.push(String(a.text)); console.log('note recorded'); break;
    case 'approval': log.approvals.push({ at: now(), text: String(a.text) }); console.log('approval recorded'); break;
    case 'checkpoint': {
      // Resumable position: {lastCompleted, current, next, state} - state = app/screen state needed to resume.
      log.checkpoint = { ...parseJson(a.json), at: now() };
      console.log(`checkpoint: last=${log.checkpoint.lastCompleted || '-'} current=${log.checkpoint.current || '-'} next=${log.checkpoint.next || '-'}`);
      break;
    }
    case 'recovery': {
      // Environment recovery event: {issue, detection, actions[], outcome (Recovered|Session recreated|Failed), affectedCase, durationSec}.
      log.recoveryEvents = log.recoveryEvents || [];
      const j = parseJson(a.json);
      for (const e of Array.isArray(j) ? j : [j]) log.recoveryEvents.push({ at: now(), ...e });
      console.log(`recovery events: ${log.recoveryEvents.length}`);
      break;
    }
    case 'show': {
      const c = {}; for (const s of log.cases) c[s.status] = (c[s.status] || 0) + 1;
      console.log(JSON.stringify({ runId: log.runId, cases: log.cases.length, byStatus: c, bugs: log.bugs.length,
        done: log.cases.map((x) => x.id), checkpoint: log.checkpoint || null, recoveryEvents: (log.recoveryEvents || []).length }, null, 2));
      return;
    }
    case 'finish': {
      log.endedAt = a.ended || now();
      log.partial = !!a.partial;
      if (a.partial && typeof a.partial === 'string') log.partialReason = a.partial;
      save(f, log);
      const { generate } = await import('./generate-report.mjs');
      const out = await generate(log.runId, { link: !!a.link });
      console.log(out.summary);
      return;
    }
    default: throw new Error(`unknown command "${cmd}"`);
  }
  save(f, log);
}

main().catch((e) => { console.error(`qa-log: ${e.message}`); process.exit(1); });
