# BUG-INQ-02 — [Re-verified] Lead 'Call' requests CALL_PHONE with an 'SOS calls' rationale, ignores DENY and backgrounds the app when permission is denied

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_014 |
| Module | Inquiry & Sales / Leads |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Re-verified 2026-10-12 (still reproduces). First found in saagane-android-20261009-1630-SUPERADMIN-INQ: Always (2/2) |

## Preconditions
Logged in as Superadmin; phone-call permission never granted to the app; Sales > Leads; lead LD-178

## Steps to reproduce
1. Open Inquiry & Sales > Sales > Leads and search '178'
2. Tap 'Call' on LD-178
3. On 'Allow Saagane by Siddaganga to make and manage phone calls?' tap 'Don't allow'
4. Verify the screen shown (device home screen)
5. Reopen Saagane from the app drawer (state is preserved) and tap 'Call' again
6. Read the in-app 'Phone permission' dialog text and tap 'DENY'
7. Verify that the OS prompt appears again; tap 'Don't allow' and verify the screen

## Expected result
Call opens the phone dialer pre-filled with the customer's number (no permission needed), or after a denial the user stays on the Leads list with a short message; any rationale refers to calling the customer and DENY closes it

## Actual result
OS CALL_PHONE prompt on every attempt; after 'Don't allow' the device home screen is shown (2/2); rationale text 'Allow phone access to place SOS calls.'; DENY still opens the OS prompt

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_014_1_call_permission_prompt_LD-189.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_014_2_app_backgrounded_after_dont_allow.png`

## Error / API / log information
-

## Notes / suspected area
-
