# BUG-HOME-005 — After 'Back to Home' from the inquiry success screen, Home opens scrolled to a blank area below the form

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_009 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Observed once (inquiry B submission) |

## Preconditions
Logged in; Local inquiry submitted from Vehicle Details

## Steps to reproduce
1. Confirm an inquiry
2. On 'Inquiry Submitted Successfully!' tap 'Back to Home'

## Expected result
Home opens at the top of the reset Start Your Journey form.

## Actual result
Home opened scrolled down: only the bottom of the form (Additional Options, Search Vehicles) at the top and a large empty area below; user must scroll up to see the form.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_CONF_009_1_home-scrolled-blank.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_CONF_009_2_hours-empty-after-reset.png`

## Error / API / log information
Scroll position of the previous Home visit is retained after the form reset.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - still reproducible. Observed in TC_CONF_009: Inquiry B submitted; 'Back to Home' returns to Home with the form reset (Local, pickup empty, 08-10-2026, current time 03:54 am, 1 passenger, Multi-day and Different drop off). Observations: Home first renders scrolled to a blank area below the form (BUG-HOME-005) and Number of Hours is left EMPTY a
