# BUG-OUT-014 — Cancelling an unpaid inquiry generates a refund of Rs16,650 and a cancellation invoice

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Critical |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Create an Outstation inquiry (Inquiry 520, total Rs18,500); do not pay any advance (Advance Received Rs0)
2. Inquiry Details > Cancel Trip
3. Review Refund Calculation; Confirm Cancellation

## Expected result
Refund is based on the amount actually paid (Rs0) - no refund and no refund invoice; or penalty only if a policy requires it

## Actual result
Refund amount Rs16,650 (trip cost Rs18,500 minus 10% penalty Rs1,850) and Cancellation Invoice INV-56 issued with Refund Rs16,650; 'One day charge Rs9,500' is unexplained

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_INQ_008_1_cancel-dialog.png`
- `android/evidence/android-20261001-1122-OUTSTATION/TC_INQ_008_2_booking-cancelled-inv56.png`

## Error / API / log information
-

## Notes / suspected area
-
