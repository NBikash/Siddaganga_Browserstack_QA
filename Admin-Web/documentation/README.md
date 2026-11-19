# Admin-Web documentation index

Last reorganised 19 Nov 2026 (old → new paths: [`90_Archive/MIGRATION_2026-11-19.md`](90_Archive/MIGRATION_2026-11-19.md)).

**Source of truth:** [`01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx`](01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx).
Use cases and execution statuses are maintained only there. Every other use-case document is either a plan, a reference,
or a superseded catalogue.

## 01_Master_Inventory – current

| Document | Content | Status |
|---|---|---|
| `Admin_Web_Master_Use_Case_Inventory.xlsx` | 326 unique use cases in 17 modules (Lead Management → Trip Closure, fleet masters, advance payment, cross-module, roles, compatibility and performance). Sheets: Summary (live formulas), Master Inventory, 17 module sheets, Coverage Not Confirmed, Removed Duplicates (91), Category Legend | **Current, primary execution tracker.** Pass 60, Fail 32, Blocked 3, Partial 2, Not Run 6, Never Executed 223 (19 Nov 2026) |
| `exports/Admin_Web_Master_Use_Case_Inventory.json`, `.csv` | Same cases in generator format (input for `scripts/format_master_workbook.py`) | Synced with the workbook 19 Nov 2026 |

## 02_Workflows_and_Test_Plans – current

| Document | Content |
|---|---|
| `Inquiry_to_Trip_Closure.md` | End-to-end workflow, Admin login → Trip Closure: stages S0–S23, record identity, stop rules, and the real flow observed in run 20261112 (§5a) |
| `Admin_Functional_QA_Coverage.md` | Module-wise functional test plan (95 planned use cases, Lead → Trip Closure) used for run 20261113. Its cases are consolidated into the master inventory |

## 03_Reference – background

| Document | Content | Note |
|---|---|---|
| `Module_Inventory.md` | Modules, submodules, screens, forms and actions | DEV, 30 Oct 2026 |
| `Navigation_Inventory.md` | Routes and sub-navigation | DEV, 30 Oct 2026 |
| `Open_Questions_and_Gaps.md` | Possible defects, open business questions, environment gaps | Some items are answered by later runs (for example B8 sorting, assignment); see the master inventory Remarks |
| `Exploration_Log_2026-10-30.md` | Log of the exploration sessions | Historical; the paths it mentions are the pre-19 Nov ones (see migration log) |

## 04_Execution_Register

[`Execution_Register.md`](04_Execution_Register/Execution_Register.md): every run with its scope, counts, record IDs and PNRs,
data changes made in Preprod, and the paths of its results, report and screenshots.

## 05_Superseded_Catalogues_2026-10-30 – not executed

Built from read-only DEV exploration. Never executed. For Lead → Trip Closure they are **superseded** by the master
inventory (`build_master_inventory.py` consolidated them and removed 91 duplicates). They remain the only documentation for
the modules listed below.

| Folder | Document | Content |
|---|---|---|
| `use-case-catalogue/` | `Admin_Web_Use_Cases.xlsx` / `.md`, `Coverage_Matrix.xlsx`, `coverage-stats.json` | First catalogue: 269 use cases, 96 screens, traceability |
| `scenario-catalogue/` | `Admin_Web_Scenarios_and_Use_Cases.xlsx` / `.md` | 832 scenarios in 14 modules (4-column format). Input for `build_master_inventory.py` |
| `scenario-catalogue-review/` | `Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx` / `.md`, `revision-report.json` | Review copy of the same 832 scenarios: 488 rows reworded ("(to be confirmed)" on unobserved checks, screen names on duplicate titles). IDs unchanged |
| `interim/` | `Admin_Web_Interim_Scenarios.xlsx` / `.md` | 96 interim scenarios (Authentication, Navigation, Dashboard, Lead), later merged into the scenario catalogue |

### Modules catalogued but not yet consolidated

These modules are **catalogued, not yet consolidated into the master inventory**. They have no execution status. Adding
them to the master inventory is a separate, approved task.

| Module | Scenarios in `scenario-catalogue` |
|---|---|
| Authentication | 21 |
| Global Navigation and Header | 14 |
| Dashboard | 29 |
| Role and Permission | 24 |
| Employee Management | 78 |
| Client Management | 196 |
| Vendor Management | 78 |
| Category Management | 90 |
| Service and Maintenance | 86 |
| Financial Management | 16 |
| **Total** | **632** |

Not explored at all (no scenarios): Inventory Management, Content Management System, Payment and Refund Management.

## 90_Archive – historical

| Folder | Content |
|---|---|
| `master-inventory/` | Workbook before the 16 Nov Lead update (`…_pre-LEA-16Nov-update_20261119.xlsx`); JSON/CSV before the 19 Nov sync (`…_pre-19Nov-sync_20261116.*`) |
| `scenario-catalogue/20261030-191020/` | Scenario catalogue before the 30 Oct append (584 rows) |
| `scenario-catalogue-review/20261030-182744/`, `20261030-190252/` | Review copy before each 30 Oct append |
| `MIGRATION_2026-11-19.md` | Old → new mapping, checksums and verification of the 19 Nov reorganisation |

## Outside `documentation/` (unchanged locations)

- Results: `../results/<run-id>/`
- Reports: `../reports/<run-id>/`
- Screenshots: `../screenshots/`
- Step scripts: `../steps/`
- Generators: `../scripts/` (inputs in `../scripts/doc_sources/`)
- Test data: `../test-data/`
