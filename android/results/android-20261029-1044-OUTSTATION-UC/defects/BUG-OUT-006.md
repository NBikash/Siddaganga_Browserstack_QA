# BUG-OUT-006 — Outstation Ready to Explore shows no pickup time and no return/drop time

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP3_01 |
| Module | TRIP - Outstation |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open - still reproducible on 28thOct build |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always (2/2) |

## Preconditions
Home > Outstation

## Steps to reproduce
1. Pickup Majestic 29-10 09:00 am, destinations Mysuru, Madikeri, drop Mangaluru 29-10 08:00 pm, 4 pax
2. Search Vehicles
3. Read the Ready to Explore card

## Expected result
Pickup time and return/drop date and time shown with the dates

## Actual result
Only 'Dates 29 Oct, 2026' (and '29-31 Oct, 2026' for the multi-day trip); no times

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP3_01_1_summary-no-times.png`

## Error / API / log information
-

## Notes / suspected area
-
