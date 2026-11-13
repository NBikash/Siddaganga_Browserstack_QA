# BUG-TRF-011 — Cancelling the return leg silently cancels the outward inquiry too; dialog uses Rs16,500 instead of the Rs33,000 inquiry total

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Create a round-trip Transfer (two inquiries)
2. Open the return inquiry (525) > Cancel Trip > Confirm Cancellation
3. Check My Bookings > Inquired

## Expected result
User is told both legs will be cancelled (or only the selected leg is cancelled); amounts match the inquiry

## Actual result
Retest android-20261002-1648-TRANSFER: Cancelling return 551 removed both legs (Inquired 15 -> 13), one invoice INV-70 on Rs8,000; dialog does not say both legs are cancelled.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_019_1_cancel-dialog-551-8000.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_019_2_cancelled-inv70.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_019_3_both-legs-removed-15-to-13.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
