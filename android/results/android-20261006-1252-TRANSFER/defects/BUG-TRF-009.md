# BUG-TRF-009 — Add Return: return date before the outward trip is accepted

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_062 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer > Point To Point, tick Add Return
2. Outward Majestic -> KIA on 03-10
3. Return pickup/drop 02-10
4. Search Vehicles

## Expected result
Error: return must be after the outward trip

## Actual result
Reproduced on app-release_5Oct26.apk: TC_HOME_062: Outward 16-10-2026 10:30 -> 11:30 am; Return pickup 15-10-2026 09:39 am, return drop 15-10 11:30 am (before the outward trip) - accepted without validation; Trip Summary Outward 16 Oct 2026, Return Trip 15 Oct 2026. BUG-TRF-009 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_HOME_062_1_return-before-outward-accepted.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
