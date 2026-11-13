# BUG-OUT-011 — Outstation Inquiry Details shows 'Expected arrival: 06:30 am' without the return date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Inquiry Details |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Open Outstation Inquiry 520 (4-7 Oct, pickup 10:30 am, drop 07-10 06:30 am)
2. Read Schedule

## Expected result
Return/drop date and time stated (07 Oct, 06:30 am)

## Actual result
'Expected arrival: 06:30 am' only - appears earlier than the 10:30 am pickup

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_INQ_001_1_outstation-inquiry-520.png`

## Error / API / log information
-

## Notes / suspected area
-
