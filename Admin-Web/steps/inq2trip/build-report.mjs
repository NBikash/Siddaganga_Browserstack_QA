// Builds reports/<run>/inquiry-to-trip-report.html from results/<run>/steps.json + record.json (skill §3).
// Usage: node steps/inq2trip/build-report.mjs [runId]
import fs from 'node:fs';
import path from 'node:path';
const RUN = process.argv[2] || 'admin-web-20261112-2229-INQ2TRIP';
const RES = path.resolve('results', RUN), OUT = path.resolve('reports', RUN);
const rec = JSON.parse(fs.readFileSync(path.join(RES, 'record.json')));
const raw = JSON.parse(fs.readFileSync(path.join(RES, 'steps.json')));
const byStage = new Map(); for (const s of raw) byStage.set(s.stage, s); // last entry per stage wins
const steps = [...byStage.values()];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const img = p => p ? `<a href="../../${esc(p)}" target="_blank"><img src="../../${esc(p)}" alt="${esc(path.basename(p))}"></a>` : '';
const SPEC = { S0: 'Login (step 1)', S1: 'Lead Management · View Lead · PNR match (step 2)', S1b: 'Return to matched lead', S2: 'Send to Inquiry (3–4)', S3: 'Update Quote (5)',
  S4: 'Total Inquiry listed (6–7)', S5: 'Send to Booking (8)', S6: 'Convert into Booking → Yes (9)', S7: 'Prebooking listed (10–11)', S8: 'Confirm Booking (12)', S9: 'Booked listed (13)',
  'S10-identify': 'Upcoming Trip · identify record', S10: 'Send to Trip Approval → Yes (14–15)', S11: 'Allocation Portal · Allocate enabled (16–17)', S12: 'Allocate · Continue steps (18)',
  S13: 'Allocate Vehicle → Confirm Allocation (19)', S14: 'Return to portal · Allocate Driver available (20–21)', S15: 'Allocate Driver (22)', S16: 'Approved & Track Live Trips listed (23–24)',
  S17: 'Initiate Vehicle Dispatch (25–26)', S18: 'Ready for Trip listed (27)', S19: 'Start Trip → Confirm (28)', S20: 'Live Trips listed (29)', S21: 'Complete Trip (30)', S22: 'Completed Trip listed (31)', S23: 'Close Trip (32)' };
const count = r => steps.filter(s => s.result === r).length;
const ISSUES = [
  ['D1', 'Defect', 'S1, S2, S8, S10–S23', 'Pickup/drop time shown as 12:00 AM on every Admin screen (Lead Details, Update Inquiry – read-only, Confirm Booking, Upcoming/Live/Completed Trips); User-Web TC-01 submitted 3:00 PM.', 'S01-view-lead-pnr.png'],
  ['D2', 'Defect', 'S10', 'Upcoming Trips: B-932 row has a blank TRIP ID; record could only be identified via the Edit Booking prompt ("Booking B-932").', 'S10-identity-edit-booking-url.png'],
  ['D3', 'Defect', 'S10', 'Upcoming Trips pagination repeats rows (TP-105 appears twice; two identical Subrata S 11 Nov rows on different pages).', 'S10-upcoming-list.png'],
  ['D4', 'Defect', 'S13', 'After a successful allocation (assign-vehicle 200) the page still shows "Bus Assigned Status for this Trip : Not Assigned Yet".', 'S13-confirm-allocation-1.png'],
  ['D5', 'Defect', 'S17', 'Dispatch Trip Sheet: Permit document and Helper are mandatory but not marked; errors are raw ("permitDocument cannot be null", "\\"Helper\\" is not allowed to be empty field", API 400).', 'S17-after-submit.png'],
  ['D6', 'Defect', 'S10', 'Duty notification "New duty TP-111 — Local, report 12:00 AM @ -, drop -": pickup and drop locations missing although the trip has Whitefield.', 'S10-after.png'],
  ['D7', 'Defect', 'S20', 'Live Trips CUSTOMER TYPE shows "Local" (journey type) instead of "National".', 'S20-live.png'],
  ['D8', 'Defect', 'S23', 'After closing, Completed Trips still offers "Close Trip"; close-sheet submit is labelled "Generate Trip Sheet & Mark Vehicle Ready"; "Select Date" and "Vehicle" inputs are both named vehicleNo and the Vehicle input holds "60".', 'S23-verify-closed-menu.png'],
  ['C1', 'Flow deviation / clarification', 'S14–S15', 'Steps 20–22 not possible: right after Confirm Allocation TP-111 left the Vehicle Allocation Portal; "Allocate Driver" was never offered and "Test Driver" was auto-assigned; status "On trip" shown before dispatch. Continued from S16 on user decision. Confirm whether auto-assignment is intended.', 'S16-approved-list.png'],
  ['C2', 'Clarification', 'S10', 'Upcoming Trips → Edit Booking opens "Record Advance Payment?" instead of an edit form.', 'S10-identity-edit-booking-url.png'],
  ['U1', 'UX', 'S12, S17, S19, S21, S23', '"Record Advance Payment?" prompt interrupts Allocate, Dispatch, Start, Complete and Close (declined each time with No, Not Now / No, Continue to Allocation).', 'S19-start-dialog.png'],
  ['U2', 'UX', 'S2, S3', 'Send To Inquiry navigates after >2.5 s with no feedback; Update Quote shows no success message (API 200 only).', 'S03-update-quote-result.png'],
  ['U3', 'UX', 'S1, S4, S7', 'Inquiry PNR is not searchable in Lead, Inquiry or Booking lists; lead had to be verified via View Lead (10 candidate leads opened for the duplicate check).', 'S01-lead-list.png'],
  ['U4', 'Text', 'S6, S17', 'Grammar/typos: "Are you sure want to convert…", "Tabbi have no data"; API paths "vechicle", "depature".', 'S06-convert-confirm.png'],
];
const AUTO = [
  'S8: a generic menu script clicked inside a stale open menu and opened B-932 "Cancel and Notify". Cancel & Notify was NOT clicked; the dialog closed and B-932 was verified intact in Pre-Bookings after reload (S08-B932-intact-after-reload.png). Menu helpers were rewritten with forbidden-action guards.',
  'S2/S3: two screenshots showed the customer phone inside an input field; they were deleted and re-captured with input masking before continuing.',
  'Several first attempts used wrong selectors (menu container, text-boundary match) and were re-run after inspection; none performed an app action.',
];
const shotDir = `screenshots/inquiry-to-trip/${RUN}/`;
const rows = steps.map(s => `<tr><td class="mono">${esc(s.stage)}</td><td>${esc(SPEC[s.stage] || '')}</td><td><span class="pill ${esc(s.result.replace(' ', '').toLowerCase())}">${esc(s.result)}</span></td><td>${esc(s.observed)}${s.issue ? `<div class="iss">⚠ ${esc(s.issue)}</div>` : ''}${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}</td><td class="thumb">${img(s.shot)}</td></tr>`).join('');
const issues = ISSUES.map(([id, k, st, d, sh]) => `<article class="issue"><h3><span class="mono">${id}</span> ${esc(k)} <small>· ${esc(st)}</small></h3><p>${esc(d)}</p>${img(shotDir + sh)}</article>`).join('');
const ids = [['Inquiry PNR', rec.pnr], ['Lead ID', rec.leadId], ['Admin Inquiry ID', rec.adminInquiryId], ...rec.laterIds.map(x => [x.idType, x.value]), ['Vehicle', rec.vehicle], ['Final status', rec.finalStatus], ['Invoice notification', rec.invoiceNotification]];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Inquiry to Trip Closure</title><style>
:root{--bg:#f6f4ef;--card:#fff;--ink:#1d2230;--muted:#5c6475;--line:#e2ded4;--accent:#8c1d2f;--pass:#1f7a44;--fail:#b42318;--blocked:#a15c00;--nr:#6b7280;--code:#f1eee7}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--nr:#9aa3b2;--code:#232a35}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b2029;--ink:#e6e9ef;--muted:#9aa3b2;--line:#2d3440;--accent:#e0778a;--pass:#5cc27e;--fail:#ff8a80;--blocked:#e8b04a;--nr:#9aa3b2;--code:#232a35}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,Segoe UI,sans-serif}main{max-width:1180px;margin:0 auto;padding:24px 16px}
h1{color:var(--accent);margin:0 0 4px}h2{margin:32px 0 12px;border-bottom:2px solid var(--line);padding-bottom:6px}.muted{color:var(--muted)}.mono{font-family:ui-monospace,Consolas,monospace}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.tile b{display:block;font-size:26px}
.tile.pass b{color:var(--pass)}.tile.fail b{color:var(--fail)}.tile.blocked b{color:var(--blocked)}.tile.notrun b{color:var(--nr)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px;overflow-x:auto}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid var(--line);padding:8px;vertical-align:top;text-align:left}
th{font-size:12px;text-transform:uppercase;color:var(--muted)}.pill{display:inline-block;border-radius:99px;padding:1px 9px;font-size:12px;font-weight:600;color:#fff}.pill.pass{background:var(--pass)}.pill.fail{background:var(--fail)}.pill.blocked{background:var(--blocked)}.pill.notrun{background:var(--nr)}
.thumb img{width:180px;border:1px solid var(--line);border-radius:6px}.iss{color:var(--blocked);margin-top:4px}.note{color:var(--muted);font-size:13px;margin-top:4px}
.issue{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--accent);border-radius:8px;padding:10px 14px;margin:10px 0}.issue h3{margin:0 0 4px;font-size:16px}.issue img{max-width:420px;width:100%;border:1px solid var(--line);border-radius:6px}
ul{padding-left:20px}@media (max-width:640px){.thumb img{width:110px}td,th{padding:6px}}
</style></head><body><main>
<h1>Inquiry to Trip Closure</h1><p class="muted">Admin-Web Preprod · run <span class="mono">${RUN}</span> · source User-Web <span class="mono">${esc(rec.sourceRun)}</span> ${esc(rec.sourceTc)} · ${new Date().toISOString().slice(0, 10)}</p>
<div class="tiles"><div class="tile"><span>Stages</span><b>${steps.length}</b></div><div class="tile pass"><span>Pass</span><b>${count('Pass')}</b></div><div class="tile fail"><span>Fail</span><b>${count('Fail')}</b></div><div class="tile blocked"><span>Blocked</span><b>${count('Blocked')}</b></div><div class="tile notrun"><span>Not Run</span><b>${count('Not Run')}</b></div><div class="tile fail"><span>Defects</span><b>${ISSUES.filter(i => i[1] === 'Defect').length}</b></div></div>
<div class="card"><p><b>Result:</b> the User-Web inquiry (PNR ${esc(rec.pnr)}) was tracked from Lead through Close Trip; final state <b>${esc(rec.finalStatus)}</b>. One specified transition could not be performed as written (S14–S15, Allocate Driver: driver auto-assigned); the run continued from S16 on the user's decision. No Advance/payment option was selected anywhere; Finance was not opened.</p></div>
<h2>Record identity</h2><div class="card"><table>${ids.map(([k, v]) => `<tr><th>${esc(k)}</th><td class="mono">${esc(v)}</td></tr>`).join('')}</table>
<p class="muted">Matching: ${esc(rec.s1?.matchMethod)}. Duplicate check: ${esc(rec.s1?.duplicateCheck)}.</p></div>
<h2>Stage results</h2><div class="card"><table><thead><tr><th>Stage</th><th>Specified step</th><th>Result</th><th>Observed</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2>Issues</h2>${issues}
<h2>Automation / environment notes (not app defects)</h2><div class="card"><ul>${AUTO.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>
<h2>Test data used</h2><div class="card"><ul><li>Quote: pre-filled values unchanged (₹4,500, GST 5%) – user decision.</li><li>Vehicle: first listed Sedan KA21AB9876; driver: auto-assigned "Test Driver" – user decision "first valid option".</li><li>Dispatch: safety confirmation ticked, note, odometer/opening km 10000, fuel 20, last diesel 20, mileage 12, helper "QA Test Helper", permit = generated one-page test PDF (test-data/qa-test-permit.pdf).</li><li>Close: closing km 10040, total km 40, present diesel 20, no extra expenses.</li></ul></div>
<h2>Out of scope (not touched)</h2><div class="card"><ul><li>Every "Record Advance" prompt declined; no advance or payment recorded.</li><li>Financial Management, Payment &amp; Refund, invoice INV-101 not opened.</li><li>No cancellation, no other records, no Assign / Delete / Send Quote / Proforma actions.</li></ul></div>
</main></body></html>`;
fs.mkdirSync(OUT, { recursive: true });
const file = path.join(OUT, 'inquiry-to-trip-report.html');
fs.writeFileSync(file, html);
const missing = [...html.matchAll(/src="\.\.\/\.\.\/([^"]+)"/g)].map(m => m[1]).filter(p => !fs.existsSync(path.resolve(p)));
console.log(JSON.stringify({ file, stages: steps.length, pass: count('Pass'), blocked: count('Blocked'), notRun: count('Not Run'), defects: ISSUES.filter(i => i[1] === 'Defect').length, missingImages: missing }));
