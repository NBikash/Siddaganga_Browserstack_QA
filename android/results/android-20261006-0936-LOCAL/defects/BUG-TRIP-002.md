# BUG-TRIP-002 — Local trip distance always 80 KM regardless of route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_002 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local.

## Steps to reproduce
1. Search Majestic -> Same as pickup
2. Search Majestic -> Kempegowda International Airport (Different drop location)
3. Compare Distance on the Trip Summary

## Expected result
Distance reflects the actual route (0 km for same place; ~35-40 km Majestic -> KIA), or is labelled as the package allowance.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Majestic to Kempegowda Airport shows 80 KM (fixed value). | Original: apk via TC_TRIP_002. Original: Distance 80 KM in every case.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_TRIP_002_1_distance-80km-majestic-airport.png`

## Error / API / log information
80 km = Local package allowance (8Hr/80Km); label 'Distance' is misleading.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
