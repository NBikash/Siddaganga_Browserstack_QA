# BUG-OUT-009 — Outstation estimate charges no km for a 290 km trip (per-day only)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | UC_OS_OP4_05 |
| Module | CONF - Outstation |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | Open - rule to confirm |
| Build | app-release_28thOct.apk v1.1 (uploaded APK, App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261029-1044-OUTSTATION-UC |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Outstation 29-31 Oct, 290 KM, 49 Seater (Rs 52,500/day + Rs 105/km)

## Steps to reproduce
1. Book Now > Confirm Your Trip > Estimated Trip Cost

## Expected result
Base x days + km charge per the rate card + applicable bata + state tax

## Actual result
Base 1,57,500 (3 x 52,500) + Day Bata 3 x 800 + State Tax 1,000 = Rs 1,60,900; no km charge

## Evidence
- `android/evidence/android-20261029-1044-OUTSTATION-UC/UC_OS_OP4_05_1_confirm-160900.png`

## Error / API / log information
-

## Notes / suspected area
-
