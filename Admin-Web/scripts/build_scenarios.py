"""Scenario & Use Case document (4 columns: Scenario ID, Module, Use Case Title, Scenario Steps) for every module and
screen explored so far, including partially explored modules.

Sources (read-only): documentation/source/{manual_cases,interim_cases,screen_meta}.py, exploration-logs/raw/route-scan.json,
exploration-logs/raw/inspect/*.json. Writes only documentation/scenarios/.
Run: python scripts/build_scenarios.py
"""
import json
import re
import sys
from collections import OrderedDict
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_docs as bd  # noqa: E402  (reuses the observed-data scenario generator)
from manual_cases import MANUAL_CASES  # noqa: E402
from interim_cases import INTERIM_CASES  # noqa: E402
from screen_meta import SCREENS, MODULES  # noqa: E402

OUT = bd.ROOT / "documentation" / "scenarios"
INSPECT = bd.RAW / "inspect"

# Saved views whose captured content is not the intended view (kept as raw data, excluded from the document)
EXCLUDED = {
    "fleet-live-trips": "click did not reach the view – superseded by fleet-live-trips-r2",
    "employee-onboarding": "panel click showed the default Employee dashboard (not a distinct view)",
    "client-regular-invoice-payment": "opened via ?tab= URL – tab content switch not confirmed",
    "client-contracted-invoice-mgmt": "opened via ?tab= URL – URL reverted, tab content not reached",
    "client-contracted-client-requests": "opened via ?tab= URL – showed the All Clients table",
}
HAND_WRITTEN = {"dashboard", "lead-all"}  # covered by interim_cases (hand-written from the same data)
MODULE_ORDER = ["Authentication", "Global Navigation & Header", "Dashboard", "Role & Permission", "Employee Management",
                "Fleet & Vehicle Management", "Booking & Operations", "Inquiry Management", "Lead Management",
                "Client Management", "Vendor Management", "Category Management", "Service & Maintenance",
                "Financial Management", "Inventory Management", "Content Management System", "Payment And Refund Management"]


def latest_file(key):
    """Prefer the newest successful follow-up (-r3 > -r2 > base)."""
    for suffix in ("-r3", "-r2", ""):
        f = INSPECT / f"{key}{suffix}.json"
        if f.exists():
            return f
    return None


UNCERTAIN = re.compile(r"\s*[(–-]?\s*(exact text|rule|definitions?|limits|mechanism|format|policy|exact definition per card)?\s*[–-]?\s*Needs Verification[^.;)]*\)?", re.I)
SKIP_CHECK = re.compile(r"^(observed\b|which |whether |how |confirm |note:|card definitions|limits and|no maxlength|.*must be confirmed|.*not exercised|.*not observed|.*not clicked)", re.I)


def checks(expected):
    """Turn expected-result bullets into 'Check that …' steps (status markers removed, open points dropped)."""
    items = expected if isinstance(expected, list) else [e[2:] if e.startswith("- ") else e for e in str(expected).split("\n")]
    out = []
    for e in items:
        e = e.strip()
        if not e or SKIP_CHECK.search(e):
            continue
        e = re.sub(r"^Expected:\s*", "", e)
        # drop whole parenthetical status notes first, e.g. "(formatting – Needs Verification)"
        e = re.sub(r"\s*\([^()]*Needs Verification[^()]*\)", "", e)
        e = UNCERTAIN.sub("", e).strip().rstrip(" –-")
        e = re.sub(r"\(\s*\)", "", e).strip()
        if len(e) < 8:
            continue
        if e.lower().startswith(("check", "verify")):
            out.append(e)
        elif re.match(r"^[A-Z][\w /&()'.-]{0,45}:\s", e):  # label-style bullet, e.g. "Buttons: …", "Fields shown: …"
            out.append("Check – " + e)
        else:
            out.append("Check that " + e[0].lower() + e[1:])
    return out


def numbered(steps):
    return "\n".join(f"{i}. {s}" for i, s in enumerate(steps, 1))


def main():
    route_scan = {r["route"]: r for r in json.loads((bd.RAW / "route-scan.json").read_text(encoding="utf-8"))}
    rows = []  # (module, screen, title, steps_text)
    included, skipped = [], []

    # Authentication + Global Navigation (hand-written, observed pages)
    for mc in MANUAL_CASES:
        meta = SCREENS.get(mc["screen_key"], {})
        if meta.get("module") in ("Authentication", "Global Navigation & Header"):
            rows.append((meta["module"], meta["screen"], mc["title"], numbered(mc["steps"] + checks(mc["expected"]))))
    # Dashboard + Lead Management (hand-written interim scenarios)
    for c in INTERIM_CASES:
        rows.append((c["module"], c["feature"], c["title"], numbered(c["steps"] + checks(c["expected"]))))
    included += ["auth-login", "auth-forgot", "auth-otp", "nav-sidebar", "nav-header", "dashboard", "lead-all"]

    # Every other inspected screen: scenarios generated from the observed UI data
    b = bd.Builder()
    for key, meta in SCREENS.items():
        if meta.get("manual_only") or key in HAND_WRITTEN:
            continue
        if key in EXCLUDED and not (INSPECT / f"{key}-r2.json").exists():
            skipped.append((key, EXCLUDED[key]))
            continue
        f = latest_file(key)
        if not f:
            skipped.append((key, "not yet inspected"))
            continue
        s = json.loads(f.read_text(encoding="utf-8"))
        ri = route_scan.get(meta.get("route", "").split("?")[0]) if not meta.get("click") else None
        bd.gen_screen(b, key, meta, s, ri or {})
        included.append(f.stem)
    for c in b.cases:
        steps = [x.split(". ", 1)[1] if x.split(". ", 1)[0].isdigit() else x for x in c["steps"].split(chr(10)) if x.strip()]
        rows.append((c["module"], c["screen"], c["title"], numbered(steps + checks(c["expected"]))))

    # group by module, drop duplicate titles within a screen, assign sequential IDs
    by_mod = OrderedDict((m, []) for m in MODULE_ORDER)
    seen = set()
    for m, scr, t, st in rows:
        k = (m, scr, t)
        if k in seen:
            continue
        seen.add(k)
        by_mod[m].append((t, st))
    by_mod = OrderedDict((m, v) for m, v in by_mod.items() if v)
    final = []
    for m, items in by_mod.items():
        for i, (t, st) in enumerate(items, 1):
            final.append((f"ADMIN-{MODULES[m]['code']}-{i:03d}", m, t, st))

    OUT.mkdir(parents=True, exist_ok=True)
    head = ["Scenario ID", "Module", "Use Case Title", "Scenario Steps"]
    wb = Workbook()

    def sheet(ws, data):
        ws.append(head)
        for r in data:
            ws.append(list(r))
        for c in ws[1]:
            c.font = Font(bold=True, color="FFFFFF")
            c.fill = PatternFill("solid", fgColor="7A1E2C")
        for row in ws.iter_rows(min_row=2):
            for c in row:
                c.alignment = Alignment(wrap_text=True, vertical="top")
        for col, w in zip("ABCD", (18, 28, 60, 100)):
            ws.column_dimensions[col].width = w
        ws.freeze_panes = "A2"
        ws.auto_filter.ref = ws.dimensions

    ws = wb.active
    ws.title = "All Scenarios"
    sheet(ws, final)
    for m in by_mod:
        sheet(wb.create_sheet(m.replace("&", "and")[:31]), [r for r in final if r[1] == m])
    sc = wb.create_sheet("Scope")
    sc.append(["Item", "Detail"])
    for row in [("Generated", "2026-10-30 from read-only exploration of DEV Admin Web as Superadmin. No scenario has been executed."),
                ("Modules included", ", ".join(f"{m} ({len(v)})" for m, v in by_mod.items())),
                ("Not yet explored (no scenarios)", ", ".join(m for m in MODULE_ORDER if m not in by_mod)),
                ("Saved views excluded", "; ".join(f"{k}: {why}" for k, why in skipped if why != "not yet inspected")),
                ("Execution note", "Steps that create, edit, delete, send, sync or change status write data or trigger communication in DEV – obtain approval and use QA-TEST- prefixed data.")]:
        sc.append(list(row))
    for c in sc[1]:
        c.font = Font(bold=True)
    sc.column_dimensions["A"].width = 30
    sc.column_dimensions["B"].width = 140
    for row in sc.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    wb.save(OUT / "Admin_Web_Scenarios_and_Use_Cases.xlsx")

    md = ["# Admin Web – Scenarios & Use Cases (modules explored so far)", "",
          "Generated 2026-10-30 from read-only exploration of the DEV Admin Web as Superadmin. No scenario has been executed.",
          "Covers fully and partially explored modules only; modules not yet explored have no scenarios yet.", "",
          "| Module | Scenarios |", "|---|---|"]
    md += [f"| {m} | {len(v)} |" for m, v in by_mod.items()]
    md += [f"| **Total** | **{len(final)}** |", "",
           "Not yet explored: " + ", ".join(m for m in MODULE_ORDER if m not in by_mod) + ".", ""]
    for m in by_mod:
        md += [f"## {m}", "", "| Scenario ID | Module | Use Case Title | Scenario Steps |", "|---|---|---|---|"]
        for sid, mod, t, st in (r for r in final if r[1] == m):
            cell = st.replace("|", "\\|").replace("\n", "<br>")
            md.append(f"| {sid} | {mod} | {t.replace('|', '/')} | {cell} |")
        md.append("")
    (OUT / "Admin_Web_Scenarios_and_Use_Cases.md").write_text("\n".join(md), encoding="utf-8")
    print({m: len(v) for m, v in by_mod.items()}, "TOTAL", len(final))
    print("inspected files used:", len(included) - 7, "| excluded:", [k for k, w in skipped if w != "not yet inspected"])


if __name__ == "__main__":
    main()
