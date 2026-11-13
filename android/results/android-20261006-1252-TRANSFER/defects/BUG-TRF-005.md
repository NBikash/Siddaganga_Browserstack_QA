# BUG-TRF-005 — Cancellation dialog shows 'Add one day charge: Yes' with 'One day charge Rs0.00'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_016 |
| Module | Inquiry Details / Cancellation |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), uploaded 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1252-TRANSFER |
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
Reproduced on app-release_5Oct26.apk: TC_INQ_016: Inquiry 570 (P2P, Rs 8,000, advance Rs 0, 23 hours before pickup): slab 6 hrs <= T < 24 hrs, Penalty 20%, Add one day charge Yes with One day charge Rs 0.00, Penalty retained Rs 1,600, Refund amount Rs 6,400; after Confirm Cancellation: Cancellation Invoice INV-77 refunding Rs 6,400. Slab correct; refund on an unpaid inquiry and Add one day charge Yes / Rs 0.00 inconsistent. BUG-OUT-014, BUG-TRF-005.

## Evidence
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_016_1_refund-6400-on-unpaid.png`
- `android/evidence/android-20261006-1252-TRANSFER/TC_INQ_016_2_cancelled-INV-77.png`

## Error / API / log information
-

## Notes / suspected area
Retested in android-20261006-1252-TRANSFER.
