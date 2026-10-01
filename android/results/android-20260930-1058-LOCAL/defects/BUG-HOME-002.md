# BUG-HOME-002 — Future multi-day trips cannot use pickup times earlier than today's current time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_044 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Logged in; Local; Multi-day on; only future dates selected (16 & 20 Oct 2026); device time 08:10.

## Steps to reproduce
1. Open Pickup Time
2. Drag the hour wheel from 8 to 7 (or 6)

## Expected result
All time slots selectable because none of the selected dates is today.

## Actual result
Wheel snaps back to 8:00 AM; 7 is greyed. Customers cannot book early-morning pickups for future multi-day trips after that hour has passed today.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_HOME_044_1_multiday_time_floor.png`

## Error / API / log information
Min time appears to be computed from 'now' instead of the earliest selected date.

## Notes / suspected area
-
