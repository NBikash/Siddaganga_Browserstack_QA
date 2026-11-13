# BUG-TRF-012 — P2P Transfer allows From and To to be the same location

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
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Transfer > Point To Point
2. From Majestic, To Majestic
3. Search Vehicles

## Expected result
Error: pickup and drop must differ

## Actual result
Summary opens for Majestic -> Majestic (< 30 KM) and can be booked

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_HOME_063_1_p2p-same-from-to.png`

## Error / API / log information
-

## Notes / suspected area
-
