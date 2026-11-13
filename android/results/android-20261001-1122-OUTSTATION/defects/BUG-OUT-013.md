# BUG-OUT-013 — Pay Advance fails for both gateways with raw API error '"gateway" is not allowed field'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Payments |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (3/3) |

## Preconditions
-

## Steps to reproduce
1. Open any inquiry (e.g. 520)
2. Keep amount 500, select Razorpay (or Cashfree)
3. Tap Pay Advance

## Expected result
Gateway checkout opens; or, if payments are disabled in this build, a friendly 'Online payment is not available yet' message / hidden button

## Actual result
Dialog 'Payment Error - "gateway" is not allowed field' (backend schema validation text) for both gateways; no checkout

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_INQ_005_1_over-total-payment-error.png`

## Error / API / log information
"gateway" is not allowed field

## Notes / suspected area
-
