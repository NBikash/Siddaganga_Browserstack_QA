# BUG-TRF-006 — By Hour accepts more than 24 hours and the price ignores the number of hours

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
1. Home > Transfer > By Hour, pickup Majestic, future date
2. Number of Hours = 25; Search Vehicles
3. Compare list/Confirm price with a 4-hour search

## Expected result
Max hours enforced (Local: 'Maximum trip duration is 24 hours') and price scales with hours

## Actual result
Retest android-20261002-1648-TRANSFER: 25 h accepted; list Rs 11,000 for both 4 h and 25 h; Confirm Rs 16,500 regardless of hours.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_059_1_25h-accepted-summary-no-hours.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_014_1_4h-list-price-11000.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_014_2_confirm-16500.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
