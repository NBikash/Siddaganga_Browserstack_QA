"""Interim scenario document for the 4 fully explored modules (Authentication, Global Navigation & Header,
Dashboard, Lead Management) + the exploration status of all 17 modules.

Reads only documentation/source/*.py (hand-written from exploration data). Writes only documentation/interim/.
Run: python scripts/build_interim.py
"""
import re
import sys
from collections import OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "documentation" / "source"
OUT = ROOT / "documentation" / "interim"
sys.path.insert(0, str(SRC))
from manual_cases import MANUAL_CASES  # noqa: E402
from interim_cases import INTERIM_CASES  # noqa: E402

MODULE_ORDER = ["Authentication", "Global Navigation & Header", "Dashboard", "Lead Management"]
CODES = {"Authentication": "AUTH", "Global Navigation & Header": "NAV", "Dashboard": "DASH", "Lead Management": "LEAD"}
SCREEN_MODULE = {"auth-login": "Authentication", "auth-forgot": "Authentication", "auth-otp": "Authentication",
                 "nav-sidebar": "Global Navigation & Header", "nav-header": "Global Navigation & Header"}
FEATURE = {"auth-login": "Login", "auth-forgot": "Forgot Password", "auth-otp": "Login with OTP", "nav-sidebar": "Sidebar", "nav-header": "Header"}

# Interim rule: "Documented" only where the expected result was actually observed. These manual cases describe
# steps that were only partly observed, so they are downgraded here (source files untouched).
DOWNGRADE = {
    "Toggle password visibility": "Eye icon observed; toggling not exercised",
    "Return to Login from Forgot Password": "Link target observed (href /login); not clicked",
    "Switch to 'Log in with OTP' and back": "OTP view observed; return link not clicked",
    "Expand and collapse sidebar groups": "Expansion observed; collapse not exercised",
    "Active menu item is highlighted": "Highlight observed on Main Category only",
    "Browser Back/Forward between modules": "Not exercised",
}
TYPE_MAP = {"Integration": "Functional", "Workflow": "Functional"}

LOGIN = "User is logged in to Admin Web (DEV) as Superadmin."

# Verified exploration status (reconciled 2026-10-30 from exploration-logs/raw/inspect/*.json)
STATUS_ROWS = [
    ("Authentication", 3, 3, 0, "Fully explored (read-only limits)", "Steps after 'Send OTP' not opened (would send email)."),
    ("Global Navigation & Header", 2, 2, 0, "Fully explored (read-only limits)", "Logout not clicked; Profile page renders empty."),
    ("Dashboard", 1, 1, 0, "Fully explored", "All tables and both Add dialogs read."),
    ("Lead Management", 1, 1, 0, "Fully explored", "List, Add New Lead, row menu and Lead Details read."),
    ("Role & Permission", 3, 3, 0, "Partially explored", "'+ Add User' / '+ Add New Role' not detected; Access dialogs showed 0 fields."),
    ("Employee Management", 6, 6, 0, "Partially explored", "Add Employee / Add Request clicks timed out on 2 panels; Client Request row menu empty; Employee Onboarding panel not distinct."),
    ("Fleet & Vehicle Management", 9, 8, 1, "Partially explored", "'Approved & Track Live Trips' view not reached (redo)."),
    ("Booking & Operations", 4, 3, 1, "Partially explored", "Pre-Bookings pending; Booked/Completed panel switch not confirmed."),
    ("Inquiry Management", 1, 0, 1, "Not explored (first-level only)", ""),
    ("Client Management", 13, 8, 5, "Partially explored", "5 views pending; Manage Invoice Signatures / Manage Client Category gaps."),
    ("Vendor Management", 6, 0, 6, "Not explored (first-level only)", ""),
    ("Category Management", 3, 1, 2, "Partially explored", "Sub Category, Manage Unit Type pending."),
    ("Service & Maintenance", 11, 0, 11, "Not explored (first-level only)", ""),
    ("Financial Management", 12, 0, 12, "Not explored (first-level only)", ""),
    ("Inventory Management", 5, 0, 5, "Not explored (first-level only)", ""),
    ("Content Management System", 12, 0, 12, "Not explored (first-level only)", ""),
    ("Payment And Refund Management", 3, 0, 3, "Not explored (first-level only)", ""),
]

COLS = ["Scenario ID", "Module", "Feature", "Scenario Title", "Scenario Type", "Preconditions", "Test Data", "Test Steps",
        "Expected Results", "Priority", "Status", "Observation Basis", "Evidence", "Related"]


def collect():
    rows = []
    for mc in MANUAL_CASES:
        mod = SCREEN_MODULE.get(mc["screen_key"])
        if not mod:
            continue  # E2E / other modules are excluded from the interim document
        status, basis = mc.get("status", "Documented"), mc.get("basis", "Observed UI")
        if mc["title"] in DOWNGRADE:
            status, basis = "Needs Verification", DOWNGRADE[mc["title"]]
        rows.append(dict(module=mod, feature=mc.get("func") or FEATURE[mc["screen_key"]], title=mc["title"],
                         type=TYPE_MAP.get(mc["type"], mc["type"]), pre=mc.get("pre") or [LOGIN], data=mc.get("data", "N/A"),
                         steps=mc["steps"], expected=mc["expected"], priority=mc.get("priority", "High"), status=status,
                         basis=basis, evidence=mc.get("evidence", ""), related=mc.get("related", "") or mc.get("deps", "")))
    for c in INTERIM_CASES:
        rows.append(dict(c, type=TYPE_MAP.get(c["type"], c["type"])))
    by_mod = OrderedDict((m, []) for m in MODULE_ORDER)
    for r in rows:
        by_mod[r["module"]].append(r)
    for m, rs in by_mod.items():
        for i, r in enumerate(rs, 1):
            r["id"] = f"ADMIN-{CODES[m]}-{i:03d}"
    return by_mod


def fmt_list(items, numbered):
    items = items if isinstance(items, list) else [items]
    return "\n".join(f"{i}. {x}" if numbered else f"- {x}" for i, x in enumerate(items, 1))


def style(ws, widths):
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = PatternFill("solid", fgColor="7A1E2C")
        c.alignment = Alignment(wrap_text=True, vertical="center")
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = ws.dimensions


def main():
    by_mod = collect()
    OUT.mkdir(parents=True, exist_ok=True)
    allrows = [r for rs in by_mod.values() for r in rs]
    types = ["Positive", "Negative", "Boundary", "Validation", "UI", "Navigation", "Functional"]

    wb = Workbook()
    ws = wb.active
    ws.title = "Summary"
    ws.append(["Module", "Scenarios", *types, "Documented", "Needs Verification", "Blocked", "High", "Medium", "Low"])
    for m, rs in by_mod.items():
        cnt = lambda k, v: sum(1 for r in rs if r[k] == v)
        ws.append([m, len(rs), *[cnt("type", t) for t in types], cnt("status", "Documented"), cnt("status", "Needs Verification"),
                   cnt("status", "Blocked"), cnt("priority", "High"), cnt("priority", "Medium"), cnt("priority", "Low")])
    tot = lambda k, v: sum(1 for r in allrows if r[k] == v)
    ws.append(["TOTAL", len(allrows), *[tot("type", t) for t in types], tot("status", "Documented"), tot("status", "Needs Verification"),
               tot("status", "Blocked"), tot("priority", "High"), tot("priority", "Medium"), tot("priority", "Low")])
    style(ws, [30] + [11] * 16)

    for m, rs in by_mod.items():
        sh = wb.create_sheet(m[:31].replace("&", "and"))
        sh.append(COLS)
        for r in rs:
            sh.append([r["id"], r["module"], r["feature"], r["title"], r["type"], fmt_list(r["pre"], False), r["data"],
                       fmt_list(r["steps"], True), fmt_list(r["expected"], False), r["priority"], r["status"], r["basis"], r["evidence"], r["related"]])
        style(sh, [16, 18, 20, 42, 12, 34, 26, 60, 64, 9, 16, 30, 40, 24])

    st = wb.create_sheet("Exploration Status")
    st.append(["Module", "Total views", "Inspected views", "Pending views", "Exploration status", "Notes", "In this interim document?"])
    for row in STATUS_ROWS:
        st.append([*row, "Yes" if row[0] in MODULE_ORDER else "No – pending exploration"])
    st.append(["TOTAL", 95, 36, 59, "4 fully / 6 partially / 7 not explored", "", ""])
    style(st, [30, 11, 11, 11, 30, 70, 22])

    lg = wb.create_sheet("Legend")
    for row in [["Item", "Meaning"],
                ["Status = Documented", "The expected result was observed during read-only exploration."],
                ["Status = Needs Verification", "Expected result depends on a submission, a control that was not clicked, or a business rule not visible in the UI. Confirm before/while executing."],
                ["Status = Blocked", "Cannot be executed with the current access (e.g. only a Superadmin account was available)."],
                ["Observation Basis", "What the scenario is grounded on (what was seen vs inferred)."],
                ["Preconditions containing 'Explicit approval obtained'", "Execution writes data or sends communication in DEV – get approval first and use QA-TEST- prefixed data."],
                ["Scope", "Interim document: only the 4 fully explored modules. The other 13 modules are listed on 'Exploration Status' and are NOT covered here."],
                ["Execution", "No scenario has been executed. Generated 2026-10-30 from read-only exploration (Superadmin)."]]:
        lg.append(row)
    style(lg, [44, 120])
    wb.save(OUT / "Admin_Web_Interim_Scenarios.xlsx")

    md = ["# Admin Web – Interim Test Scenarios (4 fully explored modules)", "",
          "**Status:** interim – for review. Covers only **Authentication, Global Navigation & Header, Dashboard, Lead Management**.",
          "No scenario has been executed. Source: read-only exploration of DEV (`https://dari-dev.siddagangatravels.com`) as Superadmin, 2026-10-30.", "",
          "**Status rule:** *Documented* = expected result observed during exploration · *Needs Verification* = depends on a submission, an unclicked control or an unconfirmed business rule · *Blocked* = not executable with current access.",
          "Scenarios whose preconditions say *Explicit approval obtained* write data or send communications in DEV.", "",
          "## Summary", "", "| Module | Scenarios | Documented | Needs Verification | Blocked |", "|---|---|---|---|---|"]
    for m, rs in by_mod.items():
        md.append(f"| {m} | {len(rs)} | {sum(r['status'] == 'Documented' for r in rs)} | {sum(r['status'] == 'Needs Verification' for r in rs)} | {sum(r['status'] == 'Blocked' for r in rs)} |")
    md.append(f"| **Total** | **{len(allrows)}** | **{tot('status', 'Documented')}** | **{tot('status', 'Needs Verification')}** | **{tot('status', 'Blocked')}** |")
    md += ["", "## Exploration status of all modules (not covered here unless fully explored)", "",
           "| Module | Total views | Inspected | Pending | Status | Notes |", "|---|---|---|---|---|---|"]
    for row in STATUS_ROWS:
        md.append("| " + " | ".join(str(x) for x in row) + " |")
    md.append("| **Total** | **95** | **36** | **59** | 4 fully / 6 partially / 7 not explored | |")
    for m, rs in by_mod.items():
        md += ["", f"## {m}", "", "| ID | Feature | Scenario | Type | Priority | Status |", "|---|---|---|---|---|---|"]
        for r in rs:
            md.append(f"| [{r['id']}](#{r['id'].lower()}) | {r['feature']} | {r['title']} | {r['type']} | {r['priority']} | {r['status']} |")
        for r in rs:
            md += ["", f"### {r['id']}", "", f"**{r['title']}**", "",
                   f"- **Module / Feature:** {r['module']} / {r['feature']}",
                   f"- **Type:** {r['type']} · **Priority:** {r['priority']} · **Status:** {r['status']}",
                   f"- **Observation basis:** {r['basis']}", "",
                   "**Preconditions**", "", fmt_list(r["pre"], False), ""]
            if r["data"] and r["data"] != "N/A":
                md += [f"**Test data:** {r['data']}", ""]
            md += ["**Test steps**", "", fmt_list(r["steps"], True), "", "**Expected results**", "", fmt_list(r["expected"], False), ""]
            if r["evidence"]:
                md.append("**Evidence:** " + ", ".join(f"`{e.strip()}`" for e in r["evidence"].split(",") if e.strip()))
            if r["related"]:
                md.append(f"**Related:** {r['related']}")
    (OUT / "Admin_Web_Interim_Scenarios.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print({m: len(rs) for m, rs in by_mod.items()}, "total", len(allrows),
          "documented", tot("status", "Documented"), "NV", tot("status", "Needs Verification"), "blocked", tot("status", "Blocked"))


if __name__ == "__main__":
    main()
