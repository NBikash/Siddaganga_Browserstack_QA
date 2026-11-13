# BUG-INQ-10 — [Re-verified] Lead LD-34 with a 2202-day trip (start 28/11/2020) and ₹4.07 Cr cost was accepted and makes up 93% of the Sales pipeline KPI

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_067, TC_INQ_002 |
| Module | Inquiry & Sales / Leads (data validation) |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Re-verified 2026-10-12 (still reproduces). First found in saagane-android-20261009-1630-SUPERADMIN-INQ: Always (persisted record) |

## Preconditions
Logged in as Superadmin; Inquiry & Sales > Sales > Leads loaded; lead LD-34 (client 'Amitkumar') exists

## Steps to reproduce
1. Open drawer > OPERATIONS > Inquiry & Sales; note the value KPI (₹4.4Cr, 172 Active Leads)
2. Tap 'Leads' and scroll to lead LD-34 (Amitkumar)
3. Verify the card amount
4. Tap ⋮ > View Lead and scroll to 'Journey 1 - Outstation'
5. Read START DATE, END DATE and TRIP DAYS
6. Scroll to 'Vehicle 1' and read VEHICLE NAME, SEATS and TOTAL COSTING

## Expected result
A trip starting years in the past / lasting thousands of days is rejected or flagged when the inquiry is created; seats match the selected vehicle; the KPI is not dominated by an implausible record

## Actual result
Card ₹4,07,36,000; Start 28/11/2020, End 08/12/2026, Trip Days 2202; '33 Seater Deluxe Coach' with SEATS 35; Total Costing ₹4,07,36,000; the lead is included in the ₹4.4Cr KPI (sum of all 173 listed leads = ₹4,38,26,700)

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_067_1_LD-34_4.07Cr_still_listed.png`

## Error / API / log information
Lead values for all 173 leads: TC_INQ_002_lead_values_LD7-LD180.csv

## Notes / suspected area
Related to Q-INQ-09 (past start dates allowed on New Quote). Data clean-up of LD-34 is a business decision.
