# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_021, TC_INQ_022 |
| Module | INQ |
| Severity (proposed) | Critical |
| Priority (proposed) | High |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | Always (2/2 in this run) |

## Preconditions
-

## Steps to reproduce
1. Submit a Multi inquiry (no payment)
2. Cancel Trip > Confirm Cancellation

## Expected result
Refund Rs 0 and no refund invoice when nothing was paid

## Actual result
672: refund Rs 19,300, INV-81; 685: refund Rs 11,000, INV-82 - Advance Received Rs 0 in both

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_021_2_cancelled-672-INV-81.png`
- `android/evidence/android-20261008-1504-MULTI/TC_INQ_022_2_cancelled-685-INV-82-refund-unpaid.png`

## Error / API / log information
-

## Notes / suspected area
-
