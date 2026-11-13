# BUG-OUT-006 — Outstation Trip Summary omits pickup time and return date/time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_010 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - partially fixed (Drop Location now shows the return point) |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Valid Outstation search (pickup 10:30 am, drop 07-10 06:30 am, Different drop location off)
2. Review Trip Summary

## Expected result
Pickup time and return date/time shown; Drop reflects the return point

## Actual result
Reproduced on app-release_5Oct26.apk: TC_TRIP_010: Round trip (no different drop): Drop Location correctly shows Majestic (return point), but the Trip Summary shows only Dates 12-15 Oct, 2026 - pickup time 10:30 am and return date/time 15 Oct 06:30 pm are not shown (the Confirm modal does show Pickup Time / Return Time). BUG-OUT-006 partially fixed only.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_TRIP_010_1_no-pickup-return-times.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.). Retested in android-20261006-1252-OUTSTATION.
