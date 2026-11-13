# BUG-TRF-018 — Transfer inquiry card and Inquiry Details show < 30 KM for a > 30 km route charged at the Long Transfer rate

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Ride - My Bookings / Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | Medium |
| Status | New |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
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
Card and Inquiry Details (Inquiry 549) show < 30 KM

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_BOOK_016_1_card-distance-lt30km.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_015_1_inquiry-549-details.png`

## Error / API / log information
-

## Notes / suspected area
-
