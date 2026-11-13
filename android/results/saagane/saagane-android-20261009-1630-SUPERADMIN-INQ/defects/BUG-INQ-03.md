# BUG-INQ-03 — Lead Details shows Expected Value and Stage as '–' although the lead is worth ₹27,200

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_013 |
| Module | Inquiry & Sales / Lead Details |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, BrowserStack App Live) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261009-1630-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Always |

## Preconditions
Logged in as Superadmin; lead LD-178 exists with two vehicles (Sedan ₹10,600, MPV ₹16,600)

## Steps to reproduce
1. Open Inquiry & Sales > Sales > Leads; search '178'
2. Note the amount on the LD-178 card (₹27,200)
3. Tap ⋮ > View Lead
4. In 'Lead Information' read EXPECTED VALUE and STAGE
5. Scroll to Vehicle 1 and Vehicle 2 and read TOTAL COSTING

## Expected result
EXPECTED VALUE ₹27,200 (= card amount = ₹10,600 + ₹16,600) and a STAGE value (e.g. Prospecting, as shown on the card chip)

## Actual result
EXPECTED VALUE '–' and STAGE '–' (card chip shows 'Prospecting'); vehicle totals ₹10,600 and ₹16,600

## Evidence
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_013_1_lead_details_expected_value_blank.png`
- `android/evidence/saagane/saagane-android-20261009-1630-SUPERADMIN-INQ/TC_INQ_013_2_lead_vehicle_costing_10600_16600.png`

## Error / API / log information
-

## Notes / suspected area
-
