# BUG-INQ-17 — Lead 'Send To Inquiry' carries over only client details - trip dates, pax, route and vehicle from the lead are lost

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_015 |
| Module | Inquiry & Sales / Leads |
| Severity (proposed) | Major |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | 1/1 |

## Preconditions
Logged in as Superadmin; Sales > Leads; QA lead LD-137 'Test userqt' (₹12,000, Majestic Bengaluru route, 33 Seater Deluxe Coach, Open/Prospecting)

## Steps to reproduce
1. Search leads for '137'
2. Tap ⋮ on LD-137 > Send To Inquiry
3. Inspect Booking Type, combinations, Client Information and Trip Details

## Expected result
Inquiry form pre-filled with the lead's client, journey type, dates, pax, route and vehicle (TC_INQ_015); a confirmation if the action creates a record

## Actual result
'Add New Quote' opens with only Client Name/Email/Contact/GST filled; Booking Type 'Dynamic' with nothing ticked; Trip Month, dates, times, pax, route and vehicle are empty

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_015_1_send_to_inquiry_opens_add_new_quote_client_only.jpg`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_015_2_trip_details_not_prefilled.jpg`

## Error / API / log information
-

## Notes / suspected area
-
