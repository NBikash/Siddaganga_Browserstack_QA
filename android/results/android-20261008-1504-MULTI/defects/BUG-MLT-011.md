# BUG-MLT-011 — Multi: 'Cancel' in Edit Leg mode discards the filled open leg draft

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_077 |
| Module | HOME |
| Severity (proposed) | Low |
| Priority (proposed) | Low |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-1504-MULTI |
| Test account | Not required |
| Reproducibility | 1/1 |

## Preconditions
Multi with a committed leg and a filled open leg

## Steps to reproduce
1. Fill the open leg (Transfer P2P Majestic -> KIA, 19-10)
2. Tap Edit on a committed leg chip
3. Tap Cancel

## Expected result
Edit mode closes with no change; open leg draft kept

## Actual result
Open leg resets to defaults (From Majestic, To empty, today's date) - the user's draft is lost.

## Evidence
- `android/evidence/android-20261008-1504-MULTI/TC_HOME_071_2_remaining-leg-is-byhour-not-local.png`

## Error / API / log information
-

## Notes / suspected area
Chip 'Edit' feature is new in this build.
