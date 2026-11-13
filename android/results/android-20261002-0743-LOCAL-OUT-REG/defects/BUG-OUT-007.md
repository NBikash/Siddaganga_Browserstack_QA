# BUG-OUT-007 — Outstation price inconsistent across screens: list Rs 73,000, details footer Rs 10,000, confirm/inquiry Rs 18,500

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_011, TC_VDET_017, TC_VLIST_012, TC_HOME_054 |
| Module | Vehicle Listing / Vehicle Details |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - partially fixed |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Outstation search 4-7 Oct, Majestic -> Mysuru
2. Note Starts From on 33 Seater Deluxe Coach card
3. Open the vehicle; read footer and breakup default tab
4. Book Now; read Estimated Grand Total

## Expected result
One consistent outstation estimate across list, details and confirm; details opened from an Outstation search default to the Outstation context

## Actual result
Vehicle Details footer now shows Outstation price (Rs 16,500/day + Rs 55/km) instead of Local Rs 10,000; list price (Rs 73,000 / 53,500 / 5,71,500) still differs from Confirm estimate (Rs 18,500); Fare Breakup still defaults to Local tab. Original: List Rs 73,000; details footer 'Starting From Rs 10,000 / Rs 55/km' (Local) with breakup on Local tab; confirm modal and inquiry Rs 18,500

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_011_1_list-73000.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_011_2_estimate-18500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VDET_017_1_footer-16500-day.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VDET_017_2_breakup-default-local.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_012_1_3day-list-53500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_054_1_31day-list-571500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_054_2_31day-estimate-18500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_011_1_inq534-no-return.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.
