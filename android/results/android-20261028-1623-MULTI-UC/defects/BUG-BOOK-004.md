# BUG-BOOK-004 — Inquiries dated in the next calendar month are not visible in My Bookings (Today / Week / Month)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_21_08, UC_MLT_21_14 |
| Module | BOOK |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Submitted inquiry with legs on 5-6 Nov and 28-29 Nov 2026 (today 28 Oct)

## Steps to reproduce
1. Submit the Multi inquiry
2. Ride > My Bookings > Today / Week / Month > Inquired
3. Scroll the full list

## Expected result
All upcoming inquiries reachable (e.g. Month = next 30 days, or an 'All' filter)

## Actual result
Month shows only October-dated cards (20); the November legs appear nowhere, so the user cannot view, pay or cancel them

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
