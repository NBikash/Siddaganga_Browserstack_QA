# Siddaganga BrowserStack QA — instructions for Claude Code

QA project for the **Banni** app (branded "Siddaganga Travels"), Android and iOS, tested on
**BrowserStack App Live** through the **Claude in Chrome** extension. There is no automation framework;
Claude drives App Live in the browser. `wdio.conf.js` (App Automate/Appium) exists but is optional.

## When the user asks to "run the QA project" / "set up" / "start testing"

Follow this order. Do not skip ahead to testing.

1. **Preflight (system):** run `node -v`. If Node is missing or older than 18.20, run
   `powershell -ExecutionPolicy Bypass -File setup\setup.ps1` (report only) and show the result.
   Ask the user before running it with `-Install` (it installs Node/Git/Chrome via winget).
2. **Doctor:** run `npm run doctor -- --json` and summarise it for the user (never print `.env` values —
   the doctor only reports variable names).
3. **Bootstrap if needed:** if any check in `deps`, `structure` or `security` FAILs, run `npm run setup`
   (idempotent: installs deps only when missing/out of sync, creates missing folders, creates `.env` from
   `.env.example` only if absent, appends `.gitignore` rules). Then re-run the doctor.
4. **Things Claude must not fix itself — tell the user exactly what to do:**
   - Missing `.env` values → list the variable names from the doctor and ask the user to edit `.env`
     locally. Never ask for credentials in chat, never write them anywhere.
   - FAIL on a versioned file (e.g. the Android inventory) → restore from Git; never regenerate it.
5. **Manual prerequisites (verify in-session):**
   - Claude in Chrome: call `tabs_context_mcp`. If the tools are unavailable or the extension doesn't
     respond, stop and tell the user to install/connect the Claude in Chrome extension (see SETUP.md §4).
   - BrowserStack login: open `https://app-live.browserstack.com/dashboard`. If redirected to
     `/users/sign_in`, stop and ask the user to sign in themselves. **Never type BrowserStack passwords.**
6. When the doctor reports READY and both manual checks pass, run the **`/qa-run`** workflow
   (`.claude/commands/qa-run.md`; full rules in `QA-RUN.md`).

## Project map
- `config/project.json` — prerequisites, env var names, required paths, module dependencies, approval list
- `config/android.json`, `config/ios.json` — build source, devices, inventory paths, output paths
- `manual-exploration/` — Android exploration baseline: `test-cases/banni-test-cases.csv|xlsx` (299 cases),
  `feature-map.md`, `app-info.md`, `session-notes/`. **Do not move, duplicate, or regenerate.**
- `android/`, `ios/` — per-platform results, reports, evidence (and iOS test cases/session notes)
- `testing/templates/` — results CSV, defect draft, run report templates
- `setup/` — `doctor.mjs`, `bootstrap.mjs`, `setup.ps1`; `scripts/upload-app.js` — build upload

## Hard rules
- **Credentials:** never hardcode, print, log, screenshot, or commit credentials, OTPs or access keys.
  `.env` stays git-ignored. The user enters the QA login on the device; Claude does not type passwords.
- **Irreversible actions need explicit approval each time** (list in `config/project.json →
  requiresExplicitApproval`): booking/inquiry Confirm, payments, Cancel Trip, logout, saving settings,
  support tickets, registrations/OTP/password resets, deletions, Jira tickets.
- **Test cases:** the Android 299-case inventory is the approved baseline. Add cases only for identified
  gaps, with new IDs continuing the `TC_<MODULE>_<NNN>` sequence, and only after the user approves the diff.
- **Build sources:** QA builds = uploaded APK (Android) / uploaded IPA (iOS). Play Store / App Store are
  future production-regression sources only — never mix them into QA-build runs. TestFlight is undecided;
  do not assume it.
- **Evidence:** crop or avoid personal data (phone numbers, emails, addresses) in screenshots.
- Git is managed by the user — do not `git init`, commit or push unless asked.
