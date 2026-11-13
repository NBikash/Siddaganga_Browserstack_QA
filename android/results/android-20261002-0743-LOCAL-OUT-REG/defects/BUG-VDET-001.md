# BUG-VDET-001 — Class badge misspelled 'Delux' on vehicle cards and details

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_002 |
| Module | Vehicle Details / Available Vehicles |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Available Vehicles after a Local search.

## Steps to reproduce
1. Look at the class badge on a Deluxe vehicle card / details carousel

## Expected result
Badge reads 'Deluxe' (same as the category chip).

## Actual result
Reproduced on app-release_1stOct26.apk via TC_VDET_002. Original: Badge reads 'Delux'.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_003_1_details-35seats-10000.png`

## Error / API / log information
Likely the same data value that breaks the Deluxe chip filter (BUG-VLIST-001).

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
