# BUG-TRF-015 — P2P Transfer accepts a drop time earlier than the pickup time on the same date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey (Transfer P2P) |
| Severity (proposed) | High |
| Priority (proposed) | High |
| Status | New |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > Point To Point
2. From Majestic, To Kempegowda International Airport
3. Pickup 03-10-2026 11:00 pm
4. Drop 03-10-2026 11:21 am
5. Search Vehicles

## Expected result
Validation error on the drop time (drop must be after pickup); search blocked

## Actual result
No validation; Trip Summary opens and the user can continue to vehicles with a negative trip duration

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_NEW1_1_drop-before-pickup-form.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_HOME_NEW1_2_drop-before-pickup-accepted.png`

## Error / API / log information
Validation only checks drop time against the current clock, not against the pickup time

## Notes / suspected area
-
