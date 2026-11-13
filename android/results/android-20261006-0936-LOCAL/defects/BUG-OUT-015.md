# BUG-OUT-015 — Cancelled inquiries disappear from My Bookings - no Cancelled tab/status to view them or their invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_011 |
| Module | My Bookings |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Cancel an inquiry
2. Open Ride > My Bookings, check Today/Week/Month and all tabs

## Expected result
Cancelled booking visible with status Cancelled and access to the cancellation invoice

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Cancelled Local inquiries 561/562 vanish; no Cancelled tab. | Original: apk via TC_BOOK_011. Original: Only Live/Upcoming/Completed/Inquired tabs; the cancelled inquiry is no longer listed anywhere

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_BOOK_011_1_no-cancelled-tab.png`

## Error / API / log information
-

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
