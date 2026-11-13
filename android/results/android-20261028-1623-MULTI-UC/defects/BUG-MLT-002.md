# BUG-MLT-002 — Multi: a fully filled leg left open is not included on Search Vehicles ('Please add at least one journey')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_01_11 |
| Module | HOME - Multi |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible on 28 Oct build |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (1/1 this run; 2/2 earlier) |

## Preconditions
Logged in; Home > Multi

## Steps to reproduce
1. Fill Leg #1 Local completely (Majestic, 30-10-2026 10:00 am, 4 h)
2. Do not tap Add Next Journey
3. Tap Search Vehicles

## Expected result
Filled open leg included in the search, or the user is asked to add/discard it

## Actual result
Dialog 'Please add at least one journey to continue.' although a complete leg is on screen

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_01_11_1_open-leg-add-at-least-one-journey.png`

## Error / API / log information
-

## Notes / suspected area
-
