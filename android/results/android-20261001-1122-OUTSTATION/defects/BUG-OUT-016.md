# BUG-OUT-016 — Outstation allows the destination to be the same as the pickup location

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Home - Start Your Journey |
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
2. Pickup Majestic, Bengaluru
3. First Destination Majestic, Bengaluru
4. Valid dates; Search Vehicles

## Expected result
Validation error - destination must differ from pickup

## Actual result
Trip Summary opens for Majestic -> Majestic with Distance 900 KM and a loop route; the trip can be booked

## Evidence
- `android/evidence/android-20261001-1122-OUTSTATION/TC_HOME_051_1_same-pickup-destination-accepted.png`

## Error / API / log information
-

## Notes / suspected area
-
