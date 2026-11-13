# BUG-OUT-004 — Return Date picker allows dates before the selected pickup date

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
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Set pickup date 04-10-2026
3. Open Drop Date

## Expected result
Picker minimum = pickup date

## Actual result
Picker opens at today (01-10) and allows 1-3 Oct; only the Search validation catches it

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
