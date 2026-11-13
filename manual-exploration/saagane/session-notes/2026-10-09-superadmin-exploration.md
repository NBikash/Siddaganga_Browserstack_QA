# Saagane by Siddaganga — Superadmin exploration (Phase 1)

| Item | Value |
|---|---|
| Date | 2026-10-09 |
| App | Saagane by Siddaganga — in-app title "InternalOps", package `com.internalops` |
| Build | `app-release_internal_25thSept26.apk` v1.2 (App Live → Uploaded Apps, uploaded 2026-10-09) |
| Device | Google Pixel 7, Android 13 (BrowserStack App Live) |
| Role | Superadmin (logged in manually by the user) |
| Mode | Exploration only — no test execution, no record changes |
| Screenshots | `manual-exploration/saagane/screenshots/` (`<MODULE>_<screen>_<nn>.png`) |

## Environment notes
- On first launch Android asked "Allow Saagane by Siddaganga to send you notifications?" — Claude tapped **Don't allow**
  (prompt appeared twice). Push-notification behaviour therefore not observed.
- The Chrome window hosting App Live kept narrowing (796 → 546 px); fullscreen did not persist. Device remained fully
  visible at 531×674 so exploration continued (environment only, not an app issue).

## 1. Authentication (pre-login)
**Login (Email & Password)** — branding "Siddaganga Travels", title "Internal Ops", subtitle "Secure Enterprise Access".
- Fields: EMAIL ADDRESS (placeholder "Enter Email Address"), PASSWORD ("Enter Password", eye icon show/hide).
- Links/buttons: "Forgot Password?", **Log In >**, "Log in with OTP".
- Validation (client-side, inline red text under the field):
  - Empty email → "Please enter your email address."; empty password → "Please enter your password."
  - Email "ac" → "Please enter a valid email address."
  - Error clears when the user starts typing in the field.
- Leaving and returning to the login screen clears the entered email.

**Reset Password** (Forgot Password?) — "< Back", title "Reset Password", text "Enter your email address to receive an
OTP to reset your password.", EMAIL ADDRESS field, **Send**. Empty Send → "Please enter your email address."
Send with a real email not tried (would send an OTP — requires approval).

**Log in with OTP** — EMAIL ADDRESS field, **Send OTP**, link "Log in With Email & Password". Empty Send OTP →
"Please enter your email address." OTP request not tried (requires approval). OTP entry screen not observed.

## 2. Shell / navigation (post-login)
- Header: hamburger ☰, "InternalOps" + role label "SUPER ADMIN", bell icon (notifications), profile avatar (yellow ring).
- Bottom tabs: **Operations** (default), **Garage**, **Finance**.
- Operations home: "Operations — Select an operations module to get started", OPERATIONS MODULES grid:
  Inquiry & Sales, Booking Management, Vehicle Allocation, Dispatch, Trip Monitoring, Driver Bata.
- Drawer (☰): avatar, "Super Admin" / "SUPER ADMIN", MAIN MENU accordion (one group open at a time; + / – icons):
  - OPERATIONS: Inquiry & Sales, Booking Management, Vehicle Allocation, Dispatch, Trip Monitoring, Driver Bata
  - GARAGE: Pre-Departure & Start Trip; Live Trip Support - Post-Arrival & End Trip; Maintenance & Servicing
  - FINANCE: Trip Expenses, Customer Payments, Invoicing, Manage Inventory, Purchasing, Vendor Payments, Reports
  - **SIGN OUT** (red, bottom) — not tapped (needs approval). Close (X) button top right.

## 3. Operations → Inquiry & Sales (INQ)
Header "Inquiry & Sales — Manage leads, quotes, and sales pipeline". Top toggle: **Sales** | **Inquiries**.

### 3.1 Sales tab
- KPI cards: total value (₹0 → ₹4.4Cr after load) with "<n>/<n> Active Leads"; CONVERSION RATE 32.4% "+5% vs last month"
  (32.4% shown even while leads were still loading → possibly static/hard-coded — **needs confirmation**).
- "Add New Quote" + **+ New Quote** button. Segments: **Overview | Leads | Quotes**.
- Overview: "Recent Leads" (name, LD-<id>, status chip "Open") + "View All"; Overview cards are not tappable.
  Shows "Loading leads..." spinner first.
- **Leads** segment: search "Search leads..." (live filter on name; no-match → "No leads found."), filter icon.
  - Lead card: initial avatar, client name, LD-id, amount (₹27,200), ⋮, route text (start – end address), chips
    (Open, Prospecting), VEHICLE REQUIREMENT (Sedan), TRANSIT POLICY ("New quotation"), **Call** and **Email** buttons
    (not tapped — would launch dialer/mail).
  - ⋮ menu: **View Lead**, Send To Inquiry*, Assign*, Delete Lead* (*not tapped — modify data).
  - **Lead Details** modal (X close): Lead Information (Lead ID, Client Name, Expected Value, Stage, Status, Assigned To);
    Inquiry Information (Inquiry PNR, Inquiry ID, Customer Name, Email, Mobile Number, Status, Client Type, Month,
    Passengers (PAX), Trip Days, Start/End Date, Pickup/Drop Time); Journey Details (Journey 1 – Outstation: dates, times,
    trip days, amenities, starting/ending point); Vehicle 1..n (Vehicle Name, Type, Seats, No. of Vehicles, Total Costing).
  - Observations: card amount ₹27,200 = sum of vehicle Total Costing (₹10,600 + ₹16,600) but Lead Details shows
    Expected Value "–" and Stage "–"; Inquiry "Trip Days" empty while Journey shows 1 → **clarify**.
  - Filter Leads (bottom sheet): Status (All statuses / Active / Closed / Open), Clear, Apply. Applied filter highlights the
    filter icon. Closed → "No leads found.".
- **Quotes** segment: search "Search quotes...", filter.
  - Quote card: client/company name, PNR (e.g. KLKV914286), status chip "Pending Approval", ROUTE, TOTAL, REQUIRED VEHICLE,
    TRIP PLAN ("2 Days | 2026-10-09 – 2026-10-10 | 49 Pax" – Pax omitted when empty), **Confirm Booking***, **View PDF**.
  - ⋮ menu: Edit Quote, Send PI*, Confirm Booking*, Quick Photo Send Via Whatsapp*.
  - **View PDF** does not preview — downloads `Quotation_Summary_<PNR>.pdf` to device Downloads and shows a native alert
    "Siddaganga Travels — File downloaded successfully to Downloads folder: ..." (OK). (UX: no in-app viewer.)
  - Filter Quotes: Trip Date Range (Start/End – native Android date picker, defaults to today), Client Type (All /
    Corporate / National / International), Client by Name (All clients), Status (All / New Quotation / Pending / Revised
    Quotation), Clear, Apply. Cards show "Pending Approval", which is not one of the filter statuses → **clarify**.
- **Edit Quote** (opened, cancelled, nothing saved) — screen title reads "Add New Quote" (should probably be "Edit Quote"):
  Select Booking Type; Client Information: OTP (One Time Customer) / Contracted Customer checkboxes, Domestic / International;
  Client Name (dropdown); Primary Email Address; Primary Contact Number; GST Value (18%) + **Change**; Trip Details: Trip
  Month (dropdown), Trip Description (select or type), Start Date, End Date, Arrival Time, Departure Time, Trip Duration
  (read-only, derived), Number of Pax's; "Proforma Invoice Only" checkbox; **Date/Day wise Category Assignment** (per
  booking type, Single Date Selection / Range Selection radio, calendar, Save Assignment, + Add New Trip); Trip-1 accordion:
  Journey A (dates, edit pencil), Vehicle Type + quantity stepper (– 01 +), Amenities, Destinations, checkbox "Save the
  customer details to create next trip quotation"; Vehicle Costs + **Edit Vehicle Cost**: Quantity, Total Kms, Min Km/Day,
  Per Km, Extra km, Driver Allow, No. of Days, Late Allow, Toll & Parking, State Tax, Any Extra's, Fixed Cost, Final Quote;
  Payment Info: Advance Payment (Full Payment / Partial Payment radio + Enter Amount); **Update Quote*** / Cancel.
  - Observed costing: 600 km × ₹55 + Driver Allow ₹1,000 × 2 days + Late Allow ₹1,000 × 2 days = ₹37,000 = Final Quote.
    Min Km/Day 300 × 2 days = 600 Total Kms. GST 18% shown but not included in Final Quote → **confirm formula & GST**.
- **+ New Quote** (opened, cancelled): Booking Type default **Dynamic** (options Local / Outstation / Transfer / Dynamic);
  Dynamic shows "Choose Dynamic Inquiry Combinations" checkboxes Local / Outstation / Transfer. Defaults: OTP (One Time
  Customer) checked, Domestic checked. Email/contact/GST fields disabled ("From selected client") until a client is chosen.
  Category assignment/vehicle sections appear only after dates are entered. Buttons **Generate Quote*** / Cancel.
  Mandatory-field validation **not observed** (Generate Quote not tapped — could create a record).

### 3.2 Inquiries tab
- "All Inquiries", **+ New Quote**, search "Search inquiries...", filter (same fields as Filter Quotes, title "Filter
  Inquiries").
- Table (horizontal scroll): SR NO., INQUIRY ID, CLIENT NAME, CLIENT TYPE ("Regular" — not one of the filter's client
  types Corporate/National/International → **clarify**), ⋮.
- Row ⋮: **View Inquiry**, Cancel Inquiry*, Delete Inquiry*, Send to Booking*, Send Quote Follow-up WhatsApp*, Send
  Proforma Invoice*.
- **Inquiry Details** modal: Date, Trip tabs (Trip 1), vehicle image, Contracted Client Name, Client Type, Company Name,
  Primary Email, Primary Contact, Secondary Email, Trip Duration, Trip Dates, Quotation ID; Journey: Trip 1 →
  "OutStation: Vehicle Costs" table (Vehicle Type … Final Quote); "Final Quote Amount"; close button labelled **Cancel**
  (ambiguous next to "Cancel Inquiry" action — UX note).

## 4. Operations → Booking Management (BKG)
Screen title "Booking & Operations — Manage Bookings".
- KPI cards (act as tabs; selected card turns yellow): **TOTAL BOOKINGS** 21, **LIVE TRIPS** 0, **UPCOMING TRIPS** 13.
- Under Total Bookings: chips **All Bookings | Confirmed Bookings | Completed Trips**; gear icon (Advanced Search);
  search (placeholder changes: "Search booking ID, client" / "Search client name..." / "Search trip ID, customer, ...");
  **+ Add Booking**. Lists load with a spinner; tables scroll horizontally.
- **All Bookings** table: SR NO, BOOKING ID (B-729…), CLIENT NAME, CLIENT TYPE (National), NO. OF PEOPLE ("-" allowed),
  JOURNEY (Outstation/Local), TRIP START DATE, TRIP END DATE, EST. COST (₹8,51,959.78), ACTION ⋮.
  - ⋮: **View Trip Details**, Add Trip Details*, Confirm Booking*, Add Advance*, Moving Back To Inquiry*.
  - **View Trip Details** modal: BOOKING ID, CLIENT DETAIL (name, ID chip, journey chip), LIVE STATUS (● Approved),
    SELECT TRIP LEG (LEG 1 (Outstation)), JOURNEY SEQUENCE card (Trip | Journey A: Outstation, dates), VEHICLE & DETAILS
    (Vehicle n: type, License No., Driver Name, Quantity – N/A when unassigned), LOGISTIC POINTS (Pickup → Stop n → Drop),
    MAP VIEW (chip per vehicle, Google map, Map/Satellite, fullscreen, +/-), INVOICE SUMMARY (New Base Fare, Vehicle
    Costing, Tax), NOTE (text area), **CANCEL** (close) / **Download**.
  - Observation: B-729 is a 1-day trip (12 Oct → 12 Oct) Mumbai → Goa → Ahmedabad (data plausibility; no validation of
    distance vs days observed).
- **Confirmed Bookings**: same columns. ⋮: Link With Vehicle Allocation (disabled), Sending Vehicle Details*, Add
  Amenities*, Adding Expenses (disabled), **Allocation Status*** (→ confirm dialog "Are you sure you want to send this
  booking to Trip Approvals?" Yes/No — Claude tapped **No**), Change Driver (disabled), Send Trip Info*.
  Disabled items appear to depend on vehicle-allocation state → **confirm enabling rules**.
  - Est. Cost formatting inconsistent: "₹ 15,62,024.9" (1 decimal) vs "₹ 9,23,491.19".
- **Completed Trips**: SR NO, BOOKING ID (TP-73, TP-72 — trip IDs), CLIENT NAME, CLIENT TYPE, JOURNEY, TRIP START DATE,
  START TIME, END TIME, VEHICLES (list), TOTAL, FEEDBACK, PAYMENT ("Trip ended"), ACTION ⋮: Add Trip Expense*, **View Trip
  Summary**, Back to Pre-bookings*.
  - Observation: "completed" trips have start dates 28 Oct 2026 / 16 Nov 2026 (future) → **clarify**.
  - **View Trip Summary** (invoice-style): Client Name, Trip ID (B-744), Phone, Invoice No (INV-88), PAN, Invoice Date,
    GSTIN, Invoice Period; per-duty blocks (Sr, Duty Id #TP-73-n, Passenger, Vehicle Group, Vehicle Number, Duty Type
    O/S-…, Fixed Cost, Start/End Date, Toll, Other, Bata, Sub-Total); DUTY TOTALS (Toll, Other, Bata, Sub-Total);
    line table (SR, DESCRIPTION "CAR HIRE CHARGES", RATE, QTY, AMOUNT); Taxable Sub Total, CGST @ 2.5%, SGST @ 2.5%,
    Non-Taxable Sub Total, **Total**; **Download PDF** / Close.
  - **Possible calculation issues (confirm):** duty sub-totals exceed visible components by ₹15,000 each (27,000 + 300 +
    300 + 1,000 = 28,600 vs Sub-Total 43,600); CGST/SGST shown as ₹3,185 = 2.5 % of gross ₹1,27,400 instead of taxable
    ₹1,25,700; Total ₹1,31,985 = 1,25,700 + 5 % tax and **excludes** Non-Taxable ₹1,700. Invoice Date 05-10-2026 precedes
    trip date 28-10-2026.
- **Upcoming Trips**: SR NO, TRIP ID (one row "-"), CLIENT NAME, JOURNEY, START DATE & TIME, END DATE & TIME, STATUS
  (chip "Confirm"), ACTION ⋮: Add Advance*, Send Vehicle Details*, Assign Vehicle*, Add On Trip Expense*.
  - Observation: "upcoming" trips are dated 24–26 Sept 2026 (past) → **clarify** classification rule.
- **Live Trips**: empty state "No Live Trips Found".
- **Advanced Search** (gear): Vehicle Selection (dropdown), Search Client (dropdown), Trip Date Range (From/To), Apply,
  Clear, X.
- **+ Add Booking → New Booking wizard** (stepper Trip Selection → Details → Review; header back arrow):
  - Step 1 Trip Selection: Select Booking Type (default Dynamic); Choose Dynamic Inquiry Combinations: Local ✓,
    Outstation ✓, Transfer, All; Client Information: OTP (One Time Customer) ✓ / Contracted Customer; Domestic ✓ /
    International; **Back** / **Continue to Details**.
  - Step 2 Details: General Information (Client Name dropdown, Primary Email, Primary Contact Number, GST Value "From
    selected client" + Change); Trip Details (Trip Month, Trip Description, Start/End Date, Arrival/Departure Time, Trip
    Duration, Number of Pax's, Proforma Invoice Only); per-type accordions **Local Trip Details** (Add Vehicle
    search/select, Pickup Location, Drop Location, Pickup Time, Drop Time, Select Amenities, **Save Local Trip Details**)
    and **Outstation Trip Details**; **Back** / **Continue to Review**.
  - Empty Continue to Review → native alert "Please complete all general and trip detail fields to open the calendar."
    (generic, no field-level highlighting; wording mentions "calendar"). Review step not reached; no booking created.

## 5. Operations → Vehicle Allocation (VAL)
Screen "Allocation Portal".
- KPI cards (not tappable): Total Buses Active 53, Approved Trips 19.
- Horizontally scrollable chips: **Trip Approvals | Available Vehicles | Pending Confirmations**.
- Trip Approvals: "TRIP APPROVALS", search "Search By Trip ID", gear (filter), empty state "No data available"
  (while Approved Trips KPI = 19 → **clarify** what Trip Approvals lists; bookings reach it via Booking Management →
  "Allocation Status" → "send this booking to Trip Approvals").
- Available Vehicles: gear → **Advanced Search** (Vehicle Type, Vendor, Status: All statuses / On Trip / Maintenance /
  Available, Trip Date Range From/To, Apply, Clear, X). Table: SR NO., Vehicle No. ("Test bus 4", "Test BUS 1" …),
  Vehicle Name (40/33 Seater Deluxe Coach), Vendor ("Not a vendor vehicle"), STATUS chip (Available), Schedule ("-").
  No row actions.
- Pending Confirmations: "PENDING CONFIRMATIONS", empty "No data available", no search/filter.
- Approval actions on Trip Approvals / Pending Confirmations could not be observed (no data) → **gap**.

## 6. Operations → Dispatch (DSP)
Screen "Dispatch Module — Manage and Authorise Departures".
- Tabs: **Today's Departures | Upcoming Departures**. Search "Search vehicle, customer or driver...".
  Filters: VEHICLE : SELECT VEHICLE (dropdown of registration numbers), CUSTOMER : ALL CUSTOMER, DATE : SELECT DATE.
- TODAY QUEUE / UPCOMING QUEUE: empty "No trips found for the selected filters." (departure authorise actions not
  observable → **gap**).
- UI observation: the Vehicle dropdown list renders underneath the DATE control (overlap / z-order).
- QUICK ACCESS card **Quick Expenses** → navigates to Finance → Trip Expenses (bottom tab switches to Finance).
- Navigation: tapping the Operations bottom tab later returns to the last opened module (Dispatch), not the module grid.

## 7. Finance → Trip Expenses (FIN-EXP) (reached from Dispatch → Quick Expenses)
- Title shows raw i18n key **"FinanceTripExpenseTitle"** (likely defect); subtitle "Generated after readiness approval."
- Tabs **Ongoing Trips | Completed Trips**. Ongoing empty: "No ongoing trip expenses — Expenses appear here after
  readiness approval and trip start."
- Completed Trips card: trip ID (TP-73), client, status chip COMPLETED, very long uppercase route text ("A -> B -> …",
  repeated legs), trip type "PRIVATE CHARTER", total (1,800), vehicle chips, relative time ("1 HOUR AGO").
- Card → "< TP-73 RECORD" detail: PRIVATE CHARTER + route, **+ NEW LOG OF EXPENSES**, PREVIOUS LOGS FOR THIS TRIP
  (category, date, amount, status PENDING) — 7 logs sum ₹1,800 = card total (consistent).
- NEW EXPENSE ENTRY form (opened, CANCEL, nothing submitted): SELECT CATEGORY tiles Fuel (default), Toll, Parking,
  Food / Allowance, Emergency Repair, Driver Bata, + Miscellaneous; FUEL QUANTITY, RATE (₹), TOTAL AMOUNT (₹),
  ODOMETER READING, REMARKS, UPLOAD PHOTO ("Upload image or Pdf"), CANCEL / SUBMIT LOG*, close (x).
  New logs allowed on a COMPLETED trip → **confirm rule**. Approve/reject of PENDING logs not observed.

## 8. Operations → Trip Monitoring (TRM)
Screen "Trip Monitoring — Track ongoing trips, completed routes, and live monitoring". Tabs **Ongoing | Completed |
Monitoring**.
- Ongoing: "No ongoing trips found."
- Completed: native alert **"Too many columns"** (Siddaganga Travels, OK) + "No completed trips found." although
  completed trips TP-72/TP-73 exist → **likely defect** (backend/SQL error surfaced to the user).
- Monitoring: counters Today 00 / Active 00 / Done 00; ONGOING TRIPS (empty), RECENTLY COMPLETED ("No completed trips
  found." — again inconsistent with Booking Management → Completed Trips).

## 9. Operations → Driver Bata (BATA)
Screen "Driver Bata Management — Allowances & Claims".
- "Driver Bata" + **+ ADD BATA**; cards TOTAL APPROVED ₹0.00, PENDING CLAIMS ₹0.00; tabs All / Pending / Approved /
  Rejected; search "SEARCH VIA DRIVER NAME, TRIP ID, VEHICLE NO"; filters DRIVER : ALL DRIVER, VEHICLE : ALL VEHICLE;
  empty "No bata entries found." (Trip Summary shows Bata amounts and expense logs have a "Driver Bata" category, yet no
  bata entries → **clarify relationship**).
- **Add driver bata request** ("Fill in the details below to submit a bata request."): Driver (picker), Trip
  ("Select driver first" – dependent), Trip date ("Select trip first" – dependent), Reason (multi-line), **Add request***,
  Cancel. No amount field (amount source → **clarify**).
  - Driver picker is a native alert listing drivers as buttons (KARAN WAHI, OSCAR BARLOWS, GOVIND) — Android alerts show
    max 3 buttons, so more drivers would be unreachable; the alert cannot be dismissed by outside tap or Back (user must
    pick a driver) → **likely defects**. After choosing Govind the Trip picker showed nothing (no trips / no empty-state
    message). Form cancelled; nothing submitted.

## 10. Garage → Pre-Departure & Start Trip (GAR-PRE)
Garage home: "Garage — Select a garage module to get started", GARAGE MODULES: Pre - Departure & Start Trip, Live Trip
Support - Post - Arrival & End Trip, Maintenance & Servicing.
Screen "Pre-Departure Readiness — Mandatory before trip can start." Tabs **Pre Departure | Start Trip**.
- Pre Departure: Quick search; Select Vendor; Select Vehicle; SELECT CLIENT ("Search client name or email"); Search Trip ID.
  "Approved Vehicles" cards: TRIP ID (TP-67), status chip PENDING, ⋮ → **Initiate Vehicle Dispatch*** (not tapped —
  unclear whether it opens a checklist or changes status → **ask**); CUSTOMER, VEHICLE NO, CAP / JOURNEY ("45 • 5 Days
  Dandeli"), ROUTE (pickup → drop), TRIP DATES, DRIVER (avatar initial + name).
  - Observation: TP-67 trip dates 24–28 Sep 2026 (past) still PENDING pre-departure.
- Start Trip: "Upcoming Trips — No upcoming trips found."

## 11. Garage → Live Trip Support - Post-Arrival & End Trip (GAR-LIVE)
Tabs **Live Trip Support | Post Arrival**.
- Live Trip Support: ISSUE REPORTING card ("Direct breakdown link to maintenance") + **RAISE SUPPORT REQUEST**; Active
  Support Tickets ("No active support tickets."); **SOS CONTACTS** (not opened).
  - BREAKDOWN DETAILS (EMERGENCY SUBMISSION) form (opened, closed via close icon): SELECT VEHICLE, SELECT TRIP ("Select
    active trip"), URGENCY LEVEL (Medium default / High / Critical), BREAKDOWN LOCATION ("e.g., NH-48 near ..."), ISSUE
    DESCRIPTION, MULTIMEDIA ATTACHMENT (Photo / Video), **SUBMIT TO MAINTENANCE QUEUE***.
- Post Arrival: sub-tabs **Today's Arrival | Upcoming Arrival**; KPI tiles IN TRANSIT (0 Vehicles), TODAY'S LOAD /
  UPCOMING LOAD (n Arrivals). Today: "No arrivals in this view yet."
  - Upcoming Arrival cards: ROUTE ID (TP-73) + info icon, chip UPCOMING ARRIVAL, VEHICLE, route (Bengaluru → Ahmedabad),
    time (22:00), **ACTIVATE POST ARRIVAL*** (not tapped).
  - Info icon → TRIP VEHICLES sheet "Trip TP-73": COMPLETED 4 / PENDING 0, vehicle list with status "Completed".
  - Observations: TP-73 is Completed in Booking Management and all its vehicles are Completed, yet it is listed as
    Upcoming Arrival; UPCOMING LOAD says 3 arrivals while the trip has 4 vehicles → **clarify**.

## 12. Garage → Maintenance & Servicing (MNT)
Search "Search here..."; top chips **Service Requests | Service and Maintenance | Job Tracker** (horizontal scroll).
- Service Requests: sub-chips All Requests / Under Review / Parts Request / Approved Req / Rejected Req; "All Services Req"
  (label truncated) + **+ ADD NEW REQUEST**; "No service requests found."
  - **Add New Service Request** wizard (STEP 1 TO 3, "33% COMPLETE", progress bar; steps REQUEST OVERVIEW / MAINTENANCE /
    ADD SERVICE): SELECT REQUEST CREATED BY (dropdown); REQUEST OVERVIEW: Request Type (Schedule Maintenance /
    Unscheduled / Emergency Request), Vehicle Number (search/select), Request Source, Date (DD/MM/YYYY), Priority;
    PREVIOUS / NEXT. Empty NEXT → native alert "Please select who created the request." (sequential, one field at a time).
    No explicit cancel/back on the wizard — left via bottom tab.
- Service and Maintenance: sub-chips Scheduled / Unscheduled / Check List / Emergency & Breakdown; "All Scheduled Requests";
  "No job cards found."
- Job Tracker: KPI tiles ACTIVE JOB CARDS / COMPLETED / SUB JOBS IN PROGRESS / SUB JOBS COMPLETED (all 0); chips Job Cards /
  Part Requests / Technician Work; "All Job Cards"; "No job tracker records found."
- No data → approval/review/technician flows not observable → **gap**.

## 13. Finance home
"Finance — Select a finance module to get started", FINANCE MODULES: Trip Expenses, Customer Payments, Invoicing, Manage
Inventory, Purchasing, Vendor Payments, Reports. (Bottom-tab behaviour is inconsistent: sometimes restores the last
module, sometimes shows the module grid.)

## 14. Finance → Customer Payments (FIN-PAY)
"Customer Payments — REVENUE & AR CONTROL". KPI cards: Total Invoiced ₹10,38,261.5, Paid ₹0, Pending ₹10,38,261.5,
Overdue ₹2,09,070 (Total = Paid + Pending ✓; one-decimal currency formatting). Tabs CONFIRMED / UPCOMING / ONGOING /
COMPLETED; search.
- Booking cards: client name + booking ID chip, CLIENT TYPE, NO. OF PEOPLE, JOURNEY, DATES, EST. COST, ADVANCE row with
  **RECORD ADVANCE*** (or "N/A").
- Completed cards add VEHICLES, RATING ("- ★"), COST, STATUS chip "TRIP ENDED". TP-73 cost here ₹9,23,491.19 vs Trip
  Summary/Invoice ₹1,31,985 / ₹1,33,770 → **clarify which amount is billed**. Some completed trips allow Record Advance,
  others show N/A.

## 15. Finance → Invoicing (FIN-INV)
Top toggle **REGULAR CUSTOMER | CONTRACTED CLIENT**; tabs **INVOICE & PAYMENT | PROFORMA INVOICE | CANCEL INVOICE**;
"Search invoices...".
- Invoice card: client, INV-no • date, status chip (UNPAID, red), menu, INVOICE DATE, DUE DATE (+7 days), AMOUNT (₹ 133770 —
  no thousands separator).
  - Menu: **View Summary**, Send Invoice Reminder*, Send to customer*, Courier Details*.
  - View Invoice Details: Invoice No, Client Name, Phone, Date Issued ("09-Oct-2026, 6:05 am"), Invoice Date
    ("09/10/2026"), Due Date ("16-10-2026"), Amount ₹1,33,770.00, Payment Method "cash", Status "un-paid"; Download PDF /
    Close. → Mixed date formats in one dialog; Amount ₹1,33,770 ≠ Trip Summary Total ₹1,31,985 for the same INV-88;
    Trip Summary Invoice Date 05-10-2026 ≠ 09/10/2026 → **likely defects / clarify**.
- PROFORMA INVOICES: INV-87 (same INV- series as tax invoices → **clarify numbering**).
- CANCELLED INVOICES: cards with chip CANCELLED, PENALTY AMOUNT, REFUND AMOUNT, AMOUNT (e.g. penalty ₹28,000, refund
  ₹17,000, amount ₹28,000; contracted INV-21 penalty 0, refund ₹18,500, amount ₹0) → **confirm cancellation formula**.
- Contracted Client has its own invoice series (INV-21, 18-Sept-2026).

## 16. Finance → Manage Inventory (FIN-INVT)
Search; tabs **Inventory Master | Internal Requests | Stock Management**.
- Inventory Master: sub-chips Operational / Service & Maintenance / Misc; "All Operational Items" + **+ ADD INVENTORY
  ITEM**. Item card: ITM-1, Active, name, TYPE, CATEGORY, CURRENT STOCK (5100 Piece (PCS)), LOCATION ("Bnagalore" — data
  typo), MIN / MAX STOCK (2000/24000), DEFAULT VENDOR. Menu: **View Item**, Edit Item*, Delete Item*, Create PR*.
  - View Inventory Item Details: tabs Overview (Item ID, Item Name, Inventory Type, Category, Status, Current Stock, UOM, HSN
    Code, Location, Location Code, Last Updated, Updated By, Warranty/Guarantee Info, Item Specification, Notes) / History
    (Movement History: Date, Type, Quantity, Reference — "No movement history") / PR & PO (Purchase Requests: PR NO, Date,
    Required Date, Quantity; Purchase Orders: PO NO, Date, Vendor (N/A), Quantity).
  - No in-screen back/close; device Back key (Escape) did nothing; Android edge-swipe back worked.
  - Observation: Movement History empty although Stock Ledger has GRN entries for the same item → **clarify**.
- Internal Requests: chips All Requests / Pending Approval. Card REQID-28, status chip (red), title (Trip Amenity), INTERNAL
  REQ TYPE (General), VEHICLE NUMBER, REQUESTED BY, ITEMS, ESTIMATED COST ("--"), DATE & TIME ("08/09/26, 7:14 am").
  Menu: View Request, Approve Request*, Reject Request*.
- Stock Management: chips Stock Ledger / Adjustments.
  - Stock Ledger card: SLED-54, item, DATE (15/09/26), TRANSACTION TYPE (GRN), TRANSACTION NUMBER (GRN-2026-0006), QTY 300,
    LOCATION, STOCK BEFORE 4800, STOCK AFTER 5100 (= before + qty ✓), REASON ("Stock received via goods receipt note").
  - Adjustments: **+ STOCK ADJUSTMENTS**; "No stock adjustments found."

## 17. Finance → Purchasing (PUR)
Search; toggle **PR | PO** (PO toggle needed a second tap once).
- PR: chips All PR Requests / Drafts / Submitted / Pending Approval; "All Purchase Requests" + **+ CREATE PR**. Card: PR no.
  (PR-2026-0017), priority chip (red), REQUESTED BY, DEPARTMENT TYPE, ITEMS, CREATED DATE, STATUS (Submitted), menu:
  View Details, Approve PR*, Reject PR*, Edit Request*, Delete Request* (Edit/Delete offered on a Submitted PR → **rule?**).
- PO: chips All PO / Issued / GRN / QC / Delivered; "All Purchase Orders" + **+ CREATE PO**. Card: PO no., LINKED PR, VENDOR
  NAME, PO DATE, DELIVERY DATE, TOTAL VALUE, ITEMS, STATUS. Menu: View Details, Issue PO*, Edit PO*, Delete PO* — offered
  even on a **Delivered** PO (likely defect). PR-2026-0016 is linked to two POs (PO-0017 Draft ₹33,750 and PO-0018
  Delivered ₹39,150) → **confirm PR→PO quantity rule**.

## 18. Finance → Vendor Payments (VPAY)
Tabs **All Vendors | Vendor Payments**.
- All Vendors: chips Bus Vendor / Supplier Vendor / Service Vendor; "Search Vendor Here..."; removable filter chip "VENDOR :
  Bus Vendor" (x, expand); table SR NO., VENDOR NAME, EMAIL, PHONE NUMBER, VENDOR TYPE, STATUS (Active), ACTIONS → View
  Details (only). View Details: type chip, status, name, Trust Score, ID ("REQ-47" — table shows VEND-47), Support Email,
  Direct Contact, Total Lifetime Business (₹0). No add/edit vendor action observed.
- Vendor Payments: KPIs Total Outstanding, Overdue Amount, Total Paid (YTD) (all ₹0); vendor selector + **Ledger Generate**;
  table VENDOR ID, VENDOR NAME, TOTAL OUTSTANDING, CREDIT TERM (net-30 / net-60), TOTAL PAID, LAST PAYMENT. Outstanding ₹0
  despite delivered PO ₹39,150 → **clarify**. No "record payment" control observed.

## 19. Finance → Reports (RPT)
Cards: **Trip-wise Cost** (Performance, Daily), **Bus-wise Revenue** (Revenue, Monthly), **Expense Trends** (Financials,
Weekly); each with description, LAST GENERATED (all "09/02/2026 10:30 AM" — looks static), GENERATE NOW, PREVIEW, EXPORT,
SCHEDULE. PREVIEW → alert "PREVIEW coming soon." (not implemented). Generate/Export/Schedule not tapped.

## 20. Header → Notifications (NOTIF)
Bell → dropdown "Notifications" with count badge (20); items: icon, title (New Inquiry Alert, New Invoice Generated, Trip
Ready for Dispatch), description with record IDs/amounts, relative time (2h/4h), unread dot. Items not tapped (would mark
read). Dropdown did **not** close via bell or outside tap — only Android Back closed it (likely defect).

## 21. Header → Profile (PRF)
Avatar → "Profile Settings": avatar with camera icon, name, role, EDIT PROFILE, Admin Name, Username, Role, Email Address,
Contact, Address, **Change Password**. Edit Profile → inline "Edit User Information" (Name, Username, EMAIL ADDRESS, Phone
Number, Address; Submit / CANCEL) — cancelled. Change Password dialog (Old / New / Confirm Password; CANCEL / Submit; X) —
cancelled. No screenshots stored (account identifiers). Bottom bar highlighted Operations although opened from Finance.

## 22. Not explored / not accessible
- Nothing was inaccessible to Superadmin (no permission errors). All 16 modules opened.
- Not opened on purpose (consequential or would change data): Sign Out, any Approve/Reject/Confirm/Assign/Send/Delete/Edit
  save, Generate Quote, Initiate Vehicle Dispatch, Activate Post Arrival, Record Advance, Ledger Generate, Generate Now /
  Export / Schedule, SOS Contacts, Call/Email buttons, notification items, OTP/password-reset requests.
- Empty in this environment, so detail/actions unobservable: Trip Approvals, Pending Confirmations, Dispatch queues, Trip
  Monitoring Ongoing, Driver Bata entries, Service requests / job cards, Live support tickets, Stock adjustments.
- New Booking Review step, Service Request steps 2–3, OTP entry screen not reached.

## 23. Cross-cutting observations (candidate defects — to confirm during execution)
1. Trip Monitoring → Completed: alert "Too many columns" + no data (backend error exposed).
2. Trip Expenses title shows raw key "FinanceTripExpenseTitle".
3. Invoice/trip-summary amounts disagree (INV-88 ₹1,33,770 vs ₹1,31,985); CGST/SGST computed on gross; Total excludes
   non-taxable; invoice dates differ (05-10 vs 09-10-2026).
4. Trip lifecycle inconsistency: Completed trips with future dates, Upcoming trips with past dates, TP-73 completed yet
   "Upcoming Arrival", absent from Trip Monitoring completed lists.
5. Driver picker (Add Bata) is a native alert limited to 3 drivers and cannot be dismissed.
6. Notifications dropdown cannot be closed by bell/outside tap.
7. Delivered PO still offers Issue/Edit/Delete; Submitted PR offers Edit/Delete; one PR linked to 2 POs.
8. Vendor outstanding ₹0 despite delivered PO; vendor ID REQ-47 vs VEND-47.
9. Reports Preview "coming soon"; Last Generated timestamps static.
10. Edit Quote screen titled "Add New Quote"; Lead Details Expected Value/Stage empty although card shows amount.
11. Dispatch Vehicle dropdown rendered under the Date control.
12. Formatting: mixed date formats, amounts without separators / with one decimal.
13. Navigation: inconsistent bottom-tab re-selection; hardware Back ignored on some screens (Inventory item details).
14. Generic alert on New Booking ("…to open the calendar") without field-level errors.
