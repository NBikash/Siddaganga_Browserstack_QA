# BUG-MLT-010 — Multi: tapping X on the Leg 1 chip deletes a different leg (Leg 2) and keeps Leg 1

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_071 |
| Module | HOME |
| Severity (proposed) | High |
| Priority (proposed) | High |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Intermittent - 1 of 3 attempts (seen when Leg 1 had been edited with a value change via Update Leg and the next leg was a Local multi-day leg); 2 clean re-tests removed the correct leg |

## Preconditions
Logged in; Home > Multi

## Steps to reproduce
1. Leg 1: Transfer > By Hour, Majestic, 16-10 09:55 am, 4 pax, 3 h (later edited to 5 h) -> Add Next Journey
2. Leg 2: Local, Majestic, Multi-day 17 & 18 Oct, 4 pax, 8 h -> Add Next Journey
3. With Leg 3 open, tap X on the 'Leg 1' chip
4. Tap Edit on the remaining chip / Search Vehicles

## Expected result
Leg 1 (By Hour, 16 Oct) is removed; Leg 2 (Local 17-18 Oct) remains and becomes Leg 1

## Actual result
The remaining chip is the By Hour leg (Edit shows Transfer By Hour 16-10, 5 h) and Trip Summary lists only 'Transfer (By Hour)' 16 Oct - the Local multi-day leg was deleted instead. No confirmation before deletion, so the user silently loses the wrong leg.

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_071_1_after-x-on-leg1.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_071_2_remaining-leg-is-byhour-not-local.png`
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_071_3_summary-only-byhour-leg.png`

## Error / API / log information
-

## Notes / suspected area
Possibly linked to the leg having been edited (Update Leg) earlier - the edit may have re-indexed legs.
