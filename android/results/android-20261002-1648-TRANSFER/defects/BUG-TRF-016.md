# BUG-TRF-016 — Vehicle Details from a Transfer search opens the fare breakup on the Local Trip tab

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case |  |
| Module | Vehicle Details & Fare Breakup |
| Severity (proposed) | Low |
| Priority (proposed) | Medium |
| Status | New |
| Build | Uploaded APK app-release_1stOct26.apk v1.1 (com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261002-1648-TRANSFER |
| Test account | Not required |
| Reproducibility | Always |

## Preconditions
-

## Steps to reproduce
1. Transfer P2P search Majestic -> KIA
2. Filters > Sedan
3. Open Sedan
4. View Fare Breakup

## Expected result
Breakup opens on the Transfer Trip tab (search context)

## Actual result
Opens on Local Trip tab (Local Package Pricing Rs 4,000). Footer is correct (Rs 8,000) - partial fix of the 01-10 finding.

## Evidence
- `android/evidence/android-20261002-1648-TRANSFER/TC_VDET_018_1_breakup-opens-local-tab.png`

## Error / API / log information
-

## Notes / suspected area
Remaining part of the TC_VDET_018 finding of 01-10 (footer now fixed).
