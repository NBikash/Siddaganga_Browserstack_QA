# BUG-OUT-008 — Outstation fare breakup has no per-km / minimum-km line although the pricing card shows '+ Rs 55/km'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Vehicle Details > View Fare Breakup
2. Outstation Trip tab

## Expected result
Base rate per day, per-km charge and daily minimum km, bata, toll, GST

## Actual result
Only Base Rate Rs 16,500, two Bata lines Rs 1,000, Toll Actuals, GST Additional; no km component; second bata label describes daytime hours

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_VDET_007_1_outstation-breakup.png`

## Error / API / log information
-

## Notes / suspected area
-
