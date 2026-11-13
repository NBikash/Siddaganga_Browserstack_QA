# BUG-MLT-006 — Cancelling one Multi leg silently cancels all legs; dialog amount (Rs12,000) differs from the inquiry total (Rs36,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_021 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2: 3-leg and 2-leg trips) |

## Preconditions
-

## Steps to reproduce
1. Submit a 3-leg Multi inquiry
2. Open one leg (529) > Cancel Trip > Confirm Cancellation
3. Check Inquired count

## Expected result
Scope stated; only intended leg(s) cancelled; amounts consistent

## Actual result
Only 529 mentioned; all three legs removed (14 -> 11); one invoice INV-62 on trip cost Rs12,000

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_021_1_cancel-672-refund-19300.png`
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_021_2_cancelled-672-INV-81.png`
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_021_3_inquired-52-to-49.png`

## Error / API / log information
-

## Notes / suspected area
Re-verification on app-release_7Oct26.apk (run android-20261008-1504-MULTI): Open - still reproducible.
