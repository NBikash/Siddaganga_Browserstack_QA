# Workflow: Inquiry to Trip Closure (Admin-Web)

Status: **Documented, not executed.** Locators, popups and button behaviour below come from the workflow
specification and the existing Navigation/Module inventories. Anything marked *(to inspect)* must be confirmed
in the live application when execution is approved. Never assume it.

Skill: `Admin-Web/.claude/skills/admin-web-inquiry-to-trip/SKILL.md`

## 1. Scope

| In scope | Out of scope (strict) |
|---|---|
| One inquiry submitted from **User-Web**, tracked from Lead to Close Trip in the Admin portal | Any payment or **Advance** payment option, at any stage |
| Status transitions, record identity, step results, screenshots | Finance tracking / Financial Management / Payment And Refund Management modules (documented separately later) |
| Vehicle and driver allocation, dispatch, start, complete, close for that record | Cancellations, other bookings, other leads/inquiries, bulk actions, unrelated workflows |

## 2. Preconditions

1. **Source inquiry from User-Web, with its Inquiry PNR.** A User-Web run has submitted an inquiry (success popup
   "Inquiry Submitted Successfully!" + `POST /user/save-inquiry` → 201) **and** its **Inquiry PNR** has been
   captured from the User-Web inquiry details/list (e.g. `MWAG650153`). User-Web automation is **not** changed by
   this workflow; the PNR and trip details are handed over as input (see §4). No PNR → do not start (`Blocked`).
2. **Same backend.** The Admin portal must be the one that receives User-Web inquiries. `Admin-Web/.env` now
   points to **dari-preprod** (Preprod credentials entered by the user), matching User-Web Preprod (§9, L1 resolved).
3. **Session.** Admin login follows the existing setup: `npm run browser` (persistent profile `.auth/profile`,
   CDP 9333), then `npm run login` (credentials from `Admin-Web/.env`, or `--prompt`; OTP/CAPTCHA completed by the user).
4. **Role.** The account must be allowed to perform every transition (Superadmin in the current inventory).
   Confirm the in-app role label before starting.
5. **Test data.** A driver and a vehicle that are valid test data for allocation; dispatch form values that are
   test values. Agree them with the user before execution (§9, L5).

## 3. Record identity (track the same record end to end)

- **Primary and mandatory key: Inquiry PNR.** Captured in User-Web, compared in Admin-Web under
  Lead Management → (menu) **View Lead** → **Inquiry Information → Inquiry PNR**. Confirmed example (User-Web TC-01):

  | User-Web Inquiry PNR | Admin Lead Details → Inquiry PNR | Admin Lead ID | Admin Inquiry ID |
  |---|---|---|---|
  | `MWAG650153` | `MWAG650153` | `LD-341` | `932` |

- **Matching rules**
  - A lead is the correct record **only** when its Inquiry PNR equals the captured PNR **exactly** (whole value,
    case-sensitive, after trimming surrounding whitespace only).
  - Never select a record on customer name, route, date, passenger count or "latest row". Trip details are a
    secondary sanity check only. A mismatch against an exact PNR match is recorded as Fail (data inconsistency);
    it never makes a different lead acceptable.
  - **No exact match → `Blocked`.** **More than one exact match → stop, `Blocked` (duplicate PNR), report every
    matching Lead ID.** Never fall back to another lead.
  - **Lookup method (updated after run 20261112):** the Lead list cannot be searched by PNR, but **Search Lead
    Info accepts the Lead ID** and returns exactly that row. So:
    1. Open View Lead on the candidate lead (most recent first) and confirm the exact PNR.
    2. Record the Lead ID and Inquiry ID.
    3. Type the Lead ID into Search Lead Info and verify the single row.
    4. Continue from that row.

    Do **not** open every lead of the customer for a duplicate check (run 20261112 opened 10; no longer done). If
    the PNR isn't among the first page of recent leads, ask the user for the Lead ID.
- **Tracking IDs.** After the match, record **Lead ID** and **Admin Inquiry ID** (plus the PNR) in `record.json`.
  Every later stage must find the same record by PNR (or by the recorded Inquiry ID / booking ID where the screen
  shows it) *(to inspect: which identifier each list displays)*. If a stage issues a new ID (e.g. a booking or
  trip ID), record the mapping `{stage, idType, value}` exactly as the UI shows it. Do not infer it.

## 4. Inputs and outputs

| Item | Location |
|---|---|
| User-Web source | **Inquiry PNR** (mandatory) captured from the User-Web inquiry details/list; plus `User-Web/results/<user-web-run-id>/TC-xx.json` (read-only) for trip details, vehicle, success flag, timestamp |
| Record | `record.json`: `{ pnr, leadId, adminInquiryId, laterIds: [...], sourceRun, sourceTc }` |
| Run ID | `admin-web-<YYYYMMDD>-<HHMM>-INQ2TRIP` |
| Record + step log | `Admin-Web/results/<run-id>/record.json`, `steps.json` |
| Screenshots | `Admin-Web/screenshots/inquiry-to-trip/<run-id>/S<nn>-<slug>.png` (PII masked) |
| HTML report | `Admin-Web/reports/<run-id>/inquiry-to-trip-report.html` |

## 5. Stages

Each stage has an **action**, a **verify** check (the transition's pass criterion) and a **stop rule**.
`(menu)` = the row's three-dot action menu. Routes come from `Navigation_Inventory.md`; in-page tabs do not change the URL.

| # | Area / location | Action | Verify (pass criterion) | Evidence |
|---|---|---|---|---|
| S0 | Login | Start browser, `npm run login` | Landing on `/dashboard`; role label recorded | S00-login (masked) |
| S1 | Lead Management (`/dashboard/lead-management/total-lead`) | Candidate lead (menu) → **View Lead** → read **Inquiry Information → Inquiry PNR**; compare with the captured PNR (§3) | Exactly one lead with an exact PNR match; Lead ID + Admin Inquiry ID recorded. 0 → Blocked; >1 → Blocked (duplicate) | S01-view-lead-pnr (PNR, Lead ID, Inquiry ID visible; PII masked) |
| S1b | Lead Details → back to Lead Management | Close Lead Details, return to the **matched** lead (re-confirm its Lead ID) | Same Lead ID row in focus | S01b-matched-lead |
| S2 | Matched lead row (menu) | **Send to Inquiry** | Confirmation/success shown *(to inspect)*; lead status changes or row leaves list | S02-send-to-inquiry |
| S3 | Inquiry / quote screen *(to inspect where it opens)* | **Update Quote** with the agreed test quote values | Quote saved message; values echoed back | S03-update-quote |
| S4 | Inquiry Management → Total Inquiry (`/dashboard/inquiry-management/total-inquiries`) | Search by Admin Inquiry ID / PNR | Same record (same Inquiry ID/PNR) listed, with the updated quote | S04-inquiry-listed |
| S5 | Inquiry row (menu) | **Send to Booking** | Booking details view opens | S05-send-to-booking |
| S6 | Booking details | Verify details vs handoff key → **Convert into Booking** → **Yes** | Details match; success message | S06-convert-booking |
| S7 | Booking & Operation → Total Booking → **Prebooking** (`/dashboard/booking-management/total-booking`) | Search the reference | Same record listed under Prebooking | S07-prebooking |
| S8 | Prebooking row (menu) | **Confirm Booking** → **Confirm Booking** (dialog) | Success; record leaves Prebooking | S08-confirm-booking |
| S9 | Total Booking → **Booked** | Search the reference | Same record listed under Booked | S09-booked |
| S10 | Total Booking → **Upcoming Trip** | Find record → (menu) **Send to Trip Approval** → **Yes** | Success; status changes | S10-trip-approval |
| S11 | Fleet & Vehicle Management → Fleet & Vehicles → **Vehicle Allocation Portal** (`/dashboard/fleet-vehicle-management/vehicle-allocation`) | Find record | Record listed; **Allocate** CTA enabled | S11-allocate-enabled |
| S12 | Allocation flow | **Allocate** → the specified **Continue** steps. **No Advance / payment option** | Each Continue step reached; no payment option selected | S12-allocate-steps |
| S13 | Allocation flow | Select a vehicle of the **requested type/capacity** (and the requested combination if the app supports it; see `Admin_Functional_QA_Coverage.md` §4) → **Confirm Allocation** | Selected vehicle verified before confirming; success; vehicle shown against record. If the requested type is unavailable, record that and flag any substitute type | S13-vehicle-allocated |
| S14 | Vehicle Allocation Portal | Return, find record | **Allocate Driver** available | S14-allocate-driver-available |
| S15 | Driver allocation | **Allocate Driver** → select agreed driver → Submit | Success; driver shown against record | S15-driver-allocated |
| S16 | Fleet & Vehicles → **Approved & Track Live Trips** | Find record | Same record listed | S16-approved-listed |
| S17 | Approved row (menu) → **Approved Vehicle** | **Initiate Vehicle Dispatch**. **Do not select Advance**; fill the required dispatch fields with test values; Submit | Success; record leaves Approved | S17-dispatch |
| S18 | **Ready for Trip** | Find record | Same record listed | S18-ready |
| S19 | Ready row (menu) | **Start Trip** → **Confirm** | Success | S19-start-trip |
| S20 | **Live Trips** | Find record | Same record listed | S20-live |
| S21 | Live row (menu) | **Complete Trip** *(to inspect: any form/confirmation)* | Success | S21-complete |
| S22 | **Completed Trip** | Find record | Same record listed | S22-completed |
| S23 | Completed row (menu) | **Close Trip** *(to inspect: confirmation, final status)* | Success; final status recorded | S23-closed |

In S7–S23 "find record" means locating the row by the recorded PNR / Inquiry ID / mapped booking or trip ID.
Never by name, route or date alone.

Mapping to the 32 specified steps: S0=1 · S1–S1b=2 (plus PNR identification) · S2=3–4 · S3=5 · S4=6–7 · S5=8 · S6=9 · S7=10–11 · S8=12 ·
S9=13 · S10=14–15 · S11=16–17 · S12=18 · S13=19 · S14=20–21 · S15=22 · S16=23–24 · S17=25–26 · S18=27 ·
S19=28 · S20=29 · S21=30 · S22=31 · S23=32.

## 5a. Real flow observed in run `admin-web-20261112-2229-INQ2TRIP` (TC-01, PNR MWAG650153 → LD-341 → QRY-932 → B-932 → TP-111)

| Stage | Observed behaviour (use these instead of the *(to inspect)* assumptions) |
|---|---|
| Lead menu | View Lead · Send To Inquiry · Assign · Delete |
| S2 | Send To Inquiry navigates (≈3 s, no toast) to `/inquiry-management/update-inquiry/<uuid>` |
| S3 | Update Quote: no visible success message; APIs `update-inquiry`, `inquiry/details`, `lead-target/attach-inquiry` |
| Inquiry menu | View Quote · Edit · Send To Booking · Record Advance · Send Quote · Send Proforma Invoice · Download Proforma Invoice · Send Bus Images · Cancel Inquiry · Delete |
| S5–S6 | "Choose Trip(s)" (quote legs, pre-selected) → Convert into Booking → "Are you sure…" → Yes |
| Pre-Booking menu | View Booking · Edit Booking · Confirm Booking · Send To Inquiry · Send Booking Form · Send Proforma Invoice · Record Advance · Cancel Booking · Cancel & Notify |
| S8 | Confirm Booking opens the `/booking-management/confirm-booking/<uuid>` form; its Confirm Booking button confirms (no extra popup) |
| Upcoming Trips | `/booking-management/upcoming-trips`, lists by **Trip ID** (blank for the new record); menu: Vehicle Allocation · Edit Booking · Send To Trip Approval · Cancel Booking · Cancel & Notify |
| S10 | Send To Trip Approval → confirm → Yes; Trip ID (TP-111) is generated and announced in a notification |
| S11–S12 | Portal row: Record Advance · Allocate (· Allocate Driver). Allocate → advance prompt (decline: "No, Continue to Allocation") → "Dynamic Allocation" → Continue → vehicle list with checkboxes → Confirm Allocation |
| S14–S15 | **Deviation:** after Confirm Allocation the trip left the portal and a driver was auto-assigned. Allocate Driver was not offered |
| Approved Vehicles menu | Edit Bus Details · Edit Driver Details · Add Extra Amenities · Initiate Vehicle Dispatch · Refuel Request · Record Advance (row also: Edit Allocation) |
| S17 | Advance prompt (decline) → Predeparture Checklist (photos optional) → Trip Sheet. **Helper and permit PDF are required** (not marked) |
| Ready For Trip menu | Start Trip · Edit Tripsheet · Edit Bus Details · Edit Driver Details · Add Extra Amenities · Record Advance · Cancel Trip |
| Live Trips menu | Edit Trip Sheet · Track Live Location · Driver Details · Emergency Alerts · Breakdown Protocol · Refuel Request · Notify Service Manager · Edit Trip Details · Complete Trip · Send Notification · Record Advance |
| Completed menu | View Trip Summary · Close Trip · (Download Invoice after closing) · Record Advance |
| S23 | Close Trip → advance prompt (decline) → Close Trip Sheet (Post-arrival Checklist → Trip Sheet: closing km, total km, diesel, bata, extra expenses, permit) → submit; invoice notification generated |
| All transitions after S10 | A "Record Advance Payment?" prompt appears first; it is always declined |

## 6. Step results and stop rules

| Result | When |
|---|---|
| **Pass** | Action done and the Verify criterion observed (screenshot taken) |
| **Fail** | Action done but the app shows an error, a wrong status, wrong/changed details, or the record does not appear where expected after a successful action |
| **Blocked** | Cannot proceed: record missing/ambiguous, required CTA absent/disabled, a step forces a payment/Advance choice, wrong role, environment/automation problem (timeout, session loss) |
| **Not Run** | Every stage after the first Fail/Blocked |

- **Stop at the first Fail or Blocked.** Never skip a stage, retry a transition blindly, or try a different record.
  Report the exact stage (`S<nn>`, screen, action, observed message).
- **Payment guard:** if any screen requires choosing Advance/payment to continue, stop. That stage is `Blocked`
  (out of scope), not a defect.
- **Irreversible actions** (Convert into Booking, Confirm Booking, Confirm Allocation, Dispatch, Start, Complete,
  Close) run only within an execution the user has explicitly approved for this workflow.
- Automation timeouts or flaky clicks are recorded as automation/environment issues, never as app defects,
  unless the app itself shows the failure.
- Re-check that the record is still listed after a page refresh before declaring a "missing record" Fail.

## 7. Evidence and privacy

- Screenshot after each Verify, on every Fail/Blocked, and of each confirmation dialog before confirming.
- Mask customer name, phone, email and addresses (same approach as `Admin-Web/scripts/lib.mjs` and User-Web
  `shot()`). Never capture the login form with values, `.env` contents, or OTPs.
- `exploration-logs/raw/` stays git-ignored (it can contain customer data).

## 8. Report contents

Run summary (source User-Web run + Inquiry PNR, Lead ID, Admin Inquiry ID, later IDs, candidate leads checked at S1, final reached stage, overall result) ·
stage table S0–S23 with result, timestamp, observed message, screenshot · ID mapping across stages ·
issues (defects vs inconsistencies vs automation/environment) · out-of-scope items deliberately not touched
(Advance, payment, Finance) · open questions.

## 9. Known limitations / missing information

| ID | Item | Impact |
|---|---|---|
| L1 | ~~Admin-Web configured for dari-dev while User-Web uses Preprod~~ **Resolved:** `Admin-Web/.env` now targets dari-preprod with Preprod credentials (entered by the user) | Confirm the in-app role at S0 |
| L2 | ~~User-Web records no inquiry reference; matching by trip details~~ **Superseded:** matching uses the **Inquiry PNR** (User-Web inquiry details/list ↔ Admin View Lead → Inquiry Information), confirmed with `MWAG650153` / `LD-341` / Inquiry ID `932`. Remaining gap: the existing User-Web result files do not store the PNR, so it is supplied as input (captured from the User-Web inquiry details/list) | No PNR → Blocked; trip details are a sanity check only |
| L3 | *(Mostly resolved by run 20261112; see §5a for the real menus/flows.)* Originally: Lead Management, Inquiry Management, Prebooking/Booked/Upcoming, Ready for Trip, Live/Completed Trip were **not explored** (Module_Inventory: "Not explored"); Vehicle Allocation and Approved & Track Live Trips were explored read-only | All menus, dialogs and forms are *(to inspect)* |
| L4 | "Specified Continue steps" (S12) and "specified dispatch flow" (S17) have no detailed field list | Need the exact steps/values, or record what the UI requires and confirm with the user |
| L5 | No agreed test quote values, test vehicle, test driver, or dispatch field values | Must be supplied/approved before S3, S13, S15, S17 |
| L6 | Where Ready for Trip / Live Trips / Completed Trip sit in the menu (Booking & Operations vs Approved & Track Live Trips tabs) | Confirm during inspection |
| L7 | The transitions are irreversible on shared data (the trip is closed) | One dedicated test inquiry per run; no reuse |
