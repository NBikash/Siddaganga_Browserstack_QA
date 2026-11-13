# BUG-OUT-003 — Outstation destination field drops the selected place name and shows only the address

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Location Picker |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
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
Field shows 'Agrahara, Chamrajpura, Mysuru, Karnataka, India' - the landmark name is lost (same root cause as BUG-LOC-003 for drop location)

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
