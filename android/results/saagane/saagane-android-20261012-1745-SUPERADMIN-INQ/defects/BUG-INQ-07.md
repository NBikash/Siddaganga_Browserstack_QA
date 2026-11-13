# BUG-INQ-07 — [Re-verified] Conversion Rate shows 32.4% while the page reports ₹0 and 0 Active Leads

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_003 |
| Module | Inquiry & Sales / Sales Overview |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin |
| Reproducibility | Re-verified 2026-10-12 (still reproduces). First found in saagane-android-20261009-1630-SUPERADMIN-INQ: Always (on load) |

## Preconditions
Logged in as Superadmin; Operations > Inquiry & Sales

## Steps to reproduce
1. Open the drawer > Operations > Inquiry & Sales (Sales tab)
2. Immediately read both KPI cards while 'Loading leads...' is shown
3. Wait until leads load (₹4.4Cr, 172 Active Leads) and read the CONVERSION RATE card again

## Expected result
Conversion rate shows a loader / placeholder until data loads and is derived from the same lead data (changes with the data)

## Actual result
'32.4%' and '+5% vs last month' displayed while the page shows ₹0 / 0 Active Leads; same values after loading and in the earlier session

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_001_1_overview_4.4Cr_179_active.png`

## Error / API / log information
-

## Notes / suspected area
-
