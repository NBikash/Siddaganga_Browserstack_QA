# BUG-MLT-012 — Multi: Number of Hours resets to empty on every new Local leg

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_02_14 |
| Module | HOME - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Home > Multi

## Steps to reproduce
1. Leg 1 Local with 4 hours -> Add Next Journey
2. Observe Leg #2 Local Number of Hours

## Expected result
Hours defaulted (e.g. 1 or previous value) or clearly required

## Actual result
Field empty ('Enter Number Of Hours'); Add Next Journey then shows 'Number of hours is required'

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
