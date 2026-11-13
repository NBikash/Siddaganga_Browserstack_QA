# BUG-OUT-008 — Outstation fare breakup has no per-km / minimum-km line although the pricing card shows '+ Rs 55/km'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_007 |
| Module | Vehicle Details & Fare Breakup |
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
1. Vehicle Details > View Fare Breakup
2. Outstation Trip tab

## Expected result
Base rate per day, per-km charge and daily minimum km, bata, toll, GST

## Actual result
Reproduced on app-release_1stOct26.apk via TC_VDET_007. Original: Only Base Rate Rs 16,500, two Bata lines Rs 1,000, Toll Actuals, GST Additional; no km component; second bata label describes daytime hours

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VDET_007_1_outstation-no-km-line.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
