"""Build the manager-review Excel workbook from the consolidated master inventory.

Source data: documentation/01_Master_Inventory/exports/Admin_Web_Master_Use_Case_Inventory.json
(written by build_master_inventory.py). This script only re-presents that data:
no case is added, removed, renumbered or re-statused. Labels are normalised to the
review vocabulary (see LABEL MAPS below) and the original wording is kept in Remarks.

Run from Admin-Web:  python scripts/format_master_workbook.py
"""
import json
import re
import sys
from collections import Counter, OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.properties import PageSetupProperties

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / "documentation" / "01_Master_Inventory"
SRC = DIR / "exports" / "Admin_Web_Master_Use_Case_Inventory.json"
OUT = DIR / "Admin_Web_Master_Use_Case_Inventory.xlsx"

# ---------------------------------------------------------------- LABEL MAPS
CATEGORY_ORDER = ["Functional", "UI", "UX", "Validation", "Integration",
                  "Security / Role-based", "Data Consistency", "Workflow Transition",
                  "Performance", "Compatibility", "Content / Terminology"]
CAT_MAP = {"Data consistency": "Data Consistency", "Workflow transition": "Workflow Transition"}
TYPE_MAP = {"Alternate flow": "Alternate Flow", "End-to-end": "End-to-End"}
TYPE_ORDER = ["Positive", "Negative", "Boundary", "Exception", "Alternate Flow", "End-to-End"]
EXEC_ORDER = ["Pass", "Fail", "Blocked", "Partial", "Not Run", "Never Executed"]


def exec_status(raw):
    """Map the inventory's 'Latest execution' text to the review status list."""
    if raw.startswith("Not executed"):
        return "Never Executed", ""
    if raw.startswith("Partially executed"):
        return "Partial", raw
    if raw.startswith("Executed 12 Nov"):
        # Workflow run S0-S23: 25 Pass, S14 Blocked, S15 Not Run -> not a full Pass.
        return "Partial", raw
    for s in ("Pass", "Fail", "Blocked", "Not Run"):
        if raw.startswith(s):
            return s, raw
    raise ValueError(f"Unmapped execution status: {raw}")


def title_of(text):
    """Short title = leading clause of the use-case text (no new wording)."""
    t = re.split(r":\s|;\s|\s→\s|\s—\s|\s\(", text, maxsplit=1)[0].strip()
    if len(t) > 80:
        t = t[:77].rsplit(" ", 1)[0] + "…"
    return t


# ---------------------------------------------------------------- STYLES
FONT = "Arial"
NAVY = "1F3864"
f_base = Font(name=FONT, size=10)
f_bold = Font(name=FONT, size=10, bold=True)
f_head = Font(name=FONT, size=10, bold=True, color="FFFFFF")
f_title = Font(name=FONT, size=14, bold=True, color=NAVY)
f_sub = Font(name=FONT, size=11, bold=True, color=NAVY)
f_note = Font(name=FONT, size=9, italic=True, color="595959")
fill_head = PatternFill("solid", fgColor=NAVY)
fill_band = PatternFill("solid", fgColor="EEF2F8")
fill_total = PatternFill("solid", fgColor="D9E1F2")
EXEC_FILL = {"Pass": "E2EFDA", "Fail": "FBE2D5", "Blocked": "FFF2CC",
             "Partial": "FFF2CC", "Not Run": "EDEDED", "Never Executed": None}
ORIGIN_FILL = {"Newly Identified": "FFF2CC"}
thin = Side(style="thin", color="BFBFBF")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap_top = Alignment(wrap_text=True, vertical="top")
center_top = Alignment(horizontal="center", vertical="top", wrap_text=True)
head_align = Alignment(horizontal="center", vertical="center", wrap_text=True)

COLUMNS = [  # (header, width, wrap/centre)
    ("Sl. No.", 7, "c"), ("Use Case ID", 13, "c"), ("Module", 22, "w"),
    ("Submodule", 20, "w"), ("Use Case Title", 34, "w"),
    ("Scenario / Description", 60, "w"), ("Category", 24, "w"),
    ("Scenario Type", 13, "c"), ("Origin", 14, "c"),
    ("Execution Status", 14, "c"), ("Remarks", 55, "w"),
]


def header_row(ws, row, headers, widths=None):
    for i, h in enumerate(headers, 1):
        c = ws.cell(row=row, column=i, value=h)
        c.font, c.fill, c.alignment, c.border = f_head, fill_head, head_align, border
        if widths:
            ws.column_dimensions[get_column_letter(i)].width = widths[i - 1]
    ws.row_dimensions[row].height = 30


def setup_print(ws, landscape=True):
    ws.page_setup.orientation = "landscape" if landscape else "portrait"
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.sheet_properties.pageSetUpPr = PageSetupProperties(fitToPage=True)
    ws.page_setup.fitToWidth, ws.page_setup.fitToHeight = 1, 0
    ws.print_options.gridLines = False


def write_cases(ws, rows, first_row=2, band_by_module=True):
    header_row(ws, first_row - 1, [c[0] for c in COLUMNS], [c[1] for c in COLUMNS])
    prev_mod, band = None, False
    for i, r in enumerate(rows):
        rr = first_row + i
        if band_by_module and r["Module"] != prev_mod:
            band, prev_mod = not band, r["Module"]
        elif not band_by_module:
            band = (i % 2 == 1)
        vals = [i + 1] + [r[h] for h, _, _ in COLUMNS[1:]]
        for j, v in enumerate(vals, 1):
            c = ws.cell(row=rr, column=j, value=v)
            c.font, c.border = f_base, border
            c.alignment = center_top if COLUMNS[j - 1][2] == "c" else wrap_top
            if band:
                c.fill = fill_band
        st = ws.cell(row=rr, column=10)
        if EXEC_FILL.get(r["Execution Status"]):
            st.fill = PatternFill("solid", fgColor=EXEC_FILL[r["Execution Status"]])
        if r["Origin"] in ORIGIN_FILL:
            ws.cell(row=rr, column=9).fill = PatternFill("solid", fgColor=ORIGIN_FILL[r["Origin"]])
    last = first_row + len(rows) - 1
    ws.auto_filter.ref = f"A{first_row - 1}:{get_column_letter(len(COLUMNS))}{last}"
    ws.freeze_panes = ws.cell(row=first_row, column=3)
    ws.print_title_rows = f"{first_row - 1}:{first_row - 1}"
    setup_print(ws)
    return last


def main():
    data = json.loads(SRC.read_text(encoding="utf-8"))
    cases, summary, removed = data["cases"], data["summary"], data["removed"]
    assert len(cases) == 326 and len({c["Master ID"] for c in cases}) == 326

    rows = []
    for c in cases:
        cats = [CAT_MAP.get(t.strip(), t.strip()) for t in c["Category tags"].split(",") if t.strip()]
        assert all(t in CATEGORY_ORDER for t in cats), cats
        cats = sorted(set(cats), key=CATEGORY_ORDER.index)
        status, run_note = exec_status(c["Latest execution"])
        origin = "Newly Identified" if c["Origin"].startswith("New") else "Existing"
        remarks = []
        if c["Confirmation needed / notes"]:
            remarks.append("Confirm: " + c["Confirmation needed / notes"])
        if run_note:
            remarks.append("Run: " + run_note)
        if c["Legacy / merged IDs"]:
            remarks.append("Source IDs: " + c["Legacy / merged IDs"])
        remarks.append("Source: " + c["Origin"] + (f" ({c['Basis / evidence']})" if c["Basis / evidence"] else ""))
        rows.append(OrderedDict([
            ("Use Case ID", c["Master ID"]), ("Module", c["Module"]),
            ("Submodule", c["Submodule"]), ("Use Case Title", title_of(c["Use case"])),
            ("Scenario / Description", c["Use case"]), ("Category", ", ".join(cats)),
            ("Scenario Type", TYPE_MAP.get(c["Scenario type"], c["Scenario type"])),
            ("Origin", origin), ("Execution Status", status),
            ("Remarks", "\n".join(remarks)), ("_confirm", bool(c["Confirmation needed / notes"])),
        ]))
    # keep the inventory's order (already grouped by module, IDs ascending)
    modules = list(OrderedDict.fromkeys(r["Module"] for r in rows))
    assert len(modules) == 17

    wb = Workbook()
    ws_sum = wb.active
    ws_sum.title = "Summary"
    ws_mi = wb.create_sheet("Master Inventory")
    last = write_cases(ws_mi, rows)
    MI = "'Master Inventory'"
    rng = lambda col: f"{MI}!${col}$2:${col}${last}"
    R_MOD, R_CAT, R_TYPE, R_ORI, R_EXE = rng("C"), rng("G"), rng("H"), rng("I"), rng("J")

    # ---- module sheets
    mod_sheet = {}
    for m in modules:
        num, name = m.split(" ", 1)
        short = (name.replace("Management", "Mgmt").replace("Approved & Track Live Trips", "Approved & Track")
                 .replace("Advance Payment (all stages)", "Advance Payment")
                 .replace("Cross-module & End-to-End", "Cross-module & E2E")
                 .replace("Compatibility & Performance", "Compat & Perf"))
        sname = f"{num} {short}"[:31]
        ws = wb.create_sheet(sname)
        mod_sheet[m] = sname
        ws.cell(row=1, column=1, value=f"{m}").font = f_title
        mrows = [r for r in rows if r["Module"] == m]
        subs = Counter(r["Submodule"] for r in mrows)
        ws.cell(row=2, column=1, value=(f"{len(mrows)} use cases · submodules: "
                + "; ".join(f"{k} ({v})" for k, v in subs.items()))).font = f_note
        ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=len(COLUMNS))
        ws.cell(row=2, column=1).alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[2].height = 15 * (1 + len(ws.cell(row=2, column=1).value) // 220)
        write_cases(ws, mrows, first_row=4, band_by_module=False)

    # ---- Summary
    ws = ws_sum
    widths = [38, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws["A1"] = "Admin-Web QA – Master Use-Case Inventory"
    ws["A1"].font = f_title
    ws["A2"] = ("Lead Management → Trip Closure, plus fleet masters, advance payment, cross-module, roles, "
                "compatibility and performance. Source: consolidated inventory (build_master_inventory.py). "
                "All counts below are live formulas over the Master Inventory sheet.")
    ws["A2"].font = f_note
    ws.merge_cells("A2:L2")
    ws["A2"].alignment = Alignment(wrap_text=True)
    ws.row_dimensions[2].height = 28

    r = 4
    def label(row, text, bold=False):
        c = ws.cell(row=row, column=1, value=text)
        c.font = f_bold if bold else f_base
        c.border = border
        return c

    def num(row, col, formula, bold=False, fill=None):
        c = ws.cell(row=row, column=col, value=formula)
        c.font = f_bold if bold else f_base
        c.alignment = Alignment(horizontal="center")
        c.border = border
        c.number_format = "#,##0"
        if fill:
            c.fill = fill
        return c

    def section(row, text):
        ws.cell(row=row, column=1, value=text).font = f_sub
        return row + 1

    # Key figures
    r = section(r, "Key figures")
    key_rows = [
        ("Total unique use cases", f"=COUNTA({MI}!$B$2:$B${last})"),
        ("Existing", f'=COUNTIF({R_ORI},"Existing")'),
        ("Newly Identified", f'=COUNTIF({R_ORI},"Newly Identified")'),
        ("Never executed", f'=COUNTIF({R_EXE},"Never Executed")'),
        ("Executed at least once (Pass / Fail / Blocked / Partial)",
         f'=COUNTIF({R_EXE},"Pass")+COUNTIF({R_EXE},"Fail")+COUNTIF({R_EXE},"Blocked")+COUNTIF({R_EXE},"Partial")'),
        ("Newly Identified needing business / requirement confirmation",
         f'=COUNTIFS({R_ORI},"Newly Identified",{MI}!$K$2:$K${last},"Confirm:*")'),
        ("Duplicate / overlapping records removed during consolidation", f"=COUNTA('Removed Duplicates'!$A$2:$A${len(removed) + 1})"),
        ("Areas where coverage is not confirmed", f"=COUNTA('Coverage Not Confirmed'!$B$2:$B${len(summary['unconfirmed']) + 1})"),
    ]
    key_row_of = {}
    for text, f in key_rows:
        label(r, text, bold=(text == "Total unique use cases"))
        num(r, 2, f, bold=(text == "Total unique use cases"), fill=fill_total if text == "Total unique use cases" else None)
        key_row_of[text] = r
        r += 1
    r += 1

    # Module-wise
    r = section(r, "Module-wise counts")
    hdr = ["Module", "Total", "Existing", "Newly Identified"] + EXEC_ORDER + ["Sheet"]
    header_row(ws, r, hdr)
    r += 1
    m_first = r
    for m in modules:
        label(r, m)
        num(r, 2, f'=COUNTIF({R_MOD},$A{r})')
        num(r, 3, f'=COUNTIFS({R_MOD},$A{r},{R_ORI},"Existing")')
        num(r, 4, f'=COUNTIFS({R_MOD},$A{r},{R_ORI},"Newly Identified")')
        for j, s in enumerate(EXEC_ORDER):
            num(r, 5 + j, f'=COUNTIFS({R_MOD},$A{r},{R_EXE},"{s}")')
        c = ws.cell(row=r, column=11, value=mod_sheet[m])
        c.hyperlink = f"#'{mod_sheet[m]}'!A1"
        c.font = Font(name=FONT, size=10, color="0563C1", underline="single")
        c.border = border
        r += 1
    m_last = r - 1
    label(r, "Total", bold=True).fill = fill_total
    for col in range(2, 11):
        L = get_column_letter(col)
        num(r, col, f"=SUM({L}{m_first}:{L}{m_last})", bold=True, fill=fill_total)
    module_total_row = r
    r += 1
    ws.cell(row=r, column=1, value="Check: module total equals unique total").font = f_note
    chk = ws.cell(row=r, column=2,
                  value=f'=IF(B{module_total_row}=B{key_row_of["Total unique use cases"]},"OK","MISMATCH")')
    chk.font, chk.alignment = f_bold, Alignment(horizontal="center")
    r += 2

    # Category-wise
    r = section(r, "Category-wise counts (overlapping – one use case can carry several categories)")
    header_row(ws, r, ["Category", "Use cases", "Existing", "Newly Identified", "Never Executed"])
    r += 1
    c_first = r
    for cat in CATEGORY_ORDER:
        label(r, cat)
        crit = f'"*"&$A{r}&"*"'
        num(r, 2, f"=COUNTIF({R_CAT},{crit})")
        num(r, 3, f'=COUNTIFS({R_CAT},{crit},{R_ORI},"Existing")')
        num(r, 4, f'=COUNTIFS({R_CAT},{crit},{R_ORI},"Newly Identified")')
        num(r, 5, f'=COUNTIFS({R_CAT},{crit},{R_EXE},"Never Executed")')
        r += 1
    label(r, "Sum of tags (exceeds unique total because of multi-tagging)", bold=True).fill = fill_total
    num(r, 2, f"=SUM(B{c_first}:B{r - 1})", bold=True, fill=fill_total)
    r += 2

    # Module x Category matrix (for assignment)
    r = section(r, "Module × Category matrix (overlapping counts, for category-wise assignment)")
    abbrev = ["Functional", "UI", "UX", "Validation", "Integration", "Security / Role", "Data Consist.",
              "Workflow", "Perf.", "Compat.", "Content"]
    header_row(ws, r, ["Module"] + abbrev)
    r += 1
    for m in modules:
        label(r, m)
        for j, cat in enumerate(CATEGORY_ORDER):
            num(r, 2 + j, f'=COUNTIFS({R_MOD},$A{r},{R_CAT},"*{cat}*")')
        r += 1
    r += 1

    # Scenario type
    r = section(r, "Scenario-type counts")
    header_row(ws, r, ["Scenario Type", "Use cases"])
    r += 1
    t_first = r
    for t in TYPE_ORDER:
        label(r, t)
        num(r, 2, f"=COUNTIF({R_TYPE},$A{r})")
        r += 1
    label(r, "Total", bold=True).fill = fill_total
    num(r, 2, f"=SUM(B{t_first}:B{r - 1})", bold=True, fill=fill_total)
    r += 1
    ws.cell(row=r, column=1, value=("'Alternate Flow' is kept as recorded in the consolidated inventory "
                                    "(27 cases); it was not re-labelled to avoid changing scenario data.")).font = f_note
    r += 2

    # Execution status
    r = section(r, "Execution status counts (statuses unchanged from the recorded runs)")
    header_row(ws, r, ["Execution Status", "Use cases"])
    r += 1
    e_first = r
    for s in EXEC_ORDER:
        label(r, s)
        num(r, 2, f"=COUNTIF({R_EXE},$A{r})")
        r += 1
    label(r, "Total", bold=True).fill = fill_total
    num(r, 2, f"=SUM(B{e_first}:B{r - 1})", bold=True, fill=fill_total)
    r += 1
    for note in [
        "Pass / Fail / Blocked / Not Run: functional run admin-web-20261113-1016-FUNC (run ID per case in Remarks).",
        "Partial (2): AW-DRV Replace Driver form opened but change not saved; end-to-end workflow run "
        "admin-web-20261112-2229-INQ2TRIP (25 of 27 steps Pass, S14 Blocked, S15 Not Run).",
        "Never Executed: in the inventory but never run in any recorded execution. No unexecuted case is marked Pass.",
    ]:
        ws.cell(row=r, column=1, value=note).font = f_note
        r += 1
    r += 1

    # Unconfirmed areas (pointer + short list)
    r = section(r, "Areas where coverage is not confirmed (details: 'Coverage Not Confirmed' sheet)")
    for i, (area, _) in enumerate(summary["unconfirmed"], 1):
        label(r, f"{i}. {area}")
        r += 1
    ws.freeze_panes = "A4"
    setup_print(ws, landscape=True)

    # ---- Coverage Not Confirmed
    ws = wb.create_sheet("Coverage Not Confirmed")
    header_row(ws, 1, ["#", "Area", "Why coverage cannot be confirmed"], [5, 42, 110])
    for i, (area, why) in enumerate(summary["unconfirmed"], 1):
        for j, v in enumerate([i, area, why], 1):
            c = ws.cell(row=i + 1, column=j, value=v)
            c.font, c.border = f_base, border
            c.alignment = center_top if j == 1 else wrap_top
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:C{len(summary['unconfirmed']) + 1}"
    setup_print(ws)

    # ---- Removed Duplicates
    ws = wb.create_sheet("Removed Duplicates")
    rh = list(removed[0].keys())
    wmap = {"Legacy ID": 16, "Source": 26, "Title": 50, "Reason": 70, "Kept as": 14}
    header_row(ws, 1, rh, [wmap.get(h, 20) for h in rh])
    for i, rec in enumerate(removed, 2):
        for j, h in enumerate(rh, 1):
            c = ws.cell(row=i, column=j, value=rec[h])
            c.font, c.border = f_base, border
            c.alignment = center_top if h in ("Legacy ID", "Kept as") else wrap_top
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(rh))}{len(removed) + 1}"
    setup_print(ws)

    # Category legend
    ws = wb.create_sheet("Category Legend")
    legend = [
        ("Functional", "Feature behaves as intended: actions, transitions, saves, filters, searches."),
        ("UI", "Layout, columns, controls, labels, states visible on screen."),
        ("UX", "Ease of use, feedback, navigation flow, clarity of messages."),
        ("Validation", "Field rules, mandatory checks, invalid / boundary input handling."),
        ("Integration", "Data or events crossing modules or apps (User-Web, notifications, invoices)."),
        ("Security / Role-based", "Access by role, URL access, irreversible-action protection, data exposure."),
        ("Data Consistency", "Same record shows the same values across lists, detail views and stages."),
        ("Workflow Transition", "Record moves correctly from one lifecycle stage to the next."),
        ("Performance", "Response and load behaviour (no documented targets yet)."),
        ("Compatibility", "Browsers / resolutions (no documented targets yet)."),
        ("Content / Terminology", "Wording, labels and naming consistency."),
    ]
    header_row(ws, 1, ["Category", "Meaning in this inventory"], [24, 90])
    for i, (k, v) in enumerate(legend, 2):
        for j, val in enumerate([k, v], 1):
            c = ws.cell(row=i, column=j, value=val)
            c.font, c.border, c.alignment = (f_bold if j == 1 else f_base), border, wrap_top
    ws.freeze_panes = "A2"

    # order: Summary, Master Inventory, module sheets, then reference sheets
    wb.calculation.fullCalcOnLoad = True
    wb.save(OUT)

    # ---- independent verification in Python (formulas are evaluated by Excel on open)
    per_mod = Counter(r["Module"] for r in rows)
    assert sum(per_mod.values()) == 326
    print("Sheets:", wb.sheetnames)
    print("Rows:", len(rows), "| modules:", len(per_mod))
    for m in modules:
        print(f"  {m}: {per_mod[m]}")
    print("Origin:", dict(Counter(r["Origin"] for r in rows)))
    print("Execution:", dict(Counter(r["Execution Status"] for r in rows)))
    print("Types:", dict(Counter(r["Scenario Type"] for r in rows)))
    cc = Counter(t for r in rows for t in r["Category"].split(", "))
    print("Categories:", {k: cc[k] for k in CATEGORY_ORDER})
    # wildcard COUNTIF safety: no category name is a substring of another case's other tags
    for cat in CATEGORY_ORDER:
        wild = sum(cat.lower() in r["Category"].lower() for r in rows)
        assert wild == cc[cat], (cat, wild, cc[cat])
    print("New needing confirmation:", sum(r["_confirm"] for r in rows if r["Origin"] == "Newly Identified"))
    print("Saved:", OUT)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
