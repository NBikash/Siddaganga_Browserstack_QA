# BUG-TRF-018 — Transfer inquiry card and Inquiry Details show < 30 KM for a > 30 km route charged at the Long Transfer rate

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_016, TC_INQ_018 |
| Module | Ride - My Bookings / Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | Medium |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer P2P Majestic -> Kempegowda International Airport
2. Summary shows > 30 KM
3. Sedan > Book Now > Confirm (Rs 8,000)
4. Track My Inquiry > Week > Inquired
5. View Details

## Expected result
Distance > 30 KM everywhere, consistent with the charged Long Transfer rate

## Actual result
Reproduced on app-release_5Oct26.apk: TC_BOOK_016: Trip Summary > 30 KM and Confirm charged the Long slab Rs 8,000, but the booking card and Inquiry Details 570 show Distance < 30 KM. BUG-TRF-018 still present. | TC_INQ_018: Inquiry 571 (opened from the KIA -> Majestic card): Transfer Trip Majestic -> KIA (< 30 KM) plus Return Journey KIA -> Majestic (< 30 KM); Schedule 17 Oct 2026, Pickup 10:30 am, Expected arrival 17 Oct 11:30 am (return pickup was 09:39 am - outward time shown); Total Amount Rs16000 vs Confirm leg estimate Rs 8,000; distance < 30 KM vs > 30 KM summary.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_BOOK_016_1_card-under30km.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_BOOK_016_2_details-under30km.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_018_1_inquiry-571-16000.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
