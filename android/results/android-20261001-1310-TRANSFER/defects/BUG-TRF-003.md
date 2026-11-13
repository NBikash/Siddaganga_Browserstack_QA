# BUG-TRF-003 — Transfer slab inconsistent: summary '< 30 KM' and list Rs 6,500 (short) but Confirm charges Long Transfer Rs 8,000

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Trip Summary / Confirm |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | Uploaded APK app-release.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261001-1310-TRANSFER |
| Test account | Not required |
| Reproducibility | Always (1/1) |

## Preconditions
-

## Steps to reproduce
1. Transfer P2P Majestic -> Kempegowda International Airport
2. Read Distance on Trip Summary
3. Filters > Sedan: read Starts From
4. Open Sedan > Book Now: read Estimated Grand Total

## Expected result
One slab applied consistently; distance reflects the real route (~35+ km -> long transfer)

## Actual result
Summary '< 30 KM'; list Rs 6,500; details footer Rs 4,000 (Local); Confirm/inquiry Rs 8,000 (Long Transfer)

## Evidence
- `android/evidence/android-20261001-1310-TRANSFER/TC_TRIP_012_1_p2p-summary-no-time.png`
- `android/evidence/android-20261001-1310-TRANSFER/TC_CONF_013_1_p2p-confirm-8000.png`

## Error / API / log information
-

## Notes / suspected area
-
