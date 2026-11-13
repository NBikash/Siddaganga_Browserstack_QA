# BUG-MLT-005 — Multi Outstation leg saved with 0 km and the wrong expected-arrival time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | My Bookings / Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1739-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2: Inquiry 529 Outstation leg, Inquiry 530 Transfer leg) |

## Preconditions
-

## Steps to reproduce
1. Submit a Multi inquiry with an Outstation leg (Majestic -> Mysuru, 06-10 12:14 to 07-10 12:00; summary 600 KM)
2. Open the OutStation card / Inquiry 529

## Expected result
600 km; arrival/return 07-10 12:00 pm

## Actual result
Distance 0 km; 'Expected arrival 03:30 pm' (Leg 1 end time)

## Evidence
- `android/evidence/android-20261001-1739-MULTI/TC_BOOK_014_2_outstation-0km-transfer.png`
- `android/evidence/android-20261001-1739-MULTI/TC_INQ_020_1_inquiry-529-0km-arrival.png`
- `android/evidence/android-20261001-1739-MULTI/TC_INQ_020_2_inquiry-530-arrival.png`

## Error / API / log information
-

## Notes / suspected area
-
