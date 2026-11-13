# BUG-BOOK-001 — My Bookings has no pull-to-refresh - pulling the list shows no indicator and does not reload

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_009 |
| Module | My Bookings |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Ride > My Bookings with inquiries listed (Month > Inquired).

## Steps to reproduce
1. Open Ride > My Bookings
2. Scroll the list to the top
3. Pull down on the list and release

## Expected result
A refresh indicator appears and the bookings list / counts are reloaded from the server.

## Actual result
No refresh indicator or reload; the list only over-scrolls and springs back. The list is refreshed only when the screen is left and re-opened.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_BOOK_009_1_pull-no-refresh-indicator.png`

## Error / API / log information
UX: users cannot manually refresh booking status (e.g. after payment/cancellation done elsewhere).

## Notes / suspected area
First execution of TC_BOOK_009 (not executed in previous runs).
