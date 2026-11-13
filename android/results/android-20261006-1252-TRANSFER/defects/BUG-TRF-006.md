# BUG-TRF-006 — Transfer By Hour price ignores the number of hours (list Rs 11,000 vs Confirm Rs 16,500 Long slab)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_014 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - partially fixed (max 24 hours now enforced) |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Transfer > By Hour, pickup Majestic, future date
2. Number of Hours = 25; Search Vehicles
3. Compare list/Confirm price with a 4-hour search

## Expected result
Max hours enforced (Local: 'Maximum trip duration is 24 hours') and price scales with hours

## Actual result
Reproduced on app-release_5Oct26.apk: TC_CONF_014: By Hour 4 h, Majestic -> KIA (>30 KM), 33 Seater Deluxe Coach: list Starts From Rs 11,000; Vehicle Details footer Rs 16,500 (Transfer card now Rs 16,500 too); Confirm Route Summary badge Transfer (not Transfer (By Hour)), no hours shown, Vehicle Base Cost Rs 16,500 = Estimated Grand Total Rs 16,500 (Long Transfer slab, not hour-based) - differs from the list price Rs 11,000.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_014_1_byhour-footer-16500-list-11000.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_014_2_confirm-16500-no-hours.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
