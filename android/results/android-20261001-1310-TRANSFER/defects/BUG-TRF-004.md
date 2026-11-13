# BUG-TRF-004 — Transfer Search Vehicles gives no loading feedback (~8 s) before the Trip Summary opens

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Observed 1/1 |

## Preconditions
-

## Steps to reproduce
1. Fill a valid Transfer form
2. Tap Search Vehicles

## Expected result
Spinner/disabled button while the route is calculated

## Actual result
Screen unchanged for ~8 s, then the summary appears - users may tap repeatedly

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
