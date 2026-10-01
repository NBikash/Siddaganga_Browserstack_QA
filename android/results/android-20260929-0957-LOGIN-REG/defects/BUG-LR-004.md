# BUG-LR-004 — Login password field shows the password in plain text by default

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_LOGIN_027, TC_LOGIN_016 |
| Module | Sign In - Login with Mobile |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260929-0957-LOGIN-REG |
| Test account | Not required |
| Reproducibility | Always (2 of 2 fresh App Live sessions) |

## Preconditions
Fresh install, onboarding skipped, logged out. Welcome > Sign In > Personal Login > Login with Mobile. Do not touch the eye icon.

## Steps to reproduce
1. Tap the Password field
2. Type any password (a dummy value was used)
3. Observe the field without tapping the eye icon
4. Tap the eye icon once, then observe again

## Expected result
Password characters are masked (••••) by default and shown only after the user taps the eye icon; the keyboard should not offer suggestions for the password field.

## Actual result
The password is displayed in clear text by default ('dummy123') while the eye icon shows the struck-through state. Tapping the eye once masks it; the toggle itself works. Shoulder-surfing / screen-recording exposure of credentials.

## Evidence
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_LOGIN_016_1_password-plain-by-default.png`
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_LOGIN_027_1_plain-by-default-session3.png`
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_LOGIN_016_2_masked-after-toggle.png`

## Error / API / log information
UI state bug; no API involved. Suspected: secureTextEntry initial state inverted (e.g. useState(false) paired with an icon that assumes hidden). Keyboard shows a suggestion strip on the field.

## Notes / suspected area
Check the Email login and Reset/Create Password screens for the same component.
