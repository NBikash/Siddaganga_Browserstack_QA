# BUG-TRIP-002 — Local trip distance always 80 KM regardless of route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_002, TC_LOC_012 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (3/3) |

## Preconditions
Logged in; Home > Local.

## Steps to reproduce
1. Search Majestic -> Same as pickup
2. Search Majestic -> Kempegowda International Airport (Different drop location)
3. Compare Distance on the Trip Summary

## Expected result
Distance reflects the actual route (0 km for same place; ~35-40 km Majestic -> KIA), or is labelled as the package allowance.

## Actual result
Distance 80 KM in every case.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_TRIP_002_1_majestic_kia_80km.png`
- `android/evidence/android-20260930-1058-LOCAL/TC_LOC_012_1_same_pickup_drop_80km.png`

## Error / API / log information
80 km = Local package allowance (8Hr/80Km); label 'Distance' is misleading.

## Notes / suspected area
-
