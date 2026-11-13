# BUG-OUT-005 — Outstation Trip Summary 'Distance' shows 1200 KM for a ~145 km Bengaluru-Mysuru route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_015 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk: TC_BOOK_015: Trip Summary distances vs saved inquiry: (a) Inquiry 565 Majestic -> Mysuru -> Madikeri -> Mangaluru: summary 395 KM, card and Inquiry Details 900 km; (b) Inquiry 566 Majestic -> Mysuru Palace round trip: summary 281 KM, card and Inquiry Details 1200 km (300 km x days placeholder). BUG-OUT-005 only fixed on the Trip Summary.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_BOOK_015_1_card-900km-vs-summary-395km.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_BOOK_015_2_card-1200km-vs-summary-281km.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_BOOK_015_3_inquiry-566-1200km.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.). Retested in android-20261006-1252-OUTSTATION.
