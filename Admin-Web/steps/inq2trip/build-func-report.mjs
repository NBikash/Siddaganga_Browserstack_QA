// Builds reports/<run>/admin-functional-qa-report.html from results/<run>/{record,usecases,issues}.json
// Structure per Admin_Functional_QA_Coverage.md §7. Usage: node steps/inq2trip/build-func-report.mjs [runId]
import fs from 'node:fs';
import path from 'node:path';
const RUN = process.argv[2] || 'admin-web-20261113-1016-FUNC';
const RES = path.resolve('results', RUN), OUT = path.resolve('reports', RUN);
const rec = JSON.parse(fs.readFileSync(path.join(RES, 'record.json')));
const UC = JSON.parse(fs.readFileSync(path.join(RES, 'usecases.json')));
const IS = JSON.parse(fs.readFileSync(path.join(RES, 'issues.json'))).sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ORDER = ['Lead Management', 'Inquiry Management', 'Quotation / Update Quote', 'Pre-Bookings', 'Booked', 'Upcoming Trip / Trip Approval', 'Vehicle Allocation Portal', 'Driver Allocation', 'Approved & Track Live Trips', 'Vehicle Dispatch', 'Ready for Trip', 'Live Trips', 'Completed Trip / Trip Closure', 'Cross-module consistency & UI/UX'];
const ucNum = id => { const [p, n] = id.split('-'); return [p, +n]; };
const mods = ORDER.filter(m => UC.some(u => u.module === m));
const ST = ['Pass', 'Fail', 'Blocked', 'Not Run'];
const cls = s => s.toLowerCase().replace(/\s+/g, '');
const kind = i => i.clarification ? 'Clarification' : (/^(Functional|Validation|Data inconsistency)$/.test(i.classification) ? 'Defect' : 'Observation');
const issueModule = i => { const m = ORDER.find(o => (i.module || '').startsWith(o.split(' /')[0])) || i.module; return m; };
const link = p => `<a href="../../${esc(p)}" target="_blank">${esc(path.basename(p))}</a>`;
const thumb = p => `<a href="../../${esc(p)}" target="_blank"><img src="../../${esc(p)}" alt="${esc(path.basename(p))}"></a>`;
const tot = s => UC.filter(u => u.status === s).length;
const kinds = { Defect: IS.filter(i => kind(i) === 'Defect'), Observation: IS.filter(i => kind(i) === 'Observation'), Clarification: IS.filter(i => kind(i) === 'Clarification') };
const sev = ['Critical', 'High', 'Medium', 'Low'];

const modRows = mods.map(m => { const us = UC.filter(u => u.module === m); const iss = IS.filter(i => UC.some(u => u.module === m && (u.issues || []).includes(i.id))); return `<tr><td>${esc(m)}</td><td>${us.length}</td>${ST.map(s => `<td class="n ${cls(s)}">${us.filter(u => u.status === s).length || ''}</td>`).join('')}<td>${iss.length}</td><td>${iss.filter(i => kind(i) === 'Defect').length}</td></tr>`; }).join('');
const ucTables = mods.map(m => {
  const us = UC.filter(u => u.module === m).sort((a, b) => { const [pa, na] = ucNum(a.id), [pb, nb] = ucNum(b.id); return pa === pb ? na - nb : pa.localeCompare(pb); });
  return `<h3 id="m-${cls(m).replace(/[^a-z]/g, '')}">${esc(m)} <small>(${us.length})</small></h3><div class="card scroll"><table class="uc"><thead><tr><th>ID</th><th>Title</th><th>Scenario / Objective</th><th>Preconditions</th><th>Steps performed</th><th>Expected</th><th>Actual</th><th>Status</th><th>Evidence</th></tr></thead><tbody>${us.map(u => `<tr><td class="mono">${esc(u.id)}</td><td>${esc(u.title)}</td><td>${esc(u.objective)}</td><td>${esc(u.pre)}</td><td><ol>${(u.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></td><td>${esc(u.expected)}</td><td>${esc(u.actual)}${u.note ? `<div class="note">${esc(u.note)}</div>` : ''}${(u.issues || []).length ? `<div class="refs">Issues: ${u.issues.map(x => `<a href="#${x}">${x}</a>`).join(', ')}</div>` : ''}</td><td><span class="pill ${cls(u.status)}">${esc(u.status)}</span></td><td>${(u.evidence || []).map(link).join('<br>') || '—'}</td></tr>`).join('')}</tbody></table></div>`;
}).join('');
const issueHtml = IS.map(i => `<article class="issue" id="${i.id}"><header><span class="mono">${esc(i.id)}</span> <b>${esc(i.title)}</b><span class="tags"><span class="tag k-${cls(kind(i))}">${kind(i)}</span><span class="tag">${esc(i.classification)}</span><span class="tag s-${cls(i.severity)}">${esc(i.severity)}</span></span></header>
<dl><dt>1. Issue ID</dt><dd class="mono">${esc(i.id)}</dd><dt>2. Module and screen</dt><dd>${esc(i.module)} · ${esc(i.screen)}</dd><dt>3. Title</dt><dd>${esc(i.title)}</dd><dt>4. Environment and record</dt><dd>${esc(i.env)}<br>${esc(i.record)}</dd><dt>5. Preconditions</dt><dd>${esc(i.pre)}</dd><dt>6. Steps to reproduce</dt><dd><ol>${(i.steps || []).map(s => `<li>${esc(s)}</li>`).join('')}</ol></dd><dt>7. Expected result</dt><dd>${esc(i.expected)}</dd><dt>8. Actual result</dt><dd>${esc(i.actual)}</dd><dt>9. Description</dt><dd>${esc(i.description)}</dd><dt>10. Evidence</dt><dd class="ev">${(i.evidence || []).map(thumb).join('')}</dd><dt>11. Severity / priority</dt><dd>${esc(i.severity)} (priority ${({ Critical: 'P1', High: 'P1', Medium: 'P2', Low: 'P3' })[i.severity] || 'P3'})</dd><dt>12. Classification</dt><dd>${esc(i.classification)}${i.clarification ? ' · needs business clarification' : ''}</dd></dl>
<p class="used">Found in: ${UC.filter(u => (u.issues || []).includes(i.id)).map(u => esc(u.id)).join(', ') || '—'}</p></article>`).join('');
const kindTable = k => kinds[k].length ? `<table><thead><tr><th>ID</th><th>Title</th><th>Classification</th><th>Severity</th></tr></thead><tbody>${kinds[k].map(i => `<tr><td class="mono"><a href="#${i.id}">${i.id}</a></td><td>${esc(i.title)}</td><td>${esc(i.classification)}</td><td>${esc(i.severity)}</td></tr>`).join('')}</tbody></table>` : '<p>None</p>';
const UNCOVERED = {
  'Excluded by scope (never clicked)': ['Delete (Lead, Inquiry)', 'Cancel Inquiry, Cancel Booking, Cancel & Notify, Cancel Trip', 'Record Advance / "Yes, Record Advance" (every prompt declined)', 'Send / Download Proforma Invoice, Download Invoice, Proforma Invoice Only', 'Financial Management, Payment And Refund Management'],
  'Approval-needed (sends messages or creates side records) – not run': ['Assign lead (also blocked: no sales employees)', 'Send Quote, Send Bus Images, Send Booking Form, Send Customer Inquiry Form, Send Trip Info', 'Send Notification (form inspected), Notify Service Manager (does not open)', 'Emergency/Breakdown Add Request (blank validation only), Refuel Request submit (blank validation only)', 'Add Extra Expenses on close sheet'],
  'Not executed / not reached': ['IM-06 Add inquiry and PB-08 Add New Booking blank submit (risk of junk records given ISS-05)', 'Combined Quotes / Detailed Quotes (downloads)', 'Save Assignment (calendar), GST Change Save, Change Bus Type Save, Vendor List actions', 'Edit Allocation re-allocation, Edit Driver Details replacement, Add Extra Amenities add, Edit Trip Details save, Track Live Refresh, trip-sheet Download', 'VA-10 vehicle availability after allocation, RT-03 menu capture', 'CT-04 Add Expense and CT-05 bata recompute (trip closed during CT-03)', 'Multi-vehicle combination allocation (requested inquiry had 1 vehicle)'],
};
const AUTO = [
  'Pressing Enter in Trip Description (my script) submitted the quote: description + Toll 100 were saved; Toll was restored to 0 afterwards. Logged as ISS-09 (UX) because the app submits on Enter.',
  'Validation tests intentionally saved invalid data where the app allowed it (Pax blank, Pax 0, Additional HR 1); each was restored and re-verified (Pax 1, Additional HR 0, Toll 0).',
  'CT-03: the second invalid close-sheet submission (Present Diesel -5) was accepted by the app and closed TP-112; the planned clean closure (CT-06), Add Expense (CT-04) and bata recompute (CT-05) could therefore not be run. Reported as ISS-43.',
  'Back to Pre-Bookings and re-confirm (BK-02) moved the record backward and forward once; final state Booked was verified.',
  'Preprod returned net::ERR_EMPTY_RESPONSE twice (environment); retried once each. View Trip Summary after closure did not open on its single attempt in that period – not counted as a defect.',
  'Several first attempts failed on selectors/timing (menus, calendar listbox, pagination outside <main>, list rendering) and were re-run after inspection; early "not found" readings for B-944 / TP-112 were automation timing, not app behaviour.',
  'Screenshots mask phone, e-mail and client-name inputs; captures taken in loading states were deleted.',
];
const ids = [['Inquiry PNR', rec.pnr], ['Lead ID', rec.leadId], ['Admin Inquiry ID', rec.adminInquiryId], ...rec.laterIds.map(x => [x.idType, x.value]), ['Requested vehicle', rec.requestedVehicle], ['Allocated vehicle', rec.vehicle], ['Driver', rec.driver], ['Source', rec.source]];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin Functional QA</title><style>
:root{--bg:#f6f4ef;--card:#fff;--ink:#1d2230;--muted:#5c6475;--line:#e2ded4;--accent:#8c1d2f;--pass:#1f7a44;--fail:#b42318;--blocked:#a15c00;--nr:#6b7280;--clar:#4b5fc1}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--nr:#9aa3b2;--clar:#a9b4f5}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--nr:#9aa3b2;--clar:#a9b4f5}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,Segoe UI,sans-serif}main{max-width:1280px;margin:0 auto;padding:24px 16px}h1{color:var(--accent);margin:0}h2{margin:34px 0 12px;border-bottom:2px solid var(--line);padding-bottom:6px}h3{margin:22px 0 8px}h3 small{color:var(--muted);font-weight:400}
.muted{color:var(--muted)}.mono{font-family:ui-monospace,Consolas,monospace}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid var(--line);padding:7px;vertical-align:top;text-align:left}th{font-size:12px;text-transform:uppercase;color:var(--muted)}table.uc{min-width:1100px}table.uc td:nth-child(5){min-width:220px}ol{margin:0;padding-left:18px}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:14px 0}.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}.tile b{display:block;font-size:24px}.tile.pass b{color:var(--pass)}.tile.fail b{color:var(--fail)}.tile.blocked b{color:var(--blocked)}.tile.notrun b{color:var(--nr)}.tile.clar b{color:var(--clar)}
.pill{display:inline-block;border-radius:99px;padding:1px 9px;font-size:12px;font-weight:600;color:#fff;white-space:nowrap}.pill.pass{background:var(--pass)}.pill.fail{background:var(--fail)}.pill.blocked{background:var(--blocked)}.pill.notrun{background:var(--nr)}
td.n.pass{color:var(--pass)}td.n.fail{color:var(--fail)}td.n.blocked{color:var(--blocked)}td.n.notrun{color:var(--nr)}.note{color:var(--muted);font-size:12px;margin-top:4px}.refs{font-size:12px;margin-top:4px}
.issue{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:10px 14px;margin:12px 0}.issue header{font-size:15px;margin-bottom:6px}.tags{float:right}.tag{display:inline-block;border:1px solid var(--line);border-radius:99px;padding:0 8px;font-size:11px;margin-left:4px}.k-defect{color:var(--fail);border-color:var(--fail)}.k-clarification{color:var(--clar);border-color:var(--clar)}.s-critical,.s-high{color:var(--fail)}
dl{display:grid;grid-template-columns:200px 1fr;gap:4px 12px;margin:0}dt{color:var(--muted);font-size:12px}dd{margin:0}.ev img{max-width:340px;width:100%;border:1px solid var(--line);border-radius:6px;margin:4px 6px 4px 0}.used{color:var(--muted);font-size:12px;margin:6px 0 0}
a{color:var(--accent)}@media (max-width:700px){dl{grid-template-columns:1fr}.tags{float:none;display:block}}
</style></head><body><main>
<h1>Admin-Web Functional QA</h1><p class="muted">Lead → Trip Closure · Preprod · run <span class="mono">${RUN}</span> · test PNR <span class="mono">${esc(rec.pnr)}</span> · 13 Nov 2026</p>
<h2>1. Overall execution summary</h2>
<div class="tiles"><div class="tile"><span>Use cases</span><b>${UC.length}</b></div>${ST.map(s => `<div class="tile ${cls(s)}"><span>${s}</span><b>${tot(s)}</b></div>`).join('')}<div class="tile fail"><span>Confirmed defects</span><b>${kinds.Defect.length}</b></div><div class="tile"><span>Observations</span><b>${kinds.Observation.length}</b></div><div class="tile clar"><span>Clarifications</span><b>${kinds.Clarification.length}</b></div></div>
<div class="card"><p><b>Final workflow status:</b> ${esc(rec.finalStatus)}. <b>Last successfully completed stage:</b> ${esc(rec.lastStage)} – every stage from Lead to Close Trip was executed on the single test record; closure happened via an invalid close-sheet submission the app accepted (ISS-43).</p>
<p><b>Requested vs allocated vehicle:</b> requested ${esc(rec.requestedVehicle)}; allocated ${esc(rec.vehicle)}. No substitution.</p>
<p><b>Severity of confirmed defects:</b> ${sev.map(s => `${s} ${kinds.Defect.filter(i => i.severity === s).length}`).join(' · ')}. Highest impact: quote total never recalculates (ISS-06), pax accepts blank/0/over-capacity (ISS-05), pickup time lost and not editable before the Live stage (ISS-01/ISS-07), Aadhaar exposed (ISS-35), negative diesel accepted at closure (ISS-43).</p></div>
<h3>Record identity</h3><div class="card"><table>${ids.map(([k, v]) => `<tr><th>${esc(k)}</th><td class="mono">${esc(v)}</td></tr>`).join('')}</table><p class="muted">Identification: View Lead confirmed Inquiry PNR = ${esc(rec.pnr)} (exact) on LD-353, then the Lead ID was used in Search Lead Info; later stages located by Inquiry/Booking/Trip IDs. No scanning of other leads.</p></div>
<h2>2. Module-wise counts</h2><div class="card scroll"><table><thead><tr><th>Module</th><th>Use cases</th>${ST.map(s => `<th>${s}</th>`).join('')}<th>Issues</th><th>Defects</th></tr></thead><tbody>${modRows}<tr><th>Total</th><th>${UC.length}</th>${ST.map(s => `<th>${tot(s)}</th>`).join('')}<th>${IS.length}</th><th>${kinds.Defect.length}</th></tr></tbody></table><p class="muted">Issue counts per module count each issue once per module where it was observed.</p></div>
<h2>3. Use Cases Tested</h2>${ucTables}
<h2>4. Issues Observed (${IS.length})</h2>${issueHtml}
<h2>5. Confirmed defects vs observations vs clarifications</h2><h3>Confirmed defects (${kinds.Defect.length})</h3><div class="card scroll">${kindTable('Defect')}</div><h3>Observations – UI / UX / Content / Terminology (${kinds.Observation.length})</h3><div class="card scroll">${kindTable('Observation')}</div><h3>Business clarifications (${kinds.Clarification.length})</h3><div class="card scroll">${kindTable('Clarification')}</div>
</main></body></html>`;
fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, 'admin-functional-qa-report.html');
fs.writeFileSync(file, html);
const refs = [...html.matchAll(/(?:src|href)="\.\.\/\.\.\/([^"]+)"/g)].map(m => m[1]);
console.log(JSON.stringify({ file, useCases: UC.length, byStatus: Object.fromEntries(ST.map(s => [s, tot(s)])), issues: IS.length, defects: kinds.Defect.length, observations: kinds.Observation.length, clarifications: kinds.Clarification.length, missingFiles: [...new Set(refs)].filter(p => !fs.existsSync(path.resolve(p))) }));
