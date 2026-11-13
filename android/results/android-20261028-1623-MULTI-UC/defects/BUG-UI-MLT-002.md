# BUG-UI-MLT-002 — Night charge labelled 'Late Allowance' on Transfer legs but 'Night Bata (10pm - 6am)' on Local/Outstation legs

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_14_09 |
| Module | CONF - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Multi with a night Transfer leg

## Steps to reproduce
1. Review booking; compare Leg 1 and Leg 4 Estimated Trip Cost

## Expected result
Consistent label for the same charge

## Actual result
Leg 4: 'Late Allowance Rs900'; Leg 1/3: 'Night Bata (10pm - 6am)'

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
