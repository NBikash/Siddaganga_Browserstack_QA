# BUG-PRIV-001 — No in-app account deletion option

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_PRIV_006 |
| Module | Privacy & Security |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in

## Steps to reproduce
1. Check Account menu, Account Settings and Privacy & Security for delete account

## Expected result
A Delete Account path exists (Google Play account-deletion policy).

## Actual result
Only Logout / Logout From All Devices; no deletion option.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_PRIV_006_1_no-delete-account.png`

## Error / API / log information
-

## Notes / suspected area
Inventory remark OBS-26; store-compliance risk.
