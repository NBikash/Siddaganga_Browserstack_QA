# BUG-TRF-011 — Cancelling the return leg silently cancels the outward inquiry too; dialog uses Rs16,500 instead of the Rs33,000 inquiry total

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Create a round-trip Transfer (two inquiries)
2. Open the return inquiry (525) > Cancel Trip > Confirm Cancellation
3. Check My Bookings > Inquired

## Expected result
User is told both legs will be cancelled (or only the selected leg is cancelled); amounts match the inquiry

## Actual result
Only Inquiry 525 mentioned; both legs disappear (13 -> 11); one invoice INV-61 for trip cost Rs16,500

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_INQ_019_1_cancel-525-16500.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_INQ_019_2_both-legs-removed.png`

## Error / API / log information
-

## Notes / suspected area
-
