# GlobeTrotter — Implementation Roadmap

## 1. Purpose

This document defines the recommended implementation order for GlobeTrotter.

The purpose of the roadmap is to make sure the team builds the application in the correct dependency order instead of starting unrelated features randomly.

The roadmap is optimized for:

- A two-person hackathon team
- Parallel development
- Low Git conflict
- Fast MVP completion
- Early end-to-end testing
- Demo reliability
- Scope control

The primary objective is:

```text
Build the complete core user journey first.
Polish and optional features come later.
```

---

# 2. Core MVP Journey

The implementation roadmap is centered around this flow:

```text
Signup / Login
      ↓
Dashboard
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
View Calendar
      ↓
Publish Trip
      ↓
Open Public Trip
```

Everything required for this journey is higher priority than optional enhancements.

---

# 3. Development Phases

The project is divided into 14 major phases.

```text
1. Foundation
2. Database
3. Authentication
4. Trips
5. Stops
6. City Discovery
7. Activities
8. Itinerary
9. Budget
10. Calendar
11. Sharing
12. UI Polish
13. Testing
14. Demo Preparation
```

These phases do not always need to happen strictly one after another.

Several areas can be developed in parallel.

---

# 4. Priority Levels

Use these priorities throughout implementation.

## P0 — Critical

Without this, the MVP cannot work.

Examples:

```text
Authentication
Trip CRUD
Stops
Activities
Itinerary
Database
```

## P1 — Important

Strongly needed for the intended GlobeTrotter experience.

Examples:

```text
Budget
Calendar
Sharing
Copy Trip
```

## P2 — Polish

Improves usability and presentation.

Examples:

```text
Animations
Advanced filters
Loading skeletons
Visual refinements
```

## P3 — Optional

Only attempt after the MVP is stable.

Examples:

```text
Advanced discovery
Extra analytics
Complex maps
External integrations
```

---

# 5. Phase 1 — Foundation

## Goal

Create the project skeleton and make sure both developers can run it locally.

Priority:

```text
P0
```

Tasks:

- Initialize Git repository
- Create frontend
- Create backend
- Configure TypeScript
- Configure Vite
- Configure Express
- Configure project folder structure
- Create environment examples
- Configure Docker Compose
- Add PostgreSQL container
- Configure CORS
- Add basic API health route
- Establish shared error handling structure

Expected result:

```text
Frontend runs on :5173
Backend runs on :4000
PostgreSQL runs on :5432
```

Checkpoint:

```text
Browser → Frontend → Backend Health Route
```

must work.

---

# 6. Foundation Ownership

Both developers participate in the initial setup.

However, shared files should be edited carefully.

High-risk files:

```text
package.json
docker-compose.yml
app.ts
server.ts
tsconfig files
.env.example
```

Prefer one developer creating the initial scaffold, committing it, and the second developer pulling before parallel work begins.

---

# 7. Phase 2 — Database

## Goal

Create the complete initial Prisma schema.

Priority:

```text
P0
```

Core entities:

```text
User
Trip
City
TripStop
Activity
ItineraryItem
```

Tasks:

- Configure Prisma
- Create schema
- Add relations
- Add enums
- Add indexes
- Add cascade rules
- Apply date types
- Apply money storage rules
- Generate Prisma Client
- Create first migration

Expected result:

```text
PostgreSQL
    ↑
Prisma schema successfully migrated
```

---

# 8. Database Checkpoint

Before implementing feature APIs, confirm:

- [ ] Prisma schema matches `DATABASE_SCHEMA.md`
- [ ] Migration succeeds from fresh database
- [ ] Prisma Client generates
- [ ] Prisma Studio opens
- [ ] Core relations are correct
- [ ] Cascade behavior is understood

Do not continue building features against an unstable schema.

---

# 9. Phase 3 — Authentication

## Owner

```text
Person A
```

Priority:

```text
P0
```

Tasks:

- Signup validation
- Existing-user check
- Password hashing
- User creation
- Login
- Password comparison
- JWT creation
- Authentication middleware
- Protected-route testing

Endpoints include:

```text
POST /auth/signup
POST /auth/login
```

Expected flow:

```text
Signup
  ↓
JWT
  ↓
Protected Endpoint
```

---

# 10. Authentication Checkpoint

The following must work:

```text
Create account
     ↓
Login
     ↓
Receive token
     ↓
Call protected endpoint
```

Also verify:

```text
Missing token
→ 401
```

and:

```text
Invalid token
→ 401
```

Once this works, authenticated feature development becomes much easier.

---

# 11. Phase 4 — Trips

## Owner

```text
Person A
```

Priority:

```text
P0
```

Tasks:

- Create trip
- List user's trips
- Get trip details
- Update trip
- Delete trip
- Validate dates
- Enforce ownership
- Support visibility

Endpoints conceptually include:

```text
POST   /trips
GET    /trips
GET    /trips/:tripId
PATCH  /trips/:tripId
DELETE /trips/:tripId
```

---

# 12. Trip Checkpoint

Minimum working flow:

```text
Login
 ↓
Create Trip
 ↓
Read Trip
 ↓
Update Trip
 ↓
Delete Trip
```

Also test:

```text
User A creates trip
        ↓
User B attempts edit
        ↓
Rejected
```

---

# 13. Phase 5 — Stops

## Owner

```text
Person A
```

Priority:

```text
P0
```

Tasks:

- Add stop
- Update stop
- Delete stop
- Reorder stops
- Validate stop dates
- Validate stop belongs to trip
- Use shared trip ownership helper

Flow:

```text
Trip
 ↓
Add Jaipur
 ↓
Add Udaipur
 ↓
Reorder
```

---

# 14. Stop Checkpoint

The following must work:

```text
Trip
 ├── Stop 1
 ├── Stop 2
 └── Stop 3
```

Verify:

- Stops remain within trip dates
- Stop order persists
- Another user cannot modify them
- Deletion behaves according to database rules

---

# 15. Phase 6 — City Discovery

## Owner

```text
Person B
```

Priority:

```text
P0
```

This can begin while Person A is implementing Trips and Stops.

Tasks:

- Seed city data
- Implement city search
- Partial-name matching
- Case-insensitive search
- Return city metadata

Example:

```text
Search: "Jai"
        ↓
Jaipur
```

---

# 16. City Discovery Checkpoint

Verify:

```text
GET city search
```

can successfully return seeded cities.

Also test:

```text
Valid search
No results
Partial search
Different casing
```

---

# 17. Phase 7 — Activities

## Owner

```text
Person B
```

Priority:

```text
P0
```

Tasks:

- Seed activities
- Search activities
- Filter by city
- Filter by category if supported
- Return activity details
- Return estimated costs

Example:

```text
Jaipur
   ↓
Amber Fort
City Palace
Hawa Mahal
```

---

# 18. Activity Checkpoint

Verify:

```text
Select City
   ↓
Retrieve Activities
```

Activity records must correctly reference their city.

Do not allow discovery logic to create duplicate master Activity records.

---

# 19. Parallel Development Point

By this stage, development may look like:

```text
PERSON A                  PERSON B

Authentication            Seed Cities
     ↓                         ↓
Trips                     City Search
     ↓                         ↓
Stops                     Activities
```

This is the ideal parallelization point.

Both developers mostly remain inside separate feature modules.

---

# 20. Phase 8 — Itinerary

## Owner

```text
Person B
```

Priority:

```text
P0
```

Dependencies:

```text
Trips
Stops
Activities
Authentication
```

Tasks:

- Add itinerary item
- Edit itinerary item
- Delete itinerary item
- Retrieve itinerary
- Validate activity date
- Validate activity city
- Support custom activity if defined
- Reuse shared ownership helper

---

# 21. Itinerary Flow

Expected flow:

```text
Trip
 ↓
Stop
 ↓
Select Activity
 ↓
Choose Date
 ↓
Choose Time
 ↓
Add to Itinerary
```

The final structure becomes:

```text
Trip
 └── Stop
      ├── Activity 1
      ├── Activity 2
      └── Activity 3
```

---

# 22. Itinerary Checkpoint

Test:

- Add activity
- Modify date/time
- Modify cost
- Delete activity
- Retrieve itinerary
- Invalid date rejected
- Wrong-city activity rejected
- Unauthorized user rejected

At this point, the main trip-planning experience exists.

---

# 23. First Major MVP Checkpoint

After Phase 8, this journey should work:

```text
Signup
 ↓
Login
 ↓
Create Trip
 ↓
Add Stop
 ↓
Search Activity
 ↓
Add Activity
 ↓
View Itinerary
```

This is the first major functional milestone.

If this flow is broken, do not prioritize visual polish.

---

# 24. Phase 9 — Budget

## Owner

```text
Person B
```

Priority:

```text
P1
```

Dependencies:

```text
Stops
Itinerary
```

Tasks:

- Sum activity cost
- Sum accommodation cost
- Sum transport cost
- Return category breakdown
- Return total cost

Formula:

```text
Trip Total
=
Activities
+
Accommodation
+
Transport
```

---

# 25. Budget Checkpoint

Use predictable seeded numbers.

Verify manually:

```text
Activity Total
+
Accommodation Total
+
Transport Total
=
Returned Total
```

Test budget recalculation after:

```text
Add item
Edit item
Delete item
Change stop cost
```

---

# 26. Phase 10 — Calendar

## Priority

```text
P1
```

The calendar is primarily a presentation of itinerary data.

It should not require a completely separate scheduling database.

Input:

```text
Trip dates
+
Stop dates
+
Itinerary item dates
+
Times
```

Output:

```text
Day-by-day itinerary
```

---

# 27. Calendar Implementation

Example:

```text
10 October

09:00 — Amber Fort
13:00 — Lunch
16:00 — City Palace


11 October

10:00 — Hawa Mahal
17:00 — Nahargarh Fort
```

Tasks:

- Group itinerary by date
- Sort items by time
- Display stop/city context
- Handle days with no activities
- Handle multi-stop trips

---

# 28. Calendar Checkpoint

Verify:

```text
Items ordered correctly by date
Items ordered correctly by time
Multiple trip days display
Multiple cities display
Empty day does not break UI
```

---

# 29. Second Major MVP Checkpoint

At this stage:

```text
Login
 ↓
Create Trip
 ↓
Add Cities
 ↓
Add Activities
 ↓
View Itinerary
 ↓
View Budget
 ↓
View Calendar
```

must work end-to-end.

This is already a demoable GlobeTrotter product.

---

# 30. Phase 11 — Sharing

## Owner

```text
Person B
```

Priority:

```text
P1
```

Dependencies:

```text
Trips
Stops
Itinerary
Ownership
```

Tasks:

- Publish trip
- Change visibility
- Public itinerary endpoint
- Public trip frontend page
- Share URL
- Copy Trip

---

# 31. Public Sharing Flow

```text
Private Trip
     ↓
Publish
     ↓
PUBLIC
     ↓
Shared URL
     ↓
Public View
```

Public visitors must not be able to modify the original trip.

---

# 32. Copy Trip Flow

```text
User B opens
User A's public trip
        ↓
Copy Trip
        ↓
New Trip created for User B
        ↓
Stops copied
        ↓
Itinerary copied
```

New trip should generally default to:

```text
PRIVATE
```

unless the business rules specify otherwise.

---

# 33. Sharing Checkpoint

Test:

- Private trip cannot be publicly opened
- Public trip can be opened without owner authentication where intended
- Public trip cannot be edited by visitor
- Copy Trip creates independent records
- Original trip remains unchanged
- Failed copy does not create partial data

---

# 34. Third Major MVP Checkpoint

Full product flow:

```text
Signup
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
Calendar
 ↓
Publish
 ↓
Public View
 ↓
Copy Trip
```

Once this works, the functional MVP is complete.

---

# 35. Phase 12 — UI Polish

## Priority

```text
P2
```

Only start major polish once core flows work.

Tasks may include:

- Better spacing
- Typography cleanup
- Responsive layouts
- Better empty states
- Loading states
- Error messages
- Confirmation dialogs
- Better cards
- Improved forms
- Search interaction polish
- Calendar presentation
- Budget visualization
- Public trip presentation

---

# 36. UI Polish Rule

Do not spend large amounts of time polishing a page whose backend flow is incomplete.

Bad sequence:

```text
Perfect Dashboard UI
        ↓
Trip creation still broken
```

Preferred:

```text
Functional complete flow
        ↓
Polish visible demo screens
```

---

# 37. Demo UI Priority

Polish the screens judges are most likely to see first:

```text
1. Dashboard
2. Trip Builder
3. Activity Discovery
4. Itinerary
5. Budget
6. Calendar
7. Public Trip
```

Less important screens can remain simpler.

---

# 38. Phase 13 — Testing

## Priority

```text
P0 before demo
```

Testing should happen continuously, but this phase is a dedicated stabilization pass.

Test areas:

- Authentication
- Authorization
- Trip CRUD
- Stop CRUD
- Stop order
- Date boundaries
- City search
- Activity search
- Itinerary
- Budget
- Calendar
- Sharing
- Copy Trip
- Cascading delete
- Invalid input
- Empty states

Detailed testing follows:

```text
TESTING_PLAN.md
```

---

# 39. Critical Regression Flow

Run this repeatedly:

```text
Create Account
 ↓
Create Trip
 ↓
Add Two Stops
 ↓
Add Activities
 ↓
Modify Activity
 ↓
View Budget
 ↓
View Calendar
 ↓
Publish
 ↓
Open Public Page
```

Every major merge should avoid breaking this flow.

---

# 40. Phase 14 — Demo Preparation

## Priority

```text
P0
```

The demo is not the time to discover integration problems.

Tasks:

- Reset database
- Apply migrations
- Seed demo data
- Verify demo accounts
- Verify primary demo trip
- Practice full demo
- Prepare fallback trip
- Check network dependency
- Check frontend build
- Check backend startup
- Check browser state
- Verify public links
- Verify Copy Trip
- Prepare short explanation of architecture

Detailed demo sequence is defined in:

```text
DEMO_PLAN.md
```

---

# 41. Suggested Overall Sequence

```text
FOUNDATION
    ↓
DATABASE
    ↓
AUTH
    ↓
TRIPS
    ↓
STOPS
    ↓
ITINERARY
    ↓
BUDGET
    ↓
CALENDAR
    ↓
SHARING
    ↓
POLISH
    ↓
TEST
    ↓
DEMO
```

City and activity discovery happen in parallel with the Trip Core development.

---

# 42. Backend Dependency Graph

```text
User
 │
 ▼
Auth
 │
 ▼
Trip
 │
 ▼
TripStop
 │
 ▼
ItineraryItem
```

Reference data:

```text
City
 │
 ├─────► TripStop
 │
 ▼
Activity
 │
 ▼
ItineraryItem
```

Derived features:

```text
Trip + Stops + Itinerary
          │
          ├────► Budget
          │
          ├────► Calendar
          │
          └────► Sharing
```

---

# 43. Frontend Dependency Graph

```text
Authentication
      ↓
Dashboard
      ↓
Trip Builder
      ↓
Stops
      ↓
Activities
      ↓
Itinerary
   ┌──┴──┐
   ▼     ▼
Budget Calendar
   └──┬──┘
      ▼
Sharing
```

---

# 44. Person A Roadmap

Person A should approximately follow:

```text
1. Initial foundation assistance
2. User/Auth database support
3. Signup
4. Login
5. JWT middleware
6. Trip CRUD
7. Ownership helper
8. Stop CRUD
9. Stop ordering
10. Trip/Stop date validation
11. Authorization tests
12. Integration fixes
13. Frontend/API integration support
14. Demo stabilization
```

---

# 45. Person B Roadmap

Person B should approximately follow:

```text
1. Initial foundation assistance
2. Seed city data
3. City discovery
4. Seed activities
5. Activity discovery
6. Itinerary CRUD
7. Itinerary validation
8. Budget
9. Calendar integration
10. Public sharing
11. Copy Trip
12. Integration fixes
13. Frontend/API integration support
14. Demo stabilization
```

---

# 46. Parallel Work Matrix

| Phase | Person A | Person B |
|---|---|---|
| Foundation | Shared | Shared |
| Database | Shared | Shared |
| Auth | Build | Seed preparation |
| Trips | Build | Cities |
| Stops | Build | Activities |
| Itinerary | Integration support | Build |
| Budget | Test trip data | Build |
| Calendar | Integration | Build/Frontend |
| Sharing | Ownership support | Build |
| Polish | Shared | Shared |
| Testing | Shared | Shared |
| Demo | Shared | Shared |

---

# 47. Shared Files Warning

Parallel development should mostly happen inside owned modules.

Avoid simultaneous edits to:

```text
schema.prisma
app.ts
package.json
docker-compose.yml
shared middleware
shared utilities
```

Coordinate before changing these.

This follows `TEAM_WORK_SPLIT.md`.

---

# 48. MVP Gate 1 — Infrastructure

Before feature work progresses deeply:

```text
Frontend works
Backend works
Database works
Prisma works
Git workflow works
```

If infrastructure is unstable, feature development will create more problems later.

---

# 49. MVP Gate 2 — Trip Core

Required:

```text
Authentication
+
Trip CRUD
+
Stop CRUD
+
Ownership
```

Once complete:

```text
User can create a protected multi-city trip.
```

---

# 50. MVP Gate 3 — Planning Core

Required:

```text
Cities
+
Activities
+
Itinerary
```

Once complete:

```text
User can actually plan what to do during the trip.
```

---

# 51. MVP Gate 4 — Value Layer

Required:

```text
Budget
+
Calendar
```

Once complete:

```text
The application provides organization and cost visibility.
```

---

# 52. MVP Gate 5 — Sharing

Required:

```text
Publish
+
Public View
```

Preferred:

```text
Copy Trip
```

Once complete:

```text
The application's social/reuse journey works.
```

---

# 53. Optional Feature Gate

Only attempt optional features when all of these are true:

- [ ] Authentication works
- [ ] Trip creation works
- [ ] Stops work
- [ ] Activities work
- [ ] Itinerary works
- [ ] Budget works
- [ ] Calendar works
- [ ] Public sharing works
- [ ] Main flow has been tested
- [ ] No major blocker exists

Then optional features may be considered.

---

# 54. Features to Avoid Before MVP

Do not prioritize:

```text
Live flights
Hotel booking
Payment gateway
AI itinerary generation
Real-time collaboration
Live currency conversion
Complex recommendation engine
Large-scale maps system
Social network functionality
```

These are covered by `LIMITATIONS.md`.

---

# 55. Hackathon Scope Decision Rule

Whenever someone suggests a new feature, ask:

```text
Does this help the required demo?
```

If no:

```text
Is the MVP already stable?
```

If no:

```text
Do not build it yet.
```

---

# 56. Integration Milestones

Do not wait until the end to integrate everything.

Recommended integration points:

```text
Milestone 1
Auth + Trips

Milestone 2
Trips + Stops

Milestone 3
Stops + Activities

Milestone 4
Itinerary + Budget

Milestone 5
Calendar + Sharing
```

Test after every milestone.

---

# 57. API-First Integration

Frontend work should follow `API_CONTRACT.md`.

The frontend should not wait for every backend endpoint to be complete before component development starts.

Where appropriate:

```text
API Contract
    ↓
Build UI
    ↓
Connect actual endpoint
```

But do not invent response structures that conflict with the API contract.

---

# 58. Seed-First Discovery

Cities and activities should use predictable local seed data first.

Sequence:

```text
Create seed
    ↓
Verify database
    ↓
Build API
    ↓
Build frontend search
```

This is safer than introducing an external API dependency early.

---

# 59. Build Vertical Slices

Prefer completing functional slices.

Example:

```text
Create Trip
Backend
+
Frontend
+
Validation
+
Error Handling
```

before moving too far ahead.

Avoid having:

```text
20 backend endpoints
0 connected frontend screens
```

or:

```text
10 frontend pages
0 working backend
```

The project should become usable gradually.

---

# 60. Recommended Vertical Slice Order

```text
Slice 1
Signup/Login

Slice 2
Create/List Trips

Slice 3
Add Stops

Slice 4
Search/Add Activities

Slice 5
Itinerary

Slice 6
Budget

Slice 7
Calendar

Slice 8
Sharing
```

Each slice should become minimally usable before the next major dependency is layered on top.

---

# 61. Error Handling Timing

Do not postpone all error handling until the end.

Each feature should handle:

```text
Validation
Authentication
Authorization
Not Found
Server Error
```

using `ERROR_STANDARD.md`.

This prevents a huge cleanup phase later.

---

# 62. Testing Timing

Testing happens at three levels.

## During Development

Test the feature currently being built.

## After Integration

Test interaction between modules.

## Before Demo

Run the complete `TESTING_PLAN.md`.

Testing is continuous, not only Phase 13.

---

# 63. Documentation Timing

When implementation intentionally changes a documented contract:

```text
Change decision
      ↓
Update responsible documentation
      ↓
Change implementation
```

Do not allow code and documentation to drift silently.

Important source-of-truth documents include:

```text
DATABASE_SCHEMA.md
API_CONTRACT.md
BUSINESS_RULES.md
```

---

# 64. If Development Falls Behind

Reduce scope in reverse priority order.

Remove or postpone:

```text
1. Extra visual polish
2. Advanced filters
3. Extra seeded destinations
4. Copy Trip
5. Optional activity features
```

Protect:

```text
Authentication
Trips
Stops
Activities
Itinerary
Budget
Basic sharing
```

---

# 65. Emergency MVP

If time becomes extremely limited, the minimum demoable version is:

```text
Login
 ↓
Create Trip
 ↓
Add City
 ↓
Add Activity
 ↓
View Itinerary
 ↓
View Budget
```

If possible, add:

```text
Publish Trip
```

after this.

---

# 66. Do Not Sacrifice Stability

A smaller application that works is better than a larger application with broken flows.

Preferred:

```text
7 features
All work
```

over:

```text
15 features
Half broken
```

This is especially important for the hackathon demo.

---

# 67. Last Development Phase Before Demo

Stop adding features.

Focus only on:

```text
Bugs
Integration
Data
Errors
Loading states
Demo flow
Backup plan
```

Do not introduce architecture changes shortly before judging unless absolutely necessary.

---

# 68. Final Fresh-Start Test

Before finalizing:

```text
Clone / clean state
        ↓
Install
        ↓
Docker Up
        ↓
Migrate
        ↓
Seed
        ↓
Start Backend
        ↓
Start Frontend
        ↓
Run Demo
```

This validates the entire project rather than only the developers' existing machines.

---

# 69. Final Roadmap Overview

```text
┌─────────────────────────┐
│      1. FOUNDATION      │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      2. DATABASE        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      3. AUTH            │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      4. TRIPS           │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      5. STOPS           │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│   6–7. DISCOVERY        │
│   Cities + Activities   │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      8. ITINERARY       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│       9. BUDGET         │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      10. CALENDAR       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      11. SHARING        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      12. UI POLISH      │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│      13. TESTING        │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│    14. DEMO PREP        │
└─────────────────────────┘
```

---

# 70. Final Rule

At any moment during development, choose the next task using this order:

```text
Does it unblock another feature?
        ↓
YES → Do it first
```

then:

```text
Is it required for the MVP?
        ↓
YES → High priority
```

then:

```text
Does it improve demo reliability?
        ↓
YES → Do before optional features
```

Only after those are complete should the team work on additional polish or scope.

The roadmap exists to ensure GlobeTrotter becomes a complete working product before it becomes a complex one.