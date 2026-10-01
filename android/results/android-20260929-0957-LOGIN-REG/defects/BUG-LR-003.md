# BUG-LR-003 — One Time User role description is cut off mid-sentence

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_REG_001 |
| Module | Registration - Role selection |
| Severity (proposed) | Low |
| Priority (proposed) | P4 |
| Status | New (draft) |
| Build | app-release.apk v1.1 (com.siddaganga, uploaded APK) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20260929-0957-LOGIN-REG |
| Test account | Not required |
| Reproducibility | Always (Pixel 7 / Android 13) |

## Preconditions
Welcome > Create Account.

## Steps to reproduce
1. Observe the One Time User card on 'Create Your Role'

## Expected result
The full description is visible (wrapped over more lines or ellipsised at a word boundary with the complete text available).

## Actual result
The text ends abruptly: 'An individual booking vehicles for a single or occasional trip with quick' - the rest of the sentence is clipped.

## Evidence
- `android/evidence/android-20260929-0957-LOGIN-REG/TC_REG_001_1.png`

## Error / API / log information
UI layout only; no errors in Logcat.

## Notes / suspected area
Likely numberOfLines=2 on the description Text. Title wording 'Create Your Role' is tracked separately as OBS-05.
