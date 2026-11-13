# BUG-MLT-017 — Inquiry Details for a Multi leg omits passengers and the selected vehicle

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_21_05 |
| Module | INQ - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Submitted Multi inquiry

## Steps to reproduce
1. Ride > Week > Inquired > View Details on a Multi leg (4589)

## Expected result
Passenger count and selected vehicle shown with the journey

## Actual result
Only route, distance, schedule, total and payment shown

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_21_05_1_inq4589-total-118800.png`

## Error / API / log information
-

## Notes / suspected area
-
