# BUG-TRF-005 — Cancellation dialog shows 'Add one day charge: Yes' with 'One day charge Rs0.00'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Transfer inquiry with pickup < 24 h away (Inquiry 523)
2. Tap Cancel Trip

## Expected result
Consistent breakdown - either a non-zero one-day charge or 'No'

## Actual result
'One day charge Rs0.00' and 'Add one day charge Yes'; penalty only 20%

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_INQ_016_1_cancel-slab-6-24h.png`

## Error / API / log information
-

## Notes / suspected area
-
