# GlobeTrotter
## Frontend Architecture

**Document:** `09_FRONTEND_ARCHITECTURE.md`  
**Status:** Locked for MVP  
**Frontend Stack:** React + Vite + TypeScript  
**Routing:** React Router  
**API Communication:** Axios  
**State Strategy:** Local state + Auth Context

---

# 1. Purpose

This document defines how the GlobeTrotter frontend is structured and how it interacts with the backend.

It is the source of truth for:

- Pages
- Routes
- Feature folders
- Component hierarchy
- API communication
- Authentication state
- Trip Builder structure
- Modal/drawer behavior
- Loading states
- Error states
- Form behavior
- Budget display
- Calendar display
- Public trip UI
- Frontend responsibility boundaries

The main principle is:

> The frontend presents and edits backend-owned trip data. It does not become a second source of truth.

---

# 2. Frontend Architecture Overview

```text id="fj3z9a"
┌──────────────────────────────┐
│          React App           │
│                              │
│ Pages                        │
│ Features                     │
│ Components                   │
│ Context                      │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│          API Layer           │
│                              │
│ Feature API functions        │
│ Axios Instance               │
│ JWT Interceptor              │
└───────────────┬──────────────┘
                │
                ▼
        Express REST API
```

---

# 3. Frontend Responsibility

Frontend owns:

- Visual presentation
- Navigation
- Form state
- Temporary UI state
- Loading indicators
- Client-side validation for UX
- Modal state
- Selected stop/day state
- Display formatting

Frontend does **not** own:

- Resource ownership
- Final date validation
- Budget calculation truth
- Authentication authority
- Public visibility authority
- Trip-copy transaction logic
- Database relationships

---

# 4. Source of Truth

The authoritative state is:

```text id="9wcjsf"
PostgreSQL
   ↓
Backend API
   ↓
Frontend
```

The frontend may temporarily cache data, but after server mutations the local UI should be synchronized with the backend response.

---

# 5. Frontend Root Structure

```text id="cjx0uq"
src/
├── pages/
├── features/
├── components/
├── routes/
├── lib/
├── hooks/
├── context/
├── types/
├── assets/
├── App.tsx
└── main.tsx
```

---

# 6. Route Structure

Locked routes:

```text id="x2vcpz"
/login
/signup

/dashboard

/trips
/trips/new
/trips/:tripId
/trips/:tripId/edit
/trips/:tripId/budget
/trips/:tripId/calendar

/public/:slug

/profile
```

---

# 7. Route Categories

## Public Routes

```text id="cdd8ck"
/login
/signup
/public/:slug
```

## Protected Routes

```text id="44x3tw"
/dashboard
/trips
/trips/new
/trips/:tripId
/trips/:tripId/edit
/trips/:tripId/budget
/trips/:tripId/calendar
/profile
```

---

# 8. Router Structure

Recommended:

```text id="ixzfuh"
src/routes/
├── router.tsx
└── ProtectedRoute.tsx
```

`router.tsx` defines route-to-page mapping.

---

# 9. ProtectedRoute Responsibility

`ProtectedRoute` checks whether frontend has an authenticated session.

Concept:

```text id="2us6fk"
User opens /trips
      ↓
Token exists?
      │
   ┌──┴───┐
   │      │
  YES     NO
   │      │
   ▼      ▼
 render  /login
```

This is for UX only.

Backend still verifies JWT.

---

# 10. App Startup Flow

```text id="8ydijc"
main.tsx
   ↓
AuthProvider
   ↓
Router
   ↓
App Pages
```

Example conceptual tree:

```text id="l8ss2z"
<AuthProvider>
  <RouterProvider />
</AuthProvider>
```

---

# 11. Auth Context

File:

```text id="ua985l"
src/context/AuthContext.tsx
```

Stores:

```text id="3d0uyf"
user
token
isAuthenticated
isLoadingAuth
```

Provides functions:

```text id="vmsxwo"
login()
signup()
logout()
```

---

# 12. Auth State Restoration

After browser refresh:

```text id="96ez66"
App starts
 ↓
Read token from storage
 ↓
No token?
 └── unauthenticated

Token exists?
 ↓
GET /api/auth/me
 ↓
Success?
 ├── restore user
 └── invalid → clear token
```

---

# 13. Auth Storage

Use:

```text id="rvczqn"
src/lib/auth-storage.ts
```

Functions:

```text id="5zn6nv"
getToken()
setToken()
removeToken()
```

Do not access `localStorage` directly from every page.

---

# 14. API Client

File:

```text id="onxpva"
src/lib/api.ts
```

Shared Axios instance.

Configuration:

```text id="wj2eb2"
baseURL = VITE_API_BASE_URL
```

Example:

```text id="b0xgxy"
http://localhost:4000/api
```

---

# 15. JWT Interceptor

Before protected request:

```text id="nnk87g"
Axios request
 ↓
getToken()
 ↓
Token exists?
 ↓
Authorization: Bearer <token>
```

This logic belongs in one place.

---

# 16. Response Interceptor

Recommended basic behavior:

```text id="zpxhy4"
401
 ↓
clear invalid token
 ↓
redirect/login or trigger auth logout
```

Do not automatically logout on:

```text id="xyag2d"
403
```

because authentication is still valid.

---

# 17. Feature API Files

API calls should be grouped by feature.

Example:

```text id="vcooqs"
features/trips/trip.api.ts
```

Functions:

```text id="ma6e2c"
getTrips()
getTrip()
createTrip()
updateTrip()
deleteTrip()
```

---

# 18. Do Not Call Axios Directly Everywhere

Bad:

```text id="wgwiu3"
TripBuilderPage
 ↓
axios.post(...)
```

Preferred:

```text id="30n1wk"
TripBuilderPage
 ↓
stopApi.addStop()
 ↓
shared Axios instance
```

---

# 19. Feature Organization

```text id="zdp8zh"
features/
├── auth/
├── trips/
├── stops/
├── cities/
├── activities/
├── itinerary/
├── budget/
└── sharing/
```

Each feature can contain:

```text id="z77jen"
components/
*.api.ts
*.types.ts
*.utils.ts
```

---

# 20. Pages Organization

```text id="lr61ne"
pages/
├── auth/
├── dashboard/
├── trips/
├── public/
└── profile/
```

Pages correspond to routes.

Features contain reusable domain UI.

---

# 21. Login Page

Route:

```text id="b52ti4"
/login
```

Responsibilities:

- Email input
- Password input
- Login submission
- Loading state
- Authentication error display
- Link to signup

Flow:

```text id="4vzauh"
Submit
 ↓
authApi.login()
 ↓
Store JWT
 ↓
Set Auth Context
 ↓
/dashboard
```

---

# 22. Signup Page

Route:

```text id="gkgx9n"
/signup
```

Fields:

- Name
- Email
- Password

Flow:

```text id="8wpg1b"
Submit
 ↓
authApi.signup()
 ↓
Store JWT
 ↓
Set User
 ↓
/dashboard
```

---

# 23. Client-Side Auth Validation

Frontend may validate:

- Required email
- Email format
- Minimum password length
- Required name

This is primarily UX.

Backend validation remains authoritative.

---

# 24. Dashboard Page

Route:

```text id="pggrc2"
/dashboard
```

Main sections:

```text id="u3vquj"
Welcome

Upcoming Trips

Recent Trips

Plan New Trip

Recommended Destinations

Budget Highlight
```

Dashboard should use existing backend data instead of maintaining separate permanent state.

---

# 25. Dashboard First Version

For MVP, dashboard may call:

```text id="d34cmg"
GET /api/trips
GET /api/cities?sort=popularity
```

and derive cards.

A specialized dashboard endpoint is not initially required.

---

# 26. My Trips Page

Route:

```text id="64yh4z"
/trips
```

Displays:

```text id="j7tbbi"
TripCard[]
```

Each card may show:

- Trip name
- Dates
- Stop count
- Visibility
- Planned/estimated budget summary if available

Actions:

```text id="011mpf"
View
Edit
Delete
```

---

# 27. Trips Empty State

If no trips:

```text id="4n83zj"
No trips yet.

[Plan your first trip]
```

Do not show a blank page.

---

# 28. Create Trip Page

Route:

```text id="dsp1cb"
/trips/new
```

Form fields:

```text id="vmxhcx"
Trip Name
Description
Start Date
End Date
Planned Budget
Transport Estimate
Stay Estimate
Meal Estimate
Currency
Cover Image URL optional
```

---

# 29. Create Trip Flow

```text id="51yvrf"
CreateTripPage
      ↓
submit
      ↓
POST /api/trips
      ↓
Trip created
      ↓
navigate:
      ↓
/trips/:tripId/edit
```

The user enters the builder immediately.

---

# 30. Trip View Page

Route:

```text id="tp1frl"
/trips/:tripId
```

Read-only owner view.

May display:

- Trip header
- City route
- Day-wise itinerary
- Budget summary
- Edit button
- Share button

This is distinct from builder/editing mode.

---

# 31. Trip Builder Page

Route:

```text id="sq2e27"
/trips/:tripId/edit
```

This is the most important frontend screen.

Its job is to manage:

```text id="grjr9s"
Stops
Days
Activities
Custom items
Dates
Ordering
```

---

# 32. Trip Builder Component Tree

Recommended:

```text id="5s3ocp"
TripBuilderPage
│
├── TripBuilderHeader
│   ├── BackButton
│   ├── TripTitle
│   ├── DateRange
│   └── Save/Share Actions
│
├── TripSummaryBar
│   ├── Stops Count
│   ├── Day Count
│   └── Budget Preview
│
├── StopList
│   │
│   ├── StopCard
│   │   ├── StopHeader
│   │   ├── StopDates
│   │   ├── StopActions
│   │   └── DayPlan[]
│   │        └── ItineraryItemCard[]
│   │
│   └── AddStopButton
│
├── CitySearchModal
│
├── ActivitySearchModal
│
├── AddCustomItemModal
│
└── EditItemModal
```

---

# 33. Builder Data Source

Primary load:

```text id="imcpva"
GET /api/trips/:tripId
```

This returns:

```text id="xlqyxo"
Trip
└── Stops
    ├── City
    └── Items
        └── Activity
```

One nested request should power the main builder.

---

# 34. Builder Local State

Appropriate temporary state:

```text id="2lt1aw"
trip
selectedStopId
selectedDate
isCityModalOpen
isActivityModalOpen
editingItem
loading
mutationLoading
```

Do not create global Context for every one of these.

They belong to Builder page/feature.

---

# 35. Add Stop UX

Flow:

```text id="0rf6tg"
+ Add Stop
   ↓
CitySearchModal
   ↓
Search city
   ↓
Select Jaipur
   ↓
Enter arrival/departure
   ↓
Submit
   ↓
POST /trips/:tripId/stops
   ↓
Update trip state
```

---

# 36. City Search Modal

Recommended contents:

```text id="8mwbbg"
Search input
Country filter optional
City results
Cost index
Popularity
Image
Add button
```

Search:

```text id="ehbfow"
GET /api/cities?search=...
```

---

# 37. Debounced Search

City/activity search should avoid sending a request every keystroke.

Recommended delay:

```text id="11m09p"
250–400 ms
```

Use:

```text id="rf1erw"
useDebounce()
```

---

# 38. Add Stop Form Validation

Frontend checks:

```text id="entv8v"
arrival date selected
departure date selected
arrival <= departure
dates visually inside trip range
```

Backend validates again.

---

# 39. Stop Card

A `StopCard` displays:

```text id="3mkhzc"
Jaipur
01 Oct → 03 Oct

Day 1
...

Day 2
...

[Add Activity]
```

Actions:

```text id="ujok8a"
Edit Dates
Delete
Reorder
```

---

# 40. Stop Reordering

Initial MVP may use simple:

```text id="dv0ij4"
Move Up
Move Down
```

instead of drag-and-drop.

Example:

```text id="p72hv3"
↑
↓
```

This is dramatically easier and still demonstrates reordering.

Drag-and-drop can be added later if time permits.

---

# 41. Stop Reorder Flow

```text id="nicsd0"
User changes order
 ↓
new stop ID array
 ↓
PATCH /api/trips/:tripId/stops/reorder
 ↓
Backend transaction
 ↓
return new ordering
 ↓
update UI
```

---

# 42. Grouping Stop Days

Given:

```text id="mcd2ry"
arrivalDate = 01 Oct
departureDate = 03 Oct
```

frontend can generate:

```text id="yu56x4"
01 Oct
02 Oct
03 Oct
```

and group itinerary items accordingly.

---

# 43. DayPlan Component

Recommended:

```text id="3rg76b"
DayPlan
├── Date Header
├── ItineraryItemCard[]
└── Add Activity Button
```

---

# 44. Add Activity Flow

```text id="6mg651"
Choose Day
 ↓
Add Activity
 ↓
ActivitySearchModal
 ↓
GET city activities
 ↓
Select Activity
 ↓
Set time/cost/duration
 ↓
POST /api/stops/:stopId/items
```

The day selected in UI automatically supplies item date.

---

# 45. Activity Search Modal

Contains:

```text id="lzkteo"
Search
Category filter
Max cost optional
Duration filter optional
Results
```

Each Activity card:

```text id="ru39l6"
Image
Name
Category
Estimated Cost
Duration
[Add]
```

---

# 46. Activity Selection

When activity selected, prefill:

```text id="i6dbli"
duration = Activity.durationMins

cost display = Activity.estimatedCost
```

`customCost` remains blank/null unless user changes the estimate.

---

# 47. Cost Override UX

Example:

```text id="hz7j47"
Estimated Cost: ₹500

Your Estimate:
[ 650 ]
```

If user doesn't change:

```text id="8btgnw"
customCost = null
```

Backend uses master cost.

If changed:

```text id="6s69me"
customCost = 650
```

---

# 48. Add Custom Item Flow

Button:

```text id="7acru4"
+ Custom Activity
```

Form:

```text id="zqwlvc"
Name
Time
Duration
Cost
Notes
```

Request uses:

```text id="v48e1s"
customName
customCost
activityId = null
```

---

# 49. ItineraryItemCard

Displays effective item:

```text id="nk4qgt"
09:00
Amber Fort

2h 30m
₹600

Edit
Delete
```

For custom item:

```text id="7iypf4"
19:00
Dinner with Friends
₹900
```

---

# 50. Item Name Resolution

Frontend display name:

```text id="39tauh"
activity?.name ?? customName
```

Given business rule XOR, exactly one meaningful name should exist.

---

# 51. Effective Cost Display

Frontend may receive raw fields in private builder data.

For local display:

```text id="1c78im"
customCost ?? activity.estimatedCost ?? 0
```

However, authoritative aggregate calculations still come from budget service.

---

# 52. Edit Item

Edit modal allows:

```text id="tcy9g9"
Date
Time
Duration
Cost
Notes
```

For MVP it does not switch master activity into another activity.

To change activity:

```text id="xfqxw1"
Delete
+
Add new activity
```

---

# 53. Delete Item

Frontend should show confirmation.

Then:

```text id="382ias"
DELETE /api/items/:itemId
```

On success:

- Remove item from local state
- Or refetch trip

---

# 54. Mutation Strategy

Two valid patterns:

## Pattern A — Server response update

```text id="x9r3jc"
Mutation
 ↓
receive updated entity
 ↓
update local state
```

## Pattern B — Refetch

```text id="ybwq8l"
Mutation
 ↓
success
 ↓
GET trip again
```

For hackathon reliability, refetching after larger mutations is acceptable.

---

# 55. Recommended Mutation Approach

Use local update for simple items where obvious.

Use refetch for:

```text id="bl1ko6"
Stop reorder
Stop deletion
Trip date changes
Complex copy result
```

Correctness is more important than avoiding a small local API call.

---

# 56. Optimistic Updates

Not required.

Do not implement optimistic reordering unless team already knows how.

Safer:

```text id="kicivu"
User clicks
 ↓
loading
 ↓
server confirms
 ↓
update UI
```

---

# 57. Budget Page

Route:

```text id="8mpne9"
/trips/:tripId/budget
```

Fetch:

```text id="wv5ak8"
GET /api/trips/:tripId/budget
```

Displays:

```text id="xcx34x"
Planned Budget
Estimated Total
Remaining / Over Budget
Average Per Day

Transport
Stay
Meals
Activities
```

---

# 58. Budget Summary Component

Example:

```text id="fh408w"
Budget

Planned            ₹40,000
Estimated          ₹31,000
Remaining           ₹9,000
Avg / Day           ₹4,429
```

---

# 59. Over-Budget UI

If:

```text id="w168rv"
isOverBudget = true
```

display:

```text id="wwu3b6"
Over budget by ₹4,500
```

Do not recalculate the over-budget logic differently in the frontend.

---

# 60. Budget Charts

Optional:

```text id="px6tn8"
Recharts
```

Possible:

```text id="w61reu"
Pie Chart:
Transport
Stay
Meals
Activities
```

Chart consumes backend breakdown.

---

# 61. Budget Loading State

Do not show:

```text id="10a46q"
₹0
```

while budget is loading because that may look like real data.

Show skeleton/spinner.

---

# 62. Calendar Page

Route:

```text id="e3c94k"
/trips/:tripId/calendar
```

Calendar can initially use:

```text id="x3ocpn"
GET /api/trips/:tripId
```

and group items by date.

A dedicated timeline endpoint is optional.

---

# 63. Calendar MVP UI

A vertical timeline is acceptable and often faster than a complex month calendar.

Example:

```text id="ofp9ye"
OCT 01
Jaipur

09:00 Amber Fort
13:00 Lunch

──────────

OCT 02
Jaipur

10:00 City Palace
17:00 Hawa Mahal
```

This satisfies journey visualization without calendar-library complexity.

---

# 64. Calendar Source

Do not maintain separate calendar state in database.

Generate:

```text id="ob63m0"
Trip.stops[].items[]
 ↓
group by item.date
```

---

# 65. Calendar Empty Day

A trip day with no activities may still be displayed:

```text id="psyzyz"
OCT 04
Jodhpur

No activities planned
```

This makes gaps obvious.

---

# 66. Public Trip Page

Route:

```text id="3z5nx1"
/public/:slug
```

No login required.

Fetch:

```text id="j2u4q3"
GET /api/public/:slug
```

---

# 67. Public Trip Page Contents

Recommended:

```text id="0fja6q"
Cover / Hero

Trip Name
Owner Name
Dates
City Route
Estimated Total

Day-wise Itinerary

[Copy Trip]
```

---

# 68. Public Trip Must Be Read-Only

Do not display:

```text id="a6ci67"
Edit Item
Delete Stop
Change Budget
```

Public viewers only consume the trip.

---

# 69. Copy Trip Button

If unauthenticated:

```text id="a7pgms"
Copy Trip
 ↓
redirect /login
```

Recommended preserve return intent if convenient, but not required.

If authenticated:

```text id="ua9muw"
POST /api/public/:slug/copy
 ↓
new trip ID
 ↓
/trips/:newTripId/edit
```

---

# 70. Share UI

Owner pages may have:

```text id="p6y4b9"
Share Trip
```

Private state:

```text id="jlxuon"
[Make Public]
```

Public state:

```text id="cvvjuz"
Public Link
[Copy Link]
[Make Private]
```

---

# 71. Share Path

Backend returns:

```text id="su28cc"
/public/rajasthan-trip-a7k92p
```

Frontend constructs full local URL:

```text id="tpt3w9"
window.location.origin + publicPath
```

This avoids backend hard-coding frontend host.

---

# 72. Profile Page

Route:

```text id="vl076m"
/profile
```

MVP fields:

```text id="625yku"
Name
Email display
Logout
Delete Account
```

Email editing may be deferred.

---

# 73. Delete Account UX

Before:

```text id="yj33az"
DELETE /api/profile
```

show clear confirmation.

After success:

```text id="co92s1"
remove token
clear user state
navigate /signup or /login
```

---

# 74. Shared UI Components

```text id="asr9or"
components/ui/
├── Button
├── Input
├── Select
├── Modal
├── Card
└── Spinner
```

These must remain domain-agnostic.

---

# 75. Shared Feedback Components

```text id="b70x9z"
LoadingState
ErrorState
EmptyState
```

Use consistent UI across pages.

---

# 76. Error Handling Strategy

Feature API call fails:

```text id="cys0rl"
API Error
 ↓
Normalize
 ↓
Page/component error state
 ↓
Human-readable message
```

Backend message can usually be displayed when appropriate.

---

# 77. Form Error Handling

Example backend:

```text id="9j2yj9"
STOP_OUTSIDE_TRIP_RANGE
```

UI:

```text id="mv391r"
"The stop must be within Oct 1–7."
```

Frontend may map error codes to friendlier wording.

---

# 78. Do Not Depend on Error Message Text

Prefer:

```text id="7w2f4a"
error.code
```

for branching.

Bad:

```text id="02hgqp"
if (message.includes("date"))
```

---

# 79. Loading State Rule

Every network operation should visually indicate work.

Examples:

```text id="m85z2r"
Login button → Signing in...

Create Trip → Creating...

Add Activity → Adding...

Delete → Deleting...
```

Disable duplicate submit where appropriate.

---

# 80. Empty State Rule

Every list should have intentional empty state.

Examples:

### Trips

```text id="8pj94m"
No trips yet.
```

### Stop Activities

```text id="g6hj9a"
Nothing planned for this day.
```

### Search

```text id="ggtatp"
No cities found.
```

---

# 81. Error Boundary Scope

A React Error Boundary is optional.

API failures should not crash the application.

Use normal error state for expected server failures.

---

# 82. Global State Rule

Only put data in global state if multiple distant parts of application truly need it.

Global:

```text id="bniear"
Authentication
```

Not global by default:

```text id="zqfydr"
Current modal
Selected activity
Selected builder day
Trip form input
```

---

# 83. Redux Decision

Do not use Redux for MVP.

Reasons:

- Small team
- Limited global state
- Additional boilerplate
- No requirement requiring complex state graph

---

# 84. TanStack Query Decision

Optional.

If the team already knows it, it can improve:

- Caching
- Refetch
- Loading/error state
- Mutation invalidation

If not familiar:

> Do not learn it during the hackathon.

Plain API calls + React state are enough.

---

# 85. Data Types

Feature-specific API types should mirror API contract.

Example:

```text id="sbbhfr"
TripSummary
TripDetail
TripStop
ItineraryItem
BudgetResponse
City
Activity
```

Avoid using `any`.

---

# 86. Database Types vs API Types

Frontend should not directly import Prisma types.

Why:

Database model:

```text id="9y49t5"
Trip
```

is not always equal to API:

```text id="mykdz1"
TripDetailResponse
```

The API may include:

```text id="fbgmk6"
stopCount
nested city
effective budget
```

which are not direct Prisma fields.

---

# 87. Date Handling

API date:

```text id="s1vcys"
2026-10-01
```

Frontend should treat this as a calendar date.

Avoid unnecessary:

```text id="76yvzl"
new Date("2026-10-01")
```

timezone conversions where they can shift display date.

Use date-only helpers or parse carefully.

---

# 88. Date Input

HTML:

```text id="4rfq7z"
<input type="date">
```

already uses:

```text id="o2jmq2"
YYYY-MM-DD
```

which matches API contract.

---

# 89. Time Input

Use:

```text id="2plocw"
<input type="time">
```

which naturally produces:

```text id="cqi1vt"
HH:mm
```

---

# 90. Currency Formatting

Use one helper:

```text id="eu8maz"
formatCurrency(amount, currency)
```

Example:

```text id="2q8hb8"
formatCurrency(50000, "INR")
```

→

```text id="34h9q8"
₹50,000
```

Do not manually add `₹` in dozens of components.

---

# 91. Duration Formatting

One helper:

```text id="61nid8"
formatDuration(150)
```

→

```text id="4zp5ch"
2h 30m
```

Database/API remain minutes.

---

# 92. Trip Builder State Shape

Conceptually:

```text id="qn0ddc"
TripDetail

selectedStopId
selectedDate

activeModal:
  none
  city
  activity
  customItem
  editItem

editingItemId
```

Do not keep separate disconnected copies of every stop/item where avoidable.

---

# 93. Derived Frontend Data

Allowed to derive locally:

```text id="8x1n48"
items for selected date
trip duration
city route string
stop count
```

But financial totals should use budget API where shown as authoritative.

---

# 94. City Route Display

From ordered stops:

```text id="k7a7er"
Jaipur → Jodhpur → Udaipur
```

derive from:

```text id="tbwfat"
stops sorted by sequenceOrder
```

No extra backend field necessary.

---

# 95. Frontend Update After Trip Date Change

After successful:

```text id="vnd6br"
PATCH /api/trips/:tripId
```

refetch trip.

Reason:

Dates affect:

- Builder
- Available day ranges
- Potential displays
- Budget day average

---

# 96. Frontend Update After Stop Date Change

After success:

```text id="hfrfhd"
refetch trip
```

because day grouping may change.

---

# 97. Frontend Update After Cost Change

After editing item cost:

- Update item display
- Refetch budget when entering budget view or immediately if visible

Do not manually maintain several independent budget totals.

---

# 98. Budget Preview in Builder

Optional:

```text id="23vacq"
GET /budget
```

may be called after relevant mutations.

But avoid refetching budget after every keystroke.

Trigger after saved mutation.

---

# 99. Recommended Navigation

```text id="nq0qvt"
Dashboard
 ↓
My Trips
 ↓
Trip View / Builder
```

Inside trip:

```text id="mej4l4"
Overview
Itinerary
Budget
Calendar
```

These may be tabs or buttons.

---

# 100. Mobile Responsiveness

The PS allows desktop or mobile experience. GlobeTrotter should remain responsive, but desktop-first is acceptable for hackathon.

Priority:

```text id="7jy3go"
Laptop judge demo first
```

Then:

```text id="ou50ou"
reasonable tablet/mobile adaptation
```

Do not sacrifice core functionality for perfect mobile polish.

---

# 101. Accessibility Basics

Use:

- Proper labels
- Native buttons
- Keyboard-accessible forms
- Sufficient text contrast
- Descriptive alt text for meaningful images

Do not build custom clickable `div`s when a button is appropriate.

---

# 102. Modal Rule

Modal should:

- Have a clear close action
- Prevent accidental duplicate submit
- Preserve understandable errors
- Close after successful action
- Reset form when appropriate

---

# 103. Delete Confirmation Modal

Use for:

```text id="ok8qg3"
Delete Trip
Delete Stop
Delete Item
Delete Account
```

This is frontend UX only.

---

# 104. Notifications

Optional lightweight toast library can be used.

Use for:

```text id="ik9gx1"
Trip created
Activity added
Trip published
Link copied
```

Do not rely only on toasts for critical form errors.

---

# 105. Images

Image failures should have fallback.

Example:

```text id="1musyl"
City image unavailable
→ placeholder
```

Do not allow broken images to destroy card layout.

---

# 106. City Recommendation UI

Dashboard may call:

```text id="jxmbqm"
GET /api/cities?sort=popularity
```

Show top results.

No recommendation AI is needed.

---

# 107. Activity Filter State

Keep locally:

```text id="plhe9q"
search
category
maxCost
maxDuration
```

Whenever filters change:

```text id="15p2fu"
fetch activities
```

with debounce for search text.

---

# 108. Builder Persistence Principle

There is no giant:

```text id="dw087l"
Save Entire Trip
```

required.

Mutations persist individually:

```text id="5dq149"
Add Stop → saved
Add Item → saved
Edit Item → saved
Delete Item → saved
```

This reduces risk of losing the entire plan.

---

# 109. "Save" UX

If design includes Save button, it should reflect actual unsaved form state.

Do not show a fake save button if every mutation already saves immediately.

---

# 110. Public Share Copy Flow

```text id="v5oc1x"
PublicTripPage
 ↓
Copy Trip
 ↓
Authenticated?
 ├── No → /login
 └── Yes
      ↓
 POST copy
      ↓
 newTripId
      ↓
 /trips/newTripId/edit
```

---

# 111. 404 Handling

Unknown private trip:

```text id="luofq1"
Trip not found
[Back to My Trips]
```

Unknown public slug:

```text id="pqvzsw"
This shared itinerary is unavailable.
```

---

# 112. 403 Handling

Example:

```text id="u3myx7"
You don't have permission to access this trip.
```

Provide route back to owned trips.

---

# 113. Authentication Expiry

If token expires during builder:

```text id="bhkld7"
API → 401
 ↓
clear auth
 ↓
login
```

Do not keep showing broken protected pages.

---

# 114. Page-Level Loading

Trip detail pages:

```text id="2079d1"
Loading trip...
```

Budget:

```text id="z8o3b7"
Loading budget...
```

Public:

```text id="rwqucs"
Loading itinerary...
```

Use skeletons if convenient.

---

# 115. Error Retry

For temporary load failure, offer:

```text id="x1k8zq"
Retry
```

where useful.

---

# 116. Frontend Security Rules

Frontend must never contain:

```text id="oa77ln"
DATABASE_URL
JWT_SECRET
database credentials
```

Only:

```text id="m3v2fm"
VITE_API_BASE_URL
```

---

# 117. Avoid Hard-Coded API URL

Bad:

```text id="kjj7xq"
"http://localhost:4000/api"
```

inside feature files.

Use environment config through shared Axios client.

---

# 118. Avoid Hard-Coded User ID

Never:

```text id="5x0mdm"
const userId = "123";
```

Ownership is determined by backend/JWT.

---

# 119. Avoid Frontend Budget Authority

Bad:

```text id="pmb8sq"
Dashboard calculates total differently
Budget page calculates another total
```

Use backend budget endpoint for financial summaries.

---

# 120. Avoid Frontend Ownership Authority

Do not decide:

```text id="yziiat"
if trip.userId === localUser.id then security is okay
```

The backend must still enforce it.

Frontend can use such state only for conditional UI if API exposes the necessary information.

---

# 121. Core Frontend API Map

```text id="my7gag"
auth.api.ts
  signup
  login
  me

trip.api.ts
  list
  create
  detail
  update
  delete

stop.api.ts
  add
  update
  delete
  reorder

city.api.ts
  search
  detail

activity.api.ts
  searchByCity

itinerary.api.ts
  add
  update
  delete
  reorder

budget.api.ts
  getBudget

sharing.api.ts
  publish
  unpublish
  getPublicTrip
  copyTrip
```

---

# 122. Main Component Ownership

```text id="ggapdm"
DashboardPage
 └── dashboard composition

TripsListPage
 └── trip list

CreateTripPage
 └── trip form

TripBuilderPage
 └── editing orchestration

TripViewPage
 └── read-only private view

TripBudgetPage
 └── budget view

TripCalendarPage
 └── timeline/calendar view

PublicTripPage
 └── public read/copy
```

---

# 123. Most Important Frontend Screen

Development priority should heavily favor:

```text id="t519rg"
TripBuilderPage
```

because it proves:

- Multi-city planning
- Activities
- Date organization
- Backend relationships

A beautiful dashboard with a broken builder is not a successful implementation.

---

# 124. Builder MVP Priority

Must support:

```text id="l9fb62"
Load Trip
Add Stop
Delete Stop
Edit Stop Dates
Add Activity
Add Custom Item
Edit Item
Delete Item
```

Then:

```text id="40s12j"
Stop Reorder
Item Reorder
```

Then polish:

```text id="esjcca"
Drag and drop
animations
advanced filtering
```

---

# 125. Frontend Build Order

Recommended:

```text id="4989lf"
1. Router
2. Auth Context
3. API Client
4. Login/Signup
5. Trips List
6. Create Trip
7. Builder shell
8. City Search
9. Stop Cards
10. Activity Search
11. Item Forms
12. Itinerary View
13. Budget
14. Calendar
15. Sharing
16. Public Trip
17. Profile
18. Polish
```

---

# 126. Backend Dependency Rule

Frontend should not build screens that require endpoints that have not been contracted.

If backend implementation is pending, use mock data only temporarily and match exact API contract shape.

Do not invent a different temporary shape.

---

# 127. Mock Data Rule

If frontend uses temporary mock data:

```text id="93c7py"
Mock TripDetail
```

must match:

```text id="i7vdp4"
05_API_CONTRACT.md
```

Then switching to real API requires minimal changes.

---

# 128. Final Frontend State Principle

Three categories:

## Server State

```text id="pg315m"
Trips
Stops
Items
Cities
Activities
Budget
```

Comes from backend.

## Global Client State

```text id="zgy87s"
Authentication
```

## Local UI State

```text id="zzov4a"
Modal open
Selected day
Form input
Filters
```

Keeping these separate prevents state complexity.

---

# 129. Frontend Architecture Decision Table

| Topic | Decision |
|---|---|
| Framework | React |
| Build | Vite |
| Language | TypeScript |
| Router | React Router |
| HTTP | Axios |
| Global state | Auth Context only by default |
| Redux | No |
| Server data | API/backend authoritative |
| Forms | Local React state |
| City search | Modal/dialog |
| Activity search | Modal/dialog |
| Builder | Central editing screen |
| Budget calculation | Backend |
| Calendar data | Derived from trip |
| Public page | Read-only |
| Copy trip | Backend transaction |
| Styling | Tailwind recommended |
| Mobile | Responsive, desktop-first |
| Drag/drop | Optional polish |

---

# 130. Final Frontend Principle

> Keep the frontend intelligent about presentation, but dependent on the backend for truth.

The frontend should make GlobeTrotter feel fast and intuitive while the backend remains responsible for:

- Valid relationships
- Security
- Costs
- Ownership
- Transactions
- Data persistence

This frontend architecture is considered **locked for the GlobeTrotter MVP**.