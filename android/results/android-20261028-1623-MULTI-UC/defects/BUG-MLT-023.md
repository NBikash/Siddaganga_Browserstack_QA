# BUG-MLT-023 — Multi: committed legs whose pickup time has passed are accepted on Search Vehicles

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_11_15, UC_MLT_11_14 |
| Module | HOME - Multi |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open (9 Oct report 'Leg 1 allows vehicle search with past pickup time') |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Home > Multi

## Steps to reproduce
1. Commit legs with pickup 28-10-2026 12:00 pm while device time is 11:5x
2. Wait until device time passes 12:00
3. Tap Search Vehicles

## Expected result
Search blocked with 'Selected date and time has already passed' for the affected legs

## Actual result
Ready to Explore opens with the past legs (device 12:02, Leg 1 12:00 pm)

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
