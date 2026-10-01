# BUG-VDET-001 — Class badge misspelled 'Delux' on vehicle cards and details

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_002 |
| Module | Vehicle Details / Available Vehicles |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Available Vehicles after a Local search.

## Steps to reproduce
1. Look at the class badge on a Deluxe vehicle card / details carousel

## Expected result
Badge reads 'Deluxe' (same as the category chip).

## Actual result
Badge reads 'Delux'.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_003_1_card_33_vs_35_delux.png`

## Error / API / log information
Likely the same data value that breaks the Deluxe chip filter (BUG-VLIST-001).

## Notes / suspected area
-
