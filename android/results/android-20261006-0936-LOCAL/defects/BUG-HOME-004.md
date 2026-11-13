# BUG-HOME-004 — 'Different drop location' (and 'Multi-day trip') label text is not tappable - only the small switch toggles

> Draft only. Not submitted to Jira or any tracker unless the user explicitly asks.

| Field | Value |
|---|---|
| Platform | Android |
| Test case | TC_HOME_025 |
| Module | Home - Start Your Journey |
| Severity (proposed) | Low |
| Priority (proposed) | P3 |
| Status | New |
| Build | Uploaded APK app-release_5Oct26.apk (v1.1, com.siddaganga) |
| Device / OS | Google Pixel 7 / Android 13 (BrowserStack App Live) |
| Run ID | android-20261006-0936-LOCAL |
| Test account | Not required |
| Reproducibility | Always (2/2 attempts) |

## Preconditions
Logged in; Home > Local form

## Steps to reproduce
1. Scroll to Additional Options
2. Tap on the text 'Different drop location'

## Expected result
Tapping the label toggles the option (standard Android checkbox/switch row behaviour, larger touch target).

## Actual result
Nothing happens; only tapping the small switch to the left of the label toggles the option and shows the Drop Location field.

## Evidence
- `android/evidence/android-20261006-0936-LOCAL/TC_HOME_025_1_label-tap-no-toggle.png`

## Error / API / log information
Accessibility/usability: small touch target.

## Notes / suspected area
New observation in this run.
