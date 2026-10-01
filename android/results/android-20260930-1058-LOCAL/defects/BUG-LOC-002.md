# BUG-LOC-002 — Drop Location screen subtitle says 'Select your pickup location'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_010 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local; Different drop location enabled.

## Steps to reproduce
1. Tap Select Drop Location
2. Read the subtitle under the Drop Location title

## Expected result
Subtitle refers to the drop location (e.g. 'Select your drop location').

## Actual result
Subtitle reads 'Select your pickup location to complete your inquiry'.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_LOC_010_1_drop_subtitle_pickup.png`

## Error / API / log information
Copy defect (previously OBS-09).

## Notes / suspected area
-
