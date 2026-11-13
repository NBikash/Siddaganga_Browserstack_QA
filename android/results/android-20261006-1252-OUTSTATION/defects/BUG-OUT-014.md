# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund of Rs16,650 and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_014, TC_INQ_012 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-OUTSTATION |
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
Reproduced on app-release_5Oct26.apk: TC_INQ_014: Inquiry 565 (trip cost Rs 18,500, Advance Received Rs 0, 2 days 2 hours before start): slab 24 hrs <= T < 3 days, Penalty 20% + one day charge Rs 9,500 -> Penalty retained Rs 13,200; reason optional (confirmed with empty reason) - slab and optional reason OK. But Refund amount Rs 5,300 and Cancellation Invoice INV-74 (refund Rs 5,300) are generated for an inquiry with nothing paid; refund should be based on the amount paid (Rs 0). BUG-OUT-014 still reproducible. | TC_INQ_012: Inquiry 566 (trip cost Rs 18,500, Advance Received Rs 0, 6 days 2 hours before start): slab 3 days <= T < 7 days, Penalty 10%, Add one day charge No, Penalty retained Rs 1,850, Refund amount Rs 16,650; after Confirm Cancellation (reason entered) Booking Cancelled (Inquiry #566) with Cancellation Invoice INV-75 refunding Rs 16,650. Expected refund Rs 0 / no refund invoice for an unpaid inquiry. BUG-OUT-014 still reproducible.

## Evidence
- `android/evidence/android-20261006-1252-OUTSTATION/TC_INQ_014_1_refund-5300-on-unpaid.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_INQ_014_2_cancelled-INV-74-refund-5300.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_INQ_012_1_refund-16650-on-unpaid.png`
- `android/evidence/android-20261006-1252-OUTSTATION/TC_INQ_012_2_cancelled-INV-75-refund-16650.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in an earlier run (Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.). Retested in android-20261006-1252-OUTSTATION.
