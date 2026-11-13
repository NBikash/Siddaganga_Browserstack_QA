# BUG-CONF-002 — Single-day daytime Local estimate adds night bata and differs from list and details price (Rs 11,000 / Rs 10,000 / Rs 12,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CONF_003, TC_VLIST_003 |
| Module | Confirm Trip & Inquiry Submission |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in as QA user; Local tab; single day (Multi-day off).

## Steps to reproduce
1. Local: Pickup Majestic, Different drop location ON -> Kempegowda International Airport
2. Date 06-10-2026, Pickup time 10:00 am, 4 passengers, 8 hours
3. Search Vehicles > Search Vehicles; note 33 Seater Deluxe Coach card 'Starts From Rs 11,000'
4. Open the card: Local Rs 10,000 (8hr/80km), footer Starting From Rs 10,000
5. Tap Book Now and scroll to Estimated Trip Cost

## Expected result
An 8-hour 10:00 am - 6:00 pm trip within the 8hr/80km package costs the package base (Rs 10,000) with no night bata ('Before 6am or After 10pm' does not apply); the same amount is shown consistently on the list card, details and Confirm estimate.

## Actual result
Estimate = Vehicle Base Cost Rs 10,000 + Bata (Before 6am or After 10pm) Rs 1,000 + Bata (Before 10pm or After 6am) Rs 1,000 = Rs 12,000. Both bata lines are always charged regardless of pickup time. The same vehicle is priced Rs 11,000 on the list, Rs 10,000 on details and Rs 12,000 on Confirm.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_CONF_003_1_estimate-12000-night-bata.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_003_1_details-35seats-10000.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_VLIST_001_1_available-vehicles.png`

## Error / API / log information
Over-quoting risk: customers see three different prices for the same trip; night allowance charged for a daytime trip. Related to BUG-CONF-001 (multi-day) and BUG-VDET-002 (bata labels).

## Notes / suspected area
New in this run - the single-day variant was not raised before (previous runs only reported the multi-day case).
