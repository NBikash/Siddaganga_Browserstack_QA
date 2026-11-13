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

## 1a. Saagane by Siddaganga (only when explicitly selected)
Banni is the default app. Use Saagane only when the user names it. Then everything in this document applies, with:

| Item | Saagane |
|---|---|
| Doctor / setup | `npm run doctor -- --app saagane --json`, `npm run setup -- --app saagane` |
| Config | `config/saagane/android.json` (Android only); registry `config/project.json → apps.saagane` |
| Build | Latest Saagane APK in App Live → Uploaded Apps (not stored locally). Confirm the app name, record the build name/upload date shown in App Live in the run log `--build` |
| Roles | **Superadmin first**, then Admin as a separate run/session; record the role in `--scope` |
| Test accounts | `SAAGANE_SUPERADMIN_*`, `SAAGANE_ADMIN_*` in `.env` — the user signs in on the device |
| Inventory | `manual-exploration/saagane/test-cases/saagane-test-cases.csv` — does not exist until Saagane is explored; never reuse Banni cases. Start with **Explore** |
| Session notes | `manual-exploration/saagane/session-notes/` |
| Approvals | `config/project.json → apps.saagane.requiresExplicitApproval` (admin actions change real data) |
| Run ID | `saagane-android-<yyyymmdd>-<hhmm>-<ROLE>-<SCOPE>` |
| Run log | `node scripts/qa-log.mjs init --app saagane --platform android --run-id <id> ...` → `android/results/saagane/<id>/` |
| Evidence / report | `android/evidence/saagane/<id>/`, `reports/saagane/<id>/qa-report.html` |

Never write Saagane results, evidence or cases into Banni paths, or Banni artifacts into Saagane paths.

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
5. Report: `node scripts/qa-log.mjs finish --run <run-id>` generates the standard outputs (see **Reporting** below).
   The Markdown template `testing/templates/run-report-template.md` remains available for a short written summary.
6. Never modify the inventory during execution; fill execution columns only in the per-run results file.

### Reporting (standard for every execution run)
Every execution (E2E, module, or partial) is captured in a run log and reported the same way:
1. **Start:** `node scripts/qa-log.mjs init --platform <p> --run-id <run-id> --scope "..." --device "..." --os <v> --build "..."`
   → `<platform>/results/<run-id>/run-log.json` and `<platform>/evidence/<run-id>/`.
2. **During the run** (log in short bursts - App Live closes idle sessions after a few minutes without device input):
   - `qa-log case --run <id> --json '{...}'` (or `@file.json`, object or array) - `id, status, actual, startedAt, endedAt, evidence[], bugs[], notes`.
     Scenario/steps/expected/type/priority are pulled from the inventory automatically.
   - Newly discovered cases: add `"isNew": true` plus `module, feature, scenario, testType, priority, preconditions, steps, testData, expected`.
   - Not executed: `status` `Blocked` (external dependency, or attempted and blocked - add `"attempted": true`) or `Not Executed`
     (pending / approval required), with `blockCategory` and `dependency`.
   - `qa-log bug` (defect with steps, expected, actual, errorInfo, evidence), `qa-log cred` (account type/method only, masked),
     `qa-log note` (environment), `qa-log approval`.
   - Screenshots only for failures, bugs/observations, key validation states and case-required evidence:
     `<platform>/evidence/<run-id>/<TC ID>_<n>_<hint>.png` (personal data cropped).
3. **End:** `node scripts/qa-log.mjs finish --run <id>` (add `--partial "reason"` for an interim report; the run can be resumed
   and finished again). This writes:
   - `<platform>/reports/<run-id>/qa-report.html` - self-contained HTML QA report (screenshots embedded; `--link` via
     `node scripts/generate-report.mjs --run <id> --link` references them instead): 1 Bug Summary, 2 Detailed Bug Reports,
     3 Edge Cases Tested, 4 Coverage Summary, 5 Credential Utilization, 6 Execution Time, 7 Scenario Log, 8 Not Executed Cases.
   - `<platform>/results/<run-id>.csv` (results template columns) and `<platform>/results/<run-id>/defects/<BUG>.md` drafts.
   - `.env` values are redacted from every output as a safety net - still never log them.
4. Coverage = executed (Pass + Fail) ÷ cases in scope. Blocked / Not Executed are never counted as covered, passed or failed.
5. New cases go into the inventory only after the run, per "Generate / review test cases" step 4 (marked as new in Remarks).
6. Always print the report path in the final Claude output.

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
- App Live can freeze/resize in Chrome - follow §8 (viewport probe + recovery) rather than retrying input.
- On-screen keyboard: Shift characters (e.g. `@`) may need the device's on-screen key (Shift is not transmitted: `@`→2, capitals→lowercase).
- Keep the Chrome window that hosts App Live **un-minimized**: a minimized window stops painting, screenshots time out and
  App Live closes the session for inactivity. Fast desktop typing can drop digits - verify typed values on screen.

## 8. BrowserStack App Live viewport stability & recovery (all Android/iOS runs)
The App Live viewport can collapse/shrink, stop painting (window minimised or covered) or freeze. Device input sent
into a broken viewport is lost or lands on the wrong element, so **never keep retrying device actions while the
viewport is unusable**. A renderer/viewport problem is an **environment** issue, never an application defect.

**Health check** — `scripts/app-live-viewport-check.js` (read-only). Run it in the App Live tab with Claude in Chrome
`javascript_tool` (the whole file as `text`); it returns `ok`, `problems[]`, `actions[]` and measurements
(page viewport, `visibilityState`, device stream `#bslive_video` size/readyState, Logcat width, session-ended text).
It is cheaper than a screenshot and works while screenshots time out.

**When to run it**
- Before every major scenario/flow (start of each module/feature block, before an end-to-end path).
- Immediately when a Chrome/App Live interaction fails, a screenshot/zoom times out (`Page.captureScreenshot`), or a
  screenshot comes back at an unexpected size.

**Known root cause (2026-09-30):** Claude in Chrome may open its tab group in a **separate Chrome window**. If that window
is minimised or covered, the tab stops painting; screenshot/zoom captures then time out, and a timed-out `zoom` can
leave the page viewport shrunk to the zoom-region size (e.g. 154×140, 234×519). The probe flags a minimised window
(`screenX ≈ -25600`, tiny outer size). Only the user can restore it (taskbar) — tell them it is the window holding the
App Live tab, not necessarily the Chrome window they are looking at. Avoid `zoom` while the tab is not visible.

**Recovery procedure** (when `ok` is false)
1. Stop sending device input.
2. Follow the probe's `actions`, in this order:
   - Window minimised (probe `minimised: true`) → **fullscreen restore** (keeps the session and login): via `javascript_tool` run
     `document.addEventListener('click',()=>document.documentElement.requestFullscreen(),{once:true,capture:true})`, then
     `left_click` a neutral page area (grey background, not the device); re-probe (`screenX` ≥ 0, outer size normal) and take one
     screenshot to re-anchor coordinates. Only if that fails, **rebuild automatically**
     (see "Automatic session rebuild" below). `visibilityState` alone is only a warning - that window can report
     `hidden` while it still paints; confirm with one screenshot.
   - Page viewport collapsed → `resize_window` (~1550×820); if `innerWidth/innerHeight` stay small, ask the user to press
     **Ctrl + 0** (browser zoom 100%) and close Chrome side panels (Claude's tools cannot send Ctrl+0).
   - Device rendered too small / not in view → collapse the App Live **DevTools/Logcat** panel (toolbar "DevTools"
     toggle) and reset the toolbar **Zoom** so the whole device fits without scrollbars.
   - Stream not rendering → wait 5–10 s for the renderer to recover.
3. Re-run the probe; continue only when `ok` is true, then take one screenshot to re-anchor coordinates (they shift
   after any resize/zoom/fullscreen). **Check the screenshot's coordinate frame equals the probe's `innerWidth x innerHeight`**
   (±3%). If it does not (e.g. frame 1568x746 vs viewport 1536x674), a timed-out `zoom` left an emulation override and taps
   land offset - call `resize_window` (same size) to clear it, then screenshot again.
4. **Do not restart the App Live session** for a temporary viewport/renderer issue — a new session reinstalls the app and
   loses the login. Restart only if the probe reports the session ended/timed out.
5. If recovery fails after a reasonable number of attempts (≈3 probe/recovery cycles, or ≈5 minutes including one user
   request): record the affected case as `Blocked`, `blockCategory` **"Environment - BrowserStack"**, `attempted: true`,
   reason **"BrowserStack App Live viewport/renderer unavailable"**, `dependency` "Stable App Live viewport/session";
   add a `qa-log note` describing the incident; continue with the next independent case once the viewport is usable.
   Never log it as a bug.

**Automatic session rebuild** (window cannot be restored, tab unavailable, session expired, extension reconnected)
1. `qa-log checkpoint` (last completed / current / next case + app state) and `qa-log recovery` (issue, detection, actions).
2. Clear the App Live unload prompt (`window.onbeforeunload = null` via `javascript_tool`), then `tabs_close_mcp` the tab —
   closing the group's last tab removes the group; `tabs_context_mcp {createIfEmpty:true}` then opens a **new, normal window**.
3. Open `https://app-live.browserstack.com/dashboard`, select the uploaded APK, start the configured device/OS.
4. Restore app state: onboarding Skip → Sign In → Login with Mobile; **stop only for the manual login** (Claude never types
   passwords), then navigate to the flow of the current case.
5. Resume from `checkpoint.current` (re-run it only if its result was not recorded); never re-run recorded cases
   (`qa-log show` lists them). Update the recovery event with the outcome.
6. If the rebuild fails, mark the current case `Blocked` ("BrowserStack App Live viewport/renderer unavailable") and continue
   with independent cases once any session is available. Ask the user to fix the setup only when no tool path remains.

**Stale-frame guard (mandatory before irreversible-adjacent taps)**
- Before tapping a control that opens or sits next to an irreversible action (Book Now, Confirm, Pay Advance, Cancel Trip,
  Logout, Submit), verify the stream is live: the device clock changed since the last screenshot, or `#bslive_video.currentTime`
  advances. Never repeat a tap on such a control because "nothing happened" - first re-probe and take a fresh screenshot;
  the previous tap may have opened a modal whose Confirm button now sits under the pointer.
- Incident 2026-09-30 (run android-20260930-1058-LOCAL): a repeated Book Now tap during a frozen stream submitted Inquiry 506.

**Efficiency**
- Screenshots only for failures, defects, key validation/error states and case-required evidence — not for every passing step.
- Prefer small `zoom` regions of the device over full screenshots; use the probe (not repeated screenshots) to detect
  rendering problems; do not wait indefinitely on a screenshot when device interaction still works.
- Log results in short bursts (`qa-log case`) so a lost session never loses results; the run log is resumable.
