# BUG-OUT-004 — Return Date picker allows dates before the selected pickup date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_050 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Set pickup date 04-10-2026
3. Open Drop Date

## Expected result
Picker minimum = pickup date

## Actual result
Reproduced on app-release_1stOct26.apk via TC_HOME_050. Original: Picker opens at today (01-10) and allows 1-3 Oct; only the Search validation catches it

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_050_1_return-date-before-pickup.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
