"""Builds the Admin Web use-case repository from read-only exploration data.

Inputs : exploration-logs/raw/route-scan.json, exploration-logs/raw/inspect/*.json,
         documentation/source/manual_cases.py (hand-written workflow / module-specific cases)
Outputs: documentation/Admin_Web_Use_Cases.xlsx, documentation/Admin_Web_Use_Cases.md,
         documentation/Coverage_Matrix.xlsx, documentation/coverage-stats.json

Nothing here talks to the application. Run: python scripts/build_docs.py
"""
import json
import re
import sys
from collections import OrderedDict, defaultdict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "exploration-logs" / "raw"
DOC = ROOT / "documentation"
sys.path.insert(0, str(DOC / "source"))
from screen_meta import SCREENS, MODULES  # noqa: E402
from manual_cases import MANUAL_CASES, SCREEN_NOTES  # noqa: E402

ROLE = "Superadmin"
LOGIN_PRE = "User is logged in to Admin Web (DEV) as Superadmin."
PII_LABEL = re.compile(r"manager|driver|client|customer|employee|assigned|user|helper|reported by|name|vendor$|staff|member|contact|person|owner", re.I)
TEXT_TYPES = {"text", "textarea", "email", "tel", "search", "url"}
PAGE_SIZE = re.compile(r"^\d+$")


def clean(s):
    return re.sub(r"\s+", " ", (s or "").replace("​", "")).strip()


def opt_list(dd):
    """Dropdown options for documentation; personal-name lists are reduced to a count."""
    opts = [clean(o) for o in dd.get("options", []) if clean(o)]
    return opts


PII_VALUE = re.compile(r"\d{7,}|@|\n")


def describe_options(label, opts):
    if not opts:
        return "no options loaded (list empty when opened)"
    if PII_LABEL.search(label or "") or any(PII_VALUE.search(o) for o in opts):
        return f"{len(opts)} option(s) (names/contact data – values not recorded)"
    return ", ".join(f"'{o}'" for o in opts[:25]) + (" …" if len(opts) > 25 else "")


def label_dropdowns(fields, dropdowns):
    """Pair inspected dropdowns with the enabled combobox fields of the same form, in DOM order."""
    combos = [f for f in fields if f.get("type") == "combobox" and not f.get("disabled")]
    out = []
    for i, d in enumerate(dropdowns):
        lab = clean(combos[i].get("label")) if i < len(combos) else ""
        out.append((lab or clean(d.get("name")) or "dropdown", d))
    return out


class Case(dict):
    pass


class Builder:
    def __init__(self):
        self.cases = []
        self.counters = defaultdict(int)
        self.functionalities = []  # (module, submodule, screen, functionality, [ids])

    def add(self, meta, title, objective, steps, expected, ctype, priority="Medium", pre=None, data="N/A",
            deps="", evidence="", status="Documented", basis="Observed UI", func=None, related=""):
        code = MODULES[meta["module"]]["code"]
        self.counters[code] += 1
        cid = f"ADMIN-{code}-{self.counters[code]:03d}"
        c = Case(
            id=cid, module=meta["module"], submodule=meta.get("submodule", ""), screen=meta["screen"],
            title=title, objective=objective, role=meta.get("role", ROLE),
            pre="\n".join(pre or [LOGIN_PRE]), data=data,
            steps="\n".join(f"{i}. {s}" for i, s in enumerate(steps, 1)),
            expected="\n".join(f"- {e}" for e in expected) if isinstance(expected, list) else expected,
            type=ctype, priority=priority, deps=deps, evidence=evidence, status=status, basis=basis, related=related,
            func=func or title,
        )
        self.cases.append(c)
        return cid


def nav_steps(meta, s):
    steps = [f"In the left sidebar, {meta['nav']}."]
    for c in meta.get("click", []):
        steps.append(f"On the page, click '{c}'.")
    return steps


def gen_screen(b, key, meta, s, route_info):
    """Generate observed-UI based cases for one inspected screen."""
    ev = s.get("pageShot", "")
    page = s.get("page", {})
    tables = s.get("table", [])
    headings = [clean(h) for h in page.get("headings", []) if clean(h)]
    buttons = [clean(x) for x in page.get("buttons", []) if clean(x)]
    url = s.get("url", meta.get("route", ""))
    deps = meta.get("deps", "")
    ids_nav = []

    # 1. Navigation / page load
    exp = [f"The browser URL is `{url}`.", f"The header title reads '{meta.get('title', meta['screen'])}'."]
    if tables:
        t0 = tables[0]
        cols = [clean(c["name"]) for c in t0["columns"] if clean(c["name"])]
        if cols:
            exp.append("The list table shows the columns: " + ", ".join(cols) + ".")
    kpis = meta.get("kpis")
    if kpis:
        exp.append("The summary cards shown are: " + ", ".join(kpis) + ".")
    ids_nav.append(b.add(meta, f"Open the {meta['screen']} screen",
                         f"Verify that {meta['screen']} is reachable from navigation and renders its default view.",
                         ["Log in to Admin Web as Superadmin."] + nav_steps(meta, s) + ["Wait for the page to finish loading."],
                         exp, "Navigation", "High", evidence=ev, deps=deps, func="Screen navigation & load"))

    # 2. Direct URL / refresh persistence (only for distinct URLs)
    if not meta.get("click"):
        b.add(meta, f"Reload {meta['screen']} via its direct URL",
              "Verify the screen can be opened by URL and survives a browser refresh while the session is valid.",
              [f"While logged in, enter `https://dari-dev.siddagangatravels.com{url}` in the address bar and press Enter.",
               "Press F5 to refresh the page."],
              [f"{meta['screen']} opens directly without redirecting to /login.",
               "After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification)."],
              "Navigation", "Low", evidence=ev, func="Direct URL access")
        b.add(meta, f"Block {meta['screen']} URL without an authenticated session",
              "Verify that the route is protected when no session exists.",
              ["Open a new private/incognito browser window (no Admin Web session).",
               f"Navigate to `https://dari-dev.siddagangatravels.com{url}`."],
              ["The user is redirected to `/login` (observed for the Contracted Clients route at session start).",
               "No data from the screen is displayed before login."],
              "Negative", "High", pre=["No active Admin Web session in the browser."], evidence="screenshots/login/01-initial-load.png",
              status="Documented" if "contracted-clients" in url else "Needs Verification",
              basis="Observed (contracted-clients)" if "contracted-clients" in url else "Inferred from observed redirect on another route",
              func="Route protection")

    # 3. KPI consistency
    if kpis:
        b.add(meta, f"Verify {meta['screen']} summary card values against list data",
              "Check data consistency between summary cards and the underlying lists.",
              nav_steps(meta, s) + ["Note the value shown on each summary card: " + ", ".join(kpis) + ".",
                                     "Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N')."],
              ["Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).",
               "Card values are numeric and non-negative."],
              "Integration", "Medium", evidence=ev, status="Needs Verification", basis="Inferred – card definitions not documented",
              func="Summary cards / KPIs")

    # 4. Table: columns and row controls (one case per table); empty state once per screen
    has_search = any(f.get("type") == "text" and re.search(r"search", clean(f.get("placeholder")), re.I) for f in page.get("fields", []))
    has_filter = any(opt_list(d) and not all(PAGE_SIZE.match(o) for o in opt_list(d)) and len(opt_list(d)) > 1 for d in s.get("pageDropdowns", []))
    observed_empty = [ti for ti, t in enumerate((route_info or {}).get("tables", [])) if t.get("firstRowEmpty")]
    for ti, t in enumerate(tables):
        cols = [clean(c["name"]) for c in t["columns"] if clean(c["name"])]
        if not cols:
            continue
        tname = meta.get("tables", {}).get(ti, f"list table{'' if ti == 0 else ' #' + str(ti + 1)}")
        acts = [clean(a) for a in t.get("firstRowActions", []) if clean(a)]
        exp = ["Columns appear in this order: " + " | ".join(cols) + "."]
        if acts:
            exp.append("Each row offers these controls: " + ", ".join(sorted(set(a.replace("MoreVertIcon", "⋮ (more actions)") for a in acts))) + ".")
        if re.match(r"s\.?\s?r|s\.?no|serial", cols[0], re.I):
            exp.append("The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).")
        b.add(meta, f"Verify {tname} columns and row controls on {meta['screen']}",
              "Verify the table structure matches the observed layout.",
              nav_steps(meta, s) + [f"Inspect the header row and first data row of the {tname}."],
              exp, "UI", "Medium", evidence=ev, func=f"{tname[0].upper() + tname[1:]} display")
    if tables and (has_search or has_filter):
        b.add(meta, f"Empty-state message when no {meta['screen']} records match",
              "Verify behaviour when a search/filter returns no rows.",
              nav_steps(meta, s) + ["Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999')."],
              ["The table body shows 'No data available' (empty-state text observed in this application).",
               "The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled."],
              "Negative", "Low", evidence=ev, func="Empty state")
    elif observed_empty:
        b.add(meta, f"Empty-state display on {meta['screen']}",
              "Verify the empty state of a list with no records.",
              nav_steps(meta, s) + ["Observe a table that has no records."],
              ["The table body shows 'No data available' (observed during exploration).", "The footer reads 'Showing 0 to 0 of 0 entries' and pagination buttons are disabled."],
              "UI", "Low", evidence=ev, func="Empty state")

    # 5. Search
    for f in page.get("fields", []):
        ph = clean(f.get("placeholder"))
        if f.get("type") == "text" and re.search(r"search", ph, re.I):
            b.add(meta, f"Search {meta['screen']} using '{ph}' with an existing value",
                  "Verify that the search box filters the list.",
                  nav_steps(meta, s) + ["Copy a value from the first row (e.g. the name/ID column).",
                                         f"Type it into the '{ph}' box (and press Enter or click the search icon if results do not update automatically)."],
                  ["Only rows containing the searched value are listed.", "The 'Showing x to y of N' total decreases accordingly.",
                   "Which columns are searched and whether search is case-insensitive / partial – Needs Verification."],
                  "Positive", "High", evidence=ev, func="Search")
            b.add(meta, f"Search {meta['screen']} with special characters and leading/trailing spaces",
                  "Verify search robustness for unusual input.",
                  nav_steps(meta, s) + [f"Enter '  %_<>'\"  ' in '{ph}'.", f"Clear the box, then enter the first row's name surrounded by spaces."],
                  ["No error page or console crash; special characters return 'No data available'.",
                   "Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification)."],
                  "Negative", "Low", evidence=ev, status="Needs Verification", basis="Inferred", func="Search")
            b.add(meta, f"Clear search on {meta['screen']} restores the full list",
                  "Verify that clearing search resets results.",
                  nav_steps(meta, s) + [f"Search for any value in '{ph}'.", "Delete the search text completely."],
                  ["The full list is shown again with the original 'Showing … of N' total."],
                  "Positive", "Low", evidence=ev, func="Search")
            break

    # 6. Filters and page size
    page_size_done = False
    for dd in s.get("pageDropdowns", []):
        name = clean(dd.get("name"))
        opts = opt_list(dd)
        if not opts and PAGE_SIZE.match(name or "x"):
            opts = []  # options not captured – rows-per-page scenario without an option list
            if not page_size_done:
                page_size_done = True
                b.add(meta, f"Change rows per page on {meta['screen']}", "Verify the rows-per-page selector.",
                      nav_steps(meta, s) + ["Open the rows-per-page dropdown in the table footer (default shown: '" + name + "').", "Select each available value in turn."],
                      ["The table shows at most the selected number of rows and 'Showing 1 to n of N' updates."],
                      "Positive", "Low", evidence=ev, status="Needs Verification", basis="Selector observed; options not captured", func="Pagination / page size")
            continue
        if opts and all(PAGE_SIZE.match(o) for o in opts):
            if page_size_done:
                continue
            page_size_done = True
            b.add(meta, f"Change rows per page on {meta['screen']}",
                  "Verify the rows-per-page selector.",
                  nav_steps(meta, s) + ["Open the rows-per-page dropdown in the table footer.", "Select each value in turn: " + ", ".join(opts) + "."],
                  ["The dropdown lists exactly: " + ", ".join(opts) + f" (default '{name}').",
                   "After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.",
                   "The page resets to page 1 (Needs Verification)."],
                  "Positive", "Low", evidence=ev, func="Pagination / page size")
            continue
        if name.lower().startswith("showing"):
            continue
        if not name or name.lower() in ("without label", "filter"):
            low = {o.lower() for o in opts}
            name = "Status" if low & {"active", "inactive", "all status"} else "unlabelled filter"
        label = name
        if not opts:
            continue  # options not captured during inspection – no claim made
        if len(opts) <= 1 and meta.get("route") == "/dashboard":
            b.add(meta, f"'{label}' selector on {meta['screen']} has no selectable options",
                  "Verify the selector is populated when data exists.",
                  nav_steps(meta, s) + [f"Open the '{label}' dropdown."],
                  [f"Observed: the list contained only {('the placeholder ' + repr(opts[0])) if opts else 'no options'} during exploration.",
                   "Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification)."],
                  "UI", "Low", evidence=ev, status="Needs Verification", basis="Observed empty list", func="Filter")
            continue
        b.add(meta, f"Filter {meta['screen']} by '{label}' dropdown",
              "Verify each filter option narrows the list correctly.",
              nav_steps(meta, s) + [f"Open the '{label}' dropdown.", "Select each option in turn and observe the list."],
              [f"The dropdown lists: {describe_options(label, opts)}.",
               "After selecting an option only rows with that value are listed and the total updates.",
               "Selecting the 'All' option (if present) shows all rows again."],
              "Positive", "Medium", evidence=ev, func="Filter")

    # 7. Pagination
    pag = [p for p in route_info.get("pagination", [])] if route_info else []
    total = None
    for p in pag:
        m = re.search(r"of (\d+)", p)
        if m:
            total = int(m.group(1))
    if total and total > 5:
        b.add(meta, f"Navigate pages of the {meta['screen']} list",
              "Verify first/previous/next/last page controls.",
              nav_steps(meta, s) + ["Click 'Go to next page'.", "Click 'Go to last page'.", "Click 'Go to previous page'.", "Click 'Go to first page'."],
              [f"Observed total at exploration time: {total} entries.",
               "Each click loads the corresponding page and 'Showing x to y of N' updates.",
               "On page 1, 'Go to first page' and 'Go to previous page' are disabled.",
               "On the last page, 'Go to next page' and 'Go to last page' are disabled and the last row number equals N."],
              "Boundary", "Medium", evidence=ev, func="Pagination")

    # 8. Opened forms / dialogs / menus
    noted = set()
    for o in s.get("opened", []):
        lbl = clean(o.get("opened"))
        if o.get("menu") is not None:
            items = [clean(i) for i in o["menu"] if clean(i)]
            if not items:
                continue
            b.add(meta, f"Open the row actions (⋮) menu on {meta['screen']}",
                  "Verify the actions available per record.",
                  nav_steps(meta, s) + ["Click the ⋮ icon in the Action column of the first row."],
                  ["A menu opens with: " + ", ".join(f"'{i}'" for i in items) + ".", "Pressing Esc or clicking outside closes the menu without any change."],
                  "UI", "Medium", evidence=ev, func="Row actions menu")
            for it in items:
                if re.search(r"delete|remove", it, re.I):
                    gen_delete(b, meta, s, it, ev)
                elif re.search(r"deactivate|activate|block|disable|enable", it, re.I):
                    gen_status_action(b, meta, s, it, ev)
            continue
        if o.get("skipped") or o.get("error"):
            continue
        if o.get("container") in (None, "inline"):
            nm = lbl.replace("row-", "")
            nm = {"VisibilityIcon": "eye (view) icon", "VisibilityOutlinedIcon": "eye (view) icon", "RemoveRedEyeIcon": "eye (view) icon",
                  "EditIcon": "pencil (edit) icon", "EditOutlinedIcon": "pencil (edit) icon"}.get(nm, nm)
            if nm in noted:
                continue
            noted.add(nm)
            b.add(meta, f"'{nm}' control on {meta['screen']}",
                  f"Verify what '{nm}' opens.",
                  nav_steps(meta, s) + [f"Click '{nm}'{' on the first row' if lbl.startswith('row-') else ''}."],
                  [f"Observed during exploration: no dialog, drawer or navigation was detected after clicking '{nm}'.",
                   "Expected: the related form/details panel opens (Needs Verification – may be a defect or a slow-loading panel)."],
                  "UI", "Medium", evidence=ev, status="Needs Verification", basis="Observed no visible response", func=nm)
            continue
        gen_form(b, meta, s, o, lbl)

    # 9. Status chips in rows and risky page buttons (never clicked during exploration)
    for t in tables:
        acts = [clean(a) for a in t.get("firstRowActions", [])]
        if any(a in ("Active", "Inactive", "Enabled", "Disabled") for a in acts) or "MuiSwitch" in acts:
            gen_status_action(b, meta, s, "status button (Active/Inactive) in the row", ev)
            break
    for bt in buttons:
        if re.search(r"export", bt, re.I):
            b.add(meta, f"Export the {meta['screen']} list using '{bt}'",
                  "Verify list export.",
                  nav_steps(meta, s) + ["Optionally apply a filter/search.", f"Click '{bt}'."],
                  ["A PDF file downloads (file name format – Needs Verification).",
                   "The PDF contains the same columns and rows as the current (filtered) list.",
                   "Export with an empty list produces an empty report or a message (Needs Verification)."],
                  "Positive", "Medium", evidence=ev, status="Needs Verification", basis="Control observed; export not executed",
                  func="Export")
    for bt, desc in meta.get("risky", {}).items():
        b.add(meta, f"'{bt}' action on {meta['screen']} (approval required to execute)",
              desc["objective"], nav_steps(meta, s) + desc["steps"], desc["expected"],
              desc.get("type", "Positive"), desc.get("priority", "High"),
              pre=[LOGIN_PRE, "Explicit approval obtained before execution – this action changes live configuration/data or sends communications."],
              evidence=ev, status="Needs Verification", basis="Control observed; not clicked during exploration", func=bt)
    return ids_nav


def gen_delete(b, meta, s, item, ev):
    b.add(meta, f"Cancel '{item}' on {meta['screen']}",
          "Verify that a delete can be abandoned without data loss.",
          nav_steps(meta, s) + ["Click ⋮ on a test record (never a business record).", f"Click '{item}'.", "In the confirmation prompt click Cancel/No (or close it)."],
          ["A confirmation prompt is shown before deletion (Needs Verification – not opened during exploration).",
           "After cancelling, the record remains in the list unchanged and the total is unchanged."],
          "Negative", "High", pre=[LOGIN_PRE, "A disposable test record created for this purpose exists."],
          evidence=ev, status="Needs Verification", basis="Menu item observed; not clicked", func="Delete")
    b.add(meta, f"Confirm '{item}' on a test record in {meta['screen']}",
          "Verify deletion removes the record and is reflected in totals.",
          nav_steps(meta, s) + ["Note the total entries.", "Click ⋮ on the disposable test record.", f"Click '{item}' and confirm."],
          ["A success message is shown.", "The record no longer appears in the list and the total decreases by 1.",
           "Records referencing it (dependent modules) are handled per business rule (soft delete vs block – Needs Verification)."],
          "Positive", "High", pre=[LOGIN_PRE, "A disposable test record exists.", "Explicit approval obtained – deletion is irreversible."],
          evidence=ev, status="Needs Verification", basis="Menu item observed; not clicked", func="Delete")


def gen_status_action(b, meta, s, what, ev):
    b.add(meta, f"Change record status via {what} on {meta['screen']}",
          "Verify status transition Active ↔ Inactive and its effect on filters.",
          nav_steps(meta, s) + [f"On a test record, click the {what}.", "Confirm if a prompt appears.", "Filter the list by the new status."],
          ["The status label changes (e.g. Active → Inactive) and a success message appears.",
           "The record appears under the matching status filter.",
           "Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).",
           "Whether the control is clickable or display-only – Needs Verification (not clicked during exploration)."],
          "Positive", "Medium", pre=[LOGIN_PRE, "A disposable test record exists.", "Approval obtained – changes record status."],
          evidence=ev, status="Needs Verification", basis="Control observed; not clicked", func="Status transition")


def field_desc(f, dd_map):
    lab = clean(f.get("label")) or clean(f.get("placeholder")) or f.get("type")
    t = f.get("type")
    bits = [t]
    if f.get("placeholder"):
        bits.append(f"placeholder '{clean(f['placeholder'])}'")
    if f.get("disabled"):
        bits.append("disabled/read-only")
    if f.get("required"):
        bits.append("required attribute")
    v = clean(f.get("value"))
    if v and t in ("combobox",) and not PII_LABEL.search(lab) and not PII_VALUE.search(v):
        bits.append(f"default '{v}'")
    if t == "checkbox":
        bits.append("checked" if f.get("checked") else "unchecked")
    if f.get("maxLength"):
        bits.append(f"maxlength {f['maxLength']}")
    return lab, ", ".join(bits)


def gen_form(b, meta, s, o, lbl):
    ev = (o.get("shots") or [s.get("pageShot", "")])[0]
    fields = [f for f in o.get("fields", []) if not clean(f.get("label")).lower().startswith("showing")]
    # de-duplicate textarea twins (MUI renders hidden mirror textarea)
    seen, uniq = set(), []
    for f in fields:
        k = (clean(f.get("label")), f.get("type"), clean(f.get("placeholder")))
        if f.get("type") == "textarea" and k in seen:
            continue
        seen.add(k)
        uniq.append(f)
    fields = uniq
    if not fields and o.get("container") == "inline":
        return
    heads = [clean(h) for h in o.get("headings", []) if clean(h)]
    form_title = heads[0] if heads else lbl
    if str(o.get("container", "")).startswith("page:") and not lbl.startswith("row"):
        form_title = lbl.lstrip("+ ").strip()
    dds = {}
    for d in o.get("dropdowns", []):
        dds.setdefault(len(dds), d)
    btns = [clean(x) for x in o.get("buttons", []) if clean(x) and x not in ("[icon]",)]
    submit = next((x for x in btns if re.search(r"^(add|save|update|submit|create|send|record|assign|allocate|confirm)", x, re.I) and x.lower() != "add more permissions"), None)
    is_edit = bool(re.search(r"edit|update", lbl, re.I)) or (submit and submit.lower().startswith("update"))
    is_view = bool(re.search(r"view|details|visibility|eye|quote|availability|profile", lbl, re.I)) and not submit
    container = o.get("container", "")
    icon_names = {"VisibilityIcon": "eye (view) icon", "VisibilityOutlinedIcon": "eye (view) icon", "RemoveRedEyeIcon": "eye (view) icon",
                  "RemoveRedEyeOutlinedIcon": "eye (view) icon", "EditIcon": "pencil (edit) icon", "EditOutlinedIcon": "pencil (edit) icon",
                  "ModeEditIcon": "pencil (edit) icon", "ModeEditOutlineOutlinedIcon": "pencil (edit) icon", "BorderColorOutlinedIcon": "pencil (edit) icon"}
    if lbl.startswith("row-menu-"):
        open_step = f"Click the ⋮ icon on the first row, then click '{lbl[9:]}'."
    elif lbl.startswith("row-"):
        nm = lbl[4:]
        open_step = f"Click the {icon_names.get(nm, repr(nm))} on the first row."
    else:
        open_step = f"Click '{lbl}'."
    flines = []
    for i, f in enumerate(fields):
        lab, d = field_desc(f, dds)
        flines.append(f"{lab} ({d})")
    dd_lines = []
    for nm, d in label_dropdowns(fields, o.get("dropdowns", [])):
        dd_lines.append(f"{nm} → {describe_options(nm, opt_list(d))}")
    where = "a dialog" if container == "dialog" else (f"the page `{container[5:]}`" if container.startswith("page:") else "an inline panel")

    # UI: form structure (observed)
    exp = [f"{where.capitalize()} titled '{form_title}' opens."]
    if flines:
        exp.append("Fields shown: " + "; ".join(flines) + ".")
    if dd_lines:
        exp.append("Dropdown options observed: " + "; ".join(dd_lines) + ".")
    if btns:
        exp.append("Buttons: " + ", ".join(f"'{x}'" for x in btns[:12]) + ".")
    if not any(f.get("required") for f in fields) and fields and not is_view:
        exp.append("No mandatory-field markers (*) are rendered on this form (observed).")
    kind = "edit form" if is_edit else ("details view" if is_view else "form")
    b.add(meta, f"Open '{form_title}' {kind} on {meta['screen']}",
          f"Verify the layout, fields, defaults and options of '{form_title}'.",
          nav_steps(meta, s) + [open_step], exp, "UI", "High" if not is_view else "Medium",
          pre=[LOGIN_PRE] + (["At least one record exists in the list."] if lbl.startswith("row") else []),
          evidence=", ".join(o.get("shots", [])), func=f"{form_title} – open/layout")

    if container == "dialog":
        b.add(meta, f"Close '{form_title}' without saving (Cancel / ✕ / Esc)",
              "Verify that closing the dialog discards entered data.",
              nav_steps(meta, s) + [open_step, "Enter any value in the first editable field.", "Click 'Cancel' (repeat using the ✕ icon and the Esc key)."],
              ["The dialog closes and no record is created or changed (list total unchanged).",
               "Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state)."],
              "UI", "Medium", evidence=", ".join(o.get("shots", [])), func=f"{form_title} – cancel")

    if is_view:
        b.add(meta, f"Verify '{form_title}' shows data consistent with the list row",
              "Check data consistency between the list and the details view.",
              nav_steps(meta, s) + ["Note the values shown in the first row.", open_step],
              ["Values in the details view match the row (IDs, names, dates, amounts, status).", "Fields are read-only in the view."],
              "Integration", "Medium", evidence=", ".join(o.get("shots", [])), status="Documented", func=f"{form_title} – data consistency")
        return
    if not submit or not fields:
        return

    editable = [f for f in fields if not f.get("disabled")]
    text_f = [f for f in editable if f.get("type") in TEXT_TYPES or (f.get("tag") == "textarea")]
    num_f = [f for f in editable if f.get("type") == "number" or (f.get("type") == "text" and re.search(r"amount|price|cost|capacity|percent|%|hours|rate|qty|quantity|value$", clean(f.get("label")), re.I))]
    combo_f = [f for f in editable if f.get("type") == "combobox"]
    date_f = [f for f in editable if re.search(r"date|time", clean(f.get("label")) + " " + clean(f.get("placeholder")), re.I)
              and not re.search(r"one time", clean(f.get("label")), re.I) and f.get("type") != "checkbox"]
    email_f = [f for f in editable if f.get("type") == "email" or re.search(r"e-?mail", clean(f.get("label")), re.I)]
    phone_f = [f for f in editable if f.get("type") == "tel" or (f.get("type") in ("text", "number") and re.search(r"phone|mobile\s*(no|num)|contact\s*n", clean(f.get("label")), re.I))]
    file_f = [f for f in editable if f.get("type") == "file"]
    names = [clean(f.get("label")) or clean(f.get("placeholder")) for f in editable]
    data_list = "; ".join(f"{n}: <valid test value>" for n in names if n)
    ev2 = ", ".join(o.get("shots", []))
    act = "update" if is_edit else "create"

    # Positive submit
    b.add(meta, f"{'Update' if is_edit else 'Create'} a record via '{form_title}' with valid data",
          f"Verify a successful {act} through '{form_title}'.",
          nav_steps(meta, s) + [open_step] + (["Change one or more editable fields to new valid values."] if is_edit else ["Fill every field with valid test data (see Test Data)."]) + [f"Click '{submit}'."],
          [f"The dialog closes and a success message is shown (exact text – Needs Verification).",
           f"The {'updated values are shown in the row' if is_edit else 'new record appears in the list'} and {'total is unchanged' if is_edit else 'the total increases by 1'}.",
           "Values persist after page refresh."],
          "Positive", "High", pre=[LOGIN_PRE, "Approval obtained – this step writes data to DEV.", "Use clearly named test data, e.g. prefix 'QA-TEST-'."],
          data=data_list or "N/A", evidence=ev2, status="Documented", basis="Form observed; submission not executed",
          func=f"{form_title} – {act}")

    # Mandatory validation
    if is_edit:
        steps_m = nav_steps(meta, s) + [open_step, "Clear the text of each editable text field.", f"Click '{submit}'."]
    else:
        steps_m = nav_steps(meta, s) + [open_step, "Leave all fields empty / at default.", f"Click '{submit}'."]
    b.add(meta, f"Mandatory-field validation on '{form_title}'",
          "Verify required fields are enforced.",
          steps_m,
          ["The form is not submitted; inline validation messages appear under each required field.",
           "No record is created/changed.",
           "Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: " + ", ".join(names) + "."],
          "Negative", "High", evidence=ev2, status="Needs Verification", basis="Inferred – validation not triggered (exploration only)",
          func=f"{form_title} – mandatory validation")

    # Optional field behaviour
    if len(editable) > 2:
        b.add(meta, f"Submit '{form_title}' with only the minimum required fields",
              "Verify optional fields can be left blank.",
              nav_steps(meta, s) + [open_step, "Fill only the fields confirmed as mandatory.", f"Click '{submit}'."],
              ["The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification)."],
              "Positive", "Medium", pre=[LOGIN_PRE, "Mandatory field set confirmed (see open questions).", "Approval obtained – writes data."],
              evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – optional fields")

    # Text boundaries
    if text_f:
        tn = [clean(f.get("label")) or clean(f.get("placeholder")) for f in text_f]
        ml = [f"{clean(f.get('label'))}={f['maxLength']}" for f in text_f if f.get("maxLength")]
        b.add(meta, f"Text length boundaries on '{form_title}'",
              "Verify min/max length handling of text fields.",
              nav_steps(meta, s) + [open_step, "For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.",
                                     f"Click '{submit}' after each variation (on a test record only)."],
              ["Single-character and max-length values are accepted.", "Max+1 is blocked by the input or rejected with a message.",
               "Whitespace-only input is rejected as empty.",
               ("Observed maxlength attributes: " + ", ".join(ml) + ".") if ml else "No maxlength attribute is set on these inputs – limits must be confirmed."],
              "Boundary", "Medium", data="Fields: " + ", ".join(tn), evidence=ev2, status="Needs Verification", basis="Inferred – limits not documented",
              func=f"{form_title} – boundaries")
        b.add(meta, f"Invalid characters / script injection in '{form_title}' text fields",
              "Verify input sanitisation.",
              nav_steps(meta, s) + [open_step, "Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.", f"Click '{submit}' (test record only)."],
              ["Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution)."],
              "Negative", "Medium", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – invalid input")
    # Numeric
    for f in num_f[:4]:
        n = clean(f.get("label")) or clean(f.get("placeholder"))
        b.add(meta, f"Numeric boundaries for '{n}' on '{form_title}'",
              f"Verify '{n}' accepts only valid numeric values.",
              nav_steps(meta, s) + [open_step, f"Enter in '{n}' each of: 0, -1, 1, 1.5, a very large value (e.g. 9999999999), letters 'abc'.", f"Click '{submit}' after each (test record only)."],
              ["Letters cannot be typed or are rejected.", "Negative values are rejected.",
               "Whether 0 and decimals are allowed, and the maximum value – Needs Verification."],
              "Boundary", "Medium", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – numeric validation")
    for f in email_f[:1]:
        n = clean(f.get("label")) or "Email"
        b.add(meta, f"Invalid email format in '{n}' on '{form_title}'",
              "Verify email format validation.",
              nav_steps(meta, s) + [open_step, f"Enter 'abc', 'abc@', 'abc@domain', 'abc@domain.com ' in '{n}'.", f"Click '{submit}'."],
              ["Invalid formats are rejected with a validation message; a valid address is accepted."],
              "Negative", "High", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – email validation")
    for f in phone_f[:1]:
        n = clean(f.get("label")) or "Phone"
        b.add(meta, f"Invalid phone number in '{n}' on '{form_title}'",
              "Verify phone number validation.",
              nav_steps(meta, s) + [open_step, f"Enter 9 digits, 11 digits, letters, and a number starting with 0 in '{n}'.", f"Click '{submit}'."],
              ["Only a valid 10-digit Indian mobile number is accepted (rule – Needs Verification); others show a validation message."],
              "Negative", "High", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – phone validation")
    for f in date_f[:2]:
        n = clean(f.get("label")) or clean(f.get("placeholder"))
        b.add(meta, f"Date/time selection rules for '{n}' on '{form_title}'",
              f"Verify the picker for '{n}'.",
              nav_steps(meta, s) + [open_step, f"Open the picker for '{n}'.", "Try selecting a past date, today, and a future date; try typing an invalid date."],
              ["The picker opens and the chosen value is shown in the field format used by the app.",
               "Whether past/future dates are allowed and the relation to other date fields (end ≥ start) – Needs Verification."],
              "Boundary", "Medium", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – date validation")
    for f in file_f[:1]:
        b.add(meta, f"File upload type/size validation on '{form_title}'",
              "Verify only permitted files can be uploaded.",
              nav_steps(meta, s) + [open_step, "Upload a valid image/PDF, then an .exe file, then a file larger than 10 MB."],
              [f"Accepted types attribute: {f.get('accept') or 'not set'}.", "Disallowed types/oversize files are rejected with a message."],
              "Negative", "Medium", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – file validation")
    # Dropdown behaviour
    if combo_f:
        empties = [nm for nm, d in label_dropdowns(fields, o.get("dropdowns", [])) if not opt_list(d)]
        b.add(meta, f"Dropdown selection behaviour on '{form_title}'",
              "Verify dropdown options and dependent selections.",
              nav_steps(meta, s) + [open_step, "Open each dropdown in order from top to bottom.", "Select an option in each, then change an earlier selection."],
              ["Each dropdown shows the options listed in the 'Open' use case for this form.",
               (f"Dropdowns with no options before earlier selections are made: {', '.join(empties)} – they appear to depend on a previous field (Needs Verification)." if empties else "All dropdowns were populated when opened."),
               "Changing a parent selection clears or refreshes dependent selections (Needs Verification)."],
              "Positive", "Medium", evidence=ev2, status="Documented" if not empties else "Needs Verification", func=f"{form_title} – dropdowns")
    # Duplicate
    key_field = next((n for n in names if n and not n.lower().startswith("select") and re.search(r"name|title|code|label", n, re.I)), None)
    if key_field and not is_edit:
        b.add(meta, f"Duplicate '{key_field}' on '{form_title}'",
              "Verify duplicate records are prevented.",
              nav_steps(meta, s) + ["Note the value of an existing record's " + key_field + ".", open_step,
                                     f"Enter the same {key_field} (also try different letter case and trailing space) with other valid fields.", f"Click '{submit}'."],
              ["The record is not created; a duplicate error message is shown (rule – Needs Verification)."],
              "Negative", "High", evidence=ev2, status="Needs Verification", basis="Inferred", func=f"{form_title} – duplicate handling")
    if is_edit:
        dis = [clean(f.get("label")) for f in fields if f.get("disabled")]
        b.add(meta, f"'{form_title}' is pre-filled with the selected record",
              "Verify edit form loads current values.",
              nav_steps(meta, s) + ["Note the values of the first row.", open_step],
              ["All fields are pre-populated with the row's current values."] + ([f"Read-only fields (observed disabled): {', '.join(dis)}."] if dis else []),
              "Positive", "High", evidence=ev2, func=f"{form_title} – prefill")


def main():
    route_scan = {r["route"]: r for r in json.loads((RAW / "route-scan.json").read_text(encoding="utf-8"))}
    b = Builder()
    screen_status = OrderedDict()
    for key, meta in SCREENS.items():
        f = RAW / "inspect" / f"{key}.json"
        if meta.get("manual_only"):
            screen_status[key] = meta.get("coverage", "Partially explored")
            continue
        if not f.exists():
            screen_status[key] = "Not explored"
            continue
        s = json.loads(f.read_text(encoding="utf-8"))
        ri = route_scan.get(meta.get("route", "").split("?")[0]) if not meta.get("click") else None
        gen_screen(b, key, meta, s, ri or {})
        screen_status[key] = meta.get("coverage", "Fully explored")
    for mc in MANUAL_CASES:
        meta = SCREENS[mc["screen_key"]] | {k: v for k, v in mc.items() if k in ("module", "submodule", "screen")}
        b.add(meta, mc["title"], mc["objective"], mc["steps"], mc["expected"], mc["type"], mc.get("priority", "High"),
              pre=mc.get("pre"), data=mc.get("data", "N/A"), deps=mc.get("deps", ""), evidence=mc.get("evidence", ""),
              status=mc.get("status", "Documented"), basis=mc.get("basis", "Observed UI"), func=mc.get("func"), related=mc.get("related", ""))
    write_outputs(b, screen_status)
    write_inventories(screen_status, b.cases)


HEAD = ["Use Case ID", "Module", "Submodule", "Screen", "Use Case Title", "Objective", "User Role", "Preconditions", "Test Data",
        "Steps", "Expected Result", "Type", "Priority", "Dependencies", "Evidence", "Status", "Observation Basis", "Related Use Cases"]
KEYS = ["id", "module", "submodule", "screen", "title", "objective", "role", "pre", "data", "steps", "expected", "type", "priority",
        "deps", "evidence", "status", "basis", "related"]


def style_sheet(ws, widths):
    hdr = PatternFill("solid", fgColor="7A1E2C")
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = hdr
        c.alignment = Alignment(wrap_text=True, vertical="center")
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = ws.dimensions


def write_outputs(b, screen_status):
    cases = b.cases
    DOC.mkdir(exist_ok=True)
    # ---- Use case workbook
    wb = Workbook()
    ws = wb.active
    ws.title = "Use Cases"
    ws.append(HEAD)
    for c in cases:
        ws.append([c[k] for k in KEYS])
    style_sheet(ws, [17, 20, 22, 26, 45, 40, 12, 35, 30, 60, 60, 12, 9, 22, 35, 16, 26, 18])
    # summary sheet
    sm = wb.create_sheet("Summary")
    sm.append(["Module", "Use Cases", "Positive", "Negative", "Boundary", "UI", "Navigation", "Integration", "Workflow", "Documented", "Needs Verification", "Blocked"])
    by_mod = OrderedDict()
    for c in cases:
        by_mod.setdefault(c["module"], []).append(c)
    for m, cs in by_mod.items():
        cnt = lambda k, v: sum(1 for x in cs if x[k] == v)
        sm.append([m, len(cs)] + [cnt("type", t) for t in ["Positive", "Negative", "Boundary", "UI", "Navigation", "Integration", "Workflow"]]
                  + [cnt("status", st) for st in ["Documented", "Needs Verification", "Blocked"]])
    sm.append(["TOTAL", len(cases)] + [sum(1 for x in cases if x["type"] == t) for t in ["Positive", "Negative", "Boundary", "UI", "Navigation", "Integration", "Workflow"]]
              + [sum(1 for x in cases if x["status"] == st) for st in ["Documented", "Needs Verification", "Blocked"]])
    style_sheet(sm, [32] + [12] * 11)
    lg = wb.create_sheet("Legend")
    for row in [["Field", "Meaning"],
                ["Status = Documented", "All controls in the steps were observed during exploration; expected result follows the observed UI."],
                ["Status = Needs Verification", "Expected result depends on behaviour or a business rule that could not be confirmed read-only (no submission/validation was triggered)."],
                ["Status = Blocked", "Screen/action not accessible during exploration."],
                ["Observation Basis", "'Observed UI' = seen on screen; 'Inferred' = expected behaviour derived from the UI, to be confirmed with the product owner."],
                ["Execution note", "Any case whose preconditions say 'Approval obtained' writes data, changes configuration or sends communications in DEV – get explicit approval first and use QA-TEST- prefixed data."],
                ["Role", "All cases explored as Superadmin. Other roles were not available (see Open_Questions_and_Gaps.md)."]]:
        lg.append(row)
    style_sheet(lg, [30, 120])
    wb.save(DOC / "Admin_Web_Use_Cases.xlsx")

    # ---- Markdown
    md = ["# Admin Web – Use Cases", "",
          "Source of truth for Admin Web manual testing and future automation. Generated from read-only exploration of "
          "`https://dari-dev.siddagangatravels.com` (DEV) as **Superadmin** on 2026-10-30 by `scripts/build_docs.py`.",
          "No case has been executed. See the Legend in `Admin_Web_Use_Cases.xlsx` for Status / Observation Basis meanings.", "",
          f"**Total use cases:** {len(cases)}", "", "## Contents", ""]
    for m in by_mod:
        anchor = re.sub(r"[^a-z0-9 -]", "", m.lower()).replace(" ", "-")
        md.append(f"- [{m}](#{anchor}) – {len(by_mod[m])} cases")
    md.append("")
    for m, cs in by_mod.items():
        md += [f"## {m}", ""]
        cur = None
        for c in cs:
            if c["screen"] != cur:
                cur = c["screen"]
                md += [f"### {c['submodule']} › {cur}" if c["submodule"] else f"### {cur}", ""]
            md += [f"#### {c['id']} – {c['title']}", "",
                   f"| Type | Priority | Status | Basis | Role |", "|---|---|---|---|---|",
                   f"| {c['type']} | {c['priority']} | {c['status']} | {c['basis']} | {c['role']} |", "",
                   f"**Objective:** {c['objective']}", "",
                   "**Preconditions:**", "", *[f"- {p}" for p in c["pre"].split("\n")], ""]
            if c["data"] and c["data"] != "N/A":
                md += [f"**Test data:** {c['data']}", ""]
            md += ["**Steps:**", "", c["steps"], "", "**Expected result:**", "", c["expected"], ""]
            extra = []
            if c["deps"]:
                extra.append(f"**Dependencies:** {c['deps']}")
            if c["related"]:
                extra.append(f"**Related:** {c['related']}")
            if c["evidence"]:
                extra.append("**Evidence:** " + ", ".join(f"`{e.strip()}`" for e in c["evidence"].split(",") if e.strip()))
            md += [" · ".join(extra), ""] if extra else []
    (DOC / "Admin_Web_Use_Cases.md").write_text("\n".join(md), encoding="utf-8")

    # ---- Coverage matrix
    cw = Workbook()
    ws = cw.active
    ws.title = "Traceability"
    ws.append(["Module", "Submodule", "Screen", "Functionality", "Use Case IDs", "Use Case Count", "Screen Exploration Status"])
    trace = OrderedDict()
    for c in cases:
        k = (c["module"], c["submodule"], c["screen"], c["func"])
        trace.setdefault(k, []).append(c["id"])
    scr_status = {}
    for key, meta in SCREENS.items():
        scr_status[(meta["module"], meta["screen"])] = screen_status.get(key, "Not explored")
    for (m, sm_, sc, fn), ids in trace.items():
        ws.append([m, sm_, sc, fn, ", ".join(ids), len(ids), scr_status.get((m, sc), "Workflow (cross-screen)")])
    style_sheet(ws, [28, 26, 34, 42, 60, 10, 22])
    sc_ws = cw.create_sheet("Screens")
    sc_ws.append(["Module", "Submodule", "Screen", "Route / Access", "Exploration Status", "Use Cases", "Notes"])
    for key, meta in SCREENS.items():
        n = sum(1 for c in cases if c["module"] == meta["module"] and c["screen"] == meta["screen"])
        route = meta.get("route", "") + ((" → click " + " → ".join(meta["click"])) if meta.get("click") else "")
        sc_ws.append([meta["module"], meta.get("submodule", ""), meta["screen"], route, screen_status.get(key), n, SCREEN_NOTES.get(key, "")])
    style_sheet(sc_ws, [28, 26, 34, 60, 20, 10, 70])
    st = cw.create_sheet("Statistics")
    modules = sorted({m["module"] for m in SCREENS.values()})
    subs = sorted({(m["module"], m.get("submodule")) for m in SCREENS.values() if m.get("submodule")})
    stats = OrderedDict([
        ("Modules discovered", len(modules)),
        ("Submodules discovered", len(subs)),
        ("Screens / views discovered", len(SCREENS)),
        ("Functionalities identified (traceability rows)", len(trace)),
        ("Use cases documented", len(cases)),
        ("Screens fully explored", sum(1 for v in screen_status.values() if v == "Fully explored")),
        ("Screens partially explored", sum(1 for v in screen_status.values() if v == "Partially explored")),
        ("Screens not accessible / blocked", sum(1 for v in screen_status.values() if v in ("Blocked", "Not accessible"))),
        ("Screens not explored", sum(1 for v in screen_status.values() if v == "Not explored")),
        ("Use cases – Documented", sum(1 for c in cases if c["status"] == "Documented")),
        ("Use cases – Needs Verification", sum(1 for c in cases if c["status"] == "Needs Verification")),
        ("Use cases – Blocked", sum(1 for c in cases if c["status"] == "Blocked")),
        ("Functionalities requiring clarification", len({c["func"] for c in cases if c["status"] == "Needs Verification"})),
    ])
    st.append(["Metric", "Value"])
    for k, v in stats.items():
        st.append([k, v])
    style_sheet(st, [50, 12])
    cw.save(DOC / "Coverage_Matrix.xlsx")
    (DOC / "coverage-stats.json").write_text(json.dumps(stats, indent=2), encoding="utf-8")
    print(json.dumps(stats, indent=2))


def write_inventories(screen_status, cases):
    """Module_Inventory.md and Navigation_Inventory.md from metadata + raw scans."""
    by_mod = OrderedDict()
    for key, meta in SCREENS.items():
        by_mod.setdefault(meta["module"], []).append((key, meta))
    n_cases = defaultdict(int)
    for c in cases:
        n_cases[(c["module"], c["screen"])] += 1

    md = ["# Admin Web – Module Inventory", "",
          "Discovered by read-only exploration of `https://dari-dev.siddagangatravels.com` (DEV) as **Superadmin**, 2026-10-30.",
          "Forms/actions listed were opened only to read them (closed without saving). See `Navigation_Inventory.md` for routes.", "",
          "| # | Module | Submodules / views | Screens | Use cases |", "|---|---|---|---|---|"]
    for i, (m, items) in enumerate(by_mod.items(), 1):
        subs = sorted({it[1].get("submodule") for it in items if it[1].get("submodule")})
        md.append(f"| {i} | {m} | {', '.join(subs)} | {len(items)} | {sum(1 for c in cases if c['module'] == m)} |")
    md.append("")
    for m, items in by_mod.items():
        md += [f"## {m}", "", "| Screen | Submodule | Access | Forms / actions observed | Status | Use cases |", "|---|---|---|---|---|---|"]
        for key, meta in items:
            f = RAW / "inspect" / f"{key}.json"
            acts = []
            if f.exists():
                s = json.loads(f.read_text(encoding="utf-8"))
                for o in s.get("opened", []):
                    if o.get("menu"):
                        acts.append("⋮ menu: " + " / ".join(clean(x) for x in o["menu"] if clean(x)))
                    elif o.get("container") in ("dialog",) or str(o.get("container", "")).startswith("page:"):
                        h = [clean(x) for x in o.get("headings", []) if clean(x)]
                        acts.append(f"{clean(o['opened']).replace('row-menu-', '').replace('row-', 'row ')} → {h[0] if h else o['container']} ({len(o.get('fields', []))} fields)")
                    elif o.get("skipped"):
                        acts.append(f"{o['opened']} (not clicked)")
            for r in meta.get("risky", {}):
                acts.append(f"{r} (not clicked – approval needed)")
            access = meta.get("route", "") + (" › " + " › ".join(meta["click"]) if meta.get("click") else "")
            md.append(f"| {meta['screen']} | {meta.get('submodule', '')} | `{access}` | {'<br>'.join(acts) or '—'} | {screen_status.get(key, 'Not explored')} | {n_cases[(m, meta['screen'])]} |")
        md.append("")
    (DOC / "Module_Inventory.md").write_text("\n".join(md), encoding="utf-8")

    rs = json.loads((RAW / "route-scan.json").read_text(encoding="utf-8"))
    sub = json.loads((RAW / "subnav-scan.json").read_text(encoding="utf-8"))
    nav = ["# Admin Web – Navigation Inventory", "",
           "Base URL: `https://dari-dev.siddagangatravels.com` · Unauthenticated access to any `/dashboard/*` route redirects to `/login`. Post-login landing page: `/dashboard`.", "",
           "## Logged-out pages", "",
           "| Page | Route | Controls |", "|---|---|---|",
           "| Login | `/login` | Username / Email Address, Password (+ visibility toggle), Login, Forgot Password? → `/forgot-password`, Log in with OTP |",
           "| Login with OTP | `/login` (toggled view) | Username / Email Address, Send OTP, Log in With Email & Password |",
           "| Forgot Password | `/forgot-password` | Username / Email Address, Send OTP, Go to Login → `/login` |", "",
           "## Header (all screens)", "",
           "| Control | Behaviour observed |", "|---|---|",
           "| Hide sidebar (circle arrow) / hamburger | Collapses / restores the sidebar |",
           "| Page title (H1) | Name of current screen (some sub-screens keep the parent title) |",
           "| Bell icon | 'Notifications' popover – 'N New', 'New Inquiry Alert' items; 'No Notifications' when empty |",
           "| Avatar | Menu: role label (Superadmin), Profile → `/dashboard/profile` (renders empty), Logout |", "",
           "## Sidebar (Superadmin)", "",
           "| Section | Item | Route |", "|---|---|---|"]
    section = {"Dashboard": "OVERVIEW", "Role & Permission": "PEOPLE & ACCESS", "Employee Management": "PEOPLE & ACCESS",
               "Fleet & Vehicle Management": "FLEET & TRIPS", "Booking & Operations": "FLEET & TRIPS", "Inquiry Management": "FLEET & TRIPS",
               "Lead Management": "FLEET & TRIPS", "Client Management": "PARTNERS", "Vendor Management": "PARTNERS", "Category Management": "PARTNERS",
               "Service & Maintenance": "OPERATIONS", "Financial Management": "OPERATIONS", "Inventory Management": "OPERATIONS",
               "Content Management System": "OPERATIONS", "Payment And Refund Management": "OPERATIONS"}
    for r in rs:
        if "brief URL" in r["name"]:
            continue
        mod = next((m["module"] for m in SCREENS.values() if m.get("route") == r["route"] and not m.get("click")), "")
        nav.append(f"| {section.get(mod, '')} | {mod + ' › ' if mod and mod != r['name'] else ''}{r['name']} | `{r['route']}` |")
    nav += ["", "## In-page navigation (cards, toggles, tabs)", "", "| From | Control | Result |", "|---|---|---|"]
    for x in sub:
        if x.get("skipped") or x.get("error"):
            res = "navigates in-page (clicked during deep inspection)" if x.get("skipped") else x["error"]
        else:
            res = f"`{x['url']}`" + (" – " + " / ".join(x["newHeadings"][:3]) if x.get("newHeadings") else " (no URL change; content same or inline)")
        nav.append(f"| `{x['route']}` | {x['target']} | {res} |")
    extra = [("`/dashboard/fleet-vehicle-management`", "Vehicle Allocation Portal (deep inspection)", "`/dashboard/fleet-vehicle-management/vehicle-allocation`"),
             ("`/dashboard/user-management`", "Deleted Users", "`/dashboard/user-management/user-deleted-list`"),
             ("Employee Management", "+ Add Employee / + Add New Employee", "`/dashboard/employee-management/onboarding` (multi-step form: Previous / Next)")]
    for a, b_, c in extra:
        nav.append(f"| {a} | {b_} | {c} |")
    for key in sorted(RAW.joinpath("inspect").glob("*.json")):
        s = json.loads(key.read_text(encoding="utf-8"))
        for o in s.get("opened", []):
            cont = str(o.get("container", ""))
            if cont.startswith("page:"):
                nav.append(f"| `{s['url']}` | {clean(o['opened']).replace('row-menu-', '⋮ › ').replace('row-', 'row ')} | `{cont[5:]}` |")
    seen, out = set(), []
    for line in nav:
        if line.startswith("| `") and line in seen:
            continue
        seen.add(line)
        out.append(line)
    (DOC / "Navigation_Inventory.md").write_text("\n".join(out), encoding="utf-8")


if __name__ == "__main__":
    main()
