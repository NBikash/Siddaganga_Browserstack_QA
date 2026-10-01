# BUG-LR-002 — Sign-up Full Name has no maximum length

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_REG_008 |
| Module | Registration - Create Your Account |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260929-0957-LOGIN-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
On Create Your Account (One Time User).

## Steps to reproduce
1. Tap Full Name
2. Type a 110-character name (e.g. 'ab' followed by the alphabet repeated)
3. Tap Continue with the mobile left invalid

## Expected result
Input is limited to the spec maximum (inventory implies 100; max+1 = 101 rejected) or a length error is shown.

## Actual result
All 110+ characters are accepted, the text scrolls inside the field and no error is shown after Continue. Minimum length works ('a' -> 'Full name must be at least 2 characters').

## Evidence
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_REG_008_1_no-max.png`

## Error / API / log information
Client-side only; no API call. Backend limit unknown - an over-long name may be rejected or truncated server-side at account creation (not reached: OTP step not executed).

## Notes / suspected area
Confirm the intended maximum with product; add maxLength to the TextInput and a matching validation message.
