# BUG-MLT-003 — Multi: no chronology/overlap validation between legs

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1739-MULTI |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Leg 1 04-10, Leg 2 06-07 Oct
2. Leg 3 pickup/drop 02-10
3. Search Vehicles

## Expected result
Error: leg must start after previous leg ends

## Actual result
Accepted; Leg 3 shown as 02 Oct before Leg 1

## Evidence
- `android/evidence/android-20261001-1739-MULTI/TC_HOME_068_1_leg3-before-leg1-accepted.png`

## Error / API / log information
-

## Notes / suspected area
-
