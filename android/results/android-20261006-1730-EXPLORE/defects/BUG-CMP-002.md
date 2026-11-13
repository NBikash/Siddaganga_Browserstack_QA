# BUG-CMP-002 — Selecting a third vehicle in compare mode silently replaces the latest selection

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_CMP_003 |
| Module | Compare Vehicles |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Compare mode with 2 vehicles selected

## Steps to reproduce
1. Select two vehicles
2. Tap a third vehicle card

## Expected result
Blocked with a message (max 2) or the oldest selection replaced with feedback.

## Actual result
The most recent selection is dropped without any message; counter stays 2/2.

## Evidence
- `android/evidence/android-20261006-1730-EXPLORE/TC_CMP_003_1_third-replaces-latest-no-message.png`

## Error / API / log information
-

## Notes / suspected area
New in this run.
