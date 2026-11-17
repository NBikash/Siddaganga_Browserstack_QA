# Outstation Module - Functional Test Cases

**Module:** Outstation (Multi-City Trips)
**Application:** Siddaganga Travels User Web (Preprod)
**URL:** https://preprod.siddagangatravels.com/
**Generated:** 2026-11-17
**Total Test Cases:** 55

---

## Module Overview

The Outstation module handles multi-city, multi-day trips with the following features:
- **4 Configurations:** Single Dest Round-Trip, Single Dest One-Way, Multi-Dest Round-Trip, Multi-Dest One-Way
- **Toggle:** Different drop location
- **Fields:** Pickup Location, Pickup Date/Time, Destinations (1-5+), Drop Date/Time, Passengers, Different Drop Location (conditional)
- **Pricing:** Per-day base rate + Per-km charge + Bata (driver allowance) + State Tax + Tolls/Parking + GST
- **Actions:** Save As Draft, Book Now, Chat With Us

### Key Differences from Local Module
| Aspect | Local | Outstation |
|--------|-------|------------|
| Trip Type | Within-city | Inter-city/Multi-city |
| Duration | Hours (1-24) | Days (pickup to drop date) |
| Distance | Fixed 80 km | Actual route distance |
| Destinations | None | 1-5+ sequential stops |
| Drop | Same as pickup or different | Default = pickup or custom |
| Pricing | Per-hour package | Per-day + per-km |

---

## Test Case Summary

| Category | Count | Priority Breakdown |
|----------|-------|-------------------|
| Happy Path | 5 | P1: 5 |
| Boundary - Passengers | 4 | P2: 3, P3: 1 |
| Boundary - Destinations | 5 | P2: 4, P3: 1 |
| Date/Time | 8 | P1: 2, P2: 5, P3: 1 |
| Location | 6 | P2: 5, P3: 1 |
| Validation | 10 | P1: 4, P2: 5, P3: 1 |
| Toggle | 3 | P2: 3 |
| Vehicle | 4 | P2: 4 |
| Fare Verification | 4 | P1: 2, P2: 2 |
| Edge Case | 6 | P3: 6 |
| **Total** | **55** | P1: 13, P2: 31, P3: 11 |

---

## Configuration Coverage

| Config | Destinations | Different Drop | Description | Test Cases |
|--------|--------------|----------------|-------------|------------|
| CFG-1 | 1 | OFF | Single destination round-trip | UC-01, UC-11-16, UC-22-27, UC-37-42, UC-50-55 |
| CFG-2 | 1 | ON | Single destination one-way | UC-02, UC-32-34, UC-43 |
| CFG-3 | 2+ | OFF | Multi-destination round-trip | UC-03, UC-17-21, UC-28-31 |
| CFG-4 | 2+ | ON | Multi-destination one-way | UC-04, UC-05, UC-35-36 |

---

## Happy Path Tests (P1)

### OUT-UC-01: Single destination round-trip (default drop)
- **Config:** CFG-1 (Single Dest, Default Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Majestic Bus Station, Bangalore
  - Destination 1: Mysuru, Karnataka
  - Pickup Date: Tomorrow, 09:00 AM
  - Drop Date: Day After Tomorrow, 06:00 PM
  - Passengers: 4
  - Different Drop: OFF
- **Expected:**
  - Vehicle results displayed with per-day + per-km pricing
  - Route shows Bangalore → Mysuru → Bangalore (round trip)
  - Distance calculated for full round trip (~290 km)
- **Covers:** Main booking flow, single destination, round-trip logic

### OUT-UC-02: Single destination one-way with different drop
- **Config:** CFG-2 (Single Dest, Different Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Bangalore
  - Destination 1: Mysuru
  - Drop Location: Mysuru
  - Pickup Date: Tomorrow, 08:00 AM
  - Drop Date: Tomorrow, 04:00 PM
  - Passengers: 2
  - Different Drop: ON
- **Expected:**
  - Route shows Bangalore → Mysuru (one-way)
  - Drop location = Mysuru (not returning to Bangalore)
  - Single-day trip pricing
- **Covers:** One-way trip, different drop toggle, same-day outstation

### OUT-UC-03: Multi-destination round-trip (2 stops)
- **Config:** CFG-3 (Multi-Dest, Default Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Bangalore
  - Destination 1: Mysuru
  - Destination 2: Ooty
  - Pickup Date: Tomorrow, 06:00 AM
  - Drop Date: +3 days, 08:00 PM
  - Passengers: 6
  - Different Drop: OFF
- **Expected:**
  - Route shows Bangalore → Mysuru → Ooty → Bangalore
  - All destinations listed in order on summary
  - 3-day pricing with extended distance
- **Covers:** Multi-destination flow, "+ Add Another Destination" button

### OUT-UC-04: Multi-destination one-way (3 stops with different drop)
- **Config:** CFG-4 (Multi-Dest, Different Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Bangalore
  - Destination 1: Mysuru
  - Destination 2: Madikeri
  - Destination 3: Mangaluru
  - Drop Location: Mangaluru
  - Pickup Date: Tomorrow, 05:00 AM
  - Drop Date: +4 days, 06:00 PM
  - Passengers: 10
  - Different Drop: ON
- **Expected:**
  - Route: Bangalore → Mysuru → Madikeri → Mangaluru (ends at Mangaluru)
  - Drop location = Mangaluru (custom final drop)
  - 4-day pricing
- **Covers:** Multi-destination with custom drop, complex route

### OUT-UC-05: Maximum destinations (5 stops) with different drop
- **Config:** CFG-4 (Multi-Dest, Different Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Bangalore
  - Destinations: Mysuru → Hassan → Chikmagalur → Shimoga → Goa
  - Drop Location: Goa
  - Pickup Date: Tomorrow
  - Drop Date: +6 days
  - Passengers: 20
- **Expected:**
  - All 5 destinations shown in sequence
  - Route correctly calculated through all stops
  - Extended multi-day pricing
- **Covers:** Maximum destination count, long-distance trip

---

## Boundary Tests - Passengers (P2/P3)

### OUT-UC-06: Minimum passengers (1)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Bangalore, Dest: Mysuru, Passengers: 1
- **Expected:** All vehicles shown including Sedan/SUV

### OUT-UC-07: Medium group (25 passengers)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Bangalore, Dest: Mysuru, Passengers: 25
- **Expected:** 25+ seater coaches shown (28 Seater Premium AC Coach)

### OUT-UC-08: Maximum single-vehicle (49 passengers)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Bangalore, Dest: Coorg, Passengers: 49
- **Expected:** 49 Seater vehicles shown (Deluxe Coach, Volvo)

### OUT-UC-09: Above single-vehicle capacity (100+ passengers)
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup: Bangalore, Dest: Goa, Passengers: 120
- **Expected:** Multiple vehicle suggestion or error message

---

## Boundary Tests - Destinations (P2/P3)

### OUT-UC-10: Single destination only (minimum)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Bangalore, Destinations: 1 (Mysuru)
- **Expected:** Form accepts single destination, no "Remove" icon shown

### OUT-UC-11: Two destinations
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Destinations: Mysuru, Coorg
- **Expected:** Both destinations shown in order, Remove icon available for Dest 2

### OUT-UC-12: Three destinations
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Destinations: Mysuru, Madikeri, Hassan
- **Expected:** Sequential route displayed, all 3 stops in summary

### OUT-UC-13: Four destinations
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Destinations: Mysuru, Coorg, Mangaluru, Goa
- **Expected:** Four-stop route calculated correctly

### OUT-UC-14: Beyond 5 destinations (if supported)
- **Config:** CFG-3
- **Priority:** P3
- **Data:** Attempt to add 6th destination
- **Expected:** Either accepts 6th or shows max limit reached

---

## Date/Time Tests (P1-P3)

### OUT-UC-15: Same-day outstation trip
- **Config:** CFG-1
- **Priority:** P1
- **Data:**
  - Pickup: Today, 06:00 AM
  - Drop: Today, 10:00 PM
  - Dest: Mysuru (nearby, ~150 km)
- **Expected:** Same-day trip accepted, single-day pricing

### OUT-UC-16: Multi-day trip (3 days)
- **Config:** CFG-1
- **Priority:** P1
- **Data:**
  - Pickup: Tomorrow, 08:00 AM
  - Drop: +3 days, 06:00 PM
- **Expected:** 3-day pricing (Base × 3 + per-km)

### OUT-UC-17: Drop date earlier than pickup date (rejected)
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Day After Tomorrow
  - Drop: Tomorrow (before pickup)
- **Expected:** Error or date picker prevents selection

### OUT-UC-18: Drop time earlier than pickup time (same date)
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Tomorrow, 10:00 AM
  - Drop: Tomorrow, 08:00 AM
- **Expected:** Error: "Drop date & time must be after pickup date & time"

### OUT-UC-19: Drop time equals pickup time (rejected)
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Tomorrow, 09:00 AM
  - Drop: Tomorrow, 09:00 AM (exact same)
- **Expected:** Error: Drop must be after pickup

### OUT-UC-20: Past pickup date attempt
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup Date: Yesterday
- **Expected:** Date picker prevents past date selection

### OUT-UC-21: Far future booking (90 days ahead)
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup Date: +90 days
- **Expected:** Future date accepted (verify no upper limit)

### OUT-UC-22: Long trip duration (14 days)
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Tomorrow
  - Drop: +14 days
- **Expected:** 14-day pricing calculated (Base × 14 + per-km)

---

## Location Tests (P2-P3)

### OUT-UC-23: Airport pickup for outstation
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Kempegowda International Airport, Bangalore
  - Destination: Tirupati
- **Expected:** Airport recognized, outstation route calculated

### OUT-UC-24: Interstate destination (Karnataka to Tamil Nadu)
- **Config:** CFG-2
- **Priority:** P2
- **Data:**
  - Pickup: Bangalore
  - Destination: Chennai
  - Different Drop: ON, Drop: Chennai
- **Expected:** Interstate route accepted, state tax may apply

### OUT-UC-25: Long distance destination (500+ km)
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Bangalore
  - Destination: Goa (~550 km)
- **Expected:** Long-distance pricing, extended route shown

### OUT-UC-26: Destination same as pickup location
- **Config:** CFG-1
- **Priority:** P2
- **Data:**
  - Pickup: Majestic, Bangalore
  - Destination 1: Majestic, Bangalore (same)
- **Expected:** Error: "Destination cannot be the same as pickup location"

### OUT-UC-27: Duplicate destinations (Dest 1 = Dest 2)
- **Config:** CFG-3
- **Priority:** P2
- **Data:**
  - Pickup: Bangalore
  - Destination 1: Mysuru
  - Destination 2: Mysuru (duplicate)
- **Expected:** Error or warning about duplicate destination

### OUT-UC-28: International destination attempt
- **Config:** CFG-1
- **Priority:** P3
- **Data:**
  - Pickup: Bangalore
  - Destination: Dubai (international)
- **Expected:** Error: International destinations not supported

---

## Validation Tests (P1-P3)

### OUT-UC-29: Empty pickup location
- **Config:** CFG-1
- **Priority:** P1
- **Data:** Pickup: (empty)
- **Expected:** Error: "Pickup location is required"

### OUT-UC-30: Empty first destination
- **Config:** CFG-1
- **Priority:** P1
- **Data:** Destination 1: (empty)
- **Expected:** Error: "First destination is required"

### OUT-UC-31: Empty drop date/time
- **Config:** CFG-1
- **Priority:** P1
- **Data:** Drop Date/Time: (empty)
- **Expected:** Error: "This field is required"

### OUT-UC-32: Empty different drop location (toggle ON)
- **Config:** CFG-2
- **Priority:** P1
- **Data:** Different Drop: ON, Drop Location: (empty)
- **Expected:** Error: "Drop location is required"

### OUT-UC-33: Zero passengers
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 0
- **Expected:** Error: "Enter at least 1 passenger"

### OUT-UC-34: Negative passengers (-5)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: -5
- **Expected:** Error or stripped to positive value

### OUT-UC-35: Decimal passengers (1.5)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 1.5
- **Expected:** Rounded/truncated or error (Known bug: may convert to 15)

### OUT-UC-36: Empty passengers field
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: (empty/cleared)
- **Expected:** Field highlighted, search blocked

### OUT-UC-37: Added destination left empty
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Click "+ Add Another Destination", leave Dest 2 empty
- **Expected:** Error: "Destination location is required"

### OUT-UC-38: Special characters in location search
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Destination: "Mysuru's Palace Area"
- **Expected:** Autocomplete handles apostrophe correctly

---

## Toggle Transition Tests (P2)

### OUT-UC-39: Enable Different Drop toggle
- **Config:** CFG-2
- **Priority:** P2
- **Steps:**
  1. Fill pickup and destination
  2. Enable "Different drop location" toggle
- **Expected:** Drop location field appears, is required

### OUT-UC-40: Disable Different Drop toggle after filling
- **Config:** CFG-2 → CFG-1
- **Priority:** P2
- **Steps:**
  1. Enable Different Drop toggle
  2. Enter drop location
  3. Disable toggle
- **Expected:** Drop location field hidden, value cleared, reverts to round-trip

### OUT-UC-41: Toggle state persists after tab switch
- **Config:** CFG-2
- **Priority:** P2
- **Steps:**
  1. Fill outstation form with Different Drop ON
  2. Navigate to Ride tab
  3. Return to Home
- **Expected:** All form values including toggle state preserved

---

## Vehicle-Specific Tests (P2)

### OUT-UC-42: Sedan for small group outstation
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 3, Dest: Mysuru
- **Vehicle Type:** Sedan (VEH-001)
- **Expected:** Sedan available with outstation pricing

### OUT-UC-43: Tempo Traveller for group tour
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Passengers: 12, Destinations: Mysuru, Coorg
- **Vehicle Type:** 12 Seater Tempo Traveller (VEH-003)
- **Expected:** Tempo Traveller shown for capacity match

### OUT-UC-44: Luxury Volvo for corporate outstation
- **Config:** CFG-4
- **Priority:** P2
- **Data:** Passengers: 40, Destinations: Goa (long distance)
- **Vehicle Type:** 45 Seater Luxury Volvo (VEH-016)
- **Expected:** Luxury bus with per-day + per-km pricing

### OUT-UC-45: Premium Urbania for premium tour
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 15, Dest: Ooty
- **Vehicle Type:** 16 Seater Premium Urbania (VEH-013)
- **Expected:** Premium vehicle shown with appropriate pricing

---

## Fare Verification Tests (P1-P2)

### OUT-UC-46: Verify fare breakup components
- **Config:** CFG-1
- **Priority:** P1
- **Data:** 3-day trip to Mysuru (290 km round trip)
- **Steps:**
  1. Search vehicles
  2. Open Vehicle Details → View Fare Breakup
  3. Verify: Base Rate (per day), Day Bata, Night Bata, Toll & Parking, GST
- **Expected:** All fare components listed and total matches

### OUT-UC-47: Multi-day fare calculation
- **Config:** CFG-1
- **Priority:** P1
- **Data:**
  - 3-day trip
  - Base rate: Rs 52,500/day
- **Expected:**
  - Base: Rs 1,57,500 (3 × 52,500)
  - Plus: Day Bata, State Tax, etc.
  - Total matches Confirm screen

### OUT-UC-48: Per-km charge verification
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Long-distance trip (500+ km)
- **Expected:** Per-km charge visible in breakup (e.g., Rs 105/km)

### OUT-UC-49: State tax for interstate trips
- **Config:** CFG-2
- **Priority:** P2
- **Data:** Bangalore → Chennai (interstate)
- **Expected:** State tax line item visible in fare breakup

---

## Edge Case Tests (P3)

### OUT-UC-50: Remove middle destination from 3-stop route
- **Config:** CFG-3
- **Priority:** P3
- **Steps:**
  1. Add 3 destinations: Mysuru, Hassan, Coorg
  2. Remove Hassan (middle)
- **Expected:** Remaining destinations keep order: Mysuru, Coorg

### OUT-UC-51: Double-tap Search Vehicles
- **Config:** CFG-1
- **Priority:** P3
- **Steps:** Rapidly tap "Search Vehicles" twice
- **Expected:** Single search initiated, no duplicate results/inquiries

### OUT-UC-52: Edit Trip Details after vehicle search
- **Config:** CFG-1
- **Priority:** P3
- **Steps:**
  1. Search vehicles, view results
  2. Click "Edit Trip Details"
  3. Modify destination
  4. Re-search
- **Expected:** Form shows all previous values, re-search updates route/distance

### OUT-UC-53: Unicode/Kannada location name
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Destination: "ಮೈಸೂರು" (Mysuru in Kannada)
- **Expected:** Autocomplete handles or suggests English equivalent

### OUT-UC-54: Very long route name
- **Config:** CFG-3
- **Priority:** P3
- **Data:** Destination: "Kempegowda International Airport Terminal 2 Domestic Arrivals"
- **Expected:** UI handles long names without breaking layout

### OUT-UC-55: Browser refresh with form data
- **Config:** CFG-1
- **Priority:** P3
- **Steps:**
  1. Fill outstation form completely
  2. Press F5/Refresh browser
- **Expected:** Form data persisted (draft save) or cleared with notification

---

## Known Defects (from Android Testing)

| Bug ID | Description | Test Case |
|--------|-------------|-----------|
| BUG-OUT-006 | Summary missing pickup/drop times | OUT-UC-16, OUT-UC-46 |
| BUG-OUT-007 | List price doesn't reflect route/days | OUT-UC-47 |
| BUG-OUT-008 | Fare breakup missing per-km line | OUT-UC-48 |
| BUG-OUT-009 | Calculated fare doesn't match components | OUT-UC-46, OUT-UC-47 |
| BUG-OUT-012 | Advance payment allows > total amount | Payment flow |
| BUG-UI-OS-001 | Decimal passengers converted incorrectly | OUT-UC-35 |
| BUG-UI-OS-002 | Return date picker title wrong for one-way | OUT-UC-39 |

---

## Execution Checklist

| ID | Title | Priority | Status | Executed By | Date | Notes |
|----|-------|----------|--------|-------------|------|-------|
| OUT-UC-01 | Single dest round-trip | P1 | ⬜ | | | |
| OUT-UC-02 | Single dest one-way | P1 | ⬜ | | | |
| OUT-UC-03 | Multi-dest round-trip (2) | P1 | ⬜ | | | |
| OUT-UC-04 | Multi-dest one-way (3) | P1 | ⬜ | | | |
| OUT-UC-05 | Max destinations (5) | P1 | ⬜ | | | |
| OUT-UC-06 | Min passengers (1) | P2 | ⬜ | | | |
| OUT-UC-07 | Medium group (25) | P2 | ⬜ | | | |
| OUT-UC-08 | Max single-vehicle (49) | P2 | ⬜ | | | |
| OUT-UC-09 | Above capacity (100+) | P3 | ⬜ | | | |
| OUT-UC-10 | Single destination | P2 | ⬜ | | | |
| OUT-UC-11 | Two destinations | P2 | ⬜ | | | |
| OUT-UC-12 | Three destinations | P2 | ⬜ | | | |
| OUT-UC-13 | Four destinations | P2 | ⬜ | | | |
| OUT-UC-14 | Beyond 5 destinations | P3 | ⬜ | | | |
| OUT-UC-15 | Same-day trip | P1 | ⬜ | | | |
| OUT-UC-16 | Multi-day (3 days) | P1 | ⬜ | | | |
| OUT-UC-17 | Drop before pickup date | P2 | ⬜ | | | |
| OUT-UC-18 | Drop time before pickup | P2 | ⬜ | | | |
| OUT-UC-19 | Drop = pickup time | P2 | ⬜ | | | |
| OUT-UC-20 | Past pickup date | P2 | ⬜ | | | |
| OUT-UC-21 | Far future (90 days) | P3 | ⬜ | | | |
| OUT-UC-22 | Long trip (14 days) | P2 | ⬜ | | | |
| OUT-UC-23 | Airport pickup | P2 | ⬜ | | | |
| OUT-UC-24 | Interstate (KA→TN) | P2 | ⬜ | | | |
| OUT-UC-25 | Long distance (500+ km) | P2 | ⬜ | | | |
| OUT-UC-26 | Dest = Pickup (error) | P2 | ⬜ | | | |
| OUT-UC-27 | Duplicate destinations | P2 | ⬜ | | | |
| OUT-UC-28 | International dest | P3 | ⬜ | | | |
| OUT-UC-29 | Empty pickup | P1 | ⬜ | | | |
| OUT-UC-30 | Empty first dest | P1 | ⬜ | | | |
| OUT-UC-31 | Empty drop date/time | P1 | ⬜ | | | |
| OUT-UC-32 | Empty diff drop (ON) | P1 | ⬜ | | | |
| OUT-UC-33 | Zero passengers | P2 | ⬜ | | | |
| OUT-UC-34 | Negative passengers | P2 | ⬜ | | | |
| OUT-UC-35 | Decimal passengers | P2 | ⬜ | | | |
| OUT-UC-36 | Empty passengers | P2 | ⬜ | | | |
| OUT-UC-37 | Added dest empty | P2 | ⬜ | | | |
| OUT-UC-38 | Special chars location | P3 | ⬜ | | | |
| OUT-UC-39 | Enable Diff Drop toggle | P2 | ⬜ | | | |
| OUT-UC-40 | Disable Diff Drop toggle | P2 | ⬜ | | | |
| OUT-UC-41 | Toggle persists on nav | P2 | ⬜ | | | |
| OUT-UC-42 | Sedan outstation | P2 | ⬜ | | | |
| OUT-UC-43 | Tempo Traveller | P2 | ⬜ | | | |
| OUT-UC-44 | Luxury Volvo | P2 | ⬜ | | | |
| OUT-UC-45 | Premium Urbania | P2 | ⬜ | | | |
| OUT-UC-46 | Fare breakup verify | P1 | ⬜ | | | |
| OUT-UC-47 | Multi-day fare calc | P1 | ⬜ | | | |
| OUT-UC-48 | Per-km charge | P2 | ⬜ | | | |
| OUT-UC-49 | State tax interstate | P2 | ⬜ | | | |
| OUT-UC-50 | Remove middle dest | P3 | ⬜ | | | |
| OUT-UC-51 | Double-tap search | P3 | ⬜ | | | |
| OUT-UC-52 | Edit Trip Details | P3 | ⬜ | | | |
| OUT-UC-53 | Unicode location | P3 | ⬜ | | | |
| OUT-UC-54 | Long route name | P3 | ⬜ | | | |
| OUT-UC-55 | Browser refresh | P3 | ⬜ | | | |

---

## Related Files

- **CSV Version:** `documentation/Outstation_Functional_Test_Cases.csv`
- **Test Data:** `documentation/User_WEB_cases.xlsx` (OUTSTATION sheet)
- **Fare Procedure:** `.claude/shared/fare-verification.md`
- **Android Reference:** `android/results/android-20261029-1044-OUTSTATION-UC.csv`
