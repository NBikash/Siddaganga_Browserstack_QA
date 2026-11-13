# BUG-ASET-001 — Change Password fields show passwords in plain text by default

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_ASET_010 |
| Module | Account Settings |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Logged in; Account > Account Settings

## Steps to reproduce
1. Type any value in New Password
2. Type any value in Confirm Password
3. Do not touch the eye icons

## Expected result
Characters are masked until the user taps the eye icon.

## Actual result
Values are shown in clear text; tapping the eye masks them (inverted default).

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_ASET_010_1_passwords-unmasked-by-default.png`

## Error / API / log information
-

## Notes / suspected area
Dummy values used; Update never tapped. Shoulder-surfing / screen-recording risk.
