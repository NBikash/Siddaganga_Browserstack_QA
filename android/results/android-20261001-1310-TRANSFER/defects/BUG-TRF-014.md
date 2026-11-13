# BUG-TRF-014 — Transfer Search Vehicles fails silently when offline

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
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
1. Fill a valid Transfer (By Hour) form
2. Turn the device offline
3. Tap Search Vehicles

## Expected result
'No internet connection' message with retry

## Actual result
No feedback at all (same as BUG-LOC-005 for Local)

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_TRIP_014_1_offline-silent.png`

## Error / API / log information
-

## Notes / suspected area
-
