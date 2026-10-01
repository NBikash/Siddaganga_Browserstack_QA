# BUG-LOC-004 — Identical pickup and drop accepted; Trip Summary shows 80 KM and a looping route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_012 |
| Module | Location Picker / Trip Summary |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (1/1) |

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
No validation; Trip Summary shows route X -> X, Distance 80 KM; the map draws a loop.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_LOC_012_1_same_pickup_drop_80km.png`

## Error / API / log information
Distance 80 KM equals the Local package allowance; confirm how Local distance is computed.

## Notes / suspected area
-
