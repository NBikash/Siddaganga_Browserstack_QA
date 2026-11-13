# BUG-OS-001 — Outstation accepts a pickup time earlier than the current time today without any error

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_ON2_10 |
| Module | HOME - Outstation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open (QA report Issues: missing error for past pickup time) |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Device time 05:24, today 29-10-2026

## Steps to reproduce
1. Outstation > Pickup Date 29-10-2026 > Pickup Time 05:00 am > Done

## Expected result
Inline 'Selected date and time has already passed' and search blocked

## Actual result
05:00 am accepted with no error

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
