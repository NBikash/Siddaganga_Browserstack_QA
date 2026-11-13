# BUG-OUT-005 — Outstation Trip Summary 'Distance' shows 1200 KM for a ~145 km Bengaluru-Mysuru route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_032, TC_INQ_011, TC_INQ_013 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Pickup Majestic, Bengaluru; First Destination Mysuru Palace
3. Pickup 04-10-2026 10:30 am, Drop 07-10-2026 06:30 am, 20 pax
4. Search Vehicles

## Expected result
Distance is the computed route distance (~145 km one way / ~290 km return), or clearly labelled as chargeable minimum km

## Actual result
Trip Summary distance now route-based (281 KM Majestic-Mysuru round trip; 397 KM multi-stop) but booking card and Inquiry Details still show 1200 km / 900 km (300 km/day placeholder). Original: Distance 1200 KM (= 4 days x 300 km); the same value is carried to the inquiry card and Inquiry Details

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_032_1_summary-281km.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_011_1_inq534-no-return.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_BOOK_005_2_outstation-card-1200km.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_013_1_card-stops-missing.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_013_2_inq535-stops-missing.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.
