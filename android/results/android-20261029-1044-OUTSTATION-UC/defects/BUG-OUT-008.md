# BUG-OUT-008 — Outstation fare breakup has no per-km / minimum-km line although the pricing card shows '+ Rs 105/km'; State Tax missing

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP4_04 |
| Module | VDET - Outstation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Vehicle Details from an Outstation search

## Steps to reproduce
1. Vehicle Details > View Fare Breakup > Outstation Trip tab

## Expected result
Per-day base, per-km / minimum km, bata, state tax, toll/GST note

## Actual result
Base Rate 52,500, Day Bata 800, Night Bata 900, Toll & Parking Actuals, GST Additional - no km line, no State Tax (Confirm adds State Tax 1,000)

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP4_04_1_breakup-no-per-km.png`

## Error / API / log information
-

## Notes / suspected area
-
