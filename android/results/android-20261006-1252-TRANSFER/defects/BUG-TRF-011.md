# BUG-TRF-011 — Cancelling the return leg silently cancels the outward inquiry too; dialog uses Rs16,500 instead of the Rs33,000 inquiry total

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_019 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Create a round-trip Transfer (two inquiries)
2. Open the return inquiry (525) > Cancel Trip > Confirm Cancellation
3. Check My Bookings > Inquired

## Expected result
User is told both legs will be cancelled (or only the selected leg is cancelled); amounts match the inquiry

## Actual result
Reproduced on app-release_5Oct26.apk: TC_INQ_019: Cancel Trip on Inquiry 571: dialog for Inquiry 571 only, Trip cost Rs 8,000 (inquiry total Rs 16,000), slab T >= 7 days fully refundable, refund Rs 8,000 on Rs 0 paid; no statement whether one or both legs are cancelled. After Confirm Cancellation (INV-78) Month > Inquired dropped 28 -> 26 - the outward inquiry was cancelled silently too. BUG-TRF-011 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_019_1_cancel-dialog-8000-one-leg.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_019_2_cancelled-INV-78.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
