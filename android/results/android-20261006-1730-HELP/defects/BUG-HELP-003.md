# BUG-HELP-003 — Support ticket Title and Description have no length limit or counter

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HELP_011 |
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
1. Type ~170 characters into Title
2. Type ~175 characters into Description

## Expected result
A documented maximum is enforced and/or a counter shown.

## Actual result
All text accepted with no limit, counter or message.

## Evidence
- `android/evidence/android-20261006-1730-HELP/TC_HELP_011_1_title-no-length-limit.png`
- `android/evidence/android-20261006-1730-HELP/TC_HELP_011_2_description-no-length-limit.png`

## Error / API / log information
-

## Notes / suspected area
Spec limit not documented; form not submitted (not approved), server-side limit unknown.
