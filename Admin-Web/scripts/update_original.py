"""Append scenarios that exist in the review copy but not yet in the main four-column documents.

Main documents: documentation/scenarios/Admin_Web_Scenarios_and_Use_Cases.xlsx|.md
- existing rows are kept exactly (IDs, titles, steps);
- rows whose Scenario ID is not yet present are taken from review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx;
- the current main files are backed up to documentation/scenarios/archive/<timestamp>/ first.
Run: python scripts/update_original.py
"""
import json
import shutil
from datetime import datetime

from openpyxl import load_workbook

import build_scenarios as bs
import revise_scenarios as rv

MAIN_X, MAIN_M = rv.SRC_X, rv.SRC_M


def main():
    current = rv.read_xlsx(MAIN_X)
    review = rv.read_xlsx(rv.OUT_X)
    have = {r[0]: r for r in current}
    for r in review:  # shared IDs must refer to the same module
        if r[0] in have:
            assert have[r[0]][1] == r[1], f"{r[0]}: module mismatch"
    new = [r for r in review if r[0] not in have]
    if not new:
        print(json.dumps({"added": 0, "rows": len(current)}))
        return
    order = {m: i for i, m in enumerate(bs.MODULE_ORDER)}
    final = sorted(list(current) + new, key=lambda r: (order[r[1]], int(r[0].rsplit("-", 1)[1])))

    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    arch = MAIN_X.parent / "archive" / stamp
    arch.mkdir(parents=True, exist_ok=True)
    for p in (MAIN_X, MAIN_M):
        shutil.copy2(p, arch / p.name)

    scope = [tuple(c.value for c in row) for row in load_workbook(MAIN_X)["Scope"].iter_rows(min_row=2)]
    mods = [m for m in bs.MODULE_ORDER if any(r[1] == m for r in final)]
    scope = [r for r in scope if r[0] not in ("Modules included", "Not yet explored (no scenarios)")]
    scope.insert(1, ("Modules included", ", ".join(f"{m} ({sum(r[1] == m for r in final)})" for m in mods)))
    scope.insert(2, ("Not yet explored (no scenarios)", ", ".join(m for m in bs.MODULE_ORDER if m not in mods) or "none"))
    added = {}
    for r in new:
        added[r[1]] = added.get(r[1], 0) + 1
    scope.append((f"Update {stamp}", "Appended " + ", ".join(f"{m} +{n}" for m, n in added.items())
                  + "; existing rows unchanged. Steps ending '(to be confirmed)' describe outcomes not observed during read-only exploration."))

    # reuse the review writer, then move the files onto the main document names
    tmp_x, tmp_m = rv.OUT_X, rv.OUT_M
    rv.OUT_X, rv.OUT_M = MAIN_X, MAIN_M
    try:
        rv.write(final, scope)
    finally:
        rv.OUT_X, rv.OUT_M = tmp_x, tmp_m
    md = MAIN_M.read_text(encoding="utf-8").replace("# Admin Web – Scenarios & Use Cases (REVIEW COPY)", "# Admin Web – Scenarios & Use Cases (modules explored so far)", 1)
    md = md.replace("Review copy of `Admin_Web_Scenarios_and_Use_Cases` with two corrections: steps whose outcome was not observed during "
                    "exploration end with \"(to be confirmed)\", and duplicate titles name their screen. Scenario IDs are unchanged.",
                    "Steps ending \"(to be confirmed)\" describe outcomes not observed during read-only exploration.", 1)
    MAIN_M.write_text(md, encoding="utf-8")
    print(json.dumps({"previous": len(current), "added": len(new), "rows": len(final), "added_by_module": added, "backup": str(arch)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
