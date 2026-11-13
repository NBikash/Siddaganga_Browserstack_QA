# BUG-UI-MLT-001 — 'Clear selection' button text has low contrast (dark text on maroon) on the No Vehicles Found state

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_13_10 |
| Module | VLIST |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Filter that returns 0 vehicles

## Steps to reproduce
1. Filters > 7 Seater > Apply

## Expected result
Readable button label (white text)

## Actual result
Dark grey label on maroon background

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_13_10_1_no-vehicles-clear-selection-contrast.png`

## Error / API / log information
-

## Notes / suspected area
-
