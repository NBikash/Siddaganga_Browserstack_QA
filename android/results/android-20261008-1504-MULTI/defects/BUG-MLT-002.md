# BUG-MLT-002 — Multi: the leg open in the form is silently dropped on Search Vehicles

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_067 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
-

## Steps to reproduce
1. Home > Multi; commit Legs 1-2 with Add Next Stop
2. Fill Leg 3 completely
3. Tap Search Vehicles

## Expected result
Leg 3 included (or a prompt to save/discard it)

## Actual result
Summary shows only committed legs; the filled open leg is lost without notice. With only an open (uncommitted) leg, Search shows "Please add at least one journey to continue." although a complete leg is on screen. Committing via Add Next Stop creates a pre-filled extra leg which is in turn ignored

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_067_1_open-leg-add-at-least-one-journey.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_067_2_summary-3-legs-open-leg4-dropped.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Open - still reproducible.
