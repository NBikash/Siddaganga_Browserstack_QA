# BUG-MLT-024 — Local leg longer than the 8-hour package is not charged Extra Hours (only night bata changes)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_MLT_02_06 |
| Module | CONF - Multi pricing |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New - confirm pricing rule |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live, 28 Oct 2026) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261028-1623-MULTI-UC |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
Multi Local leg, 49 Seater MultiAxle Volvo

## Steps to reproduce
1. Leg 1 Local multi-day 5-6 Nov, 12:30 pm, 8 h -> Review booking: Base 37,000, Leg Total 38,600
2. Edit Inquiry > hours 10 > Update Leg > search > select same vehicle > Review booking

## Expected result
Extra Hour charge for hours beyond the 8Hr/80Km base package (rate card 'Extra Hour Rs x/hr'), plus night bata where applicable

## Actual result
Vehicle Base Cost stays 37,000; only Night Bata 2 x 900 added (Leg Total 40,400). 4 h, 8 h and 10 h legs all have base 18,500/day

## Evidence
- `android/evidence/android-20261028-1623-MULTI-UC/UC_MLT_02_06_1_10h-no-extra-hour.png`

## Error / API / log information
-

## Notes / suspected area
-
