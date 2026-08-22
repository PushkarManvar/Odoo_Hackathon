# GlobeTrotter — Team Work Split

## 1. Purpose

This document defines exactly how development work is divided between the four members of GlobeTrotter.

The goal is to:

- Reduce Git conflicts
- Avoid duplicate implementation
- Make ownership clear
- Allow parallel development
- Prevent two members from editing the same modules unnecessarily
- Make debugging responsibility obvious
- Keep the hackathon development process fast

The project follows a **feature-based ownership model**.

Each developer owns complete feature areas instead of splitting work by technical layer.

For example:

```text
GOOD

Person A
└── trips/
    ├── routes
    ├── controller
    ├── service
    └── validation
```

instead of:

```text
AVOID

Person A → Controllers
Person B → Services
```

Feature ownership keeps related code together and reduces coordination overhead.

---

# 2. Team Structure

Four members, split into **two backend developers** and **two frontend developers**.

```text
Person A — Pushkar          (backend)
│
└── Trip Core
    ├── Authentication
    ├── Trips
    ├── Stops
    ├── Ownership
    └── Date Validation


Person B — Nishant          (backend)
│
└── Itinerary Core
    ├── Cities
    ├── Activities
    ├── Itinerary
    ├── Budget
    └── Sharing


Person C — Preet            (frontend)
│
└── Screens (Stitch designs → React)
    ├── Auth screens
    ├── Trip screens
    └── Dashboard


Person D — Bhagya           (frontend)
│
└── Screens (Stitch designs → React)
    ├── Itinerary screens
    ├── Budget screens
    └── Public/share screens
```

Backend (A + B) owns: backend code + database + Prisma schema + migrations.
Frontend (C + D) owns: React screens built from the Stitch designs, wired to the
documented API contract.

All four work against the same:

- Database schema
- API contract
- Business rules
- Error standard
- Git workflow

---

# 2b. Frontend / Backend Boundary

Frontend and backend are **separate folders** in the repo, so they rarely
conflict:

```text
apps/api/src/   → backend (Person A + B)
apps/web/src/   → frontend (Person C + D)
```

Rules:

- Frontend members (C + D) never edit `apps/api/**` or `prisma/**`.
- Backend members (A + B) never edit `apps/web/**`.
- Shared coordination files (`package.json`, `apps/web/src/lib/api.ts`,
  `apps/web/src/lib/auth-storage.ts`) need a heads-up before edits.
- Frontend builds against the documented API contract — it does not wait for
  backend code to exist.

---

# 3. Person A — Trip Core

Person A owns the foundation of the user-owned trip system.

Main responsibilities:

```text
auth/
trips/
stops/
```

Person A also owns the shared ownership architecture.

---

# 4. Person A — Authentication

Person A owns:

```text
modules/auth/
```

Responsibilities:

- User signup
- User login
- Password hashing
- Password verification
- JWT generation
- JWT verification
- Authentication middleware
- Attaching authenticated user to requests

Example flow:

```text
POST /auth/signup
        ↓
Validate request
        ↓
Check existing user
        ↓
Hash password
        ↓
Create User
        ↓
Generate JWT
        ↓
Return authenticated user
```

Login:

```text
POST /auth/login
        ↓
Find user
        ↓
Verify password
        ↓
Generate JWT
        ↓
Return user + token
```

Person A must follow:

```text
AUTH_AND_AUTHORIZATION.md
API_CONTRACT.md
DATABASE_SCHEMA.md
ERROR_STANDARD.md
```

---

# 5. Person A — Trips

Person A owns:

```text
modules/trips/
```

Responsibilities:

- Create trip
- Get user's trips
- Get individual trip
- Update trip
- Delete trip
- Trip visibility updates where implemented through trip management
- Trip date validation

Typical endpoints include:

```text
POST   /trips
GET    /trips
GET    /trips/:tripId
PATCH  /trips/:tripId
DELETE /trips/:tripId
```

Person A must ensure that users cannot:

- Read private trips belonging to another user
- Modify another user's trip
- Delete another user's trip

---

# 6. Person A — Stops

Person A owns:

```text
modules/stops/
```

Responsibilities:

- Add destination/city stop
- Update stop
- Delete stop
- Reorder stops
- Validate stop dates
- Validate stop belongs to requested trip

Typical operations:

```text
Add Stop
Update Stop
Delete Stop
Reorder Stops
```

Stop ownership resolves through the trip.

```text
TripStop
   ↓
Trip
   ↓
User
```

Person A should not implement a separate independent ownership system for stops.

---

# 7. Person A — Ownership Architecture

Person A owns the shared ownership helper.

Central helper:

```text
assertTripOwnership()
```

The project must not duplicate ownership logic independently inside every module.

Correct pattern:

```text
Request
   ↓
Authentication Middleware
   ↓
assertTripOwnership(...)
   ↓
Feature Logic
```

Ownership chain:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

Any resource that belongs to a trip should ultimately be checked against the trip owner.

---

# 8. Shared Ownership Helper

Conceptually:

```ts
assertTripOwnership(userId, tripId)
```

Expected behavior:

```text
Load Trip
   ↓
Trip exists?
   ├── NO → Not Found
   │
   └── YES
        ↓
Compare trip.userId
        ↓
Matches authenticated user?
   ├── YES → Continue
   └── NO  → Reject
```

Other modules should call this shared helper instead of rewriting ownership checks.

Person B may use the helper.

Person B should not modify its behavior without coordination with Person A.

---

# 9. Person A — Date Validation

Person A owns the core trip and stop date rules.

Examples:

```text
Trip startDate <= Trip endDate
```

and:

```text
Trip Start
    ↓
Stop Start
    ↓
Stop End
    ↓
Trip End
```

Therefore:

```text
stop.startDate >= trip.startDate

stop.endDate <= trip.endDate

stop.startDate <= stop.endDate
```

Person A implements these rules according to:

```text
BUSINESS_RULES.md
```

---

# 10. Person B — Itinerary Core

Person B owns the experience that happens inside destinations.

Main modules:

```text
cities/
activities/
itinerary/
budget/
sharing/
```

---

# 10a. Person C — Frontend Screens (Preet)

Person C owns the user-facing screens built from the Stitch designs.

Scope:

```text
apps/web/src/pages/auth/
apps/web/src/pages/dashboard/
apps/web/src/pages/trips/
apps/web/src/components/
apps/web/src/context/AuthContext.tsx
apps/web/src/lib/api.ts
```

Screen responsibilities:

- Convert Stitch designs to React + Vite + TypeScript pages
- Route setup (`router.tsx`)
- Auth state / protected routes
- Login / Signup / Dashboard screens
- Trip list + Trip builder screens
- API client wiring for the screens owned by Person C

Rules:

- Do not edit `apps/api/**` or `prisma/**` — backend is Person A + B.
- Follow the Frontend Architecture + API Contract docs exactly.
- Use mock data shaped like the API contract until the backend is ready.

---

# 10b. Person D — Frontend Screens (Bhagya)

Person D owns the in-trip experience screens built from the Stitch designs.

Scope:

```text
apps/web/src/pages/itinerary/
apps/web/src/pages/budget/
apps/web/src/pages/calendar/
apps/web/src/pages/public/
apps/web/src/features/
```

Screen responsibilities:

- Convert Stitch designs to React + Vite + TypeScript pages
- Itinerary screens
- Budget screens
- Calendar screens
- Public / shared-trip screens
- Feature components for the screens owned by Person D

Rules:

- Do not edit `apps/api/**` or `prisma/**` — backend is Person A + B.
- Follow the Frontend Architecture + API Contract docs exactly.
- Use mock data shaped like the API contract until the backend is ready.

---

# 10c. Frontend Screen Ownership

Person C and Person D never edit the same files.

```text
Person C:
  pages/auth/*
  pages/dashboard/*
  pages/trips/*
  components/ (shared UI kit — coordinate before edits)

Person D:
  pages/itinerary/*
  pages/budget/*
  pages/calendar/*
  pages/public/*
  features/*
```

Shared files (router, api client, auth context) — one person edits at a time,
coordinate first, then the other pulls.

---

# 11. Person B — Cities

Person B owns:

```text
modules/cities/
```

Responsibilities:

- City discovery
- City search
- Returning supported city information
- Connecting TripStop selection with City records

Example:

```text
User searches "Jaipur"
        ↓
GET /cities?search=Jaipur
        ↓
City results
        ↓
User selects Jaipur
```

City data is master/reference data.

Person B must not duplicate city data inside trip records when a City relation already exists in the database schema.

---

# 12. Person B — Activities

Person B owns:

```text
modules/activities/
```

Responsibilities:

- Activity discovery
- Activity search
- Filter by city
- Filter by category where supported
- Return activity details

Example:

```text
Jaipur
  ↓
Search Activities
  ↓
Amber Fort
City Palace
Hawa Mahal
```

Activities are master/reference data.

Adding an activity to a trip should create an itinerary item rather than modifying the master Activity record.

---

# 13. Person B — Itinerary

Person B owns:

```text
modules/itinerary/
```

Responsibilities:

- Add itinerary item
- Edit itinerary item
- Delete itinerary item
- Retrieve itinerary
- Validate activity date
- Validate activity/stop relationship
- Support custom itinerary activities where defined

Typical operations:

```text
POST   itinerary item
PATCH  itinerary item
DELETE itinerary item
GET    itinerary
```

Ownership should reuse Person A's shared ownership helper.

---

# 14. Itinerary Validation

Person B owns itinerary-specific validation.

Example:

```text
Stop Start
    ↓
Activity Date
    ↓
Stop End
```

Therefore:

```text
item.date >= stop.startDate

item.date <= stop.endDate
```

If an activity belongs to a city, that activity must match the city of the selected stop where required by the business rules.

Person B follows:

```text
BUSINESS_RULES.md
```

rather than inventing new validation rules.

---

# 15. Person B — Budget

Person B owns:

```text
modules/budget/
```

Responsibilities:

- Calculate trip cost summary
- Calculate activity costs
- Include stop accommodation costs
- Include stop transport costs
- Return category breakdown
- Return total trip estimate

Conceptual calculation:

```text
Trip Total
=
Activities
+
Accommodation
+
Transport
```

Budget should normally be derived from existing trip data.

Avoid storing duplicated totals unless the database architecture explicitly requires it.

---

# 16. Person B — Sharing

Person B owns:

```text
modules/sharing/
```

Responsibilities:

- Publish trip
- Make trip accessible publicly
- Retrieve public itinerary
- Copy a public trip
- Ensure copied trip belongs to the new user

Main flow:

```text
Private Trip
    ↓
Publish
    ↓
Public Trip
```

Public read:

```text
Shared URL
    ↓
Public Trip Endpoint
    ↓
Trip + Stops + Itinerary
```

Copy:

```text
Public Trip
    ↓
Copy Trip
    ↓
Create New Trip
    ↓
Copy Stops
    ↓
Copy Itinerary Items
    ↓
Assign Current User
```

---

# 17. Copy Trip Transaction

The copy-trip feature touches multiple tables.

Therefore it should execute atomically.

Conceptually:

```text
BEGIN TRANSACTION

Create Trip
    ↓
Create TripStops
    ↓
Create ItineraryItems

COMMIT
```

If any part fails:

```text
ROLLBACK
```

The result must never be a partially copied trip.

---

# 18. Ownership Dependencies Between Developers

Person B frequently works with resources owned through Person A's trip system.

Example:

```text
Itinerary Item
      ↓
TripStop
      ↓
Trip
      ↓
User
```

Therefore Person B must use the shared ownership architecture.

Person B should not create something like:

```text
assertItineraryOwnership()
```

with completely separate ownership logic unless the architecture explicitly requires it.

Prefer:

```text
Resolve Trip
    ↓
assertTripOwnership()
```

---

# 19. Shared Backend Files

Some files affect both developers.

Examples:

```text
apps/api/src/app.ts
apps/api/src/server.ts

apps/api/src/config/
apps/api/src/middleware/

prisma/schema.prisma

shared error utilities
shared validation utilities

package.json
.env.example
```

These files require coordination.

---

# 20. Prisma Schema Rule

The Prisma schema is one of the highest-conflict files in the repository.

File:

```text
prisma/schema.prisma
```

Neither developer should make large uncoordinated schema changes.

Before modifying the schema:

```text
1. Check DATABASE_SCHEMA.md
2. Tell teammate what is changing
3. Update schema
4. Generate migration
5. Commit schema + migration together
6. Inform teammate to pull
```

The documentation schema remains the source of truth.

---

# 21. Migration Ownership

A migration should belong to the feature that requires it.

Example:

```text
Person A
adds Trip visibility
→ Person A creates migration
```

Example:

```text
Person B
adds itinerary field
→ Person B creates migration
```

However, only one developer should create Prisma migrations at a time.

Avoid:

```text
Person A creates migration
        +
Person B creates migration

from different schema states
```

This is a common source of migration conflicts.

---

# 22. Shared Frontend Work

Frontend screens (owned by Person C + D) consume both backend developers' APIs.

Example:

```text
Trip Builder screen
```

may use:

```text
Trip API        → Person A
Stop API        → Person A
City API        → Person B
Activity API    → Person B
Itinerary API   → Person B
Budget API      → Person B
```

Frontend screens are built **first from the Stitch designs**, then wired to the
backend via the documented API contract.

Rules for C + D:

- Convert Stitch screens to React pages/components per the Frontend Architecture doc.
- Never invent endpoints or response shapes — follow the API contract exactly.
- If an API is not implemented yet, use mock data shaped like the contract and
  swap later — do not wait for the backend.
- Ask Person A + B which endpoints exist before wiring if unsure.

Do not depend on undocumented response shapes.

---

# 23. API Contract Rule

Neither developer should silently change:

```text
Endpoint URL
Request body
Response body
Error code
HTTP method
```

without updating or coordinating through:

```text
API_CONTRACT.md
```

Example:

If documented API says:

```text
POST /trips/:tripId/stops
```

do not independently implement:

```text
POST /stops/create
```

The API contract exists specifically to prevent this mismatch.

---

# 24. Shared Error Standard

Both developers must use the same API response convention.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message."
  }
}
```

Do not create module-specific response formats.

---

# 25. Module Responsibility Table

Person A = Pushkar · Person B = Nishant · Person C = Preet · Person D = Bhagya

| Feature | Owner |
|---|---|
| Signup | Person A |
| Login | Person A |
| JWT | Person A |
| Auth Middleware | Person A |
| Trip CRUD | Person A |
| Stop CRUD | Person A |
| Stop Reordering | Person A |
| Trip Ownership | Person A |
| Trip Date Validation | Person A |
| Stop Date Validation | Person A |
| City Search | Person B |
| Activity Search | Person B |
| Activity Discovery | Person B |
| Itinerary CRUD | Person B |
| Itinerary Validation | Person B |
| Budget Calculation | Person B |
| Publish Trip | Person B |
| Public Trip | Person B |
| Copy Trip | Person B |
| Auth screens (Login/Signup) | Person C |
| Dashboard screen | Person C |
| Trip list / Trip builder screens | Person C |
| Itinerary screens | Person D |
| Budget screens | Person D |
| Public / share screens | Person D |

---

# 26. Documentation Ownership

Documentation is shared.

However, each developer is responsible for keeping documentation accurate when they change their feature.

Person A should verify updates affecting:

```text
AUTH_AND_AUTHORIZATION.md
API_CONTRACT.md
BUSINESS_RULES.md
DATABASE_SCHEMA.md
```

Person B should verify updates affecting:

```text
API_CONTRACT.md
BUSINESS_RULES.md
DATABASE_SCHEMA.md
USER_FLOWS.md
```

Major architectural changes require agreement from both developers.

---

# 27. Files Developers Should Mostly Own

## Person A

```text
apps/api/src/modules/auth/**
apps/api/src/modules/trips/**
apps/api/src/modules/stops/**
```

Possible shared ownership:

```text
middleware/auth*
utils/ownership*
```

---

## Person B

```text
apps/api/src/modules/cities/**
apps/api/src/modules/activities/**
apps/api/src/modules/itinerary/**
apps/api/src/modules/budget/**
apps/api/src/modules/sharing/**
```

---

# 28. Do Not Split by Layer

Do not use this approach:

```text
Person A:
controllers/

Person B:
services/
```

because implementing a single feature would require both developers to constantly edit dependent code.

Instead:

```text
modules/
├── trips/             ← Person A
│
├── stops/             ← Person A
│
├── activities/        ← Person B
│
└── itinerary/         ← Person B
```

Each developer should be able to complete most of their feature without touching the other developer's files.

---

# 29. Parallel Development Strategy

The team can work in parallel.

Example:

```text
Person A                     Person B

Database foundation          Seed/master data preparation
      ↓                              ↓
Authentication               Cities
      ↓                              ↓
Trips                        Activities
      ↓                              ↓
Stops                        Itinerary
      ↓                              ↓
Ownership integration        Budget
                                     ↓
                                Sharing
```

Integration happens gradually as dependencies become available.

---

# 30. Important Dependencies

Some features cannot be completed before others exist.

Dependency chain:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

Therefore:

```text
Auth
 ↓
Trips
 ↓
Stops
 ↓
Itinerary
```

City and Activity discovery can be built mostly independently.

Budget depends on:

```text
Trips
Stops
Itinerary Items
```

Sharing depends on:

```text
Trips
Stops
Itinerary
Ownership
```

---

# 31. Recommended Development Order — Person A

```text
1. Auth foundations
2. Signup
3. Login
4. Auth middleware
5. Trip CRUD
6. Ownership helper
7. Stop creation
8. Stop editing
9. Stop deletion
10. Stop reordering
11. Date validation
12. Integration fixes
```

---

# 32. Recommended Development Order — Person B

```text
1. City discovery
2. Activity discovery
3. Activity filtering
4. Itinerary creation
5. Itinerary editing
6. Itinerary deletion
7. Itinerary validation
8. Budget calculation
9. Public sharing
10. Copy trip
11. Integration fixes
```

---

# 33. Merge Coordination Rule

Before merging a feature branch:

```text
1. Pull latest develop
2. Resolve conflicts locally
3. Run application
4. Run relevant tests
5. Verify API contract
6. Verify Prisma state
7. Commit fixes
8. Merge
```

Do not merge broken intermediate code into the shared integration branch.

---

# 34. Shared File Rule

Before editing a shared file:

```text
Check if teammate is modifying it.
```

High-risk shared files:

```text
prisma/schema.prisma
package.json
docker-compose.yml
app.ts
server.ts
.env.example
shared middleware
shared utilities
```

If both developers need changes:

```text
Coordinate first
    ↓
One developer edits
    ↓
Commit
    ↓
Other developer pulls
```

This is safer than manually combining two competing versions.

---

# 35. Git Conflict Prevention

Prefer changes inside your own feature module.

GOOD:

```text
Person A changes:

modules/trips/trip.service.ts
```

while:

```text
Person B changes:

modules/itinerary/itinerary.service.ts
```

Low conflict risk.

Avoid both developers repeatedly modifying:

```text
app.ts
schema.prisma
package.json
```

during the same period.

---

# 36. Integration Contract

A developer should be able to work against documented behavior even if the other feature is not finished yet.

Example:

Person B knows that:

```text
GET /trips/:tripId
```

returns the documented Trip structure.

Person B should not need to read Person A's internal service implementation.

Likewise, Person A should not depend on internal implementation details of Person B's activity service.

Modules communicate through agreed contracts.

---

# 37. Debugging Responsibility

When a bug occurs, begin with feature ownership.

Examples:

```text
Login failing
→ Person A
```

```text
Trip deletion failing
→ Person A
```

```text
Activity search failing
→ Person B
```

```text
Budget total incorrect
→ Person B
```

```text
Shared trip cannot be copied
→ Person B
```

For cross-feature bugs:

```text
Identify failing boundary
        ↓
Check API contract
        ↓
Both developers coordinate
```

---

# 38. Integration Bugs

Example:

```text
Itinerary API receives stopId

but Stop API returns destinationId
```

This is not purely one developer's bug.

Check:

```text
DATABASE_SCHEMA.md
API_CONTRACT.md
BUSINESS_RULES.md
```

The documented contract determines the correct implementation.

---

# 39. Feature Completion Definition

A feature is not considered complete simply because the endpoint works.

A feature is complete when:

```text
Code implemented
+
Validation implemented
+
Ownership implemented
+
Errors standardized
+
API contract followed
+
Database rules followed
+
Basic testing completed
```

---

# 40. Handoff Between Developers

When one person's feature becomes a dependency for another, provide:

```text
Endpoint
Method
Authentication requirement
Request body
Response example
Known limitations
```

Example:

```text
Trip endpoint ready:

GET /trips/:tripId

Auth:
Required

Success:
200

Returns:
Trip object according to API_CONTRACT.md
```

The receiving developer should not have to inspect unrelated source code to understand how to integrate.

---

# 41. Scope Protection

During the hackathon, neither developer should independently add major new features.

Examples:

```text
AI planner
Live hotel API
Flight booking
Payment gateway
Real-time collaboration
Maps integration
```

unless both developers agree and the MVP is already stable.

Always protect the core flow first:

```text
Login
 ↓
Create Trip
 ↓
Add Stops
 ↓
Add Activities
 ↓
Itinerary
 ↓
Budget
 ↓
Share
```

---

# 42. If One Developer Finishes Early

Do not immediately add new scope.

Instead help with:

```text
Testing
Integration
Frontend connection
Bug fixes
Demo data
Error handling
UI polish
Documentation verification
Demo preparation
```

MVP stability is more valuable than adding an unfinished extra feature.

---

# 43. Emergency Hackathon Rule

If time becomes limited, prioritize work in this order:

```text
1. Authentication works

2. Trip creation works

3. Stops work

4. Activities can be added

5. Itinerary displays correctly

6. Budget calculates correctly

7. Public sharing works
```

After that:

```text
Polish
Copy Trip
Advanced search
Optional UX improvements
```

---

# 44. Core Team Boundary

Final ownership:

```text
┌─────────────────────────────┐
│          PERSON A           │
│          TRIP CORE          │
│                             │
│ Auth                        │
│ Trips                       │
│ Stops                       │
│ Ownership                   │
│ Trip/Stop Date Validation   │
└──────────────┬──────────────┘
               │
               │ Shared Contracts
               │
┌──────────────▼──────────────┐
│          PERSON B           │
│       ITINERARY CORE        │
│                             │
│ Cities                      │
│ Activities                  │
│ Itinerary                   │
│ Budget                      │
│ Sharing                     │
└─────────────────────────────┘
```

Both developers share responsibility for:

```text
Database consistency
API consistency
Integration
Testing
Demo stability
```

---

# 45. Final Rule

When deciding who should implement something:

```text
Does it primarily manage the Trip itself?
        ↓
Person A
```

```text
Does it primarily manage what happens inside the Trip?
        ↓
Person B
```

When a task crosses both boundaries:

```text
Check documentation
        ↓
Identify primary owner
        ↓
Coordinate shared changes
        ↓
One person edits shared files
```

The purpose of this split is not to create rigid barriers.

The purpose is to let both developers move quickly without accidentally building two different versions of GlobeTrotter.