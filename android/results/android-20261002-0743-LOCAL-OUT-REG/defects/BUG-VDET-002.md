# BUG-VDET-002 — Local fare breakup bata labels are illogical ('Before 10pm or After 6am')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_009 |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Vehicle Details > View Fare Breakup > Local Trip.

## Steps to reproduce
1. Read the two Bata Cost lines

## Expected result
Labels clearly describe when each bata applies (e.g. night: before 6am or after 10pm; the second line should describe its real condition).

## Actual result
Reproduced on app-release_1stOct26.apk via TC_VDET_009. Original: 'Bata Cost (Before 6am or After 10pm)' Rs 1,000 and 'Bata Cost (Before 10pm or After 6am)' Rs 1,000 - the second label covers normal daytime hours.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VDET_009_1_bata-labels.png`

## Error / API / log information
Previously OBS-15.

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
