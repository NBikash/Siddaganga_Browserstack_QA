# BUG-MLT-004 — Multi-leg pricing broken: list Rs 11,000, Confirm Rs 12,000 (Leg 1 only), then 3 inquiries at Rs 36,000 each

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Vehicle list / Confirm / My Bookings |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1739-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2: Rs 12,000 -> 3 x Rs 36,000; Rs 5,000 -> 2 x Rs 10,000) |

## Preconditions
-

## Steps to reproduce
1. Multi: Leg 1 Local 4 h, Leg 2 Outstation 2 days, Leg 3 Transfer
2. Search > 33 Seater Deluxe Coach (Rs 11,000) > Book Now
3. Confirm shows 'Multi-Leg (Local)', Leg 1 only, Rs 12,000; Confirm
4. My Bookings > Week > Inquired

## Expected result
One combined estimate across all legs, consistent on every screen; inquiries match the confirmed amount

## Actual result
Rs 11,000 -> Rs 12,000 -> three inquiries each Rs 36,000 (Rs 1,08,000) after approving Rs 12,000

## Evidence
- `android/evidence/android-20261001-1739-MULTI/TC_VLIST_013_1_multi-list-11000.png`
- `android/evidence/android-20261001-1739-MULTI/TC_CONF_017_2_estimate-12000-leg1-only.png`
- `android/evidence/android-20261001-1739-MULTI/TC_CONF_017_3_multiday-leg-5000.png`
- `android/evidence/android-20261001-1739-MULTI/TC_BOOK_014_1_three-inquiries-36000.png`
- `android/evidence/android-20261001-1739-MULTI/TC_BOOK_014_3_two-legs-10000-each.png`

## Error / API / log information
-

## Notes / suspected area
-
