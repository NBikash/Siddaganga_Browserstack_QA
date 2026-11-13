# BUG-INQ-12 — Generate Quote saves a quote with Pax 0, no arrival/departure time and a Transfer journey without pickup/drop location

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_036, TC_INQ_040, TC_INQ_066 |
| Module | Inquiry & Sales / Add New Quote |
| Severity (proposed) | Major |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | 1/1 (not repeated to avoid more invalid records) |

## Preconditions
Logged in as Superadmin; Operations > Inquiry & Sales > Sales tab; approval to create QA quotes; QA client 'Dayanidhi' (OTP, Domestic)

## Steps to reproduce
1. Tap '+ New Quote'; keep Booking Type 'Dynamic' and tick only 'Transfer'
2. Select Client Name 'Dayanidhi' (email/contact/GST 5% auto-fill)
3. Trip Month November; Trip Description 'qa tes claude rerun'; Start Date and End Date 20 Nov 2026 (Trip Duration becomes 01)
4. Leave Arrival Time and Departure Time empty; enter Number of Pax's '0'
5. In Date/Day wise Category Assignment tap 20 Nov, tap '+ Add New Trip', OK on 'Trip-1 added successfully!'
6. Tap 'Add information' on Journey A: Transfer, select vehicle 'Sedan', leave Pickup/Drop Location and Pickup/Drop Time empty, tap Add
7. Scroll down and tap Generate Quote

## Expected result
Generate Quote is rejected with field-level errors: Number of Pax must be an integer >= 1; Arrival/Departure Time required; a Transfer journey needs pickup and drop location and time (field rules to be confirmed - Q-INQ-10)

## Actual result
Journey is added with 'Pickup Location: N/A, Drop Location: N/A, Pickup Time: N/A, Drop Time: N/A'; Generate Quote shows 'Data saved successfully!' and the notification 'New inquiry ZKCX608698 from Dayanidhi'. Quote ZKCX608698 (Final Quote ₹8,000) exists with 0 passengers and no route.

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_066_1_transfer_journey_added_locations_NA.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_040_1_pax0_quote_saved_ZKCX608698.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_036_3_dates_times_description_not_flagged.png`

## Error / API / log information
No error. QA record created: ZKCX608698 (to be cleaned up).

## Notes / suspected area
-
