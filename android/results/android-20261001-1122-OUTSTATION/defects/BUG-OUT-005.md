# BUG-OUT-005 — Outstation Trip Summary 'Distance' shows 1200 KM for a ~145 km Bengaluru-Mysuru route

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary & Vehicle Search |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Home > Outstation
2. Pickup Majestic, Bengaluru; First Destination Mysuru Palace
3. Pickup 04-10-2026 10:30 am, Drop 07-10-2026 06:30 am, 20 pax
4. Search Vehicles

## Expected result
Distance is the computed route distance (~145 km one way / ~290 km return), or clearly labelled as chargeable minimum km

## Actual result
Distance 1200 KM (= 4 days x 300 km); the same value is carried to the inquiry card and Inquiry Details

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_HOME_032_1_summary-distance-1200km.png`

## Error / API / log information
-

## Notes / suspected area
-
