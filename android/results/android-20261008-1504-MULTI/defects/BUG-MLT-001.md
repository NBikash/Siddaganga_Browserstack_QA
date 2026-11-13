# BUG-MLT-001 — Multi: new leg copies the previous leg's start instead of continuing from its drop/end

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_066 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - partially fixed (pickup continues from previous drop; date/time still defaults to now) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
-

## Steps to reproduce
1. Home > Multi; Leg 1 Local Majestic 04-10 11:30 am, 4 h
2. Add Next Stop - observe Leg 2 defaults
3. Fill Leg 2 Outstation Majestic -> Mysuru 06-10 to 07-10; Add Next Stop - observe Leg 3 defaults

## Expected result
Next leg pickup = previous drop/destination; start after previous end

## Actual result
Leg 2 = Majestic 04-10 11:30 (overlaps Leg 1); Leg 3 = Majestic 06-10 12:14 (not Mysuru, overlaps Leg 2)

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_066_1_leg2-defaults-today-before-leg1.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_066_2_leg3-pickup-mysuru-date-today.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Open - partially fixed (pickup continues from previous drop; date/time still defaults to now).
