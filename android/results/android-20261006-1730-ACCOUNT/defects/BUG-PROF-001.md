# BUG-PROF-001 — Invalid GSTIN and Legal Name are stored on the profile

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_PROF_013 |
| Module | Personal Information |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-ACCOUNT |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
QA account with GST data saved earlier

## Steps to reproduce
1. Personal Information
2. Tick I need a GST invoice
3. Read stored values

## Expected result
Only a valid 15-character GSTIN (state code matching State) and a name can be saved.

## Actual result
GSTIN s#_&+(, Legal Name 12838838 are stored and shown.

## Evidence
- `android/evidence/android-20261006-1730-ACCOUNT/TC_PROF_013_1_invalid-gstin-stored.png`

## Error / API / log information
-

## Notes / suspected area
Save-side GSTIN validation (TC_PROF_009) not executed - saving not approved; this is evidence that validation was bypassed earlier.
