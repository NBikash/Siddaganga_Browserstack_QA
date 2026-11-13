# BUG-OUT-003 — Outstation destination field drops the selected place name and shows only the address

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOC_016 |
| Module | Location Picker |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation > First Destination
2. Search 'mysuru palace'
3. Select 'Mysuru Palace'

## Expected result
Field shows 'Mysuru Palace, ...'

## Actual result
Reproduced on app-release_1stOct26.apk via TC_LOC_016. Original: Field shows 'Agrahara, Chamrajpura, Mysuru, Karnataka, India' - the landmark name is lost (same root cause as BUG-LOC-003 for drop location)

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_LOC_016_1_dest-address-only.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
