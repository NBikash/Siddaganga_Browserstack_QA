# BUG-MLT-011 — Multi: Cancel in Edit Leg mode discards/overwrites the open leg draft

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_17_07 |
| Module | HOME - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Multi with committed legs and a partly filled open leg

## Steps to reproduce
1. Open Leg #3 set to Outstation, pickup Mangaluru
2. Tap Edit on Leg 1 chip -> Cancel
3. Tap Edit on Leg 1, switch type to Transfer, tap Cancel

## Expected result
Edit mode closes without changes; open draft unchanged

## Actual result
First Cancel reset the draft to an empty 'Leg #3 Local'; second Cancel changed the open draft to 'Leg #3 Transfer' (type chosen in the cancelled edit leaks into the draft)

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
