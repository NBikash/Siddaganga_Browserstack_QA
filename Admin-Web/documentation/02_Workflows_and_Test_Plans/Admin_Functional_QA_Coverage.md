# Admin-Web Functional QA Coverage: Lead → Trip Closure

Status: **Planned, not executed.** Built from the menus, forms and screens observed in run
`admin-web-20261112-2229-INQ2TRIP` (see `Inquiry_to_Trip_Closure.md` §5a). Each use case is re-confirmed in the
live UI before it runs. Anything that differs is logged, not assumed.

Skill: `Admin-Web/.claude/skills/admin-web-inquiry-to-trip/SKILL.md` (functional mode).

## 1. Approach

- **One test record:** the PNR supplied by the user. PNR → View Lead → Lead ID → *Search Lead Info* with the Lead ID.
  The ID chain (Lead → Inquiry → Quote → Booking → Trip) is the lookup key afterwards. No scanning of other records.
- **Stage-bound testing:** the record moves forward only once per stage. Each module's view, edit, validation,
  filter and UX use cases run **while the record is in that stage**, then the single forward transition is done.
  Nothing is reverted, because there is no safe undo.
- **Already-closed record** (TP-111 / B-932 / LD-341) is reused **read-only** for checks that need a completed or
  closed trip: View Trip Summary, Completed Trips filters, table values. No action on it changes state.
- **Not repeated:** the happy-path transitions that already passed in run 20261112 (§5 "Already covered") are
  re-executed only as the forward step of the new record, not re-tested as use cases.

## 2. Action classification (applies to every module)

| Class | Meaning | Rule |
|---|---|---|
| **R** read/navigate | view, open details, tabs, filters, search, pagination, dropdown listing, refresh, back | Run freely |
| **E** reversible edit | edit + save on the test record; restore the original value afterwards where meaningful | Run; verify persistence after re-open + refresh |
| **V** validation | blank / invalid / boundary input, then submit, **without** a valid save (or with a later correction) | Run; never leave invalid data saved |
| **T** forward transition | Send to Inquiry, Update Quote, Send To Booking/Convert, Confirm Booking, Send To Trip Approval, Confirm Allocation, Dispatch, Start, Complete, Close | Run once, in order, on the test record |
| **A** approval needed | sends a message/notification or creates a side record (listed in §6) | `Not Run` unless the user approves it |
| **X** excluded | Delete, Cancel Inquiry/Booking/Trip, Cancel & Notify, Record Advance / Yes Record Advance, payments, Proforma send/download, Invoice download, Finance modules, Assign/Remove that affects other users without approval | Never clicked, not even to look; listed as "Not tested (excluded)" |

Create-forms (**+ Add Lead**, **+ Add inquiry**, **+ Add New Booking**) are tested **V-only**: open, check fields
and dropdowns, submit blank or invalid input, close. A valid record is **never** saved (no unrelated records).

## 3. Module-wise planned use cases

`Cls` = class from §2. Stage = record stage required.

### 3.1 Lead Management (`/lead-management/total-lead`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| LM-01 | Identify record: View Lead PNR exact match → Lead ID → Search Lead Info returns 1 row | R | Lead |
| LM-02 | View Lead: every field vs User-Web inquiry (customer, pax, dates, time, pickup/drop, journey type, vehicle, cost) | R | Lead |
| LM-03 | Search Lead Info: Lead ID, partial ID, client name, no-match text → "No data available" | R | any |
| LM-04 | Status filter dropdown: list options; filter Open/Active; Reset Filter restores list | R | any |
| LM-05 | Date filter (calendar input) and pagination / rows-per-page (5→other) | R | any |
| LM-06 | Table columns/values (Stage, Expected Value "N/A", Assigned To, Status) vs lead details | R | Lead |
| LM-07 | + Add Lead form: fields, dropdowns, mandatory-field validation (blank submit), invalid phone/email; close without saving | V | any |
| LM-08 | View Lead modal behaviour: close via X/Escape, refresh while open, back navigation | R | Lead |
| LM-09 | Assign (lead to employee): open dialog, list assignees, validation only *(saving = A, needs approval)* | V/A | Lead |
| LM-10 | Send To Inquiry (transition) and lead status/stage after it | T | Lead→Inq |

### 3.2 Inquiry Management (`/inquiry-management/total-inquiries`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| IM-01 | Search Inquiry Info by Inquiry ID / name; date and client filters; Reset Filter; pagination | R | Inq |
| IM-02 | KPI cards (Total Inquiries, Conversion Rate, Pending Approvals, Total Quote Value) change after the record moves | R | Inq |
| IM-03 | Row values (QRY-ID, client type, vehicle, start date, status "Revised quotation") vs quote | R | Inq |
| IM-04 | View Quote: content and values vs Update Quote form | R | Inq |
| IM-05 | Edit (inquiry): opens form; edit a non-financial field (Trip Description), save, re-open, refresh → persisted | E | Inq |
| IM-06 | + Add inquiry form: field list, dropdowns, blank-submit validation; close without saving | V | any |
| IM-07 | Status column/terminology across stages (New quotation → Revised quotation → …) | R | Inq |

### 3.3 Quotation / Update Quote (`/inquiry-management/update-inquiry/<uuid>`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| QT-01 | Pre-filled values vs User-Web inquiry (booking type, client type, dates, **pickup time**, pax, trip days, vehicle, cost breakdown, GST) | R | Inq |
| QT-02 | Mandatory-field validation: clear pax / trip days / base fare → Update Quote → error per field (restore after) | V | Inq |
| QT-03 | Invalid / boundary input: pax 0, negative, decimals, very large; trip days 0; negative fare/rates; non-numeric | V | Inq |
| QT-04 | Cost recalculation: change extra km / extra hours / toll / extras → Total Approx Cost recomputes correctly (formula recorded, clarification if unclear) | E | Inq |
| QT-05 | Apply Final Quote checkbox and Fixed Cost field (enabled/disabled behaviour) | E | Inq |
| QT-06 | GST "Change" control: options; change and revert | E | Inq |
| QT-07 | Booking Type / Month / Trip Description dropdowns: option lists, type-new description | R/E | Inq |
| QT-08 | Date/Day-wise Category Assignment calendar: Previous/Next Month, Reset Selection, Save Assignment | E | Inq |
| QT-09 | + Add New Journey: form opens, validation; close without adding | V | Inq |
| QT-10 | Update Quote with an edited value → re-open → persisted; inquiry list and View Quote show new value | E | Inq |
| QT-11 | Preview Quote Summary: content and values vs form | R | Inq |
| QT-12 | Arrival/Departure time fields read-only (12:00 AM): clarification whether editable | R | Inq |
| QT-13 | Leave with unsaved changes (Back/refresh): data-loss warning? | R | Inq |

### 3.4 Booking & Operations: Pre-Bookings (`/booking-management/total-booking`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| PB-01 | Send To Booking → Choose Trip(s) modal: leg list, select/deselect validation (none selected → Convert) | V | Inq |
| PB-02 | Convert into Booking confirmation: "No" keeps inquiry unchanged; then Yes (transition) | R/T | Inq→Pre |
| PB-03 | Pre-Bookings: search (Booking ID), client, vehicle, date-range filters; Reset; pagination | R | Pre |
| PB-04 | View Booking: details vs quote | R | Pre |
| PB-05 | Edit Booking: edit a non-financial field, save, re-open, refresh → persisted | E | Pre |
| PB-06 | Confirm Booking form: mandatory/invalid validation before confirming | V | Pre |
| PB-07 | KPI cards (Total Bookings, Live, Upcoming, Pending Allocations) update after confirm | R | Pre→Booked |
| PB-08 | + Add New Booking form: fields, validation only; close without saving | V | any |
| PB-09 | Status column empty for pre-bookings: clarification | R | Pre |

### 3.5 Booked
| ID | Title | Cls | Stage |
|---|---|---|---|
| BK-01 | Booked tab: record listed; filters available (no booking search observed); values vs pre-booking | R | Booked |
| BK-02 | Row menu actions inventory; View / Edit Booking persistence (if offered) | R/E | Booked |
| BK-03 | Completed tab (read-only, closed TP-111 / B-932 appears?) | R | any |

### 3.6 Upcoming Trip / Trip Approval (`/booking-management/upcoming-trips`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| UT-01 | Record listed; Trip ID column (blank before approval), Status, start/end date-time vs booking | R | Booked |
| UT-02 | Client-name and date-range filters; pagination duplicates check (seen in run 20261112) | R | any |
| UT-03 | Edit Booking from Upcoming: behaviour (advance prompt → decline → does an edit form open?) | R | Booked |
| UT-04 | Vehicle Allocation menu item: where it navigates (inspect only, decline advance prompt) | R | Booked |
| UT-05 | Send To Trip Approval: "No" leaves record; then Yes (transition); Trip ID generated and shown in list | R/T | Booked→Approval |

### 3.7 Fleet & Vehicle Management: Vehicle Allocation Portal (`/fleet-vehicle-management/vehicle-allocation`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| VA-01 | Portal tabs: Trip Approvals & Vehicle Assignment / Available Vehicles / Pending Allocation Confirmations: content | R | Approval |
| VA-02 | Client filter, View All, pagination; KPI cards (Total Buses, Approved & Track, Portal, Tariff) | R | Approval |
| VA-03 | Allocate enabled; Allocate Driver absent before vehicle allocation | R | Approval |
| VA-04 | Allocation type dialog: options (Dynamic Allocation …), Continue without a selection | V | Approval |
| VA-05 | Allocation page: Trip Number, requested Bus type, Vehicle Age Preference, date button, Vendor List (inspect) | R | Approval |
| VA-06 | **Vehicle matching (§4):** requested type/capacity available? filter/Change Bus Type options; select matching vehicle; details verified | R/E | Approval |
| VA-07 | Confirm Allocation with **no vehicle selected** → validation | V | Approval |
| VA-08 | Multi-vehicle: if the inquiry requests >1 vehicle, select the combination; app support recorded | E/T | Approval |
| VA-09 | Confirm Allocation (transition); status text updates ("Not Assigned Yet" issue re-check) | T | Approval→Approved |
| VA-10 | Available Vehicles tab: allocated vehicle no longer available for that date | R | Approved |

### 3.8 Driver Allocation
| ID | Title | Cls | Stage |
|---|---|---|---|
| DA-01 | Allocate Driver availability after vehicle allocation (run 20261112: never offered, auto-assigned) | R | Approved |
| DA-02 | Edit Driver Details: driver list, change driver, save, re-open → persisted; driver shown in Approved/Ready/Live | E | Approved |
| DA-03 | Driver Details (Live): values match assigned driver | R | Live |

### 3.9 Approved & Track Live Trips: Approved Vehicles (`/fleet-vehicle-management/approved-trips`)
| ID | Title | Cls | Stage |
|---|---|---|---|
| AT-01 | Filters: Vendor, Vehicle, client name/mobile, Trip ID search, date range, Reset | R | Approved |
| AT-02 | Row values (vehicle, type, capacity, route, departure, driver, status "On trip"): status clarification | R | Approved |
| AT-03 | Edit Allocation: opens allocation; change vehicle within requested type, save → persisted (or inspect only if it re-opens the portal) | E | Approved |
| AT-04 | Edit Bus Details: form, validation, save, persistence | E/V | Approved |
| AT-05 | Add Extra Amenities: list, add one, persistence; effect on cost (clarification) | E | Approved |
| AT-06 | Refuel Request: form + validation only *(submit = A)* | V/A | Approved |

### 3.10 Vehicle Dispatch (Initiate Vehicle Dispatch)
| ID | Title | Cls | Stage |
|---|---|---|---|
| VD-01 | Predeparture Checklist: photo uploads optional; Safety confirmation required?; Next without it | V | Approved |
| VD-02 | Trip Sheet blank submit → each required-field message (permit, helper, odometer …) | V | Approved |
| VD-03 | Invalid / boundary: negative odometer, opening km ≠ start odometer, letters, fuel > tank, mileage 0 | V | Approved |
| VD-04 | Present Diesel auto-calculation (last + filled) and Mileage behaviour | R | Approved |
| VD-05 | Permit upload: non-PDF rejected; PDF accepted; Remove; Download/preview | V/E | Approved |
| VD-06 | Submit (transition) → record moves to Ready For Trip | T | Approved→Ready |

### 3.11 Ready for Trip
| ID | Title | Cls | Stage |
|---|---|---|---|
| RT-01 | Record listed, status "Schedule", values vs dispatch | R | Ready |
| RT-02 | Edit Tripsheet: dispatch values re-shown; edit one value, save, re-open → persisted | E | Ready |
| RT-03 | Edit Bus Details / Edit Driver Details / Add Extra Amenities from this stage | E | Ready |
| RT-04 | Start Trip: confirmation "Cancel"(dismiss X instead) / then Confirm (transition) | T | Ready→Live |

### 3.12 Live Trips
| ID | Title | Cls | Stage |
|---|---|---|---|
| LT-01 | Record listed; columns (Customer Type "Local" issue re-check), Assigned Status "On going" | R | Live |
| LT-02 | Edit Trip Sheet / Edit Trip Details: edit, save, persistence | E | Live |
| LT-03 | Track Live Location: opens map/state for a test vehicle (no GPS → empty state message) | R | Live |
| LT-04 | Driver Details: values | R | Live |
| LT-05 | Emergency Alerts / Breakdown Protocol / Notify Service Manager / Send Notification / Refuel Request: open forms + validation only *(submit = A)* | V/A | Live |
| LT-06 | Complete Trip (transition) | T | Live→Completed |

### 3.13 Completed Trip / Trip Closure
| ID | Title | Cls | Stage |
|---|---|---|---|
| CT-01 | Completed Trips: record listed; Estimated vs Actual cost; Trip Closed "No" | R | Completed |
| CT-02 | View Trip Summary (also read-only on closed TP-111): content vs trip sheet values | R | Completed |
| CT-03 | Close Trip Sheet: blank/invalid closing km (< opening km), total km mismatch, negative diesel → validation | V | Completed |
| CT-04 | Extra expenses: Add Expense form, types, validation; add a **non-billed** expense only with approval *(A)* | V/A | Completed |
| CT-05 | Driver Bata fields: suggested vs entered, total recompute | E | Completed |
| CT-06 | Close Trip submit (transition); Trip Closed "Yes"; **Close Trip still offered afterwards** (run 20261112 issue) | T/R | Completed→Closed |
| CT-07 | Actual cost after close vs quote (₹4,500 + extras + km beyond package): clarification of billing rule | R | Closed |

### 3.14 Cross-module consistency and UI/UX (throughout)
| ID | Title | Cls |
|---|---|---|
| XC-01 | Same values at every stage: customer, client type, pax, dates, **pickup time**, pickup/drop locations, journey type, vehicle type/count, cost | R |
| XC-02 | ID chain consistency (PNR, LD, QRY, Quote ID, B-, TP-) and where each is shown/searchable | R |
| XC-03 | Notifications content (new booking, duty assignment, pre-departure, ready, invoice) vs record | R |
| XC-04 | Refresh / browser Back on each form and modal (state kept or lost, warnings) | R |
| XC-05 | Terminology across modules (Pre-Bookings/Prebooking, Tripsheet/Trip Sheet, Tarrif, Pax's, "Tabbi") | R |
| XC-06 | Labels, alignment, truncation, empty states, button enabled/disabled states, success/error messages | R |

## 4. Vehicle allocation rules

1. Read the requested vehicle(s) from the User-Web inquiry and the Admin quote: type, seating capacity, count.
2. In the allocation page check the vehicles offered for the trip date (and *Change Bus Type* / Vendor List if needed).
3. Select a vehicle of the **same type and capacity**. If more than one vehicle was requested, select the
   combination where the app supports it. If it doesn't, record that.
4. If the requested type isn't available, record the unavailability (evidence) and only then select a
   different type. The report states **requested vs allocated** with the reason.
5. Never silently substitute.
6. Before Confirm Allocation, verify the selected tile's registration number, category and capacity. Afterwards,
   verify the vehicle, driver and allocation status in Approved Vehicles and in the resulting trip record.

## 5. Already covered (run `admin-web-20261112-2229-INQ2TRIP`, not repeated as use cases)

Happy-path transitions S0–S23 (except Allocate Driver), PNR match, advance prompts declined at every stage, dispatch
required fields (permit, helper) discovered, close-sheet submit and invoice notification, Trip Closed = Yes.
Its 8 defects are re-checked only where the new record passes the same screen (no separate re-test).

## 6. Test data and approvals required before execution

| # | Item | Why |
|---|---|---|
| 1 | **New Inquiry PNR** from User-Web (fresh, not yet sent to inquiry). Preferably with a requested vehicle type that exists in the fleet; if multi-vehicle support should be tested, a second PNR with 2 vehicles | Stage-bound edits need a record at each stage; TP-111 is closed |
| 2 | Approval to **edit and save** fields on that test record (quote values, trip description, booking fields, bus/driver details, amenities, trip sheet) | Persistence tests change data |
| 3 | Approval for **A** actions, or keep them Not Run: Assign lead, Send Quote, Send Bus Images, Send Booking Form, Send Customer Inquiry Form, Send Notification, Notify Service Manager, Emergency Alerts, Breakdown Protocol, Refuel Request, add non-billed expense | They send WhatsApp/SMS/mail/push or create side records |
| 4 | Which employee/driver may be used for Assign / Edit Driver Details (default: first listed test-named entry) | Avoid affecting real staff |
| 5 | Quote edit values allowed (default: change Trip Description and one extra (toll) value, then restore) | Financial values affect invoice |
| 6 | Uploads: only `test-data/qa-test-permit.pdf`, plus a generated non-PDF file for the negative upload test | No real documents |

## 7. Report structure (functional mode)

`reports/<run>/admin-functional-qa-report.html`:

1. **Overall execution summary:**
   - record IDs;
   - final workflow status and last successfully completed stage;
   - Pass/Fail/Blocked/Not Run totals.
2. **Module-wise counts:** use cases and issues per module.
3. **Use Cases Tested**, one table per module: Use Case ID · Title · Scenario/Objective · Preconditions ·
   Steps Performed · Expected · Actual · Status · Evidence.
4. **Issues Observed**, one entry per problem:
   1. Issue ID
   2. Module and screen
   3. Title
   4. Environment and record reference
   5. Preconditions
   6. Numbered steps
   7. Expected result
   8. Actual result
   9. Description
   10. Evidence
   11. Severity/priority
   12. Classification: Functional / UI / UX / Content / Terminology / Data inconsistency / Validation
5. **Defects vs observations vs business clarifications** summary.
6. **Uncovered / untested actions:** excluded (X), approval-needed not approved (A), blocked.
7. **Automation notes:** timeouts and script issues. These are never counted as defects.
