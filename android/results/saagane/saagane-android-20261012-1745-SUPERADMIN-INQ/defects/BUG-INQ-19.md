# BUG-INQ-19 — Changing GST Value inside a quote silently updates the client master record ('Customer updated successfully')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_035 |
| Module | Inquiry & Sales / Add New Quote |
| Severity (proposed) | Major |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (2/2: 5%→18%, 18%→5%) |

## Preconditions
Logged in as Superadmin; Sales > + New Quote; QA client 'Dayanidhi' (QA email/phone on file)

## Steps to reproduce
1. Select Client Name 'Dayanidhi' - GST Value shows 5%
2. Tap 'Change' next to GST Value
3. Select 18% in 'Change GST Value' and tap Save
4. Read the alert
5. Tap Back, open '+ New Quote' again and select the same client

## Expected result
The GST override applies to this quote only; the client master keeps 5% (or the user is explicitly asked whether to update the client)

## Actual result
Alert 'Customer updated successfully.'; every new quote for the client now defaults to GST 18%

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_035_1_gst18_save_customer_updated.jpg`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_035_2_new_quote_client_gst_now_18.jpg`

## Error / API / log information
QA client restored to 5% after the test.

## Notes / suspected area
-
