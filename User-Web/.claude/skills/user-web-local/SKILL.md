---
name: user-web-local
description: User-Web (User App Preprod) Local module, explored and tested end to end. Log in, explore and test every Local function, using the LOCAL and ADDITIONAL_TEST_INFO sheets of the supplied Excel workbook. Run the minimum set of combinations that gives full functional, boundary and edge-case coverage, rotate vehicle types across combinations and modules, and finish with a detailed HTML test report. Use only after the user has provided the Preprod URL, login credentials and the Excel workbook.
---

# User-Web: Local module, minimum-combination full-coverage testing

Workstream: `User-Web/` (customer-facing User App, **Preprod** environment).
Scope: **Local module**, plus updates to the cross-module vehicle-coverage tracker (§5).

**Objective:** maximum functional and test-data coverage with the **minimum practical number of test combinations**,
so that the selected set is suitable for daily regression.

## 0. Gate: do not start without the inputs

Do not open the application, explore or test until the user has provided **all three** of these:

| Input | Notes |
|---|---|
| User App Preprod URL | Use it exactly as given. Never switch to production or another environment. |
| Login credentials | Keep them in a local, git-ignored `User-Web/.env` file (the user edits it). Never echo, print, log, screenshot or commit them. If the user pastes them in chat, don't repeat them back. If the login flow needs an OTP, the user enters it. |
| Excel workbook | Must contain the `LOCAL` and `ADDITIONAL_TEST_INFO` sheets. Read it with the `xlsx` skill or a Node/Python reader. Never modify the source file. |

If anything is missing, or either sheet is absent from the workbook, list what is missing and stop.

## 1. Rules (inherited from the project; they override this skill if they conflict)

- Follow root `CLAUDE.md` hard rules: credentials, evidence privacy, and Git (managed by the user).
- **Irreversible actions need explicit user approval every time.** This covers booking/inquiry Confirm, payments, Cancel Trip,
  logout, saving profile/settings, support tickets, registrations/OTP/password resets and deletions.
  Run each combination up to the final confirmation screen. Ask before submitting. If the action isn't approved,
  record that step as `Blocked (approval not given)`, not `Fail`.
- Do not modify `Admin-Web/`, `android/`, `ios/`, root config, scripts or docs. Everything for this workstream stays inside `User-Web/`.
- Browser driving: use Claude in Chrome (load the `chrome-browser` skill first). Work in a new tab. Avoid actions that trigger
  native JS dialogs. If tools fail 2–3 times, stop and ask. An environment or tooling failure is `Blocked`, not a product defect.
- Evidence: crop or avoid personal data (names, phone numbers, emails, addresses) in screenshots.
- Use Preprod data only. Record any booking or other data that the run creates.

## 1A. Mandatory fare verification (shared, all trip categories)

Whenever fare calculation is in scope, **read and follow `User-Web/.claude/shared/fare-verification.md` in full** before any
fare-related step. It is the single source for the procedure (Fare Breakup inspection, component recording, applied-fare
comparison, same-vehicle boundary checks, evidence, and the `Inconclusive – fare rule not confirmed` rule). Don't restate or change it here.

## 2. Log in

1. Open the Preprod URL in a new tab and confirm the environment (URL/banner) before doing anything else.
2. Log in with the provided credentials (or let the user sign in themselves if they prefer). Confirm the logged-in state
   without capturing account details.
3. If login fails, record the exact message and stop. Don't retry repeatedly, because that could lock the account.

## 3. Read and analyse the test data

1. **LOCAL sheet:** list the columns, row count and the distinct values per column (locations, dates, hours/packages,
   passengers, etc.). Record malformed, duplicate or ambiguous rows instead of silently fixing them.
2. **ADDITIONAL_TEST_INFO sheet:** pull out the **complete vehicle list** and any other rules or test info it contains
   (limits, capacities, notes). Treat it as the master list for vehicle coverage.
3. Build the **coverage dimensions**, each a list of values or classes that must be hit at least once:
   - Data: each distinct location/area, pickup-drop pattern, date class (today, future, far future, boundary),
     time class (earliest/latest allowed, past time), each hour/package option, passenger count classes
     (min, typical, max for the vehicle, above max), and each vehicle type.
   - Functional: every field, option, action and workflow found in §4.
   - Edge cases: invalid, blank or unserviceable inputs, boundaries, same pickup/drop, capacity mismatch, back/refresh,
     edits after selection, and session expiry where practical.

## 4. Explore the Local module

Before designing combinations, map every reachable part of the module and record it in
`User-Web/exploration-logs/local-exploration-log.md`:

- **Entry points:** how Local is reached (home tiles, menus, tabs, deep links).
- **Screens and states:** every screen, tab, modal, drawer, empty/loading/error state.
- **Fields:** for each field, record the label, type, required/optional, default, allowed values, min/max, format,
  validation messages, conditional fields, and auto-suggest behaviour.
- **Options:** hours/packages, vehicle categories, date/time pickers and their limits, passengers/luggage, add-ons,
  coupons/offers, fare breakdown, terms.
- **Actions:** every button and link (search, edit, swap, back, reset, apply, view details, proceed). Note the result of each one.
- **Workflows:** the end-to-end path from search through results, vehicle selection, review and confirmation (see §1),
  plus Local booking history/details and modify/cancel entry points.

Mark each finding as **Observed** or **Inferred**. Record doubts and defects in
`User-Web/documentation/Local_Open_Questions_and_Gaps.md`. Don't file them anywhere external.

## 5. Design the minimum set of combinations

Use the dimensions from §3 and the functions from §4 to choose the **smallest set of combinations that covers every value,
class, function and important edge case** (a covering-array / pairwise-style selection, not every row).

- Each combination is a realistic end-to-end flow that hits as many uncovered dimensions as possible.
  Add combinations only to cover what is still uncovered.
- Don't repeat similar combinations. Two combinations that differ only within the same equivalence class count as one.
- Keep negative/validation checks inside flows where they don't hide the result of the main flow.
  Use a separate short combination only when they would.
- **Vehicle rotation:**
  - Give each combination a **different vehicle type** wherever applicable (for example, 8 combinations means 8 different vehicles).
  - Prefer vehicles not yet used by earlier modules, using `User-Web/documentation/Vehicle_Coverage_Tracker.md`.
    Create the tracker on the first run if it doesn't exist, listing every vehicle from `ADDITIONAL_TEST_INFO`.
  - Respect each vehicle's passenger capacity. Use at least one combination to test the capacity boundary.
  - At the end, update the tracker with the vehicles this module used, so later modules carry on with the vehicles still uncovered.
    The goal is full vehicle coverage across all modules.
  - If a vehicle isn't offered for Local, or for the chosen data, record it as "not applicable to Local" with the reason.
- **Mandatory Local trip configurations.** All four must be covered, each by at least one executed combination:

  | Config | Multi-day | Different Drop Location |
  |---|---|---|
  | CFG-1 Normal trip | OFF | OFF |
  | CFG-2 Multi-day trip | ON | OFF |
  | CFG-3 Different drop location | OFF | ON |
  | CFG-4 Multi-day with different drop location | ON | ON |

  - Start the plan from these four. Load every other dimension (locations, dates, hours, passengers, vehicles, options,
    edge cases) onto them first, and add more combinations only for whatever they can't cover.
  - Each configuration may need its own fields (for example drop location, end date or number of days). Explore and test
    those fields' validation and limits inside the matching configuration.
  - Check the toggle transitions too: turning each toggle ON and OFF and what happens to fields already entered.
  - If a configuration isn't available in the UI or can't be completed, record it as `Blocked` with the reason. Never drop it silently.
- Give each combination the ID `USER-LOCAL-TC-NN`. Before executing, show the user the planned set as a table
  (combinations, data, vehicles, and what each covers) with the projected coverage %. Then proceed.

## 6. Execute

For each combination:

1. Enter the exact planned data. Record what was actually used, if it differs, along with the reason.
   Whenever the combination checks fares, follow `User-Web/.claude/shared/fare-verification.md` (§1A) before and after selecting the vehicle.
2. Check each step's expected result: fields, validations, results list, vehicle availability, fare/details and navigation.
3. Record the result as **Pass**, **Fail** or **Blocked**, plus the actual result, evidence screenshot paths
   (`User-Web/screenshots/local/<run-id>/`) and defect notes for failures (steps, expected vs. actual).
4. Before each major flow, and whenever a browser action fails, check that the page is responsive. Recover before retrying,
   and never retry input blindly.

Run ID: `user-web-YYYYMMDD-HHMM-LOCAL`. Save the raw results to `User-Web/results/<run-id>.csv`.

## 7. HTML test report

Generate a self-contained file `User-Web/reports/<run-id>/local-test-report.html` (inline CSS, no external dependencies,
readable in light and dark modes, personal data excluded). It contains:

1. **Summary:** environment (Preprod), run ID, date/time, browser, total combinations, Pass/Fail/Blocked counts,
   overall coverage %, and a **mandatory-configuration table** (CFG-1 to CFG-4 → covering combination IDs → status).
2. **Executed combinations:** one row or card each. Show the ID, title, the **trip configuration (CFG-n, with the Multi-day and
   Different Drop Location toggle states)**, the **exact test data** (pickup/drop locations, start/end dates or days, time,
   hours/package, passengers, vehicle type and any other fields used), steps, expected vs. actual result, status and
   evidence links.
3. **Coverage:** the functional areas covered, the edge cases and boundaries covered, and a coverage matrix
   (dimension values × combinations).
4. **Coverage %:** shown separately for functional, data-value, edge-case and vehicle coverage (Local, and cumulative across modules),
   along with how each was calculated.
5. **Uncovered:** every uncovered scenario, data combination or vehicle, with the reason (not applicable, blocked,
   approval not given, deliberately excluded as redundant).
6. **Defects and open questions:** with links to evidence.
7. **Fare checks:** for each fare check, the content required by `User-Web/.claude/shared/fare-verification.md`.

## 8. Output layout (create only when work starts, following the Admin-Web convention)

```
User-Web/
  .env                     credentials (git-ignored, user-maintained)
  .gitignore               .env, .auth/, exploration-logs/raw/
  documentation/           Local_Test_Combinations.md, Vehicle_Coverage_Tracker.md, Local_Open_Questions_and_Gaps.md
  exploration-logs/        local-exploration-log.md (raw dumps under raw/, git-ignored)
  results/                 <run-id>.csv
  screenshots/local/       evidence, personal data cropped
  reports/<run-id>/        local-test-report.html
```

## 9. Finish

Give the user a short summary with these figures: combinations executed, Pass/Fail/Blocked counts, status of CFG-1 to CFG-4, coverage %
(functional / data / edge-case / vehicle), vehicles used and vehicles still uncovered, defects and open questions.
Include the HTML report path and the paths to every file produced. Don't create tickets unless asked.
