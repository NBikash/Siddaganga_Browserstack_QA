# BUG-VLIST-003 — Vehicle '33 Seater' title shows 35 seats; list price differs from details (Rs 11,000 vs Rs 10,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_003 |
| Module | Available Vehicles / Vehicle Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
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
List: title '33 Seater Deluxe Coach' with '35 Seater', Starts From Rs 11,000 (single-day search). Details: title '33 Seater Deluxe Coach' with 35 Seats and Local Starts / Starting From Rs 10,000. Title seat count contradicts the seat count, and the starting price differs between list and details.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_003_1_card_33_vs_35_delux.png`
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_003_2_details_35_seats_10000.png`

## Error / API / log information
Previously OBS-12 (card showed Rs 23,000). Price shown to the user changes between screens.

## Notes / suspected area
-
