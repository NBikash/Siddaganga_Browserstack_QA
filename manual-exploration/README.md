# Banni Android — Manual Exploration (BrowserStack App Live)

Goal: explore the uploaded Banni Android build on real devices through BrowserStack App Live,
and produce a comprehensive test-case sheet. Out of scope: automation, test execution, defect logging.

## Layout

| Path | Purpose |
|---|---|
| `app-info.md` | Build under test, devices, test accounts (references only — no secrets) |
| `feature-map.md` | Screens/modules discovered and how they connect; coverage tracker |
| `session-notes/` | One file per exploration session (copy `_template.md`) |
| `screenshots/` | Captures from App Live, named `<module>_<screen>_<nn>.png` |
| `test-cases/banni-test-cases.csv` | The test-case sheet (source of truth; exported to .xlsx at the end) |

## Workflow

1. Open App Live → select the Banni build → pick a device from `app-info.md`.
2. Start a session note from `session-notes/_template.md`.
3. Walk a module end to end; capture screenshots of each distinct screen/state.
4. Update `feature-map.md` with screens, entry points and navigation.
5. Derive test cases per screen into the CSV (positive, negative, boundary, UI, navigation,
   permissions, interruptions, offline/network, device variations).
6. Mark the module covered in `feature-map.md`.

## Test-case ID convention

`TC_<MODULE>_<NNN>` — e.g. `TC_LOGIN_001`. Module codes are listed in `feature-map.md`.
