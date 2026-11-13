# Admin Web – Exploration Log

Target: https://dari-dev.siddagangatravels.com/dashboard/client-management/contracted-clients (DEV)
Scope: exploration and use-case documentation only. No test execution, no irreversible actions.

## Resume pointer
- **Current phase:** Phase 3–7 – deep read-only inspection batch running; documentation generator in place
- **Last completed module / screen:** see `exploration-logs/raw/inspect/*.json` (one file per completed screen key from `steps/screens.json`)
- **Next step:** resume with `npm run browser` (background) then `node steps/inspect-batch.mjs --shard=i/4` for i=0..3 – completed screens are skipped automatically; then `python scripts/build_docs.py`.

## Sessions

### 2026-10-30 – Session 1
- Created `Admin-Web/` structure: `documentation/`, `screenshots/{login,dashboard}/`, `exploration-logs/`, `reports/`.
- Browser check (`tabs_context_mcp`): **Claude in Chrome extension not connected**. Exploration blocked until the extension is connected.
- Login approach: the user signs in manually in the browser tab. Claude does not type passwords (project rule, CLAUDE.md → Credentials).

### 2026-10-30 – Session 1 (cont.) – switched to Playwright
- User directed: drop Claude in Chrome; use Playwright directly. Scope clarified: **exploration + documentation only** (no test execution, no form submission other than login, no negative-input probing, no PASS/FAIL).
- Project inspection: root project uses WebdriverIO only; no Playwright config existed. Created an isolated setup in `Admin-Web/` (`package.json`, `playwright` + `dotenv`, `scripts/browser.mjs | login.mjs | run.mjs | lib.mjs`, `.env.example`, `.gitignore` for `.env` and `.auth/`). Uses system Chrome (`channel: chrome`) with an isolated profile in `Admin-Web/.auth/profile`; steps attach over CDP so the authenticated session is reused.
- Screenshots mask leaf elements containing email/phone patterns.
- Initial load of the Contracted Clients URL redirects to **`/login`** (title "Login | Siddaganga"). Evidence: `screenshots/login/01-initial-load.png`.
  - Observed controls: "Username / Email Address" textbox, "Password" textbox, password visibility toggle (icon button), "Forgot Password?" link (`/forgot-password`), "Login" button, "Log in with OTP" link.
- Waiting for the user to sign in (manual, or via `.env` values).

### 2026-10-30 – Session 1 (cont.) – authenticated, Phase 1–2
- Sign-in completed by the user (secure terminal prompt). `login.mjs` detected `/dashboard`, saved session to `.auth/state.json` (git-ignored). Logged-in role shown in header avatar alt text: **Superadmin**.
- Landing page after login: `/dashboard` (title "Siddaganga | Siddaganga"). Evidence: `screenshots/dashboard/01-landing.png`.
- Sidebar expanded (`steps/01-sidebar.mjs`): 5 sections (OVERVIEW, PEOPLE & ACCESS, FLEET & TRIPS, PARTNERS, OPERATIONS), 13 top-level entries, 6 collapsible groups with 26 submenu links. Evidence: `screenshots/dashboard/02-sidebar-expanded.png`.
- Route scan (`steps/02-route-scan.mjs`, navigation only): all 37 routes (36 sidebar + brief's `contracted-clients`) load for Superadmin. Raw: `exploration-logs/raw/route-scan.json`; landing screenshots per module folder.
- Observation: `contracted-clients` is not a sidebar link; reached via the "Contracted Client" toggle on Client Management.
- Second-level navigation scan (`steps/03-subnav.mjs`) started: clicks navigation-only cards/toggles (deny-list blocks Add/Save/Send/Sync/Export/Clear/etc.).
- Second-level scan finished (`exploration-logs/raw/subnav-scan.json`). Additional routes discovered:
  `/dashboard/employee-management/totalemployees`, `/dashboard/fleet-vehicle-management/tarrifs`,
  `/dashboard/booking-management/pending-allocation`, `/dashboard/client-management/international-clients`,
  `/dashboard/client-management/regular-clients?tab=allBookings|invoiceAndPayment|customerRequests`,
  `/dashboard/client-management/contracted-clients?tab=userManagement|invoiceManagement|clientRequests|clientOnboard`,
  `/dashboard/service-maintenance/all-service-and-maintenance`.
  Inline (same-URL) panels: Role Management / Deleted Users; Employee Onboarding / Operations Roster / Client Request / HR Overview;
  Booking Pre-Bookings / Booked / Completed; Service request status filters; Service type checklists; Financial top menu sections;
  Inventory sections; Payment penalty/rebate tiers; App Force Update and Privacy & Terms tabs.

### 2026-10-30 – Phase 3 – deep read-only inspection
- User approved the module/navigation inventory and asked for full documentation (no execution, no data changes).
- `steps/inspect.mjs` + `steps/screens.json` (95 screen entries) + `steps/inspect-batch.mjs`:
  per screen it lists dropdown options, table columns, first-row actions; opens Add/View/Edit forms and row "⋮" menus
  **only to read them**, then closes with Cancel / close icon / Escape. Deny-list: save, submit, send, delete, remove, sync,
  clear, confirm, approve, reject, update, activate, upload, assign, apply. Status chips/switches are never clicked.
- Validated on Main Category: Add Main Category dialog (Service/Supplier checkboxes, Category Name, Default UoM, Vendor Type,
  Status [default Active], Description; Cancel/Add) and Edit Category (Category ID disabled; Update) read and closed unsaved.
  No required-field markers are rendered in the forms → mandatory rules recorded as Needs Verification.
- Batch switched to 4 parallel shards (`--shard=i/4`, each in its own tab of the same session; `ADMIN_WEB_NEW_PAGE=1`).
- Logged-out pages inspected in a fresh incognito context (no input typed, nothing submitted):
  - `/login`: Username / Email Address (type=email), Password + visibility toggle, Forgot Password?, Login, "Log in with OTP".
  - `/forgot-password` ("Forgot Password – Reset Your Password"): Username / Email Address, **Send OTP**, "Go to Login". Evidence `screenshots/login/03-forgot-password.png`.
  - OTP login (same `/login` route, toggled view): Username / Email Address, **Send OTP**, hint "We'll Send a OTP to Your Email Address", link "Log in With Email & Password". Evidence `screenshots/login/04-login-with-otp.png`.
- Header: bell icon (badge), avatar menu = "Superadmin" label, **Profile**, **Logout** (Logout not clicked). "Hide sidebar" collapses/restores sidebar.
  - **Profile** (`/dashboard/profile`) renders an empty content area; header title stays "Dashboard". Logged as a gap (possible defect).
  - Bell opens a "Notifications" popover: count "5 New" and "New Inquiry Alert" items ("New inquiry <ID> from <customer> has been received…", timestamp).
  - **Side effect:** on re-opening, the popover showed "No Notifications" – opening the list appears to mark notifications as read/cleared for this account. No business record was changed. Recorded as a scenario + open question.

- 16:20–16:35: 8-shard run overloaded the browser (CDP connect timeouts, leaked tabs) – all 16 failures were connection timeouts, not app errors.
  Stopped shards, restarted the isolated Chrome (session persisted in `.auth/profile`), relaunched 4 staggered shards.
- Documentation generator `scripts/build_docs.py` + `documentation/source/{screen_meta,manual_cases,e2e_cases}.py` written;
  outputs regenerate from raw data at any time (progress is saved per screen).
- `exploration-logs/raw/` git-ignored (dropdown dumps contain client names/phone numbers); generated docs reduce such lists to counts.

### 2026-10-30 ~16:55 – PAUSED by user request
- All inspection processes stopped; no further screens/tabs opened. Isolated Chrome left running (session intact).
- Deep-inspected screen keys: 32 of 90 (+5 auth/header views inspected manually). Resume skips completed keys automatically.
- Waiting for user approval before continuing exploration or writing use cases.

### 2026-10-30 ~17:10 – Interim documentation (user-approved change of approach)
- Reconciled status (verified from raw files): 95 views; 36 inspected (37 files, `fleet-live-trips` did not reach its view); 59 pending.
  Fully explored: Authentication, Global Navigation & Header, Dashboard, Lead Management. Partial: Role & Permission, Employee, Fleet, Booking, Client, Category. Not explored: Inquiry, Vendor, Service, Financial, Inventory, CMS, Payment.
- Created `documentation/interim/Admin_Web_Interim_Scenarios.xlsx|.md` via `scripts/build_interim.py` from
  `documentation/source/{manual_cases,interim_cases}.py`: 96 scenarios (AUTH 21, NAV 14, DASH 29, LEAD 32);
  28 Documented / 67 Needs Verification / 1 Blocked. Rule: Documented only where the expected result was observed.
  Separate sheet per module + 'Exploration Status' (all 17 modules) + Legend. Earlier drafts in `documentation/` untouched.

### 2026-10-30 ~17:20 – Batch A (resumed read-only inspection)
- Inspector hardened before resuming: screenshots and raw JSON never overwrite (suffix -r2/-r3); dialogs closed only via buttons named exactly Cancel/Close or the close icon; gap follow-ups use new keys (`*-r2`).
- Batch A keys: inquiry-all, booking-pre-bookings, client-regular-invoice-payment, client-contracted-invoice-mgmt, client-contracted-client-requests, client-trip-wise, client-request-category, category-sub, category-unit-type, fleet-live-trips-r2.
- Results (9 finished at time of writing, client-trip-wise still running):
  - **fleet-live-trips-r2: view reached** – `/dashboard/fleet-vehicle-management/approved-trips`; columns TRIP ID, CUSTOMER, VEHICLE NO, VEHICLE TYPE, CAPACITY, JOURNEY, ASSIGNED ROUTE, DEPARTURE, ASSIGNED DRIVER, STATUS, ALLOCATION, ACTION; row controls 'Available', 'Edit Allocation', ⋮.
  - booking-pre-bookings: '+ Add New Booking' → page `/dashboard/booking-management/add-booking` ('Add New Booking', 'Client Information', 16 fields). Row: 'Record Advance', ⋮.
  - inquiry-all: columns read; row 'View Quote', 'New quotation', 'Record Advance', ⋮.
  - client-request-category: 'Add Request Category' dialog (4 fields) read and closed. category-unit-type: 'Add Unit Type' dialog (3 fields) read and closed.
  - **Defect in my tooling (not the app):** with the shortened load wait, several targets were checked before the table rendered → '+ Add inquiry', '+ Add New Sub Category', 'View Quote' "not found" and row ⋮ menus not captured. Fixed (inspector now waits for rows/targets).
  - Contracted 'Invoice Management' / 'Client Requests' and Regular 'Invoice & Payment' opened by `?tab=` URL showed the All Clients/Regular table – tab content needs the card click. Redo keys added.
- Redo keys queued: inquiry-all-r2, booking-pre-bookings-r2, fleet-live-trips-r3, client-regular-invoice-payment-r2, client-contracted-invoice-mgmt-r2, client-contracted-client-requests-r2, client-request-category-r2, category-sub-r2, category-unit-type-r2.

### 2026-10-30 ~17:30 – Scenarios & Use Cases document (user request) – exploration PAUSED
- Batch A2 stopped at user request before any view completed (role-users-r2 aborted by the stop; nothing saved). No inspection processes running.
- Generated `documentation/scenarios/Admin_Web_Scenarios_and_Use_Cases.xlsx|.md` with `scripts/build_scenarios.py`
  (columns: Scenario ID, Module, Use Case Title, Scenario Steps; observed checkpoints folded into steps as "Check …").
  584 scenarios across 11 modules: AUTH 21, NAV 14, DASH 29, ROLE 24, EMP 65, FLEET 108, BOOK 43, INQ 13, LEAD 32, CLIENT 168, CAT 67.
- Excluded saved views whose captured content was not the intended view: employee-onboarding, client-regular-invoice-payment,
  client-contracted-invoice-mgmt, client-contracted-client-requests (fleet-live-trips superseded by -r2).
- Generator fixes (build_docs.py): no "no options" claims when options were not captured; unlabelled filters named from options;
  numeric/phone/date/duplicate field detection tightened.
- Pending (after approval): 59 views + Batch A2 redo/follow-up keys (16) – resume with `node steps/inspect-batch.mjs --shard=i/4 <keys>`.

### 2026-10-30 ~17:45 – Review copies of the four-column documents (exploration still paused)
- Background shells: only `node scripts/browser.mjs` (PID 24476, since 16:36) running – holds the signed-in Chrome, no inspection.
  All task logs copied to `exploration-logs/shell-logs/` (no overwrite).
- `scripts/revise_scenarios.py` → `documentation/scenarios/review/Admin_Web_Scenarios_and_Use_Cases_REVIEW.xlsx|.md` + `revision-report.json`.
  Originals untouched. Script first rebuilt all 584 rows and asserted they match the current documents exactly.
- Rule: a "Check …" step gets "(to be confirmed)" unless its outcome was observed (page load/URL, table columns & row controls,
  form layout, Cancel/close, row-menu contents, edit pre-fill, dropdown option lists; hand-written cases per their status and the
  interim downgrade list). Result: 488 scenarios / 861 check steps marked (the earlier figure of 246 counted only scenarios whose
  status was entirely unconfirmed; 242 more contained unconfirmed checks inside otherwise observed or generated scenarios).
- 11 duplicate title groups (22 Client Management rows) suffixed with their screen name. IDs/order/modules unchanged.
- Validation (scratchpad/validate_review.py): 4 columns on every scenario sheet; MD identical to Excel; 0 duplicate IDs; 0 empty;
  0 duplicate titles; steps differ from originals only by the appended marker.

### 2026-10-30 ~17:55 – Exploration resumed (user approval) – Batch A2
- Inspector: row-menu opener no longer clicks items starting with "Invoice" (could generate an invoice).
- First A2 run: all 16 keys failed on CDP connect timeout (browser hung from orphan tabs of earlier stopped runs) – nothing opened, nothing saved.
  Fix: full stop of the isolated Admin-Web Chrome (all processes), fresh start (session persisted), `run.mjs` now always closes its tab
  (try/finally) and `steps/run-batch.sh` closes leftover tabs before each batch.
- A2 rerun started (16 keys: Batch A redos + gap follow-ups).
- Scenario updates will be appended with `scripts/append_scenarios.py` (append-only; previous rows unchanged; review files archived first).
- A2 rerun finished: 13/16 ok. Failed: role-users-r2 (page.screenshot timeout), role-roles-r2, client-regular-invoice-payment-r2 – to retry after B–E.
- Appended A2 scenarios: 584 → 652 (+68: Employee 13, Fleet 1, Booking 3, Client 28, Category 23). Previous review files archived to
  `documentation/scenarios/review/archive/20261030-182744/`.
- Batches B–E (49 keys: Vendor, Service, Financial, Inventory, CMS, Payment) running on 4 tabs.

### 2026-10-30 ~19:05 – Batches B–E
- 16/49 ok: Vendor (6/6), Service (8/11), Financial Dashboard + Receivables. 33 failed: heavy views (Financial, Manage Service Type,
  Job Tracker) exceeded the 7-min per-view limit, the runner killed them, 6 orphan tabs slowed Chrome → later CDP connect timeouts.
  No application/data impact.
- Fixes: orphan tabs closed via DevTools HTTP endpoint (`steps/close-extra-tabs.mjs`, now used by run-batch.sh); per-view 5-min time budget
  in inspect.mjs (stops opening more forms, saves partial result, marks `truncated`); hard limit 15 min; retry on 3 tabs.
- Retry batch `retry1` started: 36 keys (33 B–E + role-users-r2, role-roles-r2, client-regular-invoice-payment-r2).
- 19:10 – User asked to update the main documents: `scripts/update_original.py` appended the 248 new scenarios to
  `documentation/scenarios/Admin_Web_Scenarios_and_Use_Cases.xlsx|.md` (584 → 832). Existing 584 rows verified byte-identical;
  backup in `documentation/scenarios/archive/20261030-191020/`. 4 columns; MD = Excel; 0 duplicate IDs.
  Note: the original 584 rows still carry the 11 duplicate titles and no "(to be confirmed)" markers (those corrections exist only in the review copy).

### 2026-10-30 19:13 – STOPPED by user
- Retry batch retry1 stopped; no inspection processes running. Completed results (if any) saved in raw/inspect; not yet appended to documents.
