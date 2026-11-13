# BUG-INQ-002 — Abandoned Razorpay payment links stay as PENDING entries in Payment History and no cancel/failure feedback is shown

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_007, TC_INQ_005 |
| Module | Inquiry Details / Payment |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
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
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_007_1_back-no-message-pending.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_007_2_pending-history.png`

## Error / API / log information
Each Pay Advance tap creates a new year-long payment link; stale PENDING entries confuse customers and ops; risk of paying an old/over-amount link later.

## Notes / suspected area
New in this build (Payment History section is new).
