# BUG-OUT-001 — Outstation: no maximum number of destinations enforced

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_030 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
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
2. Tap + Add Another Destination repeatedly

## Expected result
A reasonable maximum (per spec) is enforced with a message or disabled button

## Actual result
Reproduced on app-release_5Oct26.apk: TC_HOME_030: Added destinations up to Destination 10; + Add Another Destination stays enabled, no maximum, message or disabled state (form remains usable and scrolls). BUG-OUT-001 still reproducible on app-release_5Oct26.apk.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_HOME_030_1_no-destination-limit.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
