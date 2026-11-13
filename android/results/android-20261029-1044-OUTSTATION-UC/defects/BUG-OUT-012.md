# BUG-OUT-012 — Advance payment above the inquiry total is accepted and leaves a Pending payment entry

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP6_05, UC_OS_OP6_08 |
| Module | INQ - Outstation |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - still reproducible |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Inquiry 4605, total Rs 1,60,900, Advance Rs 0

## Steps to reproduce
1. Inquiry Details > Payment amount 200000 > Pay Advance
2. Secure Payment opens - tap back without paying
3. Scroll Inquiry Details

## Expected result
Amount above the total rejected; abandoned payment not recorded

## Actual result
Razorpay test-mode link created for INR 2,00,000.00 (PNR TQXC180085); Payment History shows 'Advance - Razorpay (Online) Rs200000 PENDING'

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP6_05_1_advance-above-total.png`
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP6_08_1_pending-payment-entry.png`

## Error / API / log information
-

## Notes / suspected area
-
