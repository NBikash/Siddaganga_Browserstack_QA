# BUG-INQ-08 — Edit Quote 'Cancel' saves unsaved edits and re-creates the quote under a new ID (ZZLL751390 → MBTI500321, ₹35,000 → ₹70,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_025 |
| Module | Inquiry & Sales / Edit Quote |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Reproduced 2026-10-09 (SpringFive, observed via reopen) and 2026-10-12 (QA quote, persisted as new record) |

## Preconditions
Logged in as Superadmin; QA quote ZZLL751390 (Dayanidhi, Outstation Mysore 21-22 Nov 2026, 33 Seater x1, Per Km 60, ₹35,000, Quotation ID 1432)

## Steps to reproduce
1. Sales > Quotes, scroll to card ZZLL751390, ⋮ > Edit Quote
2. In Trip-1 > Journey A tap '+' (quantity 01 -> 02): Final Quote ₹70,000, Per Km resets to ₹55
3. Scroll down and tap Cancel (do NOT tap Update Quote)
4. Reopen ⋮ > Edit Quote on ZZLL751390: qty 02 / ₹70,000 is shown
5. Tap Cancel again
6. Open Inquiries, search client 'daya'; open View Inquiry on the new row

## Expected result
Cancel discards all unsaved changes; the quote keeps ID ZZLL751390, quantity 1 and ₹35,000; reopening shows the saved values

## Actual result
ZZLL751390 is no longer listed; a new inquiry MBTI500321 (Quotation ID 1433) exists with Quantity 2, Per KM 55, Final Quote Amount ₹70,000. The first Cancel left the card at ₹35,000 but kept the edit in the form; the second Cancel persisted it as a new record. Edit screen is still titled 'Add New Quote'.

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_2_ZZLL_qty2_70000_perkm_reset_55.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_3_reopen_after_cancel_70000_vs_card_35000.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_5_after_cancel_ZZLL_replaced_by_MBTI500321.jpg`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_6_MBTI500321_quotation_1433_qty2.jpg`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_025_7_MBTI500321_final_70000_perkm55.jpg`

## Error / API / log information
No error or confirmation shown. QA records affected: ZZLL751390 -> MBTI500321.

## Notes / suspected area
-
