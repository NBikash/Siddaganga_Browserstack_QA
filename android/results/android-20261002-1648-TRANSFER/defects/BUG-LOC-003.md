# BUG-LOC-003 — Selected drop place shows only the address (Devanahalli...) instead of the place name

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Open Select Drop Location
2. Search 'kempegowda international airport'
3. Tap 'Kempegowda International Airport Bengaluru (BLR)'

## Expected result
Drop field shows a recognisable name, e.g. 'Kempegowda International Airport Bengaluru (BLR)'.

## Actual result
Retest android-20261002-1648-TRANSFER: Transfer To: airport selection shows Devanahalli, Be... (address only).

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_LOC_011_1_drop-address-only.png`

## Error / API / log information
Previously OBS-10. Pickup selections keep the name (e.g. 'Majestic, Bengaluru...').

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
