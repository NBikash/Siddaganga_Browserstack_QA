# BUG-VLIST-001 — Deluxe category chip returns 0 vehicles although Deluxe ('Delux') vehicles are listed

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Available Vehicles |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Note cards with the 'Delux' badge in the unfiltered list (e.g. 33 Seater Deluxe Coach)
2. Tap the 'Deluxe' category chip

## Expected result
All Deluxe vehicles are listed (about 7 of 20: 20 - 6 Luxury - 7 Premium).

## Actual result
Retest android-20261002-1648-TRANSFER: Transfer list: Deluxe chip -> 0 vehicles although Delux coaches/Sedan listed.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_VLIST_004_1_deluxe-coaches-in-list.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_VLIST_004_2_deluxe-chip-no-vehicles.png`

## Error / API / log information
Likely value mismatch: vehicle class stored/badged as 'Delux' while the chip filters on 'Deluxe' (see also TC_VDET_002 badge spelling).

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
