# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_21_17 |
| Module | INQ |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | Open - still reproducible on 28 Oct build |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Submitted inquiry, Advance Received Rs0

## Steps to reproduce
1. Inquiry 4589 > Cancel Trip > Confirm Cancellation

## Expected result
Refund Rs0 and no refund invoice when nothing was paid

## Actual result
Refund amount Rs48,870.00; cancellation invoice INV-213

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_21_17_1_cancelled-4589-INV-213-refund.png`

## Error / API / log information
-

## Notes / suspected area
-
