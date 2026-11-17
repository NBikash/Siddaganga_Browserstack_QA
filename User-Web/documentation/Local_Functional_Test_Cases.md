# Local Module - Functional Test Cases

**Module:** Local (Within City Trips)
**Application:** Siddaganga Travels User Web (Preprod)
**URL:** https://preprod.siddagangatravels.com/
**Generated:** 2026-11-16
**Total Test Cases:** 40

---

## Module Overview

The Local module handles within-city vehicle bookings with the following features:
- **4 Configurations:** Normal, Multi-day, Different Drop, Multi-day + Different Drop
- **Toggles:** Multi-day Trip, Drop at different location
- **Fields:** Pickup Location, Date/Time, Passengers, Number of Hours, Drop Location (conditional)
- **Actions:** Save As Draft, Book Now, Chat With Us

---

## Test Case Summary

| Category | Count | Priority Breakdown |
|----------|-------|-------------------|
| Happy Path | 4 | P1: 4 |
| Boundary - Passengers | 4 | P2: 3, P3: 1 |
| Boundary - Hours | 3 | P2: 3 |
| Date/Time | 5 | P1: 1, P2: 3, P3: 1 |
| Location | 5 | P2: 4, P3: 1 |
| Validation | 6 | P1: 2, P2: 3, P3: 1 |
| Multi-day | 4 | P2: 3, P3: 1 |
| Toggle | 2 | P2: 2 |
| Vehicle | 3 | P2: 3 |
| Edge Case | 4 | P3: 4 |
| **Total** | **40** | P1: 7, P2: 24, P3: 9 |

---

## Configuration Coverage

| Config | Multi-day | Different Drop | Test Cases |
|--------|-----------|----------------|------------|
| CFG-1 | OFF | OFF | UC-01, UC-05-11, UC-12-18, UC-22, UC-24-27, UC-32-40 |
| CFG-2 | ON | OFF | UC-02, UC-28-31 |
| CFG-3 | OFF | ON | UC-03, UC-19-21, UC-23 |
| CFG-4 | ON | ON | UC-04 |

---

## Happy Path Tests (P1)

### LOCAL-UC-01: Basic local trip within city
- **Config:** CFG-1 (Normal)
- **Priority:** P1
- **Data:**
  - Pickup: Koramangala, Bangalore
  - Passengers: 2
  - Hours: 4
  - Date: Tomorrow
  - Time: 10:00 AM
- **Expected:** Vehicle results displayed with pricing
- **Covers:** Main booking flow, form submission, results page

### LOCAL-UC-02: Multi-day local trip (2 consecutive days)
- **Config:** CFG-2 (Multi-day)
- **Priority:** P1
- **Data:**
  - Pickup: MG Road, Bangalore
  - Passengers: 4
  - Hours: 8
  - Dates: Tomorrow + Day After
- **Expected:** Multi-day pricing shown (fare × 2)
- **Covers:** Multi-day toggle, date selection, fare calculation

### LOCAL-UC-03: Local trip with different drop location
- **Config:** CFG-3 (Different Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Indiranagar, Bangalore
  - Drop: Electronic City
  - Passengers: 3
  - Hours: 6
- **Expected:** Route shows pickup → drop, distance calculated
- **Covers:** Different drop toggle, drop location field, route display

### LOCAL-UC-04: Multi-day with different drop (full combo)
- **Config:** CFG-4 (Multi-day + Different Drop)
- **Priority:** P1
- **Data:**
  - Pickup: Whitefield
  - Drop: Mysore
  - Passengers: 10
  - Hours: 8
  - Dates: 3 Days
- **Expected:** Multi-day + different drop pricing
- **Covers:** Both toggles enabled, combined functionality

---

## Boundary Tests - Passengers (P2/P3)

### LOCAL-UC-05: Minimum passengers (1)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: HSR Layout, Passengers: 1, Hours: 2
- **Expected:** All vehicles shown including small ones (Sedan, MPV)

### LOCAL-UC-06: Maximum single-vehicle capacity (49 pax)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Jayanagar, Passengers: 49, Hours: 8
- **Expected:** Large buses shown (49 Seater Deluxe Coach)

### LOCAL-UC-07: Above single-vehicle capacity (50+ pax)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Malleshwaram, Passengers: 55, Hours: 8
- **Expected:** Multiple vehicle suggestion or warning

### LOCAL-UC-08: Large group (100+ pax)
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup: BTM Layout, Passengers: 120, Hours: 8
- **Expected:** Multi-vehicle booking flow or error message

---

## Boundary Tests - Hours (P2)

### LOCAL-UC-09: Minimum hours (1 hour)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Yelahanka, Passengers: 2, Hours: 1
- **Expected:** Minimum package pricing shown (1 HR / 80 KM)

### LOCAL-UC-10: Maximum hours (24 hours)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Hebbal, Passengers: 4, Hours: 24
- **Expected:** Full-day package pricing (24 HR / 80 KM)

### LOCAL-UC-11: Above maximum hours (25)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Marathahalli, Passengers: 2, Hours: 25
- **Expected:** Error: "Maximum 24 hours allowed"

---

## Date/Time Tests (P1-P3)

### LOCAL-UC-12: Same-day booking (today)
- **Config:** CFG-1
- **Priority:** P1
- **Data:** Date: Today, Time: Next available slot
- **Expected:** Booking accepted with available time slots

### LOCAL-UC-13: Far future booking (6 months ahead)
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Date: +180 days
- **Expected:** Future date accepted (no upper limit observed)

### LOCAL-UC-14: Past date attempt
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Date: Yesterday
- **Expected:** Error: Past date not allowed / Date rejected

### LOCAL-UC-15: Early morning pickup (5 AM)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Time: 05:00 AM
- **Expected:** Early slot accepted, may show night charges

### LOCAL-UC-16: Late night pickup (11 PM)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Time: 23:00
- **Expected:** Night slot accepted, may show night charges

---

## Location Tests (P2-P3)

### LOCAL-UC-17: Airport pickup (special location)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Kempegowda International Airport
- **Expected:** Airport recognized, may have special pricing

### LOCAL-UC-18: Railway station pickup
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Pickup: Bangalore City Railway Station
- **Expected:** Station recognized in autocomplete

### LOCAL-UC-19: Different drop - same as pickup
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Pickup: MG Road, Drop: MG Road
- **Expected:** Error or warning for same location (potential defect F4)

### LOCAL-UC-20: Long distance drop (inter-city)
- **Config:** CFG-3
- **Priority:** P2
- **Data:** Pickup: Bangalore, Drop: Mysore
- **Expected:** Should suggest Outstation or show long-distance pricing

### LOCAL-UC-21: Out-of-state drop
- **Config:** CFG-3
- **Priority:** P3
- **Data:** Pickup: Bangalore, Drop: Chennai
- **Expected:** Error or redirect to Outstation module

---

## Validation Tests (P1-P3)

### LOCAL-UC-22: Empty pickup location
- **Config:** CFG-1
- **Priority:** P1
- **Data:** Pickup: (empty)
- **Expected:** Error: "Pickup location is required"

### LOCAL-UC-23: Empty drop location (CFG-3)
- **Config:** CFG-3
- **Priority:** P1
- **Data:** Pickup: Koramangala, Drop: (empty)
- **Expected:** Error: "Drop location is required"

### LOCAL-UC-24: Zero passengers
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 0
- **Expected:** Error or auto-correct to 1

### LOCAL-UC-25: Negative passengers
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: -5
- **Expected:** Error or auto-correct to 1

### LOCAL-UC-26: Zero hours
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Hours: 0
- **Expected:** Error: "Must be a positive number"

### LOCAL-UC-27: Decimal hours (1.5)
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Hours: 1.5
- **Expected:** Rounded to 1 or 2, or accepted as-is

---

## Multi-day Specific Tests (P2-P3)

### LOCAL-UC-28: Multi-day with only today selected
- **Config:** CFG-2
- **Priority:** P2
- **Data:** Dates: Today only
- **Expected:** Single day treated as 1-day multi-day trip

### LOCAL-UC-29: Multi-day with non-consecutive dates
- **Config:** CFG-2
- **Priority:** P2
- **Data:** Dates: Mon, Wed, Fri (skip days)
- **Expected:** Non-consecutive dates accepted/rejected

### LOCAL-UC-30: Multi-day across months
- **Config:** CFG-2
- **Priority:** P2
- **Data:** Dates: Last day of month + First day of next
- **Expected:** Cross-month selection works

### LOCAL-UC-31: Multi-day maximum (30 days)
- **Config:** CFG-2
- **Priority:** P3
- **Data:** Dates: 30 consecutive days
- **Expected:** Large booking accepted or limit shown

---

## Toggle Transition Tests (P2)

### LOCAL-UC-32: Toggle Multi-day ON then OFF with data
- **Config:** CFG-1
- **Priority:** P2
- **Steps:**
  1. Fill form with pickup, passengers, hours
  2. Enable Multi-day toggle
  3. Select multiple dates
  4. Disable Multi-day toggle
- **Expected:** Form resets dates or preserves single date

### LOCAL-UC-33: Toggle Different Drop ON then OFF with data
- **Config:** CFG-1
- **Priority:** P2
- **Steps:**
  1. Fill form with pickup
  2. Enable Different Drop toggle
  3. Enter drop location
  4. Disable Different Drop toggle
- **Expected:** Drop field hidden, drop location cleared

---

## Vehicle-Specific Tests (P2)

### LOCAL-UC-34: Sedan trip (1-4 pax)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 3, Hours: 4
- **Vehicle Type:** Sedan (VEH-001)
- **Expected:** Sedan available and bookable

### LOCAL-UC-35: Tempo Traveller trip (12 pax)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 12, Hours: 8
- **Vehicle Type:** 12 Seater Tempo Traveller (VEH-003)
- **Expected:** Tempo Traveller shown at capacity

### LOCAL-UC-36: Luxury bus trip (45 pax)
- **Config:** CFG-1
- **Priority:** P2
- **Data:** Passengers: 45, Hours: 10
- **Vehicle Type:** 45 Seater Luxury Volvo (VEH-016)
- **Expected:** Luxury buses shown in results

---

## Edge Case Tests (P3)

### LOCAL-UC-37: Special characters in location
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup: "St. John's Church, Bangalore"
- **Expected:** Location with apostrophe and period accepted

### LOCAL-UC-38: Unicode location name
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup: "ಬೆಂಗಳೂರು" (Kannada)
- **Expected:** Unicode handled or fallback to English suggestions

### LOCAL-UC-39: Very long location name
- **Config:** CFG-1
- **Priority:** P3
- **Data:** Pickup: "Kempegowda International Airport Terminal 2 Departure Gate"
- **Expected:** Long name handled properly in UI

### LOCAL-UC-40: Form refresh with data filled
- **Config:** CFG-1
- **Priority:** P3
- **Steps:**
  1. Fill form with all data
  2. Press F5/Refresh browser
- **Expected:** Form data persisted (draft save) or cleared

---

## Execution Checklist

| ID | Title | Priority | Status | Executed By | Date | Notes |
|----|-------|----------|--------|-------------|------|-------|
| LOCAL-UC-01 | Basic local trip | P1 | ⬜ | | | |
| LOCAL-UC-02 | Multi-day trip | P1 | ⬜ | | | |
| LOCAL-UC-03 | Different drop | P1 | ⬜ | | | |
| LOCAL-UC-04 | Multi-day + Different drop | P1 | ⬜ | | | |
| LOCAL-UC-05 | Min passengers (1) | P2 | ⬜ | | | |
| LOCAL-UC-06 | Max passengers (49) | P2 | ⬜ | | | |
| LOCAL-UC-07 | Above max (50+) | P2 | ⬜ | | | |
| LOCAL-UC-08 | Large group (100+) | P3 | ⬜ | | | |
| LOCAL-UC-09 | Min hours (1) | P2 | ⬜ | | | |
| LOCAL-UC-10 | Max hours (24) | P2 | ⬜ | | | |
| LOCAL-UC-11 | Above max (25) | P2 | ⬜ | | | |
| LOCAL-UC-12 | Same-day booking | P1 | ⬜ | | | |
| LOCAL-UC-13 | Far future (6 mo) | P3 | ⬜ | | | |
| LOCAL-UC-14 | Past date | P2 | ⬜ | | | |
| LOCAL-UC-15 | Early morning (5 AM) | P2 | ⬜ | | | |
| LOCAL-UC-16 | Late night (11 PM) | P2 | ⬜ | | | |
| LOCAL-UC-17 | Airport pickup | P2 | ⬜ | | | |
| LOCAL-UC-18 | Railway station | P2 | ⬜ | | | |
| LOCAL-UC-19 | Same pickup/drop | P2 | ⬜ | | | |
| LOCAL-UC-20 | Long distance drop | P2 | ⬜ | | | |
| LOCAL-UC-21 | Out-of-state drop | P3 | ⬜ | | | |
| LOCAL-UC-22 | Empty pickup | P1 | ⬜ | | | |
| LOCAL-UC-23 | Empty drop (CFG-3) | P1 | ⬜ | | | |
| LOCAL-UC-24 | Zero passengers | P2 | ⬜ | | | |
| LOCAL-UC-25 | Negative passengers | P2 | ⬜ | | | |
| LOCAL-UC-26 | Zero hours | P2 | ⬜ | | | |
| LOCAL-UC-27 | Decimal hours | P3 | ⬜ | | | |
| LOCAL-UC-28 | Multi-day today only | P2 | ⬜ | | | |
| LOCAL-UC-29 | Non-consecutive dates | P2 | ⬜ | | | |
| LOCAL-UC-30 | Cross-month dates | P2 | ⬜ | | | |
| LOCAL-UC-31 | Max 30 days | P3 | ⬜ | | | |
| LOCAL-UC-32 | Toggle Multi-day | P2 | ⬜ | | | |
| LOCAL-UC-33 | Toggle Diff Drop | P2 | ⬜ | | | |
| LOCAL-UC-34 | Sedan (3 pax) | P2 | ⬜ | | | |
| LOCAL-UC-35 | Tempo (12 pax) | P2 | ⬜ | | | |
| LOCAL-UC-36 | Luxury bus (45 pax) | P2 | ⬜ | | | |
| LOCAL-UC-37 | Special chars | P3 | ⬜ | | | |
| LOCAL-UC-38 | Unicode location | P3 | ⬜ | | | |
| LOCAL-UC-39 | Long location name | P3 | ⬜ | | | |
| LOCAL-UC-40 | Form refresh | P3 | ⬜ | | | |

---

## Related Files

- **CSV Version:** `documentation/Local_Functional_Test_Cases.csv`
- **Test Runner:** `tests/local-test-runner.js`
- **Exploration Screenshots:** `exploration-logs/explore-20261116-2302/`
- **Previous Test Plan:** `documentation/Local_Test_Combinations.md`
