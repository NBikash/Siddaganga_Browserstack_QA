# BUG-VLIST-002 — SUV card shows 'N/A Seater' and no class badge

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_002, TC_VLIST_006 |
| Module | Available Vehicles |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
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
'N/A Seater', no class badge, no Best For tags. The vehicle is still offered for the 4-passenger search although its capacity is unknown.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_VLIST_002_1_suv_na_seater.png`

## Error / API / log information
Vehicle master data missing seats/class for SUV.

## Notes / suspected area
-
