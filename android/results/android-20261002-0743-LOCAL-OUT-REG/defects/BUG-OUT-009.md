# BUG-OUT-009 — Outstation 4-day inquiry estimated at one day's base fare (Rs 18,500) - days and km not charged

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_011, TC_CONF_012, TC_VLIST_012, TC_HOME_054 |
| Module | Confirm Trip & Inquiry Submission |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Reproduced on app-release_1stOct26.apk via TC_CONF_011, TC_CONF_012, TC_VLIST_012, TC_HOME_054. Original: Vehicle Base Cost Rs 16,500 + Bata Rs 1,000 + Bata Rs 1,000 = Rs 18,500; night bata applied for a daytime pickup; the under-quoted amount is saved on Inquiry 520 and shown on My Bookings

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_011_2_estimate-18500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_012_1_3day-18500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_011_1_list-73000.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_VLIST_012_1_3day-list-53500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_054_1_31day-list-571500.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_HOME_054_2_31day-estimate-18500.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
