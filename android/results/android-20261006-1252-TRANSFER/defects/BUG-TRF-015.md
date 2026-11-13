# BUG-TRF-015 — P2P Transfer accepts a drop time earlier than the pickup time on the same date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_077 |
| Module | Home - Start Your Journey (Transfer P2P) |
| Severity (proposed) | High |
| Priority (proposed) | High |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_HOME_077: Pickup 08-10-2026 09:26 am, Drop 08-10-2026 08:30 am (same date, earlier): no validation; loader then Trip Summary Transfer (Point to Point) Majestic -> KIA, Dates 08 Oct 2026 - search proceeds. BUG-TRF-015 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_HOME_077_1_drop-before-pickup-accepted.png`

## Error / API / log information
Validation only checks drop time against the current clock, not against the pickup time

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
