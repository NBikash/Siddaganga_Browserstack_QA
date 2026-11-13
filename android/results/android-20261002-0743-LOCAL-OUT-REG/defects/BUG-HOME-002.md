# BUG-HOME-002 — Future multi-day trips cannot use pickup times earlier than today's current time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_044 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Fixed - verified |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Not reproducible (fixed) |

## Preconditions
Logged in; Local; Multi-day on; only future dates selected (16 & 20 Oct 2026); device time 08:10.

## Steps to reproduce
1. Open Pickup Time
2. Drag the hour wheel from 8 to 7 (or 6)

## Expected result
All time slots selectable because none of the selected dates is today.

## Actual result
FIXED in new build. Verified fixed on app-release_1stOct26.apk via TC_HOME_044.

## Evidence
-

## Error / API / log information
Min time appears to be computed from 'now' instead of the earliest selected date.

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Fixed - verified.
