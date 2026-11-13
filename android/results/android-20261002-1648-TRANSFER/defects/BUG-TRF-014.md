# BUG-TRF-014 — Transfer Search Vehicles fails silently when offline

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
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
1. Fill a valid Transfer (By Hour) form
2. Turn the device offline
3. Tap Search Vehicles

## Expected result
'No internet connection' message with retry

## Actual result
Retest android-20261002-1648-TRANSFER: Offline: Search Vehicles gives no loader/error/summary after 12 s.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_TRIP_014_1_offline-no-feedback.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
