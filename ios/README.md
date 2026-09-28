# ios/

iOS-specific artifacts. Configuration: `config/ios.json`.

**Status: awaiting the first IPA.** The App Live iOS environment was verified on 2026-09-28
(iPhone 17 Pro, iOS 26.6). No iOS exploration or test cases exist yet.

| Path | Purpose |
|---|---|
| `test-cases/` | iOS inventory (`banni-ios-test-cases.csv/.xlsx`) — created by `/qa-run` once an IPA is available |
| `session-notes/` | iOS exploration session notes |
| `results/` | Per-run results CSV + defect drafts |
| `reports/` | Per-run execution reports |
| `evidence/` | Failure screenshots — **git-ignored** |

QA build source: uploaded IPA on App Live (when available).
App Store is a future production-regression source only (disabled).
TestFlight / other distribution: **not decided — do not assume or use.**
