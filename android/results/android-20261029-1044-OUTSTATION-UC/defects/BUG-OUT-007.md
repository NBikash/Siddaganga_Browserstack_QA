# BUG-OUT-007 — Outstation list and Vehicle Details price shows one day (Rs 52,500) for a 3-day trip; Confirm shows Rs 1,60,900

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP4_02 |
| Module | VLIST / VDET - Outstation |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Outstation round trip Majestic -> Mysuru 29-31 Oct, 4 pax

## Steps to reproduce
1. Search Vehicles > Search Vehicles
2. Read 'Starts From' of 49 Seater MultiAxle Volvo
3. Open details (footer) > Book Now > read Estimated Grand Total

## Expected result
List / details price reflects the trip (days, route) and equals the Confirm estimate

## Actual result
List and details footer Rs 52,500 (/day); Confirm Rs 1,60,900

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP4_02_1_list-52500-3day.png`
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP4_05_1_confirm-160900.png`

## Error / API / log information
-

## Notes / suspected area
-
