# BUG-VDET-002 — Local fare breakup bata labels are illogical ('Before 10pm or After 6am')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_009 |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Fixed - verified |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Vehicle Details > View Fare Breakup > Local Trip.

## Steps to reproduce
1. Read the two Bata Cost lines

## Expected result
Labels clearly describe when each bata applies (e.g. night: before 6am or after 10pm; the second line should describe its real condition).

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Bata labels Before 6am or After 10pm / Before 10pm or After 6am. | Original: apk via TC_VDET_009. Original: 'Bata Cost (Before 6am or After 10pm)' Rs 1,000 and 'Bata Cost (Before 10pm or After 6am)' Rs 1,000 - the second label covers normal daytime hours.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_VDET_009_1_bata-labels-fixed.png`

## Error / API / log information
Previously OBS-15.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Fixed - verified. Verified via TC_VDET_009.
