# BUG-LOC-001 — Location search shows a blank list with no "No results" message for unmatched input

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_004 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local; Pickup Location picker open.

## Steps to reproduce
1. Tap the search box on Pickup Location
2. Type a string with no matches, e.g. zzqxv
3. Wait 5-10 seconds

## Expected result
An empty-state message such as No results found / Try a different search is shown.

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Gibberish search returns a blank list with no No-results message. | Original: apk via TC_LOC_004. Original: The suggestion area stays blank; the user gets no feedback whether the search ran, failed or matched nothing.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_LOC_004_1_no-results-blank.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
