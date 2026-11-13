# BUG-MLT-015 — Multi Outstation round-trip leg: Drop Location shown as the destination (Mysuru) on Ready to Explore and Inquiry Details but as Majestic on Confirm

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_15_02, UC_MLT_21_06 |
| Module | TRIP / INQ - Multi |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Multi Outstation leg Majestic -> Mysuru (no different drop)

## Steps to reproduce
1. Search Vehicles; open Leg 3 tab in Ready to Explore
2. Confirm Your Trip Leg 3
3. Inquiry Details of the leg

## Expected result
Drop/return location consistent (Majestic for a round trip)

## Actual result
Ready to Explore 'Drop Location Mysuru'; Confirm 'Dropoff Location Majestic'; Inquiry Details ends at Mysuru

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
