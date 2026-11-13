# BUG-TRF-001 — P2P: drop date not adjusted and unclear error when pickup date is moved after the drop date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > Point To Point; fill From/To
2. Change Pickup date to 02-10 (drop remains 01-10)
3. Tap Search Vehicles

## Expected result
Drop date follows pickup, or error 'Drop date & time must be after pickup date & time'

## Actual result
Drop date stays 01-10; only 'Please select a later time.' under drop time

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
