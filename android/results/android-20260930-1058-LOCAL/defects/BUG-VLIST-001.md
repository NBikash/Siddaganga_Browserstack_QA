# BUG-VLIST-001 — Deluxe category chip returns 0 vehicles although Deluxe ('Delux') vehicles are listed

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_004 |
| Module | Available Vehicles |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Logged in; valid Local search (Majestic, 4 pax, 4 hrs) -> Available Vehicles shows 20 vehicles.

## Steps to reproduce
1. Note cards with the 'Delux' badge in the unfiltered list (e.g. 33 Seater Deluxe Coach)
2. Tap the 'Deluxe' category chip

## Expected result
All Deluxe vehicles are listed (about 7 of 20: 20 - 6 Luxury - 7 Premium).

## Actual result
'0 vehicles found' / 'No Vehicles Found'. Users cannot filter to the Deluxe class at all.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_004_1_deluxe_chip_zero.png`
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_003_1_card_33_vs_35_delux.png`

## Error / API / log information
Likely value mismatch: vehicle class stored/badged as 'Delux' while the chip filters on 'Deluxe' (see also TC_VDET_002 badge spelling).

## Notes / suspected area
-
