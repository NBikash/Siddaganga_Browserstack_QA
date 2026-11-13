# BUG-VLIST-006 — Vehicle filters show test master data ('Test type 3', 'Test data 3', 'Test 5') and unusable body types

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_13_03 |
| Module | VLIST |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Any vehicle search

## Steps to reproduce
1. Available Vehicles > Filters

## Expected result
Customer-facing vehicle types (Sedan, SUV, Tempo Traveller, Bus...)

## Actual result
Vehicle Type: Test type 3, Test type 2, Test data 3, Test 5, Test type 1; Body Type: Iron metal, Steel; 7 Seater filter returns 0 vehicles

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_13_03_1_filter-vehicle-type-test-data.png`

## Error / API / log information
-

## Notes / suspected area
-
