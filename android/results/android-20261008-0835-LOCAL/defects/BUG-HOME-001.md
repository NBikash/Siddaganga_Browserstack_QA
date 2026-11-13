# BUG-HOME-001 — Multi-day calendar allows navigating to past months

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_024 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local; Multi-day trip on (current month September 2026).

## Steps to reproduce
1. Tap the previous-month arrow above the calendar
2. Tap it again

## Expected result
Previous arrow disabled/hidden in the current month.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Calendar can still go back to September 2026 (fully past); earlier months now blocked. | Original: apk via TC_HOME_024. Original: Calendar moves to August and July 2026 (all dates disabled).

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_HOME_024_1_past-month-september.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - partially fixed. Observed in TC_HOME_024: Calendar '<' from October navigates to September 2026 - a fully past month (all days greyed); the '<' arrow then disappears so earlier months are not reachable. '>' navigates forward (November 2026) and back to October. Only one past month reachable, but navigating to a fully disabled past month is 
