// Build the final QA report: RUN_ID=<id> node steps/allmod/report.mjs
// Inputs: results/<RUN>/*.json (case results), results/<RUN>/defects.json (triaged defects), documentation workbook (vehicle master).
// Outputs: reports/<RUN>/qa-final-report.html (self-contained, light/dark), results/<RUN>.csv
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const RUN = process.env.RUN_ID; if (!RUN) throw new Error('RUN_ID required');
const RD = path.resolve('results', RUN);
const R = fs.readdirSync(RD).filter(f => /^TC_.*\.json$/.test(f)).map(f => JSON.parse(fs.readFileSync(path.join(RD, f))));
const ORDER = ['Navigation & Content', 'Authentication & Profile', 'Local', 'Outstation', 'Transfer P2P', 'Transfer P2P+Return', 'Transfer By Hour', 'Multi-Leg', 'Results & Vehicle Details', 'Fleet', 'Customer Support', 'Services & About'];
R.sort((a, b) => ORDER.indexOf(a.module) - ORDER.indexOf(b.module) || a.id.localeCompare(b.id));
const defects = fs.existsSync(path.join(RD, 'defects.json')) ? JSON.parse(fs.readFileSync(path.join(RD, 'defects.json'))) : [];
const meta = fs.existsSync(path.join(RD, 'meta.json')) ? JSON.parse(fs.readFileSync(path.join(RD, 'meta.json'))) : {};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ST = ['Pass', 'Fail', 'Blocked', 'Inconclusive', 'Error'];
const cnt = (L, s) => L.filter(r => r.status === s).length;
const ev = p => `../../${p}`;

// ---- vehicle coverage vs workbook master list ----
const X = require('xlsx'); const wb = X.readFile('documentation/User_WEB_cases.xlsx');
const master = X.utils.sheet_to_json(wb.Sheets.ADDITIONAL_TEST_INFO, { header: 1 }).filter(r => /^VEH-/.test(r[0])).map(r => ({ id: r[0], name: String(r[1]).trim() }));
const key = s => s.toLowerCase().replace(/['’]s\b|s\b/g, '').replace(/[^a-z0-9]/g, '');
const offered = new Map(); for (const r of R) for (const v of r.allVehicles || []) { const n = v.split('|')[0]; offered.set(key(n), n); }
const used = new Map(); for (const r of R) if (r.vehicle?.name && (r.fare || r.status !== 'Error')) { const k = key(r.vehicle.name); used.set(k, [...(used.get(k) || []), r.id]); }
const vcov = master.map(m => ({ ...m, offered: offered.has(key(m.name)), cases: used.get(key(m.name)) || [] }));

// ---- fare checks ----
const fares = R.filter(r => r.fare).map(r => ({ id: r.id, module: r.module, vehicle: r.vehicle ? `${r.vehicle.name} (${r.vehicle.code})` : '', f: r.fare }));

// ---- mandatory configuration matrix ----
const CFG = [['Local CFG-1 Normal (Multi-day OFF, Drop OFF)', 'TC_LOC_003'], ['Local CFG-2 Multi-day (ON / OFF)', 'TC_LOC_004'], ['Local CFG-3 Different drop (OFF / ON)', 'TC_LOC_005'], ['Local CFG-4 Multi-day + drop (ON / ON)', 'TC_LOC_006'],
  ['Outstation single destination, default drop', 'TC_OUT_002'], ['Outstation single destination, different drop', 'TC_OUT_003'], ['Outstation multi-destination, default drop', 'TC_OUT_004'], ['Outstation multi-destination (5), different drop', 'TC_OUT_005'],
  ['Transfer Point to Point', 'TC_TRF_002'], ['Transfer Point to Point + Return', 'TC_TRF_008'], ['Transfer By Hour', 'TC_TBH_002'], ['Transfer By Hour + different drop', 'TC_TBH_005'], ['Multi-Leg (Local + Outstation)', 'TC_MLG_007'], ['Multi-Leg (Local + Transfer)', 'TC_MLG_008']];
const byId = Object.fromEntries(R.map(r => [r.id, r]));

// ---- CSV ----
const q = s => `"${String(s ?? '').replace(/"/g, '""')}"`;
fs.writeFileSync(path.resolve('results', `${RUN}.csv`), [['Test Case ID', 'Module', 'Title', 'Type', 'Priority', 'Status', 'Failed checks', 'Actual / Notes', 'Vehicle', 'Fare verdict', 'Evidence', 'Executed at'].map(q).join(','),
  ...R.map(r => [r.id, r.module, r.title, r.type, r.priority, r.status, (r.checks || []).filter(c => !c.pass).map(c => `${c.label}: ${c.detail}`).join(' | '), r.actual || r.error || r.notes || '', r.vehicle ? `${r.vehicle.name} ${r.vehicle.code}` : '', r.fare?.verdict || '', (r.evidence || []).join(' ; '), r.executedAt].map(q).join(','))].join('\n') + '\n');

// ---- HTML pieces ----
const pill = s => `<span class="st st-${s}"><i aria-hidden="true">${{ Pass: '✓', Fail: '✕', Blocked: '⏸', Inconclusive: '?', Error: '!' }[s] || '•'}</i>${esc(s)}</span>`;
const sevPill = s => `<span class="sev sev-${esc(s)}">${esc(s)}</span>`;
const total = R.length, executed = total - cnt(R, 'Blocked');
const passRate = executed ? Math.round(cnt(R, 'Pass') / executed * 100) : 0;
const mods = ORDER.filter(m => R.some(r => r.module === m));
const maxN = Math.max(...mods.map(m => R.filter(r => r.module === m).length));
const bars = mods.map(m => { const L = R.filter(r => r.module === m);
  const segs = ST.map(s => [s, cnt(L, s)]).filter(([, n]) => n).map(([s, n]) => `<span class="seg seg-${s}" style="flex:${n}" title="${esc(m)} – ${s}: ${n}"></span>`).join('');
  return `<div class="brow"><div class="blab">${esc(m)}</div><div class="btrack"><div class="bar" style="width:${L.length / maxN * 100}%">${segs}</div></div><div class="bnum">${cnt(L, 'Pass')}/${L.length}</div></div>`; }).join('');
const modTable = mods.map(m => { const L = R.filter(r => r.module === m); return `<tr><td>${esc(m)}</td><td class="n">${L.length}</td>${ST.map(s => `<td class="n">${cnt(L, s) || '–'}</td>`).join('')}</tr>`; }).join('');
const caseRows = R.map(r => {
  const failed = (r.checks || []).filter(c => !c.pass);
  const checks = (r.checks || []).map(c => `<li class="${c.pass ? 'ok' : 'ko'}"><b>${c.pass ? '✓' : '✕'}</b> ${esc(c.label)}${c.detail ? ` <span class="muted">— ${esc(c.detail)}</span>` : ''}</li>`).join('');
  const evid = (r.evidence || []).map(p => `<a href="${esc(ev(p))}" target="_blank">${esc(path.basename(p))}</a>`).join(' · ');
  return `<details class="case" data-st="${r.status}" data-mod="${esc(r.module)}"><summary><span class="cid">${r.id}</span>${pill(r.status)}<span class="ct">${esc(r.title)}</span><span class="muted cm">${esc(r.module)} · ${esc(r.priority)}</span></summary>
  <div class="cbody"><dl><dt>Type</dt><dd>${esc(r.type)}</dd><dt>Test data</dt><dd>${esc(r.data)}</dd><dt>Steps</dt><dd>${esc(r.steps)}</dd><dt>Expected</dt><dd>${esc(r.expected)}</dd>
  ${r.vehicle ? `<dt>Vehicle</dt><dd>${esc(r.vehicle.name)} (${esc(r.vehicle.code)}, ${esc(r.vehicle.seats)} seats, Starts From ${esc(r.vehicle.price)})</dd>` : ''}
  ${r.summary ? `<dt>App summary</dt><dd class="muted">${esc(r.summary)}</dd>` : ''}
  ${r.actual || r.error || r.notes ? `<dt>Actual / notes</dt><dd>${esc(r.actual || '')} ${esc(r.error || '')} ${esc(r.notes || '')}</dd>` : ''}
  ${r.fare ? `<dt>Fare verdict</dt><dd>${esc(r.fare.verdict)}${r.fare.arithmetic ? ` — ${esc(r.fare.arithmetic.expr)} (shown ₹${esc(r.fare.arithmetic.shown)})` : ''}</dd>` : ''}
  <dt>Checks</dt><dd><ul class="checks">${checks || '<li class="muted">No automated checks (see notes)</li>'}</ul></dd><dt>Evidence</dt><dd>${evid || '<span class="muted">—</span>'}</dd><dt>Duration</dt><dd>${esc(r.durationSec)} s</dd></dl></div></details>`; }).join('');
const defRows = defects.map(d => `<tr><td class="nw">${esc(d.id)}</td><td>${sevPill(d.severity)}</td><td>${esc(d.module)}</td><td><b>${esc(d.title)}</b><div class="muted small">Steps: ${esc(d.steps)}</div><div class="small"><b>Expected:</b> ${esc(d.expected)}</div><div class="small"><b>Actual:</b> ${esc(d.actual)}</div></td><td class="small">${(d.cases || []).map(esc).join(', ')}</td><td class="small">${(d.evidence || []).map(p => `<a href="${esc(ev(p))}" target="_blank">${esc(path.basename(p))}</a>`).join('<br>')}</td></tr>`).join('');
const fareRows = fares.map(({ id, module, vehicle, f }) => {
  const b = f.breakup || f.baseline?.breakup || {}; const comp = ['baseRate', 'extraKm', 'extraHour', 'dayBata', 'nightBata', 'toll', 'permit', 'gst'].map(k => b[k]).filter(Boolean);
  const pkg = (b.pricingBlock || [])[1] || '';
  const applied = f.applied || (f.baseline ? [`Baseline: ₹${f.baseline?.arithmetic?.shown}`, `Boundary: ₹${f.boundary?.arithmetic?.shown}`, `Δ ₹${f.actualDelta} (expected ₹${f.expected}, ${f.rule})`] : []);
  const arith = f.arithmetic ? `${esc(f.arithmetic.expr)} → shown ₹${esc(f.arithmetic.shown)} ${f.arithmetic.ok ? '✓' : '✕'}` : '';
  const rule = f.rule ? (typeof f.rule === 'string' ? esc(f.rule) : `${esc(f.rule.rule)} = ₹${esc(f.rule.expected)}; applied ₹${esc(f.rule.applied)} ${f.rule.ok ? '✓' : '✕'}`) : '';
  const verdict = /^Pass/.test(f.verdict) ? 'Pass' : /^Fail/.test(f.verdict) ? 'Fail' : 'Inconclusive';
  return `<tr><td class="nw">${esc(id)}</td><td>${esc(module)}<div class="muted small">${esc(vehicle)}</div></td><td class="small"><b>${esc(pkg)}</b><br>${comp.map(esc).join('<br>')}</td><td class="small">${applied.map(esc).join('<br>')}</td><td class="small">${arith}${rule ? '<br>' + rule : ''}${(f.notes || []).length ? '<br><span class="muted">' + f.notes.map(esc).join('; ') + '</span>' : ''}</td><td>${pill(verdict)}</td></tr>`; }).join('');
const vRows = vcov.map(v => `<tr><td>${esc(v.id)}</td><td>${esc(v.name)}</td><td>${v.offered ? 'Yes' : '<b>Not offered</b>'}</td><td>${v.cases.length ? v.cases.join(', ') : '<span class="muted">not selected</span>'}</td></tr>`).join('');
const vUsed = vcov.filter(v => v.cases.length).length;
const cfgRows = CFG.map(([n, id]) => `<tr><td>${esc(n)}</td><td class="nw">${id}</td><td>${byId[id] ? pill(byId[id].status) : '<span class="muted">not run</span>'}</td></tr>`).join('');
const blocked = R.filter(r => r.status === 'Blocked' || r.status === 'Error' || r.status === 'Inconclusive').map(r => `<tr><td class="nw">${r.id}</td><td>${pill(r.status)}</td><td>${esc(r.title)}</td><td class="small">${esc(r.actual || r.error || (r.fare?.notes || []).join('; ') || '')}</td></tr>`).join('');
const fareN = fares.length, fareP = fares.filter(x => /^Pass/.test(x.f.verdict)).length, fareF = fares.filter(x => /^Fail/.test(x.f.verdict)).length;
const sevC = s => defects.filter(d => d.severity === s).length;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Siddaganga User Web – QA Report ${esc(RUN)}</title>
<style>
:root{--bg:#f6f5f1;--surface:#fcfcfb;--ink:#0b0b0b;--ink2:#52514e;--muted:#6f6e69;--line:#e1e0d9;--axis:#c3c2b7;--accent:#8a1c2b;
--good:#0ca30c;--warn:#fab219;--serious:#ec835a;--crit:#d03b3b;--neutral:#9a9890;--goodtxt:#006300;--crittxt:#b02a2a;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#121211;--surface:#1a1a19;--ink:#f0efec;--ink2:#c3c2b7;--muted:#9a9890;--line:#2c2c2a;--axis:#383835;--accent:#e2828f;--goodtxt:#0ca30c;--crittxt:#ef7a7a;color-scheme:dark}}
:root[data-theme=dark]{--bg:#121211;--surface:#1a1a19;--ink:#f0efec;--ink2:#c3c2b7;--muted:#9a9890;--line:#2c2c2a;--axis:#383835;--accent:#e2828f;--goodtxt:#0ca30c;--crittxt:#ef7a7a;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1180px;margin:0 auto;padding:28px 20px 60px}
h1{font-size:26px;margin:0 0 4px;letter-spacing:-.01em}h2{font-size:18px;margin:36px 0 12px;padding-top:8px;border-top:1px solid var(--line)}h3{font-size:15px;margin:18px 0 8px}
.sub{color:var(--ink2)}.muted{color:var(--muted)}.small{font-size:12.5px}.nw{white-space:nowrap}
.card{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:18px 0}
.tile{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px 16px}.tile .k{font-size:12px;color:var(--ink2)}.tile .v{font-size:28px;font-weight:650;line-height:1.2;font-variant-numeric:tabular-nums}.tile .h{font-size:12px;color:var(--muted)}
.tile .dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:4px 20px;font-size:13px}.meta b{color:var(--ink2);font-weight:600}
.brow{display:grid;grid-template-columns:190px 1fr 56px;align-items:center;gap:10px;margin:6px 0}.blab{font-size:13px;color:var(--ink2);text-align:right}.bnum{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.btrack{border-left:1px solid var(--axis)}.bar{display:flex;gap:2px;height:16px}.seg{display:block;min-width:3px}.seg:first-child{border-radius:0 0 0 0}.seg:last-child{border-radius:0 4px 4px 0}
.seg-Pass{background:var(--good)}.seg-Fail{background:var(--crit)}.seg-Blocked{background:var(--warn)}.seg-Inconclusive{background:var(--neutral)}.seg-Error{background:var(--serious)}
.legend{display:flex;flex-wrap:wrap;gap:14px;font-size:12.5px;color:var(--ink2);margin:4px 0 10px}.legend span::before{content:"";display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;vertical-align:-1px;background:var(--c)}
.tw{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;color:var(--ink2);font-weight:600;background:var(--surface);position:sticky;top:0}td.n{text-align:right;font-variant-numeric:tabular-nums}
.st{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid var(--line);white-space:nowrap}.st i{font-style:normal;font-size:11px}
.st-Pass{color:var(--goodtxt)}.st-Pass i{color:var(--good)}.st-Fail{color:var(--crittxt)}.st-Fail i{color:var(--crit)}.st-Blocked i{color:#b07a00}.st-Inconclusive i{color:var(--neutral)}.st-Error i{color:var(--serious)}
.sev{font-size:12px;font-weight:600;padding:1px 8px;border-radius:4px;border:1px solid var(--line);white-space:nowrap}.sev-Critical,.sev-High{color:var(--crittxt)}.sev-Medium{color:#a35a00}.sev-Low{color:var(--ink2)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .sev-Medium{color:#f0a766}}:root[data-theme=dark] .sev-Medium{color:#f0a766}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}.filters button{font:inherit;font-size:12.5px;padding:4px 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}.filters button[aria-pressed=true]{border-color:var(--ink);font-weight:600}
.case{background:var(--surface);border:1px solid var(--line);border-radius:8px;margin:6px 0}.case summary{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:9px 12px;cursor:pointer;list-style:none}.case summary::-webkit-details-marker{display:none}
.cid{font-family:ui-monospace,Menlo,monospace;font-size:12.5px;min-width:96px}.ct{flex:1 1 300px}.cm{font-size:12px}.cbody{padding:0 14px 12px}
dl{display:grid;grid-template-columns:120px 1fr;gap:4px 14px;margin:0}dt{color:var(--ink2);font-size:12.5px}dd{margin:0;overflow-wrap:anywhere}
.checks{margin:0;padding:0;list-style:none}.checks li{margin:2px 0}.checks .ok b{color:var(--good)}.checks .ko b{color:var(--crit)}.checks .ko{font-weight:500}
a{color:var(--accent)}ul.plain{margin:6px 0;padding-left:18px}
@media (max-width:640px){.brow{grid-template-columns:110px 1fr 44px}dl{grid-template-columns:1fr}}
</style></head><body><div class="wrap">
<h1>Siddaganga Travels – User Web QA Report</h1>
<div class="sub">Exploratory + functional test execution across all modules · Preprod · Run <b>${esc(RUN)}</b></div>
<div class="card" style="margin-top:16px"><div class="meta">
<div><b>Environment:</b> Preprod (${esc(meta.url || '')})</div><div><b>Executed:</b> ${esc(meta.date || R.map(r => r.executedAt).sort()[0]?.slice(0, 10))}</div>
<div><b>Browser:</b> ${esc(meta.browser || 'Google Chrome (Playwright, headed), 1440×900; mobile check 390×844')}</div><div><b>Account:</b> Customer QA account (mobile login; details withheld)</div>
<div><b>Test data:</b> User_WEB_cases.xlsx (6 sheets)</div><div><b>Tester:</b> Claude Code (QA agent)</div></div></div>

<div class="tiles">
<div class="tile"><div class="k">Test cases</div><div class="v">${total}</div><div class="h">${mods.length} modules</div></div>
<div class="tile"><div class="k"><span class="dot" style="background:var(--good)"></span>Passed</div><div class="v">${cnt(R, 'Pass')}</div><div class="h">${passRate}% of executed</div></div>
<div class="tile"><div class="k"><span class="dot" style="background:var(--crit)"></span>Failed</div><div class="v">${cnt(R, 'Fail')}</div><div class="h">${defects.length} distinct defects</div></div>
<div class="tile"><div class="k"><span class="dot" style="background:var(--warn)"></span>Blocked</div><div class="v">${cnt(R, 'Blocked')}</div><div class="h">approval needed / re-run pending</div></div>
${cnt(R, 'Inconclusive') + cnt(R, 'Error') ? `<div class="tile"><div class="k"><span class="dot" style="background:var(--neutral)"></span>Inconclusive / Error</div><div class="v">${cnt(R, 'Inconclusive') + cnt(R, 'Error')}</div><div class="h">needs clarification</div></div>` : ''}
<div class="tile"><div class="k">Fare checks</div><div class="v">${fareP}/${fareN}</div><div class="h">consistent · ${fareF} failed</div></div>
<div class="tile"><div class="k">Vehicle coverage</div><div class="v">${vUsed}/${master.length}</div><div class="h">types selected end-to-end</div></div>
</div>

${meta.verdict ? `<div class="card"><h3 style="margin-top:0">QA verdict</h3>${meta.verdict}</div>` : ''}

<h2>Results by module</h2>
<div class="legend"><span style="--c:var(--good)">Pass</span><span style="--c:var(--crit)">Fail</span><span style="--c:var(--warn)">Blocked</span><span style="--c:var(--neutral)">Inconclusive</span><span style="--c:var(--serious)">Error</span></div>
<div class="card">${bars}</div>
<div class="tw" style="margin-top:12px"><table><thead><tr><th>Module</th><th class="n">Cases</th>${ST.map(s => `<th class="n">${s}</th>`).join('')}</tr></thead><tbody>${modTable}
<tr><th>Total</th><th class="n">${total}</th>${ST.map(s => `<th class="n">${cnt(R, s)}</th>`).join('')}</tr></tbody></table></div>

<h2>Defects (${defects.length}) — ${sevC('Critical')} critical · ${sevC('High')} high · ${sevC('Medium')} medium · ${sevC('Low')} low</h2>
<div class="tw"><table><thead><tr><th>ID</th><th>Severity</th><th>Module</th><th>Defect</th><th>Cases</th><th>Evidence</th></tr></thead><tbody>${defRows || '<tr><td colspan=6 class="muted">None</td></tr>'}</tbody></table></div>

<h2>Mandatory trip configurations</h2>
<div class="tw"><table><thead><tr><th>Configuration</th><th>Case</th><th>Status</th></tr></thead><tbody>${cfgRows}</tbody></table></div>

<h2>Fare verification (${fareN} checks)</h2>
<p class="muted small">Procedure: User-Web/.claude/shared/fare-verification.md. Each check reads the vehicle's Fare Breakup, then the applied fare on the review step (stopped before Confirm), verifies the arithmetic and the base-rate rule. "Starts From" card prices were never used for validation. Unconfirmed rules are reported as Inconclusive.</p>
<div class="tw"><table><thead><tr><th>Case</th><th>Module / vehicle</th><th>Fare Breakup</th><th>Applied fare</th><th>Arithmetic & rule</th><th>Verdict</th></tr></thead><tbody>${fareRows}</tbody></table></div>

<h2>Vehicle coverage (${vUsed}/${master.length} from ADDITIONAL_TEST_INFO)</h2>
<div class="tw"><table><thead><tr><th>ID</th><th>Vehicle type</th><th>Offered in results</th><th>Selected end-to-end in</th></tr></thead><tbody>${vRows}</tbody></table></div>

${meta.coverage ? `<h2>Coverage &amp; scope</h2><div class="card">${meta.coverage}</div>` : ''}

<h2>Blocked, inconclusive and open items</h2>
<div class="tw"><table><thead><tr><th>Case</th><th>Status</th><th>Title</th><th>Reason</th></tr></thead><tbody>${blocked || '<tr><td colspan=4 class="muted">None</td></tr>'}</tbody></table></div>
${meta.questions ? `<h3>Open questions for business / development</h3>${meta.questions}` : ''}

<h2>All test cases (${total})</h2>
<div class="filters" role="group" aria-label="Filter by status"><button aria-pressed="true" data-f="all">All</button>${ST.filter(s => cnt(R, s)).map(s => `<button aria-pressed="false" data-f="${s}">${s} (${cnt(R, s)})</button>`).join('')}</div>
<div id="cases">${caseRows}</div>
<p class="muted small" style="margin-top:30px">Evidence paths are relative to this report (screenshots/all/${esc(RUN)}/). Personal data (customer name, phone, email) is masked in screenshots and removed from recorded text. No booking, inquiry, draft, ticket or profile change was submitted — all such API calls were blocked by the test harness.</p>
</div>
<script>
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));const f=b.dataset.f;document.querySelectorAll('.case').forEach(c=>c.hidden=f!=='all'&&c.dataset.st!==f);}));
</script></body></html>`;
const out = path.resolve('reports', RUN); fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'qa-final-report.html'), html);
console.log(`report: reports/${RUN}/qa-final-report.html (${total} cases; ${ST.map(s => `${s} ${cnt(R, s)}`).join(', ')}); csv: results/${RUN}.csv`);
