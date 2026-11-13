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
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
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
Reproduced on app-release_1stOct26.apk via TC_INQ_005. Original: Request is sent; only the backend 'gateway' error appears. Amount 0 is correctly rejected.

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_005_1_13579-not-validated.png`

## Error / API / log information
Dialog: Payment Error - "gateway" is not allowed field

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
