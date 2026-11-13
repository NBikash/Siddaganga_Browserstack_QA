# BUG-TRF-006 — By Hour accepts more than 24 hours and the price ignores the number of hours

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
1. Home > Transfer > By Hour, pickup Majestic, future date
2. Number of Hours = 25; Search Vehicles
3. Compare list/Confirm price with a 4-hour search

## Expected result
Max hours enforced (Local: 'Maximum trip duration is 24 hours') and price scales with hours

## Actual result
25 accepted; 33 Seater list Rs 11,000 and Confirm Rs 16,500 identical for 4 h and 25 h

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_HOME_059_1_25-hours-accepted.png`

## Error / API / log information
-

## Notes / suspected area
-
