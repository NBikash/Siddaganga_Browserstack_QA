# BUG-OUT-004 — Return Date picker allows dates before the selected pickup date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_050 |
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
2. Set pickup date 04-10-2026
3. Open Drop Date

## Expected result
Picker minimum = pickup date

## Actual result
Reproduced on app-release_5Oct26.apk: TC_HOME_050: Pickup date set to 09-10-2026; Drop date picker (sheet titled Return Date) opens on 6 October 2026 (today) and offers 6/7/8 Oct, earlier than the pickup date; 08-10 can be applied (search then blocked by validation). BUG-OUT-004 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_HOME_050_1_return-date-before-pickup.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
