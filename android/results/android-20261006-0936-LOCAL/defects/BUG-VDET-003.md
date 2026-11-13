# BUG-VDET-003 — Passenger capacity dialog asks to "add one or more buses" but there is no way to select multiple vehicles

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_019 |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Local search with 40 passengers (Majestic, 03 Oct).

## Steps to reproduce
1. Search Vehicles -> Available Vehicles (20 listed)
2. Open 33 Seater Deluxe Coach (35 seats)
3. Tap Book Now
4. Read dialog; look for a way to add a second bus

## Expected result
Either only vehicles that fit the passenger count are offered, or the dialog offers a working way to add another vehicle (multi-vehicle selection / Add bus).

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Capacity dialog asks to add buses; only Cancel, no add-bus control. | Original: Dialog "Passenger Capacity Not Complete! You need seats for 40 passengers, but your selected buses cover only 35 seats. Please add one or more buses to continue." with only Cancel. No add-bus control exists on Vehicle Details, the list cards or the Confirm modal; the user is stuck unless they pick a larger vehicle.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_VDET_019_1_capacity-dialog-cancel-only.png`

## Error / API / log information
New behaviour in this build (capacity guard) without a multi-vehicle flow.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
