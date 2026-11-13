# BUG-TRF-014 — Transfer Search Vehicles fails silently when offline

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_014 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_TRIP_014: App Live Throttle Network > Offline Mode (status bar shows no Wi-Fi) with a valid By Hour form (Majestic, 07-10 09:55 am, 1 h) -> Search Vehicles: nothing happens - no loader, no Trip Summary, no error/offline message after ~13 s. Network restored afterwards (Turn off network simulation). BUG-TRF-014 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_TRIP_014_1_offline-search-no-feedback.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
