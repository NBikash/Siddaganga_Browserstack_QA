# BUG-OUT-016 — Outstation allows the destination to be the same as the pickup location

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_051 |
| Module | Home - Start Your Journey |
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
1. Home > Outstation
2. Pickup Majestic, Bengaluru
3. First Destination Majestic, Bengaluru
4. Valid dates; Search Vehicles

## Expected result
Validation error - destination must differ from pickup

## Actual result
Reproduced on app-release_5Oct26.apk: TC_HOME_051: Pickup Majestic, First Destination Majestic, 09-11 Oct: no validation; Trip Summary Outstation Trip Majestic -> Majestic -> Majestic, Distance 900 KM, map draws a loop. BUG-OUT-016 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_HOME_051_1_same-pickup-destination-900km.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
