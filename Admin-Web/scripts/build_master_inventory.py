"""Build the consolidated Admin-Web master use-case inventory (Lead Management -> Trip Closure + Fleet masters).

Reads (read-only):
  documentation/02_Workflows_and_Test_Plans/Admin_Functional_QA_Coverage.md  95 planned use cases (Preprod)
  documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue/Admin_Web_Scenarios_and_Use_Cases.md  832-scenario catalogue (DEV, 30 Oct)
  documentation/05_Superseded_Catalogues_2026-10-30/use-case-catalogue/Admin_Web_Use_Cases.md  269 catalogue (E2E section only)
  results/admin-web-20261113-1016-FUNC/usecases.json           latest functional execution
Writes (new files only):
  documentation/01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx; exports/ .csv / .json

No use case is executed and no existing file is modified. Every merge, removal and new gap case is declared below.
"""
import csv
import json
import re
from collections import Counter, OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

ROOT = Path(__file__).resolve().parent.parent
DOC = ROOT / "documentation"
OUT = DOC / "01_Master_Inventory"
RUN_ID = "admin-web-20261113-1016-FUNC"

MODULES = OrderedDict([
    ("LEA", "01 Lead Management"), ("INQ", "02 Inquiry Management"), ("BKG", "03 Booking Management"),
    ("UPC", "04 Upcoming Trips"), ("FLT", "05 Fleet & Vehicle Management"), ("VAL", "06 Vehicle Allocation"),
    ("DRV", "07 Driver Allocation"), ("APT", "08 Approved & Track Live Trips"), ("DSP", "09 Vehicle Dispatch"),
    ("RDY", "10 Ready for Trip"), ("LIV", "11 Live Trips"), ("CMP", "12 Completed Trips"), ("CLS", "13 Trip Closure"),
    ("ADV", "14 Advance Payment (all stages)"), ("XMD", "15 Cross-module & End-to-End"),
    ("ACC", "16 Access & Roles"), ("NFR", "17 Compatibility & Performance"),
])
TAG = {"F": "Functional", "UI": "UI", "UX": "UX", "V": "Validation", "I": "Integration", "S": "Security / Role-based",
       "C": "Compatibility", "P": "Performance", "D": "Data consistency", "T": "Content / Terminology",
       "W": "Workflow transition"}
TYPE = {"Pos": "Positive", "Neg": "Negative", "Bnd": "Boundary", "Alt": "Alternate flow", "Exc": "Exception",
        "E2E": "End-to-end"}

# ---------------------------------------------------------------- 1. planned use cases (functional plan)
PLAN_META = {  # id: (module, submodule, tags, type)
    "LM-01": ("LEA", "Lead List", "F D", "Pos"), "LM-02": ("LEA", "View Lead", "D I", "Pos"),
    "LM-03": ("LEA", "Lead List", "F", "Pos"), "LM-04": ("LEA", "Lead List", "F", "Pos"),
    "LM-05": ("LEA", "Lead List", "F UI", "Pos"), "LM-06": ("LEA", "Lead List", "D UI", "Pos"),
    "LM-07": ("LEA", "Add Lead", "V UI", "Neg"), "LM-08": ("LEA", "View Lead", "UX", "Alt"),
    "LM-09": ("LEA", "Assign Lead", "F V", "Pos"), "LM-10": ("LEA", "Send To Inquiry", "F W", "Pos"),
    "IM-01": ("INQ", "Inquiry List", "F", "Pos"), "IM-02": ("INQ", "Inquiry List", "D UI", "Pos"),
    "IM-03": ("INQ", "Inquiry List", "D", "Pos"), "IM-04": ("INQ", "View Quote", "F D", "Pos"),
    "IM-05": ("INQ", "Edit Inquiry", "F", "Pos"), "IM-06": ("INQ", "Add Inquiry", "V UI", "Neg"),
    "IM-07": ("INQ", "Inquiry List", "T UI", "Pos"),
    "QT-01": ("INQ", "Update Quote", "D I", "Pos"), "QT-02": ("INQ", "Update Quote", "V", "Neg"),
    "QT-03": ("INQ", "Update Quote", "V", "Bnd"), "QT-04": ("INQ", "Update Quote", "F D", "Pos"),
    "QT-05": ("INQ", "Update Quote", "F UI", "Pos"), "QT-06": ("INQ", "Update Quote", "F", "Pos"),
    "QT-07": ("INQ", "Update Quote", "F UI", "Pos"), "QT-08": ("INQ", "Day-wise Category Assignment", "F UI", "Pos"),
    "QT-09": ("INQ", "Add New Journey", "V", "Neg"), "QT-10": ("INQ", "Update Quote", "F D", "Pos"),
    "QT-11": ("INQ", "Quote Preview", "F UI", "Pos"), "QT-12": ("INQ", "Update Quote", "F UX", "Pos"),
    "QT-13": ("INQ", "Update Quote", "UX", "Exc"),
    "PB-01": ("BKG", "Send To Booking / Convert", "V", "Neg"), "PB-02": ("BKG", "Send To Booking / Convert", "F W UX", "Alt"),
    "PB-03": ("BKG", "Pre-Bookings List", "F", "Pos"), "PB-04": ("BKG", "View Booking", "D", "Pos"),
    "PB-05": ("BKG", "Edit Booking", "F", "Pos"), "PB-06": ("BKG", "Confirm Booking", "F W V", "Pos"),
    "PB-07": ("BKG", "Pre-Bookings List", "D UI", "Pos"), "PB-08": ("BKG", "Add New Booking", "V UI", "Neg"),
    "PB-09": ("BKG", "Pre-Bookings List", "UI D", "Pos"),
    "BK-01": ("BKG", "Booked", "F UI", "Pos"), "BK-02": ("BKG", "Booked", "F UI", "Pos"),
    "BK-03": ("BKG", "Completed (booking tab)", "F UI", "Pos"),
    "UT-01": ("UPC", "Upcoming Trips List", "D UI", "Pos"), "UT-02": ("UPC", "Upcoming Trips List", "F", "Pos"),
    "UT-03": ("UPC", "Edit Booking", "F UX", "Alt"), "UT-04": ("UPC", "Vehicle Allocation entry", "F", "Alt"),
    "UT-05": ("UPC", "Send To Trip Approval", "F W UX", "Alt"),
    "VA-01": ("VAL", "Allocation Portal", "UI", "Pos"), "VA-02": ("VAL", "Allocation Portal", "F UI D", "Pos"),
    "VA-03": ("VAL", "Allocation Portal", "F UI", "Pos"), "VA-04": ("VAL", "Allocate Vehicle", "V", "Neg"),
    "VA-05": ("VAL", "Allocate Vehicle", "UI D", "Pos"), "VA-06": ("VAL", "Allocate Vehicle", "F D", "Alt"),
    "VA-07": ("VAL", "Allocate Vehicle", "V", "Neg"), "VA-08": ("VAL", "Allocate Vehicle", "F V", "Bnd"),
    "VA-09": ("VAL", "Allocate Vehicle", "F W", "Pos"), "VA-10": ("VAL", "Available Vehicles", "F D", "Pos"),
    "DA-01": ("DRV", "Allocate Driver", "F", "Pos"), "DA-02": ("DRV", "Edit / Replace Driver", "F D", "Pos"),
    "AT-01": ("APT", "Approved Vehicles List", "F", "Pos"), "AT-02": ("APT", "Approved Vehicles List", "D UI", "Pos"),
    "AT-03": ("APT", "Edit Allocation", "F", "Alt"), "AT-04": ("APT", "Edit Bus Details", "F V", "Pos"),
    "AT-05": ("APT", "Extra Amenities", "F", "Pos"), "AT-06": ("APT", "Refuel Request", "V I", "Neg"),
    "VD-01": ("DSP", "Predeparture Checklist", "V", "Neg"), "VD-02": ("DSP", "Trip Sheet", "V", "Neg"),
    "VD-03": ("DSP", "Trip Sheet", "V", "Bnd"), "VD-04": ("DSP", "Trip Sheet", "F D", "Pos"),
    "VD-05": ("DSP", "Trip Sheet", "V", "Neg"), "VD-06": ("DSP", "Submit Dispatch", "F W", "Pos"),
    "RT-01": ("RDY", "Ready for Trip List", "D UI", "Pos"), "RT-02": ("RDY", "Edit Tripsheet", "F", "Pos"),
    "RT-03": ("RDY", "Edit Bus / Driver / Amenities", "F", "Pos"), "RT-04": ("RDY", "Start Trip", "F W UX", "Alt"),
    "LT-01": ("LIV", "Live Trips List", "D UI", "Pos"), "LT-02": ("LIV", "Edit Trip Sheet / Details", "F", "Pos"),
    "LT-03": ("LIV", "Track Live Location", "F UI", "Pos"), "LT-04": ("LIV", "Driver Details", "D S", "Pos"),
    "LT-05": ("LIV", "Live Trip Forms", "V I", "Neg"), "LT-06": ("LIV", "Complete Trip", "F W", "Pos"),
    "CT-01": ("CMP", "Completed Trips List", "D UI", "Pos"), "CT-02": ("CMP", "Trip Summary", "D", "Pos"),
    "CT-03": ("CLS", "Close Trip Sheet", "V", "Neg"), "CT-04": ("CLS", "Extra Expenses", "V F", "Neg"),
    "CT-05": ("CLS", "Close Trip Sheet", "F D", "Pos"), "CT-06": ("CLS", "Close Trip", "F W", "Pos"),
    "CT-07": ("CLS", "Post-close Cost", "D", "Pos"),
    "XC-01": ("XMD", "Data Consistency", "D I", "Pos"), "XC-02": ("XMD", "Data Consistency", "D", "Pos"),
    "XC-03": ("XMD", "Notifications", "I D", "Pos"), "XC-04": ("XMD", "Navigation & State", "UX", "Exc"),
    "XC-05": ("XMD", "Terminology", "T", "Pos"), "XC-06": ("XMD", "UI States", "UI T", "Pos"),
}
# planned cases merged into another planned case (exact duplicate inside the plan)
PLAN_MERGED = {"DA-03": ("LT-04", "Plan DA-03 'Driver Details (Live): values match assigned driver' duplicates LT-04 'Driver Details: values'")}
# planned IDs whose run-ID was reused for a different scenario in the execution log
PLAN_EXEC_OVERRIDE = {
    "BK-02": "Not executed (run ID BK-02 was used for 'Move back to Pre-Bookings')",
    "DA-02": "Partially executed: Replace Driver form opened, change not saved (run ID DA-03, Pass)",
    "XC-06": "Not executed (run ID XC-06 was used for the advance-prompt check)",
    "PB-09": "Not executed (planned, never logged)",
}
# extra scope absorbed by a planned case from overlapping catalogue cases
PLAN_SCOPE_NOTE = {
    "LM-04": "Scope widened: also search combined with Status filter, then Reset (from ADMIN-LEAD-010)",
    "LM-07": "Scope widened: also only one required field filled (from ADMIN-LEAD-019)",
    "IM-03": "Scope widened: also list columns and row controls (from ADMIN-INQ-005)",
    "PB-08": "Scope widened: also dropdown behaviour on Add New Booking (from ADMIN-BOOK-021)",
    "PB-09": "Scope widened: also Pre-Bookings columns and row controls (from ADMIN-BOOK-005)",
    "BK-01": "Scope widened: client and vehicle filter behaviour on Booked (from ADMIN-BOOK-025/026)",
    "LT-04": "Includes the PII check: driver Aadhaar masking (ISS-35)",
}

# ---------------------------------------------------------------- 2. scenarios executed but not in the plan
EXEC_ONLY = [  # (module, sub, title, tags, type, run id)
    ("BKG", "Booked", "Move a confirmed booking back to Pre-Bookings (Back to Pre-Bookings), data retained, then re-confirm", "F W", "Alt", "BK-02"),
    ("DRV", "Allocate Driver", "Allocate Driver dialog: blank-submit validation, then valid driver assignment", "F V", "Pos", "DA-02"),
    ("XMD", "UX", "'Record Advance Payment?' prompt before edits and transitions: decline path at every stage", "UX", "Alt", "XC-06"),
]

# ---------------------------------------------------------------- 3. catalogue (832) handling
CAT_DUP = {  # catalogue id -> planned id it duplicates (same action, same check, same screen)
    **{k: "LM-03" for k in ("LEAD-004", "LEAD-005", "LEAD-006")}, **{k: "LM-04" for k in ("LEAD-008", "LEAD-009")},
    **{k: "LM-05" for k in ("LEAD-011", "LEAD-012")},
    **{k: "LM-07" for k in ("LEAD-014", "LEAD-015", "LEAD-016", "LEAD-018")},
    "LEAD-025": "LM-08", "LEAD-026": "LM-06", "LEAD-027": "LM-10", "LEAD-029": "LM-09",
    "INQ-004": "IM-02", **{k: "IM-01" for k in ("INQ-007", "INQ-009", "INQ-010", "INQ-012", "INQ-013")},
    "BOOK-004": "PB-07", **{k: "PB-03" for k in ("BOOK-007", "BOOK-009", "BOOK-010", "BOOK-011", "BOOK-044")},
    "BOOK-012": "PB-08", "BOOK-014": "PB-08", "BOOK-022": "BK-01", "BOOK-023": "BK-02", "BOOK-028": "BK-03",
    "FLEET-004": "VA-02", **{k: "AT-01" for k in ("FLEET-014", "FLEET-017", "FLEET-019", "FLEET-020", "FLEET-021", "FLEET-022")},
    "FLEET-015": "AT-02", "FLEET-109": "AT-03", "FLEET-024": "VA-01", "FLEET-025": "VA-03",
    "FLEET-028": "VA-02", "FLEET-029": "VA-02",
}
CAT_OVERLAP = {"LEAD-010": "LM-04", "LEAD-019": "LM-07", "INQ-005": "IM-03", "BOOK-005": "PB-09",
               "BOOK-021": "PB-08", "BOOK-025": "BK-01", "BOOK-026": "BK-01"}


def cat_place(cid):
    """module/submodule for an in-scope catalogue id, or None if out of scope."""
    pre, n = cid.rsplit("-", 1)
    n = int(n)
    if pre == "LEAD":
        sub = ("Add Lead" if 14 <= n <= 24 else "View Lead" if n in (25, 26) else "Send To Inquiry" if n in (27, 28)
               else "Assign Lead" if n == 29 else "Delete Lead" if n in (30, 31) else "Lead Lifecycle" if n == 32
               else "Lead List")
        return "LEA", sub
    if pre == "INQ":
        return "INQ", "Inquiry List"
    if pre == "BOOK":
        if 35 <= n <= 43:
            return "VAL", "Pending Vehicle Allocations"
        if n in (45, 46):
            return "ADV", "Record Advance"
        sub = ("Add New Booking" if 12 <= n <= 21 else "Booked" if 22 <= n <= 27 else "Completed (booking tab)"
               if 28 <= n <= 34 else "Pre-Bookings List")
        return "BKG", sub
    if pre == "FLEET":
        if n <= 4:
            return "FLT", "Vehicle Management Portal"
        if n <= 13:
            return "FLT", "Total Buses"
        if n <= 23 or n == 109:
            return "APT", "Approved Vehicles List"
        if n <= 29:
            return "VAL", "Allocation Portal"
        for hi, sub in ((35, "Tariff Management"), (56, "Bus Types"), (72, "Bus Manufacturers"),
                        (91, "Bus Models"), (108, "Seat Types")):
            if n <= hi:
                return "FLT", sub
    return None


def cat_tags(title):
    t = title.lower()
    if "without an authenticated session" in t or "without a session" in t:
        return "S", "Neg"
    if "empty-state" in t or "no matching" in t:
        return "UI", "Neg"
    if "special characters" in t or "injection" in t:
        return "V S", "Neg"
    if "boundaries" in t or "length" in t:
        return "V", "Bnd"
    if "minimum required" in t:
        return "F V", "Pos"
    if any(k in t for k in ("mandatory", "required fields empty", "only one required", "both required", "invalid email",
                            "invalid phone", "duplicate", "double submission", "file upload", "combinations")):
        return "V", "Neg"
    if "catalog" in t:
        return "F I", "Pos"
    if "cancel deleting" in t:
        return "F UX", "Alt"
    if "without saving" in t:
        return "UX", "Alt"
    if "twice" in t:
        return "F V", "Neg"
    if "send" in t:
        return "F W", "Pos"
    if "dropdown selection" in t or "dropdown options" in t:
        return "F UI", "Pos"
    if any(k in t for k in ("columns", "row controls", "summary card", "row actions", "match the list")):
        return "UI D", "Pos"
    if any(k in t for k in ("open the", "reload", "sidebar", "direct url", "open '", "screen")):
        return "UI", "Pos"
    if "rows per page" in t or "rows-per-page" in t or "navigate" in t:
        return "F UI", "Pos"
    return "F", "Pos"


# ---------------------------------------------------------------- 4. E2E cases
E2E_KEEP = {  # 269-catalogue E2E id -> (module, sub, tags, note)
    "ADMIN-E2E-001": ("FLT", "Fleet Master Chain", "F D", ""),
    "ADMIN-E2E-013": ("ACC", "Role Setup", "S", "Blocked: only a Superadmin account is available (Open Questions C1)"),
    "ADMIN-E2E-014": ("XMD", "End-to-End", "F I D", "Cancellation penalty slab rules unclear (Open Questions B11)"),
    "ADMIN-E2E-017": ("XMD", "End-to-End", "I", ""),
    "ADMIN-E2E-018": ("XMD", "End-to-End", "F I", "Also covers submitting an Emergency Alert from Live Trips"),
    "ADMIN-E2E-019": ("XMD", "End-to-End", "F I", "Also covers submitting a Refuel Request from Approved / Live"),
}
E2E_DUP = {"ADMIN-E2E-003": "Segment of Workflow S0-S23 (Advance part covered by Advance Payment cases)",
           "ADMIN-E2E-004": "Segment of Workflow S0-S23"}

# ---------------------------------------------------------------- 5. new gap use cases (not documented before)
CONF_SORT = "Sortable headers were not detected (Open Questions B8); confirm expected default order and sortable columns"
CONF_X = "Excluded action (class X); dialog never opened, so wording and effects are unknown"
CONF_A = "Sends a customer/staff communication; needs approval (plan §6)"
CONF_ROLE = "Blocked: only a Superadmin account is available (Open Questions C1)"
NEW = [  # (module, sub, title, tags, type, evidence, confirmation note)
    ("LEA", "Lead List", "Default sort order and column sorting on the lead list", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("LEA", "Delete Lead", "Delete a lead that has already been sent to Inquiry (linked record)", "F V", "Neg", "Lead menu (workflow §5a); ADMIN-LEAD-031 note", "Delete rules for referenced records unknown (Open Questions B5)"),
    ("LEA", "Assign Lead", "Reassign a lead that is already assigned to another employee", "F", "Alt", "Lead menu (workflow §5a)", "Assign blocked in Preprod: no sales employees listed (ISS-04)"),
    ("INQ", "Cancel Inquiry", "Cancel Inquiry: dismiss the confirmation; inquiry unchanged", "F UX", "Alt", "Inquiry menu (workflow §5a)", CONF_X),
    ("INQ", "Cancel Inquiry", "Cancel Inquiry: confirm; status changes, inquiry leaves active lists and KPIs, Send To Booking no longer offered", "F D", "Pos", "Inquiry menu (workflow §5a)", CONF_X),
    ("INQ", "Delete Inquiry", "Delete inquiry: dismiss the confirmation; inquiry unchanged", "F UX", "Alt", "Inquiry menu (workflow §5a)", CONF_X),
    ("INQ", "Delete Inquiry", "Delete inquiry: confirm; removed from list, KPI totals and linked lead updated", "F D", "Pos", "Inquiry menu (workflow §5a)", CONF_X + "; delete semantics unknown (B5)"),
    ("INQ", "Cancel / Delete Inquiry", "Cancel or delete an inquiry that has already been converted to a booking", "F V", "Neg", "Inquiry menu (workflow §5a)", "Allowed transitions unknown (Open Questions B10)"),
    ("INQ", "Send Quote", "Send Quote to the customer: channel and content match the saved quote", "F I", "Pos", "Inquiry menu (workflow §5a)", CONF_A),
    ("INQ", "Proforma Invoice", "Send Proforma Invoice (Inquiry and Pre-Booking menus): recipient and content", "F I", "Pos", "Inquiry + Pre-Booking menus (workflow §5a)", CONF_A),
    ("INQ", "Proforma Invoice", "Download Proforma Invoice: file opens; amounts, GST and IDs match the quote", "F D I", "Pos", "Inquiry menu (workflow §5a)", "Excluded so far (Proforma download, class X)"),
    ("INQ", "Send Bus Images", "Send Bus Images to the customer for the quoted vehicle type", "F I", "Pos", "Inquiry menu (workflow §5a)", CONF_A),
    ("INQ", "Inquiry List", "Default sort order and column sorting on the inquiry list", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("INQ", "Add Inquiry", "Create an inquiry with valid data via + Add inquiry (Generate Quote)", "F", "Pos", "IM-06 form observed (validation only)", "Creates a record; needs approval and a cleanup agreement"),
    ("INQ", "Add New Journey", "Add a valid additional journey (multi-leg quote); legs and total update", "F D", "Pos", "QT-09 form observed (validation only)", ""),
    ("BKG", "Send To Inquiry", "Send a pre-booking back to Inquiry: state, data retained, and re-conversion", "F W", "Alt", "Pre-Booking menu (workflow §5a)", ""),
    ("BKG", "Send Booking Form", "Send Booking Form to the customer: content and delivery", "F I", "Pos", "Pre-Booking menu (workflow §5a)", CONF_A),
    ("BKG", "Cancel Booking", "Cancel Booking from Pre-Bookings: confirm; status, lists and KPIs update", "F D", "Pos", "Pre-Booking menu (workflow §5a)", CONF_X),
    ("BKG", "Cancel Booking", "Cancel Booking: dismiss the confirmation (Pre-Bookings and Upcoming); booking unchanged", "F UX", "Alt", "Pre-Booking + Upcoming menus (workflow §5a)", CONF_X),
    ("BKG", "Cancel & Notify", "Cancel & Notify from Pre-Bookings: booking cancelled and customer notification content correct", "F I D", "Pos", "Pre-Booking menu (workflow §5a)", CONF_X + "; " + CONF_A),
    ("BKG", "Cancel & Notify", "Cancel & Notify: dismiss the confirmation; no cancellation and no notification sent", "F UX", "Alt", "Pre-Booking + Upcoming menus (workflow §5a)", CONF_X),
    ("BKG", "Pre-Bookings List", "Default sort order and column sorting on Pre-Bookings", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("BKG", "Booked", "Default sort order and column sorting on Booked", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("UPC", "Cancel Booking", "Cancel Booking from Upcoming Trips (confirmed booking): status, Trip ID, lists and KPIs update", "F D", "Pos", "Upcoming menu (workflow §5a)", CONF_X),
    ("UPC", "Cancel & Notify", "Cancel & Notify from Upcoming Trips: cancellation and notification content", "F I D", "Pos", "Upcoming menu (workflow §5a)", CONF_X + "; " + CONF_A),
    ("UPC", "Upcoming Trips List", "Default sort order and column sorting on Upcoming Trips", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("VAL", "Allocate Vehicle", "Allocate the requested multi-vehicle combination for an inquiry that requests more than one vehicle", "F D", "Pos", "Plan §4 rule 3, §6 item 1", "Needs a 2-vehicle test PNR; app support unconfirmed"),
    ("VAL", "Allocate Vehicle", "Attempt to allocate a vehicle already allocated for overlapping dates", "F V", "Neg", "Plan §4; VA-10 availability", ""),
    ("VAL", "Allocate Vehicle", "Allocate a vendor-owned vehicle through the Vendor List", "F", "Alt", "Vendor List on allocation page (VA-05)", "Vendor List was only inspected"),
    ("VAL", "Allocation Portal", "Default sort order and column sorting on the Allocation Portal", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("DRV", "Allocate Driver", "Attempt to assign a driver who is already on an overlapping trip", "F V", "Neg", "Allocate Driver dialog (DA-02 run)", "Driver availability rule unknown"),
    ("APT", "Approved Vehicles List", "Default sort order and column sorting on Approved Vehicles", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("DSP", "Predeparture Checklist", "Predeparture photo uploads: valid image accepted; non-image and oversized files rejected", "V", "Neg", "Checklist photo fields (VD-01)", "Size/type limits not documented"),
    ("RDY", "Cancel Trip", "Cancel Trip from Ready for Trip: confirm; trip status, vehicle and driver released, booking state", "F D", "Pos", "Ready For Trip menu (workflow §5a)", CONF_X),
    ("RDY", "Cancel Trip", "Cancel Trip: dismiss the confirmation; trip unchanged", "F UX", "Alt", "Ready For Trip menu (workflow §5a)", CONF_X),
    ("RDY", "Ready for Trip List", "Default sort order and column sorting on Ready for Trip", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("LIV", "Breakdown Protocol", "Submit a Breakdown Protocol request with valid data; request recorded and visible", "F I", "Pos", "Live menu (workflow §5a); LT-05 form", CONF_A),
    ("LIV", "Send Notification", "Send Notification with valid title, subject and message; delivery and content", "F I", "Pos", "Live menu (workflow §5a); LT-05 form", CONF_A),
    ("LIV", "Notify Service Manager", "Notify Service Manager: submit and verify the manager is notified", "F I", "Pos", "Live menu (workflow §5a)", "Nothing opens after the advance prompt (ISS-37)"),
    ("LIV", "Mid-trip Change", "Replace the vehicle during a live trip (e.g. after breakdown); trip, sheet and allocation update", "F D", "Alt", "Review gap: mid-trip changes", "No mid-trip reassignment control observed; candidate paths Breakdown Protocol / Edit Trip Details"),
    ("LIV", "Mid-trip Change", "Replace the driver during a live trip; driver details and notifications update", "F D", "Alt", "Review gap: mid-trip changes", "No mid-trip reassignment control observed; Edit Driver Details is offered only before the trip starts"),
    ("LIV", "Track Live Location", "Track Live Location for a vehicle with active GPS: position shown and refreshed", "F I", "Pos", "Live menu; LT-03 saw only the no-GPS state", "Needs a GPS-enabled test vehicle"),
    ("LIV", "Live Trips List", "Default sort order and column sorting on Live Trips", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("CMP", "Download Invoice", "Download Invoice after closure: file opens; invoice number, amounts and trip data match the closure", "F D I", "Pos", "Completed menu (workflow §5a)", "Excluded so far (Invoice download, class X)"),
    ("CMP", "Completed Trips List", "Default sort order and column sorting on Completed Trips", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("CLS", "Extra Expenses", "Billed extra expense added at closure is reflected in actual cost and invoice", "F D", "Pos", "Close Trip Sheet extra expenses (CT-04)", "Billing rule unclear (CT-07)"),
    ("FLT", "Total Buses", "Add an item via 'What would you like to add?' with valid data", "F", "Pos", "Dialog observed (ADMIN-FLEET-012)", "Options behind the dialog were not recorded; creates fleet data"),
    ("FLT", "Total Buses", "Mandatory and invalid-input validation in the 'What would you like to add?' flow", "V", "Neg", "Dialog observed (ADMIN-FLEET-012)", "Options behind the dialog were not recorded"),
    ("FLT", "Total Buses", "Default sort order and column sorting on Total Buses", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("FLT", "Fleet Masters (all)", "Inactive manufacturer, model, seat type or bus type is not offered in dependent dropdowns", "F D", "Neg", "Status toggles observed; Open Questions B6", "Effect of Inactive status unknown (B6)"),
    ("FLT", "Fleet Masters (all)", "Sorting on Bus Types, Manufacturers, Models, Seat Types and Tariff lists", "F UI", "Pos", "Review gap: sorting", CONF_SORT),
    ("ADV", "Record Advance", "Record Advance is offered from each stage menu and opens the form for the correct booking", "F UI", "Pos", "Record Advance in every stage menu (workflow §5a)", "Payment scope excluded so far"),
    ("ADV", "Record Advance", "Record a valid advance; ADVANCE column, balance and later invoice reflect it", "F D I", "Pos", "Record Advance dialog (ADMIN-BOOK-045)", "Payment scope excluded so far; needs approval"),
    ("ADV", "Record Advance", "Advance amount validation: blank, 0, negative, decimal, above total cost", "V", "Bnd", "Record Advance dialog (ADMIN-BOOK-045)", "Payment scope excluded so far"),
    ("ADV", "Advance Prompt", "Choose 'Yes, Record Advance' at a transition prompt: advance form, then the transition continues", "F UX", "Alt", "Prompt before every transition after S10 (workflow §5a)", "Payment scope excluded so far"),
    ("ACC", "Menu Access", "Admin (non-Superadmin) role sees only permitted workflow modules in the sidebar", "S UI", "Pos", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("ACC", "URL Access", "Admin role opening a non-permitted module or record URL directly is blocked", "S", "Neg", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("ACC", "Row Actions", "Admin role sees only permitted row-menu actions in each workflow list", "S", "Pos", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("ACC", "Transitions", "Admin role can perform each permitted forward transition from Lead to Close Trip", "S W", "Pos", "Workflow doc §2 precondition 4", CONF_ROLE),
    ("ACC", "Irreversible Actions", "Admin role without permission cannot Cancel, Cancel & Notify, Delete or Close Trip", "S", "Neg", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("ACC", "Fleet Masters", "Admin role create and status-change rights on fleet master data follow its permissions", "S", "Pos", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("ACC", "Financial Data", "Admin role view/edit of quote costs and advances follows its permissions", "S", "Pos", "Role & Permission module; Open Questions C1", CONF_ROLE),
    ("XMD", "Security", "Record URLs (update-inquiry/<uuid>, confirm-booking/<uuid>) without a session or with an invalid ID", "S", "Neg", "Routes observed in run 20261112", ""),
    ("XMD", "Security", "Script/HTML injection in free-text fields of quote, dispatch, live-trip and closure forms", "S V", "Neg", "Free-text fields observed (QT, VD, LT-05, CT)", ""),
    ("XMD", "Concurrency", "Two admins edit or transition the same record at the same time", "F D", "Exc", "Review gap", "Locking/refresh behaviour unknown"),
    ("XMD", "Cancelled Records", "Cancelled inquiries, bookings and trips: where they are listed and that they leave active lists and KPIs", "F D", "Pos", "Completed 'Trip completion status' filter (ADMIN-BOOK-033); B10", "Cancelled-state behaviour unknown (B10)"),
    ("XMD", "Integration", "Admin status changes (quote, confirm, cancel, start, complete) are reflected in User-Web", "I D", "Pos", "User-Web is the inquiry source (workflow §2)", "User-Web display of these statuses is not confirmed"),
    ("NFR", "Compatibility", "Full Lead-to-Closure workflow on current Chrome, Edge, Firefox and Safari", "C", "Pos", "Review gap: no compatibility coverage", "Supported browser list not documented"),
    ("NFR", "Compatibility", "Wide tables, forms and modals at 1366x768 and 1920x1080, and at 125% / 150% zoom", "C UI", "Pos", "Review gap", "Supported resolutions not documented"),
    ("NFR", "Compatibility", "Admin portal at tablet width", "C", "Pos", "Review gap", "Tablet support not stated"),
    ("NFR", "Performance", "List load and search/filter response with production-like volumes (Lead, Inquiry, Bookings, Approved, Completed)", "P", "Pos", "Review gap: no performance coverage", "No response-time targets documented"),
    ("NFR", "Performance", "Quote save and cost recalculation response time", "P", "Pos", "Review gap", "No response-time targets documented"),
    ("NFR", "Performance", "Vehicle list load on the allocation page for a date with a large fleet", "P", "Pos", "Review gap", "No response-time targets documented"),
    ("NFR", "Performance", "Several admins working in the portal at the same time (load)", "P", "Pos", "Review gap", "No load targets documented"),
]

UNCONFIRMED = [
    ("Stages after Approved & Track", "Dispatch, Ready, Live, Completed and Closure were never explored for the general catalogue; their cases come only from the functional plan and one execution."),
    ("Allocation types", "The allocation-type dialog listed 'Dynamic Allocation …'; whether other types exist was not recorded, so no case is written for them."),
    ("Pending Allocation Confirmations tab", "Only viewed (VA-01). What puts a trip there, and its actions, are unknown."),
    ("'What would you like to add?' (Total Buses)", "The options behind the dialog were not recorded. Vehicle edit/deactivate controls on Total Buses are unknown."),
    ("Fleet master Edit / Delete and Tariff create/edit", "No Edit/Delete controls were documented for Bus Types, Manufacturers, Models, Seat Types or Tariff, so none are included."),
    ("Mid-trip vehicle/driver change", "No reassignment control was observed on Live Trips. The two cases are included as requirements to confirm."),
    ("Cancel, Cancel & Notify, Delete", "Never opened (class X). Dialog wording, cascade effects, refunds and notifications are unknown (Open Questions B5, B10, B11)."),
    ("Send Customer Inquiry Form", "Listed as an approval-needed action in plan §6 but its location was never recorded; no case written."),
    ("Booked / Completed row menus", "Booked menu inventory was not captured in full; BK-02 (plan) is still Not executed."),
    ("Ready For Trip menu", "RT-03 Not Run in the latest run; menu taken from run 20261112."),
    ("Role-based behaviour", "Only a Superadmin account exists (Open Questions C1). All Access & Roles cases are Blocked."),
    ("Sorting", "No sortable headers were detected (B8). Sorting cases verify the expected behaviour once it is confirmed."),
    ("Non-functional requirements", "No supported browsers, resolutions or response-time targets are documented. The NFR cases need targets before they can pass or fail."),
    ("Notification channels", "Which actions send SMS / email / WhatsApp / push is unknown (B13); notification cases cover content only where seen."),
    ("DEV vs Preprod", "Catalogue cases come from DEV (30 Oct) and are mostly 'Needs Verification'; some may not match Preprod screens."),
    ("Finance scope", "Billing / receivables after closure (ADMIN-E2E-005) and Finance modules are outside Lead → Trip Closure and are not counted."),
]


def main():
    plan_md = (DOC / "02_Workflows_and_Test_Plans" / "Admin_Functional_QA_Coverage.md").read_text(encoding="utf-8")
    plan = OrderedDict()
    for m in re.finditer(r"^\| ((?:LM|IM|QT|PB|BK|UT|VA|DA|AT|VD|RT|LT|CT|XC)-\d+) \| (.+?) \| ([A-Z/]+) \|", plan_md, re.M):
        plan[m.group(1)] = (m.group(2).strip(), m.group(3))
    assert len(plan) == 95, len(plan)

    cat_md = (DOC / "05_Superseded_Catalogues_2026-10-30" / "scenario-catalogue" / "Admin_Web_Scenarios_and_Use_Cases.md").read_text(encoding="utf-8")
    catalogue = OrderedDict((m.group(1), m.group(2).strip()) for m in re.finditer(
        r"^\| ADMIN-((?:LEAD|INQ|BOOK|FLEET)-\d+) \| [^|]+ \| ([^|]+) \|", cat_md, re.M))
    old_md = (DOC / "05_Superseded_Catalogues_2026-10-30" / "use-case-catalogue" / "Admin_Web_Use_Cases.md").read_text(encoding="utf-8")
    old = OrderedDict((m.group(1), m.group(2).strip()) for m in re.finditer(r"^#### (ADMIN-[A-Z0-9]+-\d+) – (.+)$", old_md, re.M))
    runs = {u["id"]: u for u in json.loads((ROOT / "results" / RUN_ID / "usecases.json").read_text(encoding="utf-8"))}

    rows = []  # each: dict

    def add(mod, sub, title, tags, typ, origin, legacy, execu, note, evidence=""):
        rows.append(dict(module=mod, sub=sub, title=title, tags=tags.split(), type=typ, origin=origin,
                         legacy=legacy, exec=execu, note=note, evidence=evidence))

    for pid, (title, cls) in plan.items():
        if pid in PLAN_MERGED:
            continue
        mod, sub, tags, typ = PLAN_META[pid]
        if pid in PLAN_EXEC_OVERRIDE:
            ex = PLAN_EXEC_OVERRIDE[pid]
        elif pid in runs:
            ex = f"{runs[pid]['status']} ({RUN_ID})"
        else:
            ex = "Not executed"
        legacy = pid + "".join(f", {k} (plan, merged)" for k, v in PLAN_MERGED.items() if v[0] == pid)
        legacy += "".join(f", ADMIN-{k} (merged)" for k, v in CAT_OVERLAP.items() if v == pid)
        legacy += "".join(f", ADMIN-{k} (duplicate)" for k, v in CAT_DUP.items() if v == pid)
        add(mod, sub, title, tags, typ, "Existing – functional plan", legacy, ex, PLAN_SCOPE_NOTE.get(pid, ""),
            f"Plan class {cls}")
    # catalogue additions and FLEET masters
    for cid, title in catalogue.items():
        place = cat_place(cid)
        if place is None or cid in CAT_DUP or cid in CAT_OVERLAP:
            continue
        tags, typ = cat_tags(title)
        if re.search(r"FLEET-(0[3-9]\d|10[0-8])$", cid):
            origin = "Existing – catalogue (Fleet masters)"
        else:
            origin = "Existing – catalogue"
        note = "Approval required to execute" if "approval" in title.lower() else ""
        add(*place, title, tags, typ, origin, "ADMIN-" + cid, "Not executed", note, "Catalogue, DEV 30 Oct (Needs Verification)")
    for mod, sub, title, tags, typ, rid in EXEC_ONLY:
        st = runs[rid]["status"]
        add(mod, sub, title, tags, typ, "Existing – executed, not in plan", f"Run ID {rid} ({RUN_ID})", f"{st} ({RUN_ID})", "")
    add("XMD", "End-to-End", "Happy path Lead → Inquiry → Quote → Booking → Trip Approval → Vehicle/Driver allocation → Dispatch → Start → Complete → Close Trip (S0–S23)",
        "W I D", "E2E", "Existing – workflow", "Workflow S0–S23; ADMIN-E2E-003 (merged); ADMIN-E2E-004 (merged)",
        "Executed 12 Nov (admin-web-20261112-2229-INQ2TRIP): 25 Pass, S14 Blocked, S15 Not Run", "Allocate Driver never offered; driver auto-assigned")
    for eid, (mod, sub, tags, note) in E2E_KEEP.items():
        add(mod, sub, old[eid], tags, "E2E", "Existing – E2E catalogue", eid, "Not executed", note)
    for mod, sub, title, tags, typ, ev, conf in NEW:
        add(mod, sub, title, tags, typ, "New – gap identified", "", "Not executed", conf, ev)

    # assign IDs: module order, then origin order already in insertion order
    order = {m: i for i, m in enumerate(MODULES)}
    rows.sort(key=lambda r: order[r["module"]])  # stable: keeps insertion order within module
    seq = Counter()
    for r in rows:
        seq[r["module"]] += 1
        r["id"] = f"AW-{r['module']}-{seq[r['module']]:03d}"
        r["module_name"] = MODULES[r["module"]]
        r["categories"] = ", ".join(TAG[t] for t in r["tags"])
        r["type_name"] = TYPE[r["type"]]
        r["confirm"] = "Yes" if r["note"] and r["origin"].startswith("New") else ""
    ids = [r["id"] for r in rows]
    assert len(ids) == len(set(ids))
    master_id_of_plan = {}
    for r in rows:
        first = r["legacy"].split(",")[0].split(" ")[0]
        master_id_of_plan[first] = r["id"]

    # removed duplicates
    removed = []
    for k, (tgt, why) in PLAN_MERGED.items():
        removed.append((k, "Functional plan", plan[k][0], why, master_id_of_plan[tgt]))
    for k, tgt in CAT_DUP.items():
        removed.append(("ADMIN-" + k, "Catalogue (832)", catalogue[k], f"Duplicate of plan {tgt}", master_id_of_plan[tgt]))
    for k, tgt in CAT_OVERLAP.items():
        removed.append(("ADMIN-" + k, "Catalogue (832)", catalogue[k], f"Overlaps plan {tgt}; merged (plan case scope widened)", master_id_of_plan[tgt]))
    wf_id = next(r["id"] for r in rows if r["legacy"].startswith("Workflow"))
    for k, why in E2E_DUP.items():
        removed.append((k, "Catalogue (269) E2E", old[k], why, wf_id))
    # 269-catalogue Fleet section = older copies of 832 FLEET ids
    old_map = {1: 1, 2: 2, 3: 3, 4: 4, 5: 14, **{i: i + 18 for i in range(6, 12)}, **{i: i + 18 for i in range(12, 18)},
               **{i: i + 55 for i in range(18, 37)}}
    for i, j in old_map.items():
        new_cid = f"FLEET-{j:03d}"
        tgt = master_id_of_plan.get("ADMIN-" + new_cid) or master_id_of_plan.get(CAT_DUP.get(new_cid, ""), "")
        removed.append((f"ADMIN-FLEET-{i:03d} (269)", "Catalogue (269) Fleet", old[f"ADMIN-FLEET-{i:03d}"],
                        f"Older copy of 832 ADMIN-{new_cid} (different number)", tgt))

    # summaries
    by_mod = OrderedDict()
    for r in rows:
        d = by_mod.setdefault(r["module_name"], OrderedDict())
        d[r["sub"]] = d.get(r["sub"], 0) + 1
    origin = Counter(r["origin"] for r in rows)
    cats = Counter(TAG[t] for r in rows for t in r["tags"])
    types = Counter(r["type_name"] for r in rows)
    execs = Counter("Executed – Pass" if r["exec"].startswith("Pass") else "Executed – Fail" if r["exec"].startswith("Fail")
                    else "Blocked" if r["exec"].startswith("Blocked") else "Executed (workflow run)" if r["exec"].startswith("Executed")
                    else "Partially executed" if r["exec"].startswith("Partially") else "Logged Not Run" if r["exec"].startswith("Not Run")
                    else "Not executed" for r in rows)
    mod_origin = OrderedDict()
    for r in rows:
        d = mod_origin.setdefault(r["module_name"], Counter())
        d["Existing" if r["origin"].startswith("Existing") else "New"] += 1
    summary = dict(total=len(rows), modules=by_mod, origin=dict(origin), categories=dict(cats.most_common()),
                   types=dict(types.most_common()), execution=dict(execs.most_common()),
                   module_origin={k: dict(v) for k, v in mod_origin.items()}, removed=len(removed),
                   unconfirmed=UNCONFIRMED, confirm_needed=sum(1 for r in rows if r["note"]))

    (OUT / "exports").mkdir(parents=True, exist_ok=True)
    cols = [("id", "Master ID"), ("module_name", "Module"), ("sub", "Submodule"), ("title", "Use case"),
            ("categories", "Category tags"), ("type_name", "Scenario type"), ("origin", "Origin"),
            ("legacy", "Legacy / merged IDs"), ("exec", "Latest execution"), ("note", "Confirmation needed / notes"),
            ("evidence", "Basis / evidence")]
    with open(OUT / "exports" / "Admin_Web_Master_Use_Case_Inventory.csv", "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow([c[1] for c in cols])
        for r in rows:
            w.writerow([r[c[0]] for c in cols])
    (OUT / "exports" / "Admin_Web_Master_Use_Case_Inventory.json").write_text(json.dumps(dict(summary=summary, cases=[
        {c[1]: r[c[0]] for c in cols} for r in rows], removed=[dict(zip(("Legacy ID", "Source", "Title", "Reason", "Kept as"), x)) for x in removed]),
        indent=1, ensure_ascii=False), encoding="utf-8")

    wb = Workbook()
    head = Font(bold=True, color="FFFFFF")
    fill = PatternFill("solid", fgColor="1F5FAE")
    wrap = Alignment(wrap_text=True, vertical="top")

    def sheet(ws, header, data, widths):
        ws.append(header)
        for c in ws[1]:
            c.font, c.fill, c.alignment = head, fill, wrap
        for row in data:
            ws.append(list(row))
        for i, wdt in enumerate(widths):
            ws.column_dimensions[chr(65 + i)].width = wdt
        for row in ws.iter_rows(min_row=2):
            for c in row:
                c.alignment = wrap
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions

    ws = wb.active
    ws.title = "Master Inventory"
    sheet(ws, [c[1] for c in cols], ([r[c[0]] for c in cols] for r in rows), [15, 26, 24, 60, 28, 14, 30, 30, 32, 45, 32])
    ws2 = wb.create_sheet("Summary")
    data = [("Total unique use cases", len(rows)), ("", "")]
    data += [("ORIGIN", "")] + list(origin.items()) + [("", "")]
    data += [("CATEGORY TAGS (a case can carry several)", "")] + list(cats.most_common()) + [("", "")]
    data += [("SCENARIO TYPE", "")] + list(types.most_common()) + [("", "")]
    data += [("EXECUTION STATUS", "")] + list(execs.most_common()) + [("", "")]
    data += [("Duplicate records removed", len(removed))]
    sheet(ws2, ["Item", "Count"], data, [48, 12])
    ws3 = wb.create_sheet("Module Breakdown")
    mdata = []
    for m, subs in by_mod.items():
        mo = mod_origin[m]
        mdata.append((m, "(module total)", sum(subs.values()), mo.get("Existing", 0), mo.get("New", 0)))
        for s, n in subs.items():
            ex = sum(1 for r in rows if r["module_name"] == m and r["sub"] == s and r["origin"].startswith("Existing"))
            mdata.append(("", s, n, ex, n - ex))
    mdata.append(("TOTAL", "", len(rows), sum(v.get("Existing", 0) for v in mod_origin.values()), sum(v.get("New", 0) for v in mod_origin.values())))
    sheet(ws3, ["Module", "Submodule", "Use cases", "Existing", "New"], mdata, [34, 34, 11, 10, 8])
    ws4 = wb.create_sheet("Removed Duplicates")
    sheet(ws4, ["Legacy ID", "Source", "Title", "Reason", "Kept as (master ID)"], removed, [26, 22, 60, 45, 18])
    ws5 = wb.create_sheet("Coverage Not Confirmed")
    sheet(ws5, ["Area", "Why coverage cannot be confirmed"], UNCONFIRMED, [40, 100])
    wb.save(OUT / "Admin_Web_Master_Use_Case_Inventory.xlsx")

    print(json.dumps({k: summary[k] for k in ("total", "origin", "categories", "types", "execution", "removed", "confirm_needed")}, indent=1))
    for m, subs in by_mod.items():
        print(f"{m}: {sum(subs.values())}  {dict(subs)}")


if __name__ == "__main__":
    main()
