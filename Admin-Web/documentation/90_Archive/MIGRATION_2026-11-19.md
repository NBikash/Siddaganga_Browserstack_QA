# Documentation migration, 19 Nov 2026

The documentation-only reorganisation was approved on 19 Nov 2026. **No file was deleted.** No test was executed, no
report was regenerated, no generator was run, and no test case, execution result, report or screenshot was changed.
`results/`, `reports/`, `screenshots/`, `steps/`, `test-data/`, `exploration-logs/raw/`, `.auth/` and `.claude/` stay
where they were.

## 1. Backup (before any change)

- `D:/Siddaganga-BrowserStack-QA/_backups/admin-web-pre-doc-reorg_20261119.zip`
- 52 files: all of `documentation/`, `scripts/`, `.claude/` and `exploration-logs/exploration-log.md`.
- The zip contains `MANIFEST.sha256.json`. It was re-read after writing: zip test passed and all 52 checksums match.

## 2. Master JSON / CSV sync (before the move)

- **Source:** the workbook as updated on 19 Nov 2026 (16 Nov Lead Management results).
- **Kept first:** the previous exports, saved as `90_Archive/master-inventory/…_pre-19Nov-sync_20261116.json|.csv`.
- **Changed:**
  - Only `Latest execution` of the 14 cases AW-LEA-001, 003, 004, 005, 009, 010, 016, 022–028. Each now holds the 16 Nov
    status, observation, issue references and screenshot paths, followed by "Earlier run: …" (the 13 Nov result).
  - JSON `summary.execution` counts, two `summary.unconfirmed` texts, and a new `summary.sync_note`.
- **Checks:**
  - The JSON status matches the workbook for all 326 cases.
  - The CSV equals the JSON in every field, and only 14 CSV cells differ from the previous export.
  - Header, UTF-8 BOM and CRLF line endings are unchanged.

## 3. Old → new mapping (33 files, moved with `os.rename`, checksum equal before and after)

| # | Old path (relative to `Admin-Web/`) | New path | Bytes | SHA-256 (first 16) |
|---|---|---|---|---|
| 1 | `documentation/master-inventory/Admin_Web_Master_Use_Case_Inventory.xlsx` | `documentation/01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx` | 110,485 | `160772f6f9beeb43` |
| 2 | `documentation/master-inventory/Admin_Web_Master_Use_Case_Inventory.json` | `documentation/01_Master_Inventory/exports/Admin_Web_Master_Use_Case_Inventory.json` | 209,928 | `e3e5cc910e6d7471` |
| 3 | `documentation/master-inventory/Admin_Web_Master_Use_Case_Inventory.csv` | `documentation/01_Master_Inventory/exports/Admin_Web_Master_Use_Case_Inventory.csv` | 91,178 | `76d0075e135b68c3` |
| 4 | `documentation/master-inventory/archive/Admin_Web_Master_Use_Case_Inventory_pre-LEA-16Nov-update_20261119.xlsx` | `documentation/90_Archive/master-inventory/Admin_Web_Master_Use_Case_Inventory_pre-LEA-16Nov-update_20261119.xlsx` | 107,272 | `9cb14b7c06d4a50d` |
| 5 | `documentation/master-inventory/archive/Admin_Web_Master_Use_Case_Inventory_pre-19Nov-sync_20261116.json` | `documentation/90_Archive/master-inventory/Admin_Web_Master_Use_Case_Inventory_pre-19Nov-sync_20261116.json` | 203,748 | `d62b119cc55a9635` |
| 6 | `documentation/master-inventory/archive/Admin_Web_Master_Use_Case_Inventory_pre-19Nov-sync_20261116.csv` | `documentation/90_Archive/master-inventory/Admin_Web_Master_Use_Case_Inventory_pre-19Nov-sync_20261116.csv` | 85,672 | `936bfa645b98bf4f` |
| 7 | `documentation/workflows/Inquiry_to_Trip_Closure.md` | `documentation/02_Workflows_and_Test_Plans/Inquiry_to_Trip_Closure.md` | 16,942 | `e547a792cee7e03a` |
| 8 | `documentation/workflows/Admin_Functional_QA_Coverage.md` | `documentation/02_Workflows_and_Test_Plans/Admin_Functional_QA_Coverage.md` | 18,715 | `69d03f9f5109e157` |
| 9 | `documentation/Module_Inventory.md` | `documentation/03_Reference/Module_Inventory.md` | 17,512 | `b44265435b3b0e31` |
| 10 | `documentation/Navigation_Inventory.md` | `documentation/03_Reference/Navigation_Inventory.md` | 16,808 | `2fa047caf458ef3f` |
| 11 | `documentation/Open_Questions_and_Gaps.md` | `documentation/03_Reference/Open_Questions_and_Gaps.md` | 6,877 | `5b76c936f83a2a2f` |
| 12 | `exploration-logs/exploration-log.md` | `documentation/03_Reference/Exploration_Log_2026-10-30.md` | 16,064 | `40e979cdb1342f3c` |
| 13 | `documentation/Admin_Web_Use_Cases.xlsx` | `documentation/05_Superseded_Catalogues_2026-10-30/use-case-catalogue/Admin_Web_Use_Cases.xlsx` | 64,007 | `9dfdc25fb0802b53` |
| 14 | `documentation/Admin_Web_Use_Cases.md` | `documentation/05_Superseded_Catalogues_2026-10-30/use-case-catalogue/Admin_Web_Use_Cases.md` | 261,638 | `d782c89f7870083d` |
| 15 | `documentation/Coverage_Matrix.xlsx` | `documentation/05_Superseded_Catalogues_2026-10-30/use-case-catalogue/Coverage_Matrix.xlsx` | 20,986 | `30b0ef0eb75afea6` |
| 16 | `documentation/coverage-stats.json` | `documentation/05_Superseded_Catalogues_2026-10-30/use-case-catalogue/coverage-stats.json` | 503 | `3638d31d3364236c` |
| 17 | `documentation/scenarios/Admin_Web_Scenarios_and_Use_Cases.xlsx` | `documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue/Admin_Web_Scenarios_and_Use_Cases.xlsx` | 166,993 | `522ad50435a2df3c` |
| 18 | `documentation/scenarios/Admin_Web_Scenarios_and_Use_Cases.md` | `documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue/Admin_Web_Scenarios_and_Use_Cases.md` | 456,182 | `74cd93ef5c9d92fb` |
| 19 | `documentation/scenarios/review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | `documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue-review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | 167,995 | `70e49c00c74ea0fc` |
| 20 | `documentation/scenarios/review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | `documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue-review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | 472,376 | `980c9bf0b6dff7f1` |
| 21 | `documentation/scenarios/review/revision-report.json` | `documentation/05_Superseded_Catalogues_2026-10-30/scenario-catalogue-review/revision-report.json` | 16,915 | `29131feb1a376aee` |
| 22 | `documentation/interim/Admin_Web_Interim_Scenarios.xlsx` | `documentation/05_Superseded_Catalogues_2026-10-30/interim/Admin_Web_Interim_Scenarios.xlsx` | 32,878 | `3491ccc5b272b92f` |
| 23 | `documentation/interim/Admin_Web_Interim_Scenarios.md` | `documentation/05_Superseded_Catalogues_2026-10-30/interim/Admin_Web_Interim_Scenarios.md` | 95,711 | `099f7e09cc9b82cf` |
| 24 | `documentation/scenarios/archive/20261030-191020/Admin_Web_Scenarios_and_Use_Cases.xlsx` | `documentation/90_Archive/scenario-catalogue/20261030-191020/Admin_Web_Scenarios_and_Use_Cases.xlsx` | 124,288 | `8e1d4135390fe13e` |
| 25 | `documentation/scenarios/archive/20261030-191020/Admin_Web_Scenarios_and_Use_Cases.md` | `documentation/90_Archive/scenario-catalogue/20261030-191020/Admin_Web_Scenarios_and_Use_Cases.md` | 312,993 | `ed73ef3f8d43135a` |
| 26 | `documentation/scenarios/review/archive/20261030-182744/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | `documentation/90_Archive/scenario-catalogue-review/20261030-182744/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | 125,629 | `e08b9c4f74f56182` |
| 27 | `documentation/scenarios/review/archive/20261030-182744/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | `documentation/90_Archive/scenario-catalogue-review/20261030-182744/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | 329,018 | `348205b6365633a3` |
| 28 | `documentation/scenarios/review/archive/20261030-190252/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | `documentation/90_Archive/scenario-catalogue-review/20261030-190252/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` | 135,623 | `29a1c5bf37a27138` |
| 29 | `documentation/scenarios/review/archive/20261030-190252/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | `documentation/90_Archive/scenario-catalogue-review/20261030-190252/Admin_Web_Scenarios_and_Use_Cases_REVIEW.md` | 369,830 | `9d10a9bb60695443` |
| 30 | `documentation/source/e2e_cases.py` | `scripts/doc_sources/e2e_cases.py` | 16,361 | `2d7eac83b939f354` |
| 31 | `documentation/source/interim_cases.py` | `scripts/doc_sources/interim_cases.py` | 30,106 | `2efee7f80cb36ffa` |
| 32 | `documentation/source/manual_cases.py` | `scripts/doc_sources/manual_cases.py` | 21,962 | `3b59f9f30bcf05eb` |
| 33 | `documentation/source/screen_meta.py` | `scripts/doc_sources/screen_meta.py` | 32,376 | `284e7d2890d83d73` |

**Empty folders removed after the move** (they no longer contained files): `documentation/master-inventory/` (and
`archive/`), `documentation/workflows/`, `documentation/scenarios/` (with `archive/…` and `review/archive/…`) and
`documentation/interim/`.

**Left in place:** `documentation/source/__pycache__/` (Python cache files of the moved sources, not deleted).

## 4. Path references updated (path lines only, no logic changed)

| File | Change |
|---|---|
| `scripts/build_master_inventory.py` | Reads the plan from `02_Workflows_and_Test_Plans/` and the catalogues from `05_Superseded_Catalogues_2026-10-30/`; writes the `.xlsx` to `01_Master_Inventory/` and the `.json`/`.csv` to `01_Master_Inventory/exports/` |
| `scripts/format_master_workbook.py` | Reads `01_Master_Inventory/exports/…json`; writes `01_Master_Inventory/…xlsx` |
| `scripts/build_docs.py` | Catalogue outputs → `05_…/use-case-catalogue/`; `Module_Inventory.md`, `Navigation_Inventory.md` → `03_Reference/`; sources → `scripts/doc_sources/` |
| `scripts/build_interim.py` | Sources → `scripts/doc_sources/`; output → `05_…/interim/` |
| `scripts/build_scenarios.py` | Output → `05_…/scenario-catalogue/` |
| `scripts/revise_scenarios.py` | Input `05_…/scenario-catalogue/`; output `05_…/scenario-catalogue-review/`; one comment |
| `scripts/update_original.py` | Backups → `90_Archive/scenario-catalogue/<timestamp>/` |
| `scripts/append_scenarios.py` | Backups → `90_Archive/scenario-catalogue-review/<timestamp>/` |
| `.claude/skills/admin-web-inquiry-to-trip/SKILL.md` | Two workflow document paths → `documentation/02_Workflows_and_Test_Plans/` |

Original line endings were kept (LF, or CRLF for `build_docs.py`, `build_scenarios.py` and `revise_scenarios.py`). The diff
against the backup contains only the path lines above. No `.mjs` step or script was changed.

**Not changed (historical text):** `03_Reference/Exploration_Log_2026-10-30.md` and the superseded catalogues still name
the pre-19 Nov paths. Use the table in §3 to translate them.

## 5. New files

- `Admin-Web/README.md`: project index and source-of-truth statement.
- `documentation/README.md`: document index, status, and the 10 catalogued-but-not-consolidated modules.
- `documentation/04_Execution_Register/Execution_Register.md`: the 3 runs with IDs, PNRs, data changes and paths.
- `documentation/90_Archive/MIGRATION_2026-11-19.md`: this file.

## 6. Verification after the migration

| Check | Result |
|---|---|
| Checksums of the 33 moved files (before vs after) | 33 / 33 equal |
| Master workbook vs backup | Byte-identical. 22 sheets, 326 unique cases, 417 Summary formulas over rows 2–327. Pass 60, Fail 32, Blocked 3, Partial 2, Not Run 6, Never Executed 223 |
| Script path constants (modules imported without running `main`) | 27 / 27 resolve to existing files or folders. `doc_sources` imported from `scripts/doc_sources/`. No file changed by the imports |
| HTML report links (3 reports, 158 unique local links to screenshots / anchors) | 0 missing |
| Paths named in `SKILL.md` | All exist |
| `scripts/*.mjs` vs backup | Unchanged |

## 7. Cautions

- `format_master_workbook.py` rebuilds the workbook from `exports/…json`. Case statuses and history would survive, because
  they are now in `Latest execution`. But it would replace the 19 Nov wording of the Summary notes and of the "Sorting" and
  "Cancel, Cancel & Notify, Delete" rows of *Coverage Not Confirmed* with its built-in text. It would also print the
  history on one line per case. Review before running it.
- `build_master_inventory.py` rebuilds the inventory from the plan, the catalogues and the 13 Nov results only. Running it
  would lose the 16 Nov updates. Do not run it without first adding the 16 Nov run to its inputs.
- The Summary note "25 of 27 steps Pass" (end-to-end run) is unchanged. The report shows 24 of 26 stages; `steps.json`
  logs S5 twice.
- Git: files were moved with plain file operations and nothing was staged or committed. Git will show the tracked files
  as deleted and added.
