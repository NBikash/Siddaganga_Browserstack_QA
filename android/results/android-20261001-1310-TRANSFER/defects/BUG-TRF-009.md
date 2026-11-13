# BUG-TRF-009 — Add Return: return date before the outward trip is accepted

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
1. Transfer > Point To Point, tick Add Return
2. Outward Majestic -> KIA on 03-10
3. Return pickup/drop 02-10
4. Search Vehicles

## Expected result
Error: return must be after the outward trip

## Actual result
Trip Summary Return tab shows Return Trip on 02 Oct for an outward trip on 03 Oct

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_HOME_062_1_return-before-outward-accepted.png`

## Error / API / log information
-

## Notes / suspected area
-
