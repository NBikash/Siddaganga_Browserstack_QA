# BUG-MLT-001 — Multi: new leg defaults to today/now and no longer continues pickup from the previous leg's drop (regression)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_11_07, UC_MLT_10_06 |
| Module | HOME - Multi |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - regressed (pickup continuity lost in 28 Oct build; date still defaults to now) |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (4/4 legs) |

## Preconditions
Logged in; Home > Multi

## Steps to reproduce
1. Leg 1 Local Majestic 30-10-2026 10:00 am, 4 h -> Add Next Journey
2. Observe Leg #2 defaults
3. Commit Leg 3 Outstation Majestic -> Mysuru 31-10; observe Leg #4 defaults
4. Commit Leg 4 Transfer Mysuru -> Majestic; observe Leg #5 From

## Expected result
Next leg pickup/From = previous leg's drop/destination; date/time defaults after the previous leg ends

## Actual result
Every new leg opens with an EMPTY pickup/From and today's date with the next half hour (28-10 11:00/11:30 am), before Leg 1. On the 7 Oct build the pickup continued from the previous destination (Mysuru) - that part has regressed. The previous leg's TYPE is copied instead.

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
