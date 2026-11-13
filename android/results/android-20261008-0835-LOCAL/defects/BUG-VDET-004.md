# BUG-VDET-004 — Multi-bus selection: 'Book Buses' silently does nothing while selected seats are below the passenger count

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_020, TC_VDET_019 |
| Module | VDET |
| Severity (proposed) | Low |
| Priority (proposed) | Low |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always (3/3 taps) |

## Preconditions
Local search with 40 passengers

## Steps to reproduce
1. Open 33 Seater Deluxe Coach > Book Now > Select Multiple Buses
2. With '1 bus(es) selected - 35 of 40 seats covered', tap Book Buses

## Expected result
Clear feedback (disabled button or a message such as 'Select buses for 5 more passengers')

## Actual result
Nothing happens - no toast, dialog or visual change; only the counter text is shown in red. The user may think the app is frozen.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_VDET_019_2_multi-bus-select-mode.png`

## Error / API / log information
-

## Notes / suspected area
New multi-bus feature in this build.
