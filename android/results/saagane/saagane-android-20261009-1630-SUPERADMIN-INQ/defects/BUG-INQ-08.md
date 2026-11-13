# BUG-INQ-08 — Edit Quote Cancel keeps unsaved edits; reopening shows ₹35,000 instead of saved ₹37,000 (screen titled 'Add New Quote')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_025 |
| Module | Inquiry & Sales / Edit Quote |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Always |

## Preconditions
Logged in as Superadmin; quote KLKV914286 saved with TOTAL ₹37,000

## Steps to reproduce
1. Perform BUG-INQ-06 steps 1-7 (change quantity +/− then Cancel)
2. Verify the SpringFive card on the Quotes list still shows TOTAL ₹37,000
3. Tap ⋮ > Edit Quote again and read the screen title
4. Scroll to Vehicle Costs and read Driver Allow and Final Quote

## Expected result
Title 'Edit Quote'; the form reloads the saved quote: Driver Allow ₹1,000, Final Quote ₹37,000

## Actual result
Title 'Add New Quote'; form shows Driver Allow ₹2,000 and Final Quote ₹35,000 (values from the cancelled edit) while the list still shows ₹37,000

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_025_1_edit_quote_title_add_new_quote.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_025_3_reopen_edit_shows_35000_vs_saved_37000.png`

## Error / API / log information
-

## Notes / suspected area
-
