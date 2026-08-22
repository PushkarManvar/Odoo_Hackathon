# GlobeTrotter
## Technology Stack & Engineering Decisions

**Document:** `02_TECH_STACK.md`  
**Status:** Locked for MVP  
**Project Type:** Local-first Hackathon Web Application

---

# 1. Purpose

This document defines the exact technology stack for GlobeTrotter.

The goal is to remove unnecessary technical decisions during development.

Every teammate should follow this stack unless the team explicitly agrees to change it.

---

# 2. Final Stack

```text
Frontend       React
Build Tool     Vite
Language       TypeScript

Backend        Node.js
Framework      Express
Language       TypeScript

ORM            Prisma
Database       PostgreSQL
DB Runtime     Docker Compose

Authentication JWT
Password Hash  bcrypt

API Style      REST
Data Format    JSON

Version Control Git
Repository      GitHub

Deployment      Local demo only
```

---

# 3. Overall Technology Flow

```text
┌───────────────────────────┐
│         FRONTEND          │
│                           │
│ React + TypeScript        │
│ Vite                      │
│ React Router              │
└─────────────┬─────────────┘
              │
              │ HTTP / JSON
              ▼
┌───────────────────────────┐
│          BACKEND          │
│                           │
│ Node.js                   │
│ Express                   │
│ TypeScript                │
│ JWT                       │
└─────────────┬─────────────┘
              │
              │ Prisma ORM
              ▼
┌───────────────────────────┐
│         DATABASE          │
│                           │
│ PostgreSQL 17             │
│ Docker Compose            │
└───────────────────────────┘
```

---

# 4. Frontend

## Framework

```text
React
```

React is responsible for:

- UI rendering
- Page navigation
- Forms
- Trip builder interactions
- Calendar rendering
- Budget visualization
- API communication
- Authentication state

---

# 5. Frontend Build Tool

```text
Vite
```

Vite is chosen because it provides:

- Fast local development
- Fast startup
- Simple configuration
- Excellent React support
- Simple environment variables
- Minimal overhead

We will **not** use Create React App.

---

# 6. Frontend Language

```text
TypeScript
```

All frontend code should use TypeScript.

Advantages:

- Shared API types
- Fewer field-name mistakes
- Better autocomplete
- Easier refactoring
- Safer component props

Use:

```text
.ts
.tsx
```

instead of:

```text
.js
.jsx
```

for application source code.

---

# 7. Frontend Routing

Use:

```text
react-router-dom
```

Responsibilities:

- Public routes
- Authenticated routes
- Trip routes
- Public itinerary URLs

Example routes:

```text
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

# 8. Frontend Styling

Recommended:

```text
Tailwind CSS
```

Reason:

- Fast hackathon development
- Responsive design
- Easy reusable components
- Low CSS file-management overhead

If the frontend team already has a completed CSS/design approach, switching is not mandatory.

The architecture must not depend on Tailwind.

---

# 9. Frontend API Communication

Use the browser HTTP layer through either:

```text
fetch
```

or:

```text
Axios
```

Recommended for this project:

```text
Axios
```

because it makes:

- Base URL configuration
- JWT headers
- Error interception

simple.

Create one shared instance:

```text
src/lib/api.ts
```

Conceptually:

```text
Frontend Component
       ↓
API function
       ↓
Axios instance
       ↓
Express
```

Components should not repeatedly hard-code backend URLs.

---

# 10. Frontend State Management

Do not introduce Redux unless development actually requires it.

For MVP use:

```text
React state
+
Context
+
custom hooks
```

Recommended global state:

```text
AuthContext
```

Possible later:

```text
Trip context
```

only if genuinely useful.

Server data should preferably be fetched from the backend rather than copied into large global stores.

---

# 11. Optional Frontend Data Library

If time permits:

```text
TanStack Query
```

may be used for:

- Query caching
- Automatic refetching
- Loading state
- Mutation invalidation

However:

> TanStack Query is optional for MVP.

Do not spend hackathon time learning it if the team is unfamiliar with it.

---

# 12. Charts

The PS asks for budget charts.

Recommended:

```text
Recharts
```

Use only where needed.

Example:

- Budget category pie chart
- Cost bar chart

Charts are presentation components.

Budget calculations must remain in the backend.

---

# 13. Calendar

A lightweight React calendar library may be used if necessary.

However, the calendar architecture must remain:

```text
Backend itinerary data
        ↓
group by date
        ↓
frontend calendar
```

The calendar library must not become a second source of trip data.

For the first implementation, a custom timeline may be faster than integrating a complex calendar library.

---

# 14. Backend Runtime

Use:

```text
Node.js
```

Recommended:

```text
Node.js 22 LTS
```

All backend developers should use the same major Node version if possible.

The exact version should be recorded in:

```text
.nvmrc
```

or:

```text
package.json engines
```

Example:

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

---

# 15. Backend Framework

Use:

```text
Express
```

Express handles:

- REST routes
- Middleware
- Authentication
- Validation
- HTTP responses
- Error handling

We do not need a heavier framework for the hackathon.

---

# 16. Backend Language

Use:

```text
TypeScript
```

Reasons:

- Prisma works very well with TypeScript
- Shared domain types
- Safer controllers/services
- Fewer mistakes across two backend developers
- Better IDE support

---

# 17. Development Runner

Recommended:

```text
tsx
```

Use it to run TypeScript directly during development.

Example:

```text
npm run dev
```

could internally execute:

```text
tsx watch src/server.ts
```

Avoid unnecessary compile-run loops during active development.

---

# 18. API Architecture

Use:

```text
REST
```

Not:

```text
GraphQL
```

Core examples:

```text
GET    /trips
POST   /trips
GET    /trips/:id
PATCH  /trips/:id
DELETE /trips/:id
```

REST is sufficient for GlobeTrotter and easier to debug during a hackathon.

---

# 19. API Data Format

All API communication uses:

```text
JSON
```

Standard success format:

```json
{
  "success": true,
  "data": {}
}
```

Standard error format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STOP_DATE",
    "message": "Stop dates must be inside the trip date range."
  }
}
```

The detailed error standard is defined separately in:

```text
16_ERROR_STANDARD.md
```

---

# 20. ORM

Use:

```text
Prisma
```

Prisma responsibilities:

- PostgreSQL access
- Data models
- Relations
- Migrations
- Transactions
- Typed database queries
- Seed integration

Backend modules should access PostgreSQL through Prisma rather than writing raw SQL for normal application operations.

Raw SQL should only be used if a specific requirement cannot be reasonably handled through Prisma.

---

# 21. Database

Use:

```text
PostgreSQL
```

Recommended version:

```text
PostgreSQL 17
```

PostgreSQL is especially appropriate because GlobeTrotter is relational.

Core relationships include:

```text
User → Trips

Trip → Stops

City → Stops

City → Activities

Stop → Itinerary Items

Activity → Itinerary Items
```

The original GlobeTrotter PS specifically emphasizes proper relational database usage.

---

# 22. Database Runtime

PostgreSQL runs using:

```text
Docker Compose
```

Rather than requiring each developer to configure PostgreSQL differently.

Benefits:

- Same PostgreSQL version
- Same database name
- Same port
- Easy reset
- Easy onboarding

Architecture:

```text
Docker
  │
  └── PostgreSQL
```

The backend itself does not need to be Dockerized for the MVP.

---

# 23. Docker Compose

Root-level:

```text
docker-compose.yml
```

Expected database service:

```yaml
services:
  db:
    image: postgres:17
```

Local port:

```text
5432
```

The exact compose configuration will be defined in:

```text
12_LOCAL_DEVELOPMENT.md
```

---

# 24. Authentication

Use:

```text
JWT
```

Authentication flow:

```text
Login
 ↓
Verify credentials
 ↓
Create JWT
 ↓
Return JWT
 ↓
Frontend includes JWT
 ↓
Backend verifies JWT
```

HTTP header:

```text
Authorization: Bearer <token>
```

---

# 25. JWT Payload

Keep the token small.

Recommended payload:

```json
{
  "userId": "uuid"
}
```

Do not store:

- Password
- Password hash
- Full profile
- Trips
- Permissions unrelated to authentication

inside the JWT.

---

# 26. Password Hashing

Use:

```text
bcrypt
```

Never store plain-text passwords.

Flow:

```text
password
   ↓
bcrypt.hash()
   ↓
passwordHash
   ↓
PostgreSQL
```

Login:

```text
password
   ↓
bcrypt.compare()
   ↓
valid / invalid
```

---

# 27. Authentication Storage on Frontend

For the hackathon MVP, a simple token strategy is acceptable.

Options:

### Simple

```text
localStorage
```

Advantages:

- Easy
- Fast
- Works well for local demo

For production, httpOnly secure cookies would generally be preferable.

Since this is a local hackathon application, we do not need to over-engineer session infrastructure.

---

# 28. Authorization

JWT authentication alone is not enough.

Backend must also verify resource ownership.

Shared function:

```text
assertTripOwnership()
```

Architecture:

```text
Trip
 ↓
User
```

For stop:

```text
Stop
 ↓
Trip
 ↓
User
```

For item:

```text
Item
 ↓
Stop
 ↓
Trip
 ↓
User
```

The implementation belongs in shared backend infrastructure so different modules do not implement different ownership behavior.

---

# 29. Validation

Recommended library:

```text
Zod
```

Use it for request validation.

Example:

```text
Create Trip
```

validate:

- name
- start date
- end date
- currency
- budget fields

Zod should validate request shape.

Business services still validate domain rules such as:

```text
stop date must lie inside trip date
```

Those are business rules, not merely request-shape validation.

---

# 30. Validation Responsibility

Architecture:

```text
Request
   ↓
Zod
   ↓
Valid structure?
   ↓
Controller
   ↓
Service
   ↓
Business validation
```

Example:

Zod checks:

```text
arrivalDate exists
departureDate exists
```

Stop service checks:

```text
arrivalDate >= trip.startDate
departureDate <= trip.endDate
```

This separation should remain consistent.

---

# 31. Date Handling

Calendar dates are stored using PostgreSQL:

```text
DATE
```

through Prisma:

```prisma
DateTime @db.Date
```

For:

- Trip start date
- Trip end date
- Stop arrival date
- Stop departure date
- Itinerary item date

This avoids treating calendar dates as UTC timestamps.

Activity time-of-day remains:

```text
String
```

Example:

```text
"09:30"
```

A later migration to PostgreSQL `TIME` is possible but unnecessary for MVP.

---

# 32. Money Handling

All stored money values use:

```text
Integer
```

Example:

```text
500
```

means:

```text
₹500
```

For INR MVP this is sufficient.

Never use JavaScript floating-point values as the authoritative persisted representation for currency.

Calculated values such as average daily cost may be decimal in API output.

---

# 33. Images

For MVP, image handling must remain simple.

Preferred options, in priority order:

### Option 1

Use seeded remote image URLs for cities and activities.

### Option 2

Use local static images in the frontend.

### Option 3

Local uploads folder.

Avoid building complex file-storage infrastructure unless required.

The cover-image feature from the PS is optional enough that it must not delay core trip functionality.

---

# 34. City & Activity Data

MVP uses:

```text
Local seeded database data
```

rather than live travel APIs.

Advantages:

- No API key
- No quota
- No rate limits
- No internet dependence
- Predictable demo
- Faster development

Seed data includes:

```text
Cities
Activities
Categories
Estimated costs
Duration
Popularity
Cost index
Images
```

---

# 35. External APIs

No third-party API is mandatory for MVP.

Do not make the core system dependent on:

- Google Maps
- Places API
- Flight API
- Hotel API
- Weather API
- Currency API
- AI APIs

They may be added after the core product is stable if they provide genuine demo value.

---

# 36. Environment Variables

Backend:

```text
DATABASE_URL
JWT_SECRET
PORT
FRONTEND_URL
```

Frontend:

```text
VITE_API_BASE_URL
```

Example local setup:

```text
VITE_API_BASE_URL=http://localhost:4000
```

Secrets must not be committed to Git.

Commit:

```text
.env.example
```

Do not commit:

```text
.env
```

---

# 37. Local Ports

Locked defaults:

```text
Frontend    5173
Backend     4000
PostgreSQL  5432
```

Architecture:

```text
http://localhost:5173
          ↓
http://localhost:4000
          ↓
localhost:5432
```

---

# 38. CORS

Backend allows the local frontend origin:

```text
http://localhost:5173
```

Use:

```text
cors
```

package.

Configuration must use:

```text
FRONTEND_URL
```

rather than hard-coded values where practical.

---

# 39. Git

Use:

```text
Git
```

Remote collaboration:

```text
GitHub
```

Git handles:

- Parallel development
- Feature branches
- Integration
- Rollback
- History

Specific branch rules are defined in:

```text
18_GIT_WORKFLOW.md
```

---

# 40. Repository Strategy

Use:

```text
Monorepo
```

Structure:

```text
globe-trotter/
│
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
├── docker-compose.yml
├── README.md
└── .gitignore
```

Reasons:

- Only 2–3 developers
- Easier local startup
- One issue tracker
- One Git history
- Easier API coordination
- Easier documentation

---

# 41. Package Manager

Lock one package manager.

Recommended:

```text
npm
```

because it requires no additional tooling and all team members are likely to have it with Node.

Do not mix:

```text
npm
yarn
pnpm
```

in the same project.

The repository should contain one:

```text
package-lock.json
```

for each relevant workspace/package configuration.

---

# 42. API Testing

Recommended:

```text
Postman
```

or:

```text
Bruno
```

Choose whichever the backend team already knows.

Backend APIs should be tested independently before frontend integration.

Critical flows:

```text
Signup
Login
Trip CRUD
Stops
Items
Budget
Sharing
Copy
```

---

# 43. Database Inspection

Recommended options:

```text
Prisma Studio
```

or:

```text
pgAdmin
```

For hackathon speed:

```text
Prisma Studio
```

is usually enough.

Run:

```text
npx prisma studio
```

to inspect:

- users
- trips
- stops
- activities
- itinerary items

---

# 44. Logging

Use simple server logging for MVP.

At minimum log:

```text
method
route
status
unexpected errors
```

A basic request logger such as:

```text
morgan
```

may be used.

Do not introduce complex observability systems.

---

# 45. Error Handling

Use centralized Express error middleware.

Architecture:

```text
Service
  ↓
throw known error
  ↓
Controller / async handler
  ↓
Error middleware
  ↓
JSON error response
```

Recommended custom errors:

```text
BadRequestError
UnauthorizedError
ForbiddenError
NotFoundError
ConflictError
```

Details are defined in:

```text
16_ERROR_STANDARD.md
```

---

# 46. Testing Stack

For the hackathon, testing should prioritize critical business logic over percentage coverage.

If automated tests are used:

```text
Vitest
```

is recommended.

Possible backend combination:

```text
Vitest
Supertest
```

Critical automated tests:

- Trip date validation
- Stop date validation
- Ownership
- Budget calculations
- Copy trip transaction

Manual end-to-end testing is still required before demo.

---

# 47. Optional UI Libraries

Allowed if they save time:

```text
Lucide React
```

for icons.

A lightweight accessible component library may also be used if already familiar.

Do not adopt a large UI framework halfway through development unless there is a strong reason.

---

# 48. Libraries We Should Avoid Adding Without Need

Avoid unnecessary dependencies.

Examples:

```text
Redux
GraphQL
Apollo
Socket.IO
Redis
Kafka
NextAuth
Passport
BullMQ
Microservice frameworks
```

None of these solve a core GlobeTrotter requirement for the MVP.

---

# 49. Architecture Pattern

Backend pattern:

```text
Modular Monolith
```

Meaning:

One backend application:

```text
Express API
```

internally separated into:

```text
auth
trips
stops
cities
activities
itinerary
budget
sharing
```

All use one PostgreSQL database.

---

# 50. Why Not Microservices?

Microservices would introduce:

- Multiple servers
- Service communication
- More environment variables
- More deployments
- Distributed debugging
- More failure points

GlobeTrotter does not need them.

For a hackathon:

```text
Modular Monolith
```

provides enough structure without unnecessary infrastructure.

---

# 51. Why Not Next.js?

Next.js is a valid technology, but GlobeTrotter does not need its main advantages for this local MVP.

We already have:

```text
Express backend
```

Therefore Next.js server functionality would duplicate responsibilities.

React + Vite provides:

- Cleaner frontend/backend separation
- Faster setup
- Simpler mental model
- Easier debugging

Decision:

```text
React + Vite
```

is locked.

---

# 52. Why PostgreSQL Instead of MongoDB?

The project naturally contains relationships:

```text
User
 ↓
Trip
 ↓
Stop
 ↓
Item
```

alongside reusable:

```text
City
 ↓
Activity
```

The problem statement also specifically calls for proper relational database usage.

PostgreSQL is therefore a better architectural match.

---

# 53. Why Prisma?

Without ORM:

```text
Express
 ↓
raw SQL
 ↓
Postgres
```

With Prisma:

```text
Express
 ↓
typed Prisma queries
 ↓
Postgres
```

Benefits:

- Faster schema development
- Safer relations
- Easy migrations
- Easy transactions
- Better TypeScript integration

---

# 54. Why Local Seed Data?

Reliability during demo is more important than showing unnecessary integrations.

A demo dependent on an external API can fail because of:

```text
Internet
API limits
API outage
Invalid credentials
Unexpected data
Slow requests
```

Local seed data eliminates these risks.

---

# 55. Production vs Hackathon Decisions

Some choices are intentionally simplified.

### Hackathon

```text
JWT + localStorage
Local PostgreSQL
Seeded travel data
Local development
Simple image handling
```

### Production Evolution

Could later use:

```text
Secure cookies
Cloud PostgreSQL
Object storage
Real travel APIs
Rate limiting
Refresh tokens
Monitoring
Production deployment
```

The MVP must not build production infrastructure prematurely.

---

# 56. Required Backend Packages

Core:

```text
express
@prisma/client
bcrypt
jsonwebtoken
cors
zod
dotenv
```

Development:

```text
typescript
tsx
prisma
@types/node
@types/express
@types/bcrypt
@types/jsonwebtoken
@types/cors
```

Optional:

```text
morgan
```

Testing:

```text
vitest
supertest
```

if automated backend tests are added.

---

# 57. Required Frontend Packages

Core:

```text
react
react-dom
react-router-dom
axios
```

Recommended:

```text
lucide-react
```

Styling if selected:

```text
tailwindcss
```

Charts if implemented:

```text
recharts
```

Do not install optional packages until they are actually needed.

---

# 58. Final Technology Decision Table

| Area | Choice | Status |
|---|---|---|
| Frontend | React | LOCKED |
| Frontend build | Vite | LOCKED |
| Frontend language | TypeScript | LOCKED |
| Routing | React Router | LOCKED |
| Backend | Node.js | LOCKED |
| Backend framework | Express | LOCKED |
| Backend language | TypeScript | LOCKED |
| API | REST | LOCKED |
| Data format | JSON | LOCKED |
| ORM | Prisma | LOCKED |
| Database | PostgreSQL | LOCKED |
| PostgreSQL runtime | Docker Compose | LOCKED |
| Auth | JWT | LOCKED |
| Password hashing | bcrypt | LOCKED |
| Validation | Zod | LOCKED |
| Package manager | npm | LOCKED |
| Repository | Monorepo | LOCKED |
| Version control | Git + GitHub | LOCKED |
| External travel APIs | None required | LOCKED |
| Deployment | Local demo | LOCKED |
| Architecture | Modular Monolith | LOCKED |

---

# 59. Final Development Environment

Every developer should be able to run:

```text
docker compose up -d
```

then:

```text
Backend
npm run dev
```

then:

```text
Frontend
npm run dev
```

and have:

```text
React
  ↓
Express
  ↓
Prisma
  ↓
PostgreSQL
```

running locally.

---

# 60. Technology Principle

The primary engineering principle for GlobeTrotter is:

> Use the simplest technology that reliably satisfies the product requirement.

The value of the project should come from:

- Strong trip modeling
- Good itinerary building
- Correct relational design
- Useful budgeting
- Smooth user flow

rather than unnecessary infrastructure complexity.

---

# 61. Locked Stack Summary

```text
GLOBETROTTER

React + Vite + TypeScript
          │
          │ REST / JSON
          ▼
Node.js + Express + TypeScript
          │
          │ Prisma
          ▼
PostgreSQL 17
          │
          └── Docker Compose


Supporting:

JWT
bcrypt
Zod
Axios
React Router
Git/GitHub
npm
```

This technology stack is considered **locked for the GlobeTrotter MVP**.