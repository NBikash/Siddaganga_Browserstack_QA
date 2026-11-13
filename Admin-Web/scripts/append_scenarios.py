"""Append newly explored scenarios to the reviewed four-column documents (append-only).

- Existing rows of review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx are kept exactly (IDs, titles, steps).
- Candidates are generated from every inspection file of each screen (base and -rN follow-ups; base files listed in
  build_scenarios.EXCLUDED are skipped because they did not reach their view) plus the hand-written sources.
- A candidate is new when (module, title, first step) is not already present; a candidate whose title already exists for a
  different screen gets " – <screen>" appended. New rows get the next free ID in their module.
- "(to be confirmed)" is applied with the same rule as revise_scenarios.py.
- The previous review files are archived to review/archive/<timestamp>/ before writing.
Run: python scripts/append_scenarios.py
"""
import json
import re
import shutil
from collections import OrderedDict
from datetime import datetime

from openpyxl import load_workbook

import build_scenarios as bs
import build_docs as bd
import revise_scenarios as rv
from manual_cases import MANUAL_CASES
from interim_cases import INTERIM_CASES
from screen_meta import SCREENS, MODULES
from build_interim import DOWNGRADE

TBC = rv.TBC


def inspection_files(key):
    files = sorted(bs.INSPECT.glob(f"{key}-r*.json"), key=lambda p: int(re.search(r"-r(\d+)$", p.stem).group(1)))
    base = bs.INSPECT / f"{key}.json"
    if base.exists() and key not in bs.EXCLUDED:
        files.insert(0, base)
    return files


def candidates():
    rows = []  # module, screen, title, steps, [(check, unconfirmed)]
    for mc in MANUAL_CASES:
        meta = SCREENS.get(mc["screen_key"], {})
        if meta.get("module") in ("Authentication", "Global Navigation & Header"):
            unc = mc.get("status", "Documented") != "Documented" or mc["title"] in DOWNGRADE
            rows.append((meta["module"], meta["screen"], mc["title"], mc["steps"], rv.checks_with_flags(mc["expected"], unc)))
    for c in INTERIM_CASES:
        rows.append((c["module"], c["feature"], c["title"], c["steps"], rv.checks_with_flags(c["expected"], c["status"] != "Documented")))
    route_scan = {r["route"]: r for r in json.loads((bd.RAW / "route-scan.json").read_text(encoding="utf-8"))}
    used = []
    for key, meta in SCREENS.items():
        if meta.get("manual_only") or key in bs.HAND_WRITTEN:
            continue
        for f in inspection_files(key):
            b = bd.Builder()
            s = json.loads(f.read_text(encoding="utf-8"))
            ri = route_scan.get(meta.get("route", "").split("?")[0]) if not meta.get("click") else None
            bd.gen_screen(b, key, meta, s, ri or {})
            used.append(f.stem)
            for c in b.cases:
                steps = [x.split(". ", 1)[1] if x.split(". ", 1)[0].isdigit() else x for x in c["steps"].split("\n") if x.strip()]
                unc = c["status"] != "Documented" or not rv.generated_observed(c)
                rows.append((c["module"], c["screen"], c["title"], steps, rv.checks_with_flags(c["expected"], unc, keep_observed_prefix=True)))
    return rows, used


def main():
    existing = rv.read_xlsx(rv.OUT_X)
    scope_rows = [tuple(c.value for c in row) for row in load_workbook(rv.OUT_X)["Scope"].iter_rows(min_row=2)]
    first_step = lambda steps_text: steps_text.split("\n", 1)[0]
    have = {(r[1], r[2]) for r in existing}
    have_first = {}
    for r in existing:
        have_first.setdefault((r[1], r[2]), set()).add(first_step(r[3]))
    have_base_title = {(r[1], r[2].split(" – ")[0]): r for r in existing}

    cands, used = candidates()
    new_by_mod = OrderedDict((m, []) for m in bs.MODULE_ORDER)
    seen = set()
    for mod, screen, title, steps, chk in cands:
        text = bs.numbered(list(steps) + [c + TBC if unc else c for c, unc in chk])
        fs = first_step(text)
        key = (mod, title, fs)
        if key in seen:
            continue
        seen.add(key)
        if fs in have_first.get((mod, title), set()):
            continue  # already documented (same title, same screen)
        if (mod, title) in have or (mod, title) in have_base_title:
            if (mod, f"{title} – {screen}") in have:
                continue
            title = f"{title} – {screen}"  # same title exists for another screen
        if any(t == title for t, _ in new_by_mod[mod]):
            continue
        new_by_mod[mod].append((title, text))

    # assign IDs: continue each module's sequence
    last = {}
    for r in existing:
        code, n = r[0].rsplit("-", 1)
        last[code] = max(last.get(code, 0), int(n))
    final = [tuple(r) for r in existing]
    added = OrderedDict()
    for mod, items in new_by_mod.items():
        if not items:
            continue
        code = f"ADMIN-{MODULES[mod]['code']}"
        for title, text in items:
            last[code] = last.get(code, 0) + 1
            final.append((f"{code}-{last[code]:03d}", mod, title, text))
        added[mod] = len(items)
    order = {m: i for i, m in enumerate(bs.MODULE_ORDER)}
    final.sort(key=lambda r: (order[r[1]], int(r[0].rsplit("-", 1)[1])))

    if not added:
        print(json.dumps({"added": 0, "rows": len(final)}))
        return
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    arch = rv.OUT / "archive" / stamp
    arch.mkdir(parents=True, exist_ok=True)
    for p in (rv.OUT_X, rv.OUT_M):
        shutil.copy2(p, arch / p.name)
    explored = [m for m in bs.MODULE_ORDER if any(r[1] == m for r in final)]
    scope_rows = [r for r in scope_rows if r[0] not in ("Modules included", "Not yet explored (no scenarios)")]
    scope_rows.insert(1, ("Modules included", ", ".join(f"{m} ({sum(r[1] == m for r in final)})" for m in explored)))
    scope_rows.insert(2, ("Not yet explored (no scenarios)", ", ".join(m for m in bs.MODULE_ORDER if m not in explored) or "none"))
    scope_rows.append((f"Update {stamp}", "Appended " + ", ".join(f"{m} +{n}" for m, n in added.items()) + "; previous rows unchanged."))
    rv.write([tuple(r) for r in final], scope_rows)
    print(json.dumps({"previous": len(existing), "added": sum(added.values()), "rows": len(final), "added_by_module": added,
                      "archive": str(arch), "inspection_files_used": len(used)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
