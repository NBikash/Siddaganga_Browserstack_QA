# BUG-LR-005 — Login reveals whether a mobile number is registered ('User not found!')

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOGIN_015 |
| Module | Sign In - Login with Mobile |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260929-0957-LOGIN-REG |
| Test account | Not required |
| Reproducibility | Always (1 of 1) |

## Preconditions
Login with Mobile; a 10-digit number that is not registered.

## Steps to reproduce
1. Enter an unregistered 10-digit mobile (6000000011 was used)
2. Enter any password
3. Tap Sign In

## Expected result
A generic message such as 'Invalid mobile number or password' that does not reveal whether the account exists (no user enumeration).

## Actual result
An alert 'Siddaganga Travels - User not found!' is shown, confirming the number is not registered. Combined with a different message for a wrong password, this lets an attacker enumerate registered customers' phone numbers. The numeric keyboard also remains open behind the alert.

## Evidence
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_LOGIN_015_1_user-not-found.png`

## Error / API / log information
Message originates from the login API response (shown verbatim in a native Alert). Device Logcat (Warning level, com.siddaganga) showed no error around 06:45 UTC. API request/response not capturable from App Live Live sessions (no network log for the device).

## Notes / suspected area
Fix server-side: return one generic error for unknown user and wrong password; add rate limiting (see TC_LOGIN_018, pending).
