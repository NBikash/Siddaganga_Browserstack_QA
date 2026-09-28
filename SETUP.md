# SETUP — fresh Windows machine

Goal: clone the repo, open Claude Code, say **"run the QA project"**. Claude runs the checks below
automatically; this page documents what they do and the few steps only a human can do.

## 1. One-time manual prerequisites

| # | What | How |
|---|---|---|
| 1 | Claude Code | Install per https://docs.claude.com/claude-code and sign in |
| 2 | Google Chrome | `winget install -e --id Google.Chrome` (setup can do this) |
| 3 | Claude in Chrome extension | Install from the Chrome Web Store, sign in, and connect it to Claude Code |
| 4 | BrowserStack login | Sign in at https://www.browserstack.com in **the same Chrome profile** (App Live access required) |
| 5 | `.env` values | Fill in locally after setup creates `.env` (see §3). Never paste them into chat. |

## 2. Automated setup

```powershell
git clone <repo-url>
cd Siddaganga-BrowserStack-QA
claude            # then type: run the QA project
```

What Claude runs (you can also run them yourself):

| Command | What it does | Changes anything? |
|---|---|---|
| `powershell -ExecutionPolicy Bypass -File setup\setup.ps1` | Checks Node.js, npm, Git, Chrome, winget | No (report only) |
| `... setup\setup.ps1 -Install` | Installs missing Node LTS / Git / Chrome via winget, then `npm run setup` | Yes — asks first |
| `npm run doctor` | Full environment check (below) | No |
| `npm run doctor -- --json` | Same, machine-readable | No |
| `npm run setup` | Idempotent bootstrap, then re-runs the doctor | Only what is missing |

### Doctor checks
- **System:** OS, Node.js (min 18.20, recommended 20+), npm (min 9), Git (optional), Chrome
- **Dependencies:** `node_modules` present; every package in `package.json` installed, satisfies its range and matches `package-lock.json`
- **Structure:** required files and folders (`config/project.json → requiredPaths`)
- **Test cases:** Android inventory present with 299 cases (and unchanged vs. the recorded hash); iOS inventory status
- **Platforms:** QA build source per platform; production-regression sources shown as future/disabled
- **Config:** `.env` exists; required variable **names** set or missing (values are never shown)
- **Security:** `.gitignore` covers `.env`, builds and evidence; `.env` not tracked by Git
- **Manual:** Claude in Chrome + BrowserStack login — verified by Claude in the session

### Bootstrap guarantees (idempotent)
- `npm ci` runs **only** if dependencies are missing or out of sync
- Missing folders are created; nothing is deleted
- `.env` is created from `.env.example` **only if it does not exist** — an existing `.env` is never modified
- `.gitignore` rules are appended if missing; existing lines untouched
- Re-running changes nothing when the environment is already correct

## 3. Environment variables (`.env`, git-ignored)

| Variable | Needed for | Required? |
|---|---|---|
| `BANNI_QA_PHONE`, `BANNI_QA_PASSWORD` | Authenticated exploration/execution (you type them on the device) | Yes, before authenticated runs |
| `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` | Command-line build upload (`npm run upload:android/ios`) | Only for CLI uploads — the App Live web UI works without them |
| `ANDROID_APP_LIVE_URL`, `IOS_APP_LIVE_URL` | Remembering the uploaded build's `bs://` id | Optional |
| `BROWSERSTACK_APP` | App Automate / Appium only | Not required |

BrowserStack keys: https://www.browserstack.com/accounts/profile/details

Variables may also be set as Windows user/system environment variables instead of `.env`; those take
precedence. The doctor shows which source each required variable comes from (never the value).

## 4. Troubleshooting
| Symptom | Fix |
|---|---|
| Claude says browser tools are unavailable | Install/enable the Claude in Chrome extension and connect it; restart Claude Code |
| App Live redirects to Sign in | Sign in to BrowserStack yourself in that Chrome profile, then tell Claude to continue |
| App Live page looks tiny / zoomed | Click the App Live tab and press `Ctrl + 0` |
| `npm ci` fails behind a proxy | Configure `npm config set proxy ...` then `npm run setup` |
| `node` not found after install | Open a new terminal (PATH refresh) and re-run `npm run setup` |

## 5. Uploading builds
- Android QA build: App Live → Uploaded Apps → Upload `.apk`, or `npm run upload:android -- path\to\app.apk`
- iOS QA build: App Live → Uploaded Apps → Upload `.ipa`, or `npm run upload:ios -- path\to\app.ipa`
- Build files (`*.apk`, `*.aab`, `*.ipa`) are git-ignored.
