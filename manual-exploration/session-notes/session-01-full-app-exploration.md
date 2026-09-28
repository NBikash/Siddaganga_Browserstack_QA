# Session 01 — Full app exploration (pre-login + authenticated)

- Date: 2026-09-28
- Device / Android version: Google Pixel 7 / Android 13 (BrowserStack App Live, driven via Chrome)
- Build: app-release.apk v1.1 (`com.siddaganga`)
- Account: One Time User, personal mobile login (credentials in `.env`; login performed by the user)
- Charter: Map every screen, navigation path, form, CTA and business rule of the app to derive the test-case sheet.
  No formal execution, no defect logging. Guest mode out of scope.

## Screens visited
| Screen | Screenshot | Observations |
|---|---|---|
| Onboarding P1–P3 | – | Skip/Back/Continue/Get Started |
| Choose Your Language | – | Telugu native label shows Tamil (OBS-01) |
| Stay Updated | – | Enable Notifications → no OS dialog on BrowserStack |
| Welcome / Sign In / Mobile / Email | – | +91 fixed, 10-digit max, 6–9 prefix validation, email validation on blur |
| Reset Password | – | Email/Mobile methods; no +91 prefix (OBS-04) |
| Create Your Role / Create Your Account | – | Required-field errors; numeric name accepted (OBS-06) |
| Home (Local/Outstation/Transfer/Multi) | – | Date/time sheets, multi-day multi-select calendar, add destinations, legs |
| Location picker | – | Google Places autocomplete, Use Current Location |
| Trip Summary → Available Vehicles → Vehicle Details | – | Fare breakup tabs; data inconsistencies (OBS-12/14) |
| Confirm Your Trip → Inquiry Submitted | – | Inquiry ID 478 created (user approved) |
| Ride / My Bookings / Inquiry Details | – | Period + status filters; Razorpay Pay Advance; Cancel Trip |
| Explore / Filters / Comparison | – | 7 filter groups; 2-vehicle comparison |
| Help (Trip-Based Support, General Complaint, FAQ, History) | – | Dropdowns empty; customer can set Assign To/Status |
| Account (Profile, Settings, Invoices, Rewards, Notifications, Privacy) | – | GST fields; password rules; notification toggles |

Screenshots were not exported (App Live captures were viewed live only).

## Behaviours & business rules observed
- Mobile numbers: +91 fixed, exactly 10 digits, must start 6–9.
- Password policy (Account Settings): ≥ 8 chars, upper + lower case, ≥ 1 digit, ≥ 1 special character.
- Pickup time in 30-minute steps; multi-day uses a multi-select calendar with past dates disabled.
- Local package: 8 hr / 80 km base; extra km and extra hour charges; bata (driver allowance) night windows; toll/parking at actuals; GST extra.
- Transfer: short (< 30 km) and long (> 30 km) slabs.
- Inquiry flow: Search → Summary → Vehicle → Book Now → Confirm → "Inquiry Submitted" (estimate only, "You won't be charged yet").
- My Bookings period filter works on trip dates, not creation date.
- Advance payment default ₹500 via Razorpay; invoice generated later.

## Questions / ambiguities (for product owner)
- Multi-day pricing: should base cost multiply by number of days? (OBS-16)
- When should night bata apply? Labels read oddly (OBS-15/16).
- Which rate is correct for extra km on Outstation (₹35 vs ₹55)? (OBS-14)
- Should customers set "Assign To" / "Status" on support tickets? (OBS-23)
- Is account deletion planned in-app? (OBS-26)
- Rewards data seems static (OBS-25).

## Test-case ideas → moved to CSV
- [x] 299 test cases in `test-cases/banni-test-cases.csv` / `.xlsx` (observations listed on the "Observations" sheet)
