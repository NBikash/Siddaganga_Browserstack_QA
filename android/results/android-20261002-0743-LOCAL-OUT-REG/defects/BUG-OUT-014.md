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
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Reproduced on app-release_1stOct26.apk via TC_INQ_014, TC_INQ_012. Original: Refund amount Rs16,650 (trip cost Rs18,500 minus 10% penalty Rs1,850) and Cancellation Invoice INV-56 issued with Refund Rs16,650; 'One day charge Rs9,500' is unexplained Also reproduced on Local inquiry 533 (slab 6-24 h, trip cost Rs 12,500, advance Rs 0): refund Rs 500 + invoice INV-67; 534/535: refund Rs 5,300 + INV-65/66.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_012_1_refund-calc-531.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_012_2_cancelled-invoice-INV-64.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_NEW_2_inq533-6-24h-slab.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_NEW_2_inq533-cancelled-INV-67.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_012_3_inq535-refund-5300.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
