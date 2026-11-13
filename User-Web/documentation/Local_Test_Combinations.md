# User-Web: Local module test execution plan

| | |
|---|---|
| Status | **REVISED after exploration, awaiting approval.** No test combination has been executed. |
| Environment | User App **Preprod** (URL in `User-Web/.env`), Personal Login → Mobile Number, automated via `scripts/login.mjs` |
| Test data | `User_WEB_cases.xlsx`, sheets `LOCAL` (25 rows) and `ADDITIONAL_TEST_INFO` (6 parameters, 20 vehicles) |
| Explored | 2026-11-12, read-only. Booking, inquiry and draft requests were blocked at network level (`steps/_local.mjs → guard`). |
| Combinations | **8** (4 mandatory configurations + 1 validation combination + 1 long-distance/border combination + 2 fare-boundary checks) |
| Evidence | `User-Web/screenshots/login/`, `User-Web/screenshots/local/`. Raw data in `User-Web/exploration-logs/raw/` (git-ignored). |

## 1. Observed application behaviour (Local)

### 1.1 Form (home page → Smart Inquiry → Local tab)

| Element | CFG-1 Normal | CFG-2 Multi-day | CFG-3 Diff. drop | CFG-4 MD + DD | Rules observed |
|---|---|---|---|---|---|
| Multi-day Trip toggle | OFF | ON | OFF | ON | Checkbox switch |
| Drop at different location toggle | OFF | OFF | ON | ON | Checkbox switch |
| Pickup Location | ✔ | ✔ | ✔ | ✔ | Required ("Pickup location is required"). Google Places suggestions (5 shown) |
| Pickup Date (single) | ✔ | — | ✔ | — | Defaults to today. Past dates disabled; typed past date rejected. **No upper limit seen (26+ months open)** |
| Pickup Time | ✔ | ✔ | ✔ | ✔ | 30-min slots (48). Today's past slots disabled. **Default value = current clock time (e.g. 11:05), not a slot** |
| Select Travel Dates (inline calendar) | — | ✔ | — | ✔ | Multi-select with "Selected Dates (n)" chips. **Today is pre-selected and can't be deselected.** Cross-month selection works. 27+ months navigable |
| Drop Location | — | — | ✔ | ✔ | Required when DD is ON ("Drop location is required") |
| Passengers | ✔ | ✔ | ✔ | ✔ | Number, min 1. 0 and negatives auto-reset to 1. **No maximum (999 accepted).** Blank shows a raw technical message |
| Number of Hours | ✔ | ✔ | ✔ | ✔ | Number 1–24. 0 → "Must be a positive number". 25 → "Maximum 24 hours allowed". 1.5 → 1. Blank shows a raw technical message |
| Save As Draft | ✔ | ✔ | ✔ | ✔ | Calls `draft-inquiry/save` (blocked during exploration; never clicked) |
| Book Now! | ✔ | ✔ | ✔ | ✔ | Validates, then opens `/send-inquiry` (read-only `POST /user/pricing`). **It does not create a booking** |

The app also **auto-saves a draft inquiry when you leave the page** with the form filled (`draft-inquiry/save`). This was blocked during exploration.

### 1.2 Results page (`/send-inquiry`)

- **Trip summary:** Garage (Start) → Pickup → Drop → Garage (Return), Distance, Dates, Pickup/Drop address, Duration, Passengers. Includes a **Modify Inquiry** button.
- **Filters:**
  - Vehicle Age (Brand New 0–2 yrs / Standard 2–5 yrs / Any)
  - Comfort Priority (seat pitch / luggage / ride comfort)
  - Category (Luxury / Premium / Deluxe)
  - 16 brand chips
  - Show Advanced Filters
  - Clear Preferences
- **Results:** "20 Buses Found | Local – N HR / 80 KM", paginated (4 pages × 6). Each card shows category, "Starts From ₹", rating, name, code, seats, luggage, amenities, "Best For", **Book This Vehicle** and **View Full Vehicle Details**. The page also has **Request Custom Quote**.
- **Vehicle applicability:** **all 20 vehicles in `ADDITIONAL_TEST_INFO` are offered for Local** (1 hr, 1 passenger):

| VEH | Vehicle | Code | Seats shown | 1 day fare | Note |
|---|---|---|---|---|---|
| 001 | Sedan | D SDN | 4 | ₹4,500 | |
| 002 | MPV's | D MPV | 7 | ₹7,800 | |
| 003 | 12 Seater Tempo Traveller | D12TT | 12 | ₹5,300 | |
| 004 | 21 Seater Premium AC Coach | P21AC | 21 | ₹9,500 | |
| 005 | 33 Seater Deluxe Coach | D35NA | **35** | ₹11,000 | **Name says 33, seats say 35** |
| 006 | 40 Seater Deluxe Coach | D40NA | 40 | ₹11,500 | |
| 007 | 49 Seater Deluxe Coach | D49NA | 49 | ₹13,500 | |
| 008 | 45 Seater Premium AC Coach | L45P | 45 | ₹14,500 | "L" code prefix on a Premium vehicle |
| 009 | 40 Seater Premium AC Coach | P40AC | 40 | ₹13,500 | |
| 010 | 35 Seater Premium AC Coach | P35AC | 35 | ₹12,500 | |
| 011 | 28 Seater Premium AC Coach | P28AC | 28 | ₹11,500 | |
| 012 | 25 Seater Premium AC Coach | P25AC | 25 | ₹10,500 | |
| 013 | 16 Seater Premium Urbania | P16UB | 16 | ₹8,300 | |
| 014 | 12 Seater Luxury Urbania | L12AC | 12 | ₹9,300 | |
| 015 | 9 Seater Luxury Urbania | L9UB | 9 | ₹10,500 | |
| 016 | 45 Seater Luxury Volvo | L45V | 45 | ₹17,000 | |
| 017 | 45 Seater Luxury 9600 Volvo | L45NV | 45 | ₹22,000 | |
| 018 | 49 Seater Luxury 9600 Volvo | L49NV | 49 | ₹24,250 | |
| 019 | SUV | LSUV | **0** | ₹19,500 | **0 seats shown; tagged "Delux" with an L code** |
| 020 | 45 Seater Luxury BharatBenz | 45LBB | 45 | ₹16,000 | |

### 1.3 Behaviour of the four configurations (observed)

| Config | Observed |
|---|---|
| CFG-1 | Drop = pickup automatically. Duration "N Hour(s)". Package "N HR / 80 KM" |
| CFG-2 | Dates shown as "12,20,… Nov". Duration "N Days". **Fare = 1-day fare × number of dates** (e.g. 4 dates → ₹44,000 for the 33 Seater). Multi-day with only today selected is accepted (1 "day") |
| CFG-3 | Drop shown in the route and summary. Drop is required |
| CFG-4 | Combines both: e.g. Jayanagar → Mysore Palace, 4 days, ₹44,000 for the 33 Seater |

## 2. Findings from exploration (defect candidates and open questions)

| # | Finding | Type | Evidence |
|---|---|---|---|
| F1 | **Distance is always 80 KM and the fare doesn't change with drop distance.** Whitefield→Whitefield, EC→Kotilingeshwara, Yeshwanthpur→**Belagavi (~500 km)** and Sarjapur→Hogenakkal all show 80 KM and the same fares | Defect candidate / business rule to confirm | `scn-dd-*.png` |
| F2 | **Number of Hours doesn't change the fare.** 8 hrs shows "8 HR / 80 KM" with the same ₹ as 1 hr | Defect candidate / confirm | `scn-hrs8.png` |
| F3 | **Passenger count doesn't filter vehicles.** With 13 or 50 passengers, Sedan (4) and the 12-seaters are still offered. No multiple-vehicle prompt for more than 49 at this stage (ADD-006) | Defect candidate | `scn-pax13.png`, `scn-pax50.png` |
| F4 | Same pickup and drop is accepted with DD ON (no validation) | Defect candidate | `scn-dd-same.png` |
| F5 | Out-of-state drop accepted for Local: "Hogenakkal" resolves to **Tamil Nadu** | Confirm rule | `scn-dd-border.png` |
| F6 | Raw technical error for blank Passengers/Hours: "passengers must be a \`number\` type, but the final value was: \`NaN\`…" | Defect (UX) | `val-02-invalid-values.png` |
| F7 | No maximum for Passengers (999 accepted) | Confirm rule | validation probe |
| F8 | No upper limit on the booking window (26+ months single date, 27+ months multi-day) | Confirm rule | `picker-01-date.png` |
| F9 | Time defaults to the current minute (e.g. 11:05), which isn't a selectable 30-min slot | Minor defect | `picker-02-time.png` |
| F10 | Multi-day: today is always included and can't be removed. Only 1 date is accepted as "multi-day" | Confirm rule | `md-01-dates.png` |
| F11 | Vehicle data: 33 Seater Deluxe shows 35 seats; SUV shows 0 seats, "Delux" tag, LSUV code; 45 Premium has an L code | Data defect | `results-02-cards.png` |
| F12 | A draft inquiry is auto-saved when leaving the page with a filled form | Behaviour to confirm (creates data) | network log |

**Not yet explored** (cut short to speed up approval). These are covered during execution and stop before any submit:
- Book This Vehicle → review/submit screens.
- View Full Vehicle Details, Modify Inquiry, Request Custom Quote (view only).
- Results filters, toggle switching with data entered, back/refresh.

## 3. Revised minimum combinations (8)

Because of F1–F3, distance and passenger count don't change the results today. The LOCAL rows therefore reduce to these classes: no drop, near drop, far drop and out-of-state drop. Each combination selects one **different vehicle** via Book This Vehicle and stops before the final submit.

| ID | Config | Data row(s) | Pickup → Drop | Date(s) / Time | Pax | Hrs | Vehicle | Main checks |
|---|---|---|---|---|---|---|---|---|
| **TC-01** | CFG-1 | LOC-001 | Whitefield → (auto = pickup) | Today, next enabled slot | 1 (min) | 1 (min) | VEH-001 Sedan | Main path; summary; 20 vehicles; 1 HR/80 KM fare; View Full Vehicle Details; Book This Vehicle → stop before submit |
| **TC-02** | CFG-2 | LOC-013 | Malleshwaram → (auto) | Today (auto) + 1 future = **2 dates** | 13, then 12 | 24 (max) | VEH-003 12 Seater Tempo Traveller | Multi-day minimum; fare = day fare × 2; capacity check (13 pax with a 12-seater, F3); hours maximum |
| **TC-03** | CFG-3 | LOC-002 | Electronic City Ph 1 → Kotilingeshwara Temple, Kammasandra | Future date, evening slot | **49** (single-vehicle max) | 12 | VEH-007 49 Seater Deluxe Coach | Drop field and suggestions; drop in the summary; 49 = capacity |
| **TC-04** | CFG-4 | LOC-004 | Jayanagar 4th Block → Mysuru Palace | Today + 2 dates in **next month** (3 dates, cross-month) | **50** | 8 | VEH-016 45 Seater Luxury Volvo (+ second vehicle if the app offers multiple vehicles) | Above 49 / multiple vehicles (ADD-006); fare × 3 days; cross-month dates; Modify Inquiry round-trip |
| **TC-05** | CFG-3 | LOC-023, then LOC-016 | Yeshwanthpur → **Belagavi**, changed to Sarjapur Road → **Hogenakkal** | Far-future date (2028) | 22 | 1 | VEH-012 25 Seater Premium AC Coach | Long distance (F1); out-of-state drop (F5); booking-window limit (F8); results filters (category/brand/Clear) |
| **TC-07** | CFG-1 (fare boundary: **hours**) | LOC-001 | Whitefield → (auto) | Future date, 9:00 AM | 1 | **8 (baseline), then 9** | VEH-013 16 Seater Premium Urbania | **9 HR / 80 KM vs 8 HR / 80 KM** on the same vehicle and form details. Only the hours change |
| **TC-08** | CFG-3 (fare boundary: **kilometres**) | LOC-017 | **Peenya → Maddur** (baseline and boundary) | Same date and time as TC-07 | 1 | **8** | VEH-013 16 Seater Premium Urbania | **8 HR / 80 KM package fare vs the actual route distance (~90 km).** Only distance matters. Inconclusive if the app still shows 80 KM |
| **TC-06** | Toggles CFG-1 ↔ 4, ending in CFG-3 | LOC-021 | Whitefield → Whitefield, then a valid drop | Past date typed, then today | blank / 0 / -3 / 999, then 3 | 0 / 25 / blank / 1.5, then 2 | VEH-002 MPV's | **Validations:** pickup required; drop required; same pickup/drop (F4); pax/hours rules (F6, F7); past date; multi-day today lock (F10); toggle ON/OFF with data entered; back/refresh |

### 3.1 Fare-boundary checks (TC-07 and TC-08)

These are two **separate** checks, so the effects of extra hours and extra kilometres on the fare are seen independently. Each one
compares a boundary value against a baseline that uses the **same form details**: route, date, time, passengers and vehicle
(VEH-013 16 Seater Premium Urbania). Using one vehicle is a deliberate exception to vehicle rotation, because fares are only
comparable on the same vehicle.

| Step | TC-07 Hours boundary (9 HR / 80 KM) | TC-08 Kilometre boundary (8 HR / >80 KM) |
|---|---|---|
| Route | Whitefield, CFG-1 (drop = pickup) | **Peenya → Maddur**, CFG-3 (DD ON), for both baseline and boundary |
| Baseline | **8 hrs** → package label, displayed distance, VEH-013 "Starts From" fare, and the fare breakdown and total after Book This Vehicle | The **8 HR / 80 KM package fare** for VEH-013 on the same Peenya → Maddur result (package label and base fare) |
| Boundary | Same form, **9 hrs** | The **actual route distance** of Peenya → Maddur (~90 km by road), and whether the total fare goes beyond the package fare |
| Held constant | Route, date, time, passengers (1), vehicle | Hours (8), date, time, passengers (1), vehicle |
| Record | Package label, displayed distance, fare breakdown (base, extra-hour line, extra-km line, taxes, as shown), total. Same for all 6 page-1 "Starts From" fares | Same fields, plus the **displayed distance vs the road distance** |

**Verdict rules (no expected fare is assumed):**

- The applicable Local fare rules aren't confirmed yet (see Q-FARE below). Until they are, each check reports the **observed**
  behaviour: whether an extra-hour or extra-km line appears, and the fare difference in ₹ against the baseline.
  - The fare verdict is `Inconclusive – fare rule not confirmed`.
  - It becomes Pass or Fail only against a fare rule the business confirms (for example "₹X per extra hour", "₹Y per extra km").
- **TC-08 distance gate:**
  - If the app **still shows 80 KM** for Peenya → Maddur, the extra-km fare check is **`Inconclusive`** (never Pass or Fail),
    because the boundary was never reached.
  - The wrong distance is recorded as a **separate defect** under F1 ("Displayed distance 80 KM for a ~90 km route").
  - The fare check is only evaluated when the displayed distance is **above 80 KM**.
- TC-07's distance stays 80 KM by design, so only the hours change.

**Q-FARE (needs business confirmation before Pass/Fail):**
- What is the Local package definition (8 HR / 80 KM, or one package per hour value, since the label shows "N HR / 80 KM")?
- What are the extra-hour and extra-km rates per vehicle?
- Are the garage legs (Garage → pickup, drop → Garage) counted in the distance?

## 4. Coverage mapping

| Area | Items | Covered by | % |
|---|---|---|---|
| Mandatory configurations | CFG-1, CFG-2, CFG-3, CFG-4 | TC-01, TC-02, TC-03/05, TC-04 (+ TC-06 transitions) | **100%** |
| LOCAL data classes | No drop · near · district/mid · far · out-of-state · duplicate pickup | TC-01/02 · TC-03 · TC-04 · TC-05 · TC-05 · TC-06 | **100%** (8 of 25 rows run, adding LOC-017; the rest are represented) |
| ADDITIONAL parameters | ADD-001 today · 002 future · 003 multiple dates · 004 hours · 005 pax 1–49 · 006 pax > 49 | TC-01 · TC-03/05 · TC-02/04 · all (1, 2, 8, 12, 24, and 0/25 invalid) · TC-01/02/03 · TC-04 | **100%** (ADD-004 applies, because Local has an hours field) |
| Field validations | Pickup required, drop required, pax, hours, past date, MD dates | TC-06 (+ TC-02 capacity) | **100%** |
| Fare boundaries | 8 HR/80 KM baseline · 9 HR/80 KM (extra hour) · 8 HR/>80 KM (extra km) | TC-07 · TC-07 · TC-08 | **Extra hour: planned. Extra km: conditional.** Counted as covered only if the app recognises a distance above 80 KM for Peenya → Maddur; if it shows 80 KM, extra-km coverage = **0% (Inconclusive)** and the gap is listed as uncovered. Both fare verdicts stay Inconclusive until Q-FARE is confirmed |
| Result-page functions | Summary, pagination, View Details, Book This Vehicle (to the pre-submit step), Modify Inquiry, filters, Custom Quote (view) | TC-01, TC-04, TC-05 | **100%** planned |
| Vehicles: Local | 20 offered; 7 selected (Sedan, MPV's, 12 TT, 49 Deluxe, 45 Luxury Volvo, 25 Premium, 16 Premium Urbania) | TC-01 to TC-08 | 35% Local. The other 13 rotate into later modules. **All 20 are seen in the Local results list, so card data is checked for 100%** |

Represented, not run: LOC-003, 005–012, 014, 015, 018–020, 022, 024, 025 (same classes; F1 shows distance doesn't change behaviour).

## 5. Execution rules

- Login with `node scripts/login.mjs`. Booking, inquiry and draft requests stay blocked by the network guard.
- **Final submit, Request Custom Quote submit and Save As Draft are never clicked** without per-action approval. If not approved, that step is `Blocked (approval not given)`.
- Output: `User-Web/results/user-web-<YYYYMMDD-HHMM>-LOCAL.csv`, `User-Web/reports/<run-id>/local-test-report.html`, and an update to `Vehicle_Coverage_Tracker.md`.
