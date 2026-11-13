# BUG-TRF-002 — P2P accepts drop date/time equal to pickup (zero duration); drop picker titled 'Return Date' for a one-way transfer

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > Point To Point (Add Return unticked)
2. Pickup 02-10 07:46 am, Drop 02-10 07:46 am
3. Search Vehicles

## Expected result
Drop must be after pickup (or drop auto-derived for one-way); picker labelled 'Drop'

## Actual result
Search proceeds; Inquiry shows 'Expected arrival 07:46 am' = pickup; sheet titled 'Return Date'/'Return Time'

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
