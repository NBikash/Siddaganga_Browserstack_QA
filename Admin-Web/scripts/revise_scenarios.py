"""Review copy of the four-column scenario documents with two corrections:
  1. "(to be confirmed)" appended to every "Check …" step whose outcome was not observed during exploration
     (scenario source status was Needs Verification/Blocked, or the source bullet carried a Needs Verification note);
  2. duplicate (Module, Use Case Title) pairs disambiguated with the screen name.

Scenario IDs, order, action steps and the four columns are preserved. The existing documents are only read; output goes to
documentation/scenarios/review/. Before changing anything the script rebuilds every row from the same sources and asserts it
matches the current documents exactly.
Run: python scripts/revise_scenarios.py
"""
import json
import re
from collections import Counter, OrderedDict
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill

import build_scenarios as bs  # also puts documentation/source on sys.path via build_docs
import build_docs as bd
from manual_cases import MANUAL_CASES
from interim_cases import INTERIM_CASES
from screen_meta import SCREENS
from build_interim import DOWNGRADE  # hand-written cases whose outcome was only partly observed

# Generated scenarios: outcomes actually observed during read-only inspection. Everything else (search/filter results,
# pagination behaviour, submissions, validation, export, status changes …) was not exercised and is flagged.
OBSERVED_PREFIX = ("the dropdown lists",)


def generated_observed(c):
    f = c["func"]
    return (f in ("Screen navigation & load", "Direct URL access", "Row actions menu")
            or f.endswith(" display") or f.endswith("– open/layout") or f.endswith("– cancel") or f.endswith("– prefill")
            or (f == "Empty state" and c["type"] == "UI"))

SRC_DIR = bd.ROOT / "documentation" / "scenarios"
SRC_X = SRC_DIR / "Admin_Web_Scenarios_and_Use_Cases.xlsx"
SRC_M = SRC_DIR / "Admin_Web_Scenarios_and_Use_Cases.md"
OUT = SRC_DIR / "review"
OUT_X = OUT / "Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx"
OUT_M = OUT / "Admin_Web_Scenarios_and_Use_Cases_REVIEW.md"
TBC = " (to be confirmed)"
HEAD = ["Scenario ID", "Module", "Use Case Title", "Scenario Steps"]


def expected_items(expected):
    return expected if isinstance(expected, list) else [e[2:] if e.startswith("- ") else e for e in str(expected).split("\n")]


def checks_with_flags(expected, scenario_unconfirmed, keep_observed_prefix=False):
    """Same transformation as build_scenarios.checks, but per bullet, keeping whether the outcome is unconfirmed."""
    out = []
    for e in expected_items(expected):
        c = bs.checks([e])
        if c:
            unc = scenario_unconfirmed or "Needs Verification" in e
            if keep_observed_prefix and e.strip().lower().startswith(OBSERVED_PREFIX) and "Needs Verification" not in e:
                unc = False  # e.g. dropdown option lists were read during inspection
            out.append((c[0], unc))
    return out


def collect():
    """Rebuild rows exactly as build_scenarios.main does, retaining screen and per-check confirmation flags."""
    rows = []  # module, screen, title, action steps, [(check, unconfirmed)]
    for mc in MANUAL_CASES:
        meta = SCREENS.get(mc["screen_key"], {})
        if meta.get("module") in ("Authentication", "Global Navigation & Header"):
            unc = mc.get("status", "Documented") != "Documented" or mc["title"] in DOWNGRADE
            rows.append((meta["module"], meta["screen"], mc["title"], mc["steps"], checks_with_flags(mc["expected"], unc)))
    for c in INTERIM_CASES:
        rows.append((c["module"], c["feature"], c["title"], c["steps"], checks_with_flags(c["expected"], c["status"] != "Documented")))
    route_scan = {r["route"]: r for r in json.loads((bd.RAW / "route-scan.json").read_text(encoding="utf-8"))}
    b = bd.Builder()
    for key, meta in SCREENS.items():
        if meta.get("manual_only") or key in bs.HAND_WRITTEN:
            continue
        if key in bs.EXCLUDED and not (bs.INSPECT / f"{key}-r2.json").exists():
            continue
        f = bs.latest_file(key)
        if not f:
            continue
        s = json.loads(f.read_text(encoding="utf-8"))
        ri = route_scan.get(meta.get("route", "").split("?")[0]) if not meta.get("click") else None
        bd.gen_screen(b, key, meta, s, ri or {})
    for c in b.cases:
        steps = [x.split(". ", 1)[1] if x.split(". ", 1)[0].isdigit() else x for x in c["steps"].split("\n") if x.strip()]
        unc = c["status"] != "Documented" or not generated_observed(c)
        rows.append((c["module"], c["screen"], c["title"], steps, checks_with_flags(c["expected"], unc, keep_observed_prefix=True)))
    # same de-duplication and ordering as build_scenarios
    by_mod = OrderedDict((m, []) for m in bs.MODULE_ORDER)
    seen = set()
    for r in rows:
        k = (r[0], r[1], r[2])
        if k in seen:
            continue
        seen.add(k)
        by_mod[r[0]].append(r)
    return [r for m in by_mod for r in by_mod[m]]


def read_xlsx(path):
    return [tuple(r) for r in load_workbook(path)["All Scenarios"].iter_rows(min_row=2, values_only=True)]


def write(final, scope_rows):
    OUT.mkdir(parents=True, exist_ok=True)
    wb = Workbook()

    def sheet(ws, data):
        ws.append(HEAD)
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
    mods = list(OrderedDict.fromkeys(r[1] for r in final))
    for m in mods:
        sheet(wb.create_sheet(m.replace("&", "and")[:31]), [r for r in final if r[1] == m])
    sc = wb.create_sheet("Scope")
    sc.append(["Item", "Detail"])
    for row in scope_rows:
        sc.append(list(row))
    for c in sc[1]:
        c.font = Font(bold=True)
    sc.column_dimensions["A"].width = 30
    sc.column_dimensions["B"].width = 140
    for row in sc.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
    wb.save(OUT_X)

    md = ["# Admin Web – Scenarios & Use Cases (REVIEW COPY)", "",
          "Review copy of `Admin_Web_Scenarios_and_Use_Cases` with two corrections: steps whose outcome was not observed during "
          "exploration end with \"(to be confirmed)\", and duplicate titles name their screen. Scenario IDs are unchanged.",
          "Generated 2026-10-30 from read-only exploration of the DEV Admin Web as Superadmin. No scenario has been executed.", "",
          "| Module | Scenarios |", "|---|---|"]
    md += [f"| {m} | {sum(r[1] == m for r in final)} |" for m in mods]
    md += [f"| **Total** | **{len(final)}** |", ""]
    for m in mods:
        md += [f"## {m}", "", "| Scenario ID | Module | Use Case Title | Scenario Steps |", "|---|---|---|---|"]
        for sid, mod, t, st in (r for r in final if r[1] == m):
            md.append(f"| {sid} | {mod} | {t.replace('|', '/')} | {st.replace('|', chr(92) + '|').replace(chr(10), '<br>')} |")
        md.append("")
    OUT_M.write_text("\n".join(md), encoding="utf-8")


def main():
    current = read_xlsx(SRC_X)
    rebuilt = collect()
    assert len(rebuilt) == len(current), f"row count differs: rebuilt {len(rebuilt)} vs current {len(current)}"
    final, flagged_steps, flagged_rows = [], 0, []
    for cur, (mod, screen, title, steps, chk) in zip(current, rebuilt):
        sid, cmod, ctitle, csteps = cur
        expect_text = bs.numbered(list(steps) + [c for c, _ in chk])
        assert (cmod, ctitle, csteps) == (mod, title, expect_text), f"{sid}: rebuilt row does not match the current document"
        new_checks = [c + TBC if unc else c for c, unc in chk]
        n = sum(unc for _, unc in chk)
        if n:
            flagged_steps += n
            flagged_rows.append(sid)
        final.append([sid, mod, title, bs.numbered(list(steps) + new_checks), screen])
    # duplicate titles → add screen name
    dup = {k for k, v in Counter((r[1], r[2]) for r in final).items() if v > 1}
    renamed = []
    for r in final:
        if (r[1], r[2]) in dup:
            old = r[2]
            r[2] = f"{old} – {r[4]}"
            renamed.append((r[0], old, r[2]))
    final = [tuple(r[:4]) for r in final]
    scope = load_workbook(SRC_X)["Scope"]
    scope_rows = [tuple(c.value for c in row) for row in scope.iter_rows(min_row=2)]
    scope_rows.append(("Review corrections", "'(to be confirmed)' marks checks whose outcome was not observed during read-only exploration; "
                       "duplicate titles carry their screen name. IDs unchanged."))
    write(final, scope_rows)
    report = dict(rows=len(final), flagged_rows=len(flagged_rows), flagged_steps=flagged_steps, renamed=len(renamed),
                  duplicate_groups=len(dup))
    (OUT / "revision-report.json").write_text(json.dumps(dict(report, flagged_ids=flagged_rows,
                                                              renamed=[dict(id=a, before=b_, after=c) for a, b_, c in renamed]), indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report))


if __name__ == "__main__":
    main()
