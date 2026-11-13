# BUG-INQ-11 — Quote card TOTAL and PDF show ₹0 although Edit Quote calculates Final Quote ₹12,000 (CMKY282284)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_068 |
| Module | Inquiry & Sales / Quotes |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (3/3 views on the same quote: card, Edit Quote, PDF) |

## Preconditions
Logged in as Superadmin; Operations > Inquiry & Sales > Sales tab > Quotes segment; QA quote 'Dayanidhi' PNR CMKY282284 (Local, 12 Oct 2026, 4 pax, 1 x 33 Seater Deluxe Coach, status Pending Approval, Quotation ID 1421)

## Steps to reproduce
1. Open Operations > Inquiry & Sales; stay on the Sales tab
2. Tap the 'Quotes' segment and wait for the list
3. Read the TOTAL box on the 'Dayanidhi' card CMKY282284
4. Tap ⋮ > Edit Quote, scroll to Vehicle Costs and read Final Quote; tap Cancel (do not save)
5. On the same card tap View PDF, tap OK on 'File downloaded successfully', open Files > Downloads > Quotation_Summary_CMKY282284.pdf
6. Read 'Expected Total' and 'Final Quote Amount' in the PDF

## Expected result
Card TOTAL, Edit Quote Final Quote and PDF Expected Total / Final Quote Amount show the same amount (₹12,000 per the cost breakdown: vehicle ₹12,000; Driver Allow ₹1,000; Late Allow ₹1,000 - exact formula per Q-INQ)

## Actual result
Card TOTAL ₹0; Edit Quote Final Quote ₹12,000 (33 Seater Deluxe Coach ₹12,000, Km's Costing ₹55, Hr's Costing ₹1,000, Driver Allow ₹1,000, Late Allow ₹1,000); PDF 'Expected Total: Rs. 0' and 'Final Quote Amount: Rs. 0' while its Vehicle Costs row lists 12000.00 and Driver Allow 1000.00

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_2_CMKY282284_card_total_0.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_1_CMKY282284_edit_final_quote_12000.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_3_CMKY282284_pdf_cost_row_final_rs0.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_4_CMKY282284_pdf_expected_total_rs0.png`

## Error / API / log information
No error shown. Quote was created outside this run (not by Claude); root cause (save path vs. calculation) unknown.

## Notes / suspected area
-
