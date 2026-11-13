# BUG-MLT-009 — Multi Transfer leg Mysuru -> Majestic shown as '> 30 KM' on Trip Summary and '< 30 KM' on the booking card (route ~145 km)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_068, TC_BOOK_014 |
| Module | TRIP |
| Severity (proposed) | Medium |
| Priority (proposed) | Medium |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | 1/1 |

## Preconditions
Multi with a Transfer P2P leg between cities

## Steps to reproduce
1. Multi: Leg 3 Transfer Point To Point, From Mysuru, To Majestic Bengaluru
2. Search Vehicles - read Leg 3 Distance on Trip Summary
3. Submit the inquiry; open My Bookings > Inquired Transfer card

## Expected result
Actual route distance (~145 km) with the matching transfer slab, the same on every screen

## Actual result
Trip Summary Leg 3 Distance '> 30 KM'; booking card '< 30 KM' (contradictory, and both far from ~145 km). Leg priced at the flat Transfer rate Rs 14,500.

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_068_1_leg3-08oct-before-leg1-30km.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_3_transfer-card-lt30km.png`

## Error / API / log information
-

## Notes / suspected area
-
