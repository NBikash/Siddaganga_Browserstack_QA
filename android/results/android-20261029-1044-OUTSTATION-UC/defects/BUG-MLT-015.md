# BUG-MLT-015 — Outstation round trip: drop shown as the destination (Mysuru) on Ready to Explore and Inquiry Details but as the pickup (Majestic) on Confirm

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP1_04, UC_OS_OP6_02 |
| Module | TRIP / CONF / INQ - Outstation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - rule to confirm (same issue in Multi) |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Outstation Majestic -> Mysuru, Different drop location OFF

## Steps to reproduce
1. Search Vehicles: read Drop Location
2. Confirm Your Trip: read Dropoff Location
3. Inquiry Details 4605: read the last route stop

## Expected result
One consistent drop for a round trip (rule to confirm: pickup or final destination)

## Actual result
Ready to Explore 'Mysuru'; Confirm 'Majestic'; Inquiry Details ends at 'Mysuru'

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP1_04_1_summary-drop-mysuru.png`
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP6_02_1_inq4605.png`

## Error / API / log information
-

## Notes / suspected area
-
