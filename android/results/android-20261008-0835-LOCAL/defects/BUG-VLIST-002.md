# BUG-VLIST-002 — SUV card shows 'N/A Seater' and no class badge

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_002 |
| Module | Available Vehicles |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; valid Local search -> Available Vehicles (20).

## Steps to reproduce
1. Scroll the list to the SUV card (code LSUV, Starts From Rs 19,500)
2. Read the seat line and badge

## Expected result
Seat capacity (e.g. 7 Seater) and class badge are shown like other cards; capacity is needed to match the passenger count.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): SUV card now has a Delux badge but still N/A Seater and no Best For tags. | Original: apk via TC_VLIST_002. Original: 'N/A Seater', no class badge, no Best For tags. The vehicle is still offered for the 4-passenger search although its capacity is unknown.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_VLIST_002_1_suv-na-seater.png`

## Error / API / log information
Vehicle master data missing seats/class for SUV.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - still reproducible. Observed in TC_VLIST_002: Cards show image, class badge, 'Starts From Rs', rating 4.5, name, code, seats, amenity icons and Best For tags - except the SUV card (LSUV): still 'N/A Seater' and no Best For tags; SUV 'Starts From Rs 19,500' remains higher than the 45 Seater Luxury Volvo (Rs 17,000). BUG-VLIST-002 still reproduci
