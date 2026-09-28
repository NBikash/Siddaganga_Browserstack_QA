# Siddaganga BrowserStack QA

QA for the **Banni** app (Siddaganga Travels) on **BrowserStack App Live**, Android and iOS,
driven by **Claude Code** through the **Claude in Chrome** extension.

## Quick start (after cloning)
```powershell
cd Siddaganga-BrowserStack-QA
claude
```
Then type: **run the QA project** (or `/qa-run`). Claude checks and prepares the environment, then asks:
platform (Android / iOS) → action (review test cases, full E2E run, module run, explore & derive).

- Setup details and prerequisites: [SETUP.md](SETUP.md)
- Workflow and rules: [QA-RUN.md](QA-RUN.md)
- Claude's operating instructions: [CLAUDE.md](CLAUDE.md)

## Layout
```
setup/                 doctor.mjs (read-only checks), bootstrap.mjs (idempotent setup), setup.ps1 (Windows preflight)
scripts/               upload-app.js (App Live / App Automate build upload)
config/                project.json, android.json, ios.json
manual-exploration/    Android exploration baseline — 299-case inventory, feature map, session notes
android/               Android results, reports, evidence (inventory referenced from manual-exploration/)
ios/                   iOS test cases, session notes, results, reports, evidence (awaiting IPA)
testing/templates/     results CSV, defect draft, run report templates
reports/               cross-platform summaries
test/, wdio.conf.js    optional App Automate/Appium smoke setup (not used by the App Live workflow)
```

## Status
| Platform | QA build | Test cases | Default device |
|---|---|---|---|
| Android | Uploaded APK `com.siddaganga` v1.1 | 299 (Session 01) | Google Pixel 7 / Android 13 |
| iOS | Awaiting IPA | Not created | iPhone 17 Pro / iOS 26 (environment verified) |

Credentials live only in the local, git-ignored `.env` (template: `.env.example`).
