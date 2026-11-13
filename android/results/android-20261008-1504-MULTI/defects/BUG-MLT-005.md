# BUG-MLT-005 — Multi Outstation leg saved with 0 km and the wrong expected-arrival time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_014, TC_INQ_020 |
| Module | My Bookings / Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - partially fixed (no longer 0 km; distance 600 km vs 285 KM summary, arrival 10:00 pm vs 09:00 pm return) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
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
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_1_inquired-52-leg1-card.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_2_outstation-card-600km.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_3_transfer-card-lt30km.png`
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_020_1_inq672-600km-arrival-10pm.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Open - partially fixed (no longer 0 km; distance 600 km vs 285 KM summary, arrival 10:00 pm vs 09:00 pm return).
