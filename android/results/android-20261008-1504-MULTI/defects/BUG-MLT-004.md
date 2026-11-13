# BUG-MLT-004 — Multi-leg pricing broken: list Rs 11,000, Confirm Rs 12,000 (Leg 1 only), then 3 inquiries at Rs 36,000 each

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_013, TC_CONF_018, TC_BOOK_014 |
| Module | Vehicle list / Confirm / My Bookings |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - partially fixed (Confirm now per-leg + combined total Rs 61,500 and amounts consistent; list price still Leg 1 only; legs still saved as separate unlinked inquiries) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
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
- `android/evidence/android-20261008-1504-MULTI/TC_VLIST_013_1_list-11000-for-3-legs.png`
- `android/evidence/android-20261008-1504-MULTI/TC_CONF_017_1_leg1-total-11000-grand-61500.png`
- `android/evidence/android-20261008-1504-MULTI/TC_CONF_018_1_success-61500.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_1_inquired-52-leg1-card.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_2_outstation-card-600km.png`
- `android/evidence/android-20261008-1504-MULTI/TC_BOOK_014_3_transfer-card-lt30km.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Open - partially fixed (Confirm now per-leg + combined total Rs 61,500 and amounts consistent; list price still Leg 1 only; legs still saved as separate unlinked inquiries).
