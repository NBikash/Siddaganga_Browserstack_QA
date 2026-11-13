# BUG-TRF-016 — Vehicle Details opened from an Outstation (and Transfer) search opens the fare breakup on the Local Trip tab

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_017 |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Low |
| Priority (proposed) | Medium |
| Status | Open - still reproducible (also affects Outstation) |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer P2P search Majestic -> KIA
2. Filters > Sedan
3. Open Sedan
4. View Fare Breakup

## Expected result
Breakup opens on the Transfer Trip tab (search context)

## Actual result
Reproduced on app-release_5Oct26.apk: TC_VDET_017: Vehicle Details from the Outstation search: footer Starting From Rs 16,500 /day + Rs 55/km (Outstation context - OK), but View Fare Breakup opens on the Local Trip tab (Local Package Pricing) instead of Outstation Trip.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_VDET_017_1_breakup-opens-local-tab.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
Originally logged in an earlier run (Remaining part of the TC_VDET_018 finding of 01-10 (footer now fixed).). Retested in android-20261006-1252-OUTSTATION.
