---
name: admin-web-inquiry-to-trip
description: Admin-Web QA for an inquiry submitted from User-Web, from Lead → Inquiry → Quote → Booking → Trip Approval → Vehicle/Driver Allocation → Dispatch → Start → Complete → Close Trip. Two modes - "workflow" (happy-path transitions, one record) and "functional" (all non-excluded actions, edits, validations, filters, UI/UX and cross-module data consistency per module). Produces an HTML report. Use when asked to run, plan or report the Admin inquiry-to-trip flow or Admin functional QA. Excludes Delete, Cancel, Advance/payments and Finance.
---

# Admin-Web: Inquiry to Trip Closure (workflow + functional QA)

Read these files in full before doing anything:

- **`Admin-Web/documentation/workflows/Inquiry_to_Trip_Closure.md`**: stages S0–S23, record identity, observed
  real flow, stop rules, limitations.
- **`Admin-Web/documentation/workflows/Admin_Functional_QA_Coverage.md`**: module-wise use cases, action
  classification (safe / edit / transition / approval-needed / excluded), vehicle-matching rules, report structure.

This skill sets the gate, the rules and the execution order.

## 0. Gate (check before any browser action)

1. The user has **explicitly approved execution** in this session, naming the mode. Planning/documentation
   requests do not count.
2. The user has **supplied the Inquiry PNR** for the test record (no automatic User-Web ↔ Admin sync yet).
   Read User-Web results only read-only, for the requested vehicle type/count and trip details. Never modify User-Web.
3. `Admin-Web/.env` targets the Preprod Admin portal. Preserve the login configuration; never print `.env` values.
4. Test data and approval-needed actions from the coverage doc §2/§6 are agreed. Anything not agreed stays `Not Run`.

## 1. Rules

- Reuse the existing setup: `npm run browser` (CDP 9333), `npm run login`, `node scripts/run.mjs <step>`;
  helpers in `steps/inq2trip/_lib.mjs` (`rowAction`/`kebab` with the FORBIDDEN guard, `declineAdvance`, `rowIndex`,
  `snap` with input masking, `logStep`, `record`). Do not create a parallel project or install packages without asking.
- Credentials only from `.env` (or `login.mjs --prompt`); never print, log or screenshot them. If `login.mjs`
  reports "no .env credentials" on a cold start, the form had not rendered yet. Run it once more.
- **Exclusions (never click, not even to look):** Delete, Cancel Booking / Cancel Inquiry / Cancel Trip /
  Cancel & Notify, Record Advance / "Yes, Record Advance", any payment/refund, Finance / Financial Management /
  Payment And Refund Management, Proforma / Invoice download or send. A form's own "Cancel" (discard) button is
  also avoided; leave a form with browser Back or the dialog close (X) instead. Advance prompts are only ever
  **declined** ("No, Not Now" / "No, Continue to Allocation").
- Don't click an action just to see what it does when it could trigger an excluded or irreversible
  operation. Classify it first (coverage doc §2).
- **Inspect before acting.** Selectors, menus and dialogs come from the live DOM. Never invent selectors or
  assume behaviour. Unclear business rule → `Clarification`, not a defect.
- Menus: always verify the menu belongs to the target row, then click the item by **exact text** (helpers do
  this). Never click by position.

### Record identity (PNR → Lead ID)

1. Take the PNR supplied by the user.
2. Lead Management: put the most recent leads first, open **View Lead** on the candidate lead(s) for that PNR,
   read **Inquiry Information → Inquiry PNR**. Accept only an **exact** match.
3. Record the **Lead ID** and **Admin Inquiry ID**.
4. Return to Lead Management and type the Lead ID in **Search Lead Info**. Exactly one row must appear.
5. From then on, the **Lead ID / Inquiry ID / Booking ID / Trip ID** chain (recorded in `record.json`) is the direct
   lookup key. Use each list's search/filter. Never scan or open many records.
- Do **not** scan all leads of the customer for duplicates. If the PNR isn't found within the first page of
  recent leads, ask the user for the Lead ID rather than opening records one by one.
- Never select a record by name, route, date or passenger count alone. No exact PNR match → `Blocked`.
  Never fall back to another lead.
- Where a list has no ID search (e.g. Booked, Upcoming Trips), locate the row by ID text, and confirm identity
  through a screen that shows the ID (e.g. the Booking ID in a prompt or form).

### Vehicle allocation

Follow coverage doc §4:
- Read the requested vehicle type, seats and count from the User-Web inquiry and the Admin quote.
- Allocate the **same type/capacity**, and the requested combination if the app supports it.
- If it is unavailable, record it and only then choose another type, flagged clearly in the report.
- Verify the vehicle details before Confirm Allocation.

### Results

- Results: Pass / Fail / Blocked / Not Run per use case.
- Edits: re-open the record (and refresh) to verify the change persisted.
- Report UI/UX and content issues separately from functional defects. Automation timeouts and script mistakes go
  to "Automation notes", never into Issues.
- One issue per problem, with numbered reproduction steps and evidence.
- Blocked use case → record evidence, continue only with **independent** use cases.
- Avoid repeats: don't re-run use cases already passed in earlier runs (coverage doc §5 "Already covered")
  unless a variation is new. One screenshot per verification point.
- Mask PII (phone, email, client name inputs) in every screenshot.

## 2. Execution order

- **Workflow mode:** run ID `admin-web-<YYYYMMDD>-<HHMM>-INQ2TRIP`; S0 → S23 in order (workflow doc §5).
- **Functional mode:** run ID `admin-web-<YYYYMMDD>-<HHMM>-FUNC`. For each module **in workflow order**:
  1. Run that module's read-only and reversible use cases (view, filters, dropdowns, validation, edit + persistence,
     UI/UX, data consistency) **while the record is at that stage**.
  2. Then perform the module's one forward transition, so the record reaches the next stage.
  3. Log each use case in `results/<run>/usecases.json`
     (`{id, module, title, objective, pre, steps[], expected, actual, status, evidence[]}`) and each issue in
     `issues.json` (coverage doc §7 fields).
- Screenshot every confirmation dialog before confirming.

## 3. Report

- Workflow mode: `reports/<run>/inquiry-to-trip-report.html` (workflow doc §8; builder `steps/inq2trip/build-report.mjs`).
- Functional mode: `reports/<run>/admin-functional-qa-report.html` with the mandatory structure in coverage doc §7:
  - summary;
  - module-wise counts;
  - **Use Cases Tested** tables per module;
  - **Issues Observed** with full reproduction details;
  - defects vs observations vs clarifications;
  - uncovered actions;
  - final workflow status and last completed stage.
- Light/dark theme, relative screenshot links, no lazy loading. Offer a PDF copy (`User-Web/scripts/report-pdf.mjs`
  approach).

## 4. Output layout

```
Admin-Web/
  results/<run>/record.json, steps.json | usecases.json, issues.json
  screenshots/inquiry-to-trip/<run>/…  |  screenshots/functional/<run>/<module>/<UC-ID>-<slug>.png
  reports/<run>/inquiry-to-trip-report.html | admin-functional-qa-report.html
  test-data/qa-test-permit.pdf (generated test permit, the only upload used)
```
