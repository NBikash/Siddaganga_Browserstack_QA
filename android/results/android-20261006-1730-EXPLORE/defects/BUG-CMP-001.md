# BUG-CMP-001 — Vehicle Comparison shows blank mileage, fuel, toll, luggage, model year and condition; Outstation rate omits the per-day charge

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CMP_007, TC_CMP_010 |
| Module | Compare Vehicles |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Explore > Compare with 2 vehicles

## Steps to reproduce
1. Select 45 Seater Luxury 9600 Volvo and 49 Seater Luxury 9600 Volvo
2. Compare Vehicles
3. Scroll the table

## Expected result
Every row has a value; Outstation rate matches Vehicle Details (per day + per km).

## Actual result
Six rows show a dash for both vehicles (Fuel type is Diesel on details); Outstation rate shows only Rs 120/km while details show Rs 60,000/day + Rs 120/km.

## Evidence
- `android/evidence/android-20261006-1730-EXPLORE/TC_CMP_007_1_blank-mileage-fuel-toll.png`
- `android/evidence/android-20261006-1730-EXPLORE/TC_CMP_007_2_blank-luggage-year-condition.png`
- `android/evidence/android-20261006-1730-EXPLORE/TC_CMP_009_1_details-of-current-vehicle.png`

## Error / API / log information
-

## Notes / suspected area
First logged in android-20261006-1252-OUTSTATION.
