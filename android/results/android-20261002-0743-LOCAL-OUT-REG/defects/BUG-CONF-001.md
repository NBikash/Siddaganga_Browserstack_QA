# BUG-CONF-001 — Multi-day Local estimate charges base for one day and applies night bata to a daytime pickup

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_002 |
| Module | Confirm Trip & Inquiry Submission |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Local; Multi-day on with 2 dates (16, 20 Oct 2026); pickup 10:30 am; 4 pax; Majestic -> KIA.

## Steps to reproduce
1. Search Vehicles > Search Vehicles
2. Open 33 Seater Deluxe Coach (card shows Starts From Rs 29,000)
3. Tap Book Now and scroll to Estimated Trip Cost

## Expected result
Base cost x number of days (2 x Rs 10,000) plus only the applicable bata; estimate consistent with the card price.

## Actual result
Reproduced on app-release_1stOct26.apk via TC_CONF_002. Original: Vehicle Base Cost Rs 10,000 (one day); Bata (Before 6am or After 10pm) Rs 1,000 + Bata (Before 10pm or After 6am) Rs 1,000; Grand Total Rs 12,000 - while the card showed Rs 29,000.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_002_2_multiday-estimate.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_CONF_002_1_local-estimate-12000.png`

## Error / API / log information
Previously OBS-16. Under-quoting risk on inquiries.

## Notes / suspected area
Originally logged in android-20260930-1058-LOCAL. Retest status on new build: Open - still reproducible.
