# BUG-TRF-010 — Round-trip Transfer: Confirm shows one leg at Rs 16,500 but creates two inquiries at Rs 33,000 each

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
| Reproducibility | Always (1/1) |

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
Two inquiries (outward + return 525) each Rs 33,000 (Rs 66,000) after the user approved Rs 16,500; list said Rs 14,500

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_CONF_016_1_roundtrip-confirm-outward-only.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_BOOK_013_1_two-inquiries-33000-each.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_INQ_018_1_return-inquiry-525.png`

## Error / API / log information
-

## Notes / suspected area
-
