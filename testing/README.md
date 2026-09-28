# testing/

Shared, platform-independent execution assets. The execution itself is performed by Claude Code
on BrowserStack App Live (see `QA-RUN.md`); there is no automation framework here.

| Path | Purpose |
|---|---|
| `templates/results-template.csv` | Columns for a per-run results file (`<platform>/results/<run-id>.csv`) |
| `templates/defect-draft-template.md` | Defect draft for each failure (`<platform>/results/<run-id>/defects/`) — never auto-submitted |
| `templates/run-report-template.md` | Execution summary (`<platform>/reports/<run-id>.md`) |

Run ID format: `<platform>-<YYYYMMDD-HHmm>-<scope>` e.g. `android-20261002-1430-full`, `android-20261002-1500-HOME`.

Statuses: `Pass`, `Fail`, `Blocked`, `Not Executed` (with reason).
