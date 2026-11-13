# BUG-BOOK-002 — My Bookings inquiry cards show a vehicle rating of '0.00' while the same vehicle is rated 4.5 on the list and details

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_003 |
| Module | BOOK |
| Severity (proposed) | Low |
| Priority (proposed) | Low |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always (all 7 Today inquiry cards) |

## Preconditions
Logged in; at least one inquiry exists

## Steps to reproduce
1. Open Ride > My Bookings
2. Select Inquired
3. Look at the badge under the trip-type chip on any card

## Expected result
Card shows the vehicle's actual rating (4.5, as on Available Vehicles and Vehicle Details) or no rating badge at all

## Actual result
Every card shows a dark-red star badge '0.00' (e.g. 33 Seater Deluxe Coach, rated 4.5 elsewhere). New in app-release_7Oct26.apk (not present in the 5 Oct build).

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_BOOK_003_1_card-rating-0.00.png`

## Error / API / log information
-

## Notes / suspected area
Looks like an unset/default rating field rendered on booking cards.
