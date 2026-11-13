# BUG-INQ-04 — Quote search does not find quotes by PNR

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_019 |
| Module | Inquiry & Sales / Quotes |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Always |

## Preconditions
Logged in as Superadmin; Sales > Quotes; quote 'SpringFive Consulting Services LLP' with PNR KLKV914286 listed; no filters applied

## Steps to reproduce
1. Open Inquiry & Sales > Sales > Quotes
2. Confirm the first card shows 'SpringFive Consulting Services LLP' and PNR 'KLKV914286'
3. Tap 'Search quotes...' and type 'spring' - verify the SpringFive card is listed
4. Clear the field and type 'klkv'
5. Verify the result
6. Clear the field and type '914286'
7. Verify the result

## Expected result
Both 'klkv' and '914286' list the SpringFive quote (KLKV914286)

## Actual result
'spring' works; 'klkv' and '914286' both show 'No quotes found.'

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_019_1_search_client_spring.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_019_2_search_pnr_klkv_no_result.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_019_3_search_pnr_digits_no_result.png`

## Error / API / log information
-

## Notes / suspected area
-
