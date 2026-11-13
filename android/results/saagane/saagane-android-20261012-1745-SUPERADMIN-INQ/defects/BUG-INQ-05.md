# BUG-INQ-05 — [Re-verified] Quote status chip 'Pending Approval' does not match Status filter values (Pending returns nothing)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_022 |
| Module | Inquiry & Sales / Quotes |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Re-verified 2026-10-12 (still reproduces). First found in saagane-android-20261009-1630-SUPERADMIN-INQ: Always |

## Preconditions
Logged in as Superadmin; Sales > Quotes; all quote cards show status chip 'Pending Approval'

## Steps to reproduce
1. Open Inquiry & Sales > Sales > Quotes and note the status chip on each card ('Pending Approval')
2. Tap the filter icon; open Status and note the options
3. Select 'Pending' and tap Apply - verify the result
4. Open the filter, select Status 'New Quotation' and tap Apply
5. Verify the status chip on the returned cards

## Expected result
The filter offers the statuses shown on the cards; 'Pending' (or 'Pending Approval') lists the Pending Approval quotes; a 'New Quotation' result shows a 'New Quotation' chip

## Actual result
'Pending' → 'No quotes found.'; 'New Quotation' → returns e.g. Chiranjeevi Siddu (FLLF456462) whose chip reads 'Pending Approval'

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_022_1_status_pending_no_quotes.png`

## Error / API / log information
-

## Notes / suspected area
-
