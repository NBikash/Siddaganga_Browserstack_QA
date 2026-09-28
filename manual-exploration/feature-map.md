# Feature Map & Coverage

Filled in during exploration. Test-case counts come from `test-cases/banni-test-cases.csv` (299 total, Session 01).

## Modules
| Code | Module | Screens found | Explored | Test cases | Notes |
|---|---|---|---|---|---|
| ONB | Onboarding | 3-page carousel | ☑ | 9 | Skip / Back / Continue / Get Started |
| LANG | Language Selection | Choose Your Language | ☑ | 9 | EN/HI/KN/TE; Telugu label bug (OBS-01) |
| NOPT | Notification Opt-in | Stay Updated | ☑ | 5 | No OS dialog seen on BrowserStack |
| WEL | Welcome | Welcome to Siddaganga | ☑ | 4 | Guest out of scope |
| LOGIN | Sign In | Sign In to Continue, Mobile, Email | ☑ | 25 | Personal / Corporate tabs |
| FPWD | Forgot / Reset Password | Reset Password | ☑ | 11 | Email link / Mobile OTP |
| REG | Registration | Create Your Role, Create Your Account | ☑ (to OTP) | 12 | OTP not exercised |
| HOME | Home – Start Your Journey | Home, date/time sheets, multi-day calendar | ☑ | 42 | Local / Outstation / Transfer (P2P, By Hour) / Multi |
| LOC | Location Picker | Pickup / Drop / Destination search | ☑ | 14 | Google Places autocomplete |
| TRIP | Trip Summary & Vehicle Search | "Now you're ready to explore" sheet | ☑ | 7 | Vehicle Age Preference |
| VLIST | Available Vehicles | Vehicle list | ☑ | 9 | Category/brand chips, Filters |
| VDET | Vehicle Details & Fare Breakup | Vehicle Details | ☑ | 14 | Local/Outstation/Transfer breakup |
| CONF | Confirm Trip & Inquiry Submission | Confirm Your Trip, Inquiry Submitted | ☑ | 10 | 1 inquiry submitted (approved) |
| BOOK | Ride – My Bookings | My Bookings | ☑ | 10 | Today/Week/Month; Live/Upcoming/Completed/Inquired |
| INQ | Inquiry Details & Payment | Inquiry Details | ☑ | 10 | Razorpay Pay Advance, Cancel Trip not executed |
| EXPL | Explore – Fleet Catalogue | Explore grid | ☑ | 5 | |
| FILT | Explore – Filters | Filters sheet | ☑ | 9 | 7 filter groups |
| CMP | Explore – Vehicle Comparison | Compare mode, comparison modal | ☑ | 10 | |
| HELP | Help & Support | Help, Trip-Based Support, General Complaint, FAQ, History | ☑ | 15 | Ticket submit not executed |
| ACC | Account Menu | Account | ☑ | 6 | Logout not executed |
| PROF | Personal Information | Edit User Information (+GST) | ☑ | 12 | |
| ASET | Account Settings | Change password, Logout all devices | ☑ | 9 | |
| INV | Invoices & Receipts | Invoices | ☑ | 4 | Empty state only |
| RWD | Rewards & Loyalty | Rewards | ☑ | 4 | |
| NSET | Notification Preferences | Notifications | ☑ | 6 | |
| PRIV | Privacy & Security | Privacy & Security, Privacy Policy | ☑ | 6 | No delete-account option |
| NAV | Global Navigation & Session | Bottom nav | ☑ | 6 | |
| NFR | Cross-cutting / Non-functional | – | ☐ | 16 | Planned checks only |

## Navigation
Launch → Onboarding P1 → P2 → P3 → "Get Started" → Choose Your Language → Stay Updated → Welcome
Welcome → Sign In → Sign In to Continue (Personal | Corporate) → Login with Mobile | Login with Email → Home
Sign In (Mobile/Email) → "Forgot Password?" → Reset Password (Email | Mobile)
Welcome → Create Account → Create Your Role → Create Your Account → (OTP – not observed)
Home → Pickup/Drop field → Location Picker → back to Home
Home → Search Vehicles → Trip Summary sheet → Search Vehicles → Available Vehicles → card → Vehicle Details → Book Now → Confirm Your Trip → Confirm → Inquiry Submitted → Track My Inquiry → Ride / My Bookings → View Details → Inquiry Details (Pay Advance | Cancel Trip)
Explore → Filters sheet | Compare Vehicles → select 2 → Vehicle Comparison → View Full Details → Vehicle Details
Help → Raise Ticket (Trip-Based Support) | Submit Feedback (General Complaint) | My Support History
Account → Personal Information | Account Settings | Invoices & Receipts | Booking History (→ Ride) | My Support Tickets (→ Help history) | Rewards & Loyalty | Notifications | Privacy & Security | Logout

Full table: `test-cases/banni-test-cases.xlsx` → "Navigation Flow" sheet.

## Cross-cutting checks (apply per module)
- [ ] Runtime permissions (grant / deny / "don't ask again") — notifications, location, camera
- [ ] Network: offline, slow network, reconnect
- [ ] Interruptions: background/foreground, incoming call, notification
- [ ] Orientation / screen size
- [ ] Back button & deep navigation
- [x] Input validation: empty, max length, special characters (observed on login/registration; rest derived)
- [ ] Localization / text overflow (Hindi, Kannada, Telugu)
- [ ] Session: logout, token expiry, app relaunch
