# BUG-VLIST-003 — Vehicle '33 Seater' title shows 35 seats; list price differs from details (Rs 11,000 vs Rs 10,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_003 |
| Module | Available Vehicles / Vehicle Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Local search (Majestic, 4 pax, 4 hrs) -> Available Vehicles.

## Steps to reproduce
1. Read the first card: title, seat line, Starts From price
2. Tap the card
3. Compare title, seats and Local/Starting From price on Vehicle Details

## Expected result
Title, seat count and starting price are identical on list and details.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): 33 Seater title vs 35 seats; list Rs 11,000 vs details Rs 10,000. | Original: apk via TC_VLIST_003. Original: List: title '33 Seater Deluxe Coach' with '35 Seater', Starts From Rs 11,000 (single-day search). Details: title '33 Seater Deluxe Coach' with 35 Seats and Local Starts / Starting From Rs 10,000. Title seat count contradicts the seat count, and the starting price differs between list and details.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_003_1_details-35seats-10000.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_001_1_available-vehicles.png`

## Error / API / log information
Previously OBS-12 (card showed Rs 23,000). Price shown to the user changes between screens.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
