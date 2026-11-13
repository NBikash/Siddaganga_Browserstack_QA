# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund of Rs16,650 and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_012, TC_INQ_014 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
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
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Unpaid Local inquiry 562 cancelled with refund Rs 12,000 (INV-72); 561 refund Rs 100 (INV-73). | Original: apk via TC_INQ_014, TC_INQ_012. Original: Refund amount Rs16,650 (trip cost Rs18,500 minus 10% penalty Rs1,850) and Cancellation Invoice INV-56 issued with Refund Rs16,650; 'One day charge Rs9,500' is unexplained Also reproduced on Local inquiry 533 (slab 6-24 h, trip cost Rs 12,500, advance Rs 0): refund Rs 500 + invoice INV-67; 534/535: refund Rs 5,300 + INV-65/66.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_INQ_022_1_slab-7days-refund-22000-unpaid.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_INQ_012_1_cancelled-585-INV-79-refund-22000.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_INQ_014_2_cancelled-584-INV-80.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_INQ_014_1_slab-24h-3d-refund-8100-unpaid.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Open - still reproducible. Observed in TC_INQ_012, TC_INQ_014: Cancelling unpaid inquiry 585 (Advance Received Rs 0, no payment link ever created): Refund amount Rs 22,000.00 and Cancellation Invoice INV-79 (penalty Rs 0, refund Rs 22,000). Cancelling unpaid 584: refund Rs 8,100, invoice INV-80. Expected refund Rs 0 and no refund invoice when nothing was paid -
