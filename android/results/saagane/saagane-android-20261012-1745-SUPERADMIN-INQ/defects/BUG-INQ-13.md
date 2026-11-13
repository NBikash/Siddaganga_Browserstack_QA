# BUG-INQ-13 — Dynamic booking with no combination selected gives no 'select a combination' message; Category dropdown is silently empty

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_031 |
| Module | Inquiry & Sales / Add New Quote |
| Severity (proposed) | Minor |
| Priority (proposed) | P4 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (1/1) |

## Preconditions
Logged in as Superadmin; Sales tab > '+ New Quote' (Booking Type Dynamic, Local/Outstation/Transfer all unticked)

## Steps to reproduce
1. Select client 'Dayanidhi', Trip Month, Trip Duration 1
2. Scroll to 'Date/Day wise Category Assignment' and open 'Category for Day 1'
3. Tap '+ Add New Trip'
4. Tap Generate Quote

## Expected result
A clear message such as 'Select at least one Dynamic Inquiry Combination' (TC_INQ_031)

## Actual result
Category dropdown opens with no options and no hint; '+ Add New Trip' says 'Please select at least one date or range first!'; Generate Quote says 'Please add at least one journey before submitting'. The missing combination is never mentioned.

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_031_2_category_dropdown_empty_no_combination.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_031_3_add_trip_needs_date_alert.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_031_1_no_combination_blocked_by_journey_alert.png`

## Error / API / log information
-

## Notes / suspected area
-
