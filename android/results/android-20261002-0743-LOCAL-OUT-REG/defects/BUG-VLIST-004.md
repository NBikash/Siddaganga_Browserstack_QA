# BUG-VLIST-004 — Available Vehicles ignores passenger count (40/999 pax still list 4-35 seat vehicles)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_006, TC_HOME_016 |
| Module | Available Vehicles / Home |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
New capacity guard on Book Now ("Passenger Capacity Not Complete!") prevents booking an under-capacity vehicle, but Available Vehicles still lists all 20 vehicles for 40/999 passengers. Original: 20 vehicles found - identical to the 4-passenger search; 35-seat coach first, 4-seat Sedan and 12-seat vans included. 999 passengers is accepted.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_016_1_999pax-20-vehicles.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_006_1_40pax-20-vehicles.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_NEW_1_capacity-dialog-no-add-bus.png`

## Error / API / log information
Customers can raise inquiries for vehicles that cannot carry their group.

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - partially fixed.
