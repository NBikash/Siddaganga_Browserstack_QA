# BUG-EXPL-002 — Selected brand chip cannot be deselected by tapping it again

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_EXPL_006 |
| Module | Explore |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Explore tab

## Steps to reproduce
1. Tap Force India
2. Tap Force India again

## Expected result
Second tap deselects the brand and restores the full category list.

## Actual result
Brand stays selected; only Reset Filters clears it (also clearing other filters).

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
New in this run.
