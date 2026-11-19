// Builds reports/<run>/admin-inquiry-management-qa-report.html from results/<run>/ (usecases, issues, record, data-verify).
// Run from Admin-Web: node steps/inq3/build-report.mjs
import fs from 'node:fs';
import path from 'node:path';
const RUN = fs.readFileSync('results/CURRENT_RUN_INQ', 'utf8').trim();
const RES = path.resolve('results', RUN), OUT = path.resolve('reports', RUN);
const J = f => JSON.parse(fs.readFileSync(path.join(RES, f), 'utf8'));
const rec = J('record.json'), DV = J('data-verify.json'), RED = J('redactions.json');
const ORDER = ['AW-INQ-001', 'AW-INQ-026', 'AW-INQ-036', 'AW-INQ-004', 'AW-INQ-018', 'AW-INQ-014', 'AW-INQ-019', 'AW-INQ-005', 'AW-INQ-013', 'AW-INQ-011', 'AW-INQ-017', 'AW-INQ-012', 'AW-INQ-015', 'AW-INQ-038', 'AW-INQ-027', 'AW-INQ-028', 'AW-INQ-029', 'AW-INQ-030', 'AW-INQ-031', 'AW-INQ-032', 'AW-INQ-033', 'AW-INQ-034', 'AW-INQ-035', 'AW-INQ-037'];
const UC = J('usecases.json').sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
const IS = J('issues.json').sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cls = s => String(s).toLowerCase().replace(/\s+/g, '-');
const rel = p => path.relative(OUT, path.resolve(p)).split(path.sep).join('/');
const ev = p => !p ? '' : /\.pdf$/i.test(p) ? `<a class="file" href="${esc(rel(p))}" target="_blank">📄 ${esc(path.basename(p))}</a>` : fs.existsSync(path.resolve(p)) ? `<a href="${esc(rel(p))}" target="_blank"><img loading="eager" src="${esc(rel(p))}" alt="${esc(path.basename(p))}"></a>` : `<span class="miss">${esc(path.basename(p))} (missing)</span>`;
const cnt = s => UC.filter(u => u.status === s).length;
const usedBy = id => UC.filter(u => (u.issues || []).includes(id)).map(u => u.id);
const sevOrder = { High: 0, Medium: 1, Low: 2 };
const sevCnt = s => IS.filter(i => i.severity === s).length;
const missing = [];
for (const u of UC) for (const p of u.evidence || []) if (!fs.existsSync(path.resolve(p))) missing.push(p);
for (const i of IS) for (const p of i.evidence || []) if (!fs.existsSync(path.resolve(p))) missing.push(p);
const pnrRows = Object.entries(rec.pnrs).map(([p, r]) => `<tr><td class="mono">${p}</td><td>${esc(r.source)}</td><td class="mono">${esc(r.lead)}</td><td class="mono">${esc(r.inquiry)}</td><td>${esc(r.use)}</td></tr>`).join('');
const dvRows = DV.findings.map(f => `<tr><td class="mono">${f.id}</td><td>${esc(f.pnrs.join(', '))}</td><td>${esc(f.title)}</td></tr>`).join('');
const ucRows = UC.map(u => `<tr id="${u.id}"><td class="mono">${u.id}</td><td><b>${esc(u.title)}</b><div class="sub"><b>PNR:</b> ${esc(u.pnr)}</div><div class="sub">${esc(u.pre)}</div></td>
<td><ol>${(u.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></td><td>${esc(u.expected)}</td>
<td>${esc(u.actual)}${(u.issues || []).length ? `<div class="refs">Issues: ${u.issues.map(x => `<a href="#${x}">${x}</a>`).join(', ')}</div>` : ''}</td>
<td><span class="pill st-${cls(u.status)}">${u.status}</span></td></tr>
<tr class="evrow"><td></td><td colspan="5"><div class="shots">${(u.evidence || []).map(ev).join('') || '<span class="mut">No evidence (not executed)</span>'}</div></td></tr>`).join('');
const isCards = IS.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity] || a.id.localeCompare(b.id, 'en', { numeric: true })).map(i => `<article class="card issue" id="${i.id}">
<header><span class="mono">${i.id}</span><h3>${esc(i.title)}</h3><span class="pill sev-${cls(i.severity)}">${esc(i.severity)}</span></header>
<dl><dt>Screen</dt><dd>${esc(i.module)} — ${esc(i.screen)}</dd><dt>Record</dt><dd>${esc(i.record || '')}</dd><dt>Classification</dt><dd>${esc(i.classification)}</dd><dt>Environment</dt><dd>Admin portal Preprod, Superadmin, 19 Nov 2026</dd>
<dt>Steps to reproduce</dt><dd><ol>${(i.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></dd><dt>Expected</dt><dd>${esc(i.expected)}</dd><dt>Actual</dt><dd>${esc(i.actual)}</dd>
<dt>Use cases</dt><dd>${usedBy(i.id).map(x => `<a href="#${x}">${x}</a>`).join(', ') || '— (test-data verification)'}</dd></dl>
<div class="shots">${(i.evidence || []).map(ev).join('')}</div></article>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin-Web Inquiry Management QA</title><style>
:root{--bg:#f6f7f9;--card:#fff;--fg:#1d2330;--mut:#5e6777;--line:#dfe3ea;--acc:#1f3864;--pass:#1e7b3a;--passb:#e3f3e8;--fail:#b3261e;--failb:#fbe5e3;--blk:#8a5a00;--blkb:#fff1d6}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--pass:#7fd49a;--passb:#17301f;--fail:#ff8a80;--failb:#3a1a18;--blk:#ffc861;--blkb:#3a2c10}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b2029;--fg:#e6e9ef;--mut:#9aa3b2;--line:#2c3340;--acc:#8fb0ff;--pass:#7fd49a;--passb:#17301f;--fail:#ff8a80;--failb:#3a1a18;--blk:#ffc861;--blkb:#3a2c10}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
main{max-width:1320px;margin:0 auto;padding:24px 16px 64px}h1{margin:0 0 4px;font-size:24px}h2{margin:32px 0 12px;font-size:18px;color:var(--acc)}h3{margin:0;font-size:15px;flex:1}
.mut{color:var(--mut)}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:12px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.kpi b{display:block;font-size:26px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}th{background:var(--acc);color:#fff;font-weight:600}
.wrap{overflow-x:auto}.mono{font-family:ui-monospace,Consolas,monospace;white-space:nowrap}.sub{color:var(--mut);font-size:12px;margin-top:4px}.refs{margin-top:6px;font-size:12px}ol{margin:0;padding-left:18px}
.pill{display:inline-block;padding:2px 10px;border-radius:999px;font-weight:600;font-size:12px;white-space:nowrap}.st-pass{background:var(--passb);color:var(--pass)}.st-fail{background:var(--failb);color:var(--fail)}.st-blocked{background:var(--blkb);color:var(--blk)}
.sev-high{background:var(--failb);color:var(--fail)}.sev-medium{background:var(--blkb);color:var(--blk)}.sev-low{background:var(--passb);color:var(--pass)}
.shots{display:flex;flex-wrap:wrap;gap:8px}.shots img{width:220px;height:140px;object-fit:cover;object-position:top;border:1px solid var(--line);border-radius:6px}.evrow td{background:var(--bg)}.file{display:inline-block;padding:6px 10px;border:1px solid var(--line);border-radius:6px}
.issue header{display:flex;gap:10px;align-items:center;margin-bottom:8px}.issue dl{display:grid;grid-template-columns:150px 1fr;gap:4px 12px;margin:0 0 8px}.issue dt{color:var(--mut)}.issue dd{margin:0}
a{color:var(--acc)}.miss{color:var(--fail)}@media(max-width:700px){.issue dl{grid-template-columns:1fr}}
</style></head><body><main>
<h1>Admin-Web QA – Inquiry Management (functional)</h1>
<div class="mut">Run <span class="mono">${RUN}</span> · ${esc(rec.date)} · Admin portal Preprod · Superadmin · QA client: ${esc(rec.qaClient)}</div>
<h2>Summary</h2>
<div class="kpis"><div class="kpi"><span class="mut">Use cases</span><b>${UC.length}</b></div><div class="kpi"><span class="mut">Pass</span><b style="color:var(--pass)">${cnt('Pass')}</b></div><div class="kpi"><span class="mut">Fail</span><b style="color:var(--fail)">${cnt('Fail')}</b></div><div class="kpi"><span class="mut">Blocked</span><b style="color:var(--blk)">${cnt('Blocked')}</b></div><div class="kpi"><span class="mut">Not Run</span><b>${cnt('Not Run')}</b></div><div class="kpi"><span class="mut">Issues</span><b>${IS.length}</b><span class="mut">${sevCnt('High')} High · ${sevCnt('Medium')} Medium · ${sevCnt('Low')} Low</span></div></div>
<div class="card" style="margin-top:12px"><b>Scope.</b> ${esc(rec.scope)}. Cases are the Functional-category rows of the 38-case Inquiry Management inventory; the other 14 (UI / Validation / UX / Security / Integration / Data-consistency only) were not executed.
<br><b>Main results.</b> Quote edits, times, description, GST, category assignment, View Quote / Preview, list filters and the cancel / delete / convert dialogs work. Failing: inquiry-ID search, sorting, cost recalculation and fixed cost (totals never change), adding a journey (wrong price, empty preview, inquiry renumbered), stale lead after delete, proforma amount in words, Send Bus Images. Add Inquiry is blocked (would need an Admin-created, non-User-Web inquiry).</div>
<h2>Test data – User-Web PNRs</h2>
<div class="card">Leads were found with Search Lead Info = QA client and View Lead (Inquiry PNR exact match). Excluded: ${Object.entries(rec.excluded).map(([k, v]) => `<span class="mono">${k}</span> (${esc(v)})`).join(', ')}. Inquiry IDs shown by Preprod changed after 16 Nov: ${Object.entries(rec.idRelabel).map(([k, v]) => `${esc(k)} ${esc(v)}`).join('; ')}.</div>
<div class="wrap"><table><thead><tr><th>PNR</th><th>User-Web source</th><th>Lead</th><th>Inquiry</th><th>Used for</th></tr></thead><tbody>${pnrRows}</tbody></table></div>
<h3 style="margin:16px 0 8px">User-Web → Admin data verification (View Lead)</h3>
<div class="wrap"><table><thead><tr><th>ID</th><th>PNRs</th><th>Finding</th></tr></thead><tbody>${dvRows}</tbody></table></div>
<h2>Data changed in Preprod (approved)</h2><div class="card"><ul>${rec.dataChanges.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
<h2>Use cases</h2>
<div class="wrap"><table><thead><tr><th>ID</th><th>Use case · PNR · preconditions</th><th>Steps performed</th><th>Expected</th><th>Actual</th><th>Status</th></tr></thead><tbody>${ucRows}</tbody></table></div>
<h2>Issues (${IS.length})</h2>${isCards}
<h2>Evidence and notes</h2><div class="card"><ul>${rec.notes.map(x => `<li>${esc(x)}</li>`).join('')}<li>Screenshots mask phone numbers and e-mail addresses; ${new Set(RED.map(r => r.file)).size} screenshots were additionally redacted after capture (results/${RUN}/redactions.json). Console/network evidence per case is in results/${RUN}/*.json.</li><li>Master inventory: the 24 AW-INQ rows updated with this run; earlier results kept as "Earlier run".</li></ul></div>
</main></body></html>`;
fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, 'admin-inquiry-management-qa-report.html');
fs.writeFileSync(file, html);
console.log(JSON.stringify({ file: path.relative(process.cwd(), file), useCases: UC.length, pass: cnt('Pass'), fail: cnt('Fail'), blocked: cnt('Blocked'), issues: IS.length, missingEvidence: [...new Set(missing)] }));
