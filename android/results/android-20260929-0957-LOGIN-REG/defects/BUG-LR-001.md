# BUG-LR-001 — Sign-up Full Name accepts numbers-only and symbols-only names

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_REG_007 |
| Module | Registration - Create Your Account |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260929-0957-LOGIN-REG |
| Test account | Not required |
| Reproducibility | Always (2 of 2 inputs) |

## Preconditions
Fresh install, onboarding skipped, logged out. Welcome > Create Account > One Time User > Continue.

## Steps to reproduce
1. Tap Full Name and enter '12345'
2. Leave Mobile Number invalid (e.g. 9 digits) so no OTP can be sent
3. Tap Continue and observe the Full Name field
4. Repeat with '@#$' (entered via the device's on-screen symbol keys)

## Expected result
A name validation error is shown (e.g. 'Please enter a valid name'); only letters, spaces and common name characters are accepted.

## Actual result
No error is shown for '12345' or '@#$' - only the mobile error appears. The name is treated as valid (confirms Session 01 observation OBS-06).

## Evidence
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_REG_007_1_numeric-name.png`
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_REG_007_2_special-name.png`

## Error / API / log information
Client-side validation only; no API call is made because Continue stays on the form while the mobile is invalid. No Logcat error.

## Notes / suspected area
Suspected area: Full Name validator on Create Your Account checks only required + min length (2).
