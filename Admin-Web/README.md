# Admin-Web QA (Siddaganga Travels – Admin portal)

QA project for the Admin-Web portal. Explored on DEV, tested on Preprod as Superadmin, with Playwright driving a headed Chrome.
It runs separately from the Banni/Saagane mobile QA in the parent repository.

## Single source of truth

**[`documentation/01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx`](documentation/01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx)**
holds every consolidated use case (326) and its latest execution status. It is the primary execution tracker.

- Earlier results are kept in each case's **Remarks** ("Earlier run: …").
- The `.json` and `.csv` in `01_Master_Inventory/exports/` are generator copies, synced with the workbook on 19 Nov 2026.
  If they ever disagree, the workbook wins.
- **Not yet consolidated:** 10 modules are catalogued (632 scenarios, DEV, 30 Oct 2026) but are not in the master inventory:
  Authentication, Global Navigation & Header, Dashboard, Role & Permission, Employee, Client, Vendor, Category,
  Service & Maintenance and Financial Management.
  See [`documentation/README.md`](documentation/README.md#modules-catalogued-but-not-yet-consolidated).

## Folder guide

| Folder | Contents | Notes |
|---|---|---|
| `documentation/` | All documents, organised by purpose | Index: [`documentation/README.md`](documentation/README.md) |
| `documentation/01_Master_Inventory/` | Master use-case inventory (source of truth) and its exports | |
| `documentation/02_Workflows_and_Test_Plans/` | End-to-end workflow (Lead → Trip Closure) and functional test plan | Used by the `admin-web-inquiry-to-trip` skill |
| `documentation/03_Reference/` | Module and navigation inventories, open questions, exploration log | DEV exploration, 30 Oct 2026 |
| `documentation/04_Execution_Register/` | One entry per execution run: scope, results, IDs/PNRs, evidence paths | |
| `documentation/05_Superseded_Catalogues_2026-10-30/` | Earlier catalogues (never executed) | Still the only source for the 10 modules above |
| `documentation/90_Archive/` | Earlier versions and the migration log | |
| `results/<run-id>/` | Raw execution results (`usecases.json`, `issues.json`, `record.json`, `steps.json`) | **Do not move**: evidence paths are relative to this project |
| `reports/<run-id>/` | HTML (and PDF) execution reports | **Do not move**: they link to `../../screenshots/…` |
| `screenshots/` | Evidence: exploration screenshots by module; run evidence in `functional/<run-id>/` and `inquiry-to-trip/<run-id>/` | **Do not move** |
| `steps/` | Playwright step scripts: exploration (`*.mjs`), workflow and 13 Nov functional run (`inq2trip/`), 16 Nov Lead run (`func2/`) | Run with `node scripts/run.mjs <step>` |
| `scripts/` | Browser/login/runner (`*.mjs`) and document generators (`*.py`) | Generator inputs are in `scripts/doc_sources/` |
| `test-data/` | Upload test files (generated test permit PDF, non-PDF file) | |
| `exploration-logs/raw/` | Raw exploration dumps | Git-ignored: may contain personal data |
| `.auth/`, `.env` | Browser profile and credentials | Git-ignored; never shared |
| `.claude/skills/` | Claude skill for the Admin workflow and functional runs | |

## Execution runs

| Run ID | Date | Scope | Result | Report |
|---|---|---|---|---|
| `admin-web-20261112-2229-INQ2TRIP` | 12 Nov 2026 | End-to-end workflow, Lead → Trip Closure (one record) | 26 stages: 24 Pass, 1 Blocked, 1 Not Run; 8 defects | `reports/admin-web-20261112-2229-INQ2TRIP/inquiry-to-trip-report.html` |
| `admin-web-20261113-1016-FUNC` | 13 Nov 2026 | Functional QA, all Lead → Trip Closure modules | 94 use cases: 57 Pass, 30 Fail, 1 Blocked, 6 Not Run; 22 defects | `reports/admin-web-20261113-1016-FUNC/admin-functional-qa-report.html` (+ `.pdf`) |
| `admin-web-20261116-1523-FUNC` | 16 Nov 2026 | Lead Management functional QA | 14 use cases: 9 Pass, 2 Fail, 3 Blocked; 4 issues | `reports/admin-web-20261116-1523-FUNC/admin-functional-qa-report.html` |

Details, IDs and PNRs: [`documentation/04_Execution_Register/Execution_Register.md`](documentation/04_Execution_Register/Execution_Register.md).

## Rules

- Credentials stay in `.env` and are never printed, logged, committed or captured in screenshots.
- Actions that change data (Confirm, Send, Delete, Allocate, Close Trip…) need explicit approval each time.
- Do not run `scripts/build_*.py` or `scripts/format_master_workbook.py` without a review. They regenerate documents and
  would overwrite manual updates (see `documentation/90_Archive/MIGRATION_2026-11-19.md`, "Cautions").
