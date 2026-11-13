# BUG-INQ-01 — Lead card 'Email' sends lead details to the customer immediately with no preview or confirmation

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_014 |
| Module | Inquiry & Sales / Leads |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Observed once (1/1) - deliberately not repeated to avoid further customer emails |

## Preconditions
Logged in as Superadmin; Operations > Inquiry & Sales > Sales tab > Leads segment; lead LD-178 (Dayanidhi, ₹27,200) with an email address

## Steps to reproduce
1. Open Operations > Inquiry & Sales; stay on the Sales tab
2. Tap the 'Leads' segment and wait for 'Loading leads...' to finish
3. Tap 'Search leads...' and type '178' to show lead LD-178
4. On the LD-178 card tap 'Email' once
5. Verify what appears on screen

## Expected result
A mail composer / in-app preview opens with the lead details, or a confirmation dialog ('Send lead details to <customer>?') appears; nothing is sent until the user confirms

## Actual result
Native alert 'Siddaganga Travels - Lead details sent to customer successfully!' with only OK; the email was already sent (no preview, no confirmation)

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_014_5_email_sent_without_confirmation.png`

## Error / API / log information
Reproduced once (11:12 IST) - not repeated to avoid further customer emails

## Notes / suspected area
-
