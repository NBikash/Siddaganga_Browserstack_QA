# BUG-BOOK-003 — Multi-bus Local inquiry card in My Bookings shows only the first vehicle and its 35 seats (second bus and 75-seat total missing)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_016 |
| Module | BOOK |
| Severity (proposed) | Medium |
| Priority (proposed) | Medium |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Logged in; Local search with 40 passengers

## Steps to reproduce
1. Local: pickup Majestic, 08-10-2026 04:00 am, 40 passengers, 1 hour -> Search Vehicles -> Search Vehicles
2. Open 33 Seater Deluxe Coach (35 seats) -> Book Now -> Select Multiple Buses
3. Add 40 Seater Deluxe Coach (2 buses, 75 of 40 seats) -> Book Buses -> Confirm (inquiry 583)
4. Track My Inquiry -> Inquired

## Expected result
Card lists both vehicles (33 Seater Deluxe Coach + 40 Seater Deluxe Coach, or '2 buses') and total seats 75 consistent with the Rs 22,500 price

## Actual result
Card shows vehicle '33 Seater Deluxe Coach' only and seats '35' (with 40 pax), while 'Starts From Rs 22,500' is the two-bus total. Inquiry Details (583) lists no vehicles at all, so the second bus is not visible anywhere after submission.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/BUG-BOOK-003_1_multibus-card-one-vehicle-35-seats.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_VDET_019_3_multi-bus-estimate-22500.png`

## Error / API / log information
-

## Notes / suspected area
New multi-bus feature introduced in this build (fix for BUG-VDET-003).
