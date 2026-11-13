# BUG-HOME-003 — Clear leaves Number of Hours empty instead of default 1

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_027, TC_CONF_009 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
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
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Clear and Back to Home leave Number of Hours empty. | Original: apk via TC_HOME_027. Original: Hours field is empty (placeholder Enter Number Of Hours); other fields reset.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_HOME_027_1_clear-hours-empty.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_CONF_009_1_home-scrolled-blank.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_CONF_009_2_hours-empty-after-reset.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - still reproducible. Observed in TC_HOME_027, TC_CONF_009: Form filled (Majestic, 08-10-2026 04:00 am, 4 pax, 8 hrs) -> Clear resets pickup to empty, date to today, time to current (03:17 am) and passengers to 1, but Number of Hours is left EMPTY (outlined red) instead of the default 1. BUG-HOME-003 still reproducible on app-release_7Oct26.apk.
