# BUG-TRF-012 — P2P Transfer allows From and To to be the same location

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_063 |
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
1. Transfer > Point To Point
2. From Majestic, To Majestic
3. Search Vehicles

## Expected result
Error: pickup and drop must differ

## Actual result
Reproduced on app-release_5Oct26.apk: TC_HOME_063: P2P From Majestic, To Majestic, 07-10 -> 08-10 09:51 am: accepted without validation; Trip Summary Transfer (Point to Point) Majestic -> Majestic, Distance < 30 KM, Dates 07-08 Oct 2026, map draws a loop route. BUG-TRF-012 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_HOME_063_1_same-from-to-accepted.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
