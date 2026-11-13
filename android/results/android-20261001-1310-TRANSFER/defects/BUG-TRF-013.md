# BUG-TRF-013 — Multi-day (By Hour) with only future dates still rejects a pickup time earlier than the current clock

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Transfer > By Hour, Multi-day ON
2. Select only future dates (5, 7 Oct)
3. Pickup Time earlier than the device clock (e.g. 08:26 at 08:30)
4. Search Vehicles

## Expected result
Accepted (no selected date is today)

## Actual result
'Please select a later time.' - early pickups on future dates are blocked (same root cause as TC_HOME_044 in run android-20260930-1058-LOCAL)

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_HOME_065_1_future-dates-past-time-blocked.png`

## Error / API / log information
-

## Notes / suspected area
-
