# BUG-RWD-001 — Rewards shows Trips Done 02 with 0 completed trips; progress bar contradicts 6 trips away

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_RWD_002 |
| Module | Rewards & Loyalty |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Account with 0 completed trips

## Steps to reproduce
1. Account > Rewards & Loyalty
2. Compare with Booking History Completed count

## Expected result
Trips Done equals completed trips; progress bar matches remaining trips.

## Actual result
Trips Done 02 / Collected Points 02 while Completed is 0; bar ~75% filled although 6 trips remain.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_RWD_002_1_trips-done-02.png`
- `android/evidence/android-20261006-1730-ACCOUNT/TC_RWD_002_2_six-trips-away-bar-near-gold.png`

## Error / API / log information
-

## Notes / suspected area
Inventory remark OBS-25.
