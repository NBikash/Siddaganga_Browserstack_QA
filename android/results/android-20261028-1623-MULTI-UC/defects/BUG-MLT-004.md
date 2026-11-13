# BUG-MLT-004 — Multi inquiry: every leg card and Inquiry Details show the whole-trip total (Rs 1,18,800) instead of the leg amount; legs not linked

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_20_03, UC_MLT_14_17, UC_MLT_21_03, UC_MLT_21_04, UC_MLT_21_05 |
| Module | BOOK / INQ - Multi |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - changed form (Confirm and success correct; Ride shows trip total on each leg) |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Logged in; QA account; inquiry submission approved

## Steps to reproduce
1. Multi: Leg 1 Local 30-10 4 h, Leg 2 Local 31-10 1 h, Leg 3 Outstation Majestic->Mysuru 31-10, Leg 4 Transfer Mysuru->Majestic 31-10 night; 1 passenger
2. Select 49 Seater MultiAxle Volvo for each leg (19,300 / 19,300 / 54,300 / 25,900)
3. Review booking: Estimated All Leg Grand Total Rs 1,18,800 -> Confirm
4. Ride > Week > Inquired; open the Outstation card (Inquiry 4589)

## Expected result
One linked Multi booking (or clearly labelled legs) where each leg shows its own amount and the legs sum to Rs 1,18,800

## Actual result
4 unlinked cards (Transfer, Outstation, Local, Local), each 'Starts From Rs 1,18,800'; Inquiry 4589 'Total Amount Rs118800' (leg total is 54,300; amount unformatted). Week 'Total Spent' inflated. After cancelling one leg, remaining cards all show Rs 64,500 (remaining trip total).

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_21_04_1_each-leg-card-118800.png`
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_21_05_1_inq4589-total-118800.png`
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_20_01_1_success-118800.png`

## Error / API / log information
-

## Notes / suspected area
-
