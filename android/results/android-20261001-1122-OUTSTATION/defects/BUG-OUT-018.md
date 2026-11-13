# BUG-OUT-018 — Trip Summary shows a cross-month date range as "06-05 Nov, 2026"

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation, Majestic -> Panaji
2. Pickup 06-10-2026, Drop 05-11-2026
3. Search Vehicles

## Expected result
06 Oct - 05 Nov, 2026

## Actual result
06-05 Nov, 2026 (start month missing; reads as a backwards range)

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_TRIP_011_1_cross-month-dates.png`

## Error / API / log information
-

## Notes / suspected area
-
