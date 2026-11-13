# BUG-TRF-001 — P2P: drop date not adjusted and unclear error when pickup date is moved after the drop date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > Point To Point; fill From/To
2. Change Pickup date to 02-10 (drop remains 01-10)
3. Tap Search Vehicles

## Expected result
Drop date follows pickup, or error 'Drop date & time must be after pickup date & time'

## Actual result
Retest android-20261002-1648-TRANSFER: Pickup moved to 03-10 11:00 pm; drop stays 02-10 11:21 am; only Selected date and time has already passed. under drop time.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_056_1_drop-not-adjusted.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
