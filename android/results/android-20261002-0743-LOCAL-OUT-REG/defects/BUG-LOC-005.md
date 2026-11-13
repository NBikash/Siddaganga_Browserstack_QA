# BUG-LOC-005 — No offline feedback: location search and Search Vehicles fail silently without network

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_014, TC_TRIP_009 |
| Module | Location Picker / Trip Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local; App Live Throttle Network = Offline Mode.

## Steps to reproduce
1. Open Pickup Location and type a place name
2. Go back with a valid Local form and tap Search Vehicles twice

## Expected result
A clear no-internet message (with retry) in both places.

## Actual result
Reproduced on app-release_1stOct26.apk via TC_LOC_014, TC_TRIP_009. Original: Location search shows a blank list; Search Vehicles does nothing. No toast, banner or error; no crash.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_LOC_014_1_offline-blank.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_TRIP_009_1_offline-spinner.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
