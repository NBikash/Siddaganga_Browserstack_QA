# Curated report content for the Multi-Leg execution run. Writes results/<RUN>/report-data.json for scripts/build-report-mu.mjs
# (same structure as the By Hours / Transfer report-data). Evidence paths resolve the latest re-run screenshot.
# Usage: python -X utf8 steps/exec/mu-report-data.py <RUN_ID>
import json, sys, os, glob
RUN = sys.argv[1]
SD = f"screenshots/exec-ot/{RUN}"
def S(name, first=False):
    c = sorted(glob.glob(f"{SD}/{name}.png") + glob.glob(f"{SD}/{name}-r*.png"), key=os.path.getmtime)
    if first: c = sorted(glob.glob(f"{SD}/{name}.png"))
    return (c[-1] if c else f"{SD}/{name}.png").replace("\\", "/")
E = lambda f, c, first=False: {"path": S(f, first), "caption": c}
ENV = "User App Preprod (preprod.siddagangatravels.com), Chrome via Playwright over CDP, 1440×900, Personal Login (mobile)"
PRE = ["Log in to User App Preprod (Personal Login → Mobile Number).", "Home → Smart Inquiry → Multi-Leg."]
issues = []
def I(**k): issues.append(k)
cases = []
def C(id_, title, status, objective, data, journey, expected, actual, reason, evidence, cfg, key, veh, fare=None, iss=None):
    cases.append(dict(id=id_, title=title, status=status, objective=objective, data=data, journey=journey, expected=expected, actual=actual,
                      statusReason=reason, evidence=[e for e in evidence if e], cfg=cfg, keyData=key, vehicle=veh, fare=fare or [], issues=iss or []))
def F(veh, br, app, arith, comp, verdict, clar=None):
    return dict(vehicle=veh, breakup=br, applied=app, arithmetic=arith, comparison=comp, verdict=verdict, clarify=clar or [])
INC = "Inconclusive – fare rule not confirmed"

# ------------------------------------------------------------------ issues
I(id="MLG-03-Issue-01", case="USER-MLG-TC-03", alsoIn=["USER-MLG-TC-04", "USER-MLG-TC-05", "USER-MLG-TC-12", "USER-MLG-TC-13", "USER-MLG-TC-18"], type="Defect", severity="High", category="Booking flow",
  title="Book Now! is blocked after the last tab is skipped: it validates the blank open leg form even though legs are saved",
  where="Home → Multi-Leg → Step 2 (Transfer tab) → Book Now!",
  steps=PRE + ["Total Passengers 4 → Next.", "Local: Electronic City Phase 1, 28 Nov 2026 10:00 AM, 4 hours → Save! ('Local leg added!').", "Skip Outstation → Skip Transfer (toast: 'Transfer leg skipped. Click Book Now when you are ready to continue.').", "Click Book Now!."],
  expected="Results open with the saved Local leg (the toast itself tells the user to click Book Now). Q-34 / rule M-04.",
  actual="No navigation; the blank Transfer form shows 'Pickup location is required' and 'Drop location is required'. Same on every case that saves all legs and then skips (MLG-04, 05, 12, 13, 18). The only way through is to leave the last leg filled and unsaved, or to reopen a saved leg's badge before Book Now! (which can duplicate the leg, MLG-06-Issue-01).",
  impact="The documented flow (Save! each leg → Skip → Book Now!) cannot be completed; users must discover a workaround.",
  evidence=[E("MLG-03-B-after-skip-tr", "Skip Transfer toast: click Book Now"), E("MLG-03-B-booknow-blocked", "Book Now! blocked by the blank Transfer form"), E("MLG-05-booknow-blocked", "MLG-05: same block"), E("MLG-18-booknow-blocked", "MLG-18: same block")])
I(id="MLG-03-Issue-02", case="USER-MLG-TC-03", alsoIn=["USER-MLG-TC-14", "USER-MLG-TC-04"], type="Defect", severity="Medium", category="Validation",
  title="Transfer leg drop date-time is not recalculated when the pickup time is set; Save! fails with 'Drop time must be after pickup time'",
  where="Multi-Leg → Transfer leg form",
  steps=PRE + ["Total 4 → Next → save a Local leg → Skip Outstation.", "Transfer: Electronic City Phase 1 → Mysuru, pickup 28 Nov 2026 4:00 PM; leave the drop as the app sets it.", "Save!."],
  expected="The drop date-time follows the pickup (or is optional) so a valid pickup can be saved (workbook: 'drop as the app sets it').",
  actual="The drop keeps its page-load default (same date as pickup, 11:17 AM) → 'Drop time must be after pickup time' + 'Please fill all required fields correctly'. MLG-14 Leg 2 (pickup 6:00 PM, default drop 12:40 PM) failed the same way. A blank Outstation leg also shows the message because pickup and drop default to the same minute.",
  impact="Any Transfer leg with a pickup later than ~2 h after page load needs a manual drop time.",
  evidence=[E("MLG-03-A-default-drop", "Default drop 11:17 AM vs pickup 4:00 PM → error")])
I(id="MLG-03-Issue-03", case="USER-MLG-TC-03", type="Inconsistency", severity="Low", category="Persistence",
  title="Once, a leg from a previous (blocked) attempt reappeared in a new Multi-Leg trip after a page reload (not reproduced)",
  where="Multi-Leg Step 2 after reload",
  steps=PRE + ["Save a Local leg, Skip Outstation/Transfer, Book Now! (blocked).", "Reload Home → Multi-Leg → Total 4 → Next."],
  expected="A new trip starts with no legs.",
  actual="First run: 'Leg 1 Local' from the previous attempt was listed in the new trip and Book Now! did nothing. sessionStorage held 'pendingInquiryFormData' with the old leg. A dedicated re-check (step 5b) did not reproduce it.",
  impact="Intermittent stale state; low confidence.",
  evidence=[E("MLG-03-C-booknow-blocked", "First run: old 'Leg 1 Local' badge in a new trip", first=True), E("MLG-03-B-restored-after-reload", "Re-check: clean trip")])
I(id="MLG-01-Issue-01", case="USER-MLG-TC-01", type="Inconsistency", severity="Medium", category="Validation / UX",
  title="Total Passengers: 0 and -2 are silently changed to 1 and 2.5 to 2; Step 2 opens without a message",
  where="Multi-Leg Step 1 → Total Passengers",
  steps=PRE + ["Type 0 (then -2, 2.5) in Total Passengers → Next."],
  expected="0 → 'This field is required' (workbook); invalid values rejected with a message, never changed silently (C-03).",
  actual="Field shows 1 / 1 / 2 immediately after typing; Next opens Step 2 with Passengers for Leg 1 = 1 / 1 / 2. 1000 is accepted (no maximum). Blank → 'This field is required' (correct).",
  impact="User gets a passenger count they did not enter.",
  evidence=[E("MLG-01-v0", "0 typed → Step 2 with 1 passenger"), E("MLG-01-v-2", "-2 → 1"), E("MLG-01-v2_5", "2.5 → 2"), E("MLG-01-blank", "Blank: required")])
I(id="MLG-01-Issue-02", case="USER-MLG-TC-01", alsoIn=["USER-MLG-TC-16", "USER-MLG-TC-17"], type="Clarification", severity="—", category="Persistence",
  title="The app saves a draft automatically (POST /user/draft-inquiry/save) on Next, Save! and vehicle selection",
  where="Multi-Leg Step 1/2 and results", steps=PRE + ["Enter Total Passengers → Next (network log)."],
  expected="Drafts only when Save As Draft is clicked, or documented auto-save (Q-29).",
  actual="Each Next, Save! and vehicle selection sends draft-inquiry/save (blocked by the test harness except in MLG-02/17/18). On submission the app calls draft-inquiry/delete. No UI lists drafts (MLG-17-Issue-01).",
  impact="Unknown number of server drafts per user; needs confirmation.", evidence=[])
I(id="MLG-04-Issue-01", case="USER-MLG-TC-04", type="Inconsistency", severity="Low", category="Validation",
  title="With no legs, Book Now! shows the Transfer field errors instead of 'Please add at least one trip leg before booking.'",
  where="Multi-Leg Step 2 → Skip all tabs → Book Now!",
  steps=PRE + ["Total 2 → Next → Skip Local, Skip Outstation, Skip Transfer → Book Now!."],
  expected="'Please add at least one trip leg before booking.' (rule M-03).",
  actual="'Pickup location is required' / 'Drop location is required' under the blank Transfer form; no results, no pricing call (blocking is correct, message is not).",
  impact="User is told to fill a Transfer leg they skipped.",
  evidence=[E("MLG-04-1-booknow-blocked", "No legs → Transfer field errors")])
I(id="MLG-02-Issue-01", case="USER-MLG-TC-02", type="Defect", severity="Medium", category="Data / Tracking",
  title="Multi-Leg inquiry YOIT928679 is listed in My Inquiries as type 'Local', route 'Bengaluru → Bengaluru', with only Leg 1's vehicle",
  where="Dashboard → My Inquiries",
  steps=PRE + ["Submit Local + Outstation + Transfer legs (MLG-02).", "Dashboard → My Inquiries."],
  expected="One row identifying a Multi-Leg trip (all legs, Q-38 / Q-39).",
  actual="Type 'Local', route Bengaluru → Bengaluru, vehicle '12 Seater Luxury Urbania (12)', dates 26–29 Nov, 10 pax. The Outstation (Mysuru) and Transfer (Airport) legs are not visible. The Inquiry Type filter only offers Local / Outstation / Transfer. Edit Inquiry shows Booking Type 'Dynamic' with all three journeys.",
  impact="Customer and support cannot see from the list that the inquiry has 3 legs; filter by type cannot find it.",
  evidence=[E("PNR-my-inquiries-rows", "YOIT928679 listed as Local"), E("MLG-19-edit-edit-form", "Edit Inquiry: Dynamic, three journeys")])
I(id="MLG-02-Issue-02", case="USER-MLG-TC-02", alsoIn=["USER-MLG-TC-18", "USER-MLG-TC-19"], type="Defect", severity="Medium", category="Data",
  title="Submitted Multi-Leg inquiries store timings 00:00 / 00:00 for every journey (pickup times and Local hours lost)",
  where="My Inquiries → Edit Inquiry",
  steps=PRE + ["Submit MLG-02 (Local 9:00 AM 8 h; Outstation 7:00 AM–8:00 PM; Transfer 10:00 AM).", "My Inquiries → YOIT928679 → Edit Inquiry."],
  expected="Each journey keeps its pickup / drop time; the Local journey keeps 8 hours.",
  actual="Every journey: 'Timings: Arrival: 00:00 | Departure: 00:00'; header Arrival/Departure 00:00; Local journey shows no hours. Same for ZLPS490392 (MLG-18). Recurrence of HRS-02-Issue-01.",
  impact="Operations receive inquiries without times.",
  evidence=[E("MLG-19-edit-edit-form", "YOIT928679 timings 00:00"), E("MLG-18-edit-edit-form", "ZLPS490392 timings 00:00")])
I(id="MLG-02-Issue-03", case="USER-MLG-TC-02", alsoIn=["USER-MLG-TC-05", "USER-MLG-TC-07", "USER-MLG-TC-08", "USER-MLG-TC-14"], type="Inconsistency", severity="Medium", category="Fare / UX",
  title="Confirm screen shows only a per-leg 'Estimated Grand Total'; the trip total appears only after submission",
  where="Results → Confirm Your Trip & Selected Vehicles (Leg 1/2/3 tabs)",
  steps=PRE + ["Build 3 legs, choose a vehicle on each → Confirm.", "Click Leg 1, Leg 2, Leg 3 in the pop-up."],
  expected="Estimated Trip Cost = sum of the leg estimates before Confirm & Submit (Q-37).",
  actual="Each Leg tab shows its own 'Estimated Grand Total' (₹9,300 / ₹36,000 / ₹9,000); no combined figure. The success pop-up then shows 'Estimated Cost (Approx.) ₹54,300' (= the sum).",
  impact="User confirms without seeing the total they will be quoted; the total shown on the first tab looks like the trip total.",
  evidence=[E("MLG-02-confirm-leg1", "Leg 1 tab: ₹9,300"), E("MLG-02-confirm-leg2", "Leg 2 tab: ₹36,000"), E("MLG-02-confirm-leg3", "Leg 3 tab: ₹9,000"), E("MLG-02-submit-result", "After submit: ₹54,300")])
I(id="MLG-02-Issue-04", case="USER-MLG-TC-02", alsoIn=["USER-MLG-TC-05", "USER-MLG-TC-08", "USER-MLG-TC-09", "USER-MLG-TC-13", "USER-MLG-TC-18"], type="Inconsistency", severity="Low", category="Content",
  title="Results header for Outstation legs reads 'Outstation - 0 KM' while the summary says 'Distance: 600 KM'",
  where="Results page header ('20 Buses Found | …')", steps=PRE + ["Any Outstation leg → Book Now! → leg tab."],
  expected="Header and summary show the same distance.", actual="Header 'Outstation - 0 KM'; summary 600 / 300 / 900 KM. The standalone Outstation search (MLG-08 baseline) shows the same 0 KM header.",
  impact="Contradictory distance on the same screen.", evidence=[E("MLG-02-leg2-results", "Header 0 KM vs Distance 600 KM")])
I(id="MLG-06-Issue-01", case="USER-MLG-TC-06", type="Defect", severity="High", category="Booking flow / Data",
  title="After a saved leg is edited and another deleted, Book Now! adds the remaining saved leg twice (duplicate leg priced twice)",
  where="Multi-Leg Step 2 → leg badges → Book Now!",
  steps=PRE + ["Total 6 → save Leg 1 Local (Hebbal) and Leg 2 Outstation (Hebbal → Chikkaballapur, drop Yelahanka).", "Badge 'Leg 2 Outstation' → destination Nandi Hills → Save! ('Outstation leg updated!').", "Badge 'Leg 1 Local' → hours 8 → Save! ('Local leg updated!').", "Delete Leg 1 (trash) → 'Leg 1 removed'; list shows 'Leg 1 Outstation' and its form stays open.", "Book Now!."],
  expected="Results with one leg (the edited Outstation leg).",
  actual="Results show Leg 1 and Leg 2, both Hebbal → Nandi Hills → Yelahanka, 6 Dec 2026, 300 KM: the saved leg plus the same leg from the open form.",
  impact="Inquiry would quote and book the same trip twice.",
  evidence=[E("MLG-06-after-delete", "One saved leg after delete"), E("MLG-06-results", "Results: Leg 1 and Leg 2"), E("MLG-06-leg2-duplicate", "Leg 2 = copy of Leg 1")])
I(id="MLG-05-Issue-01", case="USER-MLG-TC-05", type="Inconsistency", severity="Low", category="Persistence",
  title="Reopening a leg saved together with another in-tab leg ('Leg 2 Outstation' badge) shows the form without its destination",
  where="Multi-Leg → saved leg badge", steps=PRE + ["Outstation tab: Leg A and Leg B (+ Add Another Leg) → one Save!.", "Click badge 'Leg 2 Outstation' → Book Now!."],
  expected="Badge opens Leg 2 pre-filled (as in MLG-06).", actual="Book Now! reports 'Destination location is required' for the reopened form.",
  impact="Editing a leg saved via + Add Another Leg may lose data.", evidence=[E("MLG-05-workaround-booknow-blocked", "Badge reopened: destination required")])
I(id="MLG-07-Issue-01", case="USER-MLG-TC-07", type="Clarification", severity="—", category="Vehicle",
  title="No compare control on Multi-Leg result cards; the 3-vehicle compare limit cannot be tested",
  where="Results → vehicle cards (hover shows Book This Vehicle / View Full Vehicle Details only)", steps=PRE + ["Build legs → Book Now! → hover cards L45P, 45LBB, L45NV, L49NV."],
  expected="Compare holds at most 3 vehicles (workbook).", actual="No compare checkbox/button on any card; step not executable.", impact="Confirm whether compare is meant to exist here.", evidence=[E("MLG-07-results", "Leg 1 results: no compare control")])
I(id="MLG-07-Issue-02", case="USER-MLG-TC-07", alsoIn=["USER-MLG-TC-09"], type="Inconsistency", severity="Low", category="Vehicle / UX",
  title="Leg tab gets a ✓ even when the 'Passenger Capacity Not Complete!' pop-up says the vehicle is too small",
  where="Results → leg tab", steps=PRE + ["Leg 2 (20 pax) → Book This Vehicle on L9UB (9 seats)."],
  expected="No ✓ until the leg's passengers are covered.", actual="Pop-up 'You need seats for 20 passengers, but your selected buses cover only 9 seats' while the tab already shows 'Leg 2 ✓'.",
  impact="Misleading completion state; see MLG-09-Issue-01 for the consequence.", evidence=[E("MLG-07-leg2-L9UB-after-select", "Capacity pop-up with Leg 2 ✓")])
I(id="MLG-09-Issue-01", case="USER-MLG-TC-09", type="Defect", severity="High", category="Vehicle / Capacity",
  title="Confirm & Submit is reachable with a leg whose passengers are not covered (55 passengers on one 49-seater)",
  where="Results → Leg 1 / Leg 2 → Confirm", steps=PRE + ["Leg 1 Outstation Yelahanka → Hassan, 55 passengers; Leg 2 Transfer Rajajinagar → Hubballi, 21 passengers.", "Leg 1: Book This Vehicle D49NA → pop-up 'cover only 49 seats'; close.", "Leg 2 tab: Book This Vehicle D49NA."],
  expected="Confirm opens only when every leg's passengers are covered (C-04).",
  actual="Confirm opens; Leg 1 tab: '49 Seater Deluxe Coach – 1', Passenger 55, ₹36,000, with Confirm & Submit Booking enabled (not clicked).",
  impact="An inquiry can be submitted with insufficient seats.", evidence=[E("MLG-09-leg2-D49NA-after-select", "Leg 1: capacity pop-up (49 of 55)"), E("MLG-09-confirm-leg1", "Confirm Leg 1: 55 pax, one 49-seater")])
I(id="MLG-09-Issue-02", case="USER-MLG-TC-09", type="Defect", severity="High", category="Vehicle / Capacity",
  title="A leg cannot hold two vehicles: the second selection replaces the first (recurrence of Local TC-04-Issue-01)",
  where="Results → capacity pop-up", steps=PRE + ["Leg 1 (55 pax): Book This Vehicle 45LBB → pop-up (45 of 55) → close.", "Book This Vehicle D12TT."],
  expected="Both held, 57 seats (C-04).", actual="Pop-up 'your selected buses cover only 12 seats' – 45LBB was dropped. The pop-up offers only 'Cancel Inquiry'; no 'add another bus' action.",
  impact="Legs above 49 passengers cannot be booked correctly.", evidence=[E("MLG-09-leg1-45LBB-after-select", "45 of 55"), E("MLG-09-leg1-D12TT-after-select", "Now 12 of 55")])
I(id="MLG-09-Issue-03", case="USER-MLG-TC-09", type="Inconsistency", severity="Medium", category="Validation",
  title="Transfer leg passenger field has max=20 but 21 and 30 are accepted and the leg is saved with 21",
  where="Multi-Leg → Transfer leg → Passengers for Leg n", steps=PRE + ["Total 30 → Transfer leg default 30; type 21, 30; Save! with 21."],
  expected="One consistent rule: either capped at 20 with a message, or no cap (T-08, Q-36).", actual="Default 30 shown; 21 and 30 kept; Save! → 'Transfer leg added!'; results 'Passengers: 21 Pax'. The input still declares max 20.",
  impact="Standalone Transfer caps at 20 (T-08) but the Multi-Leg Transfer leg does not.", evidence=[E("MLG-09-trf-21", "21 kept"), E("MLG-09-save-21", "Saved with 21")])
I(id="MLG-11-Issue-01", case="USER-MLG-TC-11", type="Defect", severity="Medium", category="Validation",
  title="No cross-leg chronology check: a leg overlapping or before the previous leg is accepted without warning",
  where="Multi-Leg Step 2 / results / Confirm", steps=PRE + ["Leg 1 Outstation Yelahanka → Hassan 19 Dec 7:00 AM → 20 Dec 8:00 PM.", "Leg 2 Transfer pickup 20 Dec 10:00 AM (A, overlaps) or 18 Dec 10:00 AM (B, before Leg 1) → Save! → Book Now!."],
  expected="Overlapping / earlier legs blocked or warned (Q-35).", actual="Both saved ('Transfer leg added!'), results and Confirm open; legs stay in saved order (B: Leg 2 dated 18 Dec after Leg 1 19–20 Dec). C (after Leg 1) behaves the same.",
  impact="Physically impossible itineraries can be submitted.", evidence=[E("MLG-11-A-confirm-leg2", "A: Leg 2 20 Dec 10:00 during Leg 1"), E("MLG-11-B-confirm-leg2", "B: Leg 2 on 18 Dec, before Leg 1")])
I(id="MLG-12-Issue-01", case="USER-MLG-TC-12", type="Defect", severity="Medium", category="Validation",
  title="Local leg with Multi-day ON and every date removed is saved ('Local leg added!') and priced for today, 1 hour",
  where="Multi-Leg → Local leg → Multi-day Trip", steps=PRE + ["Total 14 → Local: Marathahalli, drop Shivanasamudra Falls, Multi-day ON.", "Pick 22 and 24 Dec, then remove every chip → Save!."],
  expected="'Please select at least one date' and no leg added.", actual="'Local leg added!'; results: Dates 19 Nov 2026 (today), Duration 1 Hour.",
  impact="Leg saved with dates the user removed.", evidence=[E("MLG-12-zero-dates", "No chips → 'Local leg added!'"), E("MLG-12-workaround-results", "Results: 19 Nov, 1 Hour")])
I(id="MLG-12-Issue-02", case="USER-MLG-TC-12", type="Inconsistency", severity="Medium", category="Input",
  title="Multi-day ON forces today in as a date; with other dates chosen it stays, the leg is priced as 3 days and the pickup time falls back to 'now'",
  where="Multi-Leg → Local leg → Multi-day calendar", steps=PRE + ["Multi-day ON (chip 'Nov 19, 2026' appears).", "Pick 22 and 24 Dec, remove the Nov 19 chip, set 8:00 AM, 24 hours → Book Now!."],
  expected="Only chosen dates; today not forced in (Local TC-06-Issue-04).", actual="Chips Nov 19 + Dec 22 + Dec 24 remain; 8:00 AM disabled (today already past) so time stays 10:32 AM; results 'Dates: 19 Nov | 22,24 Dec, Duration: 3 Days', 24 HR.",
  impact="Extra day charged; recurrence of the Local issue.", evidence=[E("MLG-12-chips", "Today forced in"), E("MLG-12-md-24h-results", "3 Days incl. today")])
I(id="MLG-12-Issue-03", case="USER-MLG-TC-12", type="Inconsistency", severity="Low", category="Validation / UX",
  title="Number of Hours 0 or 25 blocks Save! without any in-app message (recurrence of HRS-03-Issue-02)",
  where="Multi-Leg → Local leg → Number of Hours", steps=PRE + ["Local leg: hours 0 (then 25) → Save!."],
  expected="'Minimum 1 hour is required' / 'Maximum 24 hours allowed'.", actual="Nothing added, no message (only the browser's native min/max). 1 and 24 accepted.",
  impact="User does not know why Save! does nothing.", evidence=[E("MLG-12-h0", "Hours 0: no message"), E("MLG-12-h25", "Hours 25: no message")])
I(id="MLG-10-Issue-01", case="USER-MLG-TC-10", type="Inconsistency", severity="Low", category="Validation / UX",
  title="Out-of-Karnataka drop (Kochi) stays as text in the Local leg field after the restriction message; Save! then says 'Drop location is required'",
  where="Multi-Leg → Local leg → Drop at different location", steps=PRE + ["Local leg: Whitefield, drop ON → pick 'Kochi'."],
  expected="Field cleared (as for the Chennai pickup) together with the Karnataka message.", actual="Message 'The selected location is outside Karnataka…' shown; field keeps 'Kochi, Keralam, India'; Save! → 'Drop location is required'.",
  impact="Confusing state; correct outcome (rejected).", evidence=[E("MLG-10-B-kochi-on-select", "Kochi kept after the message"), E("MLG-10-B-kochi", "Save!: drop required")])
I(id="MLG-10-Issue-02", case="USER-MLG-TC-10", alsoIn=["USER-MLG-TC-12"], type="Clarification", severity="—", category="Fare",
  title="Local legs with a far drop (Mysore Palace, Shivanasamudra Falls) are priced as the 80 KM local package",
  where="Results → Local leg", steps=PRE + ["Local leg Whitefield → drop Mysore Palace, 4 hours → Book Now!."],
  expected="Distance-based pricing or a rule for out-of-city drops (C-14).", actual="'Local - 4 HR / 80 KM', Distance 80 KM for a ~150 km one-way trip.",
  impact="Rule unclear; fare verdict Inconclusive.", evidence=[E("MLG-10-results", "Whitefield → Mysore Palace: 80 KM")])
I(id="MLG-15-Issue-01", case="USER-MLG-TC-15", type="Defect", severity="Medium", category="Persistence",
  title="Refreshing the Multi-Leg results page loses the search and lands on Home (recurrence of C-10)",
  where="Results (/send-inquiry) → browser refresh", steps=PRE + ["Build Local + Transfer legs → Book Now! → choose Leg 1 vehicle → Modify both legs.", "Press F5."],
  expected="Legs, selections and modifications survive or a clear message is shown.", actual="Page shows Home with Local tab; legs, vehicle selection and modifications are gone.",
  impact="User must rebuild every leg.", evidence=[E("MLG-15-after-refresh-results", "After refresh: Home page")])
I(id="MLG-15-Issue-02", case="USER-MLG-TC-15", type="Inconsistency", severity="Low", category="UI",
  title="'Modify Leg 1' pop-up shows '+ Add Another Leg'; no 'Leg updated' confirmation after Save!",
  where="Results → Modify Inquiry → Modify Leg n", steps=PRE + ["Results → Modify Inquiry on Leg 1."],
  expected="Only that leg's form and Save! ('Leg updated successfully!').", actual="Buttons '+ Add Another Leg' and 'Save!'; after Save! the results re-price (10 HR) but no toast was captured.",
  impact="Adding a leg from a single-leg modify pop-up is unclear.", evidence=[E("MLG-15-leg1-modify-prefill", "Modify Leg 1 pop-up")])
I(id="MLG-17-Issue-01", case="USER-MLG-TC-17", type="Defect", severity="Medium", category="Persistence",
  title="A saved Multi-Leg draft cannot be found or reopened anywhere in the UI",
  where="Dashboard (Booking, Invoices, Support, My Inquiries, My Trips, Saved Routes), Home → Multi-Leg", steps=PRE + ["Total 8 → save Local + Transfer legs → Save As Draft ('Draft saved successfully!').", "Look for the draft in the Dashboard and reopen Multi-Leg."],
  expected="Draft listed and reloadable with every leg (Q-29).", actual="No Drafts entry; Saved Routes 'No saved routes found'; My Inquiries has no draft row; Multi-Leg reopens at Step 1.",
  impact="Save As Draft has no visible use for the customer.", evidence=[E("MLG-17-after-draft", "Draft saved"), E("MLG-17-saved-routes", "Saved Routes empty"), E("MLG-17-multileg-reopen", "Multi-Leg reopens empty")])
I(id="MLG-19-Issue-01", case="USER-MLG-TC-19", type="Clarification", severity="—", category="Persistence",
  title="Edit Inquiry shows journey locations and hours as read-only text; the planned per-leg edits cannot be made",
  where="My Inquiries → YOIT928679 → Edit Inquiry", steps=PRE + ["My Inquiries → YOIT928679 → ⋮ → Edit Inquiry."],
  expected="Leg 3 drop and Leg 1 hours editable (workbook).", actual="Editable: Booking Type, combinations, trip month, start/end date, arrival/departure time, duration, passengers, vehicles per journey. Locations and Local hours are display-only. Nothing was saved (PNR left unchanged for Admin-Web).",
  impact="Confirm whether customers should edit legs after submission (Q-32).", evidence=[E("MLG-19-edit-edit-form", "Edit Inquiry YOIT928679")])

# ------------------------------------------------------------------ cases
C("USER-MLG-TC-01", "Step 1 (Total Passengers): inventory, validation and move to Step 2", "Fail",
  "Step 1 controls, invalid totals, Step 2 layout and the Trip Leg trash.",
  {"Total Passengers": "blank, 0, -2, 2.5, 1000, 12"},
  ["Open Multi-Leg; record controls.", "Next with blank.", "0, -2, 2.5, 1000 in turn (fresh form each) → Next.", "12 → Next; record Step 2.", "Trip Leg trash."],
  ["Step 1: Total Passengers, Save As Draft, Next.", "Blank → 'This field is required'.", "0 → required; -2/2.5 handled with a message.", "12 → Step 2 on Local, 'Trip Leg #1', Leg 1 passengers 12.", "Trash → Step 1, 12 kept."],
  ["Step 1 shows exactly Total Passengers (min 1), Save As Draft, Next and the map.", "Blank → 'This field is required', no advance (Pass).", "0 → 1, -2 → 1, 2.5 → 2 silently, Step 2 opens; 1000 accepted (MLG-01-Issue-01).", "12 → Local tab active, 'Trip Leg #1', 'Leg 1', Passengers 12 (Pass).", "Trash → Step 1 with 12 kept (Pass).", "Next sends an automatic draft save (MLG-01-Issue-02)."],
  "Silent value changes contradict the expected 'required' message.",
  [E("MLG-01-step1", "Step 1"), E("MLG-01-blank", "Blank"), E("MLG-01-v0", "0 → 1"), E("MLG-01-v1000", "1000 accepted"), E("MLG-01-step2", "Step 2"), E("MLG-01-after-trash", "After trash")],
  "Step 1", "Total 12", "—", iss=["MLG-01-Issue-01", "MLG-01-Issue-02"])

FARE02 = [F("L12AC (Leg 1 Local)", [["Base Rate 8Hr/80Km", "₹8,500", "Yes"], ["Extra Km", "₹40 / km", "No (80 KM)"], ["Extra Hour", "₹800 / hr", "No (8 h)"], ["Day Bata", "Shown", "Yes"]],
             [["Vehicle Base Cost", "₹8,500"], ["Day Bata", "₹800"], ["Night Bata", "₹0"], ["Estimated Grand Total", "₹9,300"]], "8,500 + 800 + 0 = 9,300",
             ["Base matches breakup.", "Day Bata ₹800 applied (amount on breakup not captured separately)."], INC),
          F("P35AC (Leg 2 Outstation)", [["Base Rate (Minimum Kms per Day)", "₹16,500 / day", "Yes – 2 days"], ["Day Bata", "₹1,000", "Yes"], ["Night Bata", "₹1,000", "Yes (8:00 PM return)"]],
             [["Vehicle Base Cost", "₹33,000"], ["Day Bata", "₹2,000"], ["Night Bata", "₹1,000"], ["State Tax", "₹0"], ["Estimated Grand Total", "₹36,000"]], "16,500 × 2 + 1,000 × 2 + 1,000 = 36,000",
             ["Consistent with the breakup."], INC),
          F("D12TT (Leg 3 Transfer)", [["Base Rate (Outside City, > 30 km)", "₹9,000", "Yes"], ["Late Allowance", "₹800", "No (10:00 AM)"]],
             [["Vehicle Base Cost", "₹9,000"], ["Estimated Grand Total", "₹9,000"]], "9,000", ["Consistent."], INC)]
C("USER-MLG-TC-02", "End-to-end: Local + Outstation + Transfer legs, fare per leg, submission and tracking", "Fail",
  "Main path with one approved submission; PNR for Admin-Web.",
  {"Total Passengers": "10", "Leg 1 Local": "Jayanagar 4th Block, drop OFF, 26 Nov 2026 9:00 AM, 8 h – L12AC", "Leg 2 Outstation": "Whitefield → Mysuru, 27 Nov 7:00 AM → 28 Nov 8:00 PM – P35AC",
   "Leg 3 Transfer": "Whitefield → Kempegowda International Airport (BLR), 29 Nov 10:00 AM – D12TT", "Submission": "Approved (user instruction 19 Nov 2026)"},
  ["Step 1: 10 → Next.", "Local → Save!.", "Outstation → Save!.", "Transfer filled → Book Now!.", "Per leg: Fare Breakup, Book This Vehicle.", "Confirm: read Leg 1/2/3.", "Confirm & Submit Booking.", "My Inquiries + Edit Inquiry."],
  ["'<Type> leg added!' and next tab.", "Results: one tab per leg, ✓ after selection, labels Multi-leg-<Type>.", "Confirm: 'Multi-Leg (Local + Outstation + Transfer)', total = sum.", "One inquiry/PNR with all legs."],
  ["'Local leg added!' → Outstation; 'Outstation leg added!' → Transfer (Pass).", "Results: Leg 1/2/3, labels Multi-leg-Local/-Outstation/-Transfer, pricing tab per type, ✓ and 'Vehicle selected for Leg n…' (Pass).",
   "Confirm Route Summary 'Multi-Leg (Local + Outstation + Transfer)'; per-leg totals ₹9,300 / ₹36,000 / ₹9,000; no combined total (MLG-02-Issue-03).",
   "Submit: 'Inquiry Submitted Successfully! … Estimated Cost (Approx.) ₹54,300'; exactly 1 save-inquiry call, then draft-inquiry/delete.",
   "PNR YOIT928679. My Inquiries: type 'Local', Bengaluru → Bengaluru, 12 Seater Luxury Urbania only (MLG-02-Issue-01). Edit Inquiry: 'Dynamic' with all three journeys and costs, timings 00:00 (MLG-02-Issue-02).",
   "Leg 2 header 'Outstation - 0 KM' vs 600 KM (MLG-02-Issue-04)."],
  "Inquiry created with the correct total, but it is mislabelled in My Inquiries and loses its times.",
  [E("MLG-02-l1-saved", "Local leg added"), E("MLG-02-results", "Results Leg 1"), E("MLG-02-leg2-results", "Leg 2"), E("MLG-02-leg3-results", "Leg 3"),
   E("MLG-02-leg1-fare-breakup", "Leg 1 fare breakup"), E("MLG-02-leg2-fare-breakup", "Leg 2 fare breakup"), E("MLG-02-leg3-fare-breakup", "Leg 3 fare breakup"),
   E("MLG-02-confirm-leg1", "Confirm Leg 1"), E("MLG-02-confirm-leg2", "Confirm Leg 2"), E("MLG-02-confirm-leg3", "Confirm Leg 3"), E("MLG-02-submit-result", "Submitted ₹54,300"), E("PNR-my-inquiries-rows", "My Inquiries")],
  "L + O + T", "10 pax, D+7…D+10", "L12AC / P35AC / D12TT", fare=FARE02, iss=["MLG-02-Issue-01", "MLG-02-Issue-02", "MLG-02-Issue-03", "MLG-02-Issue-04"])

C("USER-MLG-TC-03", "Leg sequencing: Save!, Skip and Book Now! from each tab", "Fail",
  "Saved, skipped and unsaved legs reach results exactly once.",
  {"Total": "4", "Local": "Electronic City Phase 1, 28 Nov 10:00 AM, 4 h", "Transfer": "Electronic City Phase 1 → Mysuru, 28 Nov 4:00 PM (drop 8:00 PM set manually)", "Vehicle": "VEH-019 SUV (LSUV) – card check"},
  ["A: Local Save! → Skip Outstation → Transfer Save! → Book Now!.", "B: Local Save! → Skip Outstation → Skip Transfer → Book Now!.", "5b: reload, new trip (stale state check).", "C: Local filled, not saved → Book Now!.", "D (control): saved Local + filled Transfer → Book Now!; LSUV details."],
  ["Skip Outstation opens Transfer without a leg; Skip Transfer toast.", "Book Now! with saved legs reaches results whatever the open form.", "Unsaved filled leg included once.", "Legs in saved order."],
  ["Skip Outstation → Transfer tab, no leg (Pass); Skip Transfer → 'Transfer leg skipped. Click Book Now when you are ready to continue.' (Pass).",
   "Transfer Save! first failed: default drop 11:17 AM before 4:00 PM pickup (MLG-03-Issue-02); with drop 8:00 PM → 'Transfer leg added!', form keeps the values.",
   "A: Book Now! → results Leg 1 Local + Leg 2 (no duplicate) (Pass).", "B: Book Now! blocked – 'Pickup/Drop location is required' (MLG-03-Issue-01).",
   "C: unsaved Local included once (Leg 1 Local) (Pass). D: 2 legs (Pass).", "LSUV not on page 1; its Fare Breakup shows the Local 8 Hrs/80 Kms package ₹18,500 (seat count on card not captured).",
   "First run only: old leg reappeared in a new trip (MLG-03-Issue-03)."],
  "Book Now! after Skip is blocked – the documented flow cannot be completed.",
  [E("MLG-03-A-after-skip-out", "Skip Outstation"), E("MLG-03-A-default-drop", "Default drop error"), E("MLG-03-A-l2-saved", "Transfer leg added"), E("MLG-03-A-results", "A: results 2 legs"),
   E("MLG-03-B-after-skip-tr", "Skip Transfer toast"), E("MLG-03-B-booknow-blocked", "B blocked"), E("MLG-03-C-results", "C: unsaved leg once"), E("MLG-03-D-LSUV-fare-breakup", "LSUV breakup")],
  "L + T (O skipped)", "4 pax, D+9", "LSUV", iss=["MLG-03-Issue-01", "MLG-03-Issue-02", "MLG-03-Issue-03"])

C("USER-MLG-TC-04", "No legs and blank or unresolved leg forms: Book Now! and Save! blocked", "Fail",
  "Blocking and messages for empty / unresolved legs.",
  {"Total": "2", "Unresolved text": "'Xyzabc123' as Local pickup, Outstation destination 1, Transfer To"},
  ["Skip all three tabs → Book Now!.", "Save! with each blank form.", "Type 'Xyzabc123' without picking → Save!."],
  ["No legs → 'Please add at least one trip leg before booking.', no pricing call.", "Blank: field messages, no leg.", "Unresolved text rejected."],
  ["No legs → blocked, but with the Transfer field errors; no pricing call (MLG-04-Issue-01).",
   "Blank Local → 'Pickup location is required'; Outstation → pickup + 'Destination location is required' (+ 'Drop time must be after pickup time'); Transfer → pickup + drop required; toast 'Please fill all required fields correctly'; no leg (Pass).",
   "Unresolved text: Local 'Pickup location is required', Outstation 'Destination location is required', Transfer 'Drop location is required'; no leg (Pass)."],
  "Blocking correct; the no-legs message differs from the specification.",
  [E("MLG-04-1-booknow-blocked", "No legs"), E("MLG-04-2-Local", "Blank Local"), E("MLG-04-2-Outstation", "Blank Outstation"), E("MLG-04-2-Transfer", "Blank Transfer"), E("MLG-04-3-Outstation", "Unresolved destination")],
  "—", "2 pax", "—", iss=["MLG-04-Issue-01", "MLG-03-Issue-01"])

C("USER-MLG-TC-05", "Several legs of the same type: + Add Another Leg and Remove Leg", "Fail",
  "In-tab legs, removal, one Save! for several legs, independent pricing.",
  {"Total": "25", "Leg A": "Jayanagar 4th Block → Mysuru → Srirangapatna, 1 Dec 7:00 AM → 2 Dec 7:00 PM", "Leg B": "Sarjapur Road → Kolar, 3 Dec 8:00 AM → 9:00 PM", "Leg C": "Electronic City Phase 1 → Nandi Hills, 4 Dec (removed)", "Vehicle": "D40NA"},
  ["Skip Local; fill A, + Add Another Leg, B, + Add Another Leg, C.", "Remove C.", "Save!.", "Skip Transfer → Book Now! (blocked) → alternative: A + B unsaved → Book Now!; D40NA on both; Confirm."],
  ["Own fields per leg, passengers default 25, remove icon per leg.", "Removing C keeps A, B.", "One Save! adds both legs.", "Two Outstation legs, 'Multi-Leg (Outstation + Outstation)', independent distance/days."],
  ["Headers Leg 1–3, each with a remove icon; passengers 25/25/25 (Pass).", "Remove C → Leg 1, Leg 2, values intact (Pass).", "Save! → 'Outstation leg added!', badges 'Leg 1 Outstation', 'Leg 2 Outstation' (Pass).",
   "Skip Transfer → Book Now! blocked (MLG-03-Issue-01); badge workaround also blocked (MLG-05-Issue-01).",
   "Alternative path: Leg 1 600 KM / 2 Days, Leg 2 300 KM / 1 Day; Confirm 'Multi-Leg (Outstation + Outstation)', ₹39,000 + ₹19,000, no combined total."],
  "Saved legs cannot reach results through the documented flow.",
  [E("MLG-05-three-legs", "Three legs"), E("MLG-05-after-remove-C", "After removing C"), E("MLG-05-saved", "Both saved"), E("MLG-05-booknow-blocked", "Book Now! blocked"),
   E("MLG-05-alt-results", "Alternative path results"), E("MLG-05-alt-confirm-leg1", "Confirm Leg 1"), E("MLG-05-alt-confirm-leg2", "Confirm Leg 2")],
  "O + O", "25 pax", "D40NA", iss=["MLG-03-Issue-01", "MLG-05-Issue-01", "MLG-02-Issue-03"])

C("USER-MLG-TC-06", "Edit and delete a saved leg before Book Now!", "Fail",
  "Badge edit, delete and the results that follow.",
  {"Total": "6", "Leg 1 Local": "Hebbal, 6 h → 8 h, 5 Dec 8:00 AM", "Leg 2 Outstation": "Hebbal → Chikkaballapur → Nandi Hills, drop Yelahanka, 6 Dec 7:00 AM → 9:00 PM"},
  ["Save both legs.", "Badge Leg 2 → change destination → Save!.", "Badge Leg 1 → hours 8 → Save!.", "Delete Leg 1.", "Book Now!."],
  ["Badge opens pre-filled form; Save! updates in place.", "Delete removes only that leg.", "Results: one leg with edited values."],
  ["Leg 2 pre-filled incl. drop toggle and Yelahanka; 'Outstation leg updated!', still 2 legs (Pass).", "Leg 1 pre-filled; 'Local leg updated!' (Pass).", "Delete → 'Leg 1 removed', 'Leg 1 Outstation', 'Trip Leg #2' (Pass).",
   "Book Now! → two identical Outstation legs (MLG-06-Issue-01)."],
  "Duplicate leg on results.",
  [E("MLG-06-leg2-prefill", "Leg 2 pre-filled"), E("MLG-06-leg2-updated-saved", "Leg 2 updated"), E("MLG-06-leg1-updated-saved", "Leg 1 updated"), E("MLG-06-after-delete", "After delete"), E("MLG-06-results", "Results 2 legs"), E("MLG-06-leg2-duplicate", "Duplicate")],
  "L + O", "6 pax", "—", iss=["MLG-06-Issue-01"])

C("USER-MLG-TC-07", "Results: vehicle selection per leg, compare limit, capacity per leg and Confirm gating", "Partial",
  "Selection flow, capacity popup per leg, changing a vehicle.",
  {"Total": "20", "Leg 1 Local": "Whitefield, 8 h, 7 Dec 9:00 AM – L45V then L45P", "Leg 2 Transfer": "Hebbal → Nandi Hills, 8 Dec 10:00 AM – L9UB then P25AC", "Compare": "L45P, 45LBB, L45NV, L49NV"},
  ["Build legs → Book Now!.", "Compare 4 vehicles.", "Leg 1 L45V.", "Leg 2 L9UB → popup → P25AC → Confirm.", "Leg 1 → L45P → Confirm."],
  ["Compare max 3.", "Confirm only after both legs; popup uses leg passengers.", "Changing one leg keeps the other; totals update."],
  ["No compare control on cards – step not executable (MLG-07-Issue-01).", "L45V → 'Vehicle selected for Leg 1…', Leg 1 ✓, jump to Leg 2 (Pass).",
   "L9UB → 'You need seats for 20 passengers… only 9 seats' (Pass) while Leg 2 already shows ✓ (MLG-07-Issue-02); P25AC replaced it → Confirm: L45V ₹17,000, P25AC ₹16,000 (Pass).",
   "L45P on Leg 1 → Confirm reopens: Leg 1 ₹14,500, Leg 2 P25AC kept ₹16,000 (Pass)."],
  "Compare step not available; everything else passed.",
  [E("MLG-07-results", "Results"), E("MLG-07-leg1-after-select", "Leg 1 selected"), E("MLG-07-leg2-L9UB-after-select", "Capacity popup"), E("MLG-07-a-confirm-leg1", "Confirm L45V"), E("MLG-07-b-confirm-leg1", "Confirm L45P"), E("MLG-07-b-confirm-leg2", "Leg 2 kept")],
  "L + T", "20 pax", "L45V/L45P, L9UB/P25AC", iss=["MLG-07-Issue-01", "MLG-07-Issue-02"])

FARE08 = [F("P16UB Local – standalone vs leg", [["Base Rate 8Hr/80Km", "₹7,500", "Yes"], ["Extra Km", "₹40 / km", "No"], ["Extra Hour", "₹800 / hr", "No"], ["Day / Night Bata", "₹800 / ₹800", "Day only"]],
             [["Standalone", "₹7,500 + ₹800 = ₹8,300"], ["Multi-Leg Leg 1", "₹7,500 + ₹800 = ₹8,300"]], "7,500 + 800 = 8,300 (both)", ["Identical."], INC),
          F("P28AC Outstation – standalone vs leg", [["Base Rate (Min Kms/Day)", "₹15,600 / day", "Yes – 2 days"], ["Day Bata", "₹1,000", "Yes"], ["Night Bata", "₹1,000", "Yes"]],
             [["Standalone", "₹31,200 + 2,000 + 1,000 = ₹34,200"], ["Multi-Leg Leg 2", "₹34,200"]], "15,600 × 2 + 2,000 + 1,000 = 34,200", ["Identical; 600 KM / 2 Days both."], INC),
          F("L9UB Transfer – standalone vs leg", [["Base Rate (Outside City)", "₹17,500", "Yes"], ["Late Allowance", "₹1,000", "No (10:00 AM)"]],
             [["Standalone", "₹17,500"], ["Multi-Leg Leg 3", "₹17,500"]], "17,500", ["Identical."], INC)]
C("USER-MLG-TC-08", "Leg pricing compared with the same trip in the standalone modules", "Pass",
  "Each leg priced like its standalone module on the same day.",
  {"Total": "9", "Local": "Whitefield, 8 h, 9 Dec 9:00 AM – P16UB", "Outstation": "Whitefield → Mysuru, 10 Dec 7:00 AM → 11 Dec 8:00 PM – P28AC", "Transfer": "Whitefield → Kempegowda Airport, 12 Dec 10:00 AM – L9UB"},
  ["Standalone Local, Outstation, Transfer P2P searches → breakup + Confirm (not submitted).", "Same three legs in Multi-Leg → breakup + Confirm.", "Compare."],
  ["Same amounts and bands per leg.", "Verdict Inconclusive until Q-37."],
  ["Local ₹8,300 = ₹8,300; Outstation ₹34,200 = ₹34,200 (600 KM / 2 Days); Transfer ₹17,500 = ₹17,500 (> 30 KM band).", "Sum of legs ₹60,000; Confirm shows no combined total (MLG-02-Issue-03).",
   "Standalone Transfer Confirm failed once (card CTA not found); passed on re-run."],
  "All three legs priced exactly like standalone. Fare verdict Inconclusive (rule not confirmed).",
  [E("MLG-08-sa-local-fare-breakup", "Standalone Local breakup"), E("MLG-08-leg1-fare-breakup", "Leg 1 breakup"), E("MLG-08-sa-out-confirm-cost", "Standalone Outstation applied"), E("MLG-08-confirm-leg2", "Leg 2 applied"),
   E("MLG-08-sa-trf-fare-breakup", "Standalone Transfer breakup"), E("MLG-08-confirm-leg3", "Leg 3 applied")],
  "L + O + T vs standalone", "9 pax", "P16UB / P28AC / L9UB", fare=FARE08, iss=["MLG-02-Issue-03"])

C("USER-MLG-TC-09", "Total vs per-leg passengers, Transfer leg limit and a multi-vehicle leg", "Fail",
  "Per-leg passengers, the Transfer 20 limit and two vehicles on one leg.",
  {"Total": "30 → 18", "Leg 1 Outstation": "Yelahanka → Hassan, 13 Dec 7:00 AM → 14 Dec 8:00 PM, 55 pax – 45LBB + D12TT", "Leg 2 Transfer": "Rajajinagar → Hubballi, 15 Dec 8:00 AM, 21 pax – D49NA"},
  ["Total 30; read defaults.", "Outstation 55 → Save!; Transfer 21/30 → Save!.", "Trash → total 18 → Next.", "Book Now!; Leg 1 45LBB then D12TT; Leg 2 D49NA; Confirm."],
  ["Leg passengers default to total, editable.", "Transfer 20 vs 1000 – record.", "Two vehicles held for 55.", "Total change handled consistently."],
  ["Defaults 30 on all tabs (Pass); Transfer input max=20.", "Outstation 55 saved; Transfer 21 and 30 accepted, saved with 21 (MLG-09-Issue-03).", "Total 30 → 18: legs keep 55 and 21 (recorded; consistent).",
   "45LBB → popup 45 of 55; D12TT → popup 12 of 55: first vehicle dropped (MLG-09-Issue-02).", "Leg 2 D49NA → Confirm opens with Leg 1 on one 49-seater for 55 pax (MLG-09-Issue-01)."],
  "Capacity rules broken on Multi-Leg.",
  [E("MLG-09-trf-21", "Transfer 21"), E("MLG-09-save-21", "Saved with 21"), E("MLG-09-after-total-18", "Total 18"), E("MLG-09-leg1-45LBB-after-select", "45 of 55"), E("MLG-09-leg1-D12TT-after-select", "12 of 55"), E("MLG-09-confirm-leg1", "Confirm 55 on 49 seats")],
  "O + T", "30/55/21 pax", "45LBB, D12TT, D49NA", iss=["MLG-09-Issue-01", "MLG-09-Issue-02", "MLG-09-Issue-03", "MLG-07-Issue-02"])

C("USER-MLG-TC-10", "Location scope per leg type", "Pass",
  "Local leg Karnataka-only; Outstation and Transfer legs anywhere.",
  {"Total": "5", "Local": "A Chennai; B Whitefield → Kochi; C Whitefield → Mysore Palace (16 Dec 9:00 AM, 4 h)", "Outstation": "Domlur → Hyderabad, 17–19 Dec", "Transfer": "Malleshwaram → Chennai, 20 Dec 8:00 AM"},
  ["Local A, B, C → Save! each.", "Outstation, Transfer → Save!.", "Book Now!."],
  ["A, B rejected with the Karnataka message; C accepted.", "Hyderabad and Chennai accepted."],
  ["A: message 'The selected location is outside Karnataka…', pickup cleared; Save! → 'Pickup location is required' (Pass).", "B: same message; Kochi text stays; Save! → 'Drop location is required' (MLG-10-Issue-01).",
   "C: 'Local leg added!' (Pass).", "Outstation Hyderabad and Transfer Chennai added; results 3 legs (Pass).", "Local leg to Mysore Palace priced as 80 KM (MLG-10-Issue-02)."],
  "Scope rules work as specified.",
  [E("MLG-10-A-chennai-on-select", "Chennai rejected"), E("MLG-10-B-kochi-on-select", "Kochi message"), E("MLG-10-C-mysuru-palace-saved", "Mysore Palace accepted"), E("MLG-10-trf-che-saved", "Transfer Chennai"), E("MLG-10-results", "Results")],
  "L + O + T", "5 pax", "—", iss=["MLG-10-Issue-01", "MLG-10-Issue-02"])

C("USER-MLG-TC-11", "Date-time rules per leg and chronology across legs", "Fail",
  "Per-leg date rules and overlap / earlier / later legs.",
  {"Total": "8", "Leg 1 Outstation": "Yelahanka → Hassan, 19 Dec 7:00 AM → 20 Dec 8:00 PM", "Leg 2 Transfer": "A 20 Dec 10:00 AM; B 18 Dec 10:00 AM; C 21 Dec 8:00 AM", "Per-leg": "Outstation drop 18 Dec; Transfer drop 8:00 AM < 10:00 AM; Local yesterday"},
  ["Per-leg invalid dates → Save!.", "A, B, C each: build fresh → Book Now! → D12TT both legs → Confirm."],
  ["Per-leg date messages.", "Overlap/earlier blocked or warned."],
  ["Outstation drop before pickup: date disabled; 'Drop date cannot be before pickup date' (Pass).", "Transfer drop time before pickup: option disabled (Pass).", "Local yesterday: disabled; typed value ignored (Pass).",
   "A (overlap) and B (earlier) accepted, Confirm opens; legs in saved order (MLG-11-Issue-01). C accepted (Pass)."],
  "No cross-leg chronology check.",
  [E("MLG-11-1a", "Drop before pickup"), E("MLG-11-1b", "Transfer drop time"), E("MLG-11-1c", "Local yesterday"), E("MLG-11-A-confirm-leg2", "A overlap"), E("MLG-11-B-confirm-leg2", "B earlier"), E("MLG-11-C-confirm-leg2", "C later")],
  "O + T", "8 pax", "D12TT", iss=["MLG-11-Issue-01"])

C("USER-MLG-TC-12", "Local leg: hours boundaries, multi-day dates and different drop", "Fail",
  "Hours 0/1/24/25, multi-day chips and zero dates.",
  {"Total": "14", "Local": "Marathahalli → drop Shivanasamudra Falls, 22 Dec 8:00 AM", "Hours": "0, 25, 1, 24", "Multi-day": "22 and 24 Dec"},
  ["Hours 0, 25 → Save!; 1 → Save!.", "Multi-day ON → pick 22 / 24 Dec → remove all → Save!.", "Pick again, remove today, 24 h → Book Now!."],
  ["0/25 messages; 1/24 accepted.", "Zero dates blocked; today not forced.", "Results show dates, days, hours, drop."],
  ["0 and 25: nothing added, no message (MLG-12-Issue-03); 1 → 'Local leg added!'; 24 accepted (Pass).", "Today forced in as a chip (MLG-12-Issue-02).", "Zero dates → 'Local leg added!', priced 19 Nov, 1 Hour (MLG-12-Issue-01).",
   "24 h + 22/24 Dec: today chip stays → 'Dates: 19 Nov | 22,24 Dec, 3 Days', 24 HR, drop Shivanasamudra Falls (MLG-12-Issue-02).", "Book Now! after Skip blocked (MLG-03-Issue-01)."],
  "Zero-date leg accepted; today forced into multi-day.",
  [E("MLG-12-h0", "Hours 0"), E("MLG-12-h25", "Hours 25"), E("MLG-12-h1-saved", "Hours 1 accepted"), E("MLG-12-chips", "Chips with today"), E("MLG-12-zero-dates", "Zero dates saved"), E("MLG-12-md-24h-results", "3 Days, 24 HR")],
  "L", "14 pax", "—", iss=["MLG-12-Issue-01", "MLG-12-Issue-02", "MLG-12-Issue-03", "MLG-03-Issue-01", "MLG-10-Issue-02"])

FARE13 = [F("P40AC (Outstation leg)", [["Base Rate (Min Kms/Day)", "₹18,000 / day", "Yes – 2 days"], ["Day Bata", "₹1,000", "Yes"], ["Night Bata", "₹1,000", "Yes"]],
            [["Vehicle Base Cost", "₹36,000"], ["Day Bata", "₹2,000"], ["Night Bata", "₹1,000"], ["Estimated Grand Total", "₹39,000"]], "18,000 × 2 + 2,000 + 1,000 = 39,000", ["Consistent; 600 KM / 2 Days."], INC)]
C("USER-MLG-TC-13", "Outstation leg: several destinations, different drop and map", "Pass",
  "Destination order and removal inside a leg; summary and fare.",
  {"Total": "40", "Leg": "Electronic City → Nandi Hills → Chikkaballapur → Kolar; drop Whitefield; 25 Dec 7:00 AM → 26 Dec 8:00 PM", "Vehicle": "P40AC"},
  ["Fill 3 destinations, drop ON.", "Remove destination 2; add Chikkaballapur at the end.", "Save! → Skip Transfer → Book Now! (workaround) → P40AC breakup → Confirm."],
  ["Order kept; removal updates route.", "Summary pickup, destinations in order, drop Whitefield."],
  ["Order kept; after removal: Nandi Hills, Kolar; Chikkaballapur added as 3 (Pass).", "Route Electronic City → Nandi Hills → Kolar → Chikkaballapur → Whitefield, 600 KM, 2 Days (Pass).", "Single leg: Route Summary 'Outstation', ₹39,000 (Pass).", "Book Now! needed the badge workaround (MLG-03-Issue-01)."],
  "Leg-level behaviour correct.",
  [E("MLG-13-1-form", "Three destinations"), E("MLG-13-2-after-remove", "After removal"), E("MLG-13-workaround-results", "Results route"), E("MLG-13-fare-breakup", "Breakup"), E("MLG-13-confirm-leg1", "Confirm")],
  "O", "40 pax", "P40AC", fare=FARE13, iss=["MLG-03-Issue-01", "MLG-02-Issue-04"])

FARE14 = [F("D SDN (both legs)", [["Base Rate (Outside City)", "₹8,000", "Yes"], ["Late Allowance", "₹500", "No (9 AM / 6 PM)"]],
            [["Leg 1", "₹8,000"], ["Leg 2", "₹8,000"]], "8,000 + 8,000 = 16,000 (no combined figure shown)", ["Same pattern as With Return RET-06 (Multi-Leg (Transfer + Transfer), per-leg band); RET-06 used D12TT (₹9,000/leg) so amounts are not directly comparable."], INC)]
C("USER-MLG-TC-14", "Transfer leg: Point To Point only; round trip as two Transfer legs", "Pass",
  "Transfer options and a round trip built from two legs.",
  {"Total": "3", "Leg 1": "Jayanagar 4th Block → Chikkaballapur, 27 Dec 9:00 AM", "Leg 2": "Chikkaballapur → Jayanagar 4th Block, 27 Dec 6:00 PM (drop 9:00 PM set manually)", "Vehicle": "D SDN"},
  ["Record Transfer options.", "Leg 1, + Add Another Leg, Leg 2 → Save! → Book Now!.", "Sedan on both; breakup; Confirm.", "Compare with RET-06."],
  ["Point To Point only.", "Each leg at its own band; total = sum."],
  ["Only 'Point To Point Transfer' (radio) (Pass).", "First attempt: Leg 2 default drop 12:40 PM before 6:00 PM → not saved (MLG-03-Issue-02).", "With drop set: 'Transfer leg added!', 2 legs; each > 30 KM band ₹8,000; Confirm 'Multi-Leg (Transfer + Transfer)' (Pass)."],
  "Behaves like With Return.",
  [E("MLG-14-transfer-tab", "Transfer options"), E("MLG-14-two-legs", "Two legs"), E("MLG-14-leg1-fare-breakup", "Leg 1 breakup"), E("MLG-14-confirm-leg1", "Confirm Leg 1"), E("MLG-14-confirm-leg2", "Confirm Leg 2")],
  "T + T", "3 pax", "D SDN", fare=FARE14, iss=["MLG-03-Issue-02", "MLG-02-Issue-03"])

C("USER-MLG-TC-15", "Modify Leg on the results page", "Fail",
  "Per-leg modify, re-pricing, other legs unchanged, refresh.",
  {"Total": "20", "Leg 1 Local": "Whitefield, 8 h → 10 h, 7 Dec 9:00 AM", "Leg 2 Transfer": "Hebbal → Nandi Hills → Chikkaballapur, 8 Dec 10:00 AM", "Vehicle": "P40AC (Leg 1)"},
  ["Book Now! → P40AC on Leg 1.", "Leg 1 → Modify Inquiry → hours 10 → Save!.", "Leg 2 → Modify → To Chikkaballapur → Save!.", "Refresh."],
  ["'Modify Leg n' pre-filled, only that leg; 'Leg updated successfully!'.", "Only that leg re-priced; others unchanged.", "Refresh: legs survive (C-10)."],
  ["'Modify Leg 1' pre-filled (Whitefield, 7 Dec 9:00 AM, 20, 8 h); buttons '+ Add Another Leg', 'Save!' (MLG-15-Issue-02).", "Save! → 'Local - 10 HR / 80 KM', Leg 1 ✓ kept (Pass).",
   "'Modify Leg 2' pre-filled; To → Chikkaballapur; Leg 2 re-searched (> 30 KM band unchanged), Leg 1 unchanged ✓ (Pass).", "Refresh → Home page, all legs lost (MLG-15-Issue-01)."],
  "Modify works; refresh loses the search.",
  [E("MLG-15-leg1-modify-prefill", "Modify Leg 1"), E("MLG-15-leg1-after-results", "Leg 1 10 HR"), E("MLG-15-leg2-modify-prefill", "Modify Leg 2"), E("MLG-15-leg2-after-results", "Leg 2 Chikkaballapur"), E("MLG-15-after-refresh-results", "After refresh")],
  "L + T", "20 pax", "P40AC", iss=["MLG-15-Issue-01", "MLG-15-Issue-02"])

C("USER-MLG-TC-16", "Switching Smart Inquiry tabs: Multi-Leg state isolation", "Pass",
  "No leakage between Multi-Leg and the standalone forms.",
  {"Total": "6", "Saved Local leg": "Yelahanka, 3 h, 29 Dec 10:00 AM", "Standalone Local": "HSR Layout (no search)"},
  ["Save Local leg → standalone Local tab.", "Enter HSR Layout → back to Multi-Leg.", "Transfer → By Hour → back; network log."],
  ["No values leak; Multi-Leg kept or reset consistently; no draft from switching."],
  ["Standalone Local blank (passengers 1, hours 1) (Pass).", "Back: 'Leg 1 Local' kept, Outstation tab open, HSR not present (Pass).", "After By Hour: same state (Pass).", "Draft calls only from Next / Save! (MLG-01-Issue-02), none from switching."],
  "Isolated.",
  [E("MLG-16-standalone-local", "Standalone Local"), E("MLG-16-back-to-multi", "Back to Multi-Leg"), E("MLG-16-after-byhour", "After By Hour")],
  "L", "6 pax", "—", iss=["MLG-01-Issue-02"])

C("USER-MLG-TC-17", "Save As Draft for a Multi-Leg inquiry, reload and cleanup", "Partial",
  "One draft with both legs; reload; cleanup after submission.",
  {"Total": "8", "Leg 1 Local": "HSR Layout, 5 h, 31 Dec 9:00 AM", "Leg 2 Transfer": "HSR Layout → Coorg (Madikeri), 1 Jan 2027 7:00 AM", "Approval": "One draft (user instruction 19 Nov 2026)"},
  ["Step 1: Save As Draft visible (not clicked).", "Save both legs → Save As Draft.", "Find / reopen the draft.", "After MLG-02/18 submission: draft still listed?"],
  ["One draft call; reload restores everything; unrelated draft kept."],
  ["Step 1 shows Save As Draft (Pass).", "'Draft saved successfully!', exactly 1 draft-inquiry/save call (Pass).", "Steps 3–4 Blocked: no UI lists or reopens drafts (MLG-17-Issue-01).", "Submissions in MLG-02 / 18 each called draft-inquiry/delete (their own drafts)."],
  "Draft saved; reload not testable.",
  [E("MLG-17-step1", "Step 1"), E("MLG-17-after-draft", "Draft saved"), E("MLG-17-drafts-list", "Dashboard: no Drafts"), E("MLG-17-saved-routes", "Saved Routes empty"), E("MLG-17-multileg-reopen", "Multi-Leg reopened")],
  "L + T", "8 pax", "—", iss=["MLG-17-Issue-01", "MLG-01-Issue-02"])

FARE18 = [F("P21AC (Outstation leg)", [["Base Rate (Min Kms/Day)", "₹12,600 / day", "Yes – 3 days"], ["Day Bata", "₹1,000", "Yes"], ["Night Bata", "₹1,000", "Yes"]],
            [["Vehicle Base Cost", "₹37,800"], ["Day Bata", "₹3,000"], ["Night Bata", "₹2,000"], ["Estimated Grand Total", "₹42,800"]], "12,600 × 3 + 3,000 + 2,000 = 42,800", ["Consistent; popup ₹42,800."], INC)]
C("USER-MLG-TC-18", "Single-leg Multi-Leg inquiry (Outstation only): label, pricing and tracking", "Pass",
  "1-leg trip labelled and priced as Outstation; second approved submission.",
  {"Total": "18", "Leg": "Koramangala → Chikkamagaluru → Belur, drop Hassan, 3 Jan 2027 7:00 AM → 5 Jan 7:00 PM", "Vehicle": "P21AC", "Submission": "Approved"},
  ["Skip Local → save Outstation → Skip Transfer → Book Now! (workaround).", "Labels.", "P21AC → Confirm → Submit.", "My Inquiries + Edit Inquiry."],
  ["No 'Multi-leg-' prefix; priced like standalone.", "My Inquiries type Outstation; PNR recorded."],
  ["Results: one leg, no Multi-leg label; 900 KM, 3 Days (Pass).", "Confirm Route Summary 'Outstation', ₹42,800 (Pass).", "Submitted: ₹42,800, 1 save-inquiry call. PNR ZLPS490392.",
   "My Inquiries: Outstation, Bengaluru → Hassan, 03–05 Jan 2027, 21 Seater, 18 (Pass). Edit: Booking Type Outstation, destinations kept, timings 00:00 (MLG-02-Issue-02).", "Book Now! after Skip blocked (MLG-03-Issue-01)."],
  "Classification and pricing correct; cross-referenced defects recorded.",
  [E("MLG-18-workaround-results", "Results"), E("MLG-18-fare-breakup", "Breakup"), E("MLG-18-confirm-leg1", "Confirm"), E("MLG-18-submit-result", "Submitted"), E("PNR-my-inquiries-rows", "My Inquiries"), E("MLG-18-edit-edit-form", "Edit Inquiry")],
  "O (1 leg)", "18 pax", "P21AC", fare=FARE18, iss=["MLG-03-Issue-01", "MLG-02-Issue-02", "MLG-02-Issue-04"])

C("USER-MLG-TC-19", "Submitted Multi-Leg inquiry: details and Edit Inquiry per leg", "Partial",
  "Details of YOIT928679 and per-leg edits.",
  {"Source": "YOIT928679 (MLG-02)", "Edit 1": "Leg 3 To → Nandi Hills", "Edit 2": "Leg 1 hours 8 → 6"},
  ["My Inquiries → YOIT928679 → details.", "Edit Inquiry: record editable fields.", "Make the edits → Save."],
  ["All legs with type, locations, dates, passengers, vehicle.", "Edit keeps the ID; each change persists on its leg."],
  ["Row menu offers only 'Edit Inquiry'; status button 'New quotation' opened no details pop-up.", "Edit Inquiry: Booking Type 'Dynamic', combinations Local/Outstation/Transfer, 26–29 Nov, 4 days, 10 pax; journeys Local (Jayanagar, ₹9,300), Outstation (Whitefield → Mysuru, ₹36,000), Transfer (Whitefield → Airport) (Pass).",
   "Timings 00:00 everywhere (MLG-02-Issue-02).", "Step 3 Blocked: locations / hours not editable (MLG-19-Issue-01); nothing saved."],
  "Details checked; planned edits not possible in the UI.",
  [E("MLG-19-edit-edit-form", "Edit Inquiry YOIT928679")],
  "L + O + T", "YOIT928679", "L12AC / P35AC / D12TT", iss=["MLG-19-Issue-01", "MLG-02-Issue-02", "MLG-02-Issue-01"])

C("USER-MLG-TC-20", "Corporate login: Multi-Leg Step 2 of 2", "Not executed",
  "Corporate step (Department, Employee, contracted rates).", {"Account": "Corporate test account (not available, Q-40)"},
  ["Not run."], ["Corporate step only for corporate users."], ["Not executed – descoped by the user on 19 Nov 2026 ('Leave the corporate case'). Personal login never showed a corporate step in MLG-02."],
  "Descoped by the user.", [], "—", "—", "—")

pnrs = [dict(pnr="YOIT928679", case="USER-MLG-TC-02", route="Leg 1 Local Jayanagar 4th Block · Leg 2 Outstation Whitefield → Mysuru · Leg 3 Transfer Whitefield → Kempegowda Airport (BLR)",
             dates="26 Nov 2026 – 29 Nov 2026", vehicle="12 Seater Luxury Urbania / 35 Seater Premium AC Coach / 12 Seater Tempo Traveller", pax="10", estimate="₹54,300 (₹9,300 + ₹36,000 + ₹9,000)",
             status="New quotation", notes="Listed as type 'Local' (MLG-02-Issue-01); Edit shows 'Dynamic' with 3 journeys; timings 00:00 (MLG-02-Issue-02). Not edited."),
        dict(pnr="ZLPS490392", case="USER-MLG-TC-18", route="Outstation Koramangala → Chikkamagaluru → Belur → drop Hassan (single-leg Multi-Leg)", dates="03 Jan 2027 – 05 Jan 2027",
             vehicle="21 Seater Premium AC Coach", pax="18", estimate="₹42,800", status="New quotation", notes="Listed as Outstation (correct); timings 00:00.")]

fareSummary = [["USER-MLG-TC-02", "L12AC", "Local 8 h", "₹8,500 base", "₹9,300", INC], ["USER-MLG-TC-02", "P35AC", "Outstation 2 days", "₹16,500/day", "₹36,000", INC],
               ["USER-MLG-TC-02", "D12TT", "Transfer > 30 KM", "₹9,000", "₹9,000", INC], ["USER-MLG-TC-05", "D40NA", "2 Outstation legs", "per day", "₹39,000 + ₹19,000", INC],
               ["USER-MLG-TC-07", "L45V→L45P / P25AC", "Local + Transfer", "—", "₹17,000→₹14,500 / ₹16,000", INC],
               ["USER-MLG-TC-08", "P16UB / P28AC / L9UB", "Leg vs standalone", "same", "₹8,300 / ₹34,200 / ₹17,500 (identical)", INC],
               ["USER-MLG-TC-13", "P40AC", "Outstation 2 days", "₹18,000/day", "₹39,000", INC], ["USER-MLG-TC-14", "D SDN", "2 Transfer legs", "₹8,000", "₹8,000 + ₹8,000", INC],
               ["USER-MLG-TC-18", "P21AC", "Outstation 3 days", "₹12,600/day", "₹42,800", INC]]

order = {"Defect": 0, "Inconsistency": 1, "Clarification": 2, "Suggestion": 3}
sev = {"High": 0, "Medium": 1, "Low": 2, "—": 3}
issues.sort(key=lambda i: (order[i["type"]], sev.get(i["severity"], 4)))
for i in issues: i["case"] = i["case"]
counts = {}
for c in cases: counts[c["status"]] = counts.get(c["status"], 0) + 1
meta = dict(environment=ENV, subtitle=f"Run {RUN} · 19 Nov 2026 · workbook User_Web_Outstation_Transfer_Use_Cases.xlsx (sheet 'Multi-Leg Use Cases', v3.3) · 20 use cases",
  table={"Run ID": RUN, "Environment": ENV, "Scope": "USER-MLG-TC-01 … 20. MLG-20 (corporate) descoped by the user.", "Execution date": "19 Nov 2026 (D0); D+n = days after",
         "Results": ", ".join(f"{k} {v}" for k, v in counts.items()), "PNRs created": "YOIT928679 (MLG-02), ZLPS490392 (MLG-18)", "Drafts created": "1 explicit (MLG-17)",
         "Fare procedure": "User-Web/.claude/shared/fare-verification.md (Fare Breakup → applied fare → arithmetic)", "Personal data": "Masked in screenshots (phone, email, account header)"},
  highlights=["Book Now! is blocked after the last tab is skipped, so the documented Save! → Skip → Book Now! flow cannot be completed (MLG-03-Issue-01, 6 cases).",
              "Capacity rules break on Multi-Leg: a second vehicle replaces the first and Confirm opens for 55 passengers on one 49-seater (MLG-09-Issue-01/02).",
              "Editing + deleting legs before Book Now! duplicates the remaining leg (MLG-06-Issue-01).",
              "Submitted Multi-Leg inquiry YOIT928679 is listed as 'Local' with only Leg 1's vehicle; all journeys stored with timings 00:00 (MLG-02-Issue-01/02).",
              "Each leg is priced exactly like its standalone module (MLG-08); the Confirm screen has no combined total (only after submission, ₹54,300).",
              "No cross-leg date check (MLG-11), zero-date Local leg accepted (MLG-12), drafts cannot be found (MLG-17)."])
pnrNotes = ["Both inquiries were submitted with explicit approval (user instruction 19 Nov 2026: submit wherever the use case requires it). Neither was edited (MLG-19 edits not possible in the UI).",
            "Payment, cancellation and Custom Quote were never triggered (blocked by the network guard)."]
clar = ["Q-34: Should Book Now! ignore a blank/skipped open leg form? (MLG-03-Issue-01)", "Q-35: Cross-leg chronology rules (overlap, earlier legs) (MLG-11-Issue-01)",
        "Q-36: Transfer leg passenger limit 20 vs 1000 (MLG-09-Issue-03)", "Q-37: Should Confirm show a trip total, and is there any Multi-Leg discount? (MLG-02-Issue-03)",
        "Q-38/39: How should a Multi-Leg inquiry appear in My Inquiries (type, route, vehicles)? (MLG-02-Issue-01)", "Q-29: Automatic drafts and where customers find drafts (MLG-01-Issue-02, MLG-17-Issue-01)",
        "Q-32: Which fields may customers edit after submission? (MLG-19-Issue-01)", "C-14: Local legs with far drops priced as 80 KM (MLG-10-Issue-02)",
        "Compare on Multi-Leg results: intended or not? (MLG-07-Issue-01)", "Q-40: Corporate test account (MLG-20 descoped)"]
scope = ["19 of 20 use cases executed; MLG-20 (corporate) not executed – descoped by the user.",
         "Steps not executable and marked so: MLG-07 compare (no control), MLG-17 draft reload/cleanup (no draft UI), MLG-19 edits (fields read-only).",
         "Where Book Now! was blocked by MLG-03-Issue-01, the documented flow was recorded first, then a workaround (reopen the saved leg's badge, or leave the last leg unsaved) to reach results; the case text says which.",
         "Transfer leg drop times were set manually where the default drop was earlier than the pickup (MLG-03-Issue-02); MLG-03 and MLG-14 record the default first.",
         "The app's automatic draft saves were blocked by the test harness except in MLG-02, MLG-17 (explicit draft only) and MLG-18.",
         "MLG-11 B and C were built as fresh trips instead of editing Leg 2 via its badge (badge edit is covered by MLG-06).",
         "MLG-12 multi-day part re-run after a helper fix (custom calendar); the zero-date check is from the first attempt.",
         "Session interrupted once by low system memory (browser closed during MLG-05); MLG-05 was re-run in full.",
         "Fare verdicts are 'Inconclusive – fare rule not confirmed' per fare-verification.md; arithmetic was consistent in every check."]
json.dump(dict(meta=meta, cases=cases, issues=issues, fareSummary=fareSummary, pnrs=pnrs, pnrNotes=pnrNotes, clarifications=clar, scope=scope),
          open(f"results/{RUN}/report-data.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("cases", len(cases), counts, "issues", len(issues))
