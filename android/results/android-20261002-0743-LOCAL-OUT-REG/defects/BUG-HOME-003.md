# BUG-HOME-003 — Clear leaves Number of Hours empty instead of default 1

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_027 |
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
Logged in; Home > Local with values entered.

## Steps to reproduce
1. Enter pickup, passengers 6, hours 3, enable Different drop location
2. Tap Clear

## Expected result
All fields reset to the same defaults as a fresh form (Hours = 1).

## Actual result
Reproduced on app-release_1stOct26.apk via TC_HOME_027. Original: Hours field is empty (placeholder Enter Number Of Hours); other fields reset.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_027_1_clear-hours-empty.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
