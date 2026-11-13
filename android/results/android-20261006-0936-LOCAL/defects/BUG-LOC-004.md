# BUG-LOC-004 — Identical pickup and drop accepted; Trip Summary shows 80 KM and a looping route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_012 |
| Module | Location Picker / Trip Summary |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Fixed - verified |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; location permission granted; Home > Local.

## Steps to reproduce
1. Set Pickup via Use Current Location (Kempegowda Bus Station)
2. Enable Different drop location
3. Set Drop via Use Current Location (same place)
4. Tap Search Vehicles

## Expected result
Validation (drop must differ from pickup) or sensible 0-distance handling.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Inline error Pickup and drop location cannot be the same; Search blocked. | Original: apk via TC_LOC_012. Original: No validation; Trip Summary shows route X -> X, Distance 80 KM; the map draws a loop.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_LOC_012_1_same-pickup-drop-blocked.png`

## Error / API / log information
Distance 80 KM equals the Local package allowance; confirm how Local distance is computed.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Fixed - verified.
