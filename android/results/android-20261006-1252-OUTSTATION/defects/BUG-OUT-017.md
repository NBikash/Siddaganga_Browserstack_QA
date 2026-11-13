# BUG-OUT-017 — Intermediate Outstation destinations are lost in Inquiry Details and booking card

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_013 |
| Module | Inquiry Details |
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
1. Create Outstation inquiry Majestic -> Mysuru -> Madikeri with drop Mangaluru
2. My Bookings > Inquired > View Details

## Expected result
All stops shown in order

## Actual result
Reproduced on app-release_5Oct26.apk: TC_INQ_013: Inquiry 565 (Majestic -> Mysuru Palace -> Madikeri -> drop Mangaluru): Inquiry Details route shows only Majestic -> Distance 900 km -> Mangaluru; intermediate stops Mysuru and Madikeri missing (also absent on the booking card). Trip Summary and Confirm listed all stops. BUG-OUT-017 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_INQ_013_1_stops-missing-900km.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
