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
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Reproduced on app-release_1stOct26.apk via TC_INQ_013. Original: Only Majestic -> Mangaluru (900 km); Mysuru and Madikeri missing

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_013_1_card-stops-missing.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_013_2_inq535-stops-missing.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
