# BUG-TRIP-001 — Trip Summary omits pickup time and number of hours for Local trips

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_003 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local.

## Steps to reproduce
1. Set pickup (e.g. Majestic), date 30-09-2026, time 10:00 am, 4 passengers, 4 hours
2. Tap Search Vehicles
3. Scroll through the Trip Summary sheet

## Expected result
Summary shows the pickup time (10:00 am) and the booked hours (4 hrs) so the user can review the trip before searching.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Trip Summary still has no pickup time and no hours (also absent on Confirm modal). | Original: apk via TC_TRIP_003. Original: Only Trip Type, Route, Distance, Dates, Pickup, Drop and Passengers are shown; time and hours are missing.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_TRIP_003_1_no-time-no-hours.png`

## Error / API / log information
Previously OBS-11 (multi-day); reproduces for single-day.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - still reproducible. Observed in TC_TRIP_003: Local single-day trip with 10:00 am pickup and 8 hours: Trip Summary shows only Dates '08 Oct, 2026' - no pickup time and no Number of Hours anywhere on the sheet. BUG-TRIP-001 still reproducible.
