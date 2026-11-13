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
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk: TC_VDET_007: Outstation Trip tab (Outstation Pricing - Daily minimum and distance-based estimate): Base Rate incl. Driver/Fuel/Day Allowance Rs 16,500; Bata Cost (Before 6am or After 10pm) Rs 1,000; Bata Cost (Before 10pm or After 6am) Rs 1,000; Toll & Parking Actuals; GST Additional. No per-km / minimum-km line although the card says + Rs 55/km. BUG-OUT-008 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_VDET_007_1_no-per-km-line.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
