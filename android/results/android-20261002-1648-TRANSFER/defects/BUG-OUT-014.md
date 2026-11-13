# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund of Rs16,650 and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
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
Retest android-20261002-1648-TRANSFER: Reproduced on Transfer: unpaid inquiries 549 (refund Rs6,400, penalty Rs1,600, INV-68), 550 (refund Rs3,700, INV-69), 551 (refund Rs6,400, INV-70), 552 (refund Rs8,000, INV-71) - refunds/penalties computed on trip cost with Advance Received Rs0.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_016_1_refund-on-unpaid-6-24h.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_016_2_cancelled-inv68.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_022_2_cancelled-inv71.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
