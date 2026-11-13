# BUG-MLT-007 — App closed unexpectedly while scrolling the Multi form; all legs lost on relaunch

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1739-MULTI |
| Test account | Not required |
| Reproducibility | Observed once (1/1); not reproduced in a second identical build-up |

## Preconditions
-

## Steps to reproduce
1. Home > Multi; Leg 1 Local Multi-day (8, 9 Oct) committed
2. Leg 2 Transfer P2P Majestic -> KIA; set pickup date 10-10
3. Scroll the form down

## Expected result
App remains open with form state

## Actual result
App closed to the Android home screen; relaunch opened Home (Local) with the Multi itinerary lost

## Evidence
- `android/evidence/android-20261001-1739-MULTI/TC_HOME_073_1_relaunch-state-lost.png`

## Error / API / log information
Not captured - App Live logcat was closed; cause (crash vs. process kill) unconfirmed. Check device logs/Crashlytics for com.siddaganga around 2026-10-01 12:46 device time

## Notes / suspected area
-
