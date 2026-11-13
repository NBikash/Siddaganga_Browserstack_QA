# BUG-OUT-007 — Outstation price inconsistent across screens: list Rs 73,000, details footer Rs 10,000, confirm/inquiry Rs 18,500

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Vehicle Listing / Vehicle Details |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1122-OUTSTATION |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Outstation search 4-7 Oct, Majestic -> Mysuru
2. Note Starts From on 33 Seater Deluxe Coach card
3. Open the vehicle; read footer and breakup default tab
4. Book Now; read Estimated Grand Total

## Expected result
One consistent outstation estimate across list, details and confirm; details opened from an Outstation search default to the Outstation context

## Actual result
List Rs 73,000; details footer 'Starting From Rs 10,000 / Rs 55/km' (Local) with breakup on Local tab; confirm modal and inquiry Rs 18,500

## Evidence
-

## Error / API / log information
-

## Notes / suspected area
-
