# GlobeTrotter
## System Architecture

**Document:** `03_SYSTEM_ARCHITECTURE.md`  
**Status:** Locked for MVP  
**Architecture Style:** Modular Monolith  
**Deployment Mode:** Local Demo

---

# 1. Purpose

This document defines how the complete GlobeTrotter system is structured and how its parts communicate.

It answers:

- How frontend talks to backend
- How backend is divided into modules
- Where business logic lives
- How Prisma and PostgreSQL are used
- How authentication works
- How ownership is checked
- How itinerary, budget, calendar, and sharing derive from trip data
- How copy-trip works
- Which parts are stored vs calculated

The main architectural goal is:

> Store trip data once and derive all views from it.

---

# 2. High-Level Architecture

```text
┌─────────────────────────────────────┐
│              FRONTEND               │
│                                     │
│ React + Vite + TypeScript           │
│                                     │
│ Pages                               │
│ Components                          │
│ Auth State                          │
│ API Client                          │
└──────────────────┬──────────────────┘
                   │
                   │ REST / JSON
                   │
                   ▼
┌─────────────────────────────────────┐
│               BACKEND               │
│                                     │
│ Node.js + Express + TypeScript      │
│                                     │
│ Auth                                │
│ Trips                               │
│ Stops                               │
│ Cities                              │
│ Activities                          │
│ Itinerary                           │
│ Budget                              │
│ Sharing                             │
└──────────────────┬──────────────────┘
                   │
                   │ Prisma ORM
                   │
                   ▼
┌─────────────────────────────────────┐
│              DATABASE               │
│                                     │
│ PostgreSQL 17                       │
│ Docker Compose                      │
│                                     │
│ User                                │
│ Trip                                │
│ City                                │
│ TripStop                            │
│ Activity                            │
│ ItineraryItem                       │
└─────────────────────────────────────┘
```

---

# 3. Local Runtime Architecture

For the hackathon demo:

```text
Frontend
http://localhost:5173

        ↓ HTTP

Backend
http://localhost:4000

        ↓ Prisma

PostgreSQL
localhost:5432
```

No cloud dependency is required.

---

# 4. Architectural Style

GlobeTrotter uses a:

```text
MODULAR MONOLITH
```

This means:

- One backend application
- One PostgreSQL database
- One REST API
- Internally divided into independent feature modules

Example:

```text
Express Application
│
├── Auth Module
├── Trips Module
├── Stops Module
├── Cities Module
├── Activities Module
├── Itinerary Module
├── Budget Module
└── Sharing Module
```

---

# 5. Why Modular Monolith

A microservice architecture would create unnecessary complexity.

We do not need:

- Multiple servers
- Service discovery
- Message queues
- Distributed transactions
- Multiple databases
- Network calls between backend modules

For a small hackathon team, modular monolith gives:

- Fast development
- Clear ownership
- Easy debugging
- Simple deployment
- Low merge conflict risk
- Proper separation of responsibilities

---

# 6. Core Architectural Principle

The system must avoid duplicated trip state.

The primary data is:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

The following are **views/calculations of that data**:

```text
Itinerary View
Calendar
Budget
Dashboard Summary
Public Trip View
```

They are not separate independent data stores.

---

# 7. Single Source of Truth

```text
                     PostgreSQL

                         TRIP
                          │
                          │
                 ┌────────┴────────┐
                 ↓                 ↓
             TRIP STOPS       TRIP FIELDS
                 │
                 ↓
          ITINERARY ITEMS
                 │
       ┌─────────┼─────────┐
       ↓         ↓         ↓
 Itinerary    Calendar    Budget
```

If an itinerary item changes:

```text
Amber Fort
₹500
```

to:

```text
Amber Fort
₹700
```

the system should automatically reflect that in:

- Budget
- Itinerary
- Public view

without separately updating three tables.

---

# 8. Core Domain Hierarchy

```text
USER
 │
 │ owns
 ▼
TRIP
 │
 │ contains
 ▼
TRIP STOP
 │
 ├────────── references CITY
 │
 │ contains
 ▼
ITINERARY ITEM
 │
 └────────── optionally references ACTIVITY
```

---

# 9. Core Entities

## User

Represents an authenticated user.

Responsibilities:

- Own trips
- Authenticate
- Copy public trips

---

## Trip

Represents one journey.

Contains:

- Name
- Description
- Start/end dates
- Budget information
- Currency
- Visibility
- Share slug

---

## City

Represents reusable destination data.

Example:

```text
Jaipur
India
Rajasthan
```

---

## TripStop

Represents a city inside a particular trip.

Example:

```text
Jaipur
1 Oct → 3 Oct
Position 1
```

A City and TripStop are not the same thing.

---

## Activity

Represents reusable discovery data.

Example:

```text
Amber Fort

Jaipur
Sightseeing
₹500
180 minutes
```

---

## ItineraryItem

Represents a user's scheduled item.

Example:

```text
Amber Fort

2 October
09:30
₹650
```

or a custom item:

```text
Meet Friend

2 October
18:00
₹0
```

---

# 10. Backend Module Architecture

Recommended structure:

```text
src/
├── modules/
│   ├── auth/
│   ├── trips/
│   ├── stops/
│   ├── cities/
│   ├── activities/
│   ├── itinerary/
│   ├── budget/
│   └── sharing/
│
├── middleware/
├── utils/
├── db/
├── config/
├── app.ts
└── server.ts
```

---

# 11. Module Internal Structure

Example:

```text
modules/trips/
├── trip.routes.ts
├── trip.controller.ts
├── trip.service.ts
├── trip.validation.ts
└── trip.types.ts
```

Not every module must have every file.

Only create files that are actually useful.

---

# 12. Route Responsibility

Routes define:

- URL
- HTTP method
- Middleware
- Controller

Example concept:

```text
POST /trips
```

Flow:

```text
Router
 ↓
Auth Middleware
 ↓
Validation
 ↓
Controller
```

Routes should not contain business logic.

---

# 13. Controller Responsibility

Controllers deal with HTTP concerns.

They:

- Read `req.params`
- Read `req.body`
- Read authenticated user
- Call services
- Return responses

Conceptually:

```text
HTTP Request
     ↓
Controller
     ↓
Service
     ↓
HTTP Response
```

Controllers should remain thin.

---

# 14. Service Responsibility

Services contain business logic.

Examples:

```text
createTrip()
updateTrip()
addStop()
addItineraryItem()
calculateBudget()
copyTrip()
```

Services may:

- Check ownership
- Validate domain rules
- Query Prisma
- Start transactions
- Compose data

The majority of application logic should live here.

---

# 15. Validation Responsibility

Validation is divided into two layers.

## Request Validation

Handled with Zod.

Example:

```text
name must be string
startDate required
currency optional
```

---

## Business Validation

Handled inside services.

Example:

```text
stop arrival date must be >= trip start
```

Zod should not be responsible for database-dependent rules.

---

# 16. Standard Request Flow

Authenticated request:

```text
Frontend
   ↓
Express Router
   ↓
Request Validation
   ↓
JWT Middleware
   ↓
Controller
   ↓
Service
   ↓
Ownership Check
   ↓
Business Rules
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Service Result
   ↓
Controller
   ↓
JSON Response
```

The exact middleware order may vary by route, but responsibilities remain the same.

---

# 17. Authentication Flow

Signup:

```text
Frontend
   ↓
POST /auth/signup
   ↓
Validate input
   ↓
Check duplicate email
   ↓
bcrypt password
   ↓
Create User
   ↓
Generate JWT
   ↓
Return user + token
```

---

# 18. Login Flow

```text
POST /auth/login
       ↓
Find user by email
       ↓
bcrypt.compare()
       ↓
Generate JWT
       ↓
Return token
```

Invalid credentials must not expose whether the email or password specifically was incorrect.

---

# 19. Authenticated Request

Frontend sends:

```text
Authorization: Bearer <JWT>
```

Middleware:

```text
Read header
    ↓
Verify JWT
    ↓
Extract userId
    ↓
Attach authenticated identity
```

Use one consistent request field, for example:

```text
req.user.id
```

Do not mix:

```text
req.userId
req.auth.id
req.currentUser
```

across modules.

---

# 20. Authorization / Ownership

Authentication proves identity.

Ownership determines access.

Example:

```text
User A owns Trip A
User B owns Trip B
```

User A must not modify Trip B.

---

# 21. Shared Ownership Utility

Ownership checks should be centralized.

Concept:

```ts
assertTripOwnership(tripId, userId)
```

Responsibilities:

1. Find trip.
2. If missing → NotFound.
3. If different owner → Forbidden.
4. Return trip.

This ensures every module uses identical behavior.

---

# 22. Stop Ownership Flow

A TripStop does not directly contain a user ID.

Therefore:

```text
TripStop
   ↓
Trip
   ↓
User
```

For a stop operation:

```text
PATCH /stops/:id
```

backend:

```text
Find Stop
   ↓
Read stop.tripId
   ↓
assertTripOwnership(stop.tripId, req.user.id)
   ↓
Continue
```

---

# 23. Item Ownership Flow

For itinerary items:

```text
ItineraryItem
      ↓
TripStop
      ↓
Trip
      ↓
User
```

Backend must follow the chain before modifications.

---

# 24. Trip Creation Flow

```text
Frontend
   ↓
POST /trips
   ↓
JWT
   ↓
Validate body
   ↓
Validate date range
   ↓
Create Trip
   ↓
Assign userId from JWT
   ↓
Return Trip
```

Important:

The frontend must never decide the owner.

Do not accept:

```json
{
  "userId": "..."
}
```

as authoritative input.

Owner comes from:

```text
req.user.id
```

---

# 25. Add Stop Flow

```text
Trip Builder
    ↓
Choose City
    ↓
Enter Arrival/Departure
    ↓
POST /trips/:tripId/stops
    ↓
Authenticate
    ↓
assertTripOwnership()
    ↓
Find City
    ↓
Validate dates inside Trip
    ↓
Determine sequenceOrder
    ↓
Create TripStop
```

---

# 26. Stop Date Validation

Required:

```text
trip.startDate
      ≤
stop.arrivalDate
      ≤
stop.departureDate
      ≤
trip.endDate
```

If invalid:

```text
INVALID_STOP_DATE
```

No record should be created.

---

# 27. Stop Reordering

Suppose:

```text
1 Jaipur
2 Jodhpur
3 Udaipur
```

becomes:

```text
1 Jaipur
2 Udaipur
3 Jodhpur
```

Frontend sends updated ordering.

Backend must validate:

- All stops belong to same trip
- User owns trip
- No duplicate positions

For simple MVP, multiple updates may happen inside one Prisma transaction.

---

# 28. Activity Discovery Flow

```text
Frontend
   ↓
GET /cities/:id/activities
   ↓
Filters
   ↓
Activities Module
   ↓
Prisma
   ↓
Activity[]
```

Filters may include:

- Category
- Max cost
- Duration

This endpoint may be public or authenticated depending on final API choice.

For MVP, either is acceptable, but the contract must be consistent.

---

# 29. Add Itinerary Item Flow

```text
Trip Builder
     ↓
Choose Activity
     ↓
Choose Date
     ↓
Choose Time
     ↓
POST /stops/:id/items
     ↓
Authenticate
     ↓
Resolve Stop
     ↓
Check Trip Ownership
     ↓
Validate Item Date
     ↓
Validate Activity City
     ↓
Create Item
```

---

# 30. Item Date Validation

Required:

```text
stop.arrivalDate
      ≤
item.date
      ≤
stop.departureDate
```

Example:

```text
Stop:
10 Oct → 12 Oct

Item:
11 Oct ✅

Item:
14 Oct ❌
```

---

# 31. Activity-City Validation

If:

```text
TripStop city = Jaipur
```

then:

```text
Activity city = Jaipur
```

must be true.

Except for custom items, which have no master activity.

---

# 32. Custom Item Flow

Request may contain:

```text
customName = "Meet Friend"
activityId = null
```

Rule:

```text
activityId OR customName
```

must exist.

Invalid:

```text
activityId = null
customName = null
```

---

# 33. Itinerary Read Architecture

The database does not contain a separate `Itinerary` table.

The itinerary is created from:

```text
Trip
 +
TripStops
 +
ItineraryItems
```

Example Prisma read concept:

```text
Trip
 └── Stops ordered by sequenceOrder
      └── Items ordered by date + sequenceOrder
```

Frontend transforms this into the desired view.

---

# 34. Itinerary View Flow

```text
GET /trips/:id
      ↓
Trip
Stops
Cities
Items
Activities
      ↓
Frontend
      ↓
Group into:
City → Day → Items
```

The backend can return nested data to reduce frontend request count.

---

# 35. Calendar Architecture

Calendar is a derived representation.

```text
ItineraryItem[]
       ↓
Group by date
       ↓
Calendar View
```

No separate calendar table.

No duplicate calendar records.

---

# 36. Calendar Data Example

Source:

```text
02 Oct
09:00 Amber Fort
13:00 Lunch

03 Oct
10:00 Hawa Mahal
```

Frontend can transform it to:

```text
02 OCTOBER
• 09:00 Amber Fort
• 13:00 Lunch

03 OCTOBER
• 10:00 Hawa Mahal
```

---

# 37. Budget Architecture

Budget is primarily calculated.

Sources:

```text
Trip planned budget
Trip transport estimate
Trip stay estimate
Trip meal estimate

+

ItineraryItem costs
```

Flow:

```text
Trip Data
    ↓
Budget Service
    ↓
Aggregate Costs
    ↓
Budget Response
```

---

# 38. Activity Cost Resolution

An itinerary item may have:

```text
customCost
```

If the user has overridden the activity cost, use that.

Otherwise use:

```text
Activity.estimatedCost
```

Recommended logic:

```text
effectiveCost =
item.customCost ?? activity.estimatedCost ?? 0
```

The exact field semantics will be locked in the schema document.

---

# 39. Budget Calculation Example

```text
Transport ₹8,000
Stay      ₹12,000
Meals     ₹6,000
Activities ₹5,000

Total = ₹31,000
```

If:

```text
Planned Budget = ₹40,000
```

then:

```text
Remaining = ₹9,000
```

---

# 40. Budget Response Architecture

Backend may return:

```json
{
  "plannedBudget": 40000,
  "estimatedTotal": 31000,
  "remaining": 9000,
  "averagePerDay": 4428.57,
  "breakdown": {
    "transport": 8000,
    "stay": 12000,
    "meals": 6000,
    "activities": 5000
  }
}
```

Frontend is responsible only for presentation.

---

# 41. Why Budget Logic Is Backend-Owned

If budget logic is implemented separately in several frontend pages:

```text
Dashboard calculation
Budget page calculation
Public page calculation
```

they may produce inconsistent results.

Instead:

```text
Budget Service
     ↓
one calculation
     ↓
all clients
```

---

# 42. Sharing Architecture

A private trip:

```text
visibility = PRIVATE
shareSlug = null
```

Publishing:

```text
POST /trips/:id/share
```

Flow:

```text
Authenticate
   ↓
Check Ownership
   ↓
Generate Unique Slug
   ↓
visibility = PUBLIC
   ↓
shareSlug = generated slug
```

---

# 43. Public Trip Flow

Public route:

```text
GET /public/:slug
```

does not require JWT.

Flow:

```text
Slug
 ↓
Find Trip
 ↓
visibility == PUBLIC ?
 ↓
Load safe public data
 ↓
Return
```

---

# 44. Public Data Boundary

Public response may include:

- Trip name
- Description
- Dates
- Cities
- Activities
- Costs
- Basic owner display name if desired

Do not expose:

- Password hash
- User email unless intentionally part of product
- Private internal metadata
- JWT-related information

---

# 45. Copy Trip Architecture

This is one of the most complex backend flows.

```text
Public Trip
     ↓
Copy
     ↓
New Private Trip
```

The copy must be independent from the original.

---

# 46. Copy Trip Requirements

Copied trip gets:

- New Trip ID
- New owner userId
- New TripStop IDs
- New ItineraryItem IDs
- `PRIVATE` visibility
- `shareSlug = null`

It retains references to:

- City
- Activity

because those are global master records.

---

# 47. Copy Flow

```text
POST /public/:slug/copy
        ↓
Authenticate User
        ↓
Find Public Trip
        ↓
Load Stops + Items
        ↓
BEGIN TRANSACTION
        ↓
Create New Trip
        ↓
Create New Stops
        ↓
Map oldStopId → newStopId
        ↓
Create New Items
        ↓
COMMIT
        ↓
Return New Trip
```

---

# 48. Copy Transaction

Use:

```text
prisma.$transaction()
```

Reason:

If creating stop #3 fails, we must not leave behind:

```text
New Trip
Stop 1
Stop 2
```

with missing data.

Either:

```text
Everything succeeds
```

or:

```text
Nothing is created
```

---

# 49. Delete Architecture

Delete behavior must use relational cascading where appropriate.

Expected:

```text
Delete Trip
   ↓
Delete its TripStops
   ↓
Delete their ItineraryItems
```

Do not delete:

```text
City
Activity
```

because they are shared master records.

---

# 50. Delete Stop Architecture

```text
Delete TripStop
      ↓
Delete its ItineraryItems
```

Again:

```text
City remains
Activity remains
```

---

# 51. User Delete Architecture

If user deletion is implemented:

```text
Delete User
   ↓
Delete User Trips
   ↓
Delete TripStops
   ↓
Delete ItineraryItems
```

Global City and Activity data remains untouched.

---

# 52. Database Access Rule

All normal application database access must go through:

```text
Prisma
```

Avoid database calls directly in:

```text
Routes
React frontend
Middleware except infrastructure needs
```

Main flow:

```text
Service
 ↓
Prisma
 ↓
Postgres
```

---

# 53. Prisma Client Architecture

Use one Prisma client singleton.

Example location:

```text
src/db/prisma.ts
```

Every service imports the same instance.

Do not repeatedly call:

```text
new PrismaClient()
```

inside controllers or services.

---

# 54. Error Flow

```text
Database / Business Error
        ↓
Service
        ↓
Known Application Error
        ↓
Global Error Middleware
        ↓
Standard JSON
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip not found."
  }
}
```

---

# 55. Known vs Unknown Errors

Known:

```text
Invalid dates
Forbidden access
Duplicate email
Missing trip
```

should generate clean client errors.

Unknown errors:

```text
Unexpected DB failure
Programming bug
```

should return:

```text
500
INTERNAL_SERVER_ERROR
```

without exposing stack traces to frontend.

---

# 56. Frontend Architecture

High level:

```text
src/
├── pages/
├── components/
├── features/
├── lib/
├── hooks/
├── context/
└── routes/
```

Frontend specifics will be fully defined in:

```text
09_FRONTEND_ARCHITECTURE.md
```

---

# 57. Frontend API Layer

React components should not directly contain repeated Axios configuration.

Use:

```text
lib/api.ts
```

Concept:

```text
TripBuilder
    ↓
tripApi.addStop()
    ↓
Axios
    ↓
REST API
```

---

# 58. Authentication State

One shared auth layer stores:

```text
token
user
authenticated state
```

Conceptually:

```text
AuthProvider
   ↓
React App
```

Protected routes check authentication before rendering private pages.

Backend remains the actual security authority.

Frontend route guards are UX, not security.

---

# 59. Data Fetching Principle

The frontend should not assume it owns permanent trip state.

Example:

```text
User adds activity
     ↓
POST API
     ↓
Backend saves
     ↓
Frontend refreshes/updates local view
```

Database remains authoritative.

---

# 60. Dashboard Architecture

Dashboard aggregates existing data.

Example:

```text
GET /trips
GET /trips/:id/budget
```

or a later dashboard endpoint.

No separate `Dashboard` table exists.

---

# 61. Search Architecture

For MVP:

```text
City Search
   ↓
Postgres query
```

and:

```text
Activity Search
   ↓
Postgres query
```

No ElasticSearch or external search service is required.

---

# 62. Seed Data Architecture

Local seed process:

```text
prisma/seed.ts
      ↓
PostgreSQL
      ↓
Cities
Activities
```

Seed records are shared globally.

User-created trips reference them.

---

# 63. Images Architecture

For MVP:

```text
URL or local static asset path
```

Images are metadata only.

No image-processing subsystem is required.

---

# 64. Security Boundary

Never trust frontend values for:

- Current user ID
- Ownership
- Calculated budget totals
- Visibility permissions
- Existing entity relationships

Backend validates all important state.

---

# 65. Sensitive Data Rule

Never return:

```text
passwordHash
```

from user queries.

Prisma queries or response mappers should explicitly select safe user fields.

---

# 66. Transaction Use Cases

Transactions should be used where multiple writes represent one logical action.

Must strongly consider transactions for:

- Copy trip
- Stop reorder
- Complex delete/update involving multiple records

Simple single-record CRUD does not require manual transactions.

---

# 67. Concurrency Scope

Real-time multi-user collaborative editing is not part of MVP.

Therefore we do not require:

- WebSockets
- Operational transforms
- Conflict-free replicated data types

Normal REST request behavior is sufficient.

---

# 68. Caching Scope

No Redis or advanced cache is required.

Database size and request volume during the local demo are small.

If React needs temporary client caching, it can use normal component state or optional TanStack Query.

---

# 69. Architecture by Feature

```text
Authentication
    ↓
User identity

Trips
    ↓
Trip core

Stops
    ↓
Multi-city structure

Cities
    ↓
Destination discovery

Activities
    ↓
Experience discovery

Itinerary
    ↓
Scheduling

Budget
    ↓
Financial calculation

Sharing
    ↓
Public access + cloning
```

---

# 70. Module Dependency Direction

Recommended conceptual dependencies:

```text
Auth
  ↓
Trips
  ↓
Stops
  ↓
Itinerary
```

Discovery:

```text
Cities
  ↓
Activities
```

Integration:

```text
Stops ← City
Items ← Activity
```

Derived modules:

```text
Trip Data → Budget
Trip Data → Sharing
```

---

# 71. Prevent Circular Dependencies

Modules should not directly import each other's controllers.

Bad:

```text
trip.controller
     ↓
budget.controller
```

Better:

```text
trip.service
budget.service
```

share lower-level services/utilities where necessary.

---

# 72. Shared Infrastructure

Shared code belongs outside feature folders only when genuinely cross-cutting.

Examples:

```text
middleware/
  auth.middleware.ts
  error.middleware.ts

utils/
  ownership.ts
  dates.ts
  slug.ts

db/
  prisma.ts
```

Do not move feature-specific logic into generic `utils/`.

---

# 73. Date Utility

A shared date utility may handle:

- Parsing API date strings
- Range comparisons
- Day count calculation

This prevents different modules from implementing date logic inconsistently.

---

# 74. Slug Utility

Shared:

```text
generateShareSlug()
```

Used only by sharing service, but generic enough to live in:

```text
utils/slug.ts
```

It must create collision-resistant slugs.

---

# 75. Ownership Utility

Central source:

```text
utils/ownership.ts
```

or:

```text
services/ownership.service.ts
```

The exact folder matters less than one rule:

> Ownership behavior exists once.

---

# 76. Business Rule Ownership

Examples:

### Trip Service

Owns:

```text
Trip start/end validation
```

### Stop Service

Owns:

```text
Stop range validation
Stop ordering
```

### Itinerary Service

Owns:

```text
Item date
Activity city match
Custom item validation
```

### Budget Service

Owns:

```text
Cost calculation
```

### Sharing Service

Owns:

```text
Publishing
Slug
Copy trip
```

---

# 77. API Boundary

Frontend never communicates directly with PostgreSQL.

Forbidden:

```text
React
 ↓
PostgreSQL
```

Correct:

```text
React
 ↓
Express
 ↓
Prisma
 ↓
PostgreSQL
```

---

# 78. External Service Boundary

Core functionality must work with:

```text
NO external APIs
```

Optional integrations may be added later, but the architecture cannot depend on them.

---

# 79. Performance Expectations

Local demo scale is small.

Likely:

```text
Users < 100
Trips < 1000
Activities < few thousand
```

No special distributed performance architecture is needed.

Indexes should still exist on common relations/search fields.

---

# 80. Typical Trip Read

To minimize multiple frontend requests:

```text
GET /trips/:id
```

may return:

```text
Trip
 ├── Stops
 │    ├── City
 │    └── Items
 │         └── Activity
```

This is preferable to requiring:

```text
GET trip
GET stops
GET each city
GET each item
GET each activity
```

for normal detail rendering.

---

# 81. Avoid N+1 API Calls

Frontend should not do:

```text
Trip
 ↓
3 stop requests
 ↓
15 activity requests
```

The backend can use relational includes/selects to deliver structured trip data efficiently.

---

# 82. API Versioning

For hackathon MVP, API versioning is optional.

Simple:

```text
/trips
/auth/login
```

is acceptable.

If desired from the start:

```text
/api/v1/trips
```

is also fine.

Do not add versioning complexity halfway through.

Recommended locked base:

```text
/api
```

Example:

```text
/api/auth/login
/api/trips
```

---

# 83. App Bootstrap

Recommended separation:

```text
app.ts
```

Creates/configures Express:

- CORS
- JSON parsing
- Routes
- Error middleware

```text
server.ts
```

starts the HTTP server.

This keeps startup separate from app configuration.

---

# 84. Request Lifecycle Example

Example:

```text
POST /api/stops/123/items
```

Full lifecycle:

```text
React
 ↓
Axios
 ↓
Express
 ↓
JSON Parser
 ↓
JWT Middleware
 ↓
Zod Validation
 ↓
Item Controller
 ↓
Item Service
 ↓
Find Stop
 ↓
assertTripOwnership()
 ↓
Validate Date
 ↓
Validate Activity
 ↓
Prisma Create
 ↓
PostgreSQL
 ↓
Created Item
 ↓
201 JSON
 ↓
React updates screen
```

---

# 85. Core System Flow

The complete product works as:

```text
USER
 ↓
AUTHENTICATION
 ↓
TRIP
 ↓
STOPS
 ↓
ACTIVITIES
 ↓
ITINERARY ITEMS
 ↓
┌──────────────┬──────────────┬──────────────┐
↓              ↓              ↓              ↓
ITINERARY    CALENDAR       BUDGET        SHARING
```

This is the architectural backbone of GlobeTrotter.

---

# 86. MVP Failure Priorities

If time becomes limited:

Keep:

```text
Auth
Trip
Stops
Items
Itinerary
Budget
```

Then:

```text
Calendar
Sharing
```

Then optional:

```text
Copy
Charts
Recommendations
Admin
Advanced UI
```

The architecture must make optional parts removable without breaking core planning.

---

# 87. What This Architecture Intentionally Does Not Include

No:

- Microservices
- Redis
- Kafka
- GraphQL
- WebSockets
- Serverless functions
- Distributed queues
- Multiple databases
- Search engine cluster
- API gateway
- Kubernetes
- CDN architecture

None are necessary for the hackathon requirement.

---

# 88. Architecture Decision Summary

| Decision | Choice |
|---|---|
| System style | Modular monolith |
| Frontend/backend | Separate apps |
| API | REST |
| Database access | Prisma |
| Database | PostgreSQL |
| State authority | Backend/database |
| Calendar | Derived |
| Budget | Derived |
| Itinerary | Derived from trip hierarchy |
| Sharing | Slug-based public route |
| Copy Trip | Deep clone transaction |
| Authentication | JWT |
| Authorization | Central ownership checks |
| External APIs | Not required |
| Runtime | Fully local |

---

# 89. Architecture Lock

The following is considered final for MVP:

```text
React + Vite
      ↓
REST / JSON
      ↓
Express Modular Monolith
      ↓
Services
      ↓
Prisma
      ↓
PostgreSQL
```

Domain:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

References:

```text
TripStop → City

ItineraryItem → Activity
```

Derived systems:

```text
Trip Data
 ├── Itinerary
 ├── Calendar
 ├── Budget
 └── Public View
```

---

# 90. Final Architecture Principle

> The architecture should make the important operations simple, not make simple operations look technically impressive.

For GlobeTrotter, the difficult and valuable parts are:

- Correct trip relationships
- Date consistency
- Activity scheduling
- Budget synchronization
- Ownership
- Reliable sharing/copying

Everything else should remain as simple as possible.