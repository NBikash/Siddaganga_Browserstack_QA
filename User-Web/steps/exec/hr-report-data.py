# Curated report content for the Transfer By Hours execution run. Writes results/<RUN>/report-data.json
# for scripts/build-report-hr.mjs (same structure as the Outstation report-data).
# Evidence paths are taken from the saved step results (so -r2 re-run names are always correct).
# Usage: python -X utf8 steps/exec/hr-report-data.py <RUN_ID>
import json, sys, os, glob
RUN = sys.argv[1]
SD = f"screenshots/exec-ot/{RUN}"
def S(name):
    """Latest existing screenshot for a base name (handles -r2/-r3 re-run suffixes)."""
    c = sorted(glob.glob(f"{SD}/{name}.png") + glob.glob(f"{SD}/{name}-r*.png"), key=os.path.getmtime)
    return (c[-1] if c else f"{SD}/{name}.png").replace("\\", "/")
E = lambda f, c: {"path": S(f), "caption": c}
def J(tc):
    try: return json.load(open(f"results/{RUN}/{tc}.json", encoding="utf-8"))
    except Exception: return None
def step(tc, label):
    d = J(tc); return next((s for s in (d or {}).get("steps", []) if s["label"] == label), {}) if d else {}
def P(path, cap):
    return {"path": path, "caption": cap} if path else None
ENV = "User App Preprod (preprod.siddagangatravels.com), Chrome via Playwright over CDP, 1440×900, Personal Login (mobile)"
PRE = ["Log in to User App Preprod (Personal Login → Mobile Number).", "Home → Smart Inquiry → Transfer → By Hour."]
PRER = PRE + ["Tick Add Return."]
TB = lambda base, late: [["Base Rate (Outside City / Inside City band)", base, "Yes – per day"], ["Late Allowance", late, "Only for late trips (window not displayed, Q-09)"], ["Toll & Parking", "Actuals", "Not in estimate"], ["GST", "Additional", "Not in estimate"]]

issues = []
def I(**k): issues.append(k)

def C(id_, title, status, objective, data, journey, expected, actual, reason, evidence, cfg, key, veh, fare=None):
    return dict(id=id_, title=title, status=status, objective=objective, data=data, journey=journey, expected=expected, actual=actual,
                statusReason=reason, evidence=[e for e in evidence if e], cfg=cfg, keyData=key, vehicle=veh, fare=fare or [])
def F(veh, br, app, arith, comp, verdict, clar=None):
    return dict(vehicle=veh, breakup=br, applied=app, arithmetic=arith, comparison=comp, verdict=verdict, clarify=clar or [])
cases = []

# ------------------------------------------------------------------ issues
I(id="HRS-02-Issue-01", case="HRS-02", type="Defect", severity="High", category="Data",
  title="Submitted By Hour inquiry stores no hours and timings 00:00 / 00:00; it is saved as a plain 'Transfer'",
  where="Dashboard → My Inquiries → Edit Inquiry (inquiry details)",
  steps=PRE + ["Pickup Whitefield, drop OFF, 25 Nov 2026 10:00 AM, 4 hours, 40 passengers, 40 Seater Premium AC Coach → Confirm & Submit.", "Dashboard → My Inquiries → ORZS120376 → Edit Inquiry."],
  expected="Inquiry shows the By Hour type, 4 hours and 10:00 AM pickup (Q-30).",
  actual="Type 'Transfer'; Booking Type 'Transfer'; 'Timings: Arrival: 00:00 | Departure: 00:00'; drop = pickup Whitefield; no field or text with the 4 hours. Confirm screen also shows no hours. Same timing defect as the P2P/Return run (P2P-02-Issue-01).",
  impact="Admin cannot see how many hours the customer booked or when the vehicle is needed.",
  evidence=[E("HRS-02-main-confirm", "Confirm: no hours"), E("HRS-02-post-my-inquiries", "My Inquiries: Transfer"), E("HRS-02-post-ORZS120376-edit-form", "Details: no hours, 00:00")])
I(id="HRS-03-Issue-01", case="HRS-03", type="Defect", severity="Low", category="Validation",
  title="Blank Number of Hours shows a raw schema error ('numberOfHours must be a `number` type … NaN')",
  where="By Hour form → Number of Hours", steps=PRE + ["Pickup Electronic City Phase 1; clear Number of Hours (or type letters); Book Now!."],
  expected="Friendly message such as 'Number of hours is required'.", actual="'numberOfHours must be a `number` type, but the final value was: `NaN` (cast from the value `\"\"`).' Recurrence of Local TC-06-Issue-01.",
  impact="Unprofessional message.", evidence=[E("HRS-03-blank-validation", "Blank hours")])
I(id="HRS-03-Issue-02", case="HRS-03", type="Inconsistency", severity="Low", category="Validation",
  title="Hours 0, −1, 25 and 100 blocked only by the browser tooltip; no in-app message", where="By Hour form → Number of Hours",
  steps=PRE + ["Enter 0 (then −1, 25, 100) in Number of Hours; Book Now!."], expected="In-app message (e.g. 'Maximum 24 hours allowed').",
  actual="Nothing happens on the page; only the browser bubble 'Value must be greater than or equal to 1' / 'less than or equal to 24' (min=1, max=24).",
  impact="Easy to miss, wording depends on the browser.", evidence=[E("HRS-03-0-validation", "0 hours"), E("HRS-03-25-validation", "25 hours")])

cases += [
 C("HRS-01", "By Hours form inventory, defaults and differences from Local", "Pass", "Verify By Hour fields, toggles and limits against the Local form.",
   {"Data": "Blank form; Local form for comparison"}, ["Open Transfer → By Hour; record fields", "Different drop ON; Multi-day ON", "Open Local; compare"],
   ["Fields: Multi-day, Different drop, Pickup, Pickup Date & Time, Passengers, Number of Hours (1–24)", "Multi-day replaces the date with date selection; drop ON adds a drop field", "Differences from Local recorded"],
   ["Fields: Multi-day Trip, Drop at different location, Pickup Location, Pickup Date & Time, Passengers (min 1, no max), Number of Hours (min 1, max 24, default 1), Save As Draft, Book Now! ✔",
    "Drop ON adds 'Drop Location' ✔; Multi-day ON: 'Pickup Time' + 'Select Travel Dates' inline calendar with chips; today (Nov 18) pre-selected", "Local form has the same field set and limits (hours 1–24, passengers no max)"],
   "All fields as documented; By Hour and Local forms are identical in structure (pricing differs, HRS-12).", [E("HRS-01-form", "By Hour form"), E("HRS-01-toggles-on", "Toggles ON"), E("HRS-01-local-form", "Local form")], "Form", "—", "—"),
 C("HRS-02", "By Hours end-to-end: fare, submission and My Inquiries", "Fail", "Main path with fare verification, submission and post-submission verification.",
   {"Pickup": "Whitefield (TRF-HR-001), drop OFF", "Pickup date/time": "25 Nov 2026 10:00 AM", "Hours": "4", "Passengers": "40 (= capacity)", "Vehicle": "VEH-009 40 Seater Premium AC Coach (P40AC)", "PNR": "ORZS120376"},
   ["Search → results", "Fare Breakup P40AC", "Book This Vehicle → Confirm", "Confirm & Submit (approved)", "Dashboard → My Inquiries → Edit Inquiry"],
   ["Results show 4 hours; pricing model per Q-15", "Confirm total = popup = details", "Inquiry shows By Hour type and hours"],
   ["Summary: Duration '4 Hours', Distance '> 30 KM', drop = Whitefield; header 'Transfer - > 30 KM'", "Breakup 'Transfer Trip - Outside City': Base ₹20,000, Late Allowance ₹1,000, Toll Actuals, GST Additional (no hourly line)",
    "Confirm: Pickup Location only; Vehicle Base Cost ₹20,000 = Grand Total; no hours shown; 40 pax on 40-seater accepted", "Popup 'Inquiry Submitted Successfully!' ₹20,000; exactly one save-inquiry call",
    "My Inquiries: ORZS120376, Transfer, Bengaluru → Bengaluru, 25 Nov 2026, 40 Seater Premium AC Coach (40), 40, New quotation", "Details: Booking Type Transfer, no hours, Timings 00:00 / 00:00 ✘"],
   "Inquiry created with a consistent amount, but the hours and the pickup time are lost (HRS-02-Issue-01).",
   [E("HRS-02-main-results", "Results: 4 Hours"), E("HRS-02-main-fare-breakup", "Fare Breakup"), E("HRS-02-main-confirm-cost", "Confirm"), E("HRS-02-main-submit-result", "Success popup"), E("HRS-02-post-my-inquiries", "My Inquiries"), E("HRS-02-post-ORZS120376-edit-form", "Details")],
   "Main path", "Whitefield, 4 h, 40 pax", "P40AC",
   [F("40 Seater Premium AC Coach (P40AC)", TB("₹20,000 (> 30 km)", "₹1,000"), [["Vehicle Base Cost", "₹20,000"], ["Estimated Grand Total", "₹20,000"]],
      "20,000 + 0 (daytime) = 20,000 ✔ = popup = details ₹20,000.00", ["Applied = displayed band base", "No hour-based component exists in the breakup"], "Inconclusive – fare rule not confirmed", ["Q-15 By Hour pricing model (priced as a distance band, not by hours)"])]),
 C("HRS-03", "Number of Hours validation: equivalence classes and 1/24 boundaries", "Fail", "Hours field validation.",
   {"Pickup": "Electronic City Phase 1 (TRF-HR-002)", "Values": "0, 1, 24, 25, −1, blank, 1.5, 'abc', 100"}, ["Enter each value; Book Now!"],
   ["1 and 24 accepted", "0, −1, 25, 100 blocked with an in-app message", "Blank / 'abc' clear message, not NaN", "1.5 handled consistently"],
   ["1 → 'Duration: 1 Hour' ✔; 24 → '24 Hours' ✔", "0, −1, 25, 100: search blocked by the browser min/max bubble only, no in-app message", "Blank: raw 'numberOfHours must be a `number` type … NaN' ✘", "'abc': letters cannot be typed (field stays blank → same NaN message)", "1.5: the decimal point is not accepted; value becomes 1 → '1 Hour' (consistent)"],
   "Boundaries enforced, but blank shows a raw schema error (HRS-03-Issue-01) and out-of-range values get no in-app message (HRS-03-Issue-02).",
   [E("HRS-03-1-results", "1 hour"), E("HRS-03-24-results", "24 hours"), E("HRS-03-0-validation", "0"), E("HRS-03-25-validation", "25"), E("HRS-03-blank-validation", "Blank: NaN"), E("HRS-03-1_5-results", "1.5 → 1")],
   "Hours", "9 values", "—"),
]

I(id="HRS-04-Issue-01", case="HRS-04", alsoIn=["HRS-06", "HRS-11", "HRS-12"], type="Clarification", severity="", category="Fare",
  title="By Hour fare does not depend on the number of hours (1 h = 24 h = ₹15,000 base)", where="Fare Breakup / Confirm",
  steps=PRE + ["Peenya, drop OFF, 2 Dec 2026 6:00 AM, 10 passengers, 28 Seater Premium AC Coach.", "Repeat with hours 1, 2, 4, 8, 12, 16, 23, 24."],
  expected="Per Q-15 (the workbook expects hourly pricing; Local uses packages + extra hour).", actual="Vehicle Base Cost ₹15,000 for every value; only 24 h adds Late Allowance ₹2,000 (ends 06:00 next day). The breakup shows a distance band, no hourly or km line. Same in HRS-06 (Hyderabad 4 h vs 24 h base ₹35,000) and HRS-11 (10 h → 12 h unchanged).",
  impact="If By Hour is meant to be priced by hours, every quote is wrong (same pattern as Local TC-07-Issue-01).", evidence=[E("HRS-04-h1-confirm-cost", "1 h: ₹15,000"), E("HRS-04-h12-confirm-cost", "12 h: ₹15,000"), E("HRS-04-h24-confirm-cost", "24 h: ₹15,000 + ₹2,000")])
I(id="HRS-06-Issue-01", case="HRS-06", alsoIn=["HRS-14"], type="Defect", severity="Medium", category="Validation",
  title="By Hour rejects some out-of-state places (Munnar, Panaji, Chennai) with 'Drop/Pickup location is required' while Point To Point accepts them",
  where="Transfer → By Hour → Pickup / Drop Location",
  steps=PRE + ["Drop at different location ON; Pickup Whitefield; Drop: choose 'Munnar, Keralam, India' from the suggestions; Hours 2 → Book Now!.", "Repeat with drop 'Panaji, Goa, India' or pickup 'Chennai, Tamil Nadu, India'.", "Compare: Transfer → Point To Point, Whitefield → Munnar."],
  expected="Same location scope as Point To Point (T-10), or a clear message that the place is outside the service area.",
  actual="The selected place stays in the field but 'Drop location is required' (Munnar – both suggestions, Panaji, Chennai) or 'Pickup location is required' (Chennai). Hyderabad (Telangana) and Mysuru are accepted. Point To Point accepts Whitefield → Munnar.",
  impact="Customers cannot book By Hour trips to or from several destinations and are told the field is empty.",
  evidence=[E("HRS-06-C-validation", "Munnar drop rejected"), E("HRS-06-D-validation", "Panaji drop rejected"), E("HRS-06-probe-p2p-munnar-results", "P2P accepts Munnar"), E("HRS-14-C-validation", "Chennai pickup rejected"), E("HRS-14-D-validation", "Chennai drop rejected")])
I(id="HRS-07-Issue-01", case="HRS-07", alsoIn=["HRS-13"], type="Defect", severity="High", category="Functional",
  title="Multi-day: today is always selected and cannot be removed (past time accepted, zero dates impossible)",
  where="By Hour → Multi-day Trip → Select Travel Dates (chips)",
  steps=PRE + ["Turn Multi-day Trip ON (chip 'Nov 18, 2026' appears).", "Select 21 Nov, 23 Nov, 1 Dec; then remove every chip with ×.", "Book Now!."],
  expected="Only the dates the user selects; zero dates blocks the search (H-05).",
  actual="'Nov 18, 2026' (today) remains after removing all chips and is always included; the search ran for today at 08:00 (already past). In HRS-13 the 07:00 slot was disabled because today is included, so the pickup time stayed at the current time (7:19 PM). Recurrence of Local TC-06-Issue-04.",
  impact="Every multi-day By Hour quote includes an unwanted day, often in the past.", evidence=[E("HRS-07-1-chips", "Today pre-selected"), E("HRS-07-2-zero-results", "All chips removed: search still runs with today"), E("HRS-13-main-results", "HRS-13: today included")])
I(id="HRS-07-Issue-02", case="HRS-07", alsoIn=["HRS-13"], type="Defect", severity="High", category="Fare",
  title="Multi-day Late Allowance is charged for every calendar day in the span, not per selected date",
  where="Confirm Your Trip → Estimated Trip Cost",
  steps=PRE + ["Marathahalli, Multi-day ON: 18 (forced), 21, 23 Nov and 1 Dec 2026; 8:00 AM; 6 hours; 35 pax; 40 Seater Deluxe Coach → Book This Vehicle."],
  expected="Base and allowances per selected date (4 dates); no Late Allowance for an 08:00–14:00 trip.",
  actual="Vehicle Base Cost ₹72,000 (= ₹18,000 × 4 dates) but Late Allowance Cost ₹14,000 (= ₹1,000 × 14 calendar days 18 Nov–1 Dec); total ₹86,000. HRS-13: base ₹56,000 (4 × ₹14,000), Late Allowance ₹27,000 (27 days 18 Nov–14 Dec), total ₹83,000.",
  impact="Large over-charge on multi-day quotes.", evidence=[E("HRS-07-main-confirm-cost", "HRS-07: ₹72,000 + ₹14,000"), E("HRS-13-main-confirm-cost", "HRS-13: ₹56,000 + ₹27,000")])
I(id="HRS-08-Issue-01", case="HRS-08", type="Clarification", severity="", category="Fare",
  title="No Late Allowance for a 04:00–06:00 trip; cross-midnight end not shown", where="Confirm → Estimated Trip Cost",
  steps=PRE + ["HSR Layout, 6 Dec 2026; run 4:00 AM × 2 h and 11:00 PM × 2 h; 33 Seater Deluxe Coach."], expected="Late Allowance for night trips (Q-09); end date-time shown for a cross-midnight trip.",
  actual="04:00 start: ₹16,500, no Late Allowance. 23:00 × 2 h: ₹16,500 + ₹2,000 (base not doubled); Confirm shows only '6 Dec, 2026'.", impact="Rule to confirm.", evidence=[E("HRS-08-D-confirm-cost", "04:00: no Late Allowance"), E("HRS-08-C-confirm-cost", "23:00: Late ₹2,000")])
I(id="HRS-13-Issue-01", case="HRS-13", type="Inconsistency", severity="Medium", category="Functional",
  title="Turning Multi-day OFF in Modify resets the trip to today instead of a selected date", where="Results → Modify Inquiry (Modify Leg 1)",
  steps=PRE + ["Multi-day search with dates 12 and 14 Dec (today forced in).", "Modify Inquiry → Multi-day Trip OFF → Save!."], expected="One of the selected dates (e.g. 12 Dec) or a prompt to choose a date.",
  actual="Summary 'Dates: 18 Nov, 2026' (today).", impact="Trip silently moved to today.", evidence=[E("HRS-13-md-off-results", "After Multi-day OFF: 18 Nov")])
I(id="HRS-10-Issue-01", case="HRS-10", type="Defect", severity="High", category="Functional",
  title="Second vehicle replaces the first (By Hour, 60 passengers)", where="Results → 'Passenger Capacity Not Complete!'",
  steps=PRE + ["Jayanagar 4th Block, 7 Dec 9:00 AM, 6 h, 60 passengers → Book This Vehicle on 45 Seater Luxury Volvo ('45 seats').", "Book This Vehicle on 25 Seater Premium AC Coach."],
  expected="45 + 25 = 70 seats; Confirm lists both.", actual="'cover only 25 seats' – replaced. Same defect as Transfer P2P-08-Issue-03 / Local TC-04-Issue-01.", impact="Groups above one vehicle cannot submit.", evidence=[E("HRS-10-pax60-L45V-confirm", "45 seats"), E("HRS-10-pax60-plus-P25AC-confirm", "Replaced: 25")])
I(id="HRS-09-Issue-01", case="HRS-09", type="Clarification", severity="", category="Validation",
  title="Drop equal to pickup (Hebbal → Hebbal) accepted with Different drop ON", where="By Hour form", steps=PRE + ["Different drop ON; pickup and drop Hebbal → Book Now!."],
  expected="Per Q-21.", actual="Search runs.", impact="—", evidence=[E("HRS-09-3-results", "Drop = pickup accepted")])

cases += [
 C("HRS-04", "Fare for hour values 1–24 on one vehicle (representative set)", "Inconclusive", "How the fare changes with hours.",
   {"Pickup": "Peenya (TRF-HR-013), drop OFF", "Date": "2 Dec 2026 6:00 AM", "Passengers": "10", "Vehicle": "VEH-011 28 Seater Premium AC Coach (P28AC)", "Hours": "1, 2, 4, 8, 12, 16, 23, 24 (representative set agreed with the user; 3, 5–7, 9–11, 13–15, 17–22 not priced)"},
   ["Search for each hour value", "Fare Breakup at 1 and 24 h", "Confirm at 1, 4, 8, 12, 16, 24 h"], ["Trend evaluated against Q-15", "Late Allowance analysed separately"],
   ["Duration shown correctly (1 Hour … 24 Hours) ✔", "Breakup (1 h and 24 h): Base (Outside City) ₹15,000, Late Allowance ₹1,000 – no hourly line", "Confirm 1/4/8/12/16 h: ₹15,000 each", "Confirm 24 h: ₹15,000 + Late Allowance ₹2,000 = ₹17,000"],
   "Hours have no effect on the price; whether that is intended is Q-15 (HRS-04-Issue-01).", [E("HRS-04-h1-fare-breakup", "Breakup 1 h"), E("HRS-04-h1-confirm-cost", "1 h"), E("HRS-04-h8-confirm-cost", "8 h"), E("HRS-04-h16-confirm-cost", "16 h"), E("HRS-04-h24-confirm-cost", "24 h")],
   "Fare × hours", "1–24 h", "P28AC",
   [F("28 Seater Premium AC Coach (P28AC)", TB("₹15,000", "₹1,000"), [["1, 4, 8, 12, 16 h", "₹15,000"], ["24 h", "₹15,000 + ₹2,000 = ₹17,000"]], "Base constant; 24 h ends 06:00 next day → Late Allowance 2 × ₹1,000", ["Same vehicle and inputs; only hours changed"], "Inconclusive – fare rule not confirmed", ["Q-15 hourly pricing", "Q-09 late window"])]),
 C("HRS-05", "Distance band for By Hour: no drop vs short drop vs long drop", "Inconclusive", "Band and base per drop.",
   {"Pickup": "MG Road (TRF-HR-020)", "Hours": "8", "Date": "3 Dec 2026 9:00 AM", "Passengers": "12", "Vehicle": "VEH-014 12 Seater Luxury Urbania (L12AC)", "Runs": ["A drop OFF", "B drop Domlur", "C drop Mysuru (TRF-HR-009)"]},
   ["Run A, B, C; breakup and Confirm each"], ["Band and base consistent per run", "B Inside City, C Outside City (unless Q-15 says otherwise)"],
   ["A: '< 30 KM', ₹10,500; drop shown = MG Road ✔", "B: '< 30 KM', ₹10,500 ✔", "C: '> 30 KM', ₹12,500 ✔", "Header, summary, breakup and Confirm agree in each run"],
   "Consistent banding; By Hour pricing model unconfirmed (Q-15). (Whitefield with no drop is '> 30 KM' in HRS-02 – pickup-dependent, Q-10.)", [E("HRS-05-A-fare-breakup", "A"), E("HRS-05-B-confirm-cost", "B"), E("HRS-05-C-fare-breakup", "C Mysuru")],
   "Band", "MG Road, 3 drops", "L12AC",
   [F("12 Seater Luxury Urbania (L12AC)", [["Base Rate (Inside City)", "₹10,500", "A, B"], ["Base Rate (Outside City)", "₹12,500", "C"], ["Late Allowance", "₹800", "No"]], [["A", "₹10,500"], ["B", "₹10,500"], ["C", "₹12,500"]], "Each = its displayed band rate ✔", ["Only the drop changed"], "Inconclusive – fare rule not confirmed", ["Q-15", "Q-10"])]),
 C("HRS-06", "Different drop far away vs hours: feasibility", "Fail", "Feasibility of far drops against booked hours.",
   {"Vehicle": "VEH-018 49 Seater Luxury 9600 Volvo (L49NV)", "Passengers": "30", "Date": "4 Dec 2026 6:00 AM", "Runs": ["A KR Puram → Hyderabad, 4 h", "B same, 24 h", "C Whitefield → Munnar, 2 h", "D Thanisandra → Goa (Panaji), 24 h"]},
   ["Run A–D; breakup in A; Confirm each", "Control: P2P Whitefield → Munnar"], ["Infeasible combinations blocked, warned or priced with extra km/hours (Q-16)", "Interstate per Q-06"],
   ["A: Hyderabad in 4 h accepted, ₹35,000 – no warning (Q-16)", "B: 24 h ₹35,000 + Late Allowance ₹3,500 = ₹38,500", "C: Munnar drop rejected 'Drop location is required' although selected ✘", "D: Panaji drop rejected the same way ✘", "Control: P2P accepts Whitefield → Munnar"],
   "Far drops are either silently priced at the flat band (A) or wrongly rejected (C, D – HRS-06-Issue-01).", [E("HRS-06-A-confirm-cost", "A 4 h ₹35,000"), E("HRS-06-B-confirm-cost", "B 24 h ₹38,500"), E("HRS-06-C-validation", "C Munnar rejected"), E("HRS-06-D-validation", "D Panaji rejected"), E("HRS-06-probe-p2p-munnar-results", "P2P control")],
   "Feasibility", "Hyderabad, Munnar, Goa", "L49NV",
   [F("49 Seater Luxury 9600 Volvo (L49NV)", TB("₹35,000", "₹1,750"), [["A 4 h", "₹35,000"], ["B 24 h", "₹35,000 + ₹3,500 = ₹38,500"]], "B: 35,000 + 1,750 × 2 = 38,500 ✔", ["Distance/hours feasibility not considered"], "Inconclusive – fare rule not confirmed", ["Q-16", "Q-06"])]),
 C("HRS-07", "Multi-day By Hours: date selection, zero dates, fare per day", "Fail", "Multi-day chips, validation and fare.",
   {"Pickup": "Marathahalli (TRF-HR-005), drop OFF", "Dates": "21 Nov, 23 Nov, 1 Dec 2026 (today 18 Nov forced in)", "Time / hours": "8:00 AM, 6 h", "Passengers": "35", "Vehicle": "VEH-006 40 Seater Deluxe Coach (D40NA)"},
   ["Multi-day ON; select dates; record chips", "Remove every chip; Book Now!", "Re-select; search; breakup; Confirm"],
   ["Chips for selected dates; cross-month works", "Zero dates blocked", "Fare per date (Q-17)", "Future dates with an earlier clock time accepted"],
   ["Chip 'Nov 18, 2026' pre-selected on toggle; 21, 23 Nov and 1 Dec added ✔ (cross-month ✔)", "Removing all chips leaves today; search runs ✘", "Summary: '18,21,23 Nov, 2026 | 1 Dec, 2026', 6 Hours", "Breakup ₹18,000 base, Late Allowance ₹1,000", "Confirm: Base ₹72,000 (4 dates) + Late Allowance ₹14,000 = ₹86,000 ✘"],
   "Today forced in (HRS-07-Issue-01) and Late Allowance per calendar day (HRS-07-Issue-02).", [E("HRS-07-1-chips", "Chips"), E("HRS-07-2-zero-results", "Zero dates not possible"), E("HRS-07-main-results", "Summary"), E("HRS-07-main-confirm-cost", "Confirm ₹86,000")],
   "Multi-day", "4 dates incl. forced today", "D40NA",
   [F("40 Seater Deluxe Coach (D40NA)", TB("₹18,000 per date", "₹1,000"), [["Vehicle Base Cost", "₹72,000"], ["Late Allowance Cost", "₹14,000"], ["Estimated Grand Total", "₹86,000"]],
      "Base 18,000 × 4 dates = 72,000 ✔; Late Allowance 1,000 × 14 calendar days = 14,000 ✘ (daytime trips)", ["Today counted although removed"], "Fail", ["Q-17 multi-day pricing"])]),
 C("HRS-08", "Late Allowance and cross-midnight hourly bookings", "Partial", "Late Allowance by start time.",
   {"Pickup": "HSR Layout (TRF-HR-007), drop OFF", "Date": "6 Dec 2026", "Passengers": "30", "Vehicle": "VEH-005 33 Seater Deluxe Coach (D35NA)", "Runs": ["A 10:00 × 4 h", "B 19:00 × 4 h (ends 23:00)", "C 23:00 × 2 h (ends 01:00)", "D 04:00 × 2 h"]},
   ["Run A–D changing only the start time"], ["Late Allowance for B, C, D only; C shows next-day end", "Base identical"],
   ["A: ₹16,500 ✔", "B: ₹16,500 + ₹1,000 = ₹17,500 ✔", "C: ₹16,500 + ₹2,000 = ₹18,500 (base not doubled ✔); Confirm shows only '6 Dec' ✘", "D: ₹16,500, no Late Allowance (Q-09)", "Base identical in all runs ✔"],
   "B and C behave as expected; D and the missing end date need clarification (HRS-08-Issue-01).", [E("HRS-08-A-confirm-cost", "A"), E("HRS-08-B-confirm-cost", "B"), E("HRS-08-C-confirm-cost", "C"), E("HRS-08-D-confirm-cost", "D")],
   "Late window", "4 start times", "D35NA",
   [F("33 Seater Deluxe Coach (D35NA)", TB("₹16,500", "₹1,000"), [["A", "₹16,500"], ["B", "₹17,500"], ["C", "₹18,500"], ["D", "₹16,500"]], "B 16,500 + 1,000; C 16,500 + 2 × 1,000", ["D (04:00) has none"], "Inconclusive – fare rule not confirmed", ["Q-09"])]),
 C("HRS-09", "Location and date validation for By Hours", "Pass", "Required fields and date validation.",
   {"Pickup": "Hebbal (TRF-HR-003)", "Drop test": "Hebbal (same as pickup)"}, ["Blank pickup", "Different drop ON, drop blank", "Drop = pickup", "Past date (picker + typed); today's past slot", "Idle until default time is past (not executed)"],
   ["Required errors", "Drop = pickup per Q-21", "Past date/time blocked"],
   ["'Pickup location is required' ✔", "'Drop location is required' ✔", "Hebbal → Hebbal accepted (Q-21)", "17 Nov disabled; typed date reverted to today ✔", "39 of 48 slots disabled up to 7:00 PM; 9:00 AM disabled ✔", "Idle step not executed (same component as P2P-07 / OUT-10)"],
   "All executed validations work.", [E("HRS-09-1-validation", "Blank pickup"), E("HRS-09-2-validation", "Blank drop"), E("HRS-09-3-results", "Drop = pickup"), E("HRS-09-4b-slots", "Past slots")], "Validation", "Hebbal", "—"),
 C("HRS-10", "Passengers vs capacity and multiple vehicles", "Fail", "Capacity and multi-vehicle on By Hour.",
   {"Pickup": "Jayanagar 4th Block (TRF-HR-004)", "Date / hours": "7 Dec 2026 9:00 AM, 6 h", "Passengers": "25, then 60", "Vehicles": "VEH-012 P25AC, VEH-016 L45V"},
   ["25 → P25AC → Confirm", "60 → L45V → popup → add P25AC"], ["25 accepted", "60 accepted (no By Hour maximum)", "Both vehicles held"],
   ["25 on 25-seater: Confirm ₹14,000 ✔", "60 accepted in the field (no max) ✔", "L45V: 'cover only 45 seats' ✔; adding P25AC: 'cover only 25 seats' – replaced ✘"],
   "Multi-vehicle defect (HRS-10-Issue-01).", [E("HRS-10-pax25-confirm-cost", "25 pax"), E("HRS-10-pax60-L45V-confirm", "45 seats"), E("HRS-10-pax60-plus-P25AC-confirm", "Replaced: 25")], "Capacity", "25 / 60 pax", "P25AC, L45V"),
 C("HRS-11", "Mode switching and Modify Inquiry: values kept, hours change", "Pass", "Persistence across tabs and Modify.",
   {"Route": "Sarjapur Road → Coorg (Madikeri) (TRF-HR-018), different drop ON", "Date / hours": "9 Dec 2026 7:00 AM, 10 h → 12 h", "Passengers": "8", "Vehicle": "VEH-002 MPV's (D MPV, 7 seats)"},
   ["Fill; switch to P2P and back; to Local and back", "Book Now!", "Modify Inquiry: check pre-fill; hours 10 → 12; Save", "Breakup and Confirm"],
   ["No By Hour value leaks into P2P or Local", "Modify keeps every value; 12-hour result re-priced"],
   ["By Hour values kept after both switches; P2P and Local forms untouched ✔", "Results: Duration 10 Hours ✔", "Modify Leg 1 pre-fill correct ✔; after Save: Duration 12 Hours ✔", "Breakup ₹12,500 (unchanged – HRS-04-Issue-01)", "Confirm: capacity popup (8 passengers on a 7-seat MPV – workbook data)"],
   "Persistence works; price independent of hours (Q-15).", [E("HRS-11-after-switch", "After switching"), E("HRS-11-modify-prefill", "Modify pre-fill"), E("HRS-11-modified-results", "12 Hours"), E("HRS-11-modified-fare-breakup", "Breakup ₹12,500")],
   "Persistence", "Sarjapur → Coorg", "D MPV"),
 C("HRS-12", "Local vs Transfer By Hours with identical inputs", "Inconclusive", "Pricing differentiation between Local and By Hour.",
   {"Inputs": "Whitefield, drop OFF, 8 Dec 2026 9:00 AM, 8 hours, 10 passengers", "Vehicle": "VEH-013 16 Seater Premium Urbania (P16UB)"},
   ["Local: search, breakup, Confirm", "By Hour: same"], ["Both recorded side by side; model per Q-15"],
   ["Local: 'Local - 8 HR / 80 KM'; Base (8Hr/80Km) ₹7,500, Extra Km ₹40/km, Extra Hour ₹800/hr, Day Bata ₹800 → Confirm ₹8,300 (matches the Local run baseline)",
    "By Hour: 'Transfer - > 30 KM'; Base (Outside City) ₹12,500, Late Allowance ₹800 → Confirm ₹12,500"],
   "Products are priced differently (₹8,300 vs ₹12,500); which model By Hour must use is Q-15.", [E("HRS-12-local-fare-breakup", "Local breakup"), E("HRS-12-local-confirm-cost", "Local ₹8,300"), E("HRS-12-byhour-fare-breakup", "By Hour breakup"), E("HRS-12-byhour-confirm-cost", "By Hour ₹12,500")],
   "Local vs By Hour", "Whitefield 8 h", "P16UB",
   [F("16 Seater Premium Urbania (P16UB)", [["Local Base (8Hr/80Km)", "₹7,500", "Local"], ["Local Day Bata", "₹800", "Local"], ["By Hour Base (Outside City)", "₹12,500", "By Hour"]], [["Local", "₹8,300"], ["By Hour", "₹12,500"]], "Local 7,500 + 800 = 8,300 ✔; By Hour 12,500 ✔", ["Same inputs, different products"], "Inconclusive – fare rule not confirmed", ["Q-15"])]),
 C("HRS-13", "Multi-day By Hour with Different Drop: dates, time, drop and summary", "Fail", "Combined multi-day + different drop path (no submission).",
   {"Pickup / drop": "Indiranagar → Mysuru (TRF-HR-009)", "Dates": "12, 13, 14 Dec 2026 (today forced in)", "Time / hours": "7:00 AM requested, 8 h", "Passengers": "18", "Vehicle": "VEH-004 21 Seater Premium AC Coach (P21AC)"},
   ["Multi-day + drop ON; select dates; time; Book Now!", "Breakup; Confirm (no submit)", "Modify: remove 13 Dec; Save", "Modify: Different drop OFF; Save; then Multi-day OFF; Save"],
   ["Same dates, time, hours, pickup, drop on form, summary and Confirm", "Drop day shown clearly (Q-33)", "Date removal and toggles update everything"],
   ["Dates '18 Nov, 2026 | 12,13,14 Dec, 2026' – today forced in ✘", "07:00 not selectable (today's past slot) → pickup time stayed 7:19 PM ✘", "Summary and Confirm: drop Mysuru, 8 Hours, 18 Pax ✔; which day the drop applies to is not shown (Q-33)",
    "Confirm: Base ₹56,000 (4 × ₹14,000) + Late Allowance ₹27,000 (27 days) = ₹83,000 ✘", "Remove 13 Dec → '18 Nov | 12,14 Dec' ✔", "Drop OFF → drop = Indiranagar ✔", "Multi-day OFF → '18 Nov, 2026' (today) ✘"],
   "The combined path reproduces the multi-day defects and resets to today when Multi-day is turned off.", [E("HRS-13-main-results", "Summary"), E("HRS-13-main-fare-breakup", "Breakup"), E("HRS-13-main-confirm-cost", "Confirm ₹83,000"), E("HRS-13-two-dates-results", "After removing 13 Dec"), E("HRS-13-dd-off-results", "Drop OFF"), E("HRS-13-md-off-results", "Multi-day OFF → today")],
   "Multi-day + drop", "Indiranagar → Mysuru", "P21AC",
   [F("21 Seater Premium AC Coach (P21AC)", TB("₹14,000 per date", "₹1,000"), [["Vehicle Base Cost", "₹56,000"], ["Late Allowance Cost", "₹27,000"], ["Estimated Grand Total", "₹83,000"]], "14,000 × 4 = 56,000; 1,000 × 27 days = 27,000", ["Late Allowance per calendar day of the span"], "Fail", ["Q-17", "Q-33"])]),
 C("HRS-14", "By Hour pickup-location scope beyond Karnataka and interstate drop", "Fail", "Compare By Hour location scope with Point To Point.",
   {"Runs": ["A Whitefield, drop OFF", "B Mysuru pickup, drop OFF", "C Chennai pickup, drop OFF", "D Koramangala → Chennai (drop ON)"], "Date / hours": "10 Dec 2026 9:00 AM, 6 h, 5 passengers"},
   ["Run A–D", "Compare with P2P-11 (Transfer P2P accepts Chennai and Kochi)"], ["Same scope as P2P including Chennai", "Interstate drop accepted"],
   ["A Whitefield ✔ results", "B Mysuru ✔ results", "C Chennai pickup: 'Pickup location is required' although selected ✘", "D Chennai drop: 'Drop location is required' although selected ✘"],
   "By Hour does not accept out-of-state places that P2P accepts, and the messages are misleading (HRS-06-Issue-01).", [E("HRS-14-A-results", "A"), E("HRS-14-B-results", "B Mysuru"), E("HRS-14-C-validation", "C Chennai pickup"), E("HRS-14-D-validation", "D Chennai drop")],
   "Location scope", "Bengaluru / Karnataka / outside", "—"),
]

byCase = {}
for i in issues:
    byCase.setdefault(i["case"], []).append(i["id"])
    for a in i.get("alsoIn", []): byCase.setdefault(a, []).append(i["id"])
for c in cases: c["issues"] = byCase.get(c["id"], [])
fareSummary = [
 ["HRS-02", "P40AC", "Whitefield, 4 h", "₹20,000 (> 30 km)", "₹20,000 = popup", "Inconclusive"],
 ["HRS-04", "P28AC", "1–24 h", "₹15,000 flat", "₹15,000 (24 h: +₹2,000)", "Inconclusive"],
 ["HRS-05", "L12AC", "No / short / long drop", "₹10,500 / ₹12,500", "= band", "Inconclusive"],
 ["HRS-06", "L49NV", "Hyderabad 4 h / 24 h", "₹35,000", "₹35,000 / ₹38,500", "Inconclusive"],
 ["HRS-07", "D40NA", "4 dates (incl. forced today)", "₹18,000 per date", "₹72,000 + Late ₹14,000", "Fail"],
 ["HRS-08", "D35NA", "4 start times", "₹16,500 + Late ₹1,000", "₹16,500–₹18,500", "Inconclusive"],
 ["HRS-12", "P16UB", "Local vs By Hour 8 h", "₹7,500 pkg vs ₹12,500 band", "₹8,300 vs ₹12,500", "Inconclusive"],
 ["HRS-13", "P21AC", "4 dates + drop", "₹14,000 per date", "₹56,000 + Late ₹27,000", "Fail"],
]
pnrs = [dict(pnr="ORZS120376", case="HRS-02", route="Whitefield (By Hour, drop OFF → drop = Whitefield)", dates="25 Nov 2026 (pickup 10:00 AM, 4 hours)", vehicle="40 Seater Premium AC Coach", pax=40, estimate="₹20,000", status="New quotation (validity 25/11/26)", notes="By Hour main path; stored as 'Transfer' without hours; timings 00:00")]
counts = {}
for c in cases: counts[c["status"]] = counts.get(c["status"], 0) + 1
meta = dict(environment=ENV,
  subtitle=f"Run {RUN} · 18 Nov 2026 · 14 Transfer By Hours use cases (USER-HRS-TC-01…14, workbook v3.2) · 1 inquiry submitted (HRS-02)",
  table={"Run ID": RUN, "Environment": ENV, "Scope": "Transfer – By Hours HRS-01 … HRS-14 from User_Web_Outstation_Transfer_Use_Cases.xlsx v3.2. Point To Point and With Return: separate report user-web-20261118-1133-TRANSFER.",
         "Results": ", ".join(f"{k} {v}" for k, v in sorted(counts.items())), "Submissions": "HRS-02 → ORZS120376 (the only By Hours case whose workbook flow requires a submission; user instruction: submit wherever required)",
         "Not performed": "HRS-04 hours 3, 5–7, 9–11, 13–15, 17–22 (representative set agreed with the user); HRS-09 step 4 idle; HRS-13 Confirm after Modify (automation could not locate the card)",
         "Safety": "Network guard: payment/cancel always blocked; save-inquiry allowed only during the approved HRS-02 submit; automatic draft saves blocked"},
  highlights=["By Hour price ignores the number of hours (1 h = 24 h); priced as a Transfer distance band (Q-15).",
              "Multi-day: today is always added and cannot be removed; Late Allowance is charged per calendar day of the span (₹14,000 / ₹27,000 on daytime trips).",
              "By Hour rejects Munnar, Panaji and Chennai with 'location is required' although Point To Point accepts them.",
              "Submitted inquiry ORZS120376 is stored as 'Transfer' without the hours; timings 00:00.",
              "Second vehicle replaces the first (60 passengers).", "Hours validation: browser-only messages; blank shows a raw NaN error.",
              "Persistence (tab switching, Modify hours, remove date, drop OFF) works; Multi-day OFF resets the trip to today."])
clar = ["Q-15 By Hour pricing model: distance band vs hours; Local uses 8 Hr/80 Km packages.", "Q-16 far drop vs booked hours (Hyderabad in 4 h priced ₹35,000).",
        "Q-17 multi-day pricing: per selected date or per calendar span (Late Allowance uses the span).", "Q-09 late window: 04:00 start has no Late Allowance.",
        "Q-33 multi-day + different drop: which day the drop applies to.", "Q-11 / T-10 By Hour location scope vs Point To Point.", "Q-21 drop equal to pickup accepted.",
        "Q-30 inquiry details: By Hour type and hours are not stored/shown."]
scope = ["Executed: all 14 By Hours use cases of the v3.2 workbook; results graded per case (Pass/Fail/Partial/Inconclusive).",
         "Fare verdicts follow .claude/shared/fare-verification.md; amounts depending on unconfirmed rules are 'Inconclusive', never assumed.",
         "HRS-04 priced a representative hour set (1, 2, 4, 8, 12, 16, 23, 24) instead of all 24 values, by user decision, to limit run time on a memory-constrained machine.",
         "Environment: the machine ran low on memory; the test browser was stopped once and HRS-04 was re-run from the start.",
         "Redesigned Preprod home page (since 18 Nov ~15:20): an overlay intermittently swallows clicks on tabs and toggles; the automation uses DOM clicks and one retry. The HRS-06 Munnar/Goa rejection was confirmed independently (the P2P control accepts the same place).",
         "Workbook data note: HRS-11 uses 8 passengers on a 7-seat MPV (capacity popup expected).",
         "Evidence: screenshots mask phone numbers, e-mail and the account name. Local, Outstation and Transfer P2P/Return reports untouched."]
data = dict(meta=meta, cases=cases, issues=issues, fareSummary=fareSummary, clarifications=clar, scope=scope, pnrs=pnrs,
            pnrNotes=["PNR = Inquiry ID in Dashboard → My Inquiries ('New quotation').", "Stored without hours and with timings 00:00 (HRS-02-Issue-01) – check in Admin-Web.",
                      "Earlier Transfer PNRs (separate report): SIVM916255 (P2P), LJWN815154 (With Return)."])
os.makedirs(f"results/{RUN}", exist_ok=True)
json.dump(data, open(f"results/{RUN}/report-data.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("cases", len(cases), counts, "issues", len(issues), {t: sum(1 for i in issues if i['type'] == t) for t in ['Defect', 'Inconsistency', 'Suggestion', 'Clarification']})
