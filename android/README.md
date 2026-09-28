# android/

Android-specific execution output. Configuration: `config/android.json`.

| Path | Purpose |
|---|---|
| `results/` | Per-run results CSV + defect drafts (`<run-id>.csv`, `<run-id>/defects/`) |
| `reports/` | Per-run execution reports (`<run-id>.md` / `.xlsx`) |
| `evidence/` | Screenshots for failures — **git-ignored** (may contain personal data) |

**Test cases are not stored here.** The approved Android baseline (299 cases) lives in
`manual-exploration/test-cases/banni-test-cases.csv` (+ `.xlsx`) and is referenced through
`config/android.json → testCases.inventoryCsv`. Do not move or duplicate it.

QA build source: uploaded APK on BrowserStack App Live (`app-release.apk`, `com.siddaganga` v1.1).
Google Play Store is a future production-regression source only (disabled).
