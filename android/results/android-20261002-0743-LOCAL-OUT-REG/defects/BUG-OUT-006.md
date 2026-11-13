# BUG-OUT-006 — Outstation Trip Summary omits pickup/return times and shows the destination as Drop Location for a round trip

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_TRIP_010 |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Drop Location on Trip Summary now shows the return point (Majestic) for a round trip; pickup and return times still not shown; Confirm modal Dropoff still the destination (Mysuru). Original: Only 'Dates 04-07 Oct, 2026'; no times; Drop Location = Mysuru destination

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_TRIP_010_1_no-times-drop-majestic.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_011_1_dropoff-mysuru.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.
