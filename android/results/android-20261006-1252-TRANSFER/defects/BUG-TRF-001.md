# BUG-TRF-001 — P2P: drop date not adjusted and unclear error when pickup date is moved after the drop date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_056 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_HOME_056: P2P Majestic -> KIA: pickup date moved to 08-10-2026 (09:26 am); drop stays 06-10-2026 09:26 am (not adjusted). Search shows only Selected date and time has already passed. under the drop time - no drop-must-be-after-pickup message. Search blocked. BUG-TRF-001 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_HOME_056_1_drop-not-adjusted-wrong-message.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
