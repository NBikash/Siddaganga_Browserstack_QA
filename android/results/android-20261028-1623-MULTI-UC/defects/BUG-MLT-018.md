# BUG-MLT-018 — Cancel Trip dialog on a Multi leg does not state whether only this leg or the whole trip is cancelled

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_21_13 |
| Module | INQ - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (scope behaviour itself fixed - only the chosen leg is cancelled) |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Submitted Multi inquiry; cancellation approved

## Steps to reproduce
1. Open Multi leg 4589 > Cancel Trip

## Expected result
Dialog states scope ('This cancels Leg 3 only')

## Actual result
Dialog shows only Inquiry ID 4589 and refund calculation; no scope statement

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_21_13_1_cancel-4589-sheet.png`

## Error / API / log information
-

## Notes / suspected area
-
