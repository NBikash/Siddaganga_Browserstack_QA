# BUG-OUT-001 — Outstation: no maximum number of destinations enforced

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_030 |
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
2. Tap + Add Another Destination repeatedly

## Expected result
A reasonable maximum (per spec) is enforced with a message or disabled button

## Actual result
Reproduced on app-release_1stOct26.apk via TC_HOME_030. Original: 11 destination fields could be added with no limit or message; unbounded multi-stop requests reach the search

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_030_1_10-destinations.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
