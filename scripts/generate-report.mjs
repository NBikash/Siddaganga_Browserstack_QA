#!/usr/bin/env node
// Standard end-of-run reporting (QA-RUN.md §3 "Reporting"). From <platform>/results/<run-id>/run-log.json it writes:
//   <platform>/results/<run-id>.csv                  per-run results (testing/templates/results-template.csv columns)
//   <platform>/results/<run-id>/defects/<BUG>.md     defect drafts (never submitted anywhere)
//   <platform>/reports/<run-id>/qa-report.html       self-contained HTML QA report (screenshots embedded)
//
//   node scripts/generate-report.mjs --run <run-id> [--link]
//   (--link references screenshots by relative path instead of embedding them)
//
// Case details not given in the log (scenario, steps, expected, type, priority...) are taken from the platform's
// test-case inventory. Secrets from .env are redacted from every output as a safety net.
// Runs of other apps (run-log "app", e.g. saagane) use that app's inventory and config paths instead of <platform>/...
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DEFAULT_APP, appInfo, appConfig, runPaths, findRunLogFile } from '../setup/lib/common.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const STATUS_ORDER = ['Pass', 'Fail', 'Blocked', 'Skipped', 'Not Executed'];
const EDGE_TYPES = ['Boundary', 'Validation', 'Negative', 'Security', 'Error handling', 'Edge'];

// ---------- helpers ----------
export function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x !== ''));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
const csvCell = (v) => { const s = String(v ?? ''); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(1)}%` : '—');
function fmtDur(ms) {
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const s = Math.round(ms / 1000); const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${m}m` : m ? `${m}m ${s % 60}s` : `${s}s`;
}
function fmtTime(iso, tz = 'Asia/Kolkata') {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', { timeZone: tz, dateStyle: 'medium', timeStyle: 'medium' }) + ' IST';
}
function secretsFromEnv() {
  const f = join(ROOT, '.env'); const out = [];
  if (!existsSync(f)) return out;
  for (const line of readFileSync(f, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) { const v = m[2].replace(/^(['"])(.*)\1$/, '$2').trim(); if (v.length >= 4) out.push(v); }
  }
  for (const k of ['BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_USERNAME']) if (process.env[k]?.length >= 4) out.push(process.env[k]);
  return out;
}
function redactor() {
  const secrets = secretsFromEnv().sort((a, b) => b.length - a.length);
  return (s) => { let t = String(s); for (const v of secrets) t = t.split(v).join('[REDACTED]'); return t; };
}
function findRunLog(runId, app) {
  const f = findRunLogFile(runId, app);
  if (f) return f;
  throw new Error(`run-log.json not found for run "${runId}"`);
}
const appOf = (log) => log.app || DEFAULT_APP;
const dirsOf = (log) => runPaths(log.platform, appOf(log));
function loadInventory(platform, app = DEFAULT_APP) {
  const cfg = app === DEFAULT_APP
    ? JSON.parse(readFileSync(join(ROOT, 'config', `${platform}.json`), 'utf8'))
    : appConfig(app, platform);
  const rel = cfg.testCases?.inventoryCsv || (platform === 'ios' && app === DEFAULT_APP ? 'ios/test-cases/banni-ios-test-cases.csv' : null);
  if (!rel || !existsSync(join(ROOT, rel))) return { map: new Map(), path: rel };
  const rows = parseCsv(readFileSync(join(ROOT, rel), 'utf8'));
  return { map: new Map(rows.map((r) => [r['TC ID'], r])), path: rel, count: rows.length };
}

// ---------- model ----------
function buildModel(log) {
  const inv = loadInventory(log.platform, appOf(log));
  const cases = log.cases.map((c) => {
    const r = inv.map.get(c.id) || {};
    const t0 = Date.parse(c.startedAt); const t1 = Date.parse(c.endedAt);
    return {
      ...c,
      isNew: !!c.isNew || (!inv.map.has(c.id) && c.isNew !== false),
      module: c.module || r['Module'] || c.id.split('_')[1],
      moduleCode: c.id.split('_')[1],
      feature: c.feature || r['Feature / Screen'] || r['Submodule / Screen'] || '',
      scenario: c.scenario || r['Scenario'] || r['Test Scenario'] || '',
      testType: c.testType || r['Test Type'] || '',
      priority: c.priority || r['Priority'] || '',
      preconditions: c.preconditions || r['Preconditions'] || '',
      steps: c.steps || r['Test Steps'] || '',
      testData: c.testData || r['Test Data'] || '',
      expected: c.expected || r['Expected Result'] || '',
      evidence: c.evidence || [], bugs: c.bugs || [],
      durationMs: Number.isFinite(t0) && Number.isFinite(t1) ? t1 - t0 : NaN,
    };
  }).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
  return { log, inv, cases, bugs: log.bugs || [] };
}

function tally(list) {
  const t = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));
  for (const c of list) t[c.status] = (t[c.status] || 0) + 1;
  t.total = list.length; t.executed = t.Pass + t.Fail;
  return t;
}
function groupBy(list, key) {
  const m = new Map();
  for (const x of list) { const k = typeof key === 'function' ? key(x) : x[key]; if (!m.has(k)) m.set(k, []); m.get(k).push(x); }
  return m;
}

// ---------- outputs ----------
function writeResultsCsv(model, platform, red) {
  const { log, cases } = model;
  const tpl = join(ROOT, 'testing', 'templates', 'results-template.csv');
  const head = readFileSync(tpl, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/)[0].split(',');
  const val = (c, h) => ({
    'Run ID': log.runId, 'TC ID': c.id, 'Module': c.module, 'Scenario': c.scenario, 'Priority': c.priority,
    'Status': c.status, 'Actual Result': c.actual, 'Evidence': c.evidence.join('; '), 'Defect Draft': c.bugs.join('; '),
    'Device': log.device, 'OS Version': log.osVersion, 'Build': log.build, 'Executed By': log.executedBy,
    'Executed At': c.endedAt || '', 'Notes': [c.isNew ? 'NEW case (discovered this run)' : '', c.notes].filter(Boolean).join(' | '),
  }[h] ?? '');
  const out = [head.join(','), ...cases.map((c) => head.map((h) => csvCell(red(val(c, h)))).join(','))].join('\r\n') + '\r\n';
  const f = join(ROOT, dirsOf(log).results, `${log.runId}.csv`);
  writeFileSync(f, '\uFEFF' + out);
  return f;
}

function writeDefectDrafts(model, platform, red) {
  const { log, bugs } = model; const dir = join(ROOT, dirsOf(log).results, log.runId, 'defects');
  mkdirSync(dir, { recursive: true });
  for (const b of bugs) {
    const md = `# ${b.id} — ${b.title}

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
${appOf(log) === DEFAULT_APP ? '' : `| App | ${log.appName || appInfo(log.app).name} |
`}| Platform | ${platform === 'ios' ? 'iOS' : 'Android'} |
| Test case | ${(b.tcIds || []).join(', ')} |
| Module | ${b.module || ''} |
| Severity (proposed) | ${b.severity || ''} |
| Priority (proposed) | ${b.priority || ''} |
| Status | ${b.status || 'New (draft)'} |
| Build | ${log.build} |
| Device / OS | ${log.device} / Android ${log.osVersion} (BrowserStack App Live) |
| Run ID | ${log.runId} |
| Test account | ${b.account || 'Not required'} |
| Reproducibility | ${b.reproducibility || ''} |

## Preconditions
${b.preconditions || '-'}

## Steps to reproduce
${(b.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Expected result
${b.expected || ''}

## Actual result
${b.actual || ''}

## Evidence
${(b.evidence || []).map((e) => `- \`${dirsOf(log).evidence}/${log.runId}/${e}\``).join('\n') || '-'}

## Error / API / log information
${b.errorInfo || '-'}

## Notes / suspected area
${b.notes || '-'}
`;
    writeFileSync(join(dir, `${b.id}.md`), red(md));
  }
  return dir;
}

function imgTag(evidenceDir, runId, file, reportDir, link) {
  const abs = join(ROOT, evidenceDir, runId, file);
  if (!existsSync(abs)) return `<div class="missing">Missing evidence file: ${esc(file)}</div>`;
  const src = link
    ? relative(reportDir, abs).split('\\').join('/')
    : `data:image/${extname(file).slice(1).replace('jpg', 'jpeg')};base64,${readFileSync(abs).toString('base64')}`;
  return `<figure><a href="${src}" target="_blank" rel="noopener"><img loading="lazy" src="${src}" alt="${esc(file)}"></a><figcaption>${esc(file)}</figcaption></figure>`;
}

const badge = (s) => `<span class="badge s-${slug(s)}">${esc(s)}</span>`;
const sevBadge = (s) => `<span class="badge sev-${slug(s || 'na')}">${esc(s || '—')}</span>`;
const lines = (s) => esc(s).replace(/\s(?=\d+\.\s)/g, '<br>');

function renderHtml(model, platform, reportDir, link) {
  const { log, cases, bugs, inv } = model;
  const t = tally(cases);
  const existing = cases.filter((c) => !c.isNew); const fresh = cases.filter((c) => c.isNew);
  const edge = cases.filter((c) => EDGE_TYPES.includes(c.testType) || c.edge);
  const bugById = new Map(bugs.map((b) => [b.id, b]));
  const sevCount = groupBy(bugs, (b) => b.severity || 'Unrated');
  const img = (f) => imgTag(dirsOf(log).evidence, log.runId, f, reportDir, link);
  const runMs = Date.parse(log.endedAt) - Date.parse(log.startedAt);
  const notExec = cases.filter((c) => !['Pass', 'Fail'].includes(c.status));
  const logged = cases.filter((c) => ['Pass', 'Fail'].includes(c.status) || c.attempted);
  const partialBanner = log.partial || notExec.length
    ? `<div class="banner${log.partial ? ' partial' : ''}"><b>${log.partial ? esc(log.interimLabel || 'PARTIAL EXECUTION') : 'Execution incomplete for some cases'}</b> — ${t.executed} of ${t.total} cases executed (Pass/Fail); ${notExec.length} not executed (${t.Blocked} Blocked, ${t['Not Executed'] + t.Skipped} Not Executed / pending). ${log.partial && log.partialReason ? esc(log.partialReason) : ''} Not-executed cases are never counted as Passed or Failed — see <a href="#notexec">8. Not Executed Cases</a>.</div>`
    : '';
  const notExecRows = notExec.map((c) => `<tr><td><a href="#case-${esc(c.id)}">${esc(c.id)}</a> ${c.isNew ? '<span class="badge new">NEW</span>' : ''}</td><td>${esc(c.scenario)}</td><td>${badge(c.status)}</td><td>${esc(c.blockCategory || '')}</td><td>${esc(c.actual || c.notes || '')}</td><td>${esc(c.dependency || '-')}</td></tr>`).join('');
  const notExecByCat = [...groupBy(notExec, (c) => c.blockCategory || 'Uncategorised')].map(([k, l]) => `<tr><td>${esc(k)}</td><td>${l.filter((c) => c.status === 'Blocked').length}</td><td>${l.filter((c) => c.status !== 'Blocked').length}</td><td>${l.map((c) => esc(c.id)).join(', ')}</td></tr>`).join('');

  const statCard = (label, n, cls, sub = '') => `<div class="stat ${cls}"><div class="n">${n}</div><div class="l">${label}</div>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
  const breakdownRows = (m) => [...m].map(([k, list]) => { const x = tally(list); return `<tr><td>${esc(k)}</td><td>${x.total}</td><td>${x.executed}</td><td>${x.Pass}</td><td>${x.Fail}</td><td>${x.Blocked}</td><td>${x.Skipped + x['Not Executed']}</td><td>${pct(x.executed, x.total)}</td><td>${pct(x.Pass, x.executed)}</td></tr>`; }).join('');
  const breakdownHead = '<tr><th>Group</th><th>Total</th><th>Executed</th><th>Pass</th><th>Fail</th><th>Blocked</th><th>Skipped / Not Exec.</th><th>Execution coverage</th><th>Pass rate</th></tr>';

  const moduleTimes = [...groupBy(cases.filter((c) => c.startedAt && c.endedAt), 'module')].map(([m, list]) => {
    const s = Math.min(...list.map((c) => Date.parse(c.startedAt))); const e = Math.max(...list.map((c) => Date.parse(c.endedAt)));
    const active = list.reduce((a, c) => a + (Number.isFinite(c.durationMs) ? c.durationMs : 0), 0);
    return `<tr><td>${esc(m)}</td><td>${list.length}</td><td>${fmtTime(new Date(s).toISOString())}</td><td>${fmtTime(new Date(e).toISOString())}</td><td>${fmtDur(active)}</td></tr>`;
  }).join('');

  const bugDetail = bugs.map((b) => `
  <article class="bug" id="${esc(b.id)}">
    <header><h3>${esc(b.id)} — ${esc(b.title)}</h3><div>${sevBadge(b.severity)} <span class="badge prio">${esc(b.priority || '')}</span> <span class="badge st">${esc(b.status || 'New (draft)')}</span></div></header>
    <table class="kv">
      ${b.issueType ? `<tr><th>Issue type</th><td>${esc(b.issueType)}</td></tr>` : ''}
      <tr><th>Module</th><td>${esc(b.module || '')}</td></tr>
      ${b.description ? `<tr><th>Description</th><td>${esc(b.description)}</td></tr>` : ''}
      <tr><th>Related test cases</th><td>${(b.tcIds || []).map((id) => `<a href="#case-${esc(id)}">${esc(id)}</a>`).join(', ')}</td></tr>
      <tr><th>Environment</th><td>${esc(log.device)} / Android ${esc(log.osVersion)} — BrowserStack App Live (real device)<br>Build: ${esc(log.build)}</td></tr>
      <tr><th>Test account</th><td>${esc(b.account || 'Not required (logged-out flow)')}</td></tr>
      <tr><th>Reproducibility</th><td>${esc(b.reproducibility || '')}</td></tr>
      <tr><th>Preconditions</th><td>${esc(b.preconditions || '-')}</td></tr>
      <tr><th>Steps to reproduce</th><td><ol>${(b.steps || []).map((s) => `<li>${esc(s)}</li>`).join('')}</ol></td></tr>
      <tr><th>Expected result</th><td>${esc(b.expected || '')}</td></tr>
      <tr><th>Actual result</th><td>${esc(b.actual || '')}</td></tr>
      <tr><th>Error / API / log info</th><td>${esc(b.errorInfo || '-')}</td></tr>
      ${b.notes ? `<tr><th>Notes</th><td>${esc(b.notes)}</td></tr>` : ''}
    </table>
    <div class="shots">${(b.evidence || []).map(img).join('') || '<p class="muted">No screenshot captured.</p>'}</div>
  </article>`).join('');

  // Optional sections (rendered only when the run log has them): assumptions/questions and UI/UX findings.
  const assumptions = log.assumptions || []; const questions = log.questions || []; const ux = log.uxFindings || [];
  const approvals = log.pendingApprovals || []; const gaps = log.coverageGaps || [];
  const extraNav = (assumptions.length || questions.length || approvals.length || gaps.length ? '<a href="#clarify">9. Assumptions, questions &amp; approvals</a>' : '')
    + (ux.length ? '<a href="#ux">10. UI/UX findings</a>' : '')
    + (log.showInventory ? '<a href="#inventory">11. Test inventory</a>' : '');
  // Optional inventory section (log.showInventory): totals and module x priority of the app's inventory CSV.
  let inventorySection = '';
  if (log.showInventory && inv.map.size) {
    const all = [...inv.map.values()]; const prios = [...new Set(all.map((r) => r['Priority']))].sort();
    const byMod = groupBy(all, (r) => r['Module']);
    const runIds = new Set(cases.map((c) => c.id));
    inventorySection = `
<section id="inventory"><h2>11. Test-Case Inventory</h2>
<div class="stats">${statCard('Inventory cases', all.length, '')}${statCard('Modules', byMod.size, '')}${statCard('In this run', all.filter((r) => runIds.has(r['TC ID'])).length, '')}${statCard('New cases this run', fresh.length, 'new')}</div>
<p class="muted">Source: <code>${esc(inv.path || '')}</code> (CSV is the source of truth; the XLSX is generated from it).</p>
<div class="tw"><table><tr><th>Module</th><th>Total</th>${prios.map((p) => `<th>${esc(p)}</th>`).join('')}<th>In this run</th></tr>
${[...byMod].map(([m, l]) => `<tr><td>${esc(m)}</td><td>${l.length}</td>${prios.map((p) => `<td>${l.filter((r) => r['Priority'] === p).length}</td>`).join('')}<td>${l.filter((r) => runIds.has(r['TC ID'])).length}</td></tr>`).join('')}
<tr><th>Total</th><th>${all.length}</th>${prios.map((p) => `<th>${all.filter((r) => r['Priority'] === p).length}</th>`).join('')}<th>${all.filter((r) => runIds.has(r['TC ID'])).length}</th></tr></table></div></section>`;
  }
  const listRows = (l) => l.map((x) => `<tr><td>${esc(x.id || '')}</td><td>${esc(x.text || '')}</td><td>${(x.tcIds || []).map((id) => `<a href="#case-${esc(id)}">${esc(id)}</a>`).join(', ')}</td></tr>`).join('');
  const clarifySection = assumptions.length || questions.length || approvals.length || gaps.length ? `
<section id="clarify"><h2>9. Assumptions, Open Questions, Pending Approvals &amp; Coverage Gaps</h2>
${approvals.length ? `<h3>Pending approvals</h3><div class="tw"><table><tr><th>ID</th><th>Action requiring approval</th><th>Proposed target / condition</th><th>Cases</th></tr>${approvals.map((x) => `<tr><td>${esc(x.id || '')}</td><td>${esc(x.text || '')}</td><td>${esc(x.target || '')}</td><td>${(x.tcIds || []).map((id) => `<a href="#case-${esc(id)}">${esc(id)}</a>`).join(', ')}</td></tr>`).join('')}</table></div>` : ''}
${gaps.length ? `<h3 style="margin-top:14px">Coverage gaps</h3><div class="tw"><table><tr><th>ID</th><th>Gap</th><th>Related cases</th></tr>${listRows(gaps)}</table></div>` : ''}
<p class="muted">Not reported as defects: expected behaviour that could not be confirmed from the build and needs a product decision.</p>
${assumptions.length ? `<h3>Assumptions</h3><div class="tw"><table><tr><th>ID</th><th>Assumption</th><th>Related cases</th></tr>${listRows(assumptions)}</table></div>` : ''}
${questions.length ? `<h3 style="margin-top:14px">Questions for confirmation</h3><div class="tw"><table><tr><th>ID</th><th>Question</th><th>Related cases</th></tr>${listRows(questions)}</table></div>` : ''}</section>` : '';
  const uxSection = ux.length ? `
<section id="ux"><h2>10. UI/UX Findings &amp; Recommendations</h2>
<div class="tw"><table><tr><th>ID</th><th>Area</th><th>Finding</th><th>Recommendation</th><th>Priority</th><th>Related</th></tr>
${ux.map((x) => `<tr><td>${esc(x.id || '')}</td><td>${esc(x.area || '')}</td><td>${esc(x.finding || '')}</td><td>${esc(x.recommendation || '')}</td><td>${esc(x.priority || '')}</td><td>${[...(x.tcIds || []).map((id) => `<a href="#case-${esc(id)}">${esc(id)}</a>`), ...(x.bugs || []).map((id) => `<a href="#${esc(id)}">${esc(id)}</a>`)].join(', ')}</td></tr>`).join('')}
</table></div>${ux.some((x) => (x.evidence || []).length) ? `<div class="shots">${ux.flatMap((x) => x.evidence || []).map(img).join('')}</div>` : ''}</section>` : '';

  const scenarioLog = logged.map((c) => `
  <article class="case st-${slug(c.status)}" id="case-${esc(c.id)}" data-status="${esc(c.status)}">
    <header><h3>${esc(c.id)} — ${esc(c.scenario)}</h3><div>${badge(c.status)} ${c.isNew ? '<span class="badge new">NEW</span>' : ''}</div></header>
    <table class="kv">
      <tr><th>Module / screen</th><td>${esc(c.module)} — ${esc(c.feature)}</td></tr>
      <tr><th>Type / priority</th><td>${esc(c.testType)} / ${esc(c.priority)}</td></tr>
      <tr><th>Preconditions</th><td>${esc(c.preconditions)}</td></tr>
      <tr><th>Steps</th><td>${lines(c.steps)}</td></tr>
      ${c.testData && c.testData !== '-' ? `<tr><th>Test data</th><td>${esc(c.testData)}</td></tr>` : ''}
      <tr><th>Expected</th><td>${esc(c.expected)}</td></tr>
      <tr><th>Actual</th><td>${esc(c.actual || '')}</td></tr>
      ${c.notes ? `<tr><th>Notes</th><td>${esc(c.notes)}</td></tr>` : ''}
      <tr><th>Duration</th><td>${fmtDur(c.durationMs)}</td></tr>
      ${c.bugs.length ? `<tr><th>Bug IDs</th><td>${c.bugs.map((id) => `<a href="#${esc(id)}">${esc(id)}</a>`).join(', ')}</td></tr>` : ''}
    </table>
    ${c.evidence.length && c.status !== 'Pass' || c.evidence.length && c.bugs.length ? `<div class="shots">${c.evidence.map(img).join('')}</div>`
      : c.evidence.length ? `<details><summary>Evidence (${c.evidence.length})</summary><div class="shots">${c.evidence.map(img).join('')}</div></details>` : ''}
  </article>`).join('');

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>QA Report ${esc(log.runId)}</title>
<style>
:root{--bg:#f6f4f1;--panel:#fff;--ink:#1d2330;--muted:#5d6472;--line:#e3dfd8;--brand:#7b1e2b;
--pass:#1f7a3d;--pass-bg:#e3f4e8;--fail:#b3261e;--fail-bg:#fbe4e2;--block:#8a5a00;--block-bg:#fdf0d5;--skip:#4a5160;--skip-bg:#eceef2;--new:#2457a6;--new-bg:#e1ebfa}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#15171c;--panel:#1e2128;--ink:#e8e9ec;--muted:#a0a6b2;--line:#323641;--brand:#e07a88;
--pass:#6fd08f;--pass-bg:#173623;--fail:#ff8a80;--fail-bg:#3d1b19;--block:#f0c060;--block-bg:#3a2d10;--skip:#c2c7d0;--skip-bg:#2a2e36;--new:#8ab4f8;--new-bg:#1c2a44}}
:root[data-theme=dark]{--bg:#15171c;--panel:#1e2128;--ink:#e8e9ec;--muted:#a0a6b2;--line:#323641;--brand:#e07a88;
--pass:#6fd08f;--pass-bg:#173623;--fail:#ff8a80;--fail-bg:#3d1b19;--block:#f0c060;--block-bg:#3a2d10;--skip:#c2c7d0;--skip-bg:#2a2e36;--new:#8ab4f8;--new-bg:#1c2a44}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header.top{background:var(--brand);color:#fff;padding:20px 16px}header.top h1{margin:0;font-size:22px}header.top p{margin:4px 0 0;opacity:.9}
nav{position:sticky;top:0;z-index:5;background:var(--panel);border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap;padding:0 8px}
nav a{display:inline-block;padding:10px;color:var(--ink);text-decoration:none;font-weight:600;font-size:13px}nav a:hover{color:var(--brand)}
main{max-width:1200px;margin:0 auto;padding:16px}section{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:16px;margin:16px 0}
h2{margin:0 0 12px;font-size:18px;color:var(--brand)}h3{margin:0;font-size:15px}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin-bottom:12px}
.stat{border:1px solid var(--line);border-radius:8px;padding:10px;background:var(--bg)}.stat .n{font-size:24px;font-weight:700}.stat .l{color:var(--muted);font-size:12px}.stat .sub{font-size:12px;color:var(--muted)}
.stat.pass .n{color:var(--pass)}.stat.fail .n{color:var(--fail)}.stat.blocked .n{color:var(--block)}.stat.skip .n{color:var(--skip)}.stat.new .n{color:var(--new)}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
th{background:var(--bg);font-weight:600}table.kv th{width:190px;background:transparent;color:var(--muted)}
.badge{display:inline-block;padding:1px 8px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid transparent}
.s-pass{background:var(--pass-bg);color:var(--pass)}.s-fail{background:var(--fail-bg);color:var(--fail)}.s-blocked{background:var(--block-bg);color:var(--block)}
.s-skipped,.s-not-executed{background:var(--skip-bg);color:var(--skip)}.new{background:var(--new-bg);color:var(--new)}
.sev-critical,.sev-high{background:var(--fail-bg);color:var(--fail)}.sev-medium{background:var(--block-bg);color:var(--block)}.sev-low,.sev-na,.sev-unrated{background:var(--skip-bg);color:var(--skip)}
.prio,.st{background:var(--bg);border-color:var(--line);color:var(--ink)}
article{border:1px solid var(--line);border-left:4px solid var(--line);border-radius:8px;padding:12px;margin:12px 0}
article header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin-bottom:8px}
article.st-pass{border-left-color:var(--pass)}article.st-fail{border-left-color:var(--fail)}article.st-blocked{border-left-color:var(--block)}article.st-skipped,article.st-not-executed{border-left-color:var(--skip)}article.bug{border-left-color:var(--fail)}
.shots{display:flex;flex-wrap:wrap;gap:10px;margin-top:8px}figure{margin:0;max-width:240px}figure img{width:100%;border:1px solid var(--line);border-radius:6px;display:block}
figcaption{font-size:11px;color:var(--muted);word-break:break-all}.muted{color:var(--muted)}.missing{color:var(--fail)}
.filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.filters button{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:999px;padding:4px 12px;cursor:pointer;font:inherit;font-size:13px}
.filters button.on{background:var(--brand);color:#fff;border-color:var(--brand)}
.banner{background:var(--block-bg);color:var(--ink);border:1px solid var(--block);border-radius:10px;padding:12px 14px;margin:16px 0}.banner b{color:var(--block)}
.note{background:var(--bg);border:1px dashed var(--line);border-radius:8px;padding:10px;font-size:13px}
ul.tight{margin:4px 0;padding-left:20px}
@media (max-width:600px){table.kv th{width:auto;display:block;border:0;padding-bottom:0}table.kv td{display:block}}
@media print{nav,.filters{display:none}section{break-inside:avoid-page}}
</style></head><body>
<header class="top"><h1>${log.partial && log.interimLabel ? `<span style="display:inline-block;background:#fff;color:var(--brand);border-radius:6px;padding:2px 10px;margin:0 8px 6px 0;font-size:15px">${esc(log.interimLabel)}</span><br>` : ''}QA Execution Report — ${esc(log.scope)}${log.partial && !log.interimLabel ? ' (PARTIAL)' : ''}</h1>
<p>${appOf(log) === DEFAULT_APP ? '' : `${esc(log.appName || appInfo(log.app).name)} · `}${esc(log.runId)} · ${esc(log.platform === 'ios' ? 'iOS' : 'Android')} · ${esc(log.device)} / ${esc(log.osVersion)} · ${esc(log.build)}${log.role ? ` · Role: ${esc(log.role)}` : ''} · Executed ${esc(fmtTime(log.startedAt))}</p></header>
<nav><a href="#summary">1. Bug summary</a><a href="#bugs">2. Bug reports</a><a href="#edge">3. Edge cases</a><a href="#coverage">4. Coverage</a><a href="#creds">5. Credentials</a><a href="#time">6. Execution time</a><a href="#log">7. Scenario log</a><a href="#notexec">8. Not executed</a>${extraNav}</nav>
<main>
${partialBanner}
<section id="summary"><h2>1. Bug Summary</h2>
<div class="stats">${statCard('Bugs found', bugs.length, 'fail')}${[...sevCount].map(([k, v]) => statCard(`${k} severity`, v.length, '')).join('')}${statCard('Cases failed', t.Fail, 'fail')}</div>
<div class="tw"><table><tr><th>Bug ID</th><th>Title</th><th>Module</th><th>Severity</th><th>Priority</th><th>Test cases</th><th>Status</th></tr>
${bugs.map((b) => `<tr><td><a href="#${esc(b.id)}">${esc(b.id)}</a></td><td>${esc(b.title)}</td><td>${esc(b.module || '')}</td><td>${sevBadge(b.severity)}</td><td>${esc(b.priority || '')}</td><td>${(b.tcIds || []).join(', ')}</td><td>${esc(b.status || 'New (draft)')}</td></tr>`).join('') || '<tr><td colspan="7">No bugs found in this run.</td></tr>'}
</table></div>
<p class="muted">Defects are drafts only (<code>${esc(dirsOf(log).results)}/${esc(log.runId)}/defects/</code>); nothing was submitted to Jira or any tracker.</p></section>

<section id="bugs"><h2>2. Detailed Bug Reports</h2>${bugDetail || '<p>No bugs found.</p>'}</section>

<section id="edge"><h2>3. Edge Cases Tested</h2>
<p class="muted">Boundary, validation, negative, security and error-handling scenarios in this run (${edge.length}); newly discovered cases are marked NEW.</p>
<div class="tw"><table><tr><th>TC ID</th><th>Type</th><th>Scenario</th><th>Test data</th><th>Result</th><th>Actual</th></tr>
${edge.map((c) => `<tr><td><a href="#case-${esc(c.id)}">${esc(c.id)}</a> ${c.isNew ? '<span class="badge new">NEW</span>' : ''}</td><td>${esc(c.testType)}</td><td>${esc(c.scenario)}</td><td>${esc(c.testData)}</td><td>${badge(c.status)}</td><td>${esc(c.actual || '')}</td></tr>`).join('')}
</table></div></section>

<section id="coverage"><h2>4. Coverage Summary</h2>
<div class="stats">${statCard('In scope', t.total, '')}${statCard('Executed', t.executed, '', pct(t.executed, t.total) + ' of scope')}${statCard('Passed', t.Pass, 'pass', pct(t.Pass, t.executed) + ' of executed')}${statCard('Failed', t.Fail, 'fail')}${statCard('Blocked', t.Blocked, 'blocked')}${statCard('Not executed / pending', t.Skipped + t['Not Executed'], 'skip')}${statCard('New cases', fresh.length, 'new')}</div>
<div class="note">Execution coverage = executed (Pass + Fail) ÷ cases in scope = <b>${pct(t.executed, t.total)}</b>. Blocked and not-executed cases are <b>not</b> counted as covered.
Inventory: <code>${esc(inv.path || '')}</code> (${inv.count ?? '?'} baseline cases).</div>
<h3 style="margin-top:14px">By module</h3><div class="tw"><table>${breakdownHead}${breakdownRows(groupBy(cases, 'module'))}</table></div>
<h3 style="margin-top:14px">By test type</h3><div class="tw"><table>${breakdownHead}${breakdownRows(groupBy(cases, 'testType'))}</table></div>
<h3 style="margin-top:14px">Existing vs newly discovered</h3><div class="tw"><table>${breakdownHead}${breakdownRows(new Map([['Existing inventory cases', existing], ['Newly discovered (NEW)', fresh]].filter(([, l]) => l.length)))}</table></div>
${fresh.length ? `<p class="muted">New cases: ${fresh.map((c) => `<a href="#case-${esc(c.id)}">${esc(c.id)}</a>`).join(', ')}</p>` : ''}
<p class="muted" style="margin-top:14px">Blocked and not-executed cases, with reasons and dependencies: <a href="#notexec">8. Not Executed Cases</a>.</p></section>

<section id="creds"><h2>5. Credential Utilization Summary</h2>
<div class="tw"><table><tr><th>Account / type</th><th>Login method</th><th>Identifier (masked)</th><th>Entered by</th><th>Used for</th></tr>
${(log.credentials || []).map((c) => `<tr><td>${esc(c.account)}</td><td>${esc(c.method || '')}</td><td>${esc(c.identifier || '—')}</td><td>${esc(c.enteredBy || '')}</td><td>${esc(c.usedFor || '')}</td></tr>`).join('') || '<tr><td colspan="5">No credentials used.</td></tr>'}
</table></div><p class="muted">No passwords, OTPs, access keys or tokens are stored in this report. Values live only in the local, git-ignored <code>.env</code>.</p></section>

<section id="time"><h2>6. Execution Time Summary</h2>
<div class="tw"><table class="kv"><tr><th>Start</th><td>${fmtTime(log.startedAt)}</td></tr><tr><th>End</th><td>${fmtTime(log.endedAt)}</td></tr><tr><th>Total duration</th><td>${fmtDur(runMs)}</td></tr></table></div>
<h3 style="margin-top:14px">Per module</h3><div class="tw"><table><tr><th>Module</th><th>Cases</th><th>First case started</th><th>Last case ended</th><th>Active case time</th></tr>${moduleTimes}</table></div>
<p class="muted">Per-scenario durations are listed in the Scenario Log. Times are recorded from the device/session clock and are approximate to about ±30 s.</p>
${(log.environmentNotes || []).length ? `<h3 style="margin-top:14px">Environment notes</h3><ul class="tight">${log.environmentNotes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
${(log.recoveryEvents || []).length ? `<h3 style="margin-top:14px">Environment / execution recovery events</h3><p class="muted">BrowserStack / App Live / Chrome issues handled during the run (execution dependency, not application defects).</p><div class="tw"><table><tr><th>#</th><th>Time</th><th>Issue</th><th>Detection</th><th>Recovery actions</th><th>Outcome</th><th>Affected case</th><th>Duration</th></tr>${log.recoveryEvents.map((r, i) => `<tr><td>${i + 1}</td><td>${fmtTime(r.at)}</td><td>${esc(r.issue || '')}</td><td>${esc(r.detection || '')}</td><td>${esc([].concat(r.actions || []).join('; '))}</td><td>${esc(r.outcome || '')}</td><td>${esc(r.affectedCase || '—')}</td><td>${r.durationSec ? esc(Math.round(r.durationSec / 60) + ' min') : '—'}</td></tr>`).join('')}</table></div>` : ''}
${(log.approvals || []).length ? `<h3 style="margin-top:14px">Approvals granted for this run</h3><ul class="tight">${log.approvals.map((a) => `<li>${esc(a.text)}</li>`).join('')}</ul>` : ''}</section>

<section id="log"><h2>7. Scenario Log</h2>
<p class="muted">Executed scenarios (Pass/Fail) plus attempted-but-blocked scenarios. Cases never started are listed only in <a href="#notexec">8. Not Executed Cases</a>.</p>
<div class="filters" role="group" aria-label="Filter by status"><button class="on" data-f="all">All (${logged.length})</button>${STATUS_ORDER.map((s) => [s, logged.filter((c) => c.status === s).length]).filter(([, n]) => n).map(([s, n]) => `<button data-f="${s}">${s} (${n})</button>`).join('')}</div>
${scenarioLog}</section>

<section id="notexec"><h2>8. Not Executed Cases</h2>
<p class="muted">${notExec.length} case(s) in scope were not executed to a Pass/Fail verdict. <b>Blocked</b> = attempted or impossible because of an external dependency (environment, test data); <b>Not Executed</b> = not started (pending, or needs approval). None of these are counted as Passed or Failed.</p>
<div class="tw"><table><tr><th>Reason category</th><th>Blocked</th><th>Not Executed</th><th>Cases</th></tr>${notExecByCat || '<tr><td colspan="4">None</td></tr>'}</table></div>
<div class="tw" style="margin-top:12px"><table><tr><th>TC ID</th><th>Scenario</th><th>Status</th><th>Category</th><th>Reason</th><th>Required dependency / input</th></tr>${notExecRows || '<tr><td colspan="6">All cases executed.</td></tr>'}</table></div></section>
${clarifySection}${uxSection}${inventorySection}
<p class="muted">Generated ${esc(new Date().toISOString())} by scripts/generate-report.mjs from ${esc(dirsOf(log).results)}/${esc(log.runId)}/run-log.json.</p>
</main>
<script>
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('on',x===b));
 document.querySelectorAll('#log article').forEach(a=>{a.style.display=(b.dataset.f==='all'||a.dataset.status===b.dataset.f)?'':'none';});
}));
</script></body></html>`;
}

export async function generate(runId, { link = false, app } = {}) {
  const f = findRunLog(runId, app);
  const log = JSON.parse(readFileSync(f, 'utf8'));
  const platform = log.platform;
  const red = redactor();
  const model = buildModel(log);
  const csv = writeResultsCsv(model, platform, red);
  const defects = writeDefectDrafts(model, platform, red);
  const reportDir = join(ROOT, dirsOf(log).reports, log.runId);
  mkdirSync(reportDir, { recursive: true });
  const html = join(reportDir, 'qa-report.html');
  writeFileSync(html, red(renderHtml(model, platform, reportDir, link)));
  const t = tally(model.cases);
  const rel = (p) => relative(ROOT, p).split('\\').join('/');
  return {
    html, csv, defects,
    summary: [
      `Run ${log.runId}: ${t.total} cases — Pass ${t.Pass}, Fail ${t.Fail}, Blocked ${t.Blocked}, Skipped ${t.Skipped}, Not Executed ${t['Not Executed']}; bugs ${model.bugs.length}`,
      `HTML report : ${rel(html)}`,
      `Results CSV : ${rel(csv)}`,
      `Defects     : ${rel(defects)}/`,
    ].join('\n'),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--run');
  if (i === -1) { console.error('usage: node scripts/generate-report.mjs --run <run-id> [--link] [--app <id>]'); process.exit(1); }
  const j = process.argv.indexOf('--app');
  generate(process.argv[i + 1], { link: process.argv.includes('--link'), app: j === -1 ? undefined : process.argv[j + 1] })
    .then((o) => console.log(o.summary)).catch((e) => { console.error(`generate-report: ${e.message}`); process.exit(1); });
}
