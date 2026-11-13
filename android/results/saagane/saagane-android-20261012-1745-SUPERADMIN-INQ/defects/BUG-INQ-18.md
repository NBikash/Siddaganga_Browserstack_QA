# BUG-INQ-18 — Inquiries show Client Type 'Regular' for every inquiry, including clients created as 'OTP (One Time Customer)'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_054 |
| Module | Inquiry & Sales / Inquiries |
| Severity (proposed) | Minor |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always |

## Preconditions
Logged in as Superadmin; inquiry created in this run with Client Information 'OTP (One Time Customer)' + 'Domestic' (client Dayanidhi)

## Steps to reproduce
1. Open Inquiries tab, search 'daya'
2. Swipe the table left to the CLIENT TYPE column
3. Open ⋮ > View Inquiry on the Dayanidhi row and read 'Client Type'

## Expected result
Client Type reflects the selection (OTP / One Time vs Contracted; Domestic/International) with the same wording in table, details and form (Q-INQ-05)

## Actual result
Table shows 'Regular' for all rows; Inquiry Details shows 'regular'; the form offers 'OTP (One Time Customer)' / 'Contracted Customer' - none of these match

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_054_1_client_type_all_regular.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_6_MBTI500321_quotation_1433_qty2.jpg`

## Error / API / log information
-

## Notes / suspected area
-
