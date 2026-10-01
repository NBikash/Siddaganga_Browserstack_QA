# BUG-LOC-001 — Location search shows a blank list with no "No results" message for unmatched input

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_004 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Logged in; Home > Local; Pickup Location picker open.

## Steps to reproduce
1. Tap the search box on Pickup Location
2. Type a string with no matches, e.g. zzqxv
3. Wait 5-10 seconds

## Expected result
An empty-state message such as No results found / Try a different search is shown.

## Actual result
The suggestion area stays blank; the user gets no feedback whether the search ran, failed or matched nothing.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_LOC_004_1_no_results_blank.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
-
