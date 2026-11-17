# Siddaganga Travels User Web (Preprod) – Functional Test Cases, All Modules

Generated 2026-11-17 from exploration of the Preprod site. Source of truth: `steps/allmod/cases-*.mjs` (each case is also the executable check).

**Total:** 116 cases · Critical 13 · High 49 · Medium 43 · Low 11

| Module | Cases | Functional | Negative | Boundary | Edge/Other |
|---|---|---|---|---|---|
| Navigation & Content | 20 | 18 | 1 | 0 | 1 |
| Authentication & Profile | 11 | 8 | 2 | 0 | 1 |
| Fleet | 5 | 5 | 0 | 0 | 0 |
| Customer Support | 7 | 5 | 1 | 0 | 1 |
| Services & About | 3 | 3 | 0 | 0 | 0 |
| Local | 21 | 10 | 6 | 4 | 1 |
| Outstation | 13 | 7 | 2 | 3 | 1 |
| Transfer P2P | 10 | 7 | 2 | 1 | 0 |
| Transfer P2P+Return | 2 | 1 | 1 | 0 | 0 |
| Transfer By Hour | 7 | 2 | 1 | 3 | 1 |
| Multi-Leg | 9 | 6 | 2 | 1 | 0 |
| Results & Vehicle Details | 8 | 6 | 0 | 0 | 2 |

Test data comes from `User_WEB_cases.xlsx` (LOCAL, OUTSTATION, TRANSFER_P2P, TRANSFER_P2P+RETURN, TRANSFER_BYhr, ADDITIONAL_TEST_INFO). Dates are relative to the run date (D+n). Irreversible steps (Confirm & Submit, Save As Draft, tickets, profile save, logout) need explicit approval each time; without it they are recorded as *Blocked (approval not given)*.

## Navigation & Content

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_NAV_001 | Home page loads with all key sections | Functional | Critical | URL / | Open home page | Hero, Smart Inquiry (4 tabs), Fleets, Amenities, Why Travel With, About and footer render; HTTP 200 |
| TC_NAV_002 | Header menu links navigate correctly | Functional | High | Home, Services, Our Fleet, About Us, Contact Us | Click each header link | Each opens its page (URL + heading); active link highlighted |
| TC_NAV_003 | Popular Routes section shows routes | Functional | Medium | Home | Scroll to "Popular Routes People Book Most" | Route cards listed (or section hidden when no data) |
| TC_NAV_004 | Hero "Get Your Quote" CTA | Functional | High | Home | Click Get Your Quote | Takes the user to the Smart Inquiry form (scroll/focus) or a quote page |
| TC_NAV_005 | Hero "Explore Our Fleet" and "Explore All Fleets" CTAs | Functional | Medium | Home | Click each CTA | Navigates to the fleet listing showing vehicles |
| TC_NAV_006 | Footer link "Offers" opens a page with content | Functional | Medium | /offers | Footer → Offers | Offers page shows its own heading and content |
| TC_NAV_007 | Footer link "Schedules" opens a page with content | Functional | Medium | /schedules | Footer → Schedules | Schedules page shows its own heading and content |
| TC_NAV_008 | Footer link "Refund Status" opens a page with content | Functional | Medium | /refund-status | Footer → Refund Status | Refund Status page shows its own heading and content |
| TC_NAV_009 | Footer link "Agent Registration" opens a page with content | Functional | Medium | /agent-registration | Footer → Agent Registration | Agent Registration page shows its own heading and content |
| TC_NAV_010 | Footer link "Careers" opens a page with content | Functional | Medium | /career | Footer → Careers | Careers page shows its own heading and content |
| TC_NAV_011 | Footer link "Confirm Phone Booking" opens a page with content | Functional | Medium | /confirm-phone-booking | Footer → Confirm Phone Booking | Confirm Phone Booking page shows its own heading and content |
| TC_NAV_012 | Footer link "Testimonials" opens a page with content | Functional | Medium | /testimonials | Footer → Testimonials | Testimonials page shows its own heading and content |
| TC_NAV_013 | Footer link "FAQ" opens a page with content | Functional | Medium | /faq | Footer → FAQ | FAQ page shows its own heading and content |
| TC_NAV_014 | Privacy Policy, Terms & Conditions and Sitemap content | Functional | Medium | /privacy, /terms, /sitemap | Open each page | Legal text and sitemap headings present |
| TC_NAV_015 | All Sitemap links resolve to real pages | Functional | Medium | /sitemap | Visit every link on the sitemap | No link lands on "page not found" or an empty page |
| TC_NAV_016 | Unknown URL shows a 404 page | Negative | Low | /does-not-exist-qa | Open an unknown route | "Sorry, page not found!" with a way back home |
| TC_NAV_017 | Footer social media icons link to profiles | Functional | Low | Facebook, Instagram, X, LinkedIn, YouTube icons | Inspect each footer social icon | Each icon opens Siddaganga's profile on that platform |
| TC_NAV_018 | Contact details consistency (header, footer, Contact page) | Functional | Low | Phone and email links | Compare tel:/mailto: links across pages | Valid tel:/mailto: links; one consistent support email |
| TC_NAV_019 | Mobile viewport (390×844): home and inquiry usable | Compatibility | Medium | iPhone-size viewport | Resize to 390×844 → open home → open nav toggle → Local tab | No horizontal scroll; hamburger menu works; inquiry form fits |
| TC_NAV_020 | "Chat With Us" opens WhatsApp/chat | Functional | Medium | Booking widget | Click Chat With Us | Opens WhatsApp (wa.me) or chat widget in a new tab/window |

## Authentication & Profile

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_AUTH_001 | Logged-in header shows profile menu and notifications | Functional | High | Signed-in session | Open home | Profile name/avatar and notification count visible; "Log In" hidden |
| TC_AUTH_002 | Profile dropdown items | Functional | Medium | — | Click profile name | My Profile and Logout listed |
| TC_AUTH_003 | My Profile page fields | Functional | High | — | Profile → My Profile | Name, email, mobile, address, GST invoice option, photo update and Submit shown; mobile (login ID) read-only |
| TC_AUTH_004 | My Profile validation: invalid email (not saved) | Negative | Medium | Email "abc@" | Type invalid email → Submit (profile API blocked by guard, value restored) | Client-side email validation message |
| TC_AUTH_005 | /login while signed in redirects to home | Functional | Low | /login | Open /login while authenticated | Redirect to home |
| TC_AUTH_006 | Login page UI and modes (logged out) | Functional | High | Fresh session | Open /login | Personal Login; Mobile Number / Email Address modes; password; Log In button |
| TC_AUTH_007 | Login validation: empty and malformed credentials | Negative | High | Empty; mobile "12345"; email "abc@" | Submit with each (no real account used) | Inline validation for each; no login |
| TC_AUTH_008 | Protected /profile when logged out | Security | High | Fresh session | Open /profile without login | Redirected to login; no profile data shown |
| TC_AUTH_009 | Logged-out user can search, booking requires login | Functional | High | Fresh session; Local Whitefield D+3 | Search as guest → Book This Vehicle | Search works; booking prompts login (no anonymous inquiry) |
| TC_AUTH_010 | Logout | Functional | High | — | Profile → Logout | Session ended; Log In shown |
| TC_AUTH_011 | Notification bell | Functional | Medium | Header bell with count | Click the bell / count badge | Notification list opens; count matches items |

## Fleet

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_FLT_001 | Our Fleet page filters | Functional | Medium | /ourfleet | Open Our Fleet | Category, manufacturer, vehicle type, seat type, AC/Non AC, luggage, capacity slider shown |
| TC_FLT_002 | Find Vehicles with default filters returns vehicles | Functional | High | No filters | Our Fleet → Find Vehicles | All fleet vehicles listed |
| TC_FLT_003 | Find Vehicles filtered by Category = Luxury | Functional | Medium | Category Luxury | Select Luxury → Find Vehicles | Only luxury vehicles listed (Volvo/Urbania/BharatBenz) |
| TC_FLT_004 | Fleet list category/brand chips filter | Functional | Medium | /fleet-list chips Luxury, Premium, Deluxe | Click each chip | Each category lists its vehicles (Luxury, Premium and Deluxe vehicles all exist in booking results) |
| TC_FLT_005 | Home "Explore Our Fleets" category tabs | Functional | Low | Tabs All/Dynamic/Luxury/Premium/Deluxe | Click each tab | Cards update per tab |

## Customer Support

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_SUP_001 | Contact Us page: support request form fields | Functional | High | /contact-us | Open Contact Us → Raise a Support Request | Booking ID, Title, Request Type, Service Type, Date, Description; Raise Ticket button |
| TC_SUP_002 | Internal-only fields are not exposed to customers | Security | High | Support form | Inspect form | Customer form must not offer Assign To / Priority / Status (agent-side fields) |
| TC_SUP_003 | Raise Ticket with empty form shows validation | Negative | High | All blank | Click Raise Ticket submit with blank fields | Required-field messages; no ticket created |
| TC_SUP_004 | Support form type tabs (Raise Ticket / Feedback / Complaint / Cancel Request) | Functional | Medium | — | Click each type | Form adapts to the chosen type |
| TC_SUP_005 | My Support History | Functional | Medium | — | Click My Support History | List of past tickets or empty state |
| TC_SUP_006 | FAQ accordion on Contact Us | Functional | Low | FAQ categories | Click a category and a question | Answer expands; categories switch |
| TC_SUP_007 | Submit a support ticket | Functional | High | Valid form | Fill → Raise Ticket | Ticket created |

## Services & About

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_SVC_001 | Services page category tabs | Functional | Medium | /services | Click each category tab | Service list changes per category |
| TC_SVC_002 | About Us page sections | Functional | Low | /about-us | Open About Us | Journey timeline, vision, mission, founder note, services |
| TC_SVC_003 | "Request Custom Quote" and "Explore All Services" CTAs | Functional | Low | About page | Click each CTA | Navigates to quote form / services |

## Local

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_LOC_001 | Local tab shows all fields with correct defaults | Functional | High | — | Open home → Smart Inquiry → Local | Multi-day & Different-drop toggles OFF; Pickup Location, Pickup Date (today), Time, Passengers=1, Hours=1 (max 24), Save As Draft, Book Now!, Chat With Us visible |
| TC_LOC_002 | Mandatory pickup location validation | Negative | High | Pickup blank | Local → leave Pickup blank → Book Now! | "Pickup location is required" shown; no navigation |
| TC_LOC_003 | CFG-1 Normal trip end-to-end with fare verification (Sedan) | Functional | Critical | LOC-001 Whitefield; D+3 10:00 AM; 3 pax; 4 hrs; Sedan (VEH-001) | Fill → Book Now! → results → View Full Vehicle Details (Fare Breakup) → Book This Vehicle → review (stop before Confirm) | Results listed; summary matches input; Fare Breakup shown; applied fare = Base + Day Bata + Night Bata = Grand Total; Base = 8Hr/80Km package rate |
| TC_LOC_004 | CFG-2 Multi-day trip (2 dates) with fare verification (12 Seater Tempo Traveller) | Functional | Critical | LOC-003 Hebbal; Multi-day ON; dates today (pre-selected, cannot be removed – see TC_LOC_021) + D+5; time now+3h; 10 pax; 8 hrs; VEH-003 | Multi-day ON → select dates → fill → search → details → review | Summary lists selected dates; base cost = package rate × number of days |
| TC_LOC_005 | CFG-3 Different drop location (MPV) | Functional | Critical | LOC-002 Electronic City Phase 1 → Kotilingeshwara Temple, Kammasandra; D+4 11:00 AM; 6 pax; 6 hrs; MPV (VEH-002) | Drop toggle ON → pickup + drop → search → details → review | Drop field appears; summary/route shows drop address; fare consistent |
| TC_LOC_006 | CFG-4 Multi-day + different drop (33 Seater Deluxe Coach) | Functional | Critical | LOC-007 HSR Layout → Ramanagara; Multi-day ON (today + D+7); time now+2h; 30 pax; 12 hrs; VEH-005 | Both toggles ON → fill → search → details → review | Both conditional field sets work together; summary shows dates and drop; fare consistent |
| TC_LOC_007 | Different drop ON without drop location | Negative | High | Whitefield; drop blank | Drop toggle ON → pickup only → Book Now! | Drop location required message; no navigation |
| TC_LOC_008 | Hours boundary: 0, 24 (max) and 25 (above max) | Boundary | High | Hours = 0 / 24 / 25 | Enter each value in Number of Hours → Book Now! | 24 accepted; 0 and 25 rejected or clamped to 1..24 with a message |
| TC_LOC_009 | Passenger capacity boundary: 49 pax with 49 Seater Deluxe Coach | Boundary | High | Yelahanka; D+6 8:00 AM; 49 pax; 8 hrs; VEH-007 | Search → choose 49 Seater Deluxe Coach → review | Vehicle with 49 seats accepted for 49 pax; no capacity warning |
| TC_LOC_010 | Above-capacity: 50 pax requires multiple vehicles (ADD-006) | Boundary | High | Rajajinagar; D+6 8:00 AM; 50 pax; 8 hrs; select Sedan | Search with 50 pax → Book This Vehicle on one small vehicle | App prevents a single vehicle that cannot seat 50 (capacity message / multi-vehicle selection) |
| TC_LOC_011 | Past dates are disabled in the date picker | Negative | High | Yesterday | Open Pickup Date picker → inspect yesterday | Yesterday disabled / not selectable |
| TC_LOC_012 | Present-date booking (ADD-001) – today, later time (SUV) | Functional | High | Indiranagar; today, now+3h; 5 pax; 5 hrs; SUV (VEH-019) | Fill → search → details → review | Today accepted; results and fare shown |
| TC_LOC_013 | Past time today is rejected | Negative | Medium | Today, time 2 hours ago | Pick today and a time earlier than now → Book Now! | Past time disabled in picker or validation shown |
| TC_LOC_014 | Fare boundary: extra hours on the same vehicle (8 vs 10 hrs, Sedan) | Boundary | High | Malleshwaram; D+8 9:00 AM; 2 pax; Sedan; Hours 8 (package) vs 10 | Run both searches with identical data except hours; compare applied fare | Difference = 2 × Extra Hour Charge from the Fare Breakup |
| TC_LOC_015 | Toggle transitions: Different-drop ON→OFF→ON and Multi-day ON→OFF | Functional | Medium | Drop "Ramanagara" | Turn drop ON, enter drop, turn OFF, turn ON; Multi-day ON then OFF | Drop field hides when OFF; Multi-day OFF restores single date/time fields |
| TC_LOC_016 | Multi-day ON with only one date (today) selected | Negative | Medium | Multi-day ON; no extra date | Multi-day ON → keep only the pre-selected date → Book Now! | Validation: a multi-day trip needs at least 2 dates (or switch to single-day) |
| TC_LOC_021 | Multi-day: pre-selected today can be removed from Selected Dates | Functional | High | Multi-day ON; D+5, D+6 added | Multi-day ON → add D+5, D+6 → click × on D+5 chip → click × on today chip / click today in calendar | Each date chip, including today, can be removed so a future-only multi-day trip can be booked |
| TC_LOC_017 | Pickup outside service city (Chennai) for a Local trip | Negative | Medium | Pickup "Chennai Central" | Local → pickup Chennai → search | Local trip rejected or clear message (Local is Bengaluru-only per test data) |
| TC_LOC_018 | Long-distance drop within Local (LOC-021 Whitefield → Mangaluru) | Edge | Medium | Whitefield → Mangaluru, 1 day 12 hrs, 4 pax | Drop ON → far drop → search | App either converts/rejects a 350 km "local" trip or shows realistic distance; not a silent 80 km local package |
| TC_LOC_019 | Save As Draft (Local) | Functional | Medium | Valid Local form | Fill → Save As Draft | Draft saved confirmation |
| TC_LOC_020 | Confirm & Submit Booking (Local inquiry submission) | Functional | Critical | Review modal from TC_LOC_003 | Click "Confirm & Submit Booking" | Inquiry created; reference shown |

## Outstation

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_OUT_001 | Mandatory fields validation (empty submit) | Negative | High | All blank | Outstation → Book Now! | Pickup required, Destination required; drop time validated |
| TC_OUT_002 | Single destination, default drop: final drop = pickup (21 Seater Premium AC Coach) | Functional | Critical | OUT-001 Whitefield → Mysuru; D+3 9:00 AM → D+4 8:00 PM; 15 pax; VEH-004 | Fill → search → details → review | Expected Final Drop = Whitefield (workbook); results header km = summary distance; base = per-day rate × 2 days |
| TC_OUT_003 | Single destination with different drop (9 Seater Luxury Urbania) | Functional | Critical | OUT-003 Hebbal → Chikkaballapur, drop Yelahanka; D+5 7:00 AM → D+5 9:00 PM; 8 pax; VEH-015 | Drop ON → fill → search → review | Summary drop = Yelahanka |
| TC_OUT_004 | 3 destinations, default drop (16 Seater Premium Urbania) | Functional | High | OUT-021 Whitefield → Mysuru → Srirangapatna → Mandya; D+9 6:00 AM → D+11 8:00 PM; 14 pax; VEH-013 | Add destinations → search → review | All destinations in route summary in order; 3 days; fare consistent |
| TC_OUT_005 | 5 destinations + different drop; destination limit (45 Seater Luxury Volvo) | Boundary | High | OUT-027 HSR Layout → Ramanagara → Channapatna → Mysuru → Srirangapatna → Mandya, drop Electronic City; D+12 6:00 AM → D+14 9:00 PM; 40 pax; VEH-016 | Add 5 destinations, check whether a 6th can be added → search → review | 5 destinations accepted; limit behaviour recorded; fare consistent |
| TC_OUT_006 | Add and remove a destination | Functional | Medium | Destinations Hassan, Belur → remove Belur | + Add Another Destination → remove the 2nd | Second destination field added then removed |
| TC_OUT_007 | Drop date/time before pickup is rejected | Negative | High | Pickup D+5 10:00 AM, drop D+4 10:00 AM | Set drop earlier than pickup → Book Now! | "Drop time must be after pickup time" |
| TC_OUT_008 | Interstate single destination with different drop (OUT-014 Domlur → Hyderabad, drop KIA) | Functional | High | Domlur → Hyderabad, drop Kempegowda Airport; D+15 5:00 AM → D+17 10:00 PM; 25 pax; 25 Seater Premium AC Coach (VEH-012) | Fill → search → review | Interstate trip priced; State Tax / permit component shown or flagged |
| TC_OUT_009 | Same-day outstation (pickup and drop on the same date) | Edge | Medium | OUT-019 Sarjapur Road → Kolar; D+6 6:00 AM → D+6 10:00 PM; 4 pax; Sedan | Fill → search → review | Accepted as 1 day; fare = 1 × day rate |
| TC_OUT_010 | Fare boundary: additional day on the same vehicle (2 vs 3 days, MPV) | Boundary | High | OUT-008 Yelahanka → Hassan; D+20 7:00 AM; drop D+21 vs D+22 7:00 PM; 5 pax; MPV | Two searches identical except drop date; compare applied fare | Difference = 1 × per-day base rate + 1 × Day Bata + 1 × Night Bata (extra overnight) |
| TC_OUT_011 | Multi-day toggle on Outstation tab | Functional | Low | Toggle Multi-day | Toggle Multi-day Trip ON | Toggle changes the form (e.g. date selector) or is not offered for Outstation |
| TC_OUT_012 | Above 49 passengers on Outstation (60 pax) | Boundary | Medium | OUT-002 Electronic City Phase 1 → Nandi Hills; 60 pax | Search → select 49 Seater Luxury 9600 Volvo | Multi-vehicle requirement communicated (capacity not complete) |
| TC_OUT_013 | Confirm & Submit Booking (Outstation) | Functional | Critical | Review modal | Click Confirm & Submit Booking | Inquiry created |

## Transfer P2P

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_TRF_001 | Mandatory From/To validation | Negative | High | Blank | Transfer → Point To Point → Book Now! | Pickup and Drop location required |
| TC_TRF_002 | Airport transfer end-to-end (12 Seater Luxury Urbania) | Functional | Critical | TRF-PTP-001 Whitefield → Kempegowda International Airport; D+3 5:00 AM; 10 pax; VEH-014 | Fill → search → details → review | Results; Transfer pricing; fare consistent |
| TC_TRF_003 | Swap From/To button | Functional | Medium | From Hebbal, To Nandi Hills | Enter both → click swap icon | Values exchanged |
| TC_TRF_004 | Long-distance transfer (TRF-PTP-002 Electronic City Phase 1 → Mysuru, 25 Seater Premium AC Coach) | Functional | High | D+7 6:00 AM; 22 pax; VEH-012 | Fill → search → details → review | Outside-city transfer pricing; distance realistic (>100 km) |
| TC_TRF_005 | Within-city transfer (Koramangala → MG Road, Sedan) | Functional | High | D+2 6:00 PM (drop D+2 8:00 PM set manually – auto drop time is not recalculated, see TC_TRF_012); 2 pax; Sedan | Fill → search → details → review | Within-city (< 30 km) pricing applied, different from outside-city rate |
| TC_TRF_006 | Passenger limit: field max=20 vs requirement 1–49 (ADD-005) | Boundary | High | Passengers 20 / 21 / 49 | Enter 20, 21 and 49 → Book Now! | 1–49 accepted (ADD-005); >49 → multiple vehicles |
| TC_TRF_007 | Add Return reveals return fields pre-filled in reverse | Functional | High | TRF-RET-003 Hebbal ⇄ Nandi Hills | Fill From/To → Add Return ON | From (Return) = To, To (Return) = From (per workbook); return dates after onward |
| TC_TRF_010 | Same From and To location | Negative | Medium | From = To = Whitefield | Enter identical From/To → Book Now! | Validation: pickup and drop cannot be the same |
| TC_TRF_011 | Interstate transfer (TRF-PTP-015 Malleshwaram → Chennai, 35 Seater Premium AC Coach) | Functional | Medium | D+11 6:00 AM; 30 pax | Fill → search → review | Interstate transfer priced; state tax/permit addressed |
| TC_TRF_012 | Drop date/time auto-calculation follows pickup changes | Functional | Medium | Pickup D+3 9:00 AM, then 6:00 PM | Set pickup 9:00 AM → read Drop; change pickup time to 6:00 PM → read Drop | Drop date/time auto-derived after pickup and recalculated when the pickup time changes |

## Transfer P2P+Return

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_TRF_008 | Return transfer end-to-end (28 Seater Premium AC Coach) | Functional | Critical | TRF-RET-002 Electronic City Phase 1 ⇄ Mysuru; onward D+9 7:00 AM; return D+10; 24 pax; VEH-011 | Add Return ON → fill return → search → review | Both legs in summary/review; fare covers two transfers |
| TC_TRF_009 | Return date earlier than onward date | Negative | High | Onward D+6, return D+5 | Add Return → set return pickup before onward | Rejected with message |

## Transfer By Hour

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_TBH_001 | Mandatory pickup validation | Negative | High | Blank | Transfer → By Hour → Book Now! | Pickup required |
| TC_TBH_002 | By Hour – minimum 1 hour (40 Seater Premium AC Coach) | Boundary | High | TRF-HR-005 Marathahalli; D+4 10:00 AM; 1 hr; 35 pax; VEH-009 | Fill → search → details → review | Results for 1 hr; fare consistent |
| TC_TBH_003 | By Hour – maximum 24 hours (45 Seater Premium AC Coach) | Boundary | High | TRF-HR-013 Peenya; D+5 6:00 AM; 24 hrs; 42 pax; VEH-008 | Fill → search → review | 24 hours accepted; extra hours priced |
| TC_TBH_004 | Every hour value 1–24 accepted by the field (ADD-004) | Boundary | Medium | Hours 1..24 and 25 | Type each value into Number of Hours | Values 1–24 retained without error; 25 rejected/clamped |
| TC_TBH_005 | By Hour with different drop (TRF-HR-010 Banashankari → KIA, Sedan) | Functional | High | D+6 4:00 AM; 6 hrs; 3 pax | Drop ON → fill → search → review | Drop shown in summary |
| TC_TBH_006 | By Hour multi-day (2 dates, 45 Seater Luxury BharatBenz) | Functional | High | TRF-HR-001 Whitefield; today + D+13; time now+2h; 10 hrs; 44 pax; VEH-020 | Multi-day ON → dates → search → review | Two dates; base × 2 |
| TC_TBH_007 | By Hour vs Local pricing for identical input | Edge | Low | Hebbal; D+8 9:00 AM; 4 hrs; 2 pax; Sedan | Run same input on Local and on Transfer→By Hour; compare | Category-specific pricing (document if identical – possible duplicate product) |

## Multi-Leg

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_MLG_001 | Total Passengers is mandatory | Negative | High | Blank | Multi-Leg → Next with empty passengers | "This field is required"; stays on step 1 |
| TC_MLG_002 | Total Passengers input sanitisation (0, -1, 2.5, 200) | Boundary | Medium | 0 / -1 / 2.5 / 200 | Type each value | Non-positive and decimals rejected/normalised; upper bound handled |
| TC_MLG_003 | Leg type selector and Local leg Save! | Functional | High | 6 pax; Local leg Hebbal D+24 9:00 AM 4 hrs | Next → Local leg → fill → Save! | Toast "Local leg added!"; wizard advances to Outstation stage |
| TC_MLG_004 | Skip Local / Skip Outstation navigation | Functional | Medium | 4 pax | Next → Skip Local → Skip Outstation | Each skip advances to the next leg category |
| TC_MLG_005 | Add Another Leg and delete a leg | Functional | Medium | 4 pax | + Add Another Leg → delete icon on Leg 2 | Leg 2 added then removed |
| TC_MLG_006 | Book Now with an incomplete leg | Negative | High | 4 pax, leg blank | Next → Book Now! | Field errors + toast "Please fill all required fields correctly" |
| TC_MLG_007 | Two-leg trip (Local + Outstation) end-to-end (40 Seater Deluxe Coach) | Functional | Critical | 36 pax; Leg1 Local Hebbal D+24 9:00 AM 4 hrs; Leg2 Outstation Hebbal → Mysuru D+25 7:00 AM → D+26 8:00 PM; VEH-006 | Save Local leg → fill Outstation leg → Book Now! → results → details → select vehicle on Leg 1 and Leg 2 tabs → review | Results/summary list both legs; review shows both legs; fare consistent |
| TC_MLG_008 | Three-leg trip incl. Transfer leg (45 Seater Luxury 9600 Volvo) | Functional | High | 40 pax; Leg1 Local Koramangala D+27 8:00 AM 3 hrs; skip Outstation; Transfer Koramangala → KIA D+28 5:00 AM | Save Local → Skip Outstation → Transfer leg → Book Now! → select vehicle per leg → review | Legs of all saved types shown |
| TC_MLG_009 | Confirm & Submit Booking (Multi-Leg) | Functional | Critical | Review modal | Click Confirm & Submit | Inquiry created |

## Results & Vehicle Details

| ID | Title | Type | Priority | Test Data | Steps | Expected Result |
|---|---|---|---|---|---|---|
| TC_RES_001 | All vehicles listed with pagination; compare with master vehicle list | Functional | High | Local Koramangala D+3 10:00 AM 1 pax 4 hrs | Search → walk all result pages | 20 vehicles from ADDITIONAL_TEST_INFO available; pagination works; each card has name, seats, Starts From, actions |
| TC_RES_002 | Search summary reflects entered data | Functional | High | Outstation Indiranagar → Mangaluru → Udupi D+16..D+18; 6 pax | Search → read "You have Searched For" | Pickup, destinations, dates, duration, pax match input |
| TC_RES_003 | Vehicle Preferences: Vehicle Age filter | Functional | Medium | Local search; select "Brand New (0-2 years)" | Click each age option | Result list updates according to filter; "Any" restores |
| TC_RES_004 | Comfort Priority and Clear Preferences | Functional | Medium | Seat pitch priority | Click "Seat pitch priority" → note order → Clear Preferences | Order changes per priority; Clear resets |
| TC_RES_005 | Modify Inquiry returns to form with values retained | Functional | High | Local Whitefield 3 pax 4 hrs | Search → Modify Inquiry | Inquiry form shown with previous values |
| TC_RES_006 | View Full Vehicle Details modal content and close | Functional | High | 40 Seater Deluxe Coach on Local search | View Full Vehicle Details → inspect → close | Header, tags, pricing block, technical specs, comfort metrics readable; close works |
| TC_RES_007 | Browser Back from results and page refresh | Edge | Medium | Local search | Search → reload results page; then Back | Reload keeps results or redirects gracefully; Back returns to home without errors |
| TC_RES_008 | Direct access to /send-inquiry without a search | Edge | Low | URL /send-inquiry | Open URL directly | Graceful redirect or empty state with guidance |
