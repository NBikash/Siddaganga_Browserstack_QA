# BUG-VLIST-001 — Deluxe category chip returns 0 vehicles although Deluxe (Delux) vehicles exist

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_EXPL_002 |
| Module | Explore / Vehicle list |
| Severity (proposed) | High |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Explore tab.

## Steps to reproduce
1. Open Explore
2. Tap the Deluxe category chip

## Expected result
Grid lists the Deluxe vehicles (33 Seater Deluxe Coach, 40 Seater Deluxe Coach, Sedan).

## Actual result
No vehicles found matching your criteria. with Reset Filters.

## Evidence
- `android/evidence/android-20261006-1730-EXPLORE/TC_EXPL_002_1_deluxe-no-vehicles.png`

## Error / API / log information
No error shown.

## Notes / suspected area
First logged in an earlier Local run; still reproducible.
