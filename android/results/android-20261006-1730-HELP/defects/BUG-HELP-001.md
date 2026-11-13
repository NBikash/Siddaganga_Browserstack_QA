# BUG-HELP-001 — Support ticket Booking ID, Request Type and Service Type dropdowns show no options

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HELP_004, TC_HELP_005 |
| Module | Help & Support |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-HELP |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in with an account that has bookings/inquiries; Help > Raise Ticket

## Steps to reproduce
1. Open Help > Trip-Based Support > Raise Ticket
2. Tap Booking ID
3. Tap Request Type
4. Tap Service Type

## Expected result
Booking ID lists the user's bookings; Request Type and Service Type list their options.

## Actual result
Fields get a focus border but no option list opens for any of the three; required classification fields cannot be completed, so a valid ticket cannot be raised.

## Evidence
- `android/evidence/android-20261006-1730-HELP/TC_HELP_004_1_booking-id-no-options.png`

## Error / API / log information
No error shown.

## Notes / suspected area
Inventory remark OBS-22.
