# BUG-INV-001 — Invoice period filters show wrong totals: Last 3 Months exceeds All and omits recent invoices

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INV_002 |
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
Account with more than 10 invoices

## Steps to reproduce
1. Open Invoices & Receipts (All)
2. Tap This Month
3. Tap Last 3 Months

## Expected result
All >= Last 3 Months >= This Month; each list contains the invoices of its period.

## Actual result
All and This Month: Rs 42,950 / 10 trips; Last 3 Months: Rs 93,100 / 10 trips, starting at INV-70 and missing INV-71..78 from October.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_INV_002_1_last3months-exceeds-all.png`
- `android/evidence/android-20261006-1730-ACCOUNT/TC_INV_002_2_this-month.png`

## Error / API / log information
-

## Notes / suspected area
Summary seems computed from a page of 10 items.
