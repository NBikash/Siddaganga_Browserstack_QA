# BUG-MLT-013 — Multi vehicle list: Vehicle Details / fare breakup cannot be opened in per-leg selection mode

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_13_06, UC_MLT_14_02 |
| Module | VLIST / VDET - Multi |
| Severity (proposed) | High |
| Priority (proposed) | P2 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Multi search with committed legs

## Steps to reproduce
1. Search Vehicles > Search Vehicles
2. Tap a vehicle card title or image

## Expected result
Vehicle Details (gallery, specs, fare breakup) opens; selection via the circle

## Actual result
Nothing opens; only the circle toggles selection. The capacity banner even instructs 'Open a vehicle to review it'.

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
