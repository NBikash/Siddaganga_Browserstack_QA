# BUG-OUT-002 — First Destination picker subtitle says 'Select your pickup location to complete your inquiry'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_015 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Tap First Destination

## Expected result
Destination-specific subtitle

## Actual result
Reproduced on app-release_1stOct26.apk via TC_LOC_015. Original: Subtitle refers to pickup location (same copy as Drop Location screen, BUG-LOC-002 in run android-20260930-1058-LOCAL)

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_LOC_015_1_first-dest-subtitle.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
