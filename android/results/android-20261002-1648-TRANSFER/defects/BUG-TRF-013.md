# BUG-TRF-013 — Multi-day (By Hour) with only future dates still rejects a pickup time earlier than the current clock

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

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
Retest android-20261002-1648-TRANSFER: Multi-day 5/7 Oct: pickup time earlier than now (1:30 AM, 12:30 PM) silently reverts to 01:30 pm.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_065_1_time-snaps-back-to-pm.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
