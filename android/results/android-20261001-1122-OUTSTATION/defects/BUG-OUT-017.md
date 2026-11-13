# BUG-OUT-017 — Intermediate Outstation destinations are lost in Inquiry Details and booking card

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Create Outstation inquiry Majestic -> Mysuru -> Madikeri with drop Mangaluru
2. My Bookings > Inquired > View Details

## Expected result
All stops shown in order

## Actual result
Only Majestic -> Mangaluru (900 km); Mysuru and Madikeri missing

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_INQ_013_1_inquiry-521-stops-missing.png`

## Error / API / log information
-

## Notes / suspected area
-
