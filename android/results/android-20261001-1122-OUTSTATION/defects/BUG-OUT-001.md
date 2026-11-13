# BUG-OUT-001 — Outstation: no maximum number of destinations enforced

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
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Tap + Add Another Destination repeatedly

## Expected result
A reasonable maximum (per spec) is enforced with a message or disabled button

## Actual result
11 destination fields could be added with no limit or message; unbounded multi-stop requests reach the search

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
