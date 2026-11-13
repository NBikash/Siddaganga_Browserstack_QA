# BUG-TRF-007 — Transfer Trip Summary does not show the number of hours (By Hour) or pickup time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. By Hour search with 4 hours
2. Review Trip Summary

## Expected result
Hours and pickup time listed

## Actual result
Only Trip Type, Route, Distance (> 30 KM), Dates, Pickup/Drop, Passengers

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_TRIP_013_1_byhour-drop-summary.png`

## Error / API / log information
-

## Notes / suspected area
-
