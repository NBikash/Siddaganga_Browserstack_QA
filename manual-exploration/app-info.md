# Build & Environment

## Build under test
- App name: Banni — branded in-app as **Siddaganga Travels** ("Fleet Management Made Simple")
- Package name: `com.siddaganga` (React Native)
- Version / build: v1.1 — App Live upload `app-release.apk` (local file: `app-release_25thSept26.apk`)
- App Live app ID / upload date: uploaded 2026-09-28 (listed under App Live > Uploaded Apps)

## Target devices (App Live)
| # | Device | Android version | Priority |
|---|---|---|---|
| 1 | Google Pixel 7 | 13 | Primary (Session 01) |
| 2 | Samsung Galaxy (S/A series) | 14 / 15 | Secondary |
| 3 | Low-end device (e.g. Redmi / Realme) | 10–12 | Compatibility |

## Test accounts / data
Record only a reference to where credentials are kept — never the password or OTP itself.
| Role | Username / phone (reference) | Notes |
|---|---|---|
| One Time User (Personal login, mobile + password) | `BANNI_QA_PHONE` / `BANNI_QA_PASSWORD` in project `.env` (git-ignored) | Shows as "Regular Client"; used for Session 01 |
| Corporate User | _TBD_ | Needed for corporate login / booking flows |
| Disposable account | _TBD_ | For change-password, logout-all, delete-account tests |

## Scope notes
- In scope: onboarding, language, notification opt-in, sign in (personal/corporate, mobile/email), forgot password,
  registration (up to OTP), all authenticated modules (Home booking widget, Ride/My Bookings, Explore, Help, Account).
- Out of scope: Guest mode ("Continue as Guest"), automation, formal execution, defect logging (this phase).
- Known constraints:
  - OTP (registration / reset) needs a real SIM — not exercised.
  - Payments use **Razorpay** ("Pay Advance") — not exercised; needs test-mode keys/cards.
  - Inquiry submission creates real backend records (1 inquiry created in Session 01 with user approval — Inquiry ID 478).
  - Logout, Cancel Trip, Save Preferences, profile Submit, change password and support-ticket submit were **not** triggered.
  - BrowserStack viewport occasionally re-renders/freezes; "Change Location" can be used for current-location tests.
