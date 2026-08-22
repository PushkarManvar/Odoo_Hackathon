# GlobeTrotter
## Product Requirements Document

**Project:** GlobeTrotter  
**Type:** Local Hackathon Web Application  
**Architecture:** Modular Monolith  
**Status:** Architecture Planning  
**Document:** PRD v1.0

---

# 1. Product Overview

GlobeTrotter is a personalized multi-city travel planning application that allows users to design, organize, visualize, budget, and share travel itineraries.

Instead of requiring users to maintain travel plans across notes, spreadsheets, maps, and multiple websites, GlobeTrotter provides one structured location for the complete trip.

The application focuses primarily on **travel planning rather than travel booking**.

The core product loop is:

```text
Discover
   ↓
Plan
   ↓
Organize
   ↓
Budget
   ↓
Visualize
   ↓
Share
```

---

# 2. Product Vision

Create a simple but powerful travel planning system where users can convert an idea such as:

> “I want to visit Rajasthan for seven days.”

into a structured itinerary containing:

- Trip dates
- Multiple cities
- City order
- Activities
- Activity timing
- Estimated expenses
- Daily itinerary
- Calendar view
- Shareable public plan

The goal is to make planning a multi-city trip understandable and manageable without overwhelming the user.

---

# 3. Core Problem

Planning a multi-city trip normally involves information spread across several places.

A traveler may use:

- Notes for itinerary
- Google searches for destinations
- Spreadsheets for budget
- Calendar for dates
- Messaging applications for sharing

This causes:

- Fragmented information
- Difficult itinerary changes
- Budget uncertainty
- Confusing city/date management
- Difficult sharing
- Poor visibility of the entire journey

GlobeTrotter combines these planning activities into one structured system.

---

# 4. Target Users

Primary users are travelers who want to independently plan trips containing one or more destinations.

Typical users include:

### Individual Travelers
People planning personal holidays.

### Friend Groups
People preparing a shared trip.

### Students
Budget-conscious travelers planning affordable trips.

### Travel Enthusiasts
Users who enjoy building and sharing itineraries.

### Inspiration Seekers
Users browsing public trips made by others.

---

# 5. Product Goals

GlobeTrotter should allow a user to:

1. Create an account.
2. Create multiple trips.
3. Define trip dates.
4. Search destinations.
5. Add multiple city stops.
6. Control the order of stops.
7. Search activities available in a city.
8. Add activities to specific dates.
9. Add custom activities.
10. Estimate trip expenses.
11. View the itinerary day-by-day.
12. View the itinerary in calendar/timeline form.
13. Make a trip publicly shareable.
14. Copy another user's public itinerary.
15. Manage existing trips.

---

# 6. Core Domain Model

The application revolves around one central object:

```text
TRIP
```

A user owns trips:

```text
USER
  │
  └──── TRIP
```

A trip contains multiple city stops:

```text
TRIP
 │
 ├── Jaipur
 ├── Jodhpur
 └── Udaipur
```

Each stop contains itinerary items:

```text
JAIPUR
 │
 ├── Amber Fort
 ├── Hawa Mahal
 └── Food Tour
```

Therefore the core hierarchy is:

```text
User
 ↓
Trip
 ↓
Trip Stop
 ↓
Itinerary Item
```

Cities and activities provide reusable discovery data.

```text
City
 ↓
Activity
```

An itinerary item may reference an existing activity or represent a custom user-created activity.

---

# 7. Primary User Journey

```text
Signup / Login
      ↓
Dashboard
      ↓
Create Trip
      ↓
Enter Trip Details
      ↓
Add First City
      ↓
Set Stop Dates
      ↓
Add Activities
      ↓
Add More Cities
      ↓
View Itinerary
      ↓
View Budget
      ↓
View Calendar
      ↓
Share Trip
```

---

# 8. Authentication

## Signup

User provides:

- Name
- Email
- Password

System:

1. Validates input.
2. Verifies email is not already registered.
3. Hashes password.
4. Creates account.
5. Issues JWT.

---

## Login

User provides:

- Email
- Password

System:

1. Finds account.
2. Verifies password.
3. Issues JWT.
4. Returns basic user information.

---

# 9. Dashboard

The dashboard acts as the application home page.

It should display:

- Welcome message
- Upcoming trips
- Recent trips
- Quick "Plan New Trip" action
- Suggested destinations
- Basic budget highlights where available

The dashboard is primarily an aggregation screen.

It should not maintain separate copies of trip information.

---

# 10. Create Trip

Users can create a trip using:

- Trip name
- Description
- Start date
- End date
- Optional cover image
- Currency
- Planned budget

Example:

```text
Name:
Rajasthan Heritage Trip

Start:
01 October 2026

End:
07 October 2026

Budget:
₹30,000
```

After creation, the user should be taken to the itinerary builder.

---

# 11. My Trips

Users can view all trips they own.

Each trip card should contain:

- Trip name
- Date range
- Number of stops
- Visibility
- Estimated cost where available

Available actions:

- View
- Edit
- Delete

Trips may eventually be categorized as:

- Upcoming
- Current
- Past

This categorization is optional for MVP.

---

# 12. Multi-City Stops

Trips may contain multiple ordered city stops.

Example:

```text
1. Jaipur
2. Jodhpur
3. Udaipur
```

Each stop contains:

- City
- Arrival date
- Departure date
- Sequence order
- Optional notes

Users can:

- Add stop
- Edit stop
- Delete stop
- Reorder stops

---

# 13. City Discovery

Users should be able to search the local city dataset.

Search/filter information may include:

- City name
- Country
- Region
- Cost index
- Popularity

Example:

```text
Search: Jaipur

Jaipur
India
Rajasthan

Cost Index: 2/5
Popularity: 92
```

User can select:

```text
Add to Trip
```

The MVP uses locally seeded data instead of requiring an external travel API.

---

# 14. Activity Discovery

Each city contains available activities.

Example:

```text
Amber Fort
Sightseeing
₹500
180 mins
```

Possible activity categories:

- Sightseeing
- Food
- Adventure
- Culture
- Shopping
- Relaxation
- Other

Users may filter activities by:

- Category
- Maximum cost
- Duration

---

# 15. Itinerary Builder

The itinerary builder is the core product feature.

It allows users to construct their complete trip.

Example:

```text
Rajasthan Trip
01 Oct → 07 Oct

────────────────────

JAIPUR
01 Oct → 03 Oct

01 OCT

09:00 Amber Fort
13:00 Lunch
17:00 Hawa Mahal

02 OCT

10:00 City Palace
18:00 Food Tour

────────────────────

JODHPUR
04 Oct → 05 Oct

+ Add Activity

────────────────────

+ Add Stop
```

Users should be able to:

- Add city stops
- Edit stop dates
- Remove stops
- Add activities
- Add custom itinerary items
- Modify activity cost
- Set activity date
- Set activity time
- Set duration
- Add notes
- Reorder items

---

# 16. Master Activity vs Itinerary Item

The system must distinguish between activity information and a user's scheduled activity.

Example master activity:

```text
Amber Fort
Default cost: ₹500
Duration: 180 minutes
```

User itinerary assignment:

```text
Amber Fort

Date:
02 October

Start:
09:30

Cost:
₹600

Duration:
150 minutes

Notes:
Arrive early
```

Changing the user's itinerary item must not modify the global activity.

---

# 17. Custom Itinerary Items

Users may create itinerary entries even if they are not present in activity discovery.

Example:

```text
Visit Friend

Cost:
₹0

Time:
19:00
```

An itinerary item must contain either:

```text
activityId
```

or:

```text
customName
```

At least one is required.

---

# 18. Budget System

The system should help travelers estimate their trip cost.

Primary cost categories:

- Activities
- Transport
- Stay
- Meals

Trip may contain:

```text
Planned Budget
Transport Estimate
Stay Estimate
Meal Estimate
```

Activity cost is calculated from itinerary items.

Example:

```text
Planned Budget
₹50,000

Transport
₹10,000

Stay
₹15,000

Meals
₹7,000

Activities
₹8,000

────────────

Estimated Total
₹40,000

Remaining
₹10,000
```

The application should calculate:

```text
estimated total
remaining budget
average cost per day
category breakdown
stop breakdown
```

---

# 19. Budget Data Rule

Calculated totals must not be stored redundantly.

Instead:

```text
Trip Budget Fields
       +
Itinerary Item Costs
       ↓
Budget Service
       ↓
Calculated Budget Response
```

This ensures the budget automatically updates when an activity changes.

---

# 20. Itinerary View

Users should be able to view their trip without editing controls.

The itinerary may be grouped by:

```text
City
 ↓
Date
 ↓
Activity
```

Example:

```text
JAIPUR

October 1

09:00 Amber Fort
13:30 Lunch

October 2

10:00 City Palace
17:00 Hawa Mahal
```

---

# 21. Calendar / Timeline

The application provides another visualization of the same itinerary data.

No separate calendar database should exist.

Calendar information is generated from:

```text
Trip
 ↓
Stops
 ↓
Itinerary Items
 ↓
Group By Date
```

Possible presentation:

```text
OCT 02

09:30 Amber Fort
13:00 Lunch
17:00 Hawa Mahal
```

---

# 22. Sharing

Trip owners may publish their itinerary.

Private trip:

```text
visibility = PRIVATE
```

Public trip:

```text
visibility = PUBLIC
```

Publishing creates a unique share slug.

Example:

```text
/public/rajasthan-trip-k8fd3p
```

Public visitors may view:

- Trip name
- Dates
- Cities
- Activities
- Estimated cost
- Trip description

Sensitive user/account information must not be included.

---

# 23. Copy Trip

Logged-in users may copy a public itinerary.

Example:

```text
User A
Rajasthan Trip
        ↓
     COPY
        ↓
User B
Rajasthan Trip
```

The copied trip must:

- Receive a new ID
- Belong to User B
- Receive new stop IDs
- Receive new itinerary item IDs
- Maintain references to master cities/activities
- Become PRIVATE
- Have no share slug

The cloning operation must execute inside one database transaction.

---

# 24. User Profile

MVP profile functionality may include:

- Name
- Email
- Profile picture
- Language preference
- Delete account

Advanced preference management is lower priority.

---

# 25. Core Business Rules

## Trip

```text
startDate <= endDate
```

---

## Stop

```text
arrivalDate <= departureDate
```

Stop dates must remain inside trip dates.

```text
trip.startDate
     ≤
stop.arrivalDate
     ≤
stop.departureDate
     ≤
trip.endDate
```

---

## Itinerary Item

Item date must remain inside its stop.

```text
stop.arrivalDate
     ≤
item.date
     ≤
stop.departureDate
```

---

## Activity

If an item references a master activity:

```text
activity.cityId
```

must match:

```text
tripStop.cityId
```

---

# 26. Date Handling

Trip-related dates represent calendar dates rather than timestamps.

The database should therefore use PostgreSQL `DATE`.

Prisma fields:

```prisma
DateTime @db.Date
```

This applies to:

- `Trip.startDate`
- `Trip.endDate`
- `TripStop.arrivalDate`
- `TripStop.departureDate`
- `ItineraryItem.date`

Activity start time remains separate:

```text
"10:00"
```

This avoids unnecessary timezone conversion problems.

---

# 27. Ownership

Users may modify only trips they own.

Authorization hierarchy:

```text
Trip
 ↓
userId
```

For stops:

```text
Stop
 ↓
Trip
 ↓
userId
```

For itinerary items:

```text
Item
 ↓
Stop
 ↓
Trip
 ↓
userId
```

Ownership logic must be centralized instead of duplicated across features.

Shared utility/service:

```text
assertTripOwnership()
```

---

# 28. Functional Requirements

The MVP must support:

- User signup
- User login
- JWT authentication
- Create trip
- Edit trip
- Delete trip
- View personal trips
- Search cities
- Add city stop
- Edit city stop
- Remove city stop
- Reorder stops
- Search activities
- Add activity
- Add custom activity
- Edit itinerary item
- Delete itinerary item
- Day-wise itinerary
- Automatic budget calculation
- Calendar/timeline visualization
- Publish trip
- View public trip
- Copy public trip

---

# 29. Non-Functional Requirements

## Performance

For the local demo, standard operations should feel immediate.

No advanced optimization infrastructure is required.

---

## Reliability

Critical modifications should not leave partially written data.

Transactions should be used where multiple related writes must succeed together.

Most importantly:

```text
Copy Trip
```

---

## Security

Required:

- Password hashing
- JWT validation
- Ownership validation
- Input validation
- No password hashes returned to frontend
- Public endpoints expose only public information

---

## Maintainability

The backend follows feature-based modules.

```text
auth/
trips/
stops/
cities/
activities/
itinerary/
budget/
sharing/
```

Business logic belongs in services rather than controllers.

---

# 30. MVP

The protected MVP is:

```text
Authentication
      ↓
Create Trip
      ↓
Add Multiple Cities
      ↓
Add Activities
      ↓
Day-wise Itinerary
      ↓
Budget Calculation
      ↓
Calendar
      ↓
Public Sharing
```

This workflow must work before optional enhancements are attempted.

---

# 31. Priority Levels

## P0 — Must Work

- Authentication
- Trip CRUD
- Stops
- Activities
- Itinerary
- Budget
- Calendar
- Sharing

---

## P1 — Strong Enhancements

- Copy trip
- Destination recommendations
- Filters
- Budget charts
- Better timeline visualization
- Saved destinations

---

## P2 — Optional

- Admin analytics
- Advanced animations
- Advanced profile customization
- Drag-and-drop everywhere
- Complex analytics

---

# 32. Out of Scope for MVP

GlobeTrotter is not intended to become a booking system during the hackathon.

Not required:

- Flight booking
- Hotel booking
- Payment gateway
- Live airline pricing
- Live hotel inventory
- Visa processing
- Real-time navigation
- Real-time collaborative editing
- Production cloud infrastructure
- Microservices
- AI trip generator
- Chatbot
- Dynamic foreign exchange system

These may be described as future extensions.

---

# 33. Success Criteria

The MVP is successful if a judge can perform this complete journey:

```text
Create Account

        ↓

Create Rajasthan Trip

        ↓

Add Jaipur

        ↓

Add Jodhpur

        ↓

Add Udaipur

        ↓

Schedule Activities

        ↓

View Day-wise Itinerary

        ↓

View Automatic Budget

        ↓

View Calendar

        ↓

Publish Trip

        ↓

Open Public Trip
```

Bonus success:

```text
Second User
     ↓
Copies Public Trip
     ↓
Receives Independent Editable Copy
```

---

# 34. Product Principle

The most important product principle is:

> **Trip data is stored once and visualized many ways.**

```text
                    TRIP DATA
                        │
          ┌─────────────┼──────────────┐
          ↓             ↓              ↓
      Itinerary       Calendar       Budget
```

The itinerary, calendar, budget, dashboard and public view must derive from the same underlying trip data rather than maintaining separate copies.

---

# 35. Final Product Definition

GlobeTrotter is:

> A relational multi-city travel planning platform that allows users to discover destinations, build structured itineraries, schedule activities, estimate expenses, visualize their journey and share travel plans.

The project prioritizes a strong core planning experience over unnecessary integrations or excessive feature count.