# BUG-MLT-008 — Switching trip type or tapping Clear silently discards an entire Multi itinerary

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_074, TC_HOME_027 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Fixed - verified (confirmation on Clear and on trip-type switch) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
-

## Steps to reproduce
1. Home > Multi; commit one or more legs
2. Tap the Local tab (or Clear)
3. Return to Multi

## Expected result
Legs kept per tab, or a confirmation before discarding

## Actual result
Fresh 'Leg 1 Local'; all legs lost without warning

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_027_1_clear-delete-multi-trip-dialog.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_027_2_after-delete-fresh-leg1.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_074_1_switch-type-warning.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Fixed - verified (confirmation on Clear and on trip-type switch).
