# GlobeTrotter — Initial Project Skeleton Template

## 1. Purpose

This document defines the initial project scaffold for GlobeTrotter.

Its purpose is to make sure both developers begin from the same repository structure and do not invent different file layouts during implementation.

This skeleton should be created before major feature work begins.

The project follows the architecture defined in:

```text
PROJECT_STRUCTURE.md
SYSTEM_ARCHITECTURE.md
TEAM_WORK_SPLIT.md
```

The scaffold should support:

```text
React + Vite + TypeScript
Node.js + Express + TypeScript
Prisma
PostgreSQL
Feature-based backend modules
Feature-oriented frontend structure
```

---

# 2. Root Repository

Recommended root structure:

```text
globe-trotter/
│
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── .env.example
```

The exact structure should remain aligned with `PROJECT_STRUCTURE.md`.

---

# 3. `/docs`

All project architecture and planning documentation belongs here.

```text
docs/
├── 00_MASTER_INDEX.md
├── 01_PRD.md
├── 02_TECH_STACK.md
├── 03_SYSTEM_ARCHITECTURE.md
├── 04_DATABASE_SCHEMA.md
├── 05_API_CONTRACT.md
├── 06_PROJECT_STRUCTURE.md
├── 07_AUTH_AND_AUTHORIZATION.md
├── 08_BUSINESS_RULES.md
├── 09_FRONTEND_ARCHITECTURE.md
├── 10_USER_FLOWS.md
├── 11_TEAM_WORK_SPLIT.md
├── 12_LOCAL_DEVELOPMENT.md
├── 13_SEED_DATA.md
├── 14_ROADMAP.md
├── 15_LIMITATIONS.md
├── 16_ERROR_STANDARD.md
├── 17_TESTING_PLAN.md
├── 18_GIT_WORKFLOW.md
├── 19_DEMO_PLAN.md
└── 20_SKELETON_TEMPLATE.md
```

These files should be committed before implementation begins.

---

# 4. Backend Root

Backend application:

```text
apps/api/
```

Recommended structure:

```text
apps/api/
├── src/
├── prisma/
├── tests/
├── package.json
├── tsconfig.json
├── .env
└── .env.example
```

---

# 5. Backend `src`

Recommended:

```text
apps/api/src/
├── app.ts
├── server.ts
│
├── config/
│   ├── env.ts
│   └── prisma.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
│
├── common/
│   ├── errors/
│   ├── utils/
│   └── types/
│
└── modules/
    ├── auth/
    ├── trips/
    ├── stops/
    ├── cities/
    ├── activities/
    ├── itinerary/
    ├── budget/
    └── sharing/
```

Feature modules are the main development boundary.

---

# 6. `app.ts`

Responsibility:

```text
Express application configuration
```

Typical responsibilities:

- Create Express app
- JSON middleware
- CORS
- Register routes
- Unknown-route handling
- Global error middleware

Conceptual starter:

```ts
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// feature routes registered here

export default app;
```

The real implementation must use the documented environment and route structure.

---

# 7. `server.ts`

Responsibility:

```text
Start HTTP server
```

Conceptual starter:

```ts
import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
```

Environment access may be centralized through `config/env.ts`.

---

# 8. Environment Configuration

Suggested:

```text
src/config/env.ts
```

Purpose:

- Read environment variables
- Validate required variables
- Export normalized configuration

Example conceptual shape:

```ts
export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};
```

Do not hardcode secrets.

---

# 9. Prisma Client

Suggested file:

```text
src/config/prisma.ts
```

Conceptual:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

All modules should reuse one shared Prisma client.

Do not instantiate separate clients randomly throughout feature files.

---

# 10. Prisma Folder

Recommended:

```text
apps/api/prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

`schema.prisma` is governed by:

```text
DATABASE_SCHEMA.md
```

`seed.ts` is governed by:

```text
SEED_DATA.md
```

---

# 11. Feature Module Structure

Each backend feature should generally use the same internal shape.

Template:

```text
modules/<feature>/
├── <feature>.routes.ts
├── <feature>.controller.ts
├── <feature>.service.ts
├── <feature>.validation.ts
└── <feature>.types.ts
```

Not every feature must use every file.

Keep only what is useful.

---

# 12. Do Not Over-Scaffold

Avoid creating empty files solely because the template lists them.

Example:

If `budget` needs only:

```text
budget.routes.ts
budget.controller.ts
budget.service.ts
```

then do not create useless:

```text
budget.repository.ts
budget.mapper.ts
budget.factory.ts
```

unless actual complexity requires them.

The structure exists to guide consistency, not create boilerplate for its own sake.

---

# 13. Auth Module

Recommended:

```text
modules/auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.validation.ts
└── auth.types.ts
```

Responsibilities:

```text
Signup
Login
Password hashing
JWT generation
```

Authentication middleware remains shared:

```text
middleware/auth.middleware.ts
```

because other modules depend on it.

---

# 14. Trip Module

Recommended:

```text
modules/trips/
├── trip.routes.ts
├── trip.controller.ts
├── trip.service.ts
├── trip.validation.ts
└── trip.types.ts
```

Responsibilities:

- Create trip
- List trips
- Read trip
- Update trip
- Delete trip

---

# 15. Stop Module

Recommended:

```text
modules/stops/
├── stop.routes.ts
├── stop.controller.ts
├── stop.service.ts
├── stop.validation.ts
└── stop.types.ts
```

Responsibilities:

- Add stop
- Update stop
- Delete stop
- Reorder stops

---

# 16. City Module

Recommended:

```text
modules/cities/
├── city.routes.ts
├── city.controller.ts
├── city.service.ts
└── city.types.ts
```

Responsibilities:

```text
City search
City discovery
```

City data is master/reference data.

---

# 17. Activity Module

Recommended:

```text
modules/activities/
├── activity.routes.ts
├── activity.controller.ts
├── activity.service.ts
└── activity.types.ts
```

Responsibilities:

```text
Activity search
City filtering
Category filtering
Activity details
```

---

# 18. Itinerary Module

Recommended:

```text
modules/itinerary/
├── itinerary.routes.ts
├── itinerary.controller.ts
├── itinerary.service.ts
├── itinerary.validation.ts
└── itinerary.types.ts
```

Responsibilities:

```text
Add itinerary item
Edit itinerary item
Delete itinerary item
Retrieve itinerary
```

---

# 19. Budget Module

Recommended:

```text
modules/budget/
├── budget.routes.ts
├── budget.controller.ts
├── budget.service.ts
└── budget.types.ts
```

Responsibilities:

```text
Calculate activity total
Calculate accommodation total
Calculate transport total
Calculate trip total
```

Budget should be derived from source data.

---

# 20. Sharing Module

Recommended:

```text
modules/sharing/
├── sharing.routes.ts
├── sharing.controller.ts
├── sharing.service.ts
└── sharing.types.ts
```

Responsibilities:

```text
Publish trip
Public trip
Copy trip
```

Copy Trip should use a Prisma transaction.

---

# 21. Route Template

Generic conceptual route:

```ts
import { Router } from "express";

const router = Router();

router.get("/", controllerFunction);

export default router;
```

Protected routes should include auth middleware according to `API_CONTRACT.md`.

Example conceptually:

```ts
router.post(
  "/",
  authMiddleware,
  createTrip
);
```

---

# 22. Controller Template

Controllers should remain thin.

Conceptual:

```ts
export async function createTrip(req, res, next) {
  try {
    const trip = await tripService.createTrip(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
}
```

If the project uses an async wrapper, repeated `try/catch` may be removed.

---

# 23. Service Template

Services contain business logic.

Conceptual:

```ts
export async function createTrip(
  userId: string,
  input: CreateTripInput
) {
  // validate business rules

  return prisma.trip.create({
    data: {
      userId,
      ...input,
    },
  });
}
```

Controllers should not contain major Prisma/business logic.

---

# 24. Validation Template

Conceptual responsibility:

```text
Validate request shape
```

Example type:

```ts
type CreateTripInput = {
  name: string;
  startDate: string;
  endDate: string;
};
```

If the selected validation library is used, define reusable schemas here.

Validation behavior must follow:

```text
BUSINESS_RULES.md
API_CONTRACT.md
```

---

# 25. Error Classes

Suggested:

```text
common/errors/
├── AppError.ts
└── errorCodes.ts
```

Conceptual `AppError`:

```ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
  }
}
```

Exact implementation follows `ERROR_STANDARD.md`.

---

# 26. Error Middleware

Suggested:

```text
middleware/error.middleware.ts
```

Responsibilities:

```text
Receive thrown errors
       ↓
Convert AppError
       ↓
Return standard failure
```

Unknown exceptions should become:

```text
500 INTERNAL_SERVER_ERROR
```

without exposing internals.

---

# 27. Auth Middleware

Suggested:

```text
middleware/auth.middleware.ts
```

Responsibilities:

```text
Read Authorization header
        ↓
Verify Bearer JWT
        ↓
Load/attach user identity
        ↓
Continue request
```

Expected conceptual result:

```ts
req.user = {
  id: payload.userId
};
```

JWT payload shape follows `AUTH_AND_AUTHORIZATION.md`.

---

# 28. Ownership Utility

Recommended shared location:

```text
common/utils/ownership.ts
```

or the exact shared location defined in `PROJECT_STRUCTURE.md`.

Core helper:

```text
assertTripOwnership()
```

Conceptual:

```ts
export async function assertTripOwnership(
  userId: string,
  tripId: string
) {
  // load trip
  // verify userId
}
```

Do not duplicate ownership logic in every feature module.

---

# 29. Backend Types

Shared Express/request augmentation may live in:

```text
common/types/
```

Example:

```text
express.d.ts
```

to define:

```ts
req.user
```

for TypeScript.

Keep domain-specific types inside their feature modules.

---

# 30. API Tests Folder

Recommended:

```text
apps/api/tests/
```

Possible structure:

```text
tests/
├── auth.test.ts
├── trips.test.ts
├── stops.test.ts
├── itinerary.test.ts
└── sharing.test.ts
```

Only create automated tests where useful.

Full test requirements are defined in `TESTING_PLAN.md`.

---

# 31. Backend Initial Empty Skeleton

Before implementation, the backend may look like:

```text
apps/api/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── prisma.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── common/
│   │   ├── errors/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── modules/
│       ├── auth/
│       ├── trips/
│       ├── stops/
│       ├── cities/
│       ├── activities/
│       ├── itinerary/
│       ├── budget/
│       └── sharing/
│
├── package.json
└── tsconfig.json
```

---

# 32. Frontend Root

Frontend application:

```text
apps/web/
```

Recommended:

```text
apps/web/
├── src/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env
└── .env.example
```

---

# 33. Frontend `src`

Recommended:

```text
src/
├── main.tsx
├── App.tsx
│
├── pages/
│
├── features/
│
├── components/
│
├── services/
│
├── hooks/
│
├── context/
│
├── types/
│
└── assets/
```

Detailed frontend structure remains governed by:

```text
FRONTEND_ARCHITECTURE.md
```

---

# 34. Frontend Pages

Recommended:

```text
pages/
├── LoginPage.tsx
├── SignupPage.tsx
├── DashboardPage.tsx
├── NewTripPage.tsx
├── TripPage.tsx
├── ItineraryPage.tsx
├── BudgetPage.tsx
├── PublicTripPage.tsx
├── SettingsPage.tsx
└── NotFoundPage.tsx
```

Only create pages actually included in the final frontend architecture.

---

# 35. Frontend Feature Folders

Recommended:

```text
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

Feature folders may contain:

```text
components
hooks
types
helpers
```

specific to that feature.

---

# 36. Shared Components

Recommended:

```text
components/
├── layout/
├── ui/
└── feedback/
```

Examples:

```text
Navbar
Sidebar
Button
Modal
Input
Card
Loader
EmptyState
ErrorState
ConfirmDialog
```

Do not place feature-specific components in shared folders unnecessarily.

---

# 37. Frontend Services

Recommended:

```text
services/
├── api.ts
└── auth-storage.ts
```

`api.ts` should centralize:

```text
VITE_API_URL
```

and common request behavior.

---

# 38. API Client Template

Conceptually:

```ts
const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(
    `${API_URL}${path}`,
    options
  );

  return response.json();
}
```

The final client should support:

```text
JWT header
JSON handling
standard errors
```

without every component duplicating fetch logic.

---

# 39. Feature API Files

Feature-specific API calls may live inside feature folders.

Example:

```text
features/trips/trip.api.ts
```

Conceptually:

```ts
export function getTrips() {}
export function createTrip() {}
export function updateTrip() {}
export function deleteTrip() {}
```

This keeps API operations near their domain.

---

# 40. Authentication State

Recommended:

```text
context/AuthContext.tsx
```

or the equivalent architecture defined in `FRONTEND_ARCHITECTURE.md`.

Responsibilities:

```text
Current user
Auth token
Login
Logout
Authentication status
```

Do not scatter auth state across unrelated pages.

---

# 41. Custom Hooks

Recommended:

```text
hooks/
```

for truly shared hooks.

Examples:

```text
useAuth
useDebounce
```

Feature-specific hooks should generally remain inside their feature folder.

---

# 42. Shared Types

Recommended:

```text
types/
```

for broad frontend types only.

Feature domain types may remain with their feature.

Avoid one enormous:

```text
types.ts
```

containing every model in the application.

---

# 43. Frontend Assets

Recommended:

```text
assets/
```

for:

```text
logos
icons
local destination images
placeholders
```

Stable local assets are useful for demo reliability.

---

# 44. Frontend Page Template

Conceptual:

```tsx
export function ExamplePage() {
  return (
    <main>
      {/* page content */}
    </main>
  );
}
```

Pages should primarily compose feature/shared components.

Do not put the entire application logic inside one page file.

---

# 45. Frontend Feature Component Template

Example:

```text
features/trips/components/TripCard.tsx
```

Conceptual:

```tsx
type TripCardProps = {
  name: string;
};

export function TripCard({
  name,
}: TripCardProps) {
  return <div>{name}</div>;
}
```

Keep components focused.

---

# 46. Frontend Form Pattern

A create/edit form should separate:

```text
UI state
Validation
API submission
Error display
```

Example flow:

```text
User submits
    ↓
Client validation
    ↓
API request
    ↓
Server validation
    ↓
Success / standard error
```

Backend remains authoritative for business rules.

---

# 47. Route Skeleton

Conceptual React routes:

```text
/
├── /login
├── /signup
├── /dashboard
├── /trips/new
├── /trips/:tripId
├── /trips/:tripId/itinerary
├── /trips/:tripId/budget
├── /shared/:tripId
└── /settings
```

Exact paths follow `FRONTEND_ARCHITECTURE.md`.

---

# 48. Protected Route Component

If required, create something like:

```text
components/auth/ProtectedRoute.tsx
```

Conceptual:

```text
Authenticated?
├── YES → render page
└── NO  → login
```

This improves consistency across protected pages.

---

# 49. Layout Components

Suggested:

```text
components/layout/
├── AppLayout.tsx
├── Navbar.tsx
└── Sidebar.tsx
```

Only create the layout elements the actual UI uses.

Do not force a sidebar if the final design does not use one.

---

# 50. Feedback Components

Useful shared components:

```text
components/feedback/
├── Loader.tsx
├── EmptyState.tsx
└── ErrorState.tsx
```

These support consistent handling of:

```text
Loading
Empty data
API failure
```

---

# 51. UI Components

Possible shared primitives:

```text
components/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Card.tsx
└── ConfirmDialog.tsx
```

Do not build a massive custom design system during initial scaffold.

Start only with primitives needed by the actual screens.

---

# 52. Frontend Initial Skeleton

Recommended:

```text
apps/web/src/
├── main.tsx
├── App.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── NewTripPage.tsx
│   ├── TripPage.tsx
│   ├── ItineraryPage.tsx
│   ├── BudgetPage.tsx
│   ├── PublicTripPage.tsx
│   └── SettingsPage.tsx
│
├── features/
│   ├── auth/
│   ├── trips/
│   ├── stops/
│   ├── cities/
│   ├── activities/
│   ├── itinerary/
│   ├── budget/
│   └── sharing/
│
├── components/
│   ├── layout/
│   ├── ui/
│   └── feedback/
│
├── services/
│   ├── api.ts
│   └── auth-storage.ts
│
├── hooks/
├── context/
├── types/
└── assets/
```

---

# 53. Initial Route Registration

Once the frontend scaffold exists:

```text
App.tsx
```

should register the main application routes.

Feature pages can initially show basic placeholders.

Example:

```text
Dashboard Page
Trip Page
Budget Page
```

Then each vertical slice replaces placeholders with real functionality.

---

# 54. Placeholder Rule

Placeholders are allowed during scaffold creation.

Example:

```tsx
export function BudgetPage() {
  return <div>Budget</div>;
}
```

But clearly treat these as temporary.

Do not confuse a rendered placeholder with a completed feature.

---

# 55. Backend Health Route

The initial scaffold should include one working route:

```text
GET /health
```

Conceptual:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

This proves:

```text
Frontend/Browser
→ Backend
```

can communicate.

---

# 56. Initial Database Verification

Before feature development:

```text
Docker PostgreSQL
        ↓
Prisma
        ↓
Express
```

should all connect successfully.

Do not begin building dozens of endpoints while database setup is still uncertain.

---

# 57. Docker Compose Skeleton

Root:

```text
docker-compose.yml
```

Conceptually:

```yaml
services:
  postgres:
    image: postgres
    ports:
      - "5432:5432"
```

Include:

```text
database
username
password
volume
```

according to `LOCAL_DEVELOPMENT.md`.

---

# 58. Root `.gitignore`

At minimum:

```text
node_modules/
.env
.env.local
dist/
coverage/
```

Do not ignore:

```text
prisma/migrations/
```

---

# 59. Backend `.env.example`

Example:

```env
DATABASE_URL=
PORT=4000
JWT_SECRET=
```

---

# 60. Frontend `.env.example`

Example:

```env
VITE_API_URL=http://localhost:4000
```

---

# 61. Initial Package Scripts — Backend

Typical scripts may include:

```json
{
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "..."
  }
}
```

The exact TypeScript runtime/build choice should follow `TECH_STACK.md`.

Do not maintain multiple competing ways to start the backend.

---

# 62. Initial Package Scripts — Frontend

Expected Vite scripts usually include:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

Use the actual Vite-generated scripts unless the project intentionally changes them.

---

# 63. Dependency Skeleton — Backend

Core dependencies should include the stack selected in `TECH_STACK.md`.

Conceptually:

```text
express
cors
@prisma/client
bcrypt
jsonwebtoken
```

Development dependencies may include:

```text
typescript
prisma
TypeScript type packages
development runner
```

Do not install unnecessary packages before they are needed.

---

# 64. Dependency Skeleton — Frontend

Core:

```text
react
react-dom
```

plus:

```text
React Router
```

if that is the selected routing solution.

Do not add multiple routing/state libraries for the same purpose.

---

# 65. Initial Database Schema Order

When implementing `schema.prisma`, create core entities according to `DATABASE_SCHEMA.md`.

Relationship dependency:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

Reference data:

```text
City
 ↓
Activity
```

with relations into stops/items.

Do not improvise schema based only on scaffold files.

---

# 66. Initial Seed Order

Seed:

```text
1. Users
2. Cities
3. Activities
4. Trips
5. Stops
6. Itinerary Items
```

according to `SEED_DATA.md`.

---

# 67. First Backend Vertical Slice

After scaffold, implement:

```text
Authentication
```

Flow:

```text
Signup
 ↓
Login
 ↓
JWT
 ↓
Protected route
```

Do not try to build all modules simultaneously.

---

# 68. Second Vertical Slice

Implement:

```text
Trips
```

End-to-end:

```text
Backend endpoint
+
Frontend page/form
+
Validation
+
Persistence
```

---

# 69. Third Vertical Slice

Implement:

```text
Stops
```

Then the product can represent:

```text
Trip
 ↓
Multiple cities
```

---

# 70. Fourth Vertical Slice

Implement discovery:

```text
City Search
Activity Search
```

using seed data.

---

# 71. Fifth Vertical Slice

Implement:

```text
Itinerary
```

Then:

```text
Trip
→ Stop
→ Activity
→ Scheduled Item
```

works end-to-end.

---

# 72. Sixth Vertical Slice

Implement:

```text
Budget
+
Calendar
```

from the itinerary data.

---

# 73. Seventh Vertical Slice

Implement:

```text
Sharing
+
Copy Trip
```

to complete the main user flow.

---

# 74. Module Ownership Markers

The skeleton should make ownership obvious.

Conceptually:

```text
Person A
├── auth/
├── trips/
└── stops/
```

```text
Person B
├── cities/
├── activities/
├── itinerary/
├── budget/
└── sharing/
```

Shared files remain coordinated.

---

# 75. Avoid Layered Global Folders

Do not scaffold:

```text
controllers/
services/
routes/
```

at global backend level.

That would produce:

```text
controllers/
├── auth.controller.ts
├── trip.controller.ts
├── stop.controller.ts
├── ...
```

which conflicts with the locked feature-based architecture.

---

# 76. Correct Feature-Based Structure

Use:

```text
modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.routes.ts
│
├── trips/
│   ├── trip.controller.ts
│   ├── trip.service.ts
│   └── trip.routes.ts
│
└── ...
```

This matches team ownership and reduces Git conflicts.

---

# 77. Shared vs Feature Logic

Shared:

```text
Auth middleware
Error middleware
Prisma client
Ownership helper
Environment config
```

Feature-local:

```text
Trip validation
Stop validation
Activity search logic
Budget calculation
Sharing logic
```

Do not move domain logic into shared folders simply to make it reusable.

---

# 78. Route Registration Pattern

One central location may register feature routers.

Conceptually:

```ts
app.use("/auth", authRoutes);
app.use("/trips", tripRoutes);
```

Nested routes should still follow `API_CONTRACT.md`.

Do not redesign endpoints based on what is easiest to register.

---

# 79. Naming Consistency

Use consistent singular/plural naming.

Example:

```text
trip.service.ts
trip.controller.ts
trip.routes.ts
```

or consistently:

```text
trips.service.ts
trips.controller.ts
trips.routes.ts
```

Pick one convention during scaffold creation and maintain it.

---

# 80. File Naming Rule

Recommended:

```text
kebab-case
```

or:

```text
feature.type.ts
```

Example:

```text
auth.middleware.ts
trip.service.ts
error.middleware.ts
```

Avoid inconsistent patterns like:

```text
TripService.ts
trip_controller.ts
TRIPRoutes.ts
```

inside the same codebase.

---

# 81. Export Rule

Prefer explicit exports and imports that make dependencies clear.

Avoid creating giant global barrel files during initial implementation if they create circular dependency confusion.

Simple imports are acceptable.

---

# 82. Avoid Circular Dependencies

Keep dependency direction clear.

Example:

```text
Controller
 ↓
Service
 ↓
Prisma
```

Avoid:

```text
Controller
↔
Service
```

or unrelated modules importing each other's controllers.

Cross-feature interaction should happen at sensible service/data boundaries.

---

# 83. Backend Request Flow

The skeleton should support:

```text
Request
 ↓
Route
 ↓
Middleware
 ↓
Controller
 ↓
Service
 ↓
Prisma
 ↓
PostgreSQL
```

Error:

```text
Any Layer
 ↓
AppError
 ↓
Global Error Middleware
```

---

# 84. Frontend Request Flow

The frontend skeleton should support:

```text
Page
 ↓
Feature Component / Hook
 ↓
API Layer
 ↓
Backend
```

Avoid:

```text
Every UI component
directly building fetch requests
```

---

# 85. Auth Request Flow

```text
Login Page
 ↓
Auth Feature
 ↓
API Client
 ↓
POST /auth/login
 ↓
Save auth state
 ↓
Dashboard
```

---

# 86. Trip Request Flow

```text
Dashboard
 ↓
Trip Feature
 ↓
Trip API
 ↓
Express Trip Module
 ↓
Prisma
```

This architectural symmetry makes debugging easier.

---

# 87. Skeleton Creation Order

Recommended creation sequence:

```text
1. Root
2. Frontend Vite app
3. Backend app
4. Docker Compose
5. Prisma
6. Shared backend infrastructure
7. Backend feature folders
8. Frontend page folders
9. Frontend feature folders
10. Health check
```

Then begin the roadmap.

---

# 88. Do Not Implement Features During Scaffold Step

The skeleton step is intended to create:

```text
Structure
+
Bootable applications
+
Database connectivity
```

not complete features.

Keep scaffold commits small and understandable.

---

# 89. Suggested Scaffold Commit

Example:

```text
chore: initialize project scaffold
```

Could contain:

```text
React/Vite application
Express application
Docker Compose
Prisma initialization
Feature directories
Basic health route
```

---

# 90. Second Scaffold Commit

Example:

```text
chore: add shared backend infrastructure
```

Could contain:

```text
Environment loader
Prisma singleton
Error class
Error middleware
Auth middleware placeholder
```

Then feature work can start separately.

---

# 91. Empty Directory Issue

Git does not track empty directories.

If the team wants to commit the full initial folder layout, use a placeholder such as:

```text
.gitkeep
```

inside genuinely empty directories.

Remove placeholders once real files exist.

Do not fill every directory with meaningless files only to make Git track it.

---

# 92. README Skeleton

Root README should initially contain:

```text
Project name
Short description
Stack
Local setup pointer
Documentation pointer
```

Detailed setup remains in:

```text
docs/12_LOCAL_DEVELOPMENT.md
```

Do not duplicate every documentation file inside README.

---

# 93. Documentation Link

README should make it obvious that new developers begin with:

```text
docs/00_MASTER_INDEX.md
```

That is the project entry point.

---

# 94. Scaffold Validation

Before considering the skeleton complete:

- [ ] Repository structure exists
- [ ] Frontend starts
- [ ] Backend starts
- [ ] PostgreSQL starts
- [ ] Prisma connects
- [ ] Health route works
- [ ] Environment templates exist
- [ ] `.gitignore` works
- [ ] Feature module folders exist
- [ ] Frontend feature/page structure exists
- [ ] No secrets committed

---

# 95. Fresh Setup Validation

Another developer should be able to:

```text
Clone
 ↓
Install
 ↓
Configure .env
 ↓
Docker Up
 ↓
Migrate
 ↓
Start Backend
 ↓
Start Frontend
```

without creating missing folders or guessing project structure.

---

# 96. Skeleton Must Match Documentation

Before coding, verify:

```text
TECH_STACK.md
```

matches installed technologies.

Verify:

```text
PROJECT_STRUCTURE.md
```

matches folders.

Verify:

```text
DATABASE_SCHEMA.md
```

matches Prisma plan.

Verify:

```text
TEAM_WORK_SPLIT.md
```

matches module ownership.

Do not create a scaffold that already contradicts the architecture.

---

# 97. Complete Backend Skeleton

```text
apps/api/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   ├── env.ts
│   │   └── prisma.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── common/
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── errorCodes.ts
│   │   │
│   │   ├── types/
│   │   └── utils/
│   │       └── ownership.ts
│   │
│   └── modules/
│       ├── auth/
│       ├── trips/
│       ├── stops/
│       ├── cities/
│       ├── activities/
│       ├── itinerary/
│       ├── budget/
│       └── sharing/
│
├── tests/
├── package.json
├── tsconfig.json
└── .env.example
```

---

# 98. Complete Frontend Skeleton

```text
apps/web/
│
├── public/
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NewTripPage.tsx
│   │   ├── TripPage.tsx
│   │   ├── ItineraryPage.tsx
│   │   ├── BudgetPage.tsx
│   │   ├── PublicTripPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── stops/
│   │   ├── cities/
│   │   ├── activities/
│   │   ├── itinerary/
│   │   ├── budget/
│   │   └── sharing/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   └── feedback/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── auth-storage.ts
│   │
│   ├── hooks/
│   ├── context/
│   ├── types/
│   └── assets/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

---

# 99. Complete Repository Skeleton

```text
globe-trotter/
│
├── apps/
│   ├── web/
│   └── api/
│
├── docs/
│   ├── 00_MASTER_INDEX.md
│   ├── 01_PRD.md
│   ├── ...
│   └── 20_SKELETON_TEMPLATE.md
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

# 100. Final Rule

The project skeleton should answer three questions immediately:

```text
Where does this code belong?
Who owns this feature?
What layer is responsible?
```

For backend features:

```text
modules/<feature>/
```

For frontend feature logic:

```text
features/<feature>/
```

For reusable frontend UI:

```text
components/
```

For shared backend infrastructure:

```text
config/
middleware/
common/
```

The scaffold exists to prevent structural decisions from being repeatedly reconsidered during the hackathon.

Once this skeleton is created and verified, development should proceed according to:

```text
ROADMAP.md
+
TEAM_WORK_SPLIT.md
+
API_CONTRACT.md
```

At that point, the GlobeTrotter documentation set is complete and implementation can begin.