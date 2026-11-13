# BUG-TRF-003 — Transfer slab inconsistent: summary '< 30 KM' and list Rs 6,500 (short) but Confirm charges Long Transfer Rs 8,000

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary / Confirm |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
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
Retest android-20261002-1648-TRANSFER: Fixed: summary now > 30 KM and Confirm Rs 8,000 consistent; details footer Rs 8,000. Still open: vehicle list Sedan Starts From Rs 6,500 (short slab) for the same > 30 km search; card/inquiry show < 30 KM (BUG-TRF-018).

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_CONF_013_1_confirm-long-slab-8000.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
