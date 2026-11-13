# BUG-TRF-016 — Vehicle Details from a Transfer search opens the fare breakup on the Local Trip tab

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VDET_018 |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Low |
| Priority (proposed) | Medium |
| Status | Open - still reproducible (also affects Outstation) |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_VDET_018: Vehicle Details (Sedan) from the Transfer P2P search: footer Starting From Rs 8,000 (Transfer Long slab - OK), but View Fare Breakup opens on the Local Trip tab, not Transfer Trip. Same on the 33 Seater from the By Hour search.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_VDET_018_1_transfer-breakup-opens-local-tab.png`

## Error / API / log information
No error shown on device.

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
