# BUG-OUT-009 — Outstation 4-day inquiry estimated at one day's base fare (Rs 18,500) - days and km not charged

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_012, TC_VLIST_012, TC_CONF_011, TC_HOME_054 |
| Module | Confirm Trip & Inquiry Submission |
| Severity (proposed) | Critical |
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
1. Outstation search 04-10 10:30 am to 07-10 06:30 am (4 days, 1200 KM)
2. Select 33 Seater Deluxe Coach > Book Now
3. Review Estimated Trip Cost; Confirm

## Expected result
Estimate = Rs 16,500 x 4 days and/or 1200 km x Rs 55 + applicable bata (approx. Rs 66,000-73,000+), consistent with the list price

## Actual result
Reproduced on app-release_5Oct26.apk: TC_CONF_012: 3-day multi-stop trip (08-10 Oct, 395 KM, 33 Seater Deluxe Coach): Vehicle Base Cost Rs 16,500 + Bata Rs 1,000 + Bata Rs 1,000 = Estimated Grand Total Rs 18,500 - identical to a 1-day fare; days and km not charged (vehicle list showed Rs 52,500 for the same trip). Compared with 4-day trip in TC_CONF_011. BUG-OUT-009 still reproducible. | TC_VLIST_012: List Starts From scales with duration (33 Seater Deluxe Coach: 3-day 08-10 Oct Rs 52,500; 4-day 12-15 Oct Rs 70,000 = +Rs 17,500/day) but neither matches the Confirm estimate (Rs 18,500 for both). | TC_CONF_011: 4-day Outstation (12-15 Oct, 281 KM, pickup 10:30 am, 20 pax, 33 Seater Deluxe Coach): Vehicle Base Cost Rs 16,500 (one day) + Bata (Before 6am or After 10pm) Rs 1,000 + Bata (Before 10pm or After 6am) Rs 1,000 = Estimated Grand Total Rs 18,500. Not x4 days, no km charge (281 km x Rs 55), night bata applied to a 10:30 am pickup; total differs from list Rs 70,000. BUG-OUT-009 still reproducible. | TC_HOME_054: 31-day interstate trip (09 Oct - 08 Nov, Majestic -> Panaji, Goa): accepted, no maximum duration; Trip Summary consistent (1175 KM). Pricing inconsistent: list 33 Seater Deluxe Coach Starts From Rs 5,42,500 vs Confirm Estimated Grand Total Rs 18,500 (one-day fare). Confirm not submitted (Edit Inquiry).

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CONF_012_1_3day-estimate-18500.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_VLIST_011_1_list-4day-70000.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_CONF_011_1_4day-estimate-18500.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.). Retested in android-20261006-1252-OUTSTATION.
