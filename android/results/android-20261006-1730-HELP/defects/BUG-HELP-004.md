# BUG-HELP-004 — Support ticket issue Date accepts future dates

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HELP_015 |
| Module | Help & Support |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-HELP |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Ticket form open

## Steps to reproduce
1. Tap Date
2. Scroll to tomorrow (or 2027)
3. Done

## Expected result
Dates after today are not selectable for an issue date.

## Actual result
07-10-2026 (tomorrow) accepted; year wheel offers 2027.

## Evidence
- `android/evidence/android-20261006-1730-HELP/TC_HELP_015_1_future-issue-date-accepted.png`

## Error / API / log information
-

## Notes / suspected area
New in this run.
