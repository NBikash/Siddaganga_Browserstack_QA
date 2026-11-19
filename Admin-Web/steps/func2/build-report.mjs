// Builds reports/<run>/admin-functional-qa-report.html for run admin-web-20261116-1523-FUNC (Lead Management scope).
import fs from 'node:fs';
import path from 'node:path';
const RUN = process.env.FRUN || 'admin-web-20261116-1523-FUNC';
const RES = path.resolve('results', RUN), OUT = path.resolve('reports', RUN);
const rec = JSON.parse(fs.readFileSync(path.join(RES, 'record.json')));
const UC = JSON.parse(fs.readFileSync(path.join(RES, 'usecases.json'))).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
const IS = JSON.parse(fs.readFileSync(path.join(RES, 'issues.json'))).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
const LINK = { 'AW-LEA-026': ['F2-LM-01'], 'AW-LEA-009': ['F2-LM-02'], 'AW-LEA-028': ['F2-LM-02'], 'AW-LEA-010': ['F2-LM-04'], 'AW-LEA-027': ['F2-LM-05'] };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ST = ['Pass', 'Fail', 'Blocked', 'Not Run'];
const cls = s => String(s).toLowerCase().replace(/\s+/g, '-');
const cnt = s => UC.filter(u => u.status === s).length;
const rel = p => path.relative(OUT, path.resolve(p)).split(path.sep).join('/');
const shot = p => fs.existsSync(path.resolve(p)) ? `<a href="${esc(rel(p))}" target="_blank"><img src="${esc(rel(p))}" alt="${esc(path.basename(p))}"></a>` : `<span class="miss">${esc(path.basename(p))} (missing)</span>`;
const ucIds = id => UC.filter(u => (LINK[u.id] || []).includes(id)).map(u => u.id);
const pnrRows = Object.entries(rec.records || {}).map(([pnr, r]) => `<tr><td class="mono">${pnr}</td><td class="mono">${r.leadId}</td><td class="mono">QRY-${r.inquiryId}</td><td>${esc(r.start)}</td><td>${esc(r.vehicle)}</td><td>${esc({ 'LD-397': 'Lead deleted (LEA-023/024)', 'LD-351': 'Sent to Inquiry; lead then deleted (LEA-027) — QRY-942 remains' }[r.leadId] || 'Sent to Inquiry (LEA-010)')}</td></tr>`).join('');
const nf = Object.keys(rec.notFound || {});
const ucRows = UC.map(u => `<tr id="${u.id}"><td class="mono">${u.id}</td><td><b>${esc(u.title)}</b><div class="sub">${esc(u.pre)}</div></td><td><ol>${(u.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></td><td>${esc(u.expected)}</td><td>${esc(u.actual)}${(LINK[u.id] || []).length ? `<div class="refs">Issue: ${LINK[u.id].map(x => `<a href="#${x}">${x}</a>`).join(', ')}</div>` : ''}</td><td><span class="pill ${cls(u.status)}">${esc(u.status)}</span></td><td class="ev">${(u.evidence || []).map(shot).join('') || '—'}</td></tr>`).join('');
const isCards = IS.map(i => `<article class="card issue" id="${i.id}"><header><span class="mono">${i.id}</span><h3>${esc(i.title)}</h3><span class="pill sev-${cls(i.severity)}">${esc(i.severity)}</span></header>
<dl><dt>Module / screen</dt><dd>${esc(i.module)} — ${esc(i.screen)}</dd><dt>Classification</dt><dd>${esc(i.classification)}</dd><dt>Environment</dt><dd>Admin portal Preprod, Superadmin</dd><dt>Steps</dt><dd><ol>${i.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></dd><dt>Expected</dt><dd>${esc(i.expected)}</dd><dt>Actual</dt><dd>${esc(i.actual)}</dd><dt>Use cases</dt><dd>${ucIds(i.id).map(x => `<a href="#${x}">${x}</a>`).join(', ') || '—'}</dd></dl><div class="ev">${(i.evidence || []).map(shot).join('')}</div></article>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin-Web Lead Management QA</title><style>
:root{--bg:#f6f7f9;--card:#fff;--fg:#1d2330;--mut:#5e6777;--line:#dfe3ea;--acc:#1f3864;--pass:#1e7b3a;--passb:#e3f3e8;--fail:#b3261e;--failb:#fbe5e3;--blk:#8a5a00;--blkb:#fff1d6;--nr:#555;--nrb:#ececec}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--pass:#7fd49a;--passb:#17301f;--fail:#ff8a80;--failb:#3a1a18;--blk:#ffc861;--blkb:#3a2c10;--nr:#bbb;--nrb:#2a2d33}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--pass:#7fd49a;--passb:#17301f;--fail:#ff8a80;--failb:#3a1a18;--blk:#ffc861;--blkb:#3a2c10;--nr:#bbb;--nrb:#2a2d33}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
main{max-width:1280px;margin:0 auto;padding:24px 16px 64px}h1{margin:0 0 4px;font-size:24px}h2{margin:32px 0 12px;font-size:18px;color:var(--acc)}h3{margin:0;font-size:15px}
.mut{color:var(--mut)}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:12px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}.kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.kpi b{display:block;font-size:26px}
.kpi.pass b{color:var(--pass)}.kpi.fail b{color:var(--fail)}.kpi.blocked b{color:var(--blk)}
.scroll{overflow-x:auto}table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}th{font-size:12px;text-transform:uppercase;color:var(--mut)}
table.uc td:nth-child(3){min-width:200px}table.uc td:nth-child(5){min-width:220px}ol{margin:0;padding-left:18px}.sub{color:var(--mut);font-size:12px}
.mono{font-family:ui-monospace,Consolas,monospace;white-space:nowrap}.pill{display:inline-block;padding:2px 8px;border-radius:99px;font-size:12px;font-weight:600;white-space:nowrap}
.pill.pass{background:var(--passb);color:var(--pass)}.pill.fail{background:var(--failb);color:var(--fail)}.pill.blocked{background:var(--blkb);color:var(--blk)}.pill.not-run{background:var(--nrb);color:var(--nr)}
.pill.sev-medium{background:var(--blkb);color:var(--blk)}.pill.sev-low{background:var(--nrb);color:var(--nr)}.pill.sev-high{background:var(--failb);color:var(--fail)}
.ev img{width:160px;max-width:100%;border:1px solid var(--line);border-radius:6px;margin:0 6px 6px 0;display:block}.ev{min-width:170px}.miss{color:var(--fail);font-size:12px}
.issue header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.issue h3{flex:1}dl{display:grid;grid-template-columns:150px 1fr;gap:4px 12px;margin:0 0 10px}dt{color:var(--mut)}dd{margin:0}
.issue .ev{display:flex;flex-wrap:wrap}.refs{margin-top:6px;font-size:12px}a{color:var(--acc)}
.toggle{position:fixed;top:12px;right:12px;border:1px solid var(--line);background:var(--card);color:var(--fg);border-radius:8px;padding:6px 10px;cursor:pointer}
@media (max-width:640px){dl{grid-template-columns:1fr}}
</style></head><body><button class="toggle" onclick="const r=document.documentElement;r.dataset.theme=(r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))==='dark'?'light':'dark'">Theme</button><main>
<h1>Admin-Web Functional QA — Lead Management</h1>
<p class="mut">Run <span class="mono">${RUN}</span> · Admin portal Preprod · Superadmin · executed 16 Nov 2026 · scope: the ${UC.length} Functional-category Lead Management use cases from the master inventory</p>
<h2>Summary</h2>
<div class="kpis"><div class="kpi"><span class="mut">Use cases</span><b>${UC.length}</b></div>${ST.map(s => `<div class="kpi ${cls(s)}"><span class="mut">${s}</span><b>${cnt(s)}</b></div>`).join('')}<div class="kpi"><span class="mut">Issues</span><b>${IS.length}</b></div></div>
<div class="card" style="margin-top:12px"><b>Outcome:</b> all ${UC.length} Lead Management Functional use cases were executed: ${cnt('Pass')} passed, ${cnt('Fail')} failed, ${cnt('Blocked')} blocked, ${cnt('Not Run')} pending. Blocked cases need test data (no sales employees for Assign) or a business decision (no Stage/Status edit control). The main finding is that a lead already sent to Inquiry can be deleted, leaving its inquiry without a lead.</div>
<h2>Test records (PNR → Lead → Inquiry)</h2>
<div class="card scroll"><table><thead><tr><th>PNR</th><th>Lead</th><th>Inquiry</th><th>Trip start</th><th>Vehicle requested</th><th>State after this run</th></tr></thead><tbody>${pnrRows}
<tr><td class="mono">—</td><td class="mono">LD-411</td><td>—</td><td>—</td><td>—</td><td>Created by LEA-016 ("QA Test Lead")</td></tr></tbody></table>
<p class="mut">Matched by Search Lead Info = Bikash, then View Lead → Inquiry PNR exact match. Not found on any Bikash N lead: ${nf.map(x => `<span class="mono">${x}</span>`).join(', ')}.</p></div>
<h2>Use cases tested</h2><div class="card scroll"><table class="uc"><thead><tr><th>ID</th><th>Use case</th><th>Steps performed</th><th>Expected</th><th>Actual</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${ucRows}</tbody></table></div>
<h2>Issues observed (${IS.length})</h2>${isCards}
<h2>Not covered in this run</h2><div class="card"><ul>
<li>Assign / Reassign: blocked, no sales employees in Preprod.</li><li>Stage/Status update: no edit control found; needs business confirmation.</li>
<li>Modules after Lead Management (Inquiry → Trip Closure) are not part of this report.</li></ul></div>
<p class="mut">PII (phone, email) is masked in screenshots. Statuses are as observed in this run only.</p>
</main></body></html>`;
fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, 'admin-functional-qa-report.html');
fs.writeFileSync(file, html);
const refs = [...UC.flatMap(u => u.evidence || []), ...IS.flatMap(i => i.evidence || [])];
console.log(JSON.stringify({ file, useCases: UC.length, byStatus: Object.fromEntries(ST.map(s => [s, cnt(s)])), issues: IS.length, missing: [...new Set(refs)].filter(p => !fs.existsSync(path.resolve(p))) }));
