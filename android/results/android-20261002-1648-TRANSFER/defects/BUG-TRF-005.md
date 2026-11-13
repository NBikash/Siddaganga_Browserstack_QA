# BUG-TRF-005 — Cancellation dialog shows 'Add one day charge: Yes' with 'One day charge Rs0.00'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer inquiry with pickup < 24 h away (Inquiry 523)
2. Tap Cancel Trip

## Expected result
Consistent breakdown - either a non-zero one-day charge or 'No'

## Actual result
Retest android-20261002-1648-TRANSFER: Inquiry 549 (6-24 h): Add one day charge Yes with One day charge Rs0.00; By Hour inquiry 550 in the same slab charged Rs9,500 one-day charge - applied inconsistently.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_016_1_refund-on-unpaid-6-24h.png`
- `android/evidence/android-20261002-1648-TRANSFER/TC_INQ_016_3_byhour-550-one-day-charge-9500.png`

## Error / API / log information
-

## Notes / suspected area
Originally reported in an earlier run; re-tested on app-release_1stOct26.apk.
