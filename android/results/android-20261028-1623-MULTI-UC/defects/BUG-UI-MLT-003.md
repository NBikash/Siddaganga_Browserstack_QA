# BUG-UI-MLT-003 — Passenger field silently turns '2.5' into 25

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_12_10 |
| Module | HOME - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Home > Multi

## Steps to reproduce
1. Number of Passengers: type 2.5

## Expected result
Decimal rejected (field keeps 2 or shows an error)

## Actual result
Field shows 25

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
