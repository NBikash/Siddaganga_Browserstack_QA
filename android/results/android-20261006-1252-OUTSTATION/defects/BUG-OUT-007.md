# BUG-OUT-007 — Outstation price inconsistent across screens: list Rs 73,000, details footer Rs 10,000, confirm/inquiry Rs 18,500

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_012, TC_VLIST_011, TC_VLIST_012, TC_HOME_054 |
| Module | Vehicle Listing / Vehicle Details |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk: TC_CONF_012: 3-day multi-stop trip (08-10 Oct, 395 KM, 33 Seater Deluxe Coach): Vehicle Base Cost Rs 16,500 + Bata Rs 1,000 + Bata Rs 1,000 = Estimated Grand Total Rs 18,500 - identical to a 1-day fare; days and km not charged (vehicle list showed Rs 52,500 for the same trip). Compared with 4-day trip in TC_CONF_011. BUG-OUT-009 still reproducible. | TC_VLIST_011: 4-day Outstation (12-15 Oct, 281 KM, 20 pax): list card 33 Seater Deluxe Coach Starts From Rs 70,000 (40 Seater Rs 76,000); Vehicle Details footer Rs 16,500 /day + Rs 55/km; Confirm/inquiry estimate Rs 18,500 - three different prices for the same trip. BUG-OUT-007 still reproducible. | TC_VLIST_012: List Starts From scales with duration (33 Seater Deluxe Coach: 3-day 08-10 Oct Rs 52,500; 4-day 12-15 Oct Rs 70,000 = +Rs 17,500/day) but neither matches the Confirm estimate (Rs 18,500 for both). | TC_HOME_054: 31-day interstate trip (09 Oct - 08 Nov, Majestic -> Panaji, Goa): accepted, no maximum duration; Trip Summary consistent (1175 KM). Pricing inconsistent: list 33 Seater Deluxe Coach Starts From Rs 5,42,500 vs Confirm Estimated Grand Total Rs 18,500 (one-day fare). Confirm not submitted (Edit Inquiry).

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CONF_012_1_3day-estimate-18500.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_VLIST_011_1_list-4day-70000.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CONF_011_1_4day-estimate-18500.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - partially fixed.). Retested in android-20261006-1252-OUTSTATION.
