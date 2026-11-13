# BUG-INQ-002 — Abandoned Razorpay payment links stay as PENDING entries in Payment History and no cancel/failure feedback is shown

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_007, TC_INQ_005 |
| Module | Inquiry Details / Payment |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Not re-verified (deferred by user - payment/offline checks out of scope for this run) |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; unpaid Local inquiry (560).

## Steps to reproduce
1. Inquiry Details > Pay Advance (Razorpay, Rs 500)
2. On 'Secure Payment' (Razorpay link) tap back without paying
3. Repeat with amounts 13000 and 1

## Expected result
User is told the payment was cancelled/not completed; abandoned attempts are marked cancelled/expired or not listed; amounts above the balance are never recorded.

## Actual result
No message after returning; 'Payment History' lists 'Advance - Razorpay (Online)' Rs 500, Rs 13,000 and Rs 1, all 'PENDING' (links valid until Apr 2027). Advance Received stays Rs 0. A pending Rs 13,000 advance exceeds the Rs 12,000 trip total.

## Evidence
-

## Error / API / log information
Each Pay Advance tap creates a new year-long payment link; stale PENDING entries confuse customers and ops; risk of paying an old/over-amount link later.

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-0835-LOCAL): Not re-verified (payment gateway not approved this run). No re-test possible in this run.
