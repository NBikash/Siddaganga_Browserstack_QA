# BUG-TRF-010 — Round-trip Transfer: Confirm shows one leg at Rs 16,500 but creates two inquiries at Rs 33,000 each

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_016, TC_BOOK_013, TC_INQ_018 |
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
1. Transfer > P2P + Add Return: Majestic -> KIA 03-10, return 04-10
2. Search > 33 Seater Deluxe Coach (list Rs 14,500) > Book Now
3. Review Confirm (outward only, Rs 16,500); Confirm
4. My Bookings > Week > Inquired

## Expected result
Confirm lists both legs with a combined estimate; saved inquiries match it

## Actual result
Reproduced on app-release_5Oct26.apk: TC_CONF_016: Round trip Majestic -> KIA 16-10, KIA -> Majestic 17-10, Sedan: Confirm modal has Leg 1 / Leg 2 chips with route and date per leg (both legs and dates listed - OK), but each leg shows Vehicle Base Cost Rs 8,000 = Estimated Grand Total Rs 8,000 and the success screen shows Estimated Cost Rs 8,000 - no combined round-trip estimate (expected Rs 16,000). | TC_BOOK_013: Single Confirm (approved) -> Month > Inquired 26 -> 28: two unlinked Transfer cards (Majestic -> KIA and KIA -> Majestic), each Starts From Rs 16,000 (Rs 32,000 total) although Confirm/success showed Rs 8,000; cards are not visibly linked as one round trip. BUG-TRF-010 still present. | TC_INQ_018: Inquiry 571 (opened from the KIA -> Majestic card): Transfer Trip Majestic -> KIA (< 30 KM) plus Return Journey KIA -> Majestic (< 30 KM); Schedule 17 Oct 2026, Pickup 10:30 am, Expected arrival 17 Oct 11:30 am (return pickup was 09:39 am - outward time shown); Total Amount Rs16000 vs Confirm leg estimate Rs 8,000; distance < 30 KM vs > 30 KM summary.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_016_1_leg1-8000.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_016_2_leg2-8000-no-combined.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_BOOK_013_1_two-cards-16000-each.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_018_1_inquiry-571-16000.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
