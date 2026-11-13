# BUG-TRF-002 — P2P accepts drop date/time equal to pickup (zero duration); drop picker titled 'Return Date' for a one-way transfer

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > Point To Point (Add Return unticked)
2. Pickup 02-10 07:46 am, Drop 02-10 07:46 am
3. Search Vehicles

## Expected result
Drop must be after pickup (or drop auto-derived for one-way); picker labelled 'Drop'

## Actual result
Retest android-20261002-1648-TRANSFER: Fixed: drop = pickup now blocked (Please select a different drop time.). Still open: one-way drop pickers titled Return Date / Return Time.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_057_1_drop-picker-titled-return-date.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
