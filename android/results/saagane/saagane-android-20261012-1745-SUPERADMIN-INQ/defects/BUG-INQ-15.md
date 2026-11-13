# BUG-INQ-15 — Update Quote creates a new inquiry/quote ID (KOLA740746 → ZZLL751390) instead of revising the quote; old ID disappears and status stays 'Pending Approval'

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| App | Saagane by Siddaganga |
| Platform | Android |
| Test case | TC_INQ_026 |
| Module | Inquiry & Sales / Edit Quote |
| Severity (proposed) | High |
| Priority (proposed) | P1 |
| Status | New (draft) |
| Build | app-release_internal_25thSept26.apk v1.2 (uploaded APK, App Live, uploaded Oct 9) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | saagane-android-20261012-1745-SUPERADMIN-INQ |
| Test account | Superadmin (QA account from .env, entered by user) |
| Reproducibility | 1/1 (Update Quote performed once on a QA quote) |

## Preconditions
Logged in as Superadmin; QA quote KOLA740746 created in this run (Dayanidhi, Outstation, ₹35,000, Pending Approval) listed in Sales > Quotes and Inquiries

## Steps to reproduce
1. Sales > Quotes > card KOLA740746 > ⋮ > Edit Quote
2. Edit Vehicle Cost: Per Km 60, Save
3. Scroll down and tap 'Update Quote'
4. Read the alert and the push notification
5. Inquiries tab: search client 'daya'; Sales > Quotes: search 'daya' and scroll to the November quotes

## Expected result
The same quote KOLA740746 is updated (same Inquiry/PNR ID), its status becomes 'Revised Quotation' and the revision is visible (TC_INQ_026, TC_E2E_002)

## Actual result
Alert 'Data updated successfully !' together with push notification 'New Inquiry Alert - New inquiry ZZLL751390 from Dayanidhi'. KOLA740746 is no longer listed in Inquiries or Quotes; a new card ZZLL751390 (same trip, ₹35,000) shows status 'Pending Approval'. PDF is generated under the new ID (Quotation_Summary_ZZLL751390.pdf)

## Evidence
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_026_1_update_quote_new_inquiry_ZZLL751390_notification.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_026_2_inquiries_KOLA740746_missing_ZZLL751390_listed.png`
- `android/evidence/saagane/saagane-android-20261012-1745-SUPERADMIN-INQ/TC_INQ_026_3_card_ZZLL751390_35000_pending_approval.png`

## Error / API / log information
No error. Quotation ID in PDF: 1432.

## Notes / suspected area
-
