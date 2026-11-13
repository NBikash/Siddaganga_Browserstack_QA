# BUG-OUT-011 — Outstation Inquiry Details shows 'Expected arrival: 06:30 am' without the return date

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_INQ_011 |
| Module | Inquiry Details |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | Open - still reproducible |
| Build | Uploaded APK app-release_1stOct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-0743-LOCAL-OUT-REG |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Open Outstation Inquiry 520 (4-7 Oct, pickup 10:30 am, drop 07-10 06:30 am)
2. Read Schedule

## Expected result
Return/drop date and time stated (07 Oct, 06:30 am)

## Actual result
Reproduced on app-release_1stOct26.apk via TC_INQ_011. Original: 'Expected arrival: 06:30 am' only - appears earlier than the 10:30 am pickup

## Evidence
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_INQ_011_1_inq534-no-return.png`
- `android/evidence/android-20261002-0743-LOCAL-OUT-REG/TC_BOOK_005_2_outstation-card-1200km.png`

## Error / API / log information
-

## Notes / suspected area
Originally logged in android-20261001-1122-OUTSTATION. Retest status on new build: Open - still reproducible.
