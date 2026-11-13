# BUG-OUT-018 — Trip Summary shows a cross-month date range as "06-05 Nov, 2026"

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_011 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Fixed - verified |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Not reproducible (fixed) |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation, Majestic -> Panaji
2. Pickup 06-10-2026, Drop 05-11-2026
3. Search Vehicles

## Expected result
06 Oct - 05 Nov, 2026

## Actual result
FIXED in new build. Verified fixed on app-release_1stOct26.apk via TC_TRIP_011.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_TRIP_011_1_cross-month-fixed.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Fixed - verified.
