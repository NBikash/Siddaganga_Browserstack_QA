# BUG-INQ-16 — Saved Arrival/Departure times are reset to 12:00 AM and destination text is duplicated when a quote is reopened in Edit Quote

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_069, TC_INQ_025 |
| Module | Inquiry & Sales / Edit Quote |
| Severity (proposed) | Major |
| Priority (proposed) | P2 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | Always (2/2 reopenings of KOLA740746 / ZZLL751390) |

## Preconditions
Logged in as Superadmin; QA quote KOLA740746 generated in this run with Arrival 07:00 AM, Departure 06:00 PM, destination 'Mysore, Karnataka, India'

## Steps to reproduce
1. Sales > Quotes: scroll to card KOLA740746 (Dayanidhi, 21-22 Nov 2026)
2. Tap ⋮ > Edit Quote
3. Scroll to Trip Details and read Arrival Time / Departure Time
4. Scroll to Trip-1 > Journey A: OutStation and read 'Destinations'

## Expected result
Arrival Time 07:00 AM, Departure Time 06:00 PM, Destinations 'Mysore, Karnataka, India'

## Actual result
Arrival Time 12:00 AM, Departure Time 12:00 AM; Destinations 'Mysore, Karnataka, India, Karnataka, India'. If the user taps Update Quote without noticing, the wrong times are saved.

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_5_KOLA740746_edit_times_reset_1200AM.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/NEW_6_KOLA740746_destination_duplicated_state.png`

## Error / API / log information
-

## Notes / suspected area
-
