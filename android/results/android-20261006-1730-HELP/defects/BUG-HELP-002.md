# BUG-HELP-002 — Customers can choose the ticket assignee (internal staff roles) and status

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HELP_007 |
| Module | Help & Support |
| Severity (proposed) | Medium |
| Priority (proposed) | P2 |
| Status | Open |
| Build | Uploaded APK app-release_5Oct26.apk v1.1 (com.siddaganga), latest upload as of 2026-10-06 |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-1730-HELP |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
Help > Raise Ticket or Submit Feedback

## Steps to reproduce
1. Open the ticket form
2. Tap Assign To
3. Tap Status

## Expected result
Assignee and status are set by the back office, not editable by the customer.

## Actual result
Assign To lists Super Admin, Admin, Operations, Garage Supervisor, Finance; Status is an editable dropdown.

## Evidence
- `android/evidence/android-20261006-1730-HELP/TC_HELP_007_1_assign-to-internal-roles.png`

## Error / API / log information
-

## Notes / suspected area
Inventory remark OBS-23; exposes internal role names to customers.
