# Admin Web – Use Cases

Source of truth for Admin Web manual testing and future automation. Generated from read-only exploration of `https://dari-dev.siddagangatravels.com` (DEV) as **Superadmin** on 2026-10-30 by `scripts/build_docs.py`.
No case has been executed. See the Legend in `Admin_Web_Use_Cases.xlsx` for Status / Observation Basis meanings.

**Total use cases:** 269

## Contents

- [Dashboard](#dashboard) – 31 cases
- [Role & Permission](#role--permission) – 24 cases
- [Employee Management](#employee-management) – 80 cases
- [Fleet & Vehicle Management](#fleet--vehicle-management) – 36 cases
- [Client Management](#client-management) – 11 cases
- [Category Management](#category-management) – 33 cases
- [Authentication](#authentication) – 21 cases
- [Global Navigation & Header](#global-navigation--header) – 14 cases
- [End-to-End Workflows](#end-to-end-workflows) – 19 cases

## Dashboard

### Dashboard

#### ADMIN-DASH-001 – Open the Dashboard screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Dashboard is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Dashboard' (OVERVIEW).
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard`.
- The header title reads 'Dashboard'.
- The list table shows the columns: SR NO., BUS NUMBER, BUS TYPE, REGISTERED DATE, VIEW DETAIL.
- The summary cards shown are: On Route Vehicle, Vehicles Under Maintenance, Compliance, Late Vehicle.

**Dependencies:** Fleet & Vehicle Management, Booking & Operations · **Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-002 – Reload Dashboard via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Dashboard opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-003 – Block Dashboard URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-DASH-004 – Verify Dashboard summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Note the value shown on each summary card: On Route Vehicle, Vehicles Under Maintenance, Compliance, Late Vehicle.
3. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-005 – Verify All Bus overview table columns and row controls on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Inspect the header row and first data row of the All Bus overview table.

**Expected result:**

- Columns appear in this order: SR NO. | BUS NUMBER | BUS TYPE | REGISTERED DATE | VIEW DETAIL.
- Each row offers these controls: Availability.
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-006 – Verify Driver Emergency Alerts table columns and row controls on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Inspect the header row and first data row of the Driver Emergency Alerts table.

**Expected result:**

- Columns appear in this order: TRIP | VEHICLE NO. | DRIVER NAME | FLEET MANAGER | ALERT TYPE | TIME | LOCATION | STATUS | ACTION.

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-007 – Verify Refuel Requests table columns and row controls on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Inspect the header row and first data row of the Refuel Requests table.

**Expected result:**

- Columns appear in this order: TRIP | VEHICLE NO. | DRIVER NAME | REPORTED BY | REPORTED TIME | DESCRIPTION | AMOUNT | STATUS.

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-008 – Empty-state display on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the empty state of a list with no records.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Observe a table that has no records.

**Expected result:**

- The table body shows 'No data available' (observed during exploration).
- The footer reads 'Showing 0 to 0 of 0 entries' and pagination buttons are disabled.

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-009 – Change rows per page on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Open the rows-per-page dropdown in the table footer.
3. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '10').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-010 – 'Select Trip' selector on Dashboard has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Open the 'Select Trip' dropdown.

**Expected result:**

- Observed: the list contained only the placeholder 'Select Trip' during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-011 – 'Availability' control on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Needs Verification | Observed no visible response | Superadmin |

**Objective:** Verify what 'Availability' opens.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Availability'.

**Expected result:**

- Observed during exploration: no dialog, drawer or navigation was detected after clicking 'Availability'.
- Expected: the related form/details panel opens (Needs Verification – may be a defect or a slow-loading panel).

**Evidence:** `screenshots/dashboard/dashboard-00-page.png`

#### ADMIN-DASH-012 – Open 'Add Driver Emergency Alert' form on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add Driver Emergency Alert'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.

**Expected result:**

- A dialog titled 'Add Driver Emergency Alert' opens.
- Fields shown: Trip (combobox); Vehicle (combobox); Fleet Manager (combobox); Alert Type (text); Time (text); Location (text); Status (combobox, default 'Unresolved'); Description (textarea).
- Dropdown options observed: Trip → no options loaded (list empty when opened); Vehicle → no options loaded (list empty when opened); Fleet Manager → 3 option(s) (names/contact data – values not recorded); Status → 'Unresolved', 'In Progress', 'Resolved'.
- Buttons: 'Cancel', 'Add Alert'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-013 – Close 'Add Driver Emergency Alert' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-014 – Create a record via 'Add Driver Emergency Alert' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful create through 'Add Driver Emergency Alert'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Trip: <valid test value>; Vehicle: <valid test value>; Fleet Manager: <valid test value>; Alert Type: <valid test value>; Time: <valid test value>; Location: <valid test value>; Status: <valid test value>; Description: <valid test value>

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Fill every field with valid test data (see Test Data).
4. Click 'Add Alert'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The new record appears in the list and the total increases by 1.
- Values persist after page refresh.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-015 – Mandatory-field validation on 'Add Driver Emergency Alert'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Leave all fields empty / at default.
4. Click 'Add Alert'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Trip, Vehicle, Fleet Manager, Alert Type, Time, Location, Status, Description.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-016 – Submit 'Add Driver Emergency Alert' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Fill only the fields confirmed as mandatory.
4. Click 'Add Alert'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-017 – Text length boundaries on 'Add Driver Emergency Alert'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Alert Type, Time, Location, Description

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
4. Click 'Add Alert' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-018 – Invalid characters / script injection in 'Add Driver Emergency Alert' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
4. Click 'Add Alert' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-019 – Date/time selection rules for 'Time' on 'Add Driver Emergency Alert'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify the picker for 'Time'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Open the picker for 'Time'.
4. Try selecting a past date, today, and a future date; try typing an invalid date.

**Expected result:**

- The picker opens and the chosen value is shown in the field format used by the app.
- Whether past/future dates are allowed and the relation to other date fields (end ≥ start) – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-020 – Dropdown selection behaviour on 'Add Driver Emergency Alert'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Alert'.
3. Open each dropdown in order from top to bottom.
4. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- Dropdowns with no options before earlier selections are made: Trip, Vehicle – they appear to depend on a previous field (Needs Verification).
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-021 – Duplicate 'Alert Type' on 'Add Driver Emergency Alert'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify duplicate records are prevented.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Note the value of an existing record's Alert Type.
3. Click 'Add Alert'.
4. Enter the same Alert Type (also try different letter case and trailing space) with other valid fields.
5. Click 'Add Alert'.

**Expected result:**

- The record is not created; a duplicate error message is shown (rule – Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-alert.png`, `screenshots/dashboard/dashboard-add-alert-bottom.png`

#### ADMIN-DASH-022 – Open 'Add Refuel Request' form on Dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add Refuel Request'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.

**Expected result:**

- A dialog titled 'Add Refuel Request' opens.
- Fields shown: Trip (combobox); Vehicle (combobox); Reported By (text); Reported Time (text); Amount (number); Status (text); Description (textarea).
- Dropdown options observed: Trip → no options loaded (list empty when opened); Vehicle → no options loaded (list empty when opened).
- Buttons: 'Cancel', 'Add Refuel Request'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-023 – Close 'Add Refuel Request' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-024 – Create a record via 'Add Refuel Request' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful create through 'Add Refuel Request'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Trip: <valid test value>; Vehicle: <valid test value>; Reported By: <valid test value>; Reported Time: <valid test value>; Amount: <valid test value>; Status: <valid test value>; Description: <valid test value>

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Fill every field with valid test data (see Test Data).
4. Click 'Add Refuel Request'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The new record appears in the list and the total increases by 1.
- Values persist after page refresh.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-025 – Mandatory-field validation on 'Add Refuel Request'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Leave all fields empty / at default.
4. Click 'Add Refuel Request'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Trip, Vehicle, Reported By, Reported Time, Amount, Status, Description.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-026 – Submit 'Add Refuel Request' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Fill only the fields confirmed as mandatory.
4. Click 'Add Refuel Request'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-027 – Text length boundaries on 'Add Refuel Request'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Reported By, Reported Time, Status, Description

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
4. Click 'Add Refuel Request' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-028 – Invalid characters / script injection in 'Add Refuel Request' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
4. Click 'Add Refuel Request' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-029 – Numeric boundaries for 'Amount' on 'Add Refuel Request'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify 'Amount' accepts only valid numeric values.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Enter in 'Amount' each of: 0, -1, 1, 1.5, a very large value (e.g. 9999999999), letters 'abc'.
4. Click 'Add Refuel Request' after each (test record only).

**Expected result:**

- Letters cannot be typed or are rejected.
- Negative values are rejected.
- Whether 0 and decimals are allowed, and the maximum value – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-030 – Date/time selection rules for 'Reported Time' on 'Add Refuel Request'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify the picker for 'Reported Time'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Open the picker for 'Reported Time'.
4. Try selecting a past date, today, and a future date; try typing an invalid date.

**Expected result:**

- The picker opens and the chosen value is shown in the field format used by the app.
- Whether past/future dates are allowed and the relation to other date fields (end ≥ start) – Needs Verification.

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

#### ADMIN-DASH-031 – Dropdown selection behaviour on 'Add Refuel Request'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Dashboard' (OVERVIEW).
2. Click 'Add Refuel Request'.
3. Open each dropdown in order from top to bottom.
4. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- Dropdowns with no options before earlier selections are made: Trip, Vehicle – they appear to depend on a previous field (Needs Verification).
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/dashboard/dashboard-add-refuel-request.png`, `screenshots/dashboard/dashboard-add-refuel-request-bottom.png`

## Role & Permission

### User Management › User Management (All Users)

#### ADMIN-ROLE-001 – Open the User Management (All Users) screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that User Management (All Users) is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Role & Permission'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/user-management`.
- The header title reads 'Roles & Permission'.

**Dependencies:** Employee Management · **Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-002 – Reload User Management (All Users) via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/user-management` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- User Management (All Users) opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-003 – Block User Management (All Users) URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/user-management`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-ROLE-004 – Search User Management (All Users) using 'Search User or Role' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Copy a value from the first row (e.g. the name/ID column).
3. Type it into the 'Search User or Role' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-005 – Search User Management (All Users) with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Enter '  %_<>'"  ' in 'Search User or Role'.
3. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-006 – Clear search on User Management (All Users) restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Search for any value in 'Search User or Role'.
3. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-007 – Filter User Management (All Users) by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Open the 'Without label' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'All', 'Active', 'Inactive'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-008 – '+ Add User' control on User Management (All Users)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Needs Verification | Observed no visible response | Superadmin |

**Objective:** Verify what '+ Add User' opens.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Click '+ Add User'.

**Expected result:**

- Observed during exploration: no dialog, drawer or navigation was detected after clicking '+ Add User'.
- Expected: the related form/details panel opens (Needs Verification – may be a defect or a slow-loading panel).

**Evidence:** `screenshots/role-permission/role-users-00-page.png`

#### ADMIN-ROLE-009 – Open 'Access User' form on User Management (All Users)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Access User'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Click 'Access'.

**Expected result:**

- A dialog titled 'Access User' opens.
- Buttons: 'Access', 'Cancel'.

**Evidence:** `screenshots/role-permission/role-users-access.png`, `screenshots/role-permission/role-users-access-bottom.png`

#### ADMIN-ROLE-010 – Close 'Access User' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Click 'Access'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/role-permission/role-users-access.png`, `screenshots/role-permission/role-users-access-bottom.png`

#### ADMIN-ROLE-011 – Open 'Add More Permissions' form on User Management (All Users)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add More Permissions'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Click 'Add More Permissions'.

**Expected result:**

- A dialog titled 'Add More Permissions' opens.

**Evidence:** `screenshots/role-permission/role-users-add-more-permissions.png`, `screenshots/role-permission/role-users-add-more-permissions-bottom.png`

#### ADMIN-ROLE-012 – Close 'Add More Permissions' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. Click 'Add More Permissions'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/role-permission/role-users-add-more-permissions.png`, `screenshots/role-permission/role-users-add-more-permissions-bottom.png`

### Role Management › Role Management (All Roles)

#### ADMIN-ROLE-013 – Open the Role Management (All Roles) screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Role Management (All Roles) is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Role & Permission'.
3. On the page, click 'Role Management'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/user-management`.
- The header title reads 'Roles & Permission'.
- The list table shows the columns: ROLE NAME, VIEW PERMISSION, ACTIONS.

**Evidence:** `screenshots/role-permission/role-roles-00-page.png`

#### ADMIN-ROLE-014 – Verify list table columns and row controls on Role Management (All Roles)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Role Management'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: ROLE NAME | VIEW PERMISSION | ACTIONS.
- Each row offers these controls: VisibilityIcon, ⋮ (more actions).

**Evidence:** `screenshots/role-permission/role-roles-00-page.png`

#### ADMIN-ROLE-015 – '05' selector on Role Management (All Roles) has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Role Management'.
3. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/role-permission/role-roles-00-page.png`

#### ADMIN-ROLE-016 – '+ Add New Role' control on Role Management (All Roles)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Needs Verification | Observed no visible response | Superadmin |

**Objective:** Verify what '+ Add New Role' opens.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Role Management'.
3. Click '+ Add New Role'.

**Expected result:**

- Observed during exploration: no dialog, drawer or navigation was detected after clicking '+ Add New Role'.
- Expected: the related form/details panel opens (Needs Verification – may be a defect or a slow-loading panel).

**Evidence:** `screenshots/role-permission/role-roles-00-page.png`

#### ADMIN-ROLE-017 – 'VisibilityIcon' control on Role Management (All Roles)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Needs Verification | Observed no visible response | Superadmin |

**Objective:** Verify what 'VisibilityIcon' opens.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Role Management'.
3. Click 'VisibilityIcon' on the first row.

**Expected result:**

- Observed during exploration: no dialog, drawer or navigation was detected after clicking 'VisibilityIcon'.
- Expected: the related form/details panel opens (Needs Verification – may be a defect or a slow-loading panel).

**Evidence:** `screenshots/role-permission/role-roles-00-page.png`

### Deleted Users › Deleted Users

#### ADMIN-ROLE-018 – Open the Deleted Users screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Deleted Users is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Role & Permission'.
3. On the page, click 'Deleted Users'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/user-management/user-deleted-list`.
- The header title reads 'Roles & Permission'.
- The list table shows the columns: SR. NO., NAME, EMAIL, PHONE, ADDRESS, ACTIONS.

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-019 – Verify list table columns and row controls on Deleted Users

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | NAME | EMAIL | PHONE | ADDRESS | ACTIONS.
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-020 – Empty-state message when no Deleted Users records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-021 – Search Deleted Users using 'Search by name, email or phone' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Copy a value from the first row (e.g. the name/ID column).
4. Type it into the 'Search by name, email or phone' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-022 – Search Deleted Users with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Enter '  %_<>'"  ' in 'Search by name, email or phone'.
4. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-023 – Clear search on Deleted Users restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Search for any value in 'Search by name, email or phone'.
4. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

#### ADMIN-ROLE-024 – Change rows per page on Deleted Users

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Role & Permission'.
2. On the page, click 'Deleted Users'.
3. Open the rows-per-page dropdown in the table footer.
4. Select each value in turn: 5, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 5, 10, 15, 20 (default '5').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/role-permission/role-deleted-users-00-page.png`

## Employee Management

### Employee Dashboard › Employee Management dashboard

#### ADMIN-EMP-001 – Open the Employee Management dashboard screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Employee Management dashboard is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., EMPLOYEE NAME, EMPLOYEE TYPE, EMPLOYMENT TYPE, STATUS, ACTION.
- The summary cards shown are: Total Employees, All Drivers and Helpers Count, Client Request Portal, Incentive Programs, Sales Incentive Programs, Employee Onboarding, Employee Tracker.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-002 – Reload Employee Management dashboard via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/employee-management` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Employee Management dashboard opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-003 – Block Employee Management dashboard URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/employee-management`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-EMP-004 – Verify Employee Management dashboard summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Note the value shown on each summary card: Total Employees, All Drivers and Helpers Count, Client Request Portal, Incentive Programs, Sales Incentive Programs, Employee Onboarding, Employee Tracker.
3. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-005 – Verify Employee list columns and row controls on Employee Management dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Inspect the header row and first data row of the Employee list.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE NAME | EMPLOYEE TYPE | EMPLOYMENT TYPE | STATUS | ACTION.
- Each row offers these controls: Inactive, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-006 – Verify Document Expiry Alerts table columns and row controls on Employee Management dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Inspect the header row and first data row of the Document Expiry Alerts table.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE NAME | DOCUMENT NAME | EXPIRY DATE | EMPLOYEE STATUS | ACTION.
- Each row offers these controls: Active, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-007 – Empty-state message when no Employee Management dashboard records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-008 – Search Employee Management dashboard using 'Search Employee Info' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Copy a value from the first row (e.g. the name/ID column).
3. Type it into the 'Search Employee Info' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-009 – Search Employee Management dashboard with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Enter '  %_<>'"  ' in 'Search Employee Info'.
3. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-010 – Clear search on Employee Management dashboard restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Search for any value in 'Search Employee Info'.
3. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-011 – Filter Employee Management dashboard by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Open the 'Without label' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'Active', 'Inactive', 'All'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-012 – '05' selector on Employee Management dashboard has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-013 – Filter Employee Management dashboard by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Open the 'Without label' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'Active', 'Inactive', 'All'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-014 – '05' selector on Employee Management dashboard has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

#### ADMIN-EMP-015 – Open 'Employee Onboarding Wizard' form on Employee Management dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Employee Onboarding Wizard'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. Click '+ Add Employee'.

**Expected result:**

- The page `/dashboard/employee-management/onboarding` titled 'Employee Onboarding Wizard' opens.
- Fields shown: Date of Birth (text); Mobile Number (text, placeholder 'Enter Mobile Number'); Current Address (textarea, placeholder 'Enter Current Address'); Current Address (textarea); Emergency Contact (number, placeholder 'Enter Emergency Contact Number'); ESIC (text, placeholder 'Enter ESIC'); PAN Number (text, placeholder 'Enter PAN'); Full Name (text, placeholder 'Enter Full Name'); Gender (combobox); Email Address (email); Permanent Address (textarea, placeholder 'Enter Permanent Address'); Permanent Address (textarea); UAN (text, placeholder 'Enter UAN'); Aadhar Number (Masked) (password, placeholder 'Enter Aadhar Number', maxlength 12); Blood Group (combobox); Date of Birth (file); Bank Name (text, placeholder 'Enter Bank Name'); IFSC Code (text, placeholder 'Enter IFSC Code'); Bank Account Number (text, placeholder 'Enter Bank Account Number').
- Dropdown options observed: Gender → 'Select Gender', 'Male', 'Female', 'Other'; Blood Group → 'Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.
- Buttons: 'Back', 'toggle aadhar visibility', 'Previous', 'Next'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/employee-management/employee-dashboard-add-employee.png`

#### ADMIN-EMP-016 – Change record status via status button (Active/Inactive) in the row on Employee Management dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On a test record, click the status button (Active/Inactive) in the row.
3. Confirm if a prompt appears.
4. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/employee-management/employee-dashboard-00-page.png`

### All Employees › All Employees

#### ADMIN-EMP-017 – Open the All Employees screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that All Employees is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management', then 'View All Employees'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management/totalemployees`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., EMPLOYEE NAME, EMPLOYEE TYPE, DEPARTMENT, DESIGNATION, SHIFT, DATE OF JOINING, STATUS, ACTIONS.

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-018 – Reload All Employees via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/employee-management/totalemployees` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- All Employees opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-019 – Block All Employees URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/employee-management/totalemployees`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-EMP-020 – Verify list table columns and row controls on All Employees

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE NAME | EMPLOYEE TYPE | DEPARTMENT | DESIGNATION | SHIFT | DATE OF JOINING | STATUS | ACTIONS.
- Each row offers these controls: Inactive, VisibilityIcon, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-021 – Empty-state message when no All Employees records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-022 – Search All Employees using 'Search Employee Info' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Copy a value from the first row (e.g. the name/ID column).
3. Type it into the 'Search Employee Info' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-023 – Search All Employees with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Enter '  %_<>'"  ' in 'Search Employee Info'.
3. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-024 – Clear search on All Employees restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Search for any value in 'Search Employee Info'.
3. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-025 – Filter All Employees by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Open the 'Without label' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'Active', 'Inactive', 'All'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-026 – Change rows per page on All Employees

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Open the rows-per-page dropdown in the table footer.
3. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '05').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-027 – Open 'Employee Onboarding Wizard' form on All Employees

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Employee Onboarding Wizard'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Click '+ Add New Employee'.

**Expected result:**

- The page `/dashboard/employee-management/onboarding` titled 'Employee Onboarding Wizard' opens.
- Fields shown: Date of Birth (text); Mobile Number (text, placeholder 'Enter Mobile Number'); Current Address (textarea, placeholder 'Enter Current Address'); Current Address (textarea); Emergency Contact (number, placeholder 'Enter Emergency Contact Number'); ESIC (text, placeholder 'Enter ESIC'); PAN Number (text, placeholder 'Enter PAN'); Full Name (text, placeholder 'Enter Full Name'); Gender (combobox); Email Address (email); Permanent Address (textarea, placeholder 'Enter Permanent Address'); Permanent Address (textarea); UAN (text, placeholder 'Enter UAN'); Aadhar Number (Masked) (password, placeholder 'Enter Aadhar Number', maxlength 12); Blood Group (combobox); Date of Birth (file); Bank Name (text, placeholder 'Enter Bank Name'); IFSC Code (text, placeholder 'Enter IFSC Code'); Bank Account Number (text, placeholder 'Enter Bank Account Number').
- Dropdown options observed: Gender → 'Select Gender', 'Male', 'Female', 'Other'; Blood Group → 'Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.
- Buttons: 'Back', 'toggle aadhar visibility', 'Previous', 'Next'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/employee-management/employee-all-add-new-employee.png`

#### ADMIN-EMP-028 – Change record status via status button (Active/Inactive) in the row on All Employees

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. On a test record, click the status button (Active/Inactive) in the row.
3. Confirm if a prompt appears.
4. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

#### ADMIN-EMP-029 – Export the All Employees list using 'Export PDF'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; export not executed | Superadmin |

**Objective:** Verify list export.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management', then 'View All Employees'.
2. Optionally apply a filter/search.
3. Click 'Export PDF'.

**Expected result:**

- A PDF file downloads (file name format – Needs Verification).
- The PDF contains the same columns and rows as the current (filtered) list.
- Export with an empty list produces an empty report or a message (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-all-00-page.png`

### Employee Onboarding › Employee Onboarding

#### ADMIN-EMP-030 – Open the Employee Onboarding screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Employee Onboarding is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management'.
3. On the page, click 'Employee Onboarding'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., EMPLOYEE NAME, EMPLOYEE TYPE, EMPLOYMENT TYPE, STATUS, ACTION.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-031 – Verify list table columns and row controls on Employee Onboarding

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE NAME | EMPLOYEE TYPE | EMPLOYMENT TYPE | STATUS | ACTION.
- Each row offers these controls: Inactive, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-032 – Verify list table #2 columns and row controls on Employee Onboarding

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Inspect the header row and first data row of the list table #2.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE NAME | DOCUMENT NAME | EXPIRY DATE | EMPLOYEE STATUS | ACTION.
- Each row offers these controls: Active, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-033 – Empty-state message when no Employee Onboarding records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-034 – Search Employee Onboarding using 'Search Employee Info' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Copy a value from the first row (e.g. the name/ID column).
4. Type it into the 'Search Employee Info' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-035 – Search Employee Onboarding with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Enter '  %_<>'"  ' in 'Search Employee Info'.
4. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-036 – Clear search on Employee Onboarding restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Search for any value in 'Search Employee Info'.
4. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-037 – Filter Employee Onboarding by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Open the 'Without label' dropdown.
4. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'Active', 'Inactive', 'All'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-038 – '05' selector on Employee Onboarding has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-039 – Filter Employee Onboarding by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Open the 'Without label' dropdown.
4. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'Active', 'Inactive', 'All'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-040 – '05' selector on Employee Onboarding has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

#### ADMIN-EMP-041 – Open 'Employee Onboarding Wizard' form on Employee Onboarding

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Employee Onboarding Wizard'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. Click '+ Add Employee'.

**Expected result:**

- The page `/dashboard/employee-management/onboarding` titled 'Employee Onboarding Wizard' opens.
- Fields shown: Date of Birth (text); Mobile Number (text, placeholder 'Enter Mobile Number'); Current Address (textarea, placeholder 'Enter Current Address'); Current Address (textarea); Emergency Contact (number, placeholder 'Enter Emergency Contact Number'); ESIC (text, placeholder 'Enter ESIC'); PAN Number (text, placeholder 'Enter PAN'); Full Name (text, placeholder 'Enter Full Name'); Gender (combobox); Email Address (email); Permanent Address (textarea, placeholder 'Enter Permanent Address'); Permanent Address (textarea); UAN (text, placeholder 'Enter UAN'); Aadhar Number (Masked) (password, placeholder 'Enter Aadhar Number', maxlength 12); Blood Group (combobox); Date of Birth (file); Bank Name (text, placeholder 'Enter Bank Name'); IFSC Code (text, placeholder 'Enter IFSC Code'); Bank Account Number (text, placeholder 'Enter Bank Account Number').
- Dropdown options observed: Gender → 'Select Gender', 'Male', 'Female', 'Other'; Blood Group → 'Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.
- Buttons: 'Back', 'toggle aadhar visibility', 'Previous', 'Next'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/employee-management/employee-onboarding-add-employee.png`

#### ADMIN-EMP-042 – Change record status via status button (Active/Inactive) in the row on Employee Onboarding

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Employee Onboarding'.
3. On a test record, click the status button (Active/Inactive) in the row.
4. Confirm if a prompt appears.
5. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/employee-management/employee-onboarding-00-page.png`

### Operations Roster › Operations Roster

#### ADMIN-EMP-043 – Open the Operations Roster screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Operations Roster is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management'.
3. On the page, click 'Operations Roster'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., EMPLOYEE ID, EMPLOYEE NAME, EMPLOYEE TYPE, SHIFT, LOCATION, ACTIONS.
- The summary cards shown are: Employees Scheduled Today, Coverage % vs Required, Shortage.

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-044 – Verify Operations Roster summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Note the value shown on each summary card: Employees Scheduled Today, Coverage % vs Required, Shortage.
4. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-045 – Verify list table columns and row controls on Operations Roster

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE ID | EMPLOYEE NAME | EMPLOYEE TYPE | SHIFT | LOCATION | ACTIONS.
- Each row offers these controls: VisibilityIcon, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-046 – Empty-state message when no Operations Roster records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-047 – Search Operations Roster using 'Search Here' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Copy a value from the first row (e.g. the name/ID column).
4. Type it into the 'Search Here' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-048 – Search Operations Roster with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Enter '  %_<>'"  ' in 'Search Here'.
4. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-049 – Clear search on Operations Roster restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Search for any value in 'Search Here'.
4. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-050 – '05' selector on Operations Roster has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

#### ADMIN-EMP-051 – Open 'Employee Onboarding Wizard' form on Operations Roster

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Employee Onboarding Wizard'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Employee'.

**Expected result:**

- The page `/dashboard/employee-management/onboarding` titled 'Employee Onboarding Wizard' opens.
- Fields shown: Date of Birth (text); Mobile Number (text, placeholder 'Enter Mobile Number'); Current Address (textarea, placeholder 'Enter Current Address'); Current Address (textarea); Emergency Contact (number, placeholder 'Enter Emergency Contact Number'); ESIC (text, placeholder 'Enter ESIC'); PAN Number (text, placeholder 'Enter PAN'); Full Name (text, placeholder 'Enter Full Name'); Gender (combobox); Email Address (email); Permanent Address (textarea, placeholder 'Enter Permanent Address'); Permanent Address (textarea); UAN (text, placeholder 'Enter UAN'); Aadhar Number (Masked) (password, placeholder 'Enter Aadhar Number', maxlength 12); Blood Group (combobox); Date of Birth (file); Bank Name (text, placeholder 'Enter Bank Name'); IFSC Code (text, placeholder 'Enter IFSC Code'); Bank Account Number (text, placeholder 'Enter Bank Account Number').
- Dropdown options observed: Gender → 'Select Gender', 'Male', 'Female', 'Other'; Blood Group → 'Select Blood Group', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'.
- Buttons: 'Back', 'toggle aadhar visibility', 'Previous', 'Next'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/employee-management/employee-roster-add-employee.png`

#### ADMIN-EMP-052 – Open 'Add Shift' form on Operations Roster

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add Shift'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.

**Expected result:**

- A dialog titled 'Add Shift' opens.
- Fields shown: Employee Name (combobox); Employee ID (text, placeholder 'Enter Employee ID'); Shift (combobox); Status (combobox).
- Dropdown options observed: Employee Name → 40 option(s) (names/contact data – values not recorded); Shift → 'Select Shift', 'Morning', 'Afternoon', 'Night'; Status → no options loaded (list empty when opened).
- Buttons: 'Open', 'Add Shift', 'Cancel'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-053 – Close 'Add Shift' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Enter any value in the first editable field.
5. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-054 – Create a record via 'Add Shift' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful create through 'Add Shift'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Employee Name: <valid test value>; Employee ID: <valid test value>; Shift: <valid test value>; Status: <valid test value>

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Fill every field with valid test data (see Test Data).
5. Click 'Add Shift'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The new record appears in the list and the total increases by 1.
- Values persist after page refresh.

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-055 – Mandatory-field validation on 'Add Shift'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Leave all fields empty / at default.
5. Click 'Add Shift'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Employee Name, Employee ID, Shift, Status.

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-056 – Submit 'Add Shift' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Fill only the fields confirmed as mandatory.
5. Click 'Add Shift'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-057 – Text length boundaries on 'Add Shift'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Employee ID

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
5. Click 'Add Shift' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-058 – Invalid characters / script injection in 'Add Shift' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
5. Click 'Add Shift' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-059 – Dropdown selection behaviour on 'Add Shift'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Click '+ Add Shift'.
4. Open each dropdown in order from top to bottom.
5. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- Dropdowns with no options before earlier selections are made: Status – they appear to depend on a previous field (Needs Verification).
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-060 – Duplicate 'Employee Name' on 'Add Shift'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify duplicate records are prevented.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Note the value of an existing record's Employee Name.
4. Click '+ Add Shift'.
5. Enter the same Employee Name (also try different letter case and trailing space) with other valid fields.
6. Click 'Add Shift'.

**Expected result:**

- The record is not created; a duplicate error message is shown (rule – Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-add-shift.png`, `screenshots/employee-management/employee-roster-add-shift-bottom.png`

#### ADMIN-EMP-061 – Export the Operations Roster list using 'Export PDF'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; export not executed | Superadmin |

**Objective:** Verify list export.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Operations Roster'.
3. Optionally apply a filter/search.
4. Click 'Export PDF'.

**Expected result:**

- A PDF file downloads (file name format – Needs Verification).
- The PDF contains the same columns and rows as the current (filtered) list.
- Export with an empty list produces an empty report or a message (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-roster-00-page.png`

### Client Request › Client Request

#### ADMIN-EMP-062 – Open the Client Request screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Client Request is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management'.
3. On the page, click 'Client Request'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., REQUEST ID, CLIENT NAME, CLIENT EMAIL, REQUEST TYPE, DESCRIPTION, CREATED, PRIORITY, STATUS, ACTIONS.
- The summary cards shown are: Total Bookings, Open Requests, High Priority, Completion Rate.

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-063 – Verify Client Request summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Note the value shown on each summary card: Total Bookings, Open Requests, High Priority, Completion Rate.
4. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-064 – Verify list table columns and row controls on Client Request

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | REQUEST ID | CLIENT NAME | CLIENT EMAIL | REQUEST TYPE | DESCRIPTION | CREATED | PRIORITY | STATUS | ACTIONS.
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-065 – Empty-state message when no Client Request records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-066 – Search Client Request using 'Search Here' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Copy a value from the first row (e.g. the name/ID column).
4. Type it into the 'Search Here' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-067 – Search Client Request with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Enter '  %_<>'"  ' in 'Search Here'.
4. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-068 – Clear search on Client Request restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Search for any value in 'Search Here'.
4. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-069 – Change rows per page on Client Request

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Open the rows-per-page dropdown in the table footer.
4. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '05').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

#### ADMIN-EMP-070 – Export the Client Request list using 'Export PDF'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; export not executed | Superadmin |

**Objective:** Verify list export.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'Client Request'.
3. Optionally apply a filter/search.
4. Click 'Export PDF'.

**Expected result:**

- A PDF file downloads (file name format – Needs Verification).
- The PDF contains the same columns and rows as the current (filtered) list.
- Export with an empty list produces an empty report or a message (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-client-request-00-page.png`

### HR Overview › HR Overview

#### ADMIN-EMP-071 – Open the HR Overview screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that HR Overview is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, click 'Employee Management'.
3. On the page, click 'HR Overview'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/employee-management`.
- The header title reads 'Employee Management'.
- The list table shows the columns: SR. NO., EMPLOYEE ID, EMPLOYEE NAME, DEPARTMENT, JOIN DATE, STATUS, ACTIONS.
- The summary cards shown are: Retention Rate, Complaints, Onboarding Progress, Headcount by Department, Diversity Count Snapshot.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-072 – Verify HR Overview summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Note the value shown on each summary card: Retention Rate, Complaints, Onboarding Progress, Headcount by Department, Diversity Count Snapshot.
4. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-073 – Verify list table columns and row controls on HR Overview

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | EMPLOYEE ID | EMPLOYEE NAME | DEPARTMENT | JOIN DATE | STATUS | ACTIONS.
- Each row offers these controls: Inactive, VisibilityIcon, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-074 – Empty-state message when no HR Overview records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-075 – Search HR Overview using 'Search Employee Info' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Copy a value from the first row (e.g. the name/ID column).
4. Type it into the 'Search Employee Info' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-076 – Search HR Overview with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Enter '  %_<>'"  ' in 'Search Employee Info'.
4. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-077 – Clear search on HR Overview restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Search for any value in 'Search Employee Info'.
4. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-078 – Filter HR Overview by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Open the 'Without label' dropdown.
4. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Status', 'All', 'Active', 'Inactive'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-079 – Change rows per page on HR Overview

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. Open the rows-per-page dropdown in the table footer.
4. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '05').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

#### ADMIN-EMP-080 – Change record status via status button (Active/Inactive) in the row on HR Overview

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, click 'Employee Management'.
2. On the page, click 'HR Overview'.
3. On a test record, click the status button (Active/Inactive) in the row.
4. Confirm if a prompt appears.
5. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/employee-management/employee-hr-overview-00-page.png`

## Fleet & Vehicle Management

### Fleet & Vehicles › Vehicle Management Portal

#### ADMIN-FLEET-001 – Open the Vehicle Management Portal screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Vehicle Management Portal is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/fleet-vehicle-management`.
- The header title reads 'Vehicle Management Portal'.
- The summary cards shown are: Total Buses / Active, Approved & Track Live Trips, Vehicle Allocation Portal, Tarrif Management.

**Evidence:** `screenshots/fleet-vehicle/fleet-portal-00-page.png`

#### ADMIN-FLEET-002 – Reload Vehicle Management Portal via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Vehicle Management Portal opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-portal-00-page.png`

#### ADMIN-FLEET-003 – Block Vehicle Management Portal URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-FLEET-004 – Verify Vehicle Management Portal summary card values against list data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred – card definitions not documented | Superadmin |

**Objective:** Check data consistency between summary cards and the underlying lists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. Note the value shown on each summary card: Total Buses / Active, Approved & Track Live Trips, Vehicle Allocation Portal, Tarrif Management.
3. Open the list each card represents (card click / related tab) and note its total entries ('Showing x to y of N').

**Expected result:**

- Each card value equals the total of the corresponding list or filter (exact definition per card – Needs Verification).
- Card values are numeric and non-negative.

**Evidence:** `screenshots/fleet-vehicle/fleet-portal-00-page.png`

### Fleet & Vehicles › Approved & Track Live Trips

#### ADMIN-FLEET-005 – Open the Approved & Track Live Trips screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Approved & Track Live Trips is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
3. On the page, click 'Approved & Track Live Trips'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/fleet-vehicle-management`.
- The header title reads 'Vehicle Management Portal'.

**Dependencies:** Booking & Operations · **Evidence:** `screenshots/fleet-vehicle/fleet-live-trips-00-page.png`

### Fleet & Vehicles › Vehicle Allocation Portal

#### ADMIN-FLEET-006 – Open the Vehicle Allocation Portal screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Vehicle Allocation Portal is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
3. On the page, click 'Vehicle Allocation Portal'.
4. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/fleet-vehicle-management/vehicle-allocation`.
- The header title reads 'Vehicle Management Portal'.
- The list table shows the columns: SR. NO., TRIP ID, CUSTOMER, ROUTE, DATES, ADVANCE, ADVANCE, STATUS, ACTION.

**Dependencies:** Booking & Operations · **Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

#### ADMIN-FLEET-007 – Verify list table columns and row controls on Vehicle Allocation Portal

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. On the page, click 'Vehicle Allocation Portal'.
3. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | TRIP ID | CUSTOMER | ROUTE | DATES | ADVANCE | ADVANCE | STATUS | ACTION.
- Each row offers these controls: Allocate, Allocate Driver, Record Advance.
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

#### ADMIN-FLEET-008 – Empty-state message when no Vehicle Allocation Portal records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. On the page, click 'Vehicle Allocation Portal'.
3. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

#### ADMIN-FLEET-009 – Filter Vehicle Allocation Portal by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. On the page, click 'Vehicle Allocation Portal'.
3. Open the 'Without label' dropdown.
4. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'Select Trip ID', 'TP-1381', 'TP-1380', 'TP-1376', 'TP-1377', 'TP-1378', 'TP-1379', 'TP-1371', 'TP-1370', 'TP-1369', 'TP-1359', 'TP-1360', 'TP-1358', 'TP-1357', 'TP-1352', 'TP-1346', 'TP-1343', 'TP-1342', 'TP-1341', 'TP-1330', 'TP-1326', 'TP-1327', 'TP-1328', 'TP-1329', 'TP-1323' ….
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

#### ADMIN-FLEET-010 – Filter Vehicle Allocation Portal by 'Select Client Name' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. On the page, click 'Vehicle Allocation Portal'.
3. Open the 'Select Client Name' dropdown.
4. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 40 option(s) (names/contact data – values not recorded).
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

#### ADMIN-FLEET-011 – '05' selector on Vehicle Allocation Portal has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles'.
2. On the page, click 'Vehicle Allocation Portal'.
3. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-allocation-portal-00-page.png`

### Fleet & Vehicles › Tariff Management

#### ADMIN-FLEET-012 – Open the Tariff Management screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Tariff Management is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles', then the 'Tarrif Management' card.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/fleet-vehicle-management/tarrifs`.
- The header title reads 'Tariff Management'.
- The list table shows the columns: SR. NO., VEHICLE TYPE, SEAT CONFIGURATION, 8 HRS & 80 KM, EXTRA KM, EXTRA HRS, 8 HRS & 80 KM NAC, EXTRA KM NAC, EXTRA HRS NAC, ACTIONS.

**Dependencies:** Inquiry Management (quotations), Bus Types · **Evidence:** `screenshots/fleet-vehicle/fleet-tariff-00-page.png`

#### ADMIN-FLEET-013 – Reload Tariff Management via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management/tarrifs` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Tariff Management opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-tariff-00-page.png`

#### ADMIN-FLEET-014 – Block Tariff Management URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management/tarrifs`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-FLEET-015 – Verify list table columns and row controls on Tariff Management

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles', then the 'Tarrif Management' card.
2. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | VEHICLE TYPE | SEAT CONFIGURATION | 8 HRS & 80 KM | EXTRA KM | EXTRA HRS | 8 HRS & 80 KM NAC | EXTRA KM NAC | EXTRA HRS NAC | ACTIONS.
- Each row offers these controls: ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/fleet-vehicle/fleet-tariff-00-page.png`

#### ADMIN-FLEET-016 – 'Without label' selector on Tariff Management has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles', then the 'Tarrif Management' card.
2. Open the 'Without label' dropdown.

**Expected result:**

- Observed: the list contained only the placeholder 'Select Vehicle' during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-tariff-00-page.png`

#### ADMIN-FLEET-017 – '05' selector on Tariff Management has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Fleet & Vehicles', then the 'Tarrif Management' card.
2. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-tariff-00-page.png`

### Bus Models › Bus Models

#### ADMIN-FLEET-018 – Open the Bus Models screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Bus Models is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/fleet-vehicle-management/bus-modal-page`.
- The header title reads 'Bus Models'.
- The list table shows the columns: SR. NO., MODEL NAME, MANUFACTURER, SEATING CAPACITY, CREATED DATE, STATUS, ACTIONS.

**Dependencies:** Bus Manufacturers, Bus Types · **Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-019 – Reload Bus Models via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management/bus-modal-page` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Bus Models opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-020 – Block Bus Models URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/fleet-vehicle-management/bus-modal-page`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-FLEET-021 – Verify list table columns and row controls on Bus Models

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | MODEL NAME | MANUFACTURER | SEATING CAPACITY | CREATED DATE | STATUS | ACTIONS.
- Each row offers these controls: Active, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-022 – Empty-state message when no Bus Models records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-023 – Filter Bus Models by 'Without label' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Open the 'Without label' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'All', 'Active', 'Inactive'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-024 – '05' selector on Bus Models has no selectable options

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed empty list | Superadmin |

**Objective:** Verify the selector is populated when data exists.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Open the '05' dropdown.

**Expected result:**

- Observed: the list contained only no options during exploration.
- Expected: it lists the available values (e.g. active trips) and selecting one filters the related table (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-025 – Navigate pages of the Bus Models list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify first/previous/next/last page controls.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click 'Go to next page'.
3. Click 'Go to last page'.
4. Click 'Go to previous page'.
5. Click 'Go to first page'.

**Expected result:**

- Observed total at exploration time: 33 entries.
- Each click loads the corresponding page and 'Showing x to y of N' updates.
- On page 1, 'Go to first page' and 'Go to previous page' are disabled.
- On the last page, 'Go to next page' and 'Go to last page' are disabled and the last row number equals N.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

#### ADMIN-FLEET-026 – Open 'Add Bus Model' form on Bus Models

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add Bus Model'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.

**Expected result:**

- A dialog titled 'Add Bus Model' opens.
- Fields shown: Model Name (text, placeholder 'Enter Model Name'); Manufacturer (combobox); Seating Capacity (text, placeholder 'Enter Seating Capacity'); Status (combobox, default 'Active').
- Dropdown options observed: Manufacturer → 'Select Manufacturer', 'Multiple', 'Jaguar Land Rover India Limited', 'Toyota Kirloskar Motor Private Limited', 'BMW India', 'Mercedes-Benz India Private Limited', 'Audi India', 'Honda Cars India Limited', 'Kia Corporation', 'Tata Motors', 'Force India', 'Daimler India', 'Eicher India', 'SML Isuzu', 'Ashok Leyland', 'Volvo Bus India'; Status → 'Active', 'Inactive'.
- Buttons: 'Add', 'Cancel'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-027 – Close 'Add Bus Model' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-028 – Create a record via 'Add Bus Model' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful create through 'Add Bus Model'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Model Name: <valid test value>; Manufacturer: <valid test value>; Seating Capacity: <valid test value>; Status: <valid test value>

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Fill every field with valid test data (see Test Data).
4. Click 'Add'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The new record appears in the list and the total increases by 1.
- Values persist after page refresh.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-029 – Mandatory-field validation on 'Add Bus Model'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Leave all fields empty / at default.
4. Click 'Add'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Model Name, Manufacturer, Seating Capacity, Status.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-030 – Submit 'Add Bus Model' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Fill only the fields confirmed as mandatory.
4. Click 'Add'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-031 – Text length boundaries on 'Add Bus Model'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Model Name, Seating Capacity

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
4. Click 'Add' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-032 – Invalid characters / script injection in 'Add Bus Model' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
4. Click 'Add' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-033 – Numeric boundaries for 'Seating Capacity' on 'Add Bus Model'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify 'Seating Capacity' accepts only valid numeric values.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Enter in 'Seating Capacity' each of: 0, -1, 1, 1.5, a very large value (e.g. 9999999999), letters 'abc'.
4. Click 'Add' after each (test record only).

**Expected result:**

- Letters cannot be typed or are rejected.
- Negative values are rejected.
- Whether 0 and decimals are allowed, and the maximum value – Needs Verification.

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-034 – Dropdown selection behaviour on 'Add Bus Model'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Click '+ Add Bus Model'.
3. Open each dropdown in order from top to bottom.
4. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- All dropdowns were populated when opened.
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-035 – Duplicate 'Model Name' on 'Add Bus Model'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify duplicate records are prevented.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. Note the value of an existing record's Model Name.
3. Click '+ Add Bus Model'.
4. Enter the same Model Name (also try different letter case and trailing space) with other valid fields.
5. Click 'Add'.

**Expected result:**

- The record is not created; a duplicate error message is shown (rule – Needs Verification).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model.png`, `screenshots/fleet-vehicle/fleet-bus-models-add-bus-model-bottom.png`

#### ADMIN-FLEET-036 – Change record status via status button (Active/Inactive) in the row on Bus Models

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, expand 'Fleet & Vehicle Management' and click 'Bus Models'.
2. On a test record, click the status button (Active/Inactive) in the row.
3. Confirm if a prompt appears.
4. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/fleet-vehicle/fleet-bus-models-00-page.png`

## Client Management

### Contracted Clients › Contracted – New Clients/Onboard

#### ADMIN-CLIENT-001 – Open the Contracted – New Clients/Onboard screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Contracted – New Clients/Onboard is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/client-management/contracted-clients?tab=clientOnboard`.
- The header title reads 'Client Management'.
- The list table shows the columns: SR. NO., CLIENT NAME, CLIENT CATEGORY, PENDING ONBOARDING STEPS, CONTRACT STATUS, ACTIONS.

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-002 – Reload Contracted – New Clients/Onboard via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients?tab=clientOnboard` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Contracted – New Clients/Onboard opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-003 – Block Contracted – New Clients/Onboard URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Documented | Observed (contracted-clients) | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients?tab=clientOnboard`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-CLIENT-004 – Verify list table columns and row controls on Contracted – New Clients/Onboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: SR. NO. | CLIENT NAME | CLIENT CATEGORY | PENDING ONBOARDING STEPS | CONTRACT STATUS | ACTIONS.
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-005 – Empty-state message when no Contracted – New Clients/Onboard records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-006 – Search Contracted – New Clients/Onboard using 'Search Client Info' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Copy a value from the first row (e.g. the name/ID column).
3. Type it into the 'Search Client Info' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-007 – Search Contracted – New Clients/Onboard with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Enter '  %_<>'"  ' in 'Search Client Info'.
3. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-008 – Clear search on Contracted – New Clients/Onboard restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Search for any value in 'Search Client Info'.
3. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-009 – Change rows per page on Contracted – New Clients/Onboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Open the rows-per-page dropdown in the table footer.
3. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '05').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-010 – Navigate pages of the Contracted – New Clients/Onboard list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify first/previous/next/last page controls.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Click 'Go to next page'.
3. Click 'Go to last page'.
4. Click 'Go to previous page'.
5. Click 'Go to first page'.

**Expected result:**

- Observed total at exploration time: 48 entries.
- Each click loads the corresponding page and 'Showing x to y of N' updates.
- On page 1, 'Go to first page' and 'Go to previous page' are disabled.
- On the last page, 'Go to next page' and 'Go to last page' are disabled and the last row number equals N.

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

#### ADMIN-CLIENT-011 – Export the Contracted – New Clients/Onboard list using 'Export PDF'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; export not executed | Superadmin |

**Objective:** Verify list export.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Client Management' and click 'Client Management', 'Contracted Client', then the 'New Clients/Onboard' card.
2. Optionally apply a filter/search.
3. Click 'Export PDF'.

**Expected result:**

- A PDF file downloads (file name format – Needs Verification).
- The PDF contains the same columns and rows as the current (filtered) list.
- Export with an empty list produces an empty report or a message (Needs Verification).

**Evidence:** `screenshots/client-management/client-contracted-onboard-00-page.png`

## Category Management

### Main Category › Main Category

#### ADMIN-CAT-001 – Open the Main Category screen from the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that Main Category is reachable from navigation and renders its default view.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in to Admin Web as Superadmin.
2. In the left sidebar, expand 'Category Management' and click 'Main Category'.
3. Wait for the page to finish loading.

**Expected result:**

- The browser URL is `/dashboard/category-management/main-category`.
- The header title reads 'Main Category'.
- The list table shows the columns: S.NO, CATEGORY ID, CATEGORY NAME, DESCRIPTION, DEFAULT UOM, STATUS, ACTION.

**Dependencies:** Sub Category, Manage Unit Type (UoM), Vendor type · **Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-002 – Reload Main Category via its direct URL

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the screen can be opened by URL and survives a browser refresh while the session is valid.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, enter `https://dari-dev.siddagangatravels.com/dashboard/category-management/main-category` in the address bar and press Enter.
2. Press F5 to refresh the page.

**Expected result:**

- Main Category opens directly without redirecting to /login.
- After refresh the same screen and default view are displayed (filters reset to defaults – Needs Verification).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-003 – Block Main Category URL without an authenticated session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred from observed redirect on another route | Superadmin |

**Objective:** Verify that the route is protected when no session exists.

**Preconditions:**

- No active Admin Web session in the browser.

**Steps:**

1. Open a new private/incognito browser window (no Admin Web session).
2. Navigate to `https://dari-dev.siddagangatravels.com/dashboard/category-management/main-category`.

**Expected result:**

- The user is redirected to `/login` (observed for the Contracted Clients route at session start).
- No data from the screen is displayed before login.

**Evidence:** `screenshots/login/01-initial-load.png`

#### ADMIN-CAT-004 – Verify list table columns and row controls on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the table structure matches the observed layout.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Inspect the header row and first data row of the list table.

**Expected result:**

- Columns appear in this order: S.NO | CATEGORY ID | CATEGORY NAME | DESCRIPTION | DEFAULT UOM | STATUS | ACTION.
- Each row offers these controls: Active, ⋮ (more actions).
- The first column numbers rows sequentially, continuing across pages (Needs Verification for page 2+).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-005 – Empty-state message when no Main Category records match

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify behaviour when a search/filter returns no rows.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Apply a search or filter that matches no record (e.g. search 'zzzz-no-match-999').

**Expected result:**

- The table body shows 'No data available' (empty-state text observed in this application).
- The footer reads 'Showing 0 to 0 of 0 entries' and the pagination buttons are disabled.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-006 – Search Main Category using 'Search Here' with an existing value

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify that the search box filters the list.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Copy a value from the first row (e.g. the name/ID column).
3. Type it into the 'Search Here' box (and press Enter or click the search icon if results do not update automatically).

**Expected result:**

- Only rows containing the searched value are listed.
- The 'Showing x to y of N' total decreases accordingly.
- Which columns are searched and whether search is case-insensitive / partial – Needs Verification.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-007 – Search Main Category with special characters and leading/trailing spaces

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify search robustness for unusual input.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Enter '  %_<>'"  ' in 'Search Here'.
3. Clear the box, then enter the first row's name surrounded by spaces.

**Expected result:**

- No error page or console crash; special characters return 'No data available'.
- Leading/trailing spaces are trimmed and the matching row is returned (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-008 – Clear search on Main Category restores the full list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify that clearing search resets results.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Search for any value in 'Search Here'.
3. Delete the search text completely.

**Expected result:**

- The full list is shown again with the original 'Showing … of N' total.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-009 – Filter Main Category by 'All Status' dropdown

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify each filter option narrows the list correctly.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Open the 'All Status' dropdown.
3. Select each option in turn and observe the list.

**Expected result:**

- The dropdown lists: 'All Status', 'Active', 'Inactive'.
- After selecting an option only rows with that value are listed and the total updates.
- Selecting the 'All' option (if present) shows all rows again.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-010 – Change rows per page on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the rows-per-page selector.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Open the rows-per-page dropdown in the table footer.
3. Select each value in turn: 05, 10, 15, 20.

**Expected result:**

- The dropdown lists exactly: 05, 10, 15, 20 (default '05').
- After each selection the table shows at most that many rows and 'Showing 1 to n of N' updates.
- The page resets to page 1 (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-011 – Navigate pages of the Main Category list

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify first/previous/next/last page controls.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click 'Go to next page'.
3. Click 'Go to last page'.
4. Click 'Go to previous page'.
5. Click 'Go to first page'.

**Expected result:**

- Observed total at exploration time: 133 entries.
- Each click loads the corresponding page and 'Showing x to y of N' updates.
- On page 1, 'Go to first page' and 'Go to previous page' are disabled.
- On the last page, 'Go to next page' and 'Go to last page' are disabled and the last row number equals N.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-012 – Open 'Add Main Category' form on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Add Main Category'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.

**Expected result:**

- A dialog titled 'Add Main Category' opens.
- Fields shown: Service (checkbox, unchecked); Supplier (checkbox, unchecked); Category Name (text, placeholder 'Enter Category Name'); Default UoM (combobox); Vendor Type (combobox); Status (combobox, default 'Active'); Description (text, placeholder 'Enter Description').
- Dropdown options observed: Default UoM → 'Select Default UoM', 'Bottle', 'Box', 'Can', 'Carton', 'Dozen', 'Drum/Barrel', 'Feet', 'Gram', 'HKADD', 'Job / Visit', 'Kilogram', 'Kit', 'Labour Hour', 'Litre', 'Meter', 'Millilitre', 'Nos/Piece(pc)', 'Packet', 'Pair', 'Per Km', 'Per Trip', 'Per Vehicle', 'Quintal', 'Roll' …; Vendor Type → 'Select Vendor Type', 'Bus Vendor', 'Supplier Vendor', 'Service Vendor', 'Courier Vendor'; Status → 'Select Status', 'Active', 'Inactive'.
- Buttons: 'Cancel', 'Add'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-013 – Close 'Add Main Category' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-014 – Create a record via 'Add Main Category' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful create through 'Add Main Category'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Service: <valid test value>; Supplier: <valid test value>; Category Name: <valid test value>; Default UoM: <valid test value>; Vendor Type: <valid test value>; Status: <valid test value>; Description: <valid test value>

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Fill every field with valid test data (see Test Data).
4. Click 'Add'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The new record appears in the list and the total increases by 1.
- Values persist after page refresh.

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-015 – Mandatory-field validation on 'Add Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Leave all fields empty / at default.
4. Click 'Add'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Service, Supplier, Category Name, Default UoM, Vendor Type, Status, Description.

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-016 – Submit 'Add Main Category' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Fill only the fields confirmed as mandatory.
4. Click 'Add'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-017 – Text length boundaries on 'Add Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Category Name, Description

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
4. Click 'Add' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-018 – Invalid characters / script injection in 'Add Main Category' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
4. Click 'Add' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-019 – Dropdown selection behaviour on 'Add Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click '+ Add New Category'.
3. Open each dropdown in order from top to bottom.
4. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- All dropdowns were populated when opened.
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-020 – Duplicate 'Category Name' on 'Add Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify duplicate records are prevented.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Note the value of an existing record's Category Name.
3. Click '+ Add New Category'.
4. Enter the same Category Name (also try different letter case and trailing space) with other valid fields.
5. Click 'Add'.

**Expected result:**

- The record is not created; a duplicate error message is shown (rule – Needs Verification).

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`, `screenshots/category-management/category-main-add-new-category-bottom.png`

#### ADMIN-CAT-021 – Open the row actions (⋮) menu on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the actions available per record.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon in the Action column of the first row.

**Expected result:**

- A menu opens with: 'Edit Category', 'Delete Category'.
- Pressing Esc or clicking outside closes the menu without any change.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-022 – Cancel 'Delete Category' on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Menu item observed; not clicked | Superadmin |

**Objective:** Verify that a delete can be abandoned without data loss.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record created for this purpose exists.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click ⋮ on a test record (never a business record).
3. Click 'Delete Category'.
4. In the confirmation prompt click Cancel/No (or close it).

**Expected result:**

- A confirmation prompt is shown before deletion (Needs Verification – not opened during exploration).
- After cancelling, the record remains in the list unchanged and the total is unchanged.

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-023 – Confirm 'Delete Category' on a test record in Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Needs Verification | Menu item observed; not clicked | Superadmin |

**Objective:** Verify deletion removes the record and is reflected in totals.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Explicit approval obtained – deletion is irreversible.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Note the total entries.
3. Click ⋮ on the disposable test record.
4. Click 'Delete Category' and confirm.

**Expected result:**

- A success message is shown.
- The record no longer appears in the list and the total decreases by 1.
- Records referencing it (dependent modules) are handled per business rule (soft delete vs block – Needs Verification).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

#### ADMIN-CAT-024 – Open 'Edit Main Category' edit form on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the layout, fields, defaults and options of 'Edit Main Category'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- At least one record exists in the list.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.

**Expected result:**

- A dialog titled 'Edit Main Category' opens.
- Fields shown: Service (checkbox, checked); Supplier (checkbox, checked); Category ID (text, disabled/read-only); Category Name (text, placeholder 'Enter Category Name'); Default UoM (combobox); Vendor Type (combobox); Status (combobox, default 'Active'); Description (text, placeholder 'Enter Description').
- Dropdown options observed: Default UoM → 'Select Default UoM', 'Bottle', 'Box', 'Can', 'Carton', 'Dozen', 'Drum/Barrel', 'Feet', 'Gram', 'HKADD', 'Job / Visit', 'Kilogram', 'Kit', 'Labour Hour', 'Litre', 'Meter', 'Millilitre', 'Nos/Piece(pc)', 'Packet', 'Pair', 'Per Km', 'Per Trip', 'Per Vehicle', 'Quintal', 'Roll' …; Vendor Type → 'Select Vendor Type', 'Bus Vendor', 'Supplier Vendor', 'Service Vendor', 'Courier Vendor'; Status → 'Select Status', 'Active', 'Inactive'.
- Buttons: 'Cancel', 'Update'.
- No mandatory-field markers (*) are rendered on this form (observed).

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-025 – Close 'Edit Main Category' without saving (Cancel / ✕ / Esc)

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify that closing the dialog discards entered data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Enter any value in the first editable field.
4. Click 'Cancel' (repeat using the ✕ icon and the Esc key).

**Expected result:**

- The dialog closes and no record is created or changed (list total unchanged).
- Re-opening the dialog shows empty/default values, not the abandoned input (Needs Verification for re-open state).

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-026 – Update a record via 'Edit Main Category' with valid data

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Form observed; submission not executed | Superadmin |

**Objective:** Verify a successful update through 'Edit Main Category'.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval obtained – this step writes data to DEV.
- Use clearly named test data, e.g. prefix 'QA-TEST-'.

**Test data:** Service: <valid test value>; Supplier: <valid test value>; Category Name: <valid test value>; Default UoM: <valid test value>; Vendor Type: <valid test value>; Status: <valid test value>; Description: <valid test value>

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Change one or more editable fields to new valid values.
4. Click 'Update'.

**Expected result:**

- The dialog closes and a success message is shown (exact text – Needs Verification).
- The updated values are shown in the row and total is unchanged.
- Values persist after page refresh.

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-027 – Mandatory-field validation on 'Edit Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – validation not triggered (exploration only) | Superadmin |

**Objective:** Verify required fields are enforced.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Clear the text of each editable text field.
4. Click 'Update'.

**Expected result:**

- The form is not submitted; inline validation messages appear under each required field.
- No record is created/changed.
- Which fields are mandatory is not indicated in the UI (no * markers) – the mandatory set must be confirmed: Service, Supplier, Category Name, Default UoM, Vendor Type, Status, Description.

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-028 – Submit 'Edit Main Category' with only the minimum required fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify optional fields can be left blank.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Mandatory field set confirmed (see open questions).
- Approval obtained – writes data.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Fill only the fields confirmed as mandatory.
4. Click 'Update'.

**Expected result:**

- The record is saved; optional fields are stored as blank and shown as '-' or empty in the list (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-029 – Text length boundaries on 'Edit Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Inferred – limits not documented | Superadmin |

**Objective:** Verify min/max length handling of text fields.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Test data:** Fields: Category Name, Description

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. For each text field enter: 1 character; the maximum allowed length; maximum + 1; only spaces.
4. Click 'Update' after each variation (on a test record only).

**Expected result:**

- Single-character and max-length values are accepted.
- Max+1 is blocked by the input or rejected with a message.
- Whitespace-only input is rejected as empty.
- No maxlength attribute is set on these inputs – limits must be confirmed.

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-030 – Invalid characters / script injection in 'Edit Main Category' text fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify input sanitisation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Enter `<script>alert(1)</script>` and `' OR 1=1 --` into the first text field; fill other fields validly.
4. Click 'Update' (test record only).

**Expected result:**

- Either the input is rejected with a validation message or it is stored and later displayed as plain text (no script execution).

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-031 – Dropdown selection behaviour on 'Edit Main Category'

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify dropdown options and dependent selections.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Click the ⋮ icon on the first row, then click 'Edit Category'.
3. Open each dropdown in order from top to bottom.
4. Select an option in each, then change an earlier selection.

**Expected result:**

- Each dropdown shows the options listed in the 'Open' use case for this form.
- All dropdowns were populated when opened.
- Changing a parent selection clears or refreshes dependent selections (Needs Verification).

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-032 – 'Edit Main Category' is pre-filled with the selected record

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify edit form loads current values.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. Note the values of the first row.
3. Click the ⋮ icon on the first row, then click 'Edit Category'.

**Expected result:**

- All fields are pre-populated with the row's current values.
- Read-only fields (observed disabled): Category ID.

**Evidence:** `screenshots/category-management/category-main-row-menu-edit-category.png`, `screenshots/category-management/category-main-row-menu-edit-category-bottom.png`

#### ADMIN-CAT-033 – Change record status via status button (Active/Inactive) in the row on Main Category

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Needs Verification | Control observed; not clicked | Superadmin |

**Objective:** Verify status transition Active ↔ Inactive and its effect on filters.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- A disposable test record exists.
- Approval obtained – changes record status.

**Steps:**

1. In the left sidebar, expand 'Category Management' and click 'Main Category'.
2. On a test record, click the status button (Active/Inactive) in the row.
3. Confirm if a prompt appears.
4. Filter the list by the new status.

**Expected result:**

- The status label changes (e.g. Active → Inactive) and a success message appears.
- The record appears under the matching status filter.
- Inactive records are not offered in dependent dropdowns elsewhere (Needs Verification).
- Whether the control is clickable or display-only – Needs Verification (not clicked during exploration).

**Evidence:** `screenshots/category-management/category-main-00-page.png`

## Authentication

### Login › Login

#### ADMIN-AUTH-001 – Redirect to Login when opening a protected URL without a session

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify unauthenticated users are redirected to the login page.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open a private/incognito browser window.
2. Navigate to https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients.

**Expected result:**

- The browser ends on `/login` (page title 'Login | Siddaganga').
- The 'Welcome Back' / 'Login to your Account' form is displayed.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

#### ADMIN-AUTH-002 – Verify Login page layout and controls

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify all login controls are present.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open https://dari-dev.siddagangatravels.com/login in a private window.

**Expected result:**

- Branding images (coach, Siddaganga logo) are shown.
- Heading 'Welcome Back' and text 'Login to your Account'.
- Field 'Username / Email Address' with placeholder 'Enter your username or email address'.
- Field 'Password' with placeholder 'Enter your password' and an eye icon button.
- Link 'Forgot Password?', button 'Login', link 'Log in with OTP'.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

#### ADMIN-AUTH-003 – Log in with valid username/email and password

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Documented | Observed UI | Superadmin |

**Objective:** Verify successful authentication with valid credentials.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Test data:** QA account (secure)

**Steps:**

1. Open /login in a private window.
2. Enter the QA account username/email.
3. Enter the QA account password.
4. Click 'Login'.

**Expected result:**

- The user is navigated to `/dashboard` (observed landing page).
- Header shows 'Dashboard' and the avatar labelled with the user's role (e.g. 'Superadmin').
- Sidebar sections OVERVIEW, PEOPLE & ACCESS, FLEET & TRIPS, PARTNERS, OPERATIONS are visible.

**Related:** ADMIN-AUTH-001 · **Evidence:** `screenshots/dashboard/01-landing.png`

#### ADMIN-AUTH-004 – Return to the originally requested page after login

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Needs Verification | Observed landing on /dashboard | Superadmin |

**Objective:** Verify deep-link behaviour after authentication.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. In a private window open /dashboard/client-management/contracted-clients (redirects to /login).
2. Log in with valid credentials.

**Expected result:**

- Observed: after login the app landed on `/dashboard`, not the originally requested Contracted Clients URL.
- Confirm whether redirect-back to the requested page is expected (open question).

#### ADMIN-AUTH-005 – Login with a wrong password

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify invalid credentials are rejected.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. Open /login.
2. Enter a valid username/email.
3. Enter an incorrect password.
4. Click 'Login'.

**Expected result:**

- The user stays on /login.
- An error message is displayed (exact text – Needs Verification).
- The password field is not echoed in the message.

#### ADMIN-AUTH-006 – Login with an unregistered username/email

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred | Superadmin |

**Objective:** Verify unknown users cannot log in and the message does not reveal account existence.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /login.
2. Enter 'qa.unknown.user@example.com'.
3. Enter any password.
4. Click 'Login'.

**Expected result:**

- Login fails with a generic error; the message does not state whether the user exists (Needs Verification).

#### ADMIN-AUTH-007 – Login with empty fields

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Needs Verification | Inferred – no required markers shown | Superadmin |

**Objective:** Verify mandatory validation on the login form.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /login.
2. Leave both fields empty and click 'Login'.
3. Fill only the username and click 'Login'.
4. Clear username, fill only the password and click 'Login'.

**Expected result:**

- Each attempt is blocked; a required-field message appears for the empty field(s).
- No request results in navigation to /dashboard.

#### ADMIN-AUTH-008 – Username field accepts plain usernames despite email input type

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Medium | Needs Verification | Observed input type=email | Superadmin |

**Objective:** Verify the 'Username / Email Address' field accepts both formats.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. Open /login.
2. Enter a username without '@' (e.g. the QA username).
3. Enter the password and click 'Login'.

**Expected result:**

- Observed: the field is an `<input type=email>` labelled 'Username / Email Address'.
- Expected: a plain username is accepted (no browser 'include an @' tooltip blocks submission). Confirm actual behaviour.

#### ADMIN-AUTH-009 – Toggle password visibility

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the eye icon shows/hides the password.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /login.
2. Type any text in 'Password'.
3. Click the eye icon.
4. Click it again.

**Expected result:**

- First click shows the text in clear; second click masks it again.
- The typed value is unchanged.

**Evidence:** `screenshots/login/01-initial-load.png`, `screenshots/login/02-login-page.png`

#### ADMIN-AUTH-010 – Leading/trailing spaces and case in username

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Boundary | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify username normalisation.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. Open /login.
2. Enter the QA username/email with a leading and trailing space, then in UPPER CASE.
3. Enter the correct password and click 'Login'.

**Expected result:**

- Spaces are trimmed and email matching is case-insensitive, or a clear error is shown (rule – Needs Verification).

#### ADMIN-AUTH-011 – Repeated failed logins

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify lockout / throttling after repeated failures.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A dedicated lockout test account (never the shared QA account).

**Steps:**

1. Open /login.
2. Attempt login with a wrong password 5–10 times for a dedicated test account.

**Expected result:**

- After N failures the account is locked or throttled, or a CAPTCHA appears (policy – Needs Verification).
- A locked account cannot log in even with the correct password until unlocked.

#### ADMIN-AUTH-012 – Session persists across browser refresh and new tab

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify session handling after login.

**Preconditions:**

- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. Log in.
2. Refresh the browser.
3. Open /dashboard/inquiry-management/total-inquiries in a new tab of the same browser.

**Expected result:**

- The user remains logged in on refresh and in the new tab (observed: session reused across tabs during exploration).

#### ADMIN-AUTH-013 – Session expiry redirects to Login

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify an expired/invalid session is handled.

**Preconditions:**

- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).

**Steps:**

1. Log in.
2. Leave the app idle beyond the session timeout (or clear site cookies/local storage).
3. Click any sidebar link.

**Expected result:**

- The user is redirected to /login; no data is shown and no unhandled error appears.
- Session timeout duration – Needs Verification.

### Forgot Password › Forgot Password

#### ADMIN-AUTH-014 – Open Forgot Password from Login

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify navigation to the password reset page.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /login.
2. Click 'Forgot Password?'.

**Expected result:**

- URL becomes `/forgot-password`, page title 'Forgot-Password | Siddaganga'.
- Heading 'Forgot Password', text 'Reset Your Password'.
- Field 'Username / Email Address' (placeholder 'Enter your username or email address'), button 'Send OTP', link 'Go to Login'.

**Evidence:** `screenshots/login/03-forgot-password.png`

#### ADMIN-AUTH-015 – Return to Login from Forgot Password

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the 'Go to Login' link.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /forgot-password.
2. Click 'Go to Login'.

**Expected result:**

- The login page (/login) is shown.

**Evidence:** `screenshots/login/03-forgot-password.png`

#### ADMIN-AUTH-016 – Request a password-reset OTP for a registered account

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Needs Verification | Control observed; not executed | Superadmin |

**Objective:** Verify the OTP is sent and the OTP/new password step appears.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV. (sends an email)

**Steps:**

1. Open /forgot-password.
2. Enter the QA account username/email.
3. Click 'Send OTP'.

**Expected result:**

- A success message is shown and an OTP entry (and new password) step appears (Needs Verification – not executed).
- An OTP email is delivered to the account's address.

**Evidence:** `screenshots/login/03-forgot-password.png`

#### ADMIN-AUTH-017 – Forgot Password with empty / unregistered / malformed input

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify validation of the reset request.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /forgot-password.
2. Click 'Send OTP' with the field empty.
3. Enter 'abc@' and click 'Send OTP'.
4. Enter an unregistered email and click 'Send OTP'.

**Expected result:**

- Empty and malformed inputs are rejected with a validation message.
- Unregistered input shows a generic message without disclosing account existence (Needs Verification).

**Evidence:** `screenshots/login/03-forgot-password.png`

#### ADMIN-AUTH-018 – Reset password with invalid/expired OTP and weak password

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred – OTP step not observed | Superadmin |

**Objective:** Verify OTP and password policy on reset.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A dedicated test account whose password may be reset.
- Explicit approval obtained – this step writes data / triggers communication in DEV.

**Steps:**

1. Complete 'Send OTP' for a test account.
2. Enter a wrong OTP and submit.
3. Request again, wait beyond OTP validity and submit the old OTP.
4. Enter the valid OTP with a weak password (e.g. '123').

**Expected result:**

- Wrong/expired OTPs are rejected.
- Weak passwords are rejected per policy (policy – Needs Verification).
- A valid OTP + compliant password resets the password and allows login with it.

### Login with OTP › Log in with OTP

#### ADMIN-AUTH-019 – Switch to 'Log in with OTP' and back

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify toggling between password and OTP login modes.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).

**Steps:**

1. Open /login.
2. Click 'Log in with OTP'.
3. Click 'Log in With Email & Password'.

**Expected result:**

- OTP mode shows only 'Username / Email Address', button 'Send OTP', hint 'We'll Send a OTP to Your Email Address', link 'Log in With Email & Password' (URL stays /login).
- Clicking the link returns to the password form.

**Evidence:** `screenshots/login/04-login-with-otp.png`

#### ADMIN-AUTH-020 – Log in with a valid email OTP

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Needs Verification | Control observed; not executed | Superadmin |

**Objective:** Verify OTP-based authentication.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV. (sends an email)

**Steps:**

1. Open /login and click 'Log in with OTP'.
2. Enter the QA account email.
3. Click 'Send OTP'.
4. Enter the OTP received by email and submit.

**Expected result:**

- An OTP input step appears after 'Send OTP' (Needs Verification – not executed).
- With a correct OTP the user lands on /dashboard.

**Evidence:** `screenshots/login/04-login-with-otp.png`

#### ADMIN-AUTH-021 – OTP login with wrong, expired or reused OTP

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Medium | Needs Verification | Inferred | Superadmin |

**Objective:** Verify OTP validation and resend behaviour.

**Preconditions:**

- No active Admin Web session (use a private/incognito window).
- A valid Admin Web QA account (credentials supplied securely, never written into test evidence).
- Explicit approval obtained – this step writes data / triggers communication in DEV.

**Steps:**

1. Request an OTP.
2. Enter an incorrect OTP.
3. Enter the correct OTP after its expiry.
4. Reuse an OTP that was already used.
5. Use 'Resend OTP' if offered.

**Expected result:**

- Incorrect, expired and reused OTPs are rejected with a clear message.
- Resend issues a new OTP and invalidates the old one (Needs Verification).

## Global Navigation & Header

### Header › Header (title, notifications, profile)

#### ADMIN-NAV-001 – Log out from the profile menu

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Positive | High | Needs Verification | Menu item observed; not clicked | Superadmin |

**Objective:** Verify logout ends the session.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Approval to log out (ends the shared exploration session).

**Steps:**

1. Log in.
2. Click the avatar in the header.
3. Click 'Logout' (and confirm if prompted).
4. Press the browser Back button.
5. Open /dashboard directly.

**Expected result:**

- The user is returned to /login.
- Back and direct URL access do not show protected pages; the user is redirected to /login.

**Evidence:** `screenshots/dashboard/04-profile-menu.png`

### Sidebar › Sidebar navigation

#### ADMIN-NAV-002 – Sidebar shows all sections and modules for Superadmin

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | High | Documented | Observed UI | Superadmin |

**Objective:** Verify the complete navigation inventory for Superadmin.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in as Superadmin.
2. Review the left sidebar from top to bottom (scroll the sidebar if needed).

**Expected result:**

- Sections and items: OVERVIEW (Dashboard); PEOPLE & ACCESS (Role & Permission, Employee Management); FLEET & TRIPS (Fleet & Vehicle Management ›, Booking & Operations, Inquiry Management, Lead Management); PARTNERS (Client Management ›, Vendor Management ›, Category Management ›); OPERATIONS (Service & Maintenance ›, Financial Management, Inventory Management, Content Management System ›, Payment And Refund Management).

**Evidence:** `screenshots/dashboard/01-landing.png`, `screenshots/dashboard/02-sidebar-expanded.png`

#### ADMIN-NAV-003 – Expand and collapse sidebar groups

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | High | Documented | Observed UI | Superadmin |

**Objective:** Verify collapsible groups show their submenus.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Click 'Fleet & Vehicle Management'.
2. Click it again.
3. Repeat for Client Management, Vendor Management, Category Management, Service & Maintenance, Content Management System.

**Expected result:**

- Fleet: Fleet & Vehicles, Bus Types, Bus Manufacturers, Bus Models, Seat Types.
- Client: Client Management, Trip Wise Client, Manage Client, Request Category.
- Vendor: Vendor Management, Manage Request Type, Deactivated Vendors.
- Category: Main Category, Sub Category, Manage Unit Type.
- Service: Service & Maintenance, Manage Service Type.
- CMS: Popular Routes, Popular Service Category, Popular Service Sub Category, Popular Service Route, Popular Service Why Required, Popular Service Required For, WhatsApp FAQ, App Force Update, Marketing Notification, Privacy & Terms.
- A second click collapses the group; the chevron rotates accordingly.

**Evidence:** `screenshots/dashboard/02-sidebar-expanded.png`

#### ADMIN-NAV-004 – Active menu item is highlighted

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the current location is indicated in the sidebar.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Expand 'Category Management' and click 'Main Category'.
2. Click 'Sub Category'.

**Expected result:**

- The selected submenu item and its parent group are highlighted (observed on Main Category).
- Highlight moves to Sub Category after the second click.

**Evidence:** `screenshots/category-management/category-main-add-new-category.png`

#### ADMIN-NAV-005 – Hide and restore the sidebar

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Needs Verification | Observed partially | Superadmin |

**Objective:** Verify the sidebar collapse controls.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Click the 'Hide sidebar' button (circle-arrow next to the logo).
2. Click the hamburger (≡) icon in the header.

**Expected result:**

- The sidebar collapses/hides, giving the content full width.
- The sidebar is restored by the toggle. Behaviour of hamburger vs collapse button – Needs Verification.

**Evidence:** `screenshots/dashboard/05-sidebar-hidden.png`, `screenshots/dashboard/06-sidebar-restored.png`

#### ADMIN-NAV-006 – Header title follows the current screen

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Low | Documented | Observed UI | Superadmin |

**Objective:** Verify the header H1 updates with navigation.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Click Dashboard, Role & Permission, Booking & Operations and Main Category in turn.

**Expected result:**

- Header title shows 'Dashboard', 'Roles & Permission', 'Booking & Operations', 'Main Category' respectively.
- Note: some screens keep a generic title (e.g. Trip Wise Client shows 'Client Management'; Popular Routes shows 'Content Management System').

#### ADMIN-NAV-007 – Browser Back/Forward between modules

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Navigation | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify browser history works with the SPA routing.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Open Dashboard → Inquiry Management → Lead Management via the sidebar.
2. Click browser Back twice, then Forward once.

**Expected result:**

- Back shows Inquiry Management then Dashboard; Forward returns to Inquiry Management; each screen re-renders correctly.

#### ADMIN-NAV-008 – Unknown route inside the dashboard

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | Low | Needs Verification | Inferred | Superadmin |

**Objective:** Verify handling of invalid URLs.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. While logged in, open https://dari-dev.siddagangatravels.com/dashboard/does-not-exist.

**Expected result:**

- A 404 / not-found page or a redirect to /dashboard is shown; no blank page or crash (Needs Verification).

#### ADMIN-NAV-009 – Sidebar adapts to role permissions

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Negative | High | Blocked | Only Superadmin available | Superadmin |

**Objective:** Verify non-Superadmin roles see only permitted modules.

**Preconditions:**

- An Admin/limited-role test account exists (not available during exploration).

**Steps:**

1. Log in with an Admin (non-Superadmin) test account.
2. Review the sidebar.
3. Open a URL of a module not shown in the sidebar.

**Expected result:**

- Only modules granted in Role & Permission are listed.
- Direct URLs to unpermitted modules are blocked (redirect or 'access denied').

**Dependencies:** Role & Permission

### Header › Header (title, notifications, profile)

#### ADMIN-NAV-010 – Open notifications from the bell icon

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the notifications panel.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Log in.
2. Click the bell icon in the header.

**Expected result:**

- A 'Notifications' panel opens with an unread count (e.g. '5 New') and items titled 'New Inquiry Alert' with text 'New inquiry <Inquiry ID> from <customer> has been received. Please check it in the total inquiries list.' and a date-time.
- When there are none, the panel shows 'No Notifications'.

**Evidence:** `screenshots/dashboard/03-notifications.png`

#### ADMIN-NAV-011 – Notifications are marked read after viewing

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Observed once | Superadmin |

**Objective:** Verify read-state behaviour of notifications.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Ensure there are unread notifications (badge visible).
2. Click the bell, close the panel.
3. Click the bell again.

**Expected result:**

- Observed during exploration: after first viewing, the panel showed 'No Notifications' – viewing appears to clear/mark them read.
- Confirm intended behaviour: should read items remain listed (marked read) rather than disappear?

**Dependencies:** Inquiry Management

#### ADMIN-NAV-012 – Open an inquiry from its notification

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Integration | Medium | Needs Verification | Inferred from notification text | Superadmin |

**Objective:** Verify a notification links to the referenced inquiry.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Create or wait for a new inquiry (e.g. from the Banni app).
2. Click the bell.
3. Click the 'New Inquiry Alert' item.

**Expected result:**

- The user is taken to Inquiry Management (total inquiries list) with the referenced Inquiry ID visible / highlighted (Needs Verification).

**Dependencies:** Inquiry Management, Banni app

#### ADMIN-NAV-013 – Open the profile menu

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Documented | Observed UI | Superadmin |

**Objective:** Verify the avatar menu.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Click the avatar image in the header.

**Expected result:**

- A menu opens with the role label 'Superadmin', 'Profile' and 'Logout'.

**Evidence:** `screenshots/dashboard/04-profile-menu.png`

#### ADMIN-NAV-014 – Open the Profile page

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| UI | Medium | Needs Verification | Observed empty page | Superadmin |

**Objective:** Verify the user's profile is displayed.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.

**Steps:**

1. Click the avatar.
2. Click 'Profile'.

**Expected result:**

- URL is /dashboard/profile and the logged-in user's profile details are displayed.
- Observed: the content area is empty and the header title remains 'Dashboard' – possible defect / incomplete screen.

**Evidence:** `screenshots/dashboard/07-profile-page.png`

## End-to-End Workflows

### Cross-module › Cross-module workflow

#### ADMIN-E2E-001 – Fleet master data chain: Manufacturer → Model → Seat Type → Bus Type

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify fleet master data created in sequence is available to dependent screens.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Fleet & Vehicle Management › Bus Manufacturers: click '+ Add Bus Manufacturer', create 'QA-TEST-MFR' (Active).
2. Bus Models: click '+ Add Bus Model', select manufacturer 'QA-TEST-MFR', enter model 'QA-TEST-MODEL' and seating capacity, save.
3. Seat Types: click '+ Add Seat Type', create 'QA-TEST-SEAT', save.
4. Bus Types: click '+ Add New Type', select the new manufacturer/model/seat configuration, save.
5. Open Dashboard › All Bus overview and Fleet & Vehicles › Total Buses / Active.

**Expected result:**

- The new manufacturer is selectable in the Bus Model form; the new model in the Bus Type form.
- Bus Types list shows the new type with Vehicle Type, Bus Type, Bus Manufacturer and Seat Configuration populated.
- Inactive manufacturers/models are not offered in dependent dropdowns (Needs Verification).

**Dependencies:** Bus Manufacturers, Bus Models, Seat Types, Bus Types, Dashboard

#### ADMIN-E2E-002 – Category master chain: Unit Type → Main Category → Sub Category → Inventory item

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify category masters flow into inventory.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Category Management › Manage Unit Type: '+ Add Unit Type' 'QA-TEST-UNIT'.
2. Main Category: '+ Add New Category' (Service/Supplier, Category Name 'QA-TEST-MAIN', Default UoM 'QA-TEST-UNIT', Vendor Type, Status Active).
3. Sub Category: '+ Add New Sub Category' under 'QA-TEST-MAIN'.
4. Inventory Management: start '+ Create PR' and search the category/item fields for the new category.

**Expected result:**

- 'QA-TEST-UNIT' appears in the Default UoM dropdown of Main Category.
- 'QA-TEST-MAIN' appears in the 'All Main Categories' filter and the Sub Category form.
- The new category is selectable when creating inventory requests (Needs Verification).

**Dependencies:** Manage Unit Type, Main Category, Sub Category, Inventory Management

#### ADMIN-E2E-003 – Sales pipeline: Lead → Inquiry → Quotation → Advance → Booking

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify a lead converts through inquiry and quotation into a booking.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Lead Management: '+ Add Lead' for a QA test client; note the Lead ID and Stage.
2. Move the lead to the converting stage / create an inquiry from it (mechanism – Needs Verification).
3. Inquiry Management: open the inquiry, click 'New quotation', create a quote; note the Quote Summary.
4. Click 'Revised quotation' and change the amount; click 'View Quote'.
5. Click 'Record Advance' and record a test advance.
6. Booking & Operations: locate the booking under Pre-Bookings, then Booked.

**Expected result:**

- Lead STATUS/STAGE updates when converted.
- Inquiry row shows CLIENT NAME, VEHICLE NAME, QUOTE SUMMARY, STATUS and ADVANCE consistent with the actions.
- Revised quotation supersedes the previous one in View Quote.
- A booking with matching client, journey, dates, EST. COST and ADVANCE appears; Total Bookings increases by 1.

**Dependencies:** Lead Management, Inquiry Management, Tariff Management, Booking & Operations

#### ADMIN-E2E-004 – Booking fulfilment: Pending allocation → Vehicle allocation → Live trip → Completed

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify the operational lifecycle of a booking.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Booking & Operations: note the 'Pending Vehicle Allocations' count; open the card (Allocation Portal).
2. Fleet & Vehicle Management › Vehicle Allocation Portal: select the booking's Trip ID and allocate a vehicle.
3. Start the trip from the driver/ops app (Saagane) or as per process.
4. Check Fleet › Approved & Track Live Trips and the Booking 'Live Trips' card.
5. Complete the trip; open Booking & Operations › Completed.

**Expected result:**

- Pending Vehicle Allocations decreases by 1 after allocation.
- The trip appears in Live Trips while running; Dashboard 'On Route Vehicle' reflects it.
- After completion the booking is listed under Completed with its status updated.

**Dependencies:** Booking & Operations, Fleet & Vehicle Management, Saagane app, Dashboard

#### ADMIN-E2E-005 – Billing: Completed booking → Invoice & Payment → Financial Receivables

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify invoicing and receivables after a trip.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Client Management › Regular Customers: open the 'Invoice & Payment' card for the test client.
2. Generate/view the invoice for the completed booking (mechanism – Needs Verification).
3. Financial Management › Receivables: locate the client in the Corporate Client Ledger / receivables list.
4. Record a test payment (only with approval) and re-check OUTSTANDING on the client row.

**Expected result:**

- Invoice total equals the booking cost minus advance.
- Receivables show the outstanding amount; after payment OUTSTANDING decreases accordingly.
- Client row LAST INVOICE / OUTSTANDING columns match the financial module.

**Dependencies:** Client Management, Financial Management, Booking & Operations

#### ADMIN-E2E-006 – Client onboarding: Client category → Add client → use in booking

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify a new client can be categorised and booked.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Client Management › Manage Client: '+ Add Category' 'QA-TEST-CAT'.
2. Client Management: '+ Add New Client' (Regular) with category 'QA-TEST-CAT'.
3. Trip Wise Client: search the new client.
4. Booking & Operations: '+ Add New Booking', search the client by name or mobile.

**Expected result:**

- The client appears in All Regular Customers with CLIENT CATEGORY 'QA-TEST-CAT' and status Active.
- The client is searchable in Trip Wise Clients and selectable in the booking client search.

**Dependencies:** Manage Client, Client Management, Trip Wise Client, Booking & Operations

#### ADMIN-E2E-007 – Contracted client lifecycle: onboard → contract → invoice frequency → ledger

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify contracted (B2B) clients and their contract data.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Client Management › 'Contracted Client' toggle: '+ Add New Client' for a QA contracted client.
2. Open the 'New Clients/Onboard' card and locate the client.
3. Verify CONTRACT ID, CONTRACT TERM, INVOICE FREQUENCY, CONTRACT STATUS in All Clients.
4. Open the 'Invoice Management' card; then Financial Management › Receivables.

**Expected result:**

- The client is listed with a generated Contract ID and the entered contract terms.
- Invoices follow the configured invoice frequency (Needs Verification).
- B2B Rebate Tiers apply to this client's bookings (Needs Verification).

**Dependencies:** Client Management (Contracted), Financial Management, Payment And Refund Management

#### ADMIN-E2E-008 – Customer request handling: Request Category → request → employee portal

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify customer/client requests are categorised and handled.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Client Management › Request Category: '+ Add Request Category' 'QA-TEST-REQ'.
2. Raise a test request for a client (Customer Requests / Client Requests card, or from the app).
3. Employee Management › Client Request: locate the request; check Open Requests / High Priority / Completion Rate cards.

**Expected result:**

- The request shows category 'QA-TEST-REQ'.
- Employee Client Request counts update; completing the request updates Completion Rate.

**Dependencies:** Request Category, Client Management, Employee Management

#### ADMIN-E2E-009 – Vendor lifecycle: Request type → vendor → profile → deactivate → re-activate

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify vendor onboarding and status lifecycle.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Vendor Management › Manage Request Type: '+ Add Request Type' for a vendor type.
2. Vendor Management: '+ Add Vendor' (QA test vendor).
3. Click 'Manage Profile' and complete pending items (Pricing, Contract).
4. Deactivate the vendor (status control).
5. Deactivated Vendors: click 'Activate Vendor'.

**Expected result:**

- PROFILE STATUS changes from 'Pending: Pricing, Contract' to complete after profile updates.
- A deactivated vendor moves to Deactivated Vendors and is absent from All Vendors; re-activation reverses this.
- All Vendors card counts update accordingly.

**Dependencies:** Vendor Management, Manage Request Type, Deactivated Vendors

#### ADMIN-E2E-010 – Maintenance: Service request → review → approval → parts → job → cost

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify the service & maintenance workflow and its status transitions.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Service & Maintenance: '+ Add New Request' for a QA vehicle with a service type.
2. Open 'Under Review' and review the request.
3. Approve it (only with approval) and check 'Approved Requests'; reject a second test request and check 'Rejected Requests'.
4. Raise a parts request; check 'Parts Request' and Inventory 'Pending Internal Requests'.
5. Track work in 'Job Tracker'; check 'Cost Analytics' and Financial › Expenses.

**Expected result:**

- Status transitions (observed values Pending, Under_review, Completed; plus Approved/Rejected) are reflected in the STATUS column and filters.
- Parts requests appear in Inventory; Job Tracker and Cost Analytics reflect the request; Dashboard 'Vehicles Under Maintenance' updates.

**Dependencies:** Service & Maintenance, Manage Service Type, Inventory Management, Financial Management, Dashboard

#### ADMIN-E2E-011 – Procurement: Purchase Requisition → Purchase Order → QC → Stock

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify the inventory procurement flow.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Inventory Management: '+ Create PR' for a QA item; note the PR number (observed format PR-2026-NNNN).
2. Approve the PR (with approval); '+ Create PO' against it for a test vendor.
3. Receive goods; process 'Items Awaiting QC'.
4. Check stock in Manage Inventory; perform '+ Stock Adjustment' if required.

**Expected result:**

- Pending PRs / Pending POs / Items Awaiting QC counts move in sequence.
- Recent Activity lists the PR with its status (e.g. 'Submitted').
- Current stock and Current Stock Value increase after QC; Low Stock Alerts update.

**Dependencies:** Inventory Management, Vendor Management, Financial Payables

#### ADMIN-E2E-012 – Employee onboarding → KYC/documents → roster → system user

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify an employee flows from onboarding to operations and system access.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Employee Management: '+ Add Employee' – complete all onboarding steps (Next/Previous) with QA test data.
2. Check Pending KYC and Document Expiry Alerts.
3. Assign the employee in Operations Roster.
4. Role & Permission: '+ Add User' for the employee with a role.

**Expected result:**

- Total Employees increases; the employee appears in View All Employees with the correct type/status.
- Documents with expiry dates appear in Document Expiry Alerts when within the alert window.
- The employee appears in roster counts and can log in with the assigned role.

**Dependencies:** Employee Management, Role & Permission

#### ADMIN-E2E-013 – Role-based access: create role → grant permissions → verify restricted user

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Blocked | Requires creating a role/user; no non-Superadmin account available | Superadmin |

**Objective:** Verify permissions control module access.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Role & Permission › Role Management: '+ Add New Role' 'QA-TEST-ROLE'.
2. Use 'Access' / 'Add More Permissions' to grant only Inquiry Management (view).
3. '+ Add User' with role 'QA-TEST-ROLE'.
4. Log in as that user (separate browser).

**Expected result:**

- Only permitted modules appear in the sidebar; create/edit buttons are hidden or disabled for view-only permission.
- Direct URLs to other modules are blocked.
- Deleting the user moves it to 'Deleted Users'.

**Dependencies:** Role & Permission, all modules

#### ADMIN-E2E-014 – Cancellation: penalty slab applied on Cancel Trip refund

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify refunds follow the configured cancellation penalty slabs.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Payment And Refund Management › Penalty Slabs: note slab MIN HOURS / MAX HOURS / PENALTY % / ALLOW CANCEL.
2. Create a test booking with an advance.
3. Cancel it at a time falling into a specific slab.

**Expected result:**

- Refund = advance − penalty % of the slab matching hours-before-departure.
- Cancellation is blocked when ALLOW CANCEL is off for that slab.
- Observed: the Penalty Slabs table showed 'Showing 0 to 0 of 0 Entries' during exploration – slabs may need configuring first.

**Dependencies:** Payment And Refund Management, Booking & Operations, Banni app

#### ADMIN-E2E-015 – CMS content appears in the customer app

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | Medium | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify CMS changes are published to the Banni app.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. CMS › Popular Routes: '+ Add Popular Routes' (QA test route with image).
2. Popular Service Category → Sub Category → Why Required / Required For: add linked QA entries.
3. Open the Banni app home/services screens.

**Expected result:**

- New routes/services are displayed in the app with the configured titles, images and ratings.
- Deleting/deactivating removes them from the app.

**Dependencies:** Content Management System, Banni app

#### ADMIN-E2E-016 – App Force Update enforced on mobile apps

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify version control settings drive forced updates.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. CMS › App Force Update › User App: set a minimum version higher than the installed QA build and enable force update (approval).
2. Launch the Banni QA build.
3. Restore the original values.

**Expected result:**

- The app shows the configured message (observed defaults 'Update Available' / 'Please update the app to continue.') and blocks use until updated; the store link opens.
- Internal Ops App settings do not affect the User App.

**Dependencies:** Content Management System, Banni app, Saagane app

#### ADMIN-E2E-017 – New inquiry notification from the customer app

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Notification format observed | Superadmin |

**Objective:** Verify inquiries raised by customers notify admins.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Raise an inquiry from the Banni app with a QA account.
2. In Admin Web click the bell icon.
3. Open Inquiry Management.

**Expected result:**

- A 'New Inquiry Alert' with the new Inquiry ID appears (observed format).
- The inquiry is listed in All Inquiries; Total Inquiries increases by 1.

**Dependencies:** Banni app, Inquiry Management, Header notifications

#### ADMIN-E2E-018 – Driver emergency alert lifecycle

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | High | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify an alert can be raised and tracked to resolution.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Dashboard › Driver Emergency Alerts: click 'Add Alert'; select Trip, Vehicle, Fleet Manager; enter Alert Type, Time, Location, Description; Status 'Unresolved'; click 'Add Alert'.
2. Edit the alert status to 'In Progress', then 'Resolved'.

**Expected result:**

- The alert appears in the table with STATUS 'Unresolved'.
- Observed status options: Unresolved, In Progress, Resolved; transitions are reflected in the table.
- The Vehicle list depends on the selected Trip (Vehicle dropdown was empty before selecting a trip).

**Dependencies:** Dashboard, Booking (trips), Fleet, Employee (fleet managers)

#### ADMIN-E2E-019 – Refuel request recorded against a trip

| Type | Priority | Status | Basis | Role |
|---|---|---|---|---|
| Workflow | Medium | Needs Verification | Workflow inferred from observed screens | Superadmin |

**Objective:** Verify refuel requests and their effect on expenses.

**Preconditions:**

- User is logged in to Admin Web (DEV) as Superadmin.
- Explicit approval obtained – this step writes data / triggers communication in DEV.
- Use QA-TEST- prefixed data and record every created ID for clean-up.

**Steps:**

1. Dashboard › Refuel Requests: click 'Add Refuel Request'; select Trip and Vehicle; enter Reported By, Reported Time, Amount, Description; submit.
2. Select the trip in the 'Select Trip' filter.
3. Check Financial Management › Expenses.

**Expected result:**

- The refuel request is listed for the selected trip with AMOUNT and STATUS.
- Approved refuel amounts are reflected in expenses (Needs Verification).

**Dependencies:** Dashboard, Financial Management
