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
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk: TC_BOOK_011: After cancelling Inquiry 565 it disappears from My Bookings; tabs are still only Live / Upcoming / Completed / Inquired (Today/Week/Month) - no Cancelled tab or status, so the cancelled inquiry and its invoice INV-74 cannot be viewed. BUG-OUT-015 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_BOOK_011_1_no-cancelled-view.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
