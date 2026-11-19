# Admin Web – Interim Test Scenarios (4 fully explored modules)

**Status:** interim – for review. Covers only **Authentication, Global Navigation & Header, Dashboard, Lead Management**.
No scenario has been executed. Source: read-only exploration of DEV (`https://dari-dev.siddagangatravels.com`) as Superadmin, 2026-10-30.

**Status rule:** *Documented* = expected result observed during exploration · *Needs Verification* = depends on a submission, an unclicked control or an unconfirmed business rule · *Blocked* = not executable with current access.
Scenarios whose preconditions say *Explicit approval obtained* write data or send communications in DEV.

## Summary

| Module | Scenarios | Documented | Needs Verification | Blocked |
|---|---|---|---|---|
| Authentication | 21 | 5 | 16 | 0 |
| Global Navigation & Header | 14 | 4 | 9 | 1 |
| Dashboard | 29 | 11 | 18 | 0 |
| Lead Management | 32 | 8 | 24 | 0 |
| **Total** | **96** | **28** | **67** | **1** |

## Exploration status of all modules (not covered here unless fully explored)

| Module | Total views | Inspected | Pending | Status | Notes |
|---|---|---|---|---|---|
| Authentication | 3 | 3 | 0 | Fully explored (read-only limits) | Steps after 'Send OTP' not opened (would send email). |
| Global Navigation & Header | 2 | 2 | 0 | Fully explored (read-only limits) | Logout not clicked; Profile page renders empty. |
| Dashboard | 1 | 1 | 0 | Fully explored | All tables and both Add dialogs read. |
| Lead Management | 1 | 1 | 0 | Fully explored | List, Add New Lead, row menu and Lead Details read. |
| Role & Permission | 3 | 3 | 0 | Partially explored | '+ Add User' / '+ Add New Role' not detected; Access dialogs showed 0 fields. |
| Employee Management | 6 | 6 | 0 | Partially explored | Add Employee / Add Request clicks timed out on 2 panels; Client Request row menu empty; Employee Onboarding panel not distinct. |
| Fleet & Vehicle Management | 9 | 8 | 1 | Partially explored | 'Approved & Track Live Trips' view not reached (redo). |
| Booking & Operations | 4 | 3 | 1 | Partially explored | Pre-Bookings pending; Booked/Completed panel switch not confirmed. |
| Inquiry Management | 1 | 0 | 1 | Not explored (first-level only) |  |
| Client Management | 13 | 8 | 5 | Partially explored | 5 views pending; Manage Invoice Signatures / Manage Client Category gaps. |
| Vendor Management | 6 | 0 | 6 | Not explored (first-level only) |  |
| Category Management | 3 | 1 | 2 | Partially explored | Sub Category, Manage Unit Type pending. |
| Service & Maintenance | 11 | 0 | 11 | Not explored (first-level only) |  |
| Financial Management | 12 | 0 | 12 | Not explored (first-level only) |  |
| Inventory Management | 5 | 0 | 5 | Not explored (first-level only) |  |
| Content Management System | 12 | 0 | 12 | Not explored (first-level only) |  |
| Payment And Refund Management | 3 | 0 | 3 | Not explored (first-level only) |  |
| **Total** | **95** | **36** | **59** | 4 fully / 6 partially / 7 not explored | |

## Authentication

| ID | Feature | Scenario | Type | Priority | Status |
|---|---|---|---|---|---|
| [ADMIN-AUTH-001](#admin-auth-001) | Route protection | Redirect to Login when opening a protected URL without a session | Navigation | High | Documented |
| [ADMIN-AUTH-002](#admin-auth-002) | Login – layout | Verify Login page layout and controls | UI | Medium | Documented |
| [ADMIN-AUTH-003](#admin-auth-003) | Login – valid | Log in with valid username/email and password | Positive | High | Documented |
| [ADMIN-AUTH-004](#admin-auth-004) | Login – deep link | Return to the originally requested page after login | Navigation | Low | Needs Verification |
| [ADMIN-AUTH-005](#admin-auth-005) | Login – invalid | Login with a wrong password | Negative | High | Needs Verification |
| [ADMIN-AUTH-006](#admin-auth-006) | Login – invalid | Login with an unregistered username/email | Negative | High | Needs Verification |
| [ADMIN-AUTH-007](#admin-auth-007) | Login – mandatory | Login with empty fields | Negative | High | Needs Verification |
| [ADMIN-AUTH-008](#admin-auth-008) | Login – username format | Username field accepts plain usernames despite email input type | Boundary | Medium | Needs Verification |
| [ADMIN-AUTH-009](#admin-auth-009) | Login – password visibility | Toggle password visibility | UI | Low | Needs Verification |
| [ADMIN-AUTH-010](#admin-auth-010) | Login – input normalisation | Leading/trailing spaces and case in username | Boundary | Low | Needs Verification |
| [ADMIN-AUTH-011](#admin-auth-011) | Login – lockout | Repeated failed logins | Negative | Medium | Needs Verification |
| [ADMIN-AUTH-012](#admin-auth-012) | Session | Session persists across browser refresh and new tab | Positive | Medium | Documented |
| [ADMIN-AUTH-013](#admin-auth-013) | Session | Session expiry redirects to Login | Negative | Medium | Needs Verification |
| [ADMIN-AUTH-014](#admin-auth-014) | Forgot password – open | Open Forgot Password from Login | Navigation | Medium | Documented |
| [ADMIN-AUTH-015](#admin-auth-015) | Forgot password – back | Return to Login from Forgot Password | Navigation | Low | Needs Verification |
| [ADMIN-AUTH-016](#admin-auth-016) | Forgot password – send OTP | Request a password-reset OTP for a registered account | Positive | High | Needs Verification |
| [ADMIN-AUTH-017](#admin-auth-017) | Forgot password – validation | Forgot Password with empty / unregistered / malformed input | Negative | Medium | Needs Verification |
| [ADMIN-AUTH-018](#admin-auth-018) | Forgot password – OTP/reset | Reset password with invalid/expired OTP and weak password | Negative | Medium | Needs Verification |
| [ADMIN-AUTH-019](#admin-auth-019) | OTP login – toggle | Switch to 'Log in with OTP' and back | Navigation | Medium | Needs Verification |
| [ADMIN-AUTH-020](#admin-auth-020) | OTP login | Log in with a valid email OTP | Positive | High | Needs Verification |
| [ADMIN-AUTH-021](#admin-auth-021) | OTP login – validation | OTP login with wrong, expired or reused OTP | Negative | Medium | Needs Verification |

### ADMIN-AUTH-001

**Redirect to Login when opening a protected URL without a session**

- **Module / Feature:** Authentication / Route protection
- **Type:** Navigation · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open a private/incognito browser window.
2. Navigate to https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients.

**Expected results**

- The browser ends on `/login` (page title 'Login | Siddaganga').
- The 'Welcome Back' / 'Login to your Account' form is displayed.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

### ADMIN-AUTH-002

**Verify Login page layout and controls**

- **Module / Feature:** Authentication / Login – layout
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open https://dari-dev.siddagangatravels.com/login in a private window.

**Expected results**

- Branding images (coach, Siddaganga logo) are shown.
- Heading 'Welcome Back' and text 'Login to your Account'.
- Field 'Username / Email Address' with placeholder 'Enter your username or email address'.
- Field 'Password' with placeholder 'Enter your password' and an eye icon button.
- Link 'Forgot Password?', button 'Login', link 'Log in with OTP'.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

### ADMIN-AUTH-003

**Log in with valid username/email and password**

- **Module / Feature:** Authentication / Login – valid
- **Type:** Positive · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test data:** QA account (secure)

**Test steps**

1. Open /login in a private window.
2. Enter the QA account username/email.
3. Enter the QA account password.
4. Click 'Login'.

**Expected results**

- The user is navigated to `/dashboard` (observed landing page).
- Header shows 'Dashboard' and the avatar labelled with the user's role (e.g. 'Superadmin').
- Sidebar sections OVERVIEW, PEOPLE & ACCESS, FLEET & TRIPS, PARTNERS, OPERATIONS are visible.

**Evidence:** `screenshots/dashboard/01-landing.png`
**Related:** ADMIN-AUTH-001

### ADMIN-AUTH-004

**Return to the originally requested page after login**

- **Module / Feature:** Authentication / Login – deep link
- **Type:** Navigation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Observed landing on /dashboard

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. In a private window open /dashboard/client-management/contracted-clients (redirects to /login).
2. Log in with valid credentials.

**Expected results**

- Observed: after login the app landed on `/dashboard`, not the originally requested Contracted Clients URL.
- Confirm whether redirect-back to the requested page is expected (open question).


### ADMIN-AUTH-005

**Login with a wrong password**

- **Module / Feature:** Authentication / Login – invalid
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. Open /login.
2. Enter a valid username/email.
3. Enter an incorrect password.
4. Click 'Login'.

**Expected results**

- The user stays on /login.
- An error message is displayed (exact text – Needs Verification).
- The password field is not echoed in the message.


### ADMIN-AUTH-006

**Login with an unregistered username/email**

- **Module / Feature:** Authentication / Login – invalid
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /login.
2. Enter 'qa.unknown.user@example.com'.
3. Enter any password.
4. Click 'Login'.

**Expected results**

- Login fails with a generic error; the message does not state whether the user exists (Needs Verification).


### ADMIN-AUTH-007

**Login with empty fields**

- **Module / Feature:** Authentication / Login – mandatory
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – no required markers shown

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /login.
2. Leave both fields empty and click 'Login'.
3. Fill only the username and click 'Login'.
4. Clear username, fill only the password and click 'Login'.

**Expected results**

- Each attempt is blocked; a required-field message appears for the empty field(s).
- No request results in navigation to /dashboard.


### ADMIN-AUTH-008

**Username field accepts plain usernames despite email input type**

- **Module / Feature:** Authentication / Login – username format
- **Type:** Boundary · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed input type=email

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. Open /login.
2. Enter a username without '@' (e.g. the QA username).
3. Enter the password and click 'Login'.

**Expected results**

- Observed: the field is an `<input type=email>` labelled 'Username / Email Address'.
- Expected: a plain username is accepted (no browser 'include an @' tooltip blocks submission). Confirm actual behaviour.


### ADMIN-AUTH-009

**Toggle password visibility**

- **Module / Feature:** Authentication / Login – password visibility
- **Type:** UI · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Eye icon observed; toggling not exercised

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /login.
2. Type any text in 'Password'.
3. Click the eye icon.
4. Click it again.

**Expected results**

- First click shows the text in clear; second click masks it again.
- The typed value is unchanged.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

### ADMIN-AUTH-010

**Leading/trailing spaces and case in username**

- **Module / Feature:** Authentication / Login – input normalisation
- **Type:** Boundary · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. Open /login.
2. Enter the QA username/email with a leading and trailing space, then in UPPER CASE.
3. Enter the correct password and click 'Login'.

**Expected results**

- Spaces are trimmed and email matching is case-insensitive, or a clear error is shown (rule – Needs Verification).


### ADMIN-AUTH-011

**Repeated failed logins**

- **Module / Feature:** Authentication / Login – lockout
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A dedicated lockout test account (never the shared QA account).

**Test steps**

1. Open /login.
2. Attempt login with a wrong password 5–10 times for a dedicated test account.

**Expected results**

- After N failures the account is locked or throttled, or a CAPTCHA appears (policy – Needs Verification).
- A locked account cannot log in even with the correct password until unlocked.


### ADMIN-AUTH-012

**Session persists across browser refresh and new tab**

- **Module / Feature:** Authentication / Session
- **Type:** Positive · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. Log in.
2. Refresh the browser.
3. Open /dashboard/inquiry-management/total-inquiries in a new tab of the same browser.

**Expected results**

- The user remains logged in on refresh and in the new tab (observed: session reused across tabs during exploration).


### ADMIN-AUTH-013

**Session expiry redirects to Login**

- **Module / Feature:** Authentication / Session
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test steps**

1. Log in.
2. Leave the app idle beyond the session timeout (or clear site cookies/local storage).
3. Click any sidebar link.

**Expected results**

- The user is redirected to /login; no data is shown and no unhandled error appears.
- Session timeout duration – Needs Verification.


### ADMIN-AUTH-014

**Open Forgot Password from Login**

- **Module / Feature:** Authentication / Forgot password – open
- **Type:** Navigation · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /login.
2. Click 'Forgot Password?'.

**Expected results**

- URL becomes `/forgot-password`, page title 'Forgot-Password | Siddaganga'.
- Heading 'Forgot Password', text 'Reset Your Password'.
- Field 'Username / Email Address' (placeholder 'Enter your username or email address'), button 'Send OTP', link 'Go to Login'.

**Evidence:** `screenshots/login/03-forgot-password.png`

### ADMIN-AUTH-015

**Return to Login from Forgot Password**

- **Module / Feature:** Authentication / Forgot password – back
- **Type:** Navigation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Link target observed (href /login); not clicked

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /forgot-password.
2. Click 'Go to Login'.

**Expected results**

- The login page (/login) is shown.

**Evidence:** `screenshots/login/03-forgot-password.png`

### ADMIN-AUTH-016

**Request a password-reset OTP for a registered account**

- **Module / Feature:** Authentication / Forgot password – send OTP
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Control observed; not executed

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV. (sends an email)

**Test steps**

1. Open /forgot-password.
2. Enter the QA account username/email.
3. Click 'Send OTP'.

**Expected results**

- A success message is shown and an OTP entry (and new password) step appears (Needs Verification – not executed).
- An OTP email is delivered to the account's address.

**Evidence:** `screenshots/login/03-forgot-password.png`

### ADMIN-AUTH-017

**Forgot Password with empty / unregistered / malformed input**

- **Module / Feature:** Authentication / Forgot password – validation
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /forgot-password.
2. Click 'Send OTP' with the field empty.
3. Enter 'abc@' and click 'Send OTP'.
4. Enter an unregistered email and click 'Send OTP'.

**Expected results**

- Empty and malformed inputs are rejected with a validation message.
- Unregistered input shows a generic message without disclosing account existence (Needs Verification).

**Evidence:** `screenshots/login/03-forgot-password.png`

### ADMIN-AUTH-018

**Reset password with invalid/expired OTP and weak password**

- **Module / Feature:** Authentication / Forgot password – OTP/reset
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred – OTP step not observed

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A dedicated test account whose password may be reset.
- Explicit approval obtained – this step writes data / triggers communication in DEV.

**Test steps**

1. Complete 'Send OTP' for a test account.
2. Enter a wrong OTP and submit.
3. Request again, wait beyond OTP validity and submit the old OTP.
4. Enter the valid OTP with a weak password (e.g. '123').

**Expected results**

- Wrong/expired OTPs are rejected.
- Weak passwords are rejected per policy (policy – Needs Verification).
- A valid OTP + compliant password resets the password and allows login with it.


### ADMIN-AUTH-019

**Switch to 'Log in with OTP' and back**

- **Module / Feature:** Authentication / OTP login – toggle
- **Type:** Navigation · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** OTP view observed; return link not clicked

**Preconditions**

- No active Admin Web session (use a private/incognito window).

**Test steps**

1. Open /login.
2. Click 'Log in with OTP'.
3. Click 'Log in With Email & Password'.

**Expected results**

- OTP mode shows only 'Username / Email Address', button 'Send OTP', hint 'We'll Send a OTP to Your Email Address', link 'Log in With Email & Password' (URL stays /login).
- Clicking the link returns to the password form.

**Evidence:** `screenshots/login/04-login-with-otp.png`

### ADMIN-AUTH-020

**Log in with a valid email OTP**

- **Module / Feature:** Authentication / OTP login
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Control observed; not executed

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV. (sends an email)

**Test steps**

1. Open /login and click 'Log in with OTP'.
2. Enter the QA account email.
3. Click 'Send OTP'.
4. Enter the OTP received by email and submit.

**Expected results**

- An OTP input step appears after 'Send OTP' (Needs Verification – not executed).
- With a correct OTP the user lands on /dashboard.

**Evidence:** `screenshots/login/04-login-with-otp.png`

### ADMIN-AUTH-021

**OTP login with wrong, expired or reused OTP**

- **Module / Feature:** Authentication / OTP login – validation
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV.

**Test steps**

1. Request an OTP.
2. Enter an incorrect OTP.
3. Enter the correct OTP after its expiry.
4. Reuse an OTP that was already used.
5. Use 'Resend OTP' if offered.

**Expected results**

- Incorrect, expired and reused OTPs are rejected with a clear message.
- Resend issues a new OTP and invalidates the old one (Needs Verification).


## Global Navigation & Header

| ID | Feature | Scenario | Type | Priority | Status |
|---|---|---|---|---|---|
| [ADMIN-NAV-001](#admin-nav-001) | Logout | Log out from the profile menu | Positive | High | Needs Verification |
| [ADMIN-NAV-002](#admin-nav-002) | Sidebar inventory | Sidebar shows all sections and modules for Superadmin | UI | High | Documented |
| [ADMIN-NAV-003](#admin-nav-003) | Sidebar groups | Expand and collapse sidebar groups | Navigation | High | Needs Verification |
| [ADMIN-NAV-004](#admin-nav-004) | Sidebar active state | Active menu item is highlighted | UI | Low | Needs Verification |
| [ADMIN-NAV-005](#admin-nav-005) | Sidebar collapse | Hide and restore the sidebar | UI | Low | Needs Verification |
| [ADMIN-NAV-006](#admin-nav-006) | Header title | Header title follows the current screen | UI | Low | Documented |
| [ADMIN-NAV-007](#admin-nav-007) | Browser history | Browser Back/Forward between modules | Navigation | Medium | Needs Verification |
| [ADMIN-NAV-008](#admin-nav-008) | Invalid route | Unknown route inside the dashboard | Negative | Low | Needs Verification |
| [ADMIN-NAV-009](#admin-nav-009) | Role-based access | Sidebar adapts to role permissions | Negative | High | Blocked |
| [ADMIN-NAV-010](#admin-nav-010) | Notifications | Open notifications from the bell icon | UI | Medium | Documented |
| [ADMIN-NAV-011](#admin-nav-011) | Notifications | Notifications are marked read after viewing | Functional | Medium | Needs Verification |
| [ADMIN-NAV-012](#admin-nav-012) | Notifications | Open an inquiry from its notification | Functional | Medium | Needs Verification |
| [ADMIN-NAV-013](#admin-nav-013) | Profile menu | Open the profile menu | UI | Medium | Documented |
| [ADMIN-NAV-014](#admin-nav-014) | Profile page | Open the Profile page | UI | Medium | Needs Verification |

### ADMIN-NAV-001

**Log out from the profile menu**

- **Module / Feature:** Global Navigation & Header / Logout
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Menu item observed; not clicked

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval to log out (ends the shared exploration session).

**Test steps**

1. Log in.
2. Click the avatar in the header.
3. Click 'Logout' (and confirm if prompted).
4. Press the browser Back button.
5. Open /dashboard directly.

**Expected results**

- The user is returned to /login.
- Back and direct URL access do not show protected pages; the user is redirected to /login.

**Evidence:** `screenshots/dashboard/04-profile-menu.png`

### ADMIN-NAV-002

**Sidebar shows all sections and modules for Superadmin**

- **Module / Feature:** Global Navigation & Header / Sidebar inventory
- **Type:** UI · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Log in as Superadmin.
2. Review the left sidebar from top to bottom (scroll the sidebar if needed).

**Expected results**

- Sections and items: OVERVIEW (Dashboard); PEOPLE & ACCESS (Role & Permission, Employee Management); FLEET & TRIPS (Fleet & Vehicle Management ›, Booking & Operations, Inquiry Management, Lead Management); PARTNERS (Client Management ›, Vendor Management ›, Category Management ›); OPERATIONS (Service & Maintenance ›, Financial Management, Inventory Management, Content Management System ›, Payment And Refund Management).

**Evidence:** `screenshots/dashboard/01-landing.png`, `screenshots/dashboard/02-sidebar-expanded.png`

### ADMIN-NAV-003

**Expand and collapse sidebar groups**

- **Module / Feature:** Global Navigation & Header / Sidebar groups
- **Type:** Navigation · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Expansion observed; collapse not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Fleet & Vehicle Management'.
2. Click it again.
3. Repeat for Client Management, Vendor Management, Category Management, Service & Maintenance, Content Management System.

**Expected results**

- Fleet: Fleet & Vehicles, Bus Types, Bus Manufacturers, Bus Models, Seat Types.
- Client: Client Management, Trip Wise Client, Manage Client, Request Category.
- Vendor: Vendor Management, Manage Request Type, Deactivated Vendors.
- Category: Main Category, Sub Category, Manage Unit Type.
- Service: Service & Maintenance, Manage Service Type.
- CMS: Popular Routes, Popular Service Category, Popular Service Sub Category, Popular Service Route, Popular Service Why Required, Popular Service Required For, WhatsApp FAQ, App Force Update, Marketing Notification, Privacy & Terms.
- A second click collapses the group; the chevron rotates accordingly.

**Evidence:** `screenshots/dashboard/02-sidebar-expanded.png`

### ADMIN-NAV-004

**Active menu item is highlighted**

- **Module / Feature:** Global Navigation & Header / Sidebar active state
- **Type:** UI · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Highlight observed on Main Category only

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Expand 'Category Management' and click 'Main Category'.
2. Click 'Sub Category'.

**Expected results**

- The selected submenu item and its parent group are highlighted (observed on Main Category).
- Highlight moves to Sub Category after the second click.

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`

### ADMIN-NAV-005

**Hide and restore the sidebar**

- **Module / Feature:** Global Navigation & Header / Sidebar collapse
- **Type:** UI · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Observed partially

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click the 'Hide sidebar' button (circle-arrow next to the logo).
2. Click the hamburger (≡) icon in the header.

**Expected results**

- The sidebar collapses/hides, giving the content full width.
- The sidebar is restored by the toggle. Behaviour of hamburger vs collapse button – Needs Verification.

**Evidence:** `screenshots/dashboard/05-sidebar-hidden.png`, `screenshots/dashboard/06-sidebar-restored.png`

### ADMIN-NAV-006

**Header title follows the current screen**

- **Module / Feature:** Global Navigation & Header / Header title
- **Type:** UI · **Priority:** Low · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click Dashboard, Role & Permission, Booking & Operations and Main Category in turn.

**Expected results**

- Header title shows 'Dashboard', 'Roles & Permission', 'Booking & Operations', 'Main Category' respectively.
- Note: some screens keep a generic title (e.g. Trip Wise Client shows 'Client Management'; Popular Routes shows 'Content Management System').


### ADMIN-NAV-007

**Browser Back/Forward between modules**

- **Module / Feature:** Global Navigation & Header / Browser history
- **Type:** Navigation · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Open Dashboard → Inquiry Management → Lead Management via the sidebar.
2. Click browser Back twice, then Forward once.

**Expected results**

- Back shows Inquiry Management then Dashboard; Forward returns to Inquiry Management; each screen re-renders correctly.


### ADMIN-NAV-008

**Unknown route inside the dashboard**

- **Module / Feature:** Global Navigation & Header / Invalid route
- **Type:** Negative · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. While logged in, open https://dari-dev.siddagangatravels.com/dashboard/does-not-exist.

**Expected results**

- A 404 / not-found page or a redirect to /dashboard is shown; no blank page or crash (Needs Verification).


### ADMIN-NAV-009

**Sidebar adapts to role permissions**

- **Module / Feature:** Global Navigation & Header / Role-based access
- **Type:** Negative · **Priority:** High · **Status:** Blocked
- **Observation basis:** Only Superadmin available

**Preconditions**

- An Admin/limited-role test account exists (not available during exploration).

**Test steps**

1. Log in with an Admin (non-Superadmin) test account.
2. Review the sidebar.
3. Open a URL of a module not shown in the sidebar.

**Expected results**

- Only modules granted in Role & Permission are listed.
- Direct URLs to unpermitted modules are blocked (redirect or 'access denied').

**Related:** Role & Permission

### ADMIN-NAV-010

**Open notifications from the bell icon**

- **Module / Feature:** Global Navigation & Header / Notifications
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Log in.
2. Click the bell icon in the header.

**Expected results**

- A 'Notifications' panel opens with an unread count (e.g. '5 New') and items titled 'New Inquiry Alert' with text 'New inquiry <Inquiry ID> from <customer> has been received. Please check it in the total inquiries list.' and a date-time.
- When there are none, the panel shows 'No Notifications'.

**Evidence:** `screenshots/dashboard/03-notifications.png`

### ADMIN-NAV-011

**Notifications are marked read after viewing**

- **Module / Feature:** Global Navigation & Header / Notifications
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed once

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Ensure there are unread notifications (badge visible).
2. Click the bell, close the panel.
3. Click the bell again.

**Expected results**

- Observed during exploration: after first viewing, the panel showed 'No Notifications' – viewing appears to clear/mark them read.
- Confirm intended behaviour: should read items remain listed (marked read) rather than disappear?

**Related:** Inquiry Management

### ADMIN-NAV-012

**Open an inquiry from its notification**

- **Module / Feature:** Global Navigation & Header / Notifications
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred from notification text

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Create or wait for a new inquiry (e.g. from the Banni app).
2. Click the bell.
3. Click the 'New Inquiry Alert' item.

**Expected results**

- The user is taken to Inquiry Management (total inquiries list) with the referenced Inquiry ID visible / highlighted (Needs Verification).

**Related:** Inquiry Management, Banni app

### ADMIN-NAV-013

**Open the profile menu**

- **Module / Feature:** Global Navigation & Header / Profile menu
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click the avatar image in the header.

**Expected results**

- A menu opens with the role label 'Superadmin', 'Profile' and 'Logout'.

**Evidence:** `screenshots/dashboard/04-profile-menu.png`

### ADMIN-NAV-014

**Open the Profile page**

- **Module / Feature:** Global Navigation & Header / Profile page
- **Type:** UI · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed empty page

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click the avatar.
2. Click 'Profile'.

**Expected results**

- URL is /dashboard/profile and the logged-in user's profile details are displayed.
- Observed: the content area is empty and the header title remains 'Dashboard' – possible defect / incomplete screen.

**Evidence:** `screenshots/dashboard/07-profile-page.png`

## Dashboard

| ID | Feature | Scenario | Type | Priority | Status |
|---|---|---|---|---|---|
| [ADMIN-DASH-001](#admin-dash-001) | Screen load | Dashboard is the landing page after login | Navigation | High | Documented |
| [ADMIN-DASH-002](#admin-dash-002) | Screen load | Open Dashboard from the sidebar and by direct URL | Navigation | Medium | Needs Verification |
| [ADMIN-DASH-003](#admin-dash-003) | Summary cards | Summary cards layout | UI | Medium | Documented |
| [ADMIN-DASH-004](#admin-dash-004) | Summary cards | Summary card values reflect operational data | Functional | Medium | Needs Verification |
| [ADMIN-DASH-005](#admin-dash-005) | Summary cards | Summary cards are informational (click behaviour) | UI | Low | Needs Verification |
| [ADMIN-DASH-006](#admin-dash-006) | All Bus overview | All Bus overview table layout | UI | Medium | Documented |
| [ADMIN-DASH-007](#admin-dash-007) | All Bus overview | All Bus overview shows distinct, real fleet records | Functional | High | Needs Verification |
| [ADMIN-DASH-008](#admin-dash-008) | All Bus overview | Availability button on a bus row | Functional | Medium | Needs Verification |
| [ADMIN-DASH-009](#admin-dash-009) | Booking chart | Booking chart layout | UI | Low | Documented |
| [ADMIN-DASH-010](#admin-dash-010) | Booking chart | Booking chart data and legend label correctness | Functional | Medium | Needs Verification |
| [ADMIN-DASH-011](#admin-dash-011) | Driver Emergency Alerts | Driver Emergency Alerts table layout and empty state | UI | Medium | Documented |
| [ADMIN-DASH-012](#admin-dash-012) | Driver Emergency Alerts | Rows-per-page selector on Driver Emergency Alerts | UI | Low | Documented |
| [ADMIN-DASH-013](#admin-dash-013) | Driver Emergency Alerts | Pagination of Driver Emergency Alerts with more than one page | Boundary | Low | Needs Verification |
| [ADMIN-DASH-014](#admin-dash-014) | Add Alert | Open the Add Driver Emergency Alert dialog | UI | High | Documented |
| [ADMIN-DASH-015](#admin-dash-015) | Add Alert | Trip and Vehicle dropdowns in Add Alert | Functional | High | Needs Verification |
| [ADMIN-DASH-016](#admin-dash-016) | Add Alert | Cancel the Add Alert dialog | UI | Medium | Documented |
| [ADMIN-DASH-017](#admin-dash-017) | Add Alert | Create a driver emergency alert with valid data | Positive | High | Needs Verification |
| [ADMIN-DASH-018](#admin-dash-018) | Add Alert | Add Alert with empty fields | Negative | High | Needs Verification |
| [ADMIN-DASH-019](#admin-dash-019) | Add Alert | Time field format in Add Alert | Validation | Medium | Needs Verification |
| [ADMIN-DASH-020](#admin-dash-020) | Add Alert | Text field limits in Add Alert | Boundary | Low | Needs Verification |
| [ADMIN-DASH-021](#admin-dash-021) | Driver Emergency Alerts | Alert status lifecycle Unresolved → In Progress → Resolved | Functional | Medium | Needs Verification |
| [ADMIN-DASH-022](#admin-dash-022) | Refuel Requests | Refuel Requests table layout before selecting a trip | UI | Medium | Documented |
| [ADMIN-DASH-023](#admin-dash-023) | Refuel Requests | Select Trip filter for Refuel Requests | Functional | High | Needs Verification |
| [ADMIN-DASH-024](#admin-dash-024) | Add Refuel Request | Open the Add Refuel Request dialog | UI | High | Documented |
| [ADMIN-DASH-025](#admin-dash-025) | Add Refuel Request | Cancel the Add Refuel Request dialog | UI | Medium | Documented |
| [ADMIN-DASH-026](#admin-dash-026) | Add Refuel Request | Create a refuel request with valid data | Positive | High | Needs Verification |
| [ADMIN-DASH-027](#admin-dash-027) | Add Refuel Request | Amount field validation | Boundary | Medium | Needs Verification |
| [ADMIN-DASH-028](#admin-dash-028) | Add Refuel Request | Status field is pre-filled 'Pending' | Validation | Low | Needs Verification |
| [ADMIN-DASH-029](#admin-dash-029) | Add Refuel Request | Add Refuel Request with empty fields | Negative | High | Needs Verification |

### ADMIN-DASH-001

**Dashboard is the landing page after login**

- **Module / Feature:** Dashboard / Screen load
- **Type:** Navigation · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- A valid QA account (credentials supplied securely).

**Test steps**

1. Log in to Admin Web with a valid QA account.
2. Observe the first screen shown.

**Expected results**

- URL is `/dashboard`; header title 'Dashboard'.
- Widgets shown top to bottom: 4 summary cards, 'All Bus overview' table, 'Booking' chart, 'Driver Emergency Alerts' table, 'Refuel Requests' table.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-002

**Open Dashboard from the sidebar and by direct URL**

- **Module / Feature:** Dashboard / Screen load
- **Type:** Navigation · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Sidebar and direct-URL loads observed; refresh not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Open any other module.
2. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
3. Enter `https://dari-dev.siddagangatravels.com/dashboard` in the address bar and press Enter.
4. Press F5.

**Expected results**

- Each action shows the Dashboard with all widgets and no redirect to /login while the session is valid.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-003

**Summary cards layout**

- **Module / Feature:** Dashboard / Summary cards
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Inspect the four cards at the top.

**Expected results**

- Cards (each with icon, subtitle 'Last week' and a numeric value): 'On Route Vehicle', 'Vehicles Under Maintenance', 'Compliance', 'Late Vehicle'.
- Observed values at exploration time: 40, 28, 18, 28 (values change with data).

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-004

**Summary card values reflect operational data**

- **Module / Feature:** Dashboard / Summary cards
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Card labels observed; definitions unknown

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Note each card value.
3. Compare with the source data: live trips (Booking & Operations / Fleet), vehicles under maintenance (Service & Maintenance), compliance items, late vehicles.

**Expected results**

- Each value equals the count for the 'Last week' period from its source module.
- Card definitions, period boundaries and source modules are not documented – Needs Verification (see Open Questions A5).

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-005

**Summary cards are informational (click behaviour)**

- **Module / Feature:** Dashboard / Summary cards
- **Type:** UI · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click each summary card.

**Expected results**

- Expected: either no action, or navigation to the related list. Behaviour not exercised during exploration – Needs Verification.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-006

**All Bus overview table layout**

- **Module / Feature:** Dashboard / All Bus overview
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Inspect the 'All Bus overview' table.

**Expected results**

- Columns: SR NO. | BUS NUMBER | BUS TYPE | REGISTERED DATE | VIEW DETAIL.
- Each row has an 'Availability' button in VIEW DETAIL.
- 5 rows are shown; the table has no search, filter or pagination controls.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-007

**All Bus overview shows distinct, real fleet records**

- **Module / Feature:** Dashboard / All Bus overview
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Observed identical rows

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Compare the 5 rows with Fleet & Vehicle Management › Total Buses / Active.

**Expected results**

- Each row is a distinct registered bus with its own number, type and registration date; SR NO. runs 1–5.
- Observed: all 5 rows are identical (SR NO. 1, 'KA 11AA 1234', 'Volvo 9600', '21 Feb, 2025') – possible placeholder data (Open Questions A3).

**Evidence:** `screenshots/dashboard/01-landing.png`
**Related:** Fleet & Vehicle Management

### ADMIN-DASH-008

**Availability button on a bus row**

- **Module / Feature:** Dashboard / All Bus overview
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed no visible response

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Availability' on the first row of All Bus overview.

**Expected results**

- Expected: the bus availability (calendar/details) is displayed.
- Observed: no dialog, drawer, navigation or visible change occurred (Open Questions A4).

**Evidence:** `screenshots/dashboard/dashboard-row-availability.png`

### ADMIN-DASH-009

**Booking chart layout**

- **Module / Feature:** Dashboard / Booking chart
- **Type:** UI · **Priority:** Low · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Inspect the 'Booking' card.

**Expected results**

- Title 'Booking' and text 'Total Number of Bookings 23.8k'.
- Combined bar + line chart; X axis '1 Jan' … '7 Jan'; Y axis 10%–50%; a tooltip label (e.g. '180 Booking') on a data point.
- Legend items: 'Earring' and 'Booking'.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-010

**Booking chart data and legend label correctness**

- **Module / Feature:** Dashboard / Booking chart
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed values; behaviour not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Compare 'Total Number of Bookings' with Booking & Operations › Total Bookings.
3. Hover over each bar/point.
4. Click each legend item.

**Expected results**

- The total matches Booking & Operations (observed there: 238 vs '23.8k' here – mismatch to be confirmed).
- Tooltips show the value for the hovered date; legend clicks toggle series (Needs Verification).
- Legend 'Earring' is expected to read 'Earning' (possible typo, Open Questions A5).

**Evidence:** `screenshots/dashboard/01-landing.png`
**Related:** Booking & Operations

### ADMIN-DASH-011

**Driver Emergency Alerts table layout and empty state**

- **Module / Feature:** Dashboard / Driver Emergency Alerts
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Scroll to 'Driver Emergency Alerts'.

**Expected results**

- Button 'Add Alert' at the top right.
- Columns: TRIP | VEHICLE NO. | DRIVER NAME | FLEET MANAGER | ALERT TYPE | TIME | LOCATION | STATUS | ACTION.
- With no alerts: body 'No data available', footer 'Showing 0 to 0 of 0 entries', rows-per-page '10', pagination buttons (first/previous/next/last) disabled and page '1'.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-012

**Rows-per-page selector on Driver Emergency Alerts**

- **Module / Feature:** Dashboard / Driver Emergency Alerts
- **Type:** UI · **Priority:** Low · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Open the rows-per-page dropdown under Driver Emergency Alerts.
3. Select each value.

**Expected results**

- Options: 05, 10, 15, 20; default 10.
- With data, the table shows at most the selected number of rows (Needs Verification – table was empty).

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-013

**Pagination of Driver Emergency Alerts with more than one page**

- **Module / Feature:** Dashboard / Driver Emergency Alerts
- **Type:** Boundary · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Controls observed disabled with 0 entries

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- More than 10 alerts exist.

**Test steps**

1. Ensure more alerts exist than the rows-per-page value.
2. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
3. Use next / last / previous / first page buttons.

**Expected results**

- Pages change and 'Showing x to y of N' updates; first/previous disabled on page 1, next/last disabled on the last page.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-014

**Open the Add Driver Emergency Alert dialog**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** UI · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.

**Expected results**

- Dialog 'Add Driver Emergency Alert' opens with fields: Trip (dropdown), Vehicle (dropdown), Fleet Manager (dropdown), Alert Type (text), Time (text), Location (text), Status (dropdown, default 'Unresolved'), Description (multi-line).
- Status options: 'Unresolved', 'In Progress', 'Resolved'. Fleet Manager lists 3 names (not recorded).
- Buttons: 'Cancel', 'Add Alert'. No mandatory-field markers (*) are shown.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-015

**Trip and Vehicle dropdowns in Add Alert**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Observed empty lists

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Open 'Trip'.
4. Open 'Vehicle' before and after selecting a trip.

**Expected results**

- Observed: both Trip and Vehicle lists were empty when opened.
- Expected: Trip lists active/live trips and Vehicle lists the vehicle(s) of the selected trip – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`
**Related:** Booking & Operations, Fleet

### ADMIN-DASH-016

**Cancel the Add Alert dialog**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Type text in 'Location'.
4. Click 'Cancel'.

**Expected results**

- The dialog closes and no alert is added (table still 'No data available').
- Re-opening shows empty fields with Status 'Unresolved' (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-017

**Create a driver emergency alert with valid data**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.
- At least one trip with a vehicle exists.

**Test data:** Alert Type 'QA-TEST breakdown'; Time per field format; Location 'QA-TEST location'

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Select Trip, Vehicle and Fleet Manager.
4. Enter Alert Type, Time, Location and Description.
5. Keep Status 'Unresolved'.
6. Click 'Add Alert'.

**Expected results**

- Dialog closes; a success message appears; the alert is listed with the entered values and STATUS 'Unresolved'.
- 'Showing 1 to 1 of 1 entries'.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-018

**Add Alert with empty fields**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Click 'Add Alert' in the dialog without filling anything.

**Expected results**

- The alert is not created and required fields show validation messages.
- Which fields are mandatory is not indicated in the UI – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-019

**Time field format in Add Alert**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** Validation · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Field type observed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Click 'Time'.
4. Try typing '25:61', 'abc', and a valid time.

**Expected results**

- Observed: 'Time' is a plain text input (a picker may open on click – not observed).
- Invalid times are rejected; the accepted format must be confirmed – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-020

**Text field limits in Add Alert**

- **Module / Feature:** Dashboard / Add Alert
- **Type:** Boundary · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Alert'.
3. Enter 1 character, 255 characters and only spaces into Alert Type, Location and Description in turn.

**Expected results**

- Limits and whitespace handling are enforced with a message; no maxlength attribute was observed – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-021

**Alert status lifecycle Unresolved → In Progress → Resolved**

- **Module / Feature:** Dashboard / Driver Emergency Alerts
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Status options observed in Add dialog

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Ensure a QA-TEST alert exists.
2. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
3. Use the ACTION column of the alert to change Status to 'In Progress', then 'Resolved'.

**Expected results**

- STATUS updates in the table at each step.
- The ACTION column controls were not observed (table empty) – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

### ADMIN-DASH-022

**Refuel Requests table layout before selecting a trip**

- **Module / Feature:** Dashboard / Refuel Requests
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Scroll to 'Refuel Requests'.

**Expected results**

- Button 'Add Refuel Request' and a 'Select Trip' dropdown.
- Columns: TRIP | VEHICLE NO. | DRIVER NAME | REPORTED BY | REPORTED TIME | DESCRIPTION | AMOUNT | STATUS.
- Body 'Please select a trip'; footer 'Showing 0 to 0 of 0 entries'; rows-per-page default 10 (options 05, 10, 15, 20); pagination disabled.

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-023

**Select Trip filter for Refuel Requests**

- **Module / Feature:** Dashboard / Refuel Requests
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Observed empty list

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Open 'Select Trip' above the Refuel Requests table.
3. Select a trip.

**Expected results**

- Observed: the list contained only the placeholder 'Select Trip' (no trips).
- Expected: trips are listed and selecting one shows that trip's refuel requests – Needs Verification (Open Questions A6).

**Evidence:** `screenshots/dashboard/01-landing.png`

### ADMIN-DASH-024

**Open the Add Refuel Request dialog**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** UI · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.

**Expected results**

- Dialog 'Add Refuel Request' with fields: Trip (dropdown), Vehicle (dropdown), Reported By (text), Reported Time (text), Amount (number), Status (text, pre-filled 'Pending'), Description (multi-line).
- Trip and Vehicle lists were empty when opened.
- Buttons: 'Cancel', 'Add Refuel Request'. No mandatory markers shown.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

### ADMIN-DASH-025

**Cancel the Add Refuel Request dialog**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.
3. Enter an Amount.
4. Click 'Cancel'.

**Expected results**

- The dialog closes and no request is added.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

### ADMIN-DASH-026

**Create a refuel request with valid data**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.
- At least one trip with a vehicle exists.

**Test data:** Amount 1500; Description 'QA-TEST refuel'

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.
3. Select Trip and Vehicle; enter Reported By, Reported Time, Amount and Description.
4. Click 'Add Refuel Request'.

**Expected results**

- A success message appears; after selecting the trip in 'Select Trip' the request is listed with the entered values and STATUS 'Pending'.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

### ADMIN-DASH-027

**Amount field validation**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** Boundary · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Field type observed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.
3. Enter in Amount: 0, -100, 10.5, 99999999, 'e', 'abc'.

**Expected results**

- Observed: Amount is a numeric input (letters other than 'e' cannot be typed).
- Negative and zero amounts are rejected; decimal and maximum rules – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

### ADMIN-DASH-028

**Status field is pre-filled 'Pending'**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** Validation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Observed pre-filled value

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.
3. Try to change the 'Status' text.

**Expected results**

- Observed: Status shows 'Pending' in an editable-looking text input.
- Expected: Status is system-controlled (read-only) for new requests – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

### ADMIN-DASH-029

**Add Refuel Request with empty fields**

- **Module / Feature:** Dashboard / Add Refuel Request
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Dashboard' under OVERVIEW in the left sidebar (or log in – Dashboard is the landing page).
2. Click 'Add Refuel Request'.
3. Click 'Add Refuel Request' in the dialog without filling anything.

**Expected results**

- The request is not created; validation messages appear for required fields (mandatory set – Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

## Lead Management

| ID | Feature | Scenario | Type | Priority | Status |
|---|---|---|---|---|---|
| [ADMIN-LEAD-001](#admin-lead-001) | Screen load | Open Lead Management from the sidebar | Navigation | High | Documented |
| [ADMIN-LEAD-002](#admin-lead-002) | Screen load | Open Lead Management by direct URL and refresh | Navigation | Low | Needs Verification |
| [ADMIN-LEAD-003](#admin-lead-003) | Screen load | Lead Management URL without a session | Negative | Medium | Needs Verification |
| [ADMIN-LEAD-004](#admin-lead-004) | Search | Search leads by Lead ID | Positive | High | Needs Verification |
| [ADMIN-LEAD-005](#admin-lead-005) | Search | Search leads by client name (partial, case-insensitive) | Positive | Medium | Needs Verification |
| [ADMIN-LEAD-006](#admin-lead-006) | Search | Search with no matching lead | Negative | Medium | Needs Verification |
| [ADMIN-LEAD-007](#admin-lead-007) | Search | Search with special characters and surrounding spaces | Validation | Low | Needs Verification |
| [ADMIN-LEAD-008](#admin-lead-008) | Filter | Status filter options | UI | Medium | Documented |
| [ADMIN-LEAD-009](#admin-lead-009) | Filter | Filter leads by each status | Positive | High | Needs Verification |
| [ADMIN-LEAD-010](#admin-lead-010) | Filter | Combine search and Status filter, then Reset Filter | Functional | Medium | Needs Verification |
| [ADMIN-LEAD-011](#admin-lead-011) | Pagination | Rows-per-page selector | UI | Low | Documented |
| [ADMIN-LEAD-012](#admin-lead-012) | Pagination | Navigate first / previous / next / last pages | Boundary | Medium | Needs Verification |
| [ADMIN-LEAD-013](#admin-lead-013) | Row actions | Lead row actions menu | UI | Medium | Documented |
| [ADMIN-LEAD-014](#admin-lead-014) | Add Lead | Open the Add New Lead dialog | UI | High | Documented |
| [ADMIN-LEAD-015](#admin-lead-015) | Add Lead | Stage and Status dropdown options in Add New Lead | UI | Medium | Documented |
| [ADMIN-LEAD-016](#admin-lead-016) | Add Lead | Close Add New Lead without saving | UI | Medium | Documented |
| [ADMIN-LEAD-017](#admin-lead-017) | Add Lead | Create a lead with valid data | Positive | High | Needs Verification |
| [ADMIN-LEAD-018](#admin-lead-018) | Add Lead | Create Lead with both required fields empty | Negative | High | Needs Verification |
| [ADMIN-LEAD-019](#admin-lead-019) | Add Lead | Create Lead with only one required field filled | Negative | High | Needs Verification |
| [ADMIN-LEAD-020](#admin-lead-020) | Add Lead | Expected Value numeric boundaries | Boundary | Medium | Needs Verification |
| [ADMIN-LEAD-021](#admin-lead-021) | Add Lead | Client Name length and content limits | Boundary | Medium | Needs Verification |
| [ADMIN-LEAD-022](#admin-lead-022) | Add Lead | Stage/Status combinations on creation | Validation | Low | Needs Verification |
| [ADMIN-LEAD-023](#admin-lead-023) | Add Lead | Duplicate lead for the same client | Validation | Low | Needs Verification |
| [ADMIN-LEAD-024](#admin-lead-024) | Add Lead | Prevent double submission of Create Lead | Negative | Low | Needs Verification |
| [ADMIN-LEAD-025](#admin-lead-025) | View Lead | Open Lead Details from the row menu | UI | High | Documented |
| [ADMIN-LEAD-026](#admin-lead-026) | View Lead | Lead Details match the list row | Functional | Medium | Needs Verification |
| [ADMIN-LEAD-027](#admin-lead-027) | Send To Inquiry | Send a lead to Inquiry | Functional | High | Needs Verification |
| [ADMIN-LEAD-028](#admin-lead-028) | Send To Inquiry | Send the same lead to Inquiry twice | Negative | Medium | Needs Verification |
| [ADMIN-LEAD-029](#admin-lead-029) | Assign | Assign a lead to a user | Functional | High | Needs Verification |
| [ADMIN-LEAD-030](#admin-lead-030) | Delete | Cancel deleting a lead | Negative | High | Needs Verification |
| [ADMIN-LEAD-031](#admin-lead-031) | Delete | Delete a lead | Functional | High | Needs Verification |
| [ADMIN-LEAD-032](#admin-lead-032) | Lead lifecycle | Update a lead's Stage and Status after creation | Functional | Medium | Needs Verification |

### ADMIN-LEAD-001

**Open Lead Management from the sidebar**

- **Module / Feature:** Lead Management / Screen load
- **Type:** Navigation · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.

**Expected results**

- URL `/dashboard/lead-management/total-lead`; header title 'Lead Management'; card heading 'All Leads'.
- Controls: 'Search Lead Info' box, 'Status' dropdown, 'Reset Filter', '+ Add Lead'.
- Columns: SR. NO. | LEAD ID | CLIENT NAME | STAGE | EXPECTED VALUE | CREATED DATE | ASSIGNED TO | STATUS | ACTIONS (⋮ per row).
- Footer: 'Showing 1 to 5 of N entries' (N = 527 at exploration time), rows-per-page '05', pagination.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-002

**Open Lead Management by direct URL and refresh**

- **Module / Feature:** Lead Management / Screen load
- **Type:** Navigation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Direct-URL load observed; refresh not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Enter `https://dari-dev.siddagangatravels.com/dashboard/lead-management/total-lead`.
2. Press F5.

**Expected results**

- The All Leads list loads both times without redirect to /login; filters return to defaults (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-003

**Lead Management URL without a session**

- **Module / Feature:** Lead Management / Screen load
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred from observed redirect on another route

**Preconditions**

- No active session.

**Test steps**

1. Open a private window.
2. Enter the Lead Management URL.

**Expected results**

- Redirect to /login with no lead data shown (observed for another dashboard route; confirm for this route).


### ADMIN-LEAD-004

**Search leads by Lead ID**

- **Module / Feature:** Lead Management / Search
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Search box observed; not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Copy the LEAD ID of the first row.
3. Type it into 'Search Lead Info'.

**Expected results**

- Only the matching lead is listed and the total updates.
- Whether search runs on typing or on Enter – Needs Verification.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-005

**Search leads by client name (partial, case-insensitive)**

- **Module / Feature:** Lead Management / Search
- **Type:** Positive · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Type the first 3 letters of a CLIENT NAME in lower case.

**Expected results**

- All leads whose client name contains the text are listed (partial/case-insensitive matching – Needs Verification).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-006

**Search with no matching lead**

- **Module / Feature:** Lead Management / Search
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Empty-state pattern observed on other tables

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Type 'zzzz-no-match-999' in 'Search Lead Info'.

**Expected results**

- Body shows 'No data available'; footer 'Showing 0 to 0 of 0 entries'; pagination disabled (empty-state pattern observed elsewhere in the app).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-007

**Search with special characters and surrounding spaces**

- **Module / Feature:** Lead Management / Search
- **Type:** Validation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Search `%_'"<>`.
3. Search a valid Lead ID with leading/trailing spaces.

**Expected results**

- No error or crash; special characters return no rows; spaces are trimmed (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-008

**Status filter options**

- **Module / Feature:** Lead Management / Filter
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Open the 'Status' dropdown.

**Expected results**

- Options in order: 'All Status', 'Active', 'Closed', 'Open'.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-009

**Filter leads by each status**

- **Module / Feature:** Lead Management / Filter
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Options observed; filtering not exercised

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Select 'Active' in Status.
3. Repeat for 'Closed' and 'Open'.
4. Select 'All Status'.

**Expected results**

- Each filter lists only leads whose STATUS equals the selection and the total updates; 'All Status' lists all leads.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-010

**Combine search and Status filter, then Reset Filter**

- **Module / Feature:** Lead Management / Filter
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Controls observed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Select Status 'Open'.
3. Type part of a client name in 'Search Lead Info'.
4. Click 'Reset Filter'.

**Expected results**

- The list shows leads matching both criteria.
- 'Reset Filter' clears the search text and returns Status to 'All Status' with the full list (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-011

**Rows-per-page selector**

- **Module / Feature:** Lead Management / Pagination
- **Type:** UI · **Priority:** Low · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Open the rows-per-page dropdown.
3. Select 10, 15, 20, then 05.

**Expected results**

- Options: 05, 10, 15, 20; default 05.
- The table shows that many rows and 'Showing 1 to n of N' updates (Needs Verification for the update).

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-012

**Navigate first / previous / next / last pages**

- **Module / Feature:** Lead Management / Pagination
- **Type:** Boundary · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Controls observed (527 entries)

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click 'Go to next page'.
3. Click 'Go to last page'.
4. Click 'Go to previous page'.
5. Click 'Go to first page'.

**Expected results**

- Each click loads the correct page and updates 'Showing x to y of N'.
- On page 1 first/previous are disabled; on the last page next/last are disabled and the last row number equals N.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-013

**Lead row actions menu**

- **Module / Feature:** Lead Management / Row actions
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click the ⋮ icon in the ACTIONS column of the first lead row.

**Expected results**

- Menu items: 'View Lead', 'Send To Inquiry', 'Assign', 'Delete'.
- Observed: there is no 'Edit' option.
- Esc closes the menu without any change.

**Evidence:** `screenshots/lead-management/lead-management-01-landing.png`

### ADMIN-LEAD-014

**Open the Add New Lead dialog**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** UI · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).

**Expected results**

- Dialog 'Add New Lead' with: Client Name (text, placeholder 'Enter client name', HTML required), Expected Value (number, placeholder 'Enter expected value', HTML required), Stage (dropdown, default 'Prospecting'), Status (dropdown, default 'Active').
- Buttons: close icon, 'Create Lead', 'Cancel'.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-015

**Stage and Status dropdown options in Add New Lead**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Open 'Stage'.
4. Open 'Status'.

**Expected results**

- Stage options: 'Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'.
- Status options: 'Active', 'Open', 'Closed'.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-016

**Close Add New Lead without saving**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** UI · **Priority:** Medium · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Enter 'QA-TEST client' in Client Name.
4. Click 'Cancel'.
5. Re-open and close with the ✕ icon; re-open and press Esc.

**Expected results**

- The dialog closes each time; no lead is added (total unchanged).

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-017

**Create a lead with valid data**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Positive · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test data:** Client Name 'QA-TEST Lead Client'; Expected Value 50000

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Note the total entries.
3. Click '+ Add Lead' (top right of the All Leads card).
4. Enter Client Name 'QA-TEST Lead Client' and Expected Value 50000.
5. Keep Stage 'Prospecting' and Status 'Active'.
6. Click 'Create Lead'.

**Expected results**

- The dialog closes and a success message appears.
- A new row shows a generated LEAD ID, CLIENT NAME 'QA-TEST Lead Client', STAGE 'Prospecting', EXPECTED VALUE 50000 (formatting – Needs Verification), CREATED DATE today, STATUS 'Active'; total increases by 1.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-018

**Create Lead with both required fields empty**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Required attributes observed; not submitted

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Leave Client Name and Expected Value empty.
4. Click 'Create Lead'.

**Expected results**

- The lead is not created; Client Name and Expected Value are flagged (both carry the HTML required attribute). Message text – Needs Verification.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-019

**Create Lead with only one required field filled**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Required attributes observed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Fill only Client Name; click 'Create Lead'.
4. Clear it, fill only Expected Value; click 'Create Lead'.

**Expected results**

- Each attempt is blocked and the empty required field is flagged.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-020

**Expected Value numeric boundaries**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Boundary · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Field type observed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Enter Client Name 'QA-TEST'.
4. Enter Expected Value 0, -1, 0.5, 9999999999 and 'e' in turn and click 'Create Lead' (test data only).

**Expected results**

- Observed: Expected Value is a numeric input.
- Negative values are rejected; acceptance of 0, decimals and the maximum value – Needs Verification.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-021

**Client Name length and content limits**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Boundary · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Enter Client Name with: 1 character; 256 characters; only spaces; `<script>alert(1)</script>`; fill Expected Value 1000.
4. Click 'Create Lead' for each (test data only).

**Expected results**

- Whitespace-only is rejected as empty; overlong input is blocked or rejected; script text is stored/displayed as plain text only.
- No maxlength attribute observed – limits Needs Verification.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-022

**Stage/Status combinations on creation**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Validation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Select Stage 'Closed Lost' and Status 'Active'.
4. Click 'Create Lead' (test data only).

**Expected results**

- Contradictory combinations are prevented or auto-corrected per business rule – no rule visible in the UI (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-023

**Duplicate lead for the same client**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Validation · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Enter the CLIENT NAME of an existing QA-TEST lead and any Expected Value.
4. Click 'Create Lead'.

**Expected results**

- Either a duplicate warning is shown or a second lead is created – rule Needs Verification.

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-024

**Prevent double submission of Create Lead**

- **Module / Feature:** Lead Management / Add Lead
- **Type:** Negative · **Priority:** Low · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click '+ Add Lead' (top right of the All Leads card).
3. Fill valid data.
4. Double-click 'Create Lead' quickly.

**Expected results**

- Exactly one lead is created (button disabled while saving – Needs Verification).

**Evidence:** `screenshots/lead-management/lead-all-add-lead.png`, `screenshots/lead-management/lead-all-add-lead-bottom.png`

### ADMIN-LEAD-025

**Open Lead Details from the row menu**

- **Module / Feature:** Lead Management / View Lead
- **Type:** UI · **Priority:** High · **Status:** Documented
- **Observation basis:** Observed UI

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click the ⋮ icon in the ACTIONS column of the first lead row.
3. Click 'View Lead'.

**Expected results**

- Dialog 'Lead Details' with section 'Lead Information' (Lead ID, Client Name, Expected Value, Stage, Status, Assigned To) and section 'Inquiry Information' (Inquiry PNR).
- Buttons: close icon and 'Send To Inquiry'. Esc closes the dialog (observed).

**Evidence:** `screenshots/lead-management/lead-all-row-menu-view-lead.png`, `screenshots/lead-management/lead-all-row-menu-view-lead-bottom.png`

### ADMIN-LEAD-026

**Lead Details match the list row**

- **Module / Feature:** Lead Management / View Lead
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Dialog observed; values not compared

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Note LEAD ID, CLIENT NAME, STAGE, EXPECTED VALUE, ASSIGNED TO and STATUS of the first row.
3. Click the ⋮ icon in the ACTIONS column of the first lead row.
4. Click 'View Lead'.

**Expected results**

- All values in Lead Information equal the row values; Inquiry PNR is empty for leads not yet sent to inquiry (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-all-row-menu-view-lead.png`, `screenshots/lead-management/lead-all-row-menu-view-lead-bottom.png`

### ADMIN-LEAD-027

**Send a lead to Inquiry**

- **Module / Feature:** Lead Management / Send To Inquiry
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Menu item and button observed; not clicked

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Create a QA-TEST lead.
2. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
3. Open ⋮ on the QA-TEST lead and click 'Send To Inquiry' (or use the button in Lead Details).
4. Confirm if prompted.

**Expected results**

- An inquiry is created for the lead; Lead Details › Inquiry PNR shows its reference; the inquiry appears in Inquiry Management (Needs Verification – not clicked).

**Evidence:** `screenshots/lead-management/lead-all-row-menu-view-lead.png`, `screenshots/lead-management/lead-all-row-menu-view-lead-bottom.png`
**Related:** Inquiry Management (not yet explored)

### ADMIN-LEAD-028

**Send the same lead to Inquiry twice**

- **Module / Feature:** Lead Management / Send To Inquiry
- **Type:** Negative · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Inferred – not executed

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Use a QA-TEST lead already sent to inquiry.
2. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
3. Click 'Send To Inquiry' again.

**Expected results**

- A second inquiry is not created; a message explains the lead was already sent (Needs Verification).

**Evidence:** `screenshots/lead-management/lead-all-row-menu-view-lead.png`, `screenshots/lead-management/lead-all-row-menu-view-lead-bottom.png`

### ADMIN-LEAD-029

**Assign a lead to a user**

- **Module / Feature:** Lead Management / Assign
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Menu item observed; not clicked

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Create a QA-TEST lead.
2. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
3. Open ⋮ on it and click 'Assign'.
4. Select an assignee and confirm.

**Expected results**

- ASSIGNED TO shows the selected user in the list and in Lead Details. The Assign dialog was not opened during exploration – Needs Verification.

**Related:** Employee Management / Role & Permission (assignees)

### ADMIN-LEAD-030

**Cancel deleting a lead**

- **Module / Feature:** Lead Management / Delete
- **Type:** Negative · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Menu item observed; not clicked

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Create a QA-TEST lead.
2. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
3. Open ⋮ on it and click 'Delete'.
4. Cancel the confirmation.

**Expected results**

- A confirmation prompt appears; after cancelling the lead remains (Needs Verification – not clicked).


### ADMIN-LEAD-031

**Delete a lead**

- **Module / Feature:** Lead Management / Delete
- **Type:** Functional · **Priority:** High · **Status:** Needs Verification
- **Observation basis:** Menu item observed; not clicked

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data in DEV. Use 'QA-TEST-' prefixed data and record created IDs.

**Test steps**

1. Create a QA-TEST lead.
2. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
3. Note the total.
4. Open ⋮ on it, click 'Delete' and confirm.

**Expected results**

- Success message; the lead is removed and the total decreases by 1. Behaviour for leads already sent to inquiry – Needs Verification.


### ADMIN-LEAD-032

**Update a lead's Stage and Status after creation**

- **Module / Feature:** Lead Management / Lead lifecycle
- **Type:** Functional · **Priority:** Medium · **Status:** Needs Verification
- **Observation basis:** Observed absence of edit option

**Preconditions**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test steps**

1. Click 'Lead Management' under FLEET & TRIPS in the left sidebar.
2. Click the ⋮ icon in the ACTIONS column of the first lead row.
3. Look for a way to change Stage (Prospecting → Qualification → Proposal → Negotiation → Closed Won/Lost) or Status.

**Expected results**

- Observed: the row menu has no 'Edit' option and Lead Details showed no edit control.
- How stage/status progress is recorded must be confirmed (Open Questions) – Needs Verification.

**Evidence:** `screenshots/lead-management/lead-all-row-menu-view-lead.png`, `screenshots/lead-management/lead-all-row-menu-view-lead-bottom.png`
