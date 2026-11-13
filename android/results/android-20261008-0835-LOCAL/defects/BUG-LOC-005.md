# BUG-LOC-005 — No offline feedback: location search and Search Vehicles fail silently without network

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_014, TC_TRIP_009 |
| Module | Location Picker / Trip Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Not re-verified (deferred by user - payment/offline checks out of scope for this run) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
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
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Offline: location search blank list; Search Vehicles gives no feedback at all. | Original: apk via TC_LOC_014, TC_TRIP_009. Original: Location search shows a blank list; Search Vehicles does nothing. No toast, banner or error; no crash.

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Not re-verified (offline simulation not approved this run). No re-test possible in this run.
