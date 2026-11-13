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
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk via TC_VDET_019 (Outstation, 40 pax, 35-seat coach): dialog asks to add buses but only Cancel is offered; no multi-vehicle selection exists.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_VDET_019_1_capacity-dialog-no-add-bus.png`

## Error / API / log information
New behaviour in this build (capacity guard) without a multi-vehicle flow.

## Notes / suspected area
Retested in android-20261006-1252-OUTSTATION.
