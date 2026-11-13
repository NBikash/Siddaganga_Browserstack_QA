# BUG-VLIST-005 — Multi-day Local list price differs from the Confirm estimate and changes with the gap between selected dates (Rs 23,000 / Rs 29,000 vs Rs 22,000)

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_VLIST_015, TC_CONF_002 |
| Module | VLIST |
| Severity (proposed) | High |
| Priority (proposed) | High |
| Status | New |
| Build | Uploaded APK app-release_7Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261008-0835-LOCAL |
| Test account | Not required |
| Reproducibility | Always (2/2 date combinations) |

## Preconditions
Logged in; Local tab; Multi-day trip ON

## Steps to reproduce
1. Local: pickup Majestic, Multi-day ON, dates 16 & 17 Oct 2026, Pickup Time 10:00 am, 4 passengers, 8 hours
2. Search Vehicles > Search Vehicles; note 33 Seater Deluxe Coach 'Starts From'
3. Open the vehicle > Book Now > scroll to Estimated Trip Cost
4. Repeat with dates 10 & 14 Oct 2026

## Expected result
List 'Starts From' equals the estimate (Base Rs 10,000 x 2 days + Day Bata 2 x Rs 1,000 = Rs 22,000) for any 2 selected days

## Actual result
16-17 Oct: list Rs 23,000, estimate Rs 22,000. 10 & 14 Oct: list Rs 29,000, estimate Rs 22,000 (inquiry 584 submitted at Rs 22,000). The list price appears to depend on the date span rather than the selected days, so customers see a different price before and after Book Now.

## Evidence
- `android/evidence/android-20261008-0835-LOCAL/TC_VLIST_015_1_list-23000-16-17oct.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_VLIST_015_2_estimate-22000-16-17oct.png`
- `android/evidence/android-20261008-0835-LOCAL/TC_CONF_002_1_multiday-estimate-22000.png`

## Error / API / log information
-

## Notes / suspected area
The estimate calculation itself is now correct (BUG-CONF-001 calculation fixed); only the list price is inconsistent.
