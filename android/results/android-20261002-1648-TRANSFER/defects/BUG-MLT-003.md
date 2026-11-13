# BUG-MLT-003 — Multi: no chronology/overlap validation between legs

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Leg 1 04-10, Leg 2 06-07 Oct
2. Leg 3 pickup/drop 02-10
3. Search Vehicles

## Expected result
Error: leg must start after previous leg ends

## Actual result
Retest android-20261002-1648-TRANSFER: Multi Transfer By Hour Leg 2 dated 03 Oct accepted after Leg 1 on 05 Oct.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_068_1_leg2-before-leg1-committed.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_068_2_summary-leg2-03oct.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
