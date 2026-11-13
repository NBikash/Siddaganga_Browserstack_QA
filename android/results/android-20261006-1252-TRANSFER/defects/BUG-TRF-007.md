# BUG-TRF-007 — Transfer Trip Summary does not show the number of hours (By Hour) or pickup time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_013, TC_TRIP_012 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_TRIP_013: (b) By Hour Majestic, 15-10-2026 10:30 am, 4 h, drop KIA: Trip Summary badge Transfer (By Hour) and Trip Type Transfer (By Hour) (improved), Route Majestic -> KIA, Drop Location KIA, Distance > 30 KM (consistent with P2P), Dates 15 Oct 2026. Still failing: number of hours (4) and pickup time 10:30 am are not shown anywhere on the summary. (a) 25 h case no longer reachable (max 24 h now enforced). | TC_TRIP_012: Search shows a loader while calculating (OK) and Distance > 30 KM for Majestic -> KIA (consistent with Long Transfer) - but the pickup time (09:26 am) is not shown anywhere on the summary (Dates 08 Oct, 2026 only).

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_TRIP_013_1_byhour-summary-no-hours.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_HOME_077_1_drop-before-pickup-accepted.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
