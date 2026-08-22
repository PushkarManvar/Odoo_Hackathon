# GlobeTrotter — User Flow

## 1. Purpose

This document defines how users move through GlobeTrotter from authentication to trip creation, itinerary building, budget review, and sharing.

It is the product-flow source of truth.

When implementing a feature, the frontend and backend should follow these flows instead of inventing new behavior independently.

---

# 2. User Types

GlobeTrotter mainly has two user types.

### Authenticated User

An authenticated user can:

- Create trips
- View their trips
- Edit their trips
- Delete their trips
- Add cities/stops
- Reorder stops
- Add activities
- Remove activities
- View estimated trip cost
- View itinerary/calendar
- Share a trip
- Copy a public trip
- Manage their profile

### Public User

A user who is not logged in can:

- Open a publicly shared itinerary
- View trip details
- View cities and activities
- View the itinerary
- View the estimated budget

A public user must log in or create an account before copying the trip into their own account.

---

# 3. Main User Journey

```text
Landing / Login
      ↓
Dashboard
      ↓
Create Trip
      ↓
Add Trip Details
      ↓
Add City Stops
      ↓
Set Dates / Duration
      ↓
Add Activities
      ↓
Review Itinerary
      ↓
Review Budget
      ↓
Save Trip
      ↓
Share Trip
```

The central GlobeTrotter experience is:

> Trip → Stops → Activities → Itinerary → Budget → Share

---

# 4. Authentication Flow

## New User

```text
Open GlobeTrotter
      ↓
Signup
      ↓
Enter account details
      ↓
Account created
      ↓
User authenticated
      ↓
Dashboard
```

## Existing User

```text
Open GlobeTrotter
      ↓
Login
      ↓
Enter credentials
      ↓
Credentials verified
      ↓
JWT issued
      ↓
Dashboard
```

## Invalid Login

```text
Login
  ↓
Invalid credentials
  ↓
Show error
  ↓
Remain on Login page
```

---

# 5. Dashboard Flow

After login, the user lands on the Dashboard.

The Dashboard should allow the user to:

- View existing trips
- Start a new trip
- Continue editing a trip
- Open a completed trip
- Browse public/shared trips if discovery is included

```text
Login
  ↓
Dashboard
  ├── Create New Trip
  ├── Open Existing Trip
  └── Browse Shared Trips
```

---

# 6. Create Trip Flow

The user selects:

**Create Trip**

The user enters basic trip information.

Example fields:

- Trip name
- Start date
- End date
- Visibility

Visibility values:

```text
PRIVATE
PUBLIC
```

Flow:

```text
Dashboard
    ↓
Create Trip
    ↓
Enter trip details
    ↓
Validate input
    ↓
Create trip
    ↓
Trip Builder
```

The authenticated user becomes the owner of the created trip.

---

# 7. Trip Builder Flow

The Trip Builder is the main working area of GlobeTrotter.

A trip contains multiple stops.

```text
Trip
 ├── Stop 1
 ├── Stop 2
 └── Stop 3
```

Each stop represents a city/location included in the journey.

Example:

```text
Europe Trip
 ├── Paris
 ├── Amsterdam
 └── Berlin
```

---

# 8. Add City / Stop Flow

From the Trip Builder:

```text
Trip Builder
      ↓
Add Stop
      ↓
Search City
      ↓
Select City
      ↓
Choose dates / duration
      ↓
Add Stop
      ↓
Trip updated
```

A stop should contain information such as:

- City
- Arrival/start date
- Departure/end date
- Position/order
- Estimated accommodation cost
- Estimated transport cost

---

# 9. Reorder Stops Flow

Users can change the order in which cities are visited.

Example:

```text
Before

Paris
 ↓
Amsterdam
 ↓
Berlin
```

User changes the order:

```text
Paris
 ↓
Berlin
 ↓
Amsterdam
```

The updated order must be persisted in the backend.

The stop `position` value determines the final ordering.

---

# 10. Edit Stop Flow

```text
Trip Builder
      ↓
Select Stop
      ↓
Edit Stop
      ↓
Change dates / costs / details
      ↓
Save
      ↓
Trip recalculated
```

Changing stop dates may affect the itinerary associated with that stop.

The frontend should warn the user if changing dates makes existing itinerary items invalid.

---

# 11. Delete Stop Flow

```text
Trip Builder
      ↓
Select Stop
      ↓
Delete
      ↓
Confirm deletion
      ↓
Stop removed
      ↓
Associated itinerary items removed
      ↓
Budget recalculated
```

Deletion should require confirmation because removing a stop may also remove activities associated with it.

---

# 12. Activity Discovery Flow

Inside a city stop, the user can search for activities.

Examples:

- Sightseeing
- Food
- Museum
- Adventure
- Shopping
- Entertainment

Flow:

```text
City Stop
   ↓
Add Activity
   ↓
Search / Browse Activities
   ↓
Select Activity
   ↓
View Activity Details
   ↓
Add to Itinerary
```

Activity information may include:

- Name
- Category
- Description
- Estimated price
- Duration
- Location

---

# 13. Add Activity to Itinerary

After selecting an activity:

```text
Activity
   ↓
Add to Itinerary
   ↓
Choose date
   ↓
Choose time
   ↓
Enter / confirm cost
   ↓
Save
   ↓
Itinerary updated
```

The activity becomes an **Itinerary Item** belonging to:

```text
User
  ↓
Trip
  ↓
Stop
  ↓
Itinerary Item
```

---

# 14. Edit Activity / Itinerary Item

The user can modify an itinerary item.

Editable information may include:

- Date
- Start time
- Cost
- Notes
- Activity

Flow:

```text
Itinerary
    ↓
Select Item
    ↓
Edit
    ↓
Update details
    ↓
Save
    ↓
Budget recalculated
```

---

# 15. Remove Activity Flow

```text
Itinerary
    ↓
Select Activity
    ↓
Remove
    ↓
Confirm
    ↓
Activity removed
    ↓
Budget recalculated
```

Removing an itinerary item does not delete the global activity itself.

It only removes that activity from the user's trip.

---

# 16. Itinerary View Flow

The user can view their complete journey as a timeline/calendar.

Example:

```text
Day 1 — Paris

09:00  Eiffel Tower
12:00  Lunch
15:00  Louvre Museum


Day 2 — Paris

10:00  Montmartre
14:00  Seine Cruise


Day 3 — Amsterdam

10:00  Rijksmuseum
16:00  Canal Tour
```

The itinerary should primarily be generated from:

```text
Trip Stops
+
Dates
+
Itinerary Items
```

---

# 17. Budget Flow

GlobeTrotter automatically calculates the estimated trip budget.

The primary calculation is:

```text
Total Trip Cost
=
Activity Costs
+
Accommodation Costs
+
Transport Costs
```

The budget updates whenever relevant trip data changes.

Example:

```text
Activities       ₹20,000
Accommodation    ₹35,000
Transport        ₹15,000
-------------------------
Total             ₹70,000
```

Flow:

```text
Trip
 ↓
Budget Page
 ↓
Fetch trip costs
 ↓
Calculate category totals
 ↓
Display breakdown
```

The backend should be responsible for producing the authoritative totals.

The frontend should display them.

---

# 18. My Trips Flow

The user can access all trips they own.

```text
Dashboard
    ↓
My Trips
    ↓
Trip List
```

Each trip card can contain:

- Trip name
- Dates
- Number of stops
- Estimated budget
- Visibility
- Last updated date

Selecting a trip opens its Trip Details / Builder page.

---

# 19. Edit Existing Trip

```text
My Trips
    ↓
Select Trip
    ↓
Trip Details
    ↓
Edit Trip
```

From here the user can:

- Change trip information
- Add/remove stops
- Reorder stops
- Add/remove activities
- Change itinerary
- Review budget
- Change visibility
- Share the trip

---

# 20. Delete Trip Flow

```text
My Trips
    ↓
Select Trip
    ↓
Delete Trip
    ↓
Confirmation
    ↓
Trip deleted
    ↓
Return to My Trips
```

Deleting a trip should also remove or cascade-delete its owned child records where appropriate:

```text
Trip
 ├── Stops
 └── Itinerary Items
```

The user must never be allowed to delete another user's trip.

---

# 21. Share Trip Flow

The owner can share their trip.

```text
Trip Details
     ↓
Share
     ↓
Set visibility to PUBLIC
     ↓
Generate / expose share link
     ↓
Copy link
```

Example conceptual route:

```text
/shared/:tripId
```

Anyone with access to the public trip can open the shared itinerary.

---

# 22. Public Trip Flow

```text
Shared Link
    ↓
Public Trip Page
    ↓
View Trip
```

A public viewer can see:

- Trip overview
- Cities/stops
- Activity itinerary
- Timeline
- Estimated budget

A public viewer cannot edit the original trip.

---

# 23. Copy Public Trip Flow

A user may use another public trip as inspiration.

```text
Public Trip
    ↓
Copy Trip
    ↓
Is user logged in?
```

### Logged In

```text
Copy Trip
   ↓
Create duplicate under current user
   ↓
Copy stops
   ↓
Copy itinerary items
   ↓
New PRIVATE trip created
   ↓
Open copied trip
```

### Not Logged In

```text
Copy Trip
   ↓
Login / Signup
   ↓
Authentication successful
   ↓
Copy trip
```

The copied trip must belong to the user who copied it.

Changes to the copied trip must never affect the original trip.

---

# 24. Profile / Settings Flow

```text
Dashboard
   ↓
Profile / Settings
```

The user can view or update supported profile details.

They can also log out.

Logout flow:

```text
Settings
   ↓
Logout
   ↓
Remove authentication token
   ↓
Login Page
```

---

# 25. Authorization Flow

Every protected backend request must verify the user.

```text
Request
   ↓
JWT Middleware
   ↓
Valid token?
```

If no:

```text
401 Unauthorized
```

If yes:

```text
req.user
   ↓
Route Handler
```

For resources owned by a user:

```text
Request
   ↓
Authentication Check
   ↓
Ownership Check
   ↓
Perform Action
```

Example:

```text
DELETE /trips/:tripId
```

Backend flow:

```text
Authenticate user
       ↓
Load trip
       ↓
Does trip.userId === req.user.id?
       ↓
 YES                   NO
  ↓                     ↓
Delete               403 Forbidden
```

Ownership logic should use the project's shared ownership helper rather than implementing separate ownership checks in every feature.

---

# 26. Ownership Hierarchy

Ownership should ultimately resolve back to the trip owner.

```text
User
 ↓
Trip
 ↓
Stop
 ↓
Itinerary Item
```

Therefore, when modifying a stop or itinerary item, the backend should verify ownership through its trip.

Example:

```text
User attempts to delete itinerary item
           ↓
Load itinerary item
           ↓
Resolve related trip
           ↓
Compare trip.userId with authenticated user
           ↓
Allow / reject
```

---

# 27. Error Flow

The API should return the project's common error format.

Typical frontend flow:

```text
User Action
    ↓
API Request
    ↓
Success?
```

### Yes

```text
Update UI
```

### No

```text
Read API error
    ↓
Show user-friendly message
    ↓
Keep user data when possible
```

Common cases:

```text
400 — Invalid input
401 — Authentication required
403 — User does not own resource
404 — Resource not found
409 — Conflict
500 — Server error
```

---

# 28. Empty States

The application must handle empty states intentionally.

### No Trips

```text
You haven't created a trip yet.
[Create Your First Trip]
```

### No Stops

```text
No destinations added yet.
[Add Destination]
```

### No Activities

```text
No activities planned for this city.
[Add Activity]
```

### No Shared Trips

Display an appropriate empty state rather than a broken or blank page.

---

# 29. Main Frontend Routes

Suggested route structure:

```text
/
│
├── /login
├── /signup
│
├── /dashboard
│
├── /trips
│   ├── /new
│   └── /:tripId
│       ├── /itinerary
│       └── /budget
│
├── /shared/:tripId
│
└── /settings
```

Exact frontend route naming may change during implementation, but the underlying user flow should remain the same.

---

# 30. Complete Happy Path

The primary demo flow should work from beginning to end.

```text
Signup / Login
      ↓
Dashboard
      ↓
Create Trip
      ↓
"Europe Adventure"
      ↓
Add Paris
      ↓
Add Amsterdam
      ↓
Add Berlin
      ↓
Set dates
      ↓
Add activities to each city
      ↓
Open itinerary
      ↓
View day-by-day plan
      ↓
Open budget
      ↓
View total estimated cost
      ↓
Make trip PUBLIC
      ↓
Copy share link
      ↓
Open public itinerary
```

This is the most important end-to-end journey for the hackathon demo.

---

# 31. MVP Priority Flow

If development time becomes limited, preserve this flow before everything else:

```text
Authentication
      ↓
Create Trip
      ↓
Add Stops
      ↓
Add Activities
      ↓
View Itinerary
      ↓
View Budget
      ↓
Share Trip
```

Features outside this flow should not delay the core journey.

---

# 32. Final Product Flow

```text
                    ┌──────────────┐
                    │ Login/Signup │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Create Trip  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Add Stops   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │Add Activities│
                    └──────┬───────┘
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
          ┌──────────────┐   ┌──────────────┐
          │  Itinerary   │   │    Budget    │
          └──────┬───────┘   └──────┬───────┘
                 │                   │
                 └─────────┬─────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Share Trip  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Public Trip  │
                    └──────────────┘
```

---

# 33. Rule

Whenever there is uncertainty about what should happen after a user action:

1. Check this user flow.
2. Check the database relationships.
3. Check the API contract.
4. Do not invent a conflicting frontend-only or backend-only behavior.

The goal is for the frontend, backend, and database to represent the same product flow.