# BUG-INQ-001 — Pay Advance with Cashfree fails with raw provider error 'link_creation_api is not enabled or approved'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_004 |
| Module | Inquiry Details / Payment |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Not re-verified (deferred by user - payment/offline checks out of scope for this run) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; unpaid Local inquiry (560) open in Inquiry Details.

## Steps to reproduce
1. Ride > My Bookings > Inquired > View Details (inquiry 560)
2. Payment amount 500
3. Select Payment gateway 'Cashfree'
4. Tap Pay Advance

## Expected result
Cashfree checkout opens (or the Cashfree option is hidden if not available); any error is a friendly, actionable message.

## Actual result
Dialog 'Payment Error - link_creation_api is not enabled or approved. Please reach out to care@cashfree.com.' - raw provider configuration error shown to the customer; payment cannot be made with Cashfree. Razorpay works up to the payment link.

## Evidence
-

## Error / API / log information
Backend Cashfree merchant account lacks Payment Links API approval. Replaces the earlier '"gateway" is not allowed field' error (BUG-OUT-013) for Cashfree.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Not re-verified (payment gateway not approved this run). No re-test possible in this run.
