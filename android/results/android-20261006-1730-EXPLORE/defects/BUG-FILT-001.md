# BUG-FILT-001 — No active-filter badge or count on the Explore filter icon

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_FILT_005 |
| Module | Explore - Filters |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
A filter applied

## Steps to reproduce
1. Apply Leathered Seats
2. Look at the filter icon on Explore

## Expected result
Icon shows a badge/count of active filters.

## Actual result
Icon unchanged; count visible only inside the open sheet.

## Evidence
- `android/evidence/android-20261006-1730-EXPLORE/TC_FILT_005_1_no-active-filter-indicator.png`

## Error / API / log information
-

## Notes / suspected area
Inventory remark OBS-20.
