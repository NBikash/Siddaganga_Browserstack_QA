# BUG-TRF-003 — Transfer list price uses the Short slab while the summary shows > 30 KM and Confirm charges the Long slab

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_013 |
| Module | Trip Summary / Confirm |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - partially fixed (Confirm now matches summary slab) |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer P2P Majestic -> Kempegowda International Airport
2. Read Distance on Trip Summary
3. Filters > Sedan: read Starts From
4. Open Sedan > Book Now: read Estimated Grand Total

## Expected result
One slab applied consistently; distance reflects the real route (~35+ km -> long transfer)

## Actual result
Reproduced on app-release_5Oct26.apk: TC_CONF_013: P2P Majestic -> KIA (summary Distance > 30 KM): vehicle list Sedan Starts From Rs 6,500 (Short slab) and 33 Seater Rs 14,500 (Short), but Vehicle Details footer and Confirm use the Long slab: Sedan Vehicle Base Cost Rs 8,000 = Estimated Grand Total Rs 8,000 (no bata). Confirm slab matches the summary distance; list price does not match the Confirm total. BUG-TRF-003 still present for the list price.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_013_1_list-14500-short-vs-summary-over30km.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_CONF_013_2_confirm-8000-long-vs-list-6500.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
