# BUG-LOC-002 — Drop Location screen subtitle says 'Select your pickup location'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_010 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Fixed - verified |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Not reproducible (fixed) |

## Preconditions
Logged in; Home > Local; Different drop location enabled.

## Steps to reproduce
1. Tap Select Drop Location
2. Read the subtitle under the Drop Location title

## Expected result
Subtitle refers to the drop location (e.g. 'Select your drop location').

## Actual result
FIXED in new build. Verified fixed on app-release_1stOct26.apk via TC_LOC_010.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_LOC_010_1_drop-subtitle-fixed.png`

## Error / API / log information
Copy defect (previously OBS-09).

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Fixed - verified.
