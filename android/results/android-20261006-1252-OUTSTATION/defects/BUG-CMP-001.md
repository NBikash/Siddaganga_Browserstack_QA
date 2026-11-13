# BUG-CMP-001 — Vehicle Comparison shows blank values for mileage, fuel type, toll/parking, luggage capacity, model year and condition

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CMP_007 |
| Module | Compare Vehicles |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Explore tab.

## Steps to reproduce
1. Explore > Compare Vehicles
2. Select 45 Seater Luxury BharatBenz and 49 Seater Luxury 9600 Volvo
3. Open the comparison and scroll through all rows

## Expected result
Every comparison row shows a value (or a clear Not available label) so vehicles can be compared on all listed attributes; Outstation rate row should include the per-day charge shown on Vehicle Details.

## Actual result
Mileage (km/l), Fuel type, Toll/Parking, Luggage capacity, Model year and Condition rows show a dash for both vehicles; Outstation rate row shows only Rs 70/km while Vehicle Details shows Rs 28,000/day + Rs 70/km.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CMP_007_1_compare-rates-blank-rows.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CMP_007_2_compare-blank-luggage-year-condition.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
New in android-20261006-1252-OUTSTATION.
