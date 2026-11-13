# BUG-EXPL-001 — Explore vehicle cards show an unlabelled value 100

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_EXPL_004 |
| Module | Explore |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-EXPLORE |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Explore tab

## Steps to reproduce
1. Open Explore
2. Look under the seater / Starts From row of any card

## Expected result
Every value on the card has a label or icon.

## Actual result
A bare 100 is shown on every card with no label.

## Evidence
- `android/evidence/android-20261006-1730-EXPLORE/TC_EXPL_004_1_unlabelled-100.png`

## Error / API / log information
-

## Notes / suspected area
Inventory remark OBS-19.
