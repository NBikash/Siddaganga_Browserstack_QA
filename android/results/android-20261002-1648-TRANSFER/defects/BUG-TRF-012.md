# BUG-TRF-012 — P2P Transfer allows From and To to be the same location

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
1. Transfer > Point To Point
2. From Majestic, To Majestic
3. Search Vehicles

## Expected result
Error: pickup and drop must differ

## Actual result
Retest android-20261002-1648-TRANSFER: Majestic -> Majestic accepted; summary < 30 KM, 03-04 Oct.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_063_2_same-location-accepted.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
