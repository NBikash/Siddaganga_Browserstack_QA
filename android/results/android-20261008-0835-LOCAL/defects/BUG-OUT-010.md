# BUG-OUT-010 — Inconsistent casing: status chip 'inquired' and trip badge 'OutStation'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_005 |
| Module | My Bookings |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | Fixed - re-verified (status chip) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Ride > Week > Inquired

## Expected result
'Inquired' and 'Outstation' as used elsewhere

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Status chip now Inquired (capitalised) on Local cards. | Original: Trip badge casing fixed ("Outstation"); status chip still lowercase "inquired". Original: 'inquired' chip and 'OutStation' badge (also 'OutStation Trip' on Inquiry Details)

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Fixed - re-verified (status chip). Verified via TC_BOOK_005.
