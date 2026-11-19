# Admin Web – Open Questions, Gaps and Clarifications

Collected during read-only exploration of the DEV Admin Web (2026-10-30, Superadmin). Each item links to the affected
use cases by module/screen. Items marked **Possible defect** were observed behaviour that looks unintended; they have
**not** been raised as defects (exploration only) and need product-owner confirmation.

## A. Observed issues / possible defects

| # | Area | Observation | Evidence | Question / next step |
|---|---|---|---|---|
| A1 | Header › Profile | `/dashboard/profile` renders an empty content area; header title stays "Dashboard". | `screenshots/dashboard/07-profile-page.png` | Is the Profile page implemented? Expected fields (name, email, phone, change password)? |
| A2 | Header › Notifications | After opening the bell list once, re-opening showed "No Notifications" (previously "5 New" inquiry alerts). | `screenshots/dashboard/03-notifications.png` | Should viewed notifications disappear, or remain listed as read? Is there a "View all"/history page? |
| A3 | Dashboard › All Bus overview | All 5 rows show identical data (Sr No. 1, KA 11AA 1234, Volvo 9600, 21 Feb 2025). | `screenshots/dashboard/01-landing.png` | Placeholder/static data? Which source should feed this table? |
| A4 | Dashboard › Availability | Clicking "Availability" on a bus row produced no visible dialog/navigation. | `screenshots/dashboard/dashboard-00-page.png` | What should "Availability" show? |
| A5 | Dashboard › KPI cards / Booking chart | Cards labelled "Last week" (40 / 28 / 18 / 28) and chart "Total Number of Bookings 23.8k" while Booking & Operations shows Total Bookings 238. Chart legend says "Earring" (typo for "Earning"?). | `screenshots/dashboard/01-landing.png` | Are dashboard widgets live data or mock values? Confirm card definitions and the legend label. |
| A6 | Dashboard › Refuel Requests | "Select Trip" dropdown contained only its placeholder; table shows "Please select a trip". | dashboard inspection | Which trips should be listed (active/live only)? |
| A7 | Login | "Username / Email Address" field is `type=email`. | `screenshots/login/02-login-page.png` | Can plain usernames (without "@") log in, or does browser validation block them? |
| A8 | Login | After login from a deep link (Contracted Clients URL) the app lands on `/dashboard`, not the requested page. | exploration log | Is redirect-back to the requested URL expected? |
| A9 | Header titles | Several sub-screens keep a generic header title (Trip Wise Client → "Client Management"; Popular Routes / App Force Update / Privacy & Terms → "Content Management System"; Manage Service Type heading shows "456"). | route scan | Confirm intended titles. |
| A10 | Spelling | "Tarrif Management" card and route `/tarrifs`; sidebar route `bus-modal-page` for Bus Models. | `screenshots/fleet-vehicle/` | Cosmetic – confirm whether to correct ("Tariff"). |
| A11 | Role & Permission | "+ Add User" and "+ Add New Role" did not open a detectable dialog/drawer in automated inspection. | role-permission screenshots | Confirm how users/roles are created (separate page? permissions?). |

## B. Business rules not discoverable from the UI (all affected cases are "Needs Verification")

1. **Mandatory fields:** no form renders required-field markers (*). For every Add/Edit form, which fields are mandatory?
2. **Field limits:** no `maxlength` attributes on most text inputs. Min/max lengths for names, descriptions, codes, addresses?
3. **Formats:** phone (10-digit Indian mobile?), email, PAN, IFSC, Aadhaar, UAN, ESIC, vehicle registration number formats and validation messages.
4. **Duplicates:** are names/codes unique (case-insensitive? trimmed?) for categories, unit types, bus types/models/manufacturers, seat types, request types, service types, clients (mobile/email), vendors, CMS entries?
5. **Delete semantics:** hard vs soft delete; is deletion blocked when a record is referenced (e.g. Main Category with Sub Categories, Manufacturer with Models, Unit Type used as Default UoM)?
6. **Status (Active/Inactive):** are the row status buttons clickable toggles? Do inactive masters disappear from dependent dropdowns?
7. **Search:** which columns are searched; case-insensitive / partial match; trimming.
8. **Sorting:** no sortable column headers were detected – is sorting required anywhere?
9. **Export PDF:** expected file name, columns, whether filters are applied, behaviour on empty lists.
10. **Status workflows:** allowed transitions for service requests (Pending, Under_review, Approved, Rejected, Completed), inquiries (quote/approval), leads (stages), bookings (Pre-Booking → Booked → Live → Completed / Cancelled), PR/PO, vendor profile ("Pending: Pricing, Contract").
11. **Cancellation & refunds:** penalty slab overlap rules, "+1 DAY" and "ALLOW CANCEL" meaning, B2B vs B2C rebate tier application.
12. **Financial figures:** definitions of dashboard KPIs (receivables ageing "43.0d", profitability %), currency/rounding rules.
13. **Notifications/communications:** which actions send SMS/email/WhatsApp/push (booking confirm, quotation, marketing notification, WhatsApp catalog sync)? Needed to plan safe execution.
14. **Session:** session timeout duration, concurrent sessions, lockout policy after failed logins, OTP validity and resend limits, password policy.

## C. Coverage gaps (cannot be closed read-only)

| # | Gap | Reason | Impact |
|---|---|---|---|
| C1 | Roles other than Superadmin | Only the Superadmin account was available. | Role/permission restriction cases are **Blocked** until an Admin/limited test account exists. |
| C2 | Form submission, validation messages, success/error toasts | Exploration forbids submitting forms and negative-input probing. | Validation/positive-submit cases are documented from the form layout; expected messages are **Needs Verification**. |
| C3 | OTP and reset-password second steps | Require sending emails. | Only the request step is documented as observed. |
| C4 | Delete / deactivate confirmations | Not clicked. | Confirmation-dialog text and cascade behaviour unknown. |
| C5 | Configuration screens (App Force Update, Privacy & Terms, Marketing Notification, WhatsApp catalog sync, Payment bulk update) | Not changed – live configuration / external communications. | Documented as approval-required cases. |
| C6 | Logout | Not clicked (would end the shared session). | Logout case documented, Needs Verification. |
| C7 | Downstream effects in Banni / Saagane apps | Out of scope for read-only web exploration. | E2E cases reference mobile verification steps. |

## D. Exploration side effects (for transparency)

- Opening the notification bell appears to have cleared/marked read 5 "New Inquiry Alert" notifications for the Superadmin account (A2). No business record was created, edited or deleted.
