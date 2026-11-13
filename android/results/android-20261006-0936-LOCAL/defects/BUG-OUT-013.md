# BUG-OUT-013 — Pay Advance fails for both gateways with raw API error '"gateway" is not allowed field'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_004 |
| Module | Inquiry Details / Payments |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Fixed - verified (Razorpay); Cashfree fails differently (BUG-INQ-001) |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
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
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_004_1_razorpay-link-500.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_004_2_cashfree-error.png`

## Error / API / log information
"gateway" is not allowed field

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Fixed - verified (Razorpay); Cashfree fails differently (BUG-INQ-001).
