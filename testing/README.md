# testing/

Shared, platform-independent execution assets. The execution itself is performed by Claude Code
on BrowserStack App Live (see `QA-RUN.md`); there is no automation framework here.

| Path | Purpose |
|---|---|
| `templates/results-template.csv` | Columns for a per-run results file (`<platform>/results/<run-id>.csv`) |
| `templates/defect-draft-template.md` | Defect draft for each failure (`<platform>/results/<run-id>/defects/`) — never auto-submitted |
| `templates/run-report-template.md` | Optional short written summary (`<platform>/reports/<run-id>.md`) |
| `../scripts/qa-log.mjs` | Run log capture (`<platform>/results/<run-id>/run-log.json`): cases, bugs, credentials used (masked), notes |
| `../scripts/generate-report.mjs` | Standard HTML QA report `<platform>/reports/<run-id>/qa-report.html` + results CSV + defect drafts (run by `qa-log finish`) |

Run ID format: `<platform>-<YYYYMMDD-HHmm>-<scope>` e.g. `android-20261002-1430-full`, `android-20261002-1500-HOME`.

Statuses: `Pass`, `Fail`, `Blocked`, `Not Executed` (with reason, `blockCategory` and `dependency`). See QA-RUN.md → Reporting.
