# BUG-VLIST-004 — Available Vehicles ignores passenger count (40/999 pax still list 4-35 seat vehicles)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_006, TC_HOME_016 |
| Module | Available Vehicles / Home |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local.

## Steps to reproduce
1. Pickup Majestic, Passengers 40, Hours 4
2. Search Vehicles > Search Vehicles
3. Review the list

## Expected result
Only vehicles with seats >= passengers (or a clear capacity warning); an upper limit on passengers.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): 40 and 999 passengers still list all 20 vehicles; no max passengers. | Original: New capacity guard on Book Now ("Passenger Capacity Not Complete!") prevents booking an under-capacity vehicle, but Available Vehicles still lists all 20 vehicles for 40/999 passengers. Original: 20 vehicles found - identical to the 4-passenger search; 35-seat coach first, 4-seat Sedan and 12-seat vans included. 999 passengers is accepted.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_006_1_40pax-20-vehicles.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_HOME_016_1_999-pax-summary.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_HOME_016_2_999-pax-20-vehicles.png`

## Error / API / log information
Customers can raise inquiries for vehicles that cannot carry their group.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
