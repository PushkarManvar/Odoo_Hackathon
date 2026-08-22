# GlobeTrotter — Documentation Index

## `/docs`

### 00 — `MASTER_INDEX.md`
The entry point for the project.

Contains:
- Project overview
- Documentation reading order
- Locked decisions
- MVP definition
- Links to every other document
- What is source of truth for what

---

### 01 — `PRD.md`
## Product Requirements Document

Defines **what we are building and why**.

Contains:
- Problem statement
- Product vision
- Target users
- Core problem
- User goals
- Main features
- User journeys
- Functional requirements
- Non-functional requirements
- MVP
- Optional features
- Success criteria
- Out-of-scope features

---

### 02 — `TECH_STACK.md`
## Technology Stack & Engineering Decisions

Defines **what technologies we use**.

Locked stack:

- React
- Vite
- TypeScript
- Node.js
- Express
- Prisma
- PostgreSQL
- Docker Compose
- JWT
- bcrypt
- REST API
- Git/GitHub

Also contains:
- Why each technology was selected
- Technologies intentionally avoided
- Local development ports
- Dependency recommendations

---

### 03 — `SYSTEM_ARCHITECTURE.md`
## Overall Architecture

Defines how the complete application communicates.

Contains:

```text
React
 ↓
REST API
 ↓
Express
 ↓
Services
 ↓
Prisma
 ↓
PostgreSQL
```

Also covers:

- Modular monolith architecture
- Request lifecycle
- Data flow
- Authentication flow
- Public itinerary flow
- Budget calculation flow
- Calendar generation
- Copy-trip transaction
- Responsibility boundaries

---

### 04 — `DATABASE_SCHEMA.md`
## Database Architecture + ER Diagram

Defines the database structure.

Core entities:

- User
- Trip
- City
- TripStop
- Activity
- ItineraryItem

Contains:
- ER diagram
- Relationships
- Final Prisma schema
- Enums
- Indexes
- Cascading behavior
- `@db.Date`
- Money storage rules
- Master activity vs itinerary activity explanation

This becomes the **database source of truth**.

---

### 05 — `API_CONTRACT.md`
## REST API Contract

Defines exactly how frontend and backend communicate.

Includes:

### Auth
- Signup
- Login

### Trips
- Create
- Read
- Update
- Delete

### Stops
- Add
- Edit
- Reorder
- Delete

### Discovery
- City search
- Activity search

### Itinerary
- Add item
- Update item
- Delete item

### Budget
- Cost summary

### Sharing
- Publish
- Public itinerary
- Copy trip

Every endpoint specifies:
- HTTP method
- URL
- Authentication
- Request body
- Response body
- Validation
- Error cases

---

### 06 — `PROJECT_STRUCTURE.md`
## Repository & Folder Architecture

Defines exactly where files belong.

Example:

```text
globe-trotter/
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
├── docker-compose.yml
└── README.md
```

And backend modules:

```text
modules/
├── auth/
├── trips/
├── stops/
├── cities/
├── activities/
├── itinerary/
├── budget/
└── sharing/
```

Prevents teammates from inventing different structures.

---

### 07 — `AUTH_AND_AUTHORIZATION.md`
## Authentication & Ownership Architecture

Defines:

- Password hashing
- JWT creation
- JWT payload
- Auth middleware
- Protected routes
- Ownership validation
- Public routes
- Forbidden vs not-found behavior

Includes shared:

```text
assertTripOwnership()
```

and ownership chains:

```text
Stop → Trip → User
Item → Stop → Trip → User
```

---

### 08 — `BUSINESS_RULES.md`
## Validation & Domain Rules

Defines every important application rule.

Examples:

- Trip start ≤ trip end
- Stop must remain inside trip
- Activity date must remain inside stop
- Activity city must match stop city
- Activity or customName must exist
- Sequence ordering rules
- Public trip rules
- Copy trip rules
- Date update behavior
- Delete behavior

This prevents business logic from being implemented differently by two developers.

---

### 09 — `FRONTEND_ARCHITECTURE.md`
## Frontend Routes, Pages & Components

Defines:

- React routing
- Main pages
- Component hierarchy
- API layer
- Authentication state
- Trip Builder component structure
- City search modal
- Activity search modal
- Budget screen
- Calendar screen
- Public itinerary screen

---

### 10 — `USER_FLOWS.md`
## Complete User Journey

Contains visual flows such as:

```text
Signup
 ↓
Dashboard
 ↓
Create Trip
 ↓
Add City
 ↓
Add Activities
 ↓
View Itinerary
 ↓
View Budget
 ↓
Calendar
 ↓
Share
```

Also:

- Copy public trip
- Edit trip
- Delete stop
- Modify activity
- Make trip public/private

---

### 11 — `TEAM_WORK_SPLIT.md`
## Development Ownership

Defines who owns what.

### Person A — Trip Core
- Auth
- Trips
- Stops
- Ownership
- Date validation

### Person B — Itinerary Core
- Cities
- Activities
- Itinerary items
- Budget
- Sharing

Also defines:
- Shared files
- Merge rules
- Files that require coordination

---

### 12 — `LOCAL_DEVELOPMENT.md`
## Local Environment Setup

Contains:

- Node installation requirements
- Docker requirements
- PostgreSQL Docker setup
- `.env`
- Prisma migration commands
- Prisma seed commands
- Backend startup
- Frontend startup

Final local architecture:

```text
Frontend :5173
Backend  :4000
Postgres :5432
```

---

### 13 — `SEED_DATA.md`
## Local Demo Data Strategy

Defines:

- Seed cities
- Seed activities
- Categories
- Costs
- Popularity
- Images
- Demo accounts
- Demo trips

Allows the application to work without depending on third-party APIs.

---

### 14 — `ROADMAP.md`
## Implementation Roadmap

Development phases:

1. Foundation
2. Database
3. Authentication
4. Trips
5. Stops
6. City discovery
7. Activities
8. Itinerary
9. Budget
10. Calendar
11. Sharing
12. UI polish
13. Testing
14. Demo preparation

Includes:
- Priority
- Dependencies
- MVP checkpoints
- Parallel work opportunities

---

### 15 — `LIMITATIONS.md`
## Limitations & Out-of-Scope

Explicitly records what we are **not** building.

Examples:

- No flight booking
- No hotel booking
- No payment gateway
- No live flight prices
- No live hotel availability
- No production-scale infrastructure
- No microservices
- No AI requirement
- No real-time collaboration
- No complex currency conversion

Prevents scope creep during the hackathon.

---

### 16 — `ERROR_STANDARD.md`
## API Error & Response Convention

Standard success:

```json
{
  "success": true,
  "data": {}
}
```

Standard failure:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STOP_DATE",
    "message": "Stop must be inside trip dates."
  }
}
```

Defines:
- Error codes
- HTTP status conventions
- Error classes
- Global Express error middleware

---

### 17 — `TESTING_PLAN.md`
## Testing Checklist

Contains tests for:

- Authentication
- Ownership
- Date boundaries
- Trip CRUD
- Stop CRUD
- Activities
- Budget
- Public sharing
- Copy Trip
- Cascading deletion
- Invalid input
- Demo-critical flows

---

### 18 — `GIT_WORKFLOW.md`
## Git & Collaboration Rules

Defines:

```text
main
develop
feature/*
```

Includes:
- Branch naming
- Commit naming
- Pull rules
- Merge rules
- Prisma schema coordination
- Migration conflict handling

---

### 19 — `DEMO_PLAN.md`
## Hackathon Demo Script

Defines exactly what the judges see.

Example:

```text
Login
→ Create Rajasthan Trip
→ Add Jaipur
→ Add Udaipur
→ Add activities
→ Show itinerary
→ Show automatic cost
→ Show calendar
→ Publish
→ Copy trip using second account
```

Also includes fallback plans if a feature fails.

---

### 20 — `SKELETON_TEMPLATE.md`
## Initial Project Scaffold

Contains the exact folders/files to create before development.

Backend skeleton:

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

Frontend skeleton:

```text
pages/
features/
components/
services/
hooks/
context/
```

Includes empty starter templates for:
- Route
- Controller
- Service
- Validation
- Middleware
- React page
- API client

---

# Source-of-Truth Rules

| Topic | Source of Truth |
|---|---|
| Product behavior | `PRD.md` |
| Technologies | `TECH_STACK.md` |
| Architecture | `SYSTEM_ARCHITECTURE.md` |
| Database | `DATABASE_SCHEMA.md` |
| Endpoints | `API_CONTRACT.md` |
| Folder structure | `PROJECT_STRUCTURE.md` |
| Validation rules | `BUSINESS_RULES.md` |
| Frontend structure | `FRONTEND_ARCHITECTURE.md` |
| Development order | `ROADMAP.md` |
| Scope restrictions | `LIMITATIONS.md` |

If two documents disagree, the document specifically responsible for that topic wins.

# Recommended Reading Order

```text
00 MASTER INDEX
        ↓
01 PRD
        ↓
02 TECH STACK
        ↓
03 SYSTEM ARCHITECTURE
        ↓
04 DATABASE SCHEMA
        ↓
05 API CONTRACT
        ↓
06 PROJECT STRUCTURE
        ↓
07 AUTH & AUTHORIZATION
        ↓
08 BUSINESS RULES
        ↓
09 FRONTEND ARCHITECTURE
        ↓
10 USER FLOWS
        ↓
11 TEAM SPLIT
        ↓
12 LOCAL DEVELOPMENT
        ↓
13 SEED DATA
        ↓
14 ROADMAP
        ↓
15 LIMITATIONS
        ↓
16 ERROR STANDARD
        ↓
17 TESTING PLAN
        ↓
18 GIT WORKFLOW
        ↓
19 DEMO PLAN
        ↓
20 SKELETON TEMPLATE
```