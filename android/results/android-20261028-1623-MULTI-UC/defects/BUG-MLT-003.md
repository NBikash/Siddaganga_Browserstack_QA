# BUG-MLT-003 — Multi: no chronology / overlap validation between legs

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_11_06, UC_MLT_11_10 |
| Module | HOME - Multi |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Logged in; Home > Multi

## Steps to reproduce
1. Leg 1 Local 30-10-2026 10:00 am -> Add Next Journey
2. Leg 2 Local 29-10-2026 10:00 am -> Add Next Journey
3. Search Vehicles
4. (Also) Leg 1 Local multi-day 29 Oct + 2 Nov; Leg 2 Outstation 30-31 Oct

## Expected result
Error: a leg must start after the previous leg ends; overlapping legs flagged

## Actual result
Both legs committed without warning; Ready to Explore shows Leg 1 = 30 Oct, Leg 2 = 29 Oct; overlapping Outstation leg inside a multi-day range accepted

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
