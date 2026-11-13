# BUG-OUT-013 — Pay Advance fails for both gateways with raw API error '"gateway" is not allowed field'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Payments |
| Severity (proposed) | High |
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
1. Open any inquiry (e.g. 520)
2. Keep amount 500, select Razorpay (or Cashfree)
3. Tap Pay Advance

## Expected result
Gateway checkout opens; or, if payments are disabled in this build, a friendly 'Online payment is not available yet' message / hidden button

## Actual result
Retest android-20261002-1648-TRANSFER: Transfer inquiry 549: Razorpay and Cashfree both return Payment Error "gateway" is not allowed field.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_004_1_razorpay-gateway-error.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_004_2_cashfree-gateway-error.png`

## Error / API / log information
"gateway" is not allowed field

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
