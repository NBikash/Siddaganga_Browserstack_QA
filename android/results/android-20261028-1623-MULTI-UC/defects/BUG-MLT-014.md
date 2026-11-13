# BUG-MLT-014 — Multi capacity banner shows reversed / stale numbers ('1 of 0 seats filled', '1 of 49 seats filled') and blocks booking for N/A-seat vehicles

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_12_08 |
| Module | VLIST - Multi |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open (same family as 23 Oct 'Reversed capacity mapping') |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Multi search, 1 passenger

## Steps to reproduce
1. Premium chip > select 'Standard Business' (N/A Seater) for each leg
2. Tap Review booking
3. Replace Leg 1 vehicle with 49 Seater MultiAxle Volvo

## Expected result
Clear capacity message (e.g. '49 seats for 1 passenger - OK'); vehicles without seat data not offered or flagged

## Actual result
'Passenger Capacity Not Complete! Open a vehicle to review it. Tick the circle to add or remove it. 1 of 0 seats filled'; after choosing a 49-seater it still says 'Not Complete' with '1 of 49 seats filled'

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_12_08_1_capacity-banner-1-of-0-seats.png`

## Error / API / log information
-

## Notes / suspected area
-
