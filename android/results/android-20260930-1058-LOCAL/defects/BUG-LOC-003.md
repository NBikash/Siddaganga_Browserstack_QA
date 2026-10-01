# BUG-LOC-003 — Selected drop place shows only the address (Devanahalli...) instead of the place name

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_011 |
| Module | Location Picker |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260930-1058-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Home > Local; Different drop location enabled.

## Steps to reproduce
1. Open Select Drop Location
2. Search 'kempegowda international airport'
3. Tap 'Kempegowda International Airport Bengaluru (BLR)'

## Expected result
Drop field shows a recognisable name, e.g. 'Kempegowda International Airport Bengaluru (BLR)'.

## Actual result
Drop field shows 'Devanahalli, Bengaluru, Karnataka 560...' - no place name.

## Evidence
- `android/evidence/android-20260930-1058-LOCAL/TC_LOC_011_1_drop_address_only.png`

## Error / API / log information
Previously OBS-10. Pickup selections keep the name (e.g. 'Majestic, Bengaluru...').

## Notes / suspected area
-
