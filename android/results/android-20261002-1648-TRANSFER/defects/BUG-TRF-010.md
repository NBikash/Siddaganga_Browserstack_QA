# BUG-TRF-010 — Round-trip Transfer: Confirm shows one leg at Rs 16,500 but creates two inquiries at Rs 33,000 each

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Confirm / My Bookings / Inquiry Details |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
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
Retest android-20261002-1648-TRANSFER: Confirm now has Leg 1/Leg 2 chips but each shows Rs 8,000 and no combined total; success Rs 8,000; My Bookings two cards Rs 16,000 each; Inquiry 551 total Rs16000.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_016_2_leg1-8000.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_016_3_leg2-8000-no-combined.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_016_4_submitted-8000.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_BOOK_013_1_two-cards-16000-each.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_018_1_inquiry-551-16000.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
