# BUG-TRF-008 — Transfer By Hour inquiry is labelled and saved as a 'Local' trip with the Outstation day rate

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_014, TC_BOOK_012, TC_INQ_017 |
| Module | Confirm / My Bookings / Inquiry Details |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

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
Reproduced on app-release_5Oct26.apk: TC_CONF_014: By Hour 4 h, Majestic -> KIA (>30 KM), 33 Seater Deluxe Coach: list Starts From Rs 11,000; Vehicle Details footer Rs 16,500 (Transfer card now Rs 16,500 too); Confirm Route Summary badge Transfer (not Transfer (By Hour)), no hours shown, Vehicle Base Cost Rs 16,500 = Estimated Grand Total Rs 16,500 (Long Transfer slab, not hour-based) - differs from the list price Rs 11,000. | TC_BOOK_012: Month > Inquired 25: By Hour inquiry 568 card shows badge Local, 1 day, 80 KM/Day, 35 seats, 1 pax, 33 Seater Deluxe Coach, Starts From Rs 16,500 - Transfer (By Hour) type lost and hours not shown. BUG-TRF-008 still present. | TC_INQ_017: Inquiry 568 (By Hour 4 h, pickup 15-10 10:30 am, drop KIA): header Local Trip, Distance 80 KM/Day, Majestic -> Kempegowda International Airport; Schedule 15 Oct 2026, Pickup 10:30 am, Expected arrival: 15 Oct, 2026, 02:30 pm (= pickup + 4 h, correct); Total Rs16500 (= Confirm). Still failing: type shown as Local Trip instead of Transfer (By Hour) and 80 KM/Day distance. BUG-TRF-008.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_014_1_byhour-footer-16500-list-11000.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_014_2_confirm-16500-no-hours.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_BOOK_012_1_byhour-card-local.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_017_1_byhour-details-local-trip.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
