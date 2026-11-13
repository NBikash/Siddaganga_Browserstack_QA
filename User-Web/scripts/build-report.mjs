// Builds the consolidated Local HTML QA report from results/<run-id>/report-data.json (curated from the raw case JSON).
// Usage: node scripts/build-report.mjs <run-id>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUN = process.argv[2];
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'results', RUN, 'report-data.json'), 'utf8'));
const outDir = path.join(ROOT, 'reports', RUN); fs.mkdirSync(outDir, { recursive: true });
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const rel = p => path.relative(outDir, path.join(ROOT, p)).split(path.sep).join('/');
const missing = [];
const img = (p, cap) => { if (!fs.existsSync(path.join(ROOT, p))) missing.push(p);
  return `<figure><a href="${rel(p)}" target="_blank"><img src="${rel(p)}" alt="${esc(cap || p)}"></a><figcaption>${esc(cap || path.basename(p))}</figcaption></figure>`; };
const gallery = list => list?.length ? `<div class="gallery">${list.map(s => typeof s === 'string' ? img(s) : img(s.path, s.caption)).join('')}</div>` : '';
const badge = s => `<span class="badge b-${esc(String(s).split(' ')[0].toLowerCase())}">${esc(s)}</span>`;
const kv = obj => `<table class="kv">${Object.entries(obj).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${Array.isArray(v) ? v.map(esc).join('<br>') : esc(v)}</td></tr>`).join('')}</table>`;
const list = a => a?.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '<p class="muted">—</p>';
const ol = a => a?.length ? `<ol>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';

const issues = data.issues; const byId = Object.fromEntries(issues.map(i => [i.id, i]));
const counts = data.cases.reduce((a, c) => (a[c.status] = (a[c.status] || 0) + 1, a), {});
const typeCounts = issues.reduce((a, i) => (a[i.type] = (a[i.type] || 0) + 1, a), {});

const issueHtml = i => `
<article class="issue" id="${esc(i.id)}">
  <h4>${esc(i.id)} · ${esc(i.title)} ${badge(i.type)} <span class="sev">${esc(i.severity || '')}</span></h4>
  ${kv({ 'Related test case(s)': [i.case, ...(i.alsoIn || []).map(x => `also observed in ${x}`)].join(' · '), Category: i.category, Environment: data.meta.environment, 'Page / section': i.where })}
  <div class="cols"><div><h5>Steps to reproduce</h5>${ol(i.steps)}</div>
  <div><h5>Expected</h5><p>${esc(i.expected)}</p><h5>Actual</h5><p>${esc(i.actual)}</p><h5>Impact</h5><p>${esc(i.impact)}</p></div></div>
  ${gallery(i.evidence)}
</article>`;

const fareHtml = f => !f ? '' : `
<section class="fare"><h4>Fare verification (shared procedure: <code>User-Web/.claude/shared/fare-verification.md</code>)</h4>
<div class="cols"><div><h5>Fare Breakup: ${esc(f.vehicle)}</h5><table class="grid"><tr><th>Component</th><th>Displayed</th><th>Applicable here?</th></tr>
${f.breakup.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')}</table></div>
<div><h5>Applied fare (Confirm Your Trip step, not submitted)</h5><table class="grid"><tr><th>Line</th><th>Amount</th></tr>
${f.applied.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</table>
<h5>Arithmetic</h5><p class="mono">${esc(f.arithmetic)}</p><h5>Comparison</h5>${list(f.comparison)}<p>Fare verdict: ${badge(f.verdict)}</p></div></div>
${f.clarify?.length ? `<h5>Needs business/developer clarification</h5>${list(f.clarify)}` : ''}
</section>`;

const caseHtml = c => `
<section class="case" id="${esc(c.id)}">
  <h3>${esc(c.id)} – ${esc(c.title)} ${badge(c.status)}</h3>
  <p class="obj"><b>Objective:</b> ${esc(c.objective)}</p>
  <div class="cols"><div><h5>Configuration &amp; test data</h5>${kv(c.data)}</div>
  <div><h5>Journey / actions performed</h5>${ol(c.journey)}</div></div>
  <div class="cols"><div><h5>Expected</h5>${list(c.expected)}</div><div><h5>Actual</h5>${list(c.actual)}</div></div>
  ${c.statusReason ? `<p class="reason"><b>Status rationale:</b> ${esc(c.statusReason)}</p>` : ''}
  ${(c.fare || []).map(fareHtml).join('')}
  <h5>Observations in this case (${c.issues.length})</h5>
  <table class="grid"><tr><th>Ref</th><th>Type</th><th>Title</th></tr>${c.issues.map(r => { const i = byId[r]; return `<tr><td><a href="#${esc(r)}">${esc(r)}</a>${i && i.case !== c.id ? ' (cross-ref)' : ''}</td><td>${esc(i?.type)}</td><td>${esc(i?.title)}</td></tr>`; }).join('')}</table>
  <h5>Evidence</h5>${gallery(c.evidence)}
  ${issues.filter(i => i.case === c.id).map(issueHtml).join('')}
</section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>User-Web Local QA Report</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--muted:#5d6675;--line:#dfe3ea;--accent:#8b1c31;--pass:#1f7a3a;--fail:#b42318;--blocked:#8a5a00;--inc:#5b4bb7;--code:#eef1f5}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--inc:#a99cf5;--code:#232a35}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--inc:#a99cf5;--code:#232a35}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,Segoe UI,Arial,sans-serif}
header{background:var(--accent);color:#fff;padding:20px 24px}header h1{margin:0 0 4px;font-size:22px}header p{margin:0;opacity:.9}
nav{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--line);padding:8px 16px;display:flex;flex-wrap:wrap;gap:10px;z-index:5}
nav a{color:var(--accent);text-decoration:none;font-weight:600;font-size:13px}main{max-width:1280px;margin:0 auto;padding:16px}
section,article{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin:16px 0}article.issue{border-left:4px solid var(--accent);margin:14px 0}
h2{margin:8px 0 12px}h3{margin:0 0 8px}h4{margin:6px 0 8px}h5{margin:12px 0 6px;color:var(--muted);text-transform:uppercase;font-size:12px;letter-spacing:.04em}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:800px){.cols{grid-template-columns:1fr}}
table{border-collapse:collapse;width:100%}.grid th,.grid td,.kv th,.kv td{border:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}.kv th{width:34%;background:var(--code);font-weight:600}.grid th{background:var(--code)}
.badge{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:700;color:#fff;background:var(--muted);vertical-align:middle}
.b-pass{background:var(--pass)}.b-partial{background:#2b6cb0}.b-fail{background:var(--fail)}.b-blocked{background:var(--blocked)}.b-inconclusive{background:var(--inc)}
.b-defect{background:var(--fail)}.b-inconsistency{background:var(--blocked)}.b-suggestion{background:var(--pass)}.b-clarification{background:var(--inc)}
.sev{font-size:12px;color:var(--muted);font-weight:600}.muted{color:var(--muted)}.mono,code{font-family:Consolas,monospace;background:var(--code);padding:2px 5px;border-radius:4px}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px}figure{margin:0;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--code)}
figure img{width:100%;display:block}figcaption{font-size:12px;padding:4px 8px;color:var(--muted);word-break:break-all}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}.tile{border:1px solid var(--line);border-radius:10px;padding:12px;text-align:center}.tile b{display:block;font-size:26px}
.reason{background:var(--code);padding:8px;border-radius:6px}ul,ol{margin:4px 0 4px 20px;padding:0}
</style></head><body>
<header><h1>User-Web · Local module · QA execution report</h1><p>${esc(data.meta.subtitle)}</p></header>
<nav><a href="#summary">Summary</a><a href="#cases">Cases</a>${data.cases.map(c => `<a href="#${c.id}">${c.id}</a>`).join('')}<a href="#fare">Fare results</a><a href="#index">Issue index</a><a href="#suggestions">Suggestions</a><a href="#clarify">Clarifications</a><a href="#scope">Scope &amp; limits</a></nav>
<main>
<section id="summary"><h2>Execution summary</h2>${kv(data.meta.table)}
<h5>Case results</h5><div class="tiles">${['Pass', 'Fail', 'Blocked', 'Partial', 'Inconclusive'].map(s => `<div class="tile">${badge(s)}<b>${counts[s] || 0}</b></div>`).join('')}<div class="tile">Total<b>${data.cases.length}</b></div></div>
<h5>Observations by type</h5><div class="tiles">${['Defect', 'Inconsistency', 'Suggestion', 'Clarification'].map(s => `<div class="tile">${badge(s)}<b>${typeCounts[s] || 0}</b></div>`).join('')}<div class="tile">Total<b>${issues.length}</b></div></div>
<h5>Case overview</h5><table class="grid"><tr><th>Case</th><th>Config</th><th>Key data</th><th>Vehicle</th><th>Status</th><th>Issues</th></tr>
${data.cases.map(c => `<tr><td><a href="#${c.id}">${c.id}</a> ${esc(c.title)}</td><td>${esc(c.cfg)}</td><td>${esc(c.keyData)}</td><td>${esc(c.vehicle)}</td><td>${badge(c.status)}</td><td>${c.issues.length}</td></tr>`).join('')}</table>
<h5>Key messages</h5>${list(data.meta.highlights)}
<p class="muted">Legend: <b>Defect</b> = confirmed behaviour contrary to a displayed rule or plain correctness. <b>Inconsistency</b> = content/UI/UX mismatch. <b>Suggestion</b> = improvement idea. <b>Clarification</b> = business rule unknown; not claimed as a defect.</p></section>
<h2 id="cases">Test case details</h2>${data.cases.map(caseHtml).join('')}
<section id="fare"><h2>Fare verification results</h2><table class="grid"><tr><th>Case</th><th>Vehicle</th><th>Inputs</th><th>Breakup rule</th><th>Applied</th><th>Verdict</th></tr>
${data.fareSummary.map(r => `<tr>${r.map((x, i) => `<td>${i === 5 ? badge(x) : esc(x)}</td>`).join('')}</tr>`).join('')}</table></section>
<section id="index"><h2>Consolidated issue index</h2><table class="grid"><tr><th>Ref</th><th>Type</th><th>Severity</th><th>Category</th><th>Title</th><th>Observed in</th></tr>
${issues.map(i => `<tr><td><a href="#${esc(i.id)}">${esc(i.id)}</a></td><td>${badge(i.type)}</td><td>${esc(i.severity)}</td><td>${esc(i.category)}</td><td>${esc(i.title)}</td><td>${esc([i.case, ...(i.alsoIn || [])].join(', '))}</td></tr>`).join('')}</table></section>
<section id="suggestions"><h2>Improvement suggestions</h2>${list(issues.filter(i => i.type === 'Suggestion').map(i => `${i.id}: ${i.title}`))}</section>
<section id="clarify"><h2>Clarification points (business / developer)</h2>${list(data.clarifications)}</section>
<section id="scope"><h2>Scope, coverage &amp; limitations</h2>${list(data.scope)}</section>
</main></body></html>`;
fs.writeFileSync(path.join(outDir, 'local-test-report.html'), html);
console.log(`report: ${path.join(outDir, 'local-test-report.html')}`);
if (missing.length) console.log(`MISSING screenshots (${missing.length}):\n` + missing.join('\n'));
