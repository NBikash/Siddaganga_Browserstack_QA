# BUG-INV-002 — Cancellation invoices listed as Local trips with inconsistent payment status and counted as spend

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INV_005 |
| Module | Invoices & Receipts |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Cancelled Transfer inquiries (INV-77, INV-78)

## Steps to reproduce
1. Open Invoices & Receipts
2. Read INV-78 and INV-77 cards
3. View Invoice on INV-78
4. Download PDF

## Expected result
Cards show Transfer and mark cancellation invoices; status/amount match the cancellation (refund).

## Actual result
Cards say Local - Sedan; INV-78 PAID Rs 0 with Payment Method Cash while the PDF refunds Rs 8,000; INV-77 UNPAID Rs 1,600 penalty for an unpaid inquiry; both counted in Total Trips / Total Spent.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_INV_005_1_cancellation-invoices-local-sedan.png`
- `android/evidence/android-20261006-1730-ACCOUNT/TC_INV_005_2_inv78-transfer-paid-cash.png`

## Error / API / log information
-

## Notes / suspected area
Related to BUG-OUT-014 (refunds on unpaid cancellations).
