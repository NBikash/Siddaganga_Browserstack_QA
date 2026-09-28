# QA-RUN — interactive QA workflow

Started with **`/qa-run`** in Claude Code (or "run the QA project", which first runs setup — see `CLAUDE.md`).
Execution approach: **BrowserStack App Live driven by Claude in Chrome.** No automation framework.

## 0. Gate: environment ready
`npm run doctor` shows READY, Claude in Chrome responds, and BrowserStack App Live opens without a
sign-in redirect. Otherwise stop and fix (see `SETUP.md`).

## 1. Choose platform
**Android** or **iOS**. Load `config/<platform>.json`.

- iOS: if `qaBuild.status` is not `available` (no IPA yet), explain that iOS execution/exploration is
  blocked and offer only "Generate/review test cases" (planning from the Android baseline) or stop.

## 2. Choose action

| Option | Summary |
|---|---|
| Generate / review test cases | Gap analysis against the existing inventory; add only missing coverage (with approval) |
| Execute the complete end-to-end suite | Run all approved, executable cases for the platform |
| Execute a specific module / feature | Run one module plus its dependent flows |
| Explore the application and derive test cases | Exploration session → session note → feature map → new cases |
| Other | Free-form request within the same rules |

## 3. Mode rules

### Generate / review test cases
1. Load the inventory (`testCases.inventoryCsv`), `featureMap`, `appInfo`, latest session notes.
2. Build a coverage matrix: module × test type (Positive, Negative, Validation, Boundary, Navigation,
   UI/UX, Business Flow, Error handling, Security, Compatibility, Accessibility, Non-functional).
3. List gaps and proposed new cases (IDs continue each module's sequence). **Do not regenerate or reword
   existing cases.**
4. Show the diff; write only after the user approves. Update the CSV (source of truth), regenerate the
   `.xlsx` from it, update `feature-map.md` counts, and — for Android — record the new baseline hash in
   `config/android.json → testCases.inventorySha256` and `expectedCount`.
5. iOS: create `ios/test-cases/banni-ios-test-cases.csv` using the Android header; adapt from actual iOS
   behaviour (after exploration), not by copying Android cases.

### Explore and derive test cases
1. Session note from `manual-exploration/session-notes/_template.md` (Android) or into `ios/session-notes/`.
2. Launch the QA build on the configured device; the **user** signs in on the device when credentials are needed.
3. Explore screens, navigation, forms, CTAs, business rules. Only positive/normal paths are *executed*;
   negative/boundary scenarios are *designed* unless the user explicitly asks to execute them.
4. Irreversible actions (see §5) only with explicit approval.
5. Update feature map, session note, then follow "Generate / review" steps 3–4 for new cases.

### Execute the complete end-to-end suite
1. Load the approved inventory. Ask for missing information: build to test (uploaded APK/IPA in App Live),
   device (default from config, or user choice), test account readiness, which irreversible actions are
   pre-approved for this run (default: none → those cases are marked `Not Executed`).
2. Create run ID `<platform>-<YYYYMMDD-HHmm>-full` and a results CSV from `testing/templates/results-template.csv`
   at `<platform>/results/<run-id>.csv`.
3. Launch App Live session → execute cases in dependency order (`config/project.json → moduleDependencies`),
   recording `Pass` / `Fail` / `Blocked` / `Not Executed` with actual result.
4. On failure: screenshot to `<platform>/evidence/<run-id>/<TC ID>_<n>.png` (personal data cropped),
   defect draft from `testing/templates/defect-draft-template.md` into `<platform>/results/<run-id>/defects/`.
   **Do not create Jira tickets unless explicitly asked.**
5. Report `<platform>/reports/<run-id>.md` from `testing/templates/run-report-template.md` (+ `.xlsx` if useful).
6. Never modify the inventory during execution; fill execution columns only in the per-run results file.

### Execute a specific module
1. Ask for the module (codes from the inventory, e.g. `HOME`, `BOOK`).
2. Resolve dependencies from `moduleDependencies`; run dependency flows as setup steps (not reported as
   separate results unless they fail and block the module).
3. Load only that module's cases; then steps 2–5 of the E2E mode with run ID `<platform>-<YYYYMMDD-HHmm>-<MODULE>`.

## 4. Build sources
| Purpose | Android | iOS |
|---|---|---|
| QA build (current) | Uploaded APK (App Live) | Uploaded IPA (App Live) — when available |
| Production regression (future, disabled) | Google Play Store | App Store |
| Other distribution | — | Undecided — do not assume TestFlight |

Never mix production-store installs into QA-build runs.

## 5. Actions requiring explicit approval (every time)
Booking/inquiry **Confirm**, **payments** (Pay Advance/Razorpay), **Cancel Trip**, **Logout** / Logout
From All Devices, changing password or **saving** profile/notification/permission settings, submitting
**support tickets**, **registrations / OTP / password resets**, deleting apps/data on BrowserStack,
creating **Jira** tickets. Without approval → mark the case `Not Executed (approval required)`.

## 6. Security
- Credentials live only in the local `.env`; the user types the QA login on the device.
- No credentials, OTPs, access keys or personal data in test cases, results, reports, screenshots or Git.
- `*/evidence/*` is git-ignored by default; review screenshots before sharing.

## 7. Known environment notes
- App Live can freeze/resize in Chrome; retake the screenshot, press `Ctrl + 0` if zoomed.
- On-screen keyboard: Shift characters (e.g. `@`) may need the device's on-screen key.
