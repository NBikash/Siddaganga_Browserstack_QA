# BUG-OUT-010 — Inconsistent casing: status chip 'inquired' and trip badge 'OutStation'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_BOOK_005 |
| Module | My Bookings |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Ride > Week > Inquired

## Expected result
'Inquired' and 'Outstation' as used elsewhere

## Actual result
Trip badge casing fixed ("Outstation"); status chip still lowercase "inquired". Original: 'inquired' chip and 'OutStation' badge (also 'OutStation Trip' on Inquiry Details)

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_BOOK_005_1_inquired-lowercase.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.
