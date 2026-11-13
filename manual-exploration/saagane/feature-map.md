# Saagane by Siddaganga — Feature map (Superadmin)

Build `app-release_internal_25thSept26.apk` v1.2 (package `com.internalops`, in-app title "InternalOps"), Pixel 7 /
Android 13, BrowserStack App Live. Explored 2026-10-09 as **Superadmin** only (Admin not yet explored).
Details: `session-notes/2026-10-09-superadmin-exploration.md`. Screenshots: `screenshots/`.
Inventory: `test-cases/saagane-test-cases.csv` (source of truth) / `.xlsx` — **336 cases** (INQ executed in run saagane-android-20261009-1630-SUPERADMIN-INQ; other modules not executed).

## Modules, entry points and case counts

| Code | Module | Entry point | Key screens | Cases |
|---|---|---|---|---|
| AUTH | Authentication | App launch | Login, Reset Password, Log in with OTP | 30 |
| NAV | Navigation & Shell | Header / drawer / bottom tabs | Operations, Garage, Finance grids; drawer | 15 |
| NOTIF | Notifications | Header bell | Notifications dropdown | 6 |
| PRF | Profile | Header avatar | Profile Settings, Edit User Information, Change Password | 10 |
| INQ | Inquiry & Sales | Operations | Sales (Overview/Leads/Quotes), Lead Details, Edit/Add New Quote, Inquiries, Inquiry Details | 66 (59 + 7 new 2026-10-09) |
| BKG | Booking Management | Operations | Booking & Operations (KPIs, All/Confirmed/Completed, Live, Upcoming), View Trip Details, Trip Summary, New Booking wizard | 40 |
| VAL | Vehicle Allocation | Operations | Allocation Portal (Trip Approvals, Available Vehicles, Pending Confirmations) | 12 |
| DSP | Dispatch | Operations | Dispatch Module (Today's / Upcoming Departures), Quick Expenses | 7 |
| TRM | Trip Monitoring | Operations | Ongoing / Completed / Monitoring | 5 |
| BATA | Driver Bata | Operations | Driver Bata Management, Add driver bata request | 12 |
| GPD | Pre-Departure & Start Trip | Garage | Pre-Departure Readiness (Pre Departure / Start Trip) | 8 |
| GLT | Live Trip Support & Post-Arrival | Garage | Live Trip Support, Breakdown Details, Post Arrival, Trip Vehicles | 10 |
| MNT | Maintenance & Servicing | Garage | Service Requests, Add New Service Request wizard, Service and Maintenance, Job Tracker | 14 |
| FEX | Trip Expenses | Finance (also Dispatch → Quick Expenses) | Ongoing/Completed trips, Trip record, New Expense Entry | 12 |
| FPAY | Customer Payments | Finance | AR KPIs, Confirmed/Upcoming/Ongoing/Completed | 7 |
| FINV | Invoicing | Finance | Regular/Contracted × Invoice & Payment / Proforma / Cancel; View Invoice Details | 14 |
| INVT | Manage Inventory | Finance | Inventory Master, Item Details, Internal Requests, Stock Ledger, Adjustments | 17 |
| PUR | Purchasing | Finance | PR list, PO list | 14 |
| VPAY | Vendor Payments | Finance | All Vendors, Vendor Details, Vendor Payments | 11 |
| RPT | Reports | Finance | Report cards | 7 |
| SEC | Roles, Permissions & Security | — | cross-cutting | 6 |
| NFR | Non-Functional | — | cross-cutting | 4 |
| E2E | End-to-End Flows | — | cross-module | 9 |

Priority and basis totals: see the XLSX Summary sheet (updated after the INQ run).
95 cases change data or send messages (`Requires Approval`).

## Module dependencies (observed / inferred)
Lead → Inquiry → Quote → Booking (confirm) → Allocation Status → Vehicle Allocation (Trip Approvals → Pending Confirmations)
→ Garage Pre-Departure (Initiate Vehicle Dispatch) → Dispatch (authorise) → Trip Monitoring / Live Trip Support →
Post Arrival (Activate Post Arrival) → Booking Completed Trips → Trip Summary → Invoicing → Customer Payments.
Side flows: Trip Expenses & Driver Bata → Trip Summary/Reports; Breakdown → Maintenance; Inventory (PR) → Purchasing (PO,
GRN) → Stock Ledger → Vendor Payments; Internal Requests → Stock; events → Notifications.
Suggested `config/project.json → apps.saagane.moduleDependencies` (not written yet):
`BKG: [INQ]`, `VAL: [BKG]`, `GPD: [VAL]`, `DSP: [GPD]`, `TRM: [DSP]`, `GLT: [DSP]`, `FINV: [BKG, GLT]`, `FPAY: [FINV]`,
`FEX: [DSP]`, `BATA: [BKG]`, `MNT: [GLT]`, `PUR: [INVT]`, `VPAY: [PUR]`, `E2E: [all]`.

## Coverage gaps (need data or approval)
- Approval/confirm/authorise flows in VAL, DSP, GPD, GLT, MNT, BATA, FEX, INVT, PUR — screens empty or actions not exercised.
- Mandatory-field validation for Generate Quote, New Booking review/submit, Add Bata, Breakdown, Expense log, PR/PO, item.
- OTP and password-reset flows (would send OTPs).
- Report generation/export/schedule; ledger generation; PDF content checks.
- Admin role (separate phase) — role comparison cases are placeholders.

## Questions for confirmation (assumptions are labelled in the sheet)
- **Q-AUTH**: Failed-login lockout policy? Which roles may sign in? Session timeout?
- **Q-INQ**: Quote cost formula (km × rate + (driver + late allowance) × days + extras) and minimum km/day rule? Is GST added to
  the quote total? Is the 32.4 % conversion rate live data? Status names (Pending Approval vs Pending)? Client types
  (Regular vs Corporate/National/International)?
- **Q-BKG**: How are trips classified Upcoming/Live/Completed (dates seem inverted)? Which invoice amount is authoritative
  (Trip Summary vs Invoicing vs Customer Payments)? Tax rule (CGST/SGST on taxable only)?
- **Q-GAR**: What does "Initiate Vehicle Dispatch" do (checklist vs immediate status change)? Rules for Activate Post Arrival?
- **Q-FIN**: May expenses be logged on completed trips? Cancellation penalty/refund formula? Proforma numbering? Can one PR
  feed several POs? How are vendor payments recorded and outstanding computed? Bata amount source (no amount field)?
- **Q-SEC**: Should Superadmin manage users/roles/settings in the app (none found)? What must Admin not see/do?
- **Q-ENV**: Is this a QA backend (data like "Test bus 4" suggests yes)? May test records be created/cleaned up in Phase 2?
