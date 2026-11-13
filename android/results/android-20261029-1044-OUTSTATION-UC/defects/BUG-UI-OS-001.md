# BUG-UI-OS-001 — Outstation passenger field: no maximum (999 accepted), '1.5' silently becomes 15, '-4' becomes 4

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_ON2_19 |
| Module | HOME - Outstation |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Home > Outstation

## Steps to reproduce
1. Number of Passengers: type 999, then 1.5, then -4

## Expected result
Maximum enforced; decimal/negative rejected with a message

## Actual result
999 accepted (Multi limits to 2 digits); 1.5 -> 15; -4 -> 4

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
