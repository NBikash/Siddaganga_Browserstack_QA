# BUG-VLIST-001 — Deluxe category chip returns 0 vehicles although Deluxe ('Delux') vehicles are listed

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_004 |
| Module | Available Vehicles |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; valid Local search (Majestic, 4 pax, 4 hrs) -> Available Vehicles shows 20 vehicles.

## Steps to reproduce
1. Note cards with the 'Delux' badge in the unfiltered list (e.g. 33 Seater Deluxe Coach)
2. Tap the 'Deluxe' category chip

## Expected result
All Deluxe vehicles are listed (about 7 of 20: 20 - 6 Luxury - 7 Premium).

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Deluxe chip returns 0 vehicles. | Original: apk via TC_VLIST_004. Original: '0 vehicles found' / 'No Vehicles Found'. Users cannot filter to the Deluxe class at all.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_004_1_deluxe-zero.png`

## Error / API / log information
Likely value mismatch: vehicle class stored/badged as 'Delux' while the chip filters on 'Deluxe' (see also TC_VDET_002 badge spelling).

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
