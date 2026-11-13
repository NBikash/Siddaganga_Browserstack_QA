# BUG-OUT-013 — Pay Advance fails for both gateways with raw API error '"gateway" is not allowed field'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_004 |
| Module | Inquiry Details / Payments |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Not re-verified (deferred by user - payment/offline checks out of scope for this run) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Open any inquiry (e.g. 520)
2. Keep amount 500, select Razorpay (or Cashfree)
3. Tap Pay Advance

## Expected result
Gateway checkout opens; or, if payments are disabled in this build, a friendly 'Online payment is not available yet' message / hidden button

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Razorpay opens a payment link; gateway-not-allowed error gone. | Original: apk via TC_INQ_004, TC_INQ_007. Original: Dialog 'Payment Error - "gateway" is not allowed field' (backend schema validation text) for both gateways; no checkout

## Evidence
-

## Error / API / log information
"gateway" is not allowed field

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Not re-verified (payment gateway not approved this run). No re-test possible in this run.
