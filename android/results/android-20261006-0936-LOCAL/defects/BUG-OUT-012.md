# BUG-OUT-012 — Advance payment amount above the inquiry total is not validated

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_005 |
| Module | Inquiry Details |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Open Inquiry 520 (total Rs18,500)
2. Payment amount 20000
3. Pay Advance

## Expected result
Client-side rule: amount must be > 0 and <= total (or <= remaining balance) with a clear message

## Actual result
Retest on app-release_5Oct26.apk (Local run 2026-10-06): Rs 1 and Rs 13,000 (above Rs 12,000 total) accepted and payment links created. | Original: apk via TC_INQ_005. Original: Request is sent; only the backend 'gateway' error appears. Amount 0 is correctly rejected.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_005_2_overpay-13000-link.png`
- `android/evidence/android-20261006-0936-LOCAL/TC_INQ_005_3_one-rupee-link.png`

## Error / API / log information
Dialog: Payment Error - "gateway" is not allowed field

## Notes / suspected area
Carried forward from android-20261002-0743-LOCAL-OUT-REG; retest status on 5Oct26 build: Open - still reproducible.
