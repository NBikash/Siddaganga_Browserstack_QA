# BUG-TRF-007 — Transfer Trip Summary does not show the number of hours (By Hour) or pickup time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
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
Retest android-20261002-1648-TRANSFER: Transfer Trip Summary still shows neither pickup time nor number of hours.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_TRIP_012_1_no-pickup-time-vehicle-age.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_TRIP_013_1_byhour-drop-kia-no-hours.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
