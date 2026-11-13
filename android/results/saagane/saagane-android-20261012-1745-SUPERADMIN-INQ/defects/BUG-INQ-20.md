# BUG-INQ-20 — No capacity check: a quote for 49 passengers is generated with a single Sedan

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_041 |
| Module | Inquiry & Sales / Add New Quote |
| Severity (proposed) | Major |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (2026-10-09 with 9999999999 pax, 2026-10-12 with 49 pax) |

## Preconditions
Logged in as Superadmin; Sales > + New Quote; approval to create a QA quote

## Steps to reproduce
1. Booking Type Dynamic, tick Transfer; client Dayanidhi
2. Trip Month November; Start/End Date 24 Nov 2026; Arrival 07:00 AM; Departure 07:23 AM; Number of Pax's 49
3. Category calendar: tap 24 Nov > + Add New Trip > OK
4. Journey A 'Add information': vehicle Sedan, pickup Mysore Palace, drop Mysore Road Satellite Bus Stand, 08:00 / 09:00 AM, Add
5. Tap Generate Quote

## Expected result
Warning or validation that 1 Sedan (4 seats) cannot carry 49 passengers; quote not generated until capacity >= pax (rule to confirm)

## Actual result
No warning at any step; 'Data saved successfully !' and inquiry LJGV893195 created with 1 x Sedan for 49 pax (₹6,500)

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_041_1_sedan_49pax_added_no_warning.jpg`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_041_2_generated_LJGV893195.jpg`

## Error / API / log information
-

## Notes / suspected area
-
