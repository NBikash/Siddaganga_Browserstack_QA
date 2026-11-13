# BUG-INQ-06 — Edit Quote: changing vehicle quantity recalculates incorrectly (qty 2 = ₹70,000; back to qty 1 = ₹35,000 instead of ₹37,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_043, TC_INQ_025 |
| Module | Inquiry & Sales / Edit Quote |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Always |

## Preconditions
Quote KLKV914286 (₹37,000: 600 km x ₹55, driver ₹1,000/day, late ₹1,000/day, 2 days)

## Steps to reproduce
1. Open Inquiry & Sales > Sales > Quotes
2. On 'SpringFive Consulting Services LLP' (KLKV914286, TOTAL ₹37,000) tap ⋮ > Edit Quote
3. Scroll to Trip-1 > Journey A: OutStation and Vehicle Costs; verify Quantity 1, Driver Allow ₹1,000, Final Quote ₹37,000
4. Tap '−' on the vehicle stepper - verify it stays at 01 and ₹37,000
5. Tap '+' (01 → 02) and wait ~5 s for recalculation; read Driver Allow and Final Quote
6. Tap '−' (02 → 01) and wait ~5 s; read Driver Allow and Final Quote
7. Tap Cancel at the bottom (do not tap Update Quote)

## Expected result
Qty 2 total follows the costing rule (e.g. 2 x ₹37,000 = ₹74,000 or as specified); returning to qty 1 restores exactly ₹37,000 with Driver Allow ₹1,000

## Actual result
Qty 2 → Driver Allow ₹2,000, Final Quote ₹70,000; back to qty 1 → Driver Allow ₹2,000, Final Quote ₹35,000 (≠ original ₹37,000 for identical inputs)

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_043_1_qty1_minus_stays_1_37000.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_043_2_qty2_final_70000.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_043_3_back_to_qty1_final_35000.png`

## Error / API / log information
-

## Notes / suspected area
-
