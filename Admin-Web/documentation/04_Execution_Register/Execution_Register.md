# Admin-Web execution register

One entry per execution run, taken from each run's results files and report (nothing re-executed). Environment for all
runs: Preprod Admin-Web, Superadmin. The per-case latest status lives in the master inventory
(`../01_Master_Inventory/Admin_Web_Master_Use_Case_Inventory.xlsx`). Paths below are relative to `Admin-Web/`.

| Run ID | Date | Mode | Scope | Result | Defects / issues |
|---|---|---|---|---|---|
| `admin-web-20261112-2229-INQ2TRIP` | 12 Nov 2026 | Workflow | One record, Lead → Trip Closure | 26 stages: 24 Pass, 1 Blocked (S14), 1 Not Run (S15); final state Trip Closed: Yes | 8 defects |
| `admin-web-20261113-1016-FUNC` | 13 Nov 2026 | Functional | 94 use cases across Lead → Trip Closure (plan `Admin_Functional_QA_Coverage.md`) | 57 Pass, 30 Fail, 1 Blocked, 6 Not Run | 43 issue records, 22 of them defects |
| `admin-web-20261116-1523-FUNC` | 16 Nov 2026 | Functional | 14 Lead Management use cases (AW-LEA IDs) | 9 Pass, 2 Fail, 3 Blocked | 4 issues (F2-LM-01, 02, 04, 05) |
| `admin-web-20261119-1545-INQ` | 19 Nov 2026 | Functional | 24 Functional-category Inquiry Management use cases (AW-INQ IDs) | 14 Pass, 9 Fail, 1 Blocked | 22 issues (INQ-ISS-01 … 22: 8 High, 8 Medium, 6 Low) |

---

## admin-web-20261112-2229-INQ2TRIP: end-to-end workflow

- **Source inquiry:** User-Web run `user-web-20261112-1317-LOCAL`, TC-01.
- **ID chain:** PNR **MWAG650153** → Lead **LD-341** → Inquiry 932 / **QRY-932** → Quote **1686** → Booking **B-932** →
  Trip **TP-111** (ID taken from a notification). Vehicle KA21AB9876. Invoice notification INV-101 (Finance out of scope).
- **Record identification:** View Lead → Inquiry PNR exact match. The PNR is not searchable in the lead list.
- **Not completed:** S14 Blocked (after Confirm Allocation, TP-111 left the Vehicle Allocation list).
  S15 Not Run (Allocate Driver never offered; a driver was already shown).
- **Master inventory:** AW-XMD-008 (Partial).
- **Files:**
  - Results: `results/admin-web-20261112-2229-INQ2TRIP/` (`record.json`, `steps.json`; S5 is logged twice, so 27 entries)
  - Report: `reports/admin-web-20261112-2229-INQ2TRIP/inquiry-to-trip-report.html`
  - Screenshots: `screenshots/inquiry-to-trip/admin-web-20261112-2229-INQ2TRIP/` (68 files)
  - Steps: `steps/inq2trip/s*.mjs`, report builder `steps/inq2trip/build-report.mjs`
  - Workflow document: `documentation/02_Workflows_and_Test_Plans/Inquiry_to_Trip_Closure.md` §5a

## admin-web-20261113-1016-FUNC: functional QA, Lead → Trip Closure

- **Source inquiry:** User-Web `user-web-20261112-1317-LOCAL` TC-07 (later of the two TC-07 submissions).
- **ID chain:** PNR **SOQS555799** → Lead **LD-353** → Inquiry 944 / **QRY-944** → Quote **1701** → Booking **B-944** →
  Trip **TP-112** → Duty local-1701-1, invoice shown INV-103. Vehicle AR 01 U 8228 (matches the requested 16 Seater
  Premium Urbania); driver "Test Driver". Final state: TP-112 Trip Closed: Yes (Completed Trips).
- **Master inventory:** statuses of the AW-* cases whose Remarks say "admin-web-20261113-1016-FUNC". The Lead Management
  cases among them were re-run or first run on 16 Nov; their 13 Nov results are kept as "Earlier run".
- **Files:**
  - Results: `results/admin-web-20261113-1016-FUNC/` (`usecases.json`, `issues.json`, `record.json`, per-module progress logs)
  - Report: `reports/admin-web-20261113-1016-FUNC/admin-functional-qa-report.html` and `.pdf`
  - Screenshots: `screenshots/functional/admin-web-20261113-1016-FUNC/<module>/` (116 files)
  - Steps: `steps/inq2trip/f-*.mjs`, report builder `steps/inq2trip/build-func-report.mjs`

## admin-web-20261116-1523-FUNC: Lead Management functional QA

- **Use cases:**
  - Pass: AW-LEA-001, 003, 004, 005, 010, 016, 022, 023, 024
  - Fail: AW-LEA-026 (no column sorting), AW-LEA-027 (a lead already sent to Inquiry can be deleted)
  - Blocked: AW-LEA-009, 025, 028 (no sales employees to assign; no Stage/Status edit control)
- **Issues:**

  | ID | Issue | Severity |
  |---|---|---|
  | F2-LM-01 | Columns not sortable | Low |
  | F2-LM-02 | "No sales employees found" (test data / environment) | Medium |
  | F2-LM-04 | Incomplete toast text | Low |
  | F2-LM-05 | Orphaned inquiry QRY-942 after lead delete | Medium |

  There is no F2-LM-03 in `issues.json`.
- **PNRs searched:** 10, of which 6 were matched by exact Inquiry PNR on View Lead:

  | PNR | Lead | Inquiry | Journey |
  |---|---|---|---|
  | HQEF339510 | LD-345 | 936 | Local |
  | IAJA754847 | LD-346 | 937 | Local |
  | XMGZ467530 | LD-347 | 938 | Local |
  | PGDO412043 | LD-351 | 942 | Local |
  | WPKT544822 | LD-352 | 943 | Local |
  | DDEV675048 | LD-397 | 987 | Outstation |

  The other 4 were not found on any lead of the test client: DEUH653857, FXZB482309, YIAC324313, ITYG806764.
- **Data changed in Preprod (approved during the run):**
  - Sent to Inquiry: LD-346, 347, 352, 345, 351 → QRY-937, 938, 943, 936, 942 (Revised quotation).
  - Created: LD-411 "QA Test Lead".
  - Deleted: LD-397 and LD-351. QRY-942 remains without a source lead.
- **Master inventory:** updated 19 Nov 2026 (14 AW-LEA cases; 13 Nov results kept as "Earlier run").
- **Files:**
  - Results: `results/admin-web-20261116-1523-FUNC/` (`usecases.json`, `issues.json`, `record.json`, `lm-read.json`, `s2i-LD-351.json`)
  - Report: `reports/admin-web-20261116-1523-FUNC/admin-functional-qa-report.html`
  - Screenshots: `screenshots/functional/admin-web-20261116-1523-FUNC/lead/` (36 files)
  - Steps: `steps/func2/*.mjs`, report builder `steps/func2/build-report.mjs`

## admin-web-20261119-1545-INQ: Inquiry Management functional QA

- **Scope:** the 24 Functional-category cases of the 38-case Inquiry Management inventory
  (AW-INQ-001, 004, 005, 011–015, 017–019, 026–038). The other 14 are UI / Validation / UX / Security /
  Integration / Data-consistency only and were not run.
- **Result:**
  - Pass: 004, 005, 013, 014, 015, 018, 019, 026, 027, 028, 029, 031, 032, 033
  - Fail: 001 (ID search), 011 (recalculation), 012 (fixed cost), 017 (View Quote not updated), 030 (lead not
    updated after delete), 034 (proforma amount in words), 035 (bus images 400), 036 (sorting), 038 (added
    journey: price, preview, inquiry renumbered)
  - Blocked: 037 (Add Inquiry would create a non-User-Web inquiry)
- **Test data:** User-Web PNRs of the QA client only. Leads were found with Search Lead Info = client name, then
  View Lead (Inquiry PNR exact match).

  | PNR | Lead | Inquiry | Use |
  |---|---|---|---|
  | UMNF499106 | LD-414 | QRY-194 | Quote cases and communications |
  | NCCC102640 | LD-415 | QRY-195, listed as QRY-228 after the journey save | Category assignment, Add New Journey |
  | LJWN815154 | LD-431 | QRY-211 | Sent to Inquiry; data verification |
  | ORZS120376 | LD-433 | QRY-213 | Sent to Inquiry; data verification |
  | YOIT928679 | LD-435 | QRY-215 | Sent to Inquiry; data verification |
  | WPKT544822 | LD-352 | QRY-135 | Cancelled |
  | XMGZ467530 | LD-347 | QRY-130 | Deleted |
  | IAJA754847 | LD-346 | QRY-129 | Converted to booking B-129 |

  - **Data verification only:** SIVM916255 (LD-428), BGVS613665 (LD-416), ZLPS490392 (LD-436).
  - **Renumbered by Preprod since 16 Nov:** QRY-943 → 135, 938 → 130, 937 → 129, 936 → 128.
- **Data changed in Preprod (approved):**
  - Send To Inquiry for 5 leads.
  - QRY-194:
    - description and times (09:00 AM / 08:00 PM) saved;
    - GST changed and reverted;
    - costs and fixed cost changed, then restored to ₹34,200.
  - QRY-195: Trip-2 added (12 Seater Tempo Traveller).
  - QRY-135 cancelled, creating cancellation invoice INV-106.
  - QRY-130 deleted.
  - QRY-129 converted to booking B-129.
  - Sent to the test account:
    - quote follow-up (WhatsApp);
    - proforma invoice (WhatsApp + Email).
  - Proforma PI-B-1003 downloaded.
- **Files:**
  - Results: `results/admin-web-20261119-1545-INQ/` (`usecases.json`, `issues.json`, `record.json`, per-step JSON,
    `downloads/`, `redactions.json`)
  - Report: `reports/admin-web-20261119-1545-INQ/admin-inquiry-management-qa-report.html`
  - Screenshots: `screenshots/functional/admin-web-20261119-1545-INQ/{inquiry,quote,comms}/` (177 files; 42 redacted
    after capture, see `redactions.json`)
  - Steps: `steps/inq3/*.mjs`, report builder `steps/inq3/build-report.mjs`
- **Master inventory:** updated 19 Nov 2026 (24 AW-INQ rows; earlier results kept as "Earlier run"). Archive:
  `documentation/90_Archive/master-inventory/…_pre-INQ-19Nov-update_20261119.*`

---

## Adding a run

1. Use a new run ID `admin-web-YYYYMMDD-HHMM-<MODE>` and keep results, reports and screenshots in the folders above.
2. Update the affected cases in the master inventory. Keep the previous result in Remarks as "Earlier run".
   Archive the workbook in `90_Archive/master-inventory/` first, then sync `exports/`.
3. Add a row and a section to this register.
