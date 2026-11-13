# BUG-OUT-006 — Outstation Trip Summary omits pickup/return times and shows the destination as Drop Location for a round trip

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Valid Outstation search (pickup 10:30 am, drop 07-10 06:30 am, Different drop location off)
2. Review Trip Summary

## Expected result
Pickup time and return date/time shown; Drop reflects the return point

## Actual result
Only 'Dates 04-07 Oct, 2026'; no times; Drop Location = Mysuru destination

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_TRIP_010_1_summary-no-times.png`

## Error / API / log information
-

## Notes / suspected area
-
