# BUG-MLT-022 — Multi Transfer leg offers only Point to Point - no By Hour and no Add Return (available on the standalone Transfer tab and in the 23 Oct build)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_06_01, UC_MLT_07_01 |
| Module | HOME - Multi |
| Severity (proposed) | High |
| Priority (proposed) | P2 |
| Status | New - confirm whether intended scope change |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Home > Multi

## Steps to reproduce
1. Leg type Transfer
2. Try to untick 'Point To Point Transfer'; look for By Hour / Add Return
3. Compare with Home > Transfer tab

## Expected result
Same Transfer options as the Transfer tab (Point To Point | By Hour, Add Return), or documented removal

## Actual result
Checkbox cannot be unticked; no By Hour toggle and no Add Return in the Multi leg

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
