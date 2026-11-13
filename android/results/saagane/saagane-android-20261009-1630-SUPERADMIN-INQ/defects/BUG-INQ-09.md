# BUG-INQ-09 — Inquiries search does not find inquiries by Inquiry ID

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_053 |
| Module | Inquiry & Sales / Inquiries |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Always |

## Preconditions
Logged in as Superadmin; Inquiry & Sales > Inquiries tab; filters cleared; inquiry FLLF456462 (Chiranjeevi Siddu) present on page 2

## Steps to reproduce
1. Open Inquiry & Sales > Inquiries
2. Open the filter and tap Clear so all 20 inquiries are listed
3. Go to page 2 and confirm row 13 shows INQUIRY ID 'FLLF456462' (Chiranjeevi Siddu)
4. Tap 'Search inquiries...' and type 'fllf' (one character at a time)
5. Verify the result
6. Clear the field and type 'rani'
7. Verify the result

## Expected result
Searching 'fllf' lists inquiry FLLF456462; searching 'rani' lists the three Rani HM inquiries

## Actual result
'fllf' → 'No inquiries found.'; 'rani' → 3 rows (name search works). Inquiry-ID search is not supported (same gap as quote PNR search, BUG-INQ-04)

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_052_2_inquiries_page2.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_053_3_search_inquiry_id_fllf_no_result.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_053_4_search_client_rani.png`

## Error / API / log information
-

## Notes / suspected area
-
