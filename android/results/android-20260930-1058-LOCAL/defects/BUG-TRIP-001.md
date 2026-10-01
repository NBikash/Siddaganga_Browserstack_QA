# BUG-TRIP-001 — Trip Summary omits pickup time and number of hours for Local trips

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_003, TC_HOME_006 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Logged in; Home > Local.

## Steps to reproduce
1. Set pickup (e.g. Majestic), date 30-09-2026, time 10:00 am, 4 passengers, 4 hours
2. Tap Search Vehicles
3. Scroll through the Trip Summary sheet

## Expected result
Summary shows the pickup time (10:00 am) and the booked hours (4 hrs) so the user can review the trip before searching.

## Actual result
Only Trip Type, Route, Distance, Dates, Pickup, Drop and Passengers are shown; time and hours are missing.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_HOME_006_1_summary_no_time_hours.png`
- `android/evidence/android-20260930-1058-LOCAL/TC_TRIP_003_1_no_hours_in_summary.png`

## Error / API / log information
Previously OBS-11 (multi-day); reproduces for single-day.

## Notes / suspected area
-
