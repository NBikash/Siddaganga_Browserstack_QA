# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund of Rs16,650 and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_022, TC_INQ_016, TC_INQ_019 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Create an Outstation inquiry (Inquiry 520, total Rs18,500); do not pay any advance (Advance Received Rs0)
2. Inquiry Details > Cancel Trip
3. Review Refund Calculation; Confirm Cancellation

## Expected result
Refund is based on the amount actually paid (Rs0) - no refund and no refund invoice; or penalty only if a policy requires it

## Actual result
Reproduced on app-release_5Oct26.apk: TC_INQ_022: Inquiry 568 (Rs 16,500, no advance paid, 9 days 1 hour before start): Cancel Trip -> slab T >= 7 days - fully refundable, Penalty 0%, Add one day charge No, Penalty retained Rs 0 (slab correct). Confirm Cancellation (approved) -> Booking Cancelled (Inquiry #568), Cancellation Invoice INV-76 with Refund amount Rs 16,500 although nothing was paid (refund should be the amount paid, Rs 0). Slab behaviour passes; refund basis fails (BUG-OUT-014). | TC_INQ_016: Inquiry 570 (P2P, Rs 8,000, advance Rs 0, 23 hours before pickup): slab 6 hrs <= T < 24 hrs, Penalty 20%, Add one day charge Yes with One day charge Rs 0.00, Penalty retained Rs 1,600, Refund amount Rs 6,400; after Confirm Cancellation: Cancellation Invoice INV-77 refunding Rs 6,400. Slab correct; refund on an unpaid inquiry and Add one day charge Yes / Rs 0.00 inconsistent. BUG-OUT-014, BUG-TRF-005. | TC_INQ_019: Cancel Trip on Inquiry 571: dialog for Inquiry 571 only, Trip cost Rs 8,000 (inquiry total Rs 16,000), slab T >= 7 days fully refundable, refund Rs 8,000 on Rs 0 paid; no statement whether one or both legs are cancelled. After Confirm Cancellation (INV-78) Month > Inquired dropped 28 -> 26 - the outward inquiry was cancelled silently too. BUG-TRF-011 still present.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_022_1_7plus-days-0pct-refund-on-unpaid.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_022_2_cancelled-INV-76.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_016_1_refund-6400-on-unpaid.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_016_2_cancelled-INV-77.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_019_1_cancel-dialog-8000-one-leg.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_019_2_cancelled-INV-78.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
