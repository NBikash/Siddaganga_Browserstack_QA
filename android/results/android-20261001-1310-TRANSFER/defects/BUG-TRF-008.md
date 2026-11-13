# BUG-TRF-008 — Transfer By Hour inquiry is labelled and saved as a 'Local' trip with the Outstation day rate

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Confirm / My Bookings / Inquiry Details |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (2/2: 4 h and 25 h) |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > By Hour; Majestic, 03-10 08:06 am, 4 hours, drop KIA
2. Search Vehicles > 33 Seater Deluxe Coach > Book Now
3. Note Route Summary badge and cost; Confirm
4. Open My Bookings > Inquired > View Details

## Expected result
Trip type Transfer (By Hour) everywhere; hour-based Transfer price consistent with the list (Rs 11,000)

## Actual result
Confirm badge 'Local' with Rs 16,500 (Outstation day rate); booking card and Inquiry 524 show 'Local Trip', '80 KM/Day'

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_CONF_014_2_byhour-labelled-local.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_BOOK_012_1_byhour-saved-as-local.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_INQ_017_1_inquiry-524-local-trip.png`

## Error / API / log information
-

## Notes / suspected area
-
