# BUG-VLIST-002 — SUV card shows 'N/A Seater' and no class badge

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_002, TC_VLIST_006 |
| Module | Available Vehicles |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Reproduced on app-release_1stOct26.apk via TC_VLIST_002. Original: 'N/A Seater', no class badge, no Best For tags. The vehicle is still offered for the 4-passenger search although its capacity is unknown.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_002_1_suv-na-seater.png`

## Error / API / log information
Vehicle master data missing seats/class for SUV.

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
