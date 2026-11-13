# BUG-INQ-14 — Edit Vehicle Costs Save accepts negative rates and never recalculates Final Quote (Per Km 55→60 keeps ₹35,000, also in PDF)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_047, TC_INQ_064, TC_INQ_026 |
| Module | Inquiry & Sales / Edit Quote - Edit Vehicle Costs |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (2/2 saves: -5 and 60) |

## Preconditions
Logged in as Superadmin; QA quote KOLA740746 (Dayanidhi, Outstation Mysore, 21-22 Nov 2026, 33 Seater Deluxe Coach, Total Kms 600, Per Km 55, Driver Allow 2,000, Late Allow 1,000, Final Quote ₹35,000) opened via ⋮ > Edit Quote

## Steps to reproduce
1. Scroll to Vehicle Costs and tap 'Edit Vehicle Cost'
2. Clear Per Km and enter '-5' (keypad '−' key), tap Save
3. Verify the Vehicle Costs summary and Final Quote
4. Tap 'Edit Vehicle Cost' again, set Per Km to '60', tap Save
5. Verify Final Quote; tap Update Quote; open View PDF

## Expected result
Negative values are rejected with a field error; a valid change recalculates the vehicle cost and Final Quote immediately (600 km x ₹60 + ₹2,000 driver (+ ₹1,000 late) = ₹38,000-39,000) and the saved quote/PDF use the new total

## Actual result
'-5' is saved without any error (summary 'Per Km ₹-5'). After Per Km 60 the summary shows ₹60 but the vehicle line and Final Quote stay ₹35,000; after Update Quote the PDF shows 'Per KM 60.00' next to 'Final Quote Amount: Rs. 35,000' and 'Expected Total: Rs. 35,000'

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_064_1_perkm_minus5_saved_no_error.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_047_1_perkm60_saved_final_still_35000.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_026_4_pdf_perkm60_final_35000.png`

## Error / API / log information
No error message

## Notes / suspected area
-
