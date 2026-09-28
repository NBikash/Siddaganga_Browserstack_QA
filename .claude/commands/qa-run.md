---
description: Interactive Banni QA workflow (setup check → platform → action) on BrowserStack App Live
---

You are running the Siddaganga BrowserStack QA workflow. Follow `QA-RUN.md` and the hard rules in `CLAUDE.md`.

## Step 1 — Environment gate
1. Run `npm run doctor -- --json`. If `ready` is false:
   - FAILs in `deps` / `structure` / `security` → run `npm run setup`, then re-run the doctor.
   - Node missing/too old → run `powershell -ExecutionPolicy Bypass -File setup\setup.ps1` and ask before `-Install`.
   - Anything still failing → explain it (names only, never secret values) and stop.
2. Report WARNs that matter for the chosen action (e.g. missing `BANNI_QA_*` before authenticated runs).
3. Verify Claude in Chrome: load the browser tools and call `tabs_context_mcp`. If unavailable → tell the
   user to install/connect the extension (SETUP.md §1) and stop.
4. Verify BrowserStack: open `https://app-live.browserstack.com/dashboard` in a new tab. If it redirects to
   sign-in → ask the user to sign in themselves, then continue. Never type passwords.

## Step 2 — Platform
Use AskUserQuestion: "Which platform do you want to test?" — options **Android**, **iOS**.
Load `config/<platform>.json`. For iOS with `qaBuild.status != "available"`, say the IPA is not available yet
and only offer test-case planning or stop.

## Step 3 — Action
Use AskUserQuestion: "What do you want to do?" — options:
- **Generate/review test cases**
- **Execute the complete end-to-end test suite**
- **Execute a specific module/feature**
- **Explore the application and derive test cases**
("Other" is provided automatically.)

For a specific module, ask which module next (list module codes/names from the inventory).

## Step 4 — Confirm the plan before doing anything
Summarise: platform, action, build source (uploaded APK / IPA), device, inventory path and case count,
output paths (run ID), and which irreversible actions are NOT approved (default: all). Ask the user to
confirm or pre-approve specific irreversible actions for this run. Then proceed per `QA-RUN.md §3`.

## Always
- Never expose or store credentials; the user signs in on the device.
- Never modify the approved inventory without showing the diff and getting approval.
- Draft defects only; no Jira unless asked.
- Finish with a short summary: what was done, where outputs were written, what is blocked and why.
