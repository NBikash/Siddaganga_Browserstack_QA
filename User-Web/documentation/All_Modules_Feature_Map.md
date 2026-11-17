# Siddaganga Travels User Web (Preprod) – Exploration Feature Map

Explored 2026-11-17 on Preprod, signed in as the customer QA account (mobile login), Chrome 1440×900 (plus a 390×844 mobile check).
Read-only exploration: booking, inquiry, draft, payment and cancel API calls were blocked by the harness (`steps/_local.mjs → guard()`).
Raw exploration scripts: `steps/explore/*.mjs`; screenshots: `screenshots/explore/`.

## 1. Site structure

| Area | Route | Notes from exploration |
|---|---|---|
| Home | `/` | Hero ("Moving South India since 1997"), Get Your Quote / Explore Our Fleet CTAs, Smart Inquiry booking widget + Google map, Popular Routes (**shows "No popular routes found"**), Explore Our Fleets (category chips), Amenities, corporate services, Why Travel With, About, footer |
| Services | `/services` | 5 category tabs (Corporate & Institutional, Events & Group Movements, Premium & VIP, Community & Special, Leisure & Family), each with service sub-tabs and details |
| Our Fleet | `/ourfleet` | Fleet Finder: category, manufacturer, vehicle type, seat type selects; AC/Non AC; luggage; capacity slider; Find Vehicles → `/fleet-list` |
| Fleet list | `/fleet-list` | "Recommended Vehicles … Buses Found", category / manufacturer chips |
| About Us | `/about-us` | Timeline 2005–2024 ("since 2005" – conflicts with Home "since 1997"), vision, mission, founder note, service types, Request Custom Quote |
| Contact Us | `/contact-us` | Customer Support: Raise a Support Request (Raise Ticket / Submit Feedback / Submit Complaint / Cancel Request), My Support History, FAQ accordion (4 categories) |
| Profile | `/profile` | Name, email, mobile, address, GST invoice checkbox, Update Photo, Submit |
| Login | `/login` | Personal Login; Mobile Number or Email Address + password; redirects to `/` if already signed in |
| Legal / sitemap | `/privacy`, `/terms`, `/sitemap` | Content present |
| Footer pages | `/offers`, `/schedules`, `/refund-status`, `/agent-registration`, `/career`, `/confirm-phone-booking`, `/testimonials`, `/faq` | **All render only the page title / no content** |
| 404 | any unknown route | "Sorry, page not found!" |
| Header | — | Phone, support email, profile dropdown (My Profile, Logout), notification count badge, nav (Home, Services, Our Fleet, About Us, Contact Us) |

## 2. Smart Inquiry booking widget

| Tab | Fields & controls | Conditional fields | Empty-submit validation |
|---|---|---|---|
| **Local** | Multi-day Trip toggle, Drop at different location toggle, Pickup Location (Google Places), Pickup Date (default today) & Time, Passengers (min 1), Number of Hours (1–24), Save As Draft, Book Now!, Chat With Us | Multi-day → Pickup Time + "Select Travel Dates" calendar (today pre-selected, Next Month, chips with ×); Drop → Drop Location | "Pickup location is required" |
| **Outstation** | Same toggles, Pickup, Pickup Date/Time, Destinations (First Destination *, + Add Another Destination), Drop Date/Time, Passengers | Drop → Drop Location. Multi-day toggle shows **no visible change** | Pickup required, Destination required, "Drop time must be after pickup time" |
| **Transfer → Point To Point** | Add Return toggle, From, swap button, To, Pickup Date/Time, Drop Date/Time (auto-derived), Passengers (**max=20**) | Add Return → From (Return), To (Return), Return Pickup / Drop Date & Time | Pickup required, Drop required |
| **Transfer → By Hour** | Same as Local (toggles, pickup, date/time, passengers, hours 1–24) | As Local | Pickup required |
| **Multi-Leg** | Step 1: Total Passengers → Next. Step 2: Trip Leg #n with leg type Local / Outstation / Transfer, per-leg form, + Add Another Leg, delete leg, Save As Draft, Save!, Skip <type>, Book Now! | Save! stores the leg locally ("Local leg added!") and moves to the next category (Local → Outstation → Transfer) | "This field is required"; leg: field errors + toast "Please fill all required fields correctly" |

## 3. Search → results → review flow (all trip types)

1. **Book Now!** → `/send-inquiry`: "N Buses Found | <Category> – <package/distance>", map, "You have Searched For" summary (route Garage → pickup → … → Garage, Distance, Dates, Duration, Passengers, Pickup/Drop Address), Modify Inquiry.
2. **Vehicle Preferences:** Vehicle Age (Brand New 0–2 yrs / Standard 2–5 yrs / Any), Comfort Priority (seat pitch / luggage / ride comfort), Clear Preferences.
3. **Vehicle cards** (20 vehicle types, paginated 6/page): tag, Starts From ₹, rating, name, code, seats, Best For, *View Full Vehicle Details*, *Book This Vehicle*.
4. **View Full Vehicle Details** modal: category pricing block (e.g. "Local Trip – 8 Hrs / 80 Kms": Base Rate, Extra Km, Extra Hour, Day Bata, Night Bata, Toll & Parking = Actuals, GST = Additional; Outstation: per-day base, bata; Transfer: Within/Outside City base, Late Allowance), technical specifications, comfort metrics (**rendered as raw JSON**), Proceed To Booking.
5. **Book This Vehicle** → "Confirm Your Trip & Selected Vehicles" modal: customer details, selected vehicles, route summary, dates, passengers, Estimated Trip Cost (base, bata, state tax, grand total), **Confirm & Submit Booking** (not clicked – needs approval). Selecting a vehicle smaller than the passenger count raises a capacity popup.

## 4. Pricing observations (from Fare Breakup vs applied fare)

- Local: minimum package 8 Hr / 80 Km is billed even when fewer hours are requested (4 hrs → 8Hr/80Km base). Header nevertheless says "Local – 4 HR / 80 KM".
- Outstation: base = per-day rate × days, day bata × days, night bata per night; State Tax line on review. Results header showed "Outstation – 0 KM" while the summary showed 600 KM.
- Transfer: Outside City (> 30 km) package; distance only shown as "> 30 KM".
- GST "Additional" and Toll "Actuals" are never added to the estimate (by design per breakup text – confirm with business).

## 5. Test data (User_WEB_cases.xlsx)

LOCAL 25 rows · OUTSTATION 30 rows (1–5 destinations, default/different drop, interstate) · TRANSFER_P2P 25 · TRANSFER_P2P+RETURN 15 · TRANSFER_BYhr 22 · ADDITIONAL_TEST_INFO: present/future date, multiple dates, hours 1–24, passengers 1–49 / >49 (multiple vehicles), 20 vehicle types (VEH-001…VEH-020).
