# BUG-NSET-001 — Enable WhatsApp button does nothing

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_NSET_004 |
| Module | Notifications |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Account > Notifications

## Steps to reproduce
1. Tap Enable WhatsApp
2. Wait 10 s
3. Tap again

## Expected result
WhatsApp opt-in / consent flow opens.

## Actual result
No navigation, dialog or message on either tap.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_NSET_004_1_enable-whatsapp-no-action.png`

## Error / API / log information
-

## Notes / suspected area
WhatsApp may not be installed on the BrowserStack device; app should still show a fallback/message.
