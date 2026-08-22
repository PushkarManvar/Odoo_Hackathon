# GlobeTrotter
## Project Structure

**Document:** `06_PROJECT_STRUCTURE.md`  
**Status:** Locked for MVP  
**Repository Style:** Monorepo  
**Frontend:** React + Vite + TypeScript  
**Backend:** Express + TypeScript  
**Database:** PostgreSQL + Prisma

---

# 1. Purpose

This document defines the exact repository and folder structure for GlobeTrotter.

It is the source of truth for:

- Where frontend files belong
- Where backend files belong
- How feature modules are organized
- Where Prisma files live
- Where shared utilities belong
- Naming conventions
- Which files should not contain business logic
- How two backend developers avoid unnecessary merge conflicts

The main rule is:

> Organize the backend by feature/domain, not by global technical layers.

---

# 2. Root Repository Structure

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
├── README.md
├── .gitignore
└── package.json
```

---

# 3. Why Monorepo

A monorepo is preferred because the project has only a small team.

Benefits:

- One Git repository
- Easier coordination
- One documentation folder
- Easier environment setup
- Frontend/backend changes can be reviewed together
- API contract changes are easier to track
- Simpler hackathon workflow

---

# 4. Root Responsibilities

## `apps/`

Contains runnable applications.

```text
apps/
├── web/
└── api/
```

---

## `docs/`

Contains all project documentation.

Example:

```text
docs/
├── 00_MASTER_INDEX.md
├── 01_PRD.md
├── 02_TECH_STACK.md
├── 03_SYSTEM_ARCHITECTURE.md
├── 04_DATABASE_SCHEMA.md
├── 05_API_CONTRACT.md
├── 06_PROJECT_STRUCTURE.md
...
```

---

## `docker-compose.yml`

Runs local PostgreSQL.

---

## `README.md`

Contains only high-level onboarding information.

Do not duplicate every architecture detail into README.

README should link to the docs.

---

# 5. Final Root Tree

```text
globe-trotter/
│
├── apps/
│   │
│   ├── web/
│   │   ├── src/
│   │   ├── public/
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/
│       ├── src/
│       ├── prisma/
│       ├── .env
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── docs/
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── package.json
```

---

# 6. Backend Structure

Final backend structure:

```text
apps/api/
│
├── src/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── trips/
│   │   ├── stops/
│   │   ├── cities/
│   │   ├── activities/
│   │   ├── itinerary/
│   │   ├── budget/
│   │   └── sharing/
│   │
│   ├── middleware/
│   ├── db/
│   ├── utils/
│   ├── config/
│   ├── types/
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

# 7. Why Feature-Based Modules

We do **not** use:

```text
routes/
controllers/
services/
```

as global folders.

That structure looks clean initially but causes different developers to edit the same directories continuously.

Instead:

```text
modules/
├── trips/
├── budget/
├── sharing/
```

Each feature owns its own files.

This reduces merge conflicts.

---

# 8. Module Structure Template

A typical module looks like:

```text
modules/trips/
├── trip.routes.ts
├── trip.controller.ts
├── trip.service.ts
├── trip.validation.ts
└── trip.types.ts
```

Not every module must contain every file.

Create only what is useful.

---

# 9. Route File

Example:

```text
trip.routes.ts
```

Responsibilities:

- Declare endpoint paths
- Attach middleware
- Attach validation
- Call controller

Example conceptual flow:

```text
router.post(
  "/",
  authMiddleware,
  validate(createTripSchema),
  createTripController
)
```

Routes must not contain:

- Prisma queries
- Business rules
- Large transformations

---

# 10. Controller File

Example:

```text
trip.controller.ts
```

Responsibilities:

- Read request values
- Call service
- Send response

Example responsibility:

```text
req.body
req.params
req.user
      ↓
tripService
      ↓
res.status(...)
```

Controllers should remain thin.

---

# 11. Service File

Example:

```text
trip.service.ts
```

Responsibilities:

- Business rules
- Ownership checks
- Prisma operations
- Transactions
- Data composition

Most domain logic lives here.

---

# 12. Validation File

Example:

```text
trip.validation.ts
```

Contains Zod request schemas.

Example:

```text
createTripSchema
updateTripSchema
```

It validates request structure.

Business rules remain in service.

---

# 13. Types File

Example:

```text
trip.types.ts
```

Contains module-specific TypeScript types where useful.

Do not create a types file just to duplicate Prisma-generated types.

Use it only for:

- DTOs
- Service result shapes
- Domain-specific helpers

---

# 14. Auth Module

Structure:

```text
modules/auth/
├── auth.routes.ts
├── auth.controller.ts
├── auth.service.ts
├── auth.validation.ts
└── auth.types.ts
```

Responsibilities:

- Signup
- Login
- Password hashing
- JWT generation
- Auth user lookup

---

# 15. Trips Module

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
- Get trip
- Update trip
- Delete trip
- Trip date validation

---

# 16. Stops Module

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
- Edit stop
- Delete stop
- Reorder stops
- Stop date validation
- Sequence normalization

---

# 17. Cities Module

```text
modules/cities/
├── city.routes.ts
├── city.controller.ts
├── city.service.ts
├── city.validation.ts
└── city.types.ts
```

Responsibilities:

- Search cities
- Filter cities
- Get city
- Popular city ordering

City creation/editing is not a normal user feature in MVP.

---

# 18. Activities Module

```text
modules/activities/
├── activity.routes.ts
├── activity.controller.ts
├── activity.service.ts
├── activity.validation.ts
└── activity.types.ts
```

Responsibilities:

- List city activities
- Search activities
- Category filter
- Cost filter
- Duration filter

---

# 19. Itinerary Module

```text
modules/itinerary/
├── itinerary.routes.ts
├── itinerary.controller.ts
├── itinerary.service.ts
├── itinerary.validation.ts
└── itinerary.types.ts
```

Responsibilities:

- Add itinerary item
- Edit item
- Delete item
- Reorder items
- Item date validation
- Activity-city validation
- Custom item validation

---

# 20. Budget Module

```text
modules/budget/
├── budget.routes.ts
├── budget.controller.ts
├── budget.service.ts
└── budget.types.ts
```

Budget does not require a mutation validation file for initial MVP because it is read/calculated.

Responsibilities:

- Calculate activity cost
- Add trip-level estimates
- Remaining budget
- Average per day
- Breakdown by stop
- Breakdown by category

---

# 21. Sharing Module

```text
modules/sharing/
├── sharing.routes.ts
├── sharing.controller.ts
├── sharing.service.ts
├── sharing.validation.ts
└── sharing.types.ts
```

Responsibilities:

- Publish trip
- Unpublish trip
- Public trip lookup
- Share slug generation
- Copy trip transaction

---

# 22. Middleware Folder

```text
src/middleware/
├── auth.middleware.ts
├── error.middleware.ts
└── validation.middleware.ts
```

Only genuinely cross-cutting middleware belongs here.

---

# 23. Auth Middleware

```text
auth.middleware.ts
```

Responsibilities:

- Read Bearer token
- Verify JWT
- Attach authenticated user identity

Use one request convention:

```text
req.user.id
```

Do not mix several auth field names.

---

# 24. Error Middleware

```text
error.middleware.ts
```

Responsibilities:

- Catch application errors
- Convert them into standard API response
- Hide internal stack traces from frontend

---

# 25. Validation Middleware

```text
validation.middleware.ts
```

Responsibilities:

- Run Zod schema
- Return standardized validation errors
- Pass validated request forward

---

# 26. Database Folder

```text
src/db/
└── prisma.ts
```

`prisma.ts` contains the shared Prisma client singleton.

Example responsibility:

```text
new PrismaClient()
```

should exist in one place.

---

# 27. Utils Folder

```text
src/utils/
├── ownership.ts
├── dates.ts
├── slug.ts
└── async-handler.ts
```

Only cross-feature utilities belong here.

---

# 28. Ownership Utility

```text
ownership.ts
```

Contains shared ownership helpers.

Example:

```text
assertTripOwnership()
```

Potential helpers:

```text
getOwnedStop()
getOwnedItem()
```

But avoid duplicating logic unnecessarily.

---

# 29. Date Utility

```text
dates.ts
```

Possible responsibilities:

- Parse date-only input
- Compare date ranges
- Inclusive day count
- Check date inside range

Example functions:

```text
isDateWithinRange()
getInclusiveDayCount()
```

---

# 30. Slug Utility

```text
slug.ts
```

Contains:

```text
generateShareSlug()
```

Do not scatter slug-generation code through controllers.

---

# 31. Async Handler Utility

Optional:

```text
async-handler.ts
```

Can wrap async controllers so each controller does not need repetitive try/catch.

Example concept:

```text
asyncHandler(controller)
```

---

# 32. Config Folder

```text
src/config/
└── env.ts
```

Responsibilities:

- Read environment variables
- Validate required variables
- Export typed configuration

Avoid repeated direct access to:

```text
process.env
```

throughout the application.

---

# 33. Environment Config Example

Conceptually:

```text
env.ts
```

exports:

```text
PORT
DATABASE_URL
JWT_SECRET
FRONTEND_URL
```

If a required variable is missing, application should fail early during startup.

---

# 34. Types Folder

```text
src/types/
├── express.d.ts
└── common.ts
```

Use for truly global TypeScript types.

Example:

Extend Express Request:

```text
req.user
```

through declaration merging.

---

# 35. `app.ts`

Responsibilities:

- Create Express app
- Register JSON middleware
- Configure CORS
- Register routes
- Register 404/error handling

It must **not** call:

```text
app.listen()
```

---

# 36. `server.ts`

Responsibilities:

- Load configuration
- Start HTTP server

Example architecture:

```text
server.ts
  ↓
app.ts
  ↓
Express
```

---

# 37. Backend Route Registration

`app.ts` may register modules like:

```text
/api/auth
/api/trips
/api/cities
/api/stops
/api/items
```

Example conceptual mapping:

```text
app.use("/api/auth", authRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/cities", cityRoutes)
```

---

# 38. Prisma Folder

```text
apps/api/prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

---

# 39. `schema.prisma`

This file is the executable database source of truth.

Both backend developers must coordinate before modifying it.

---

# 40. `migrations/`

Generated Prisma migrations.

Do not manually rename migration SQL folders casually.

Do not delete migrations after teammates have already pulled them without coordination.

---

# 41. `seed.ts`

Contains deterministic demo data.

Responsibilities:

- Cities
- Activities
- Optional demo users
- Optional demo trip

Detailed rules belong in `13_SEED_DATA.md`.

---

# 42. Backend Environment Files

```text
apps/api/.env
apps/api/.env.example
```

`.env`:

```text
DO NOT COMMIT
```

`.env.example`:

```text
COMMIT
```

Example:

```text
DATABASE_URL=
JWT_SECRET=
PORT=
FRONTEND_URL=
```

---

# 43. Frontend Structure

Final frontend structure:

```text
apps/web/
│
├── src/
│   ├── pages/
│   ├── features/
│   ├── components/
│   ├── routes/
│   ├── lib/
│   ├── hooks/
│   ├── context/
│   ├── types/
│   ├── assets/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 44. Frontend `pages/`

Pages represent route-level screens.

```text
pages/
├── auth/
├── dashboard/
├── trips/
├── public/
└── profile/
```

---

# 45. Auth Pages

```text
pages/auth/
├── LoginPage.tsx
└── SignupPage.tsx
```

---

# 46. Dashboard Page

```text
pages/dashboard/
└── DashboardPage.tsx
```

---

# 47. Trip Pages

```text
pages/trips/
├── TripsListPage.tsx
├── CreateTripPage.tsx
├── TripBuilderPage.tsx
├── TripViewPage.tsx
├── TripBudgetPage.tsx
└── TripCalendarPage.tsx
```

---

# 48. Public Page

```text
pages/public/
└── PublicTripPage.tsx
```

---

# 49. Profile Page

```text
pages/profile/
└── ProfilePage.tsx
```

---

# 50. Features Folder

Feature-specific reusable UI and logic.

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

---

# 51. Example Trip Feature

```text
features/trips/
├── components/
│   ├── TripCard.tsx
│   ├── TripForm.tsx
│   └── TripHeader.tsx
│
├── trip.api.ts
├── trip.types.ts
└── trip.utils.ts
```

This keeps trip-specific code together.

---

# 52. Stops Feature

```text
features/stops/
├── components/
│   ├── StopCard.tsx
│   ├── StopList.tsx
│   └── AddStopDialog.tsx
│
├── stop.api.ts
└── stop.types.ts
```

---

# 53. Cities Feature

```text
features/cities/
├── components/
│   ├── CitySearch.tsx
│   ├── CityCard.tsx
│   └── CitySearchModal.tsx
│
├── city.api.ts
└── city.types.ts
```

---

# 54. Activities Feature

```text
features/activities/
├── components/
│   ├── ActivityCard.tsx
│   ├── ActivityFilters.tsx
│   └── ActivitySearchModal.tsx
│
├── activity.api.ts
└── activity.types.ts
```

---

# 55. Itinerary Feature

```text
features/itinerary/
├── components/
│   ├── DayPlan.tsx
│   ├── ItineraryItemCard.tsx
│   ├── AddItemDialog.tsx
│   └── CustomItemForm.tsx
│
├── itinerary.api.ts
├── itinerary.types.ts
└── itinerary.utils.ts
```

---

# 56. Budget Feature

```text
features/budget/
├── components/
│   ├── BudgetSummary.tsx
│   ├── BudgetBreakdown.tsx
│   └── BudgetChart.tsx
│
├── budget.api.ts
└── budget.types.ts
```

---

# 57. Sharing Feature

```text
features/sharing/
├── components/
│   ├── ShareTripButton.tsx
│   └── CopyTripButton.tsx
│
├── sharing.api.ts
└── sharing.types.ts
```

---

# 58. Shared Components

```text
src/components/
├── ui/
├── layout/
└── feedback/
```

---

# 59. UI Components

```text
components/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Select.tsx
├── Card.tsx
└── Spinner.tsx
```

These components should not know about trips or activities.

---

# 60. Layout Components

```text
components/layout/
├── AppShell.tsx
├── Navbar.tsx
├── Sidebar.tsx
└── PageHeader.tsx
```

---

# 61. Feedback Components

```text
components/feedback/
├── LoadingState.tsx
├── ErrorState.tsx
└── EmptyState.tsx
```

---

# 62. Routes Folder

```text
src/routes/
├── router.tsx
└── ProtectedRoute.tsx
```

`router.tsx` defines route map.

`ProtectedRoute.tsx` handles frontend auth UX.

Remember:

> Frontend route protection is not backend authorization.

---

# 63. `lib/` Folder

```text
src/lib/
├── api.ts
├── auth-storage.ts
└── format.ts
```

---

# 64. API Client

```text
lib/api.ts
```

Contains shared Axios instance.

Responsibilities:

- Base URL
- Authorization header
- Common response/error handling

---

# 65. Auth Storage

```text
lib/auth-storage.ts
```

Handles token persistence.

For MVP:

```text
localStorage
```

can be wrapped through this file rather than accessed everywhere.

---

# 66. Format Helpers

```text
lib/format.ts
```

May contain:

```text
formatCurrency()
formatDuration()
formatDate()
```

Pure display functions only.

---

# 67. Hooks Folder

```text
src/hooks/
├── useAuth.ts
└── useDebounce.ts
```

Feature-specific hooks can live inside the relevant feature instead.

Do not create a huge global hook folder unnecessarily.

---

# 68. Context Folder

```text
src/context/
└── AuthContext.tsx
```

Only global application state belongs here.

Do not make every trip detail global.

---

# 69. Types Folder

```text
src/types/
└── common.ts
```

Use for shared frontend-only types.

Feature API shapes should preferably live in their feature folder.

---

# 70. Assets Folder

```text
src/assets/
```

Use for:

- Logos
- Static icons not provided by library
- Local images

Do not dump arbitrary screenshots there without structure.

---

# 71. Frontend Environment

```text
apps/web/.env
```

Example:

```text
VITE_API_BASE_URL=http://localhost:4000/api
```

Commit:

```text
.env.example
```

not `.env`.

---

# 72. Frontend API Function Pattern

Instead of this inside a page:

```text
axios.get("http://localhost:4000/api/trips")
```

use:

```text
tripApi.getTrips()
```

which internally uses shared API client.

---

# 73. Why Feature API Files

Example:

```text
features/trips/trip.api.ts
```

contains:

```text
getTrips()
getTrip()
createTrip()
updateTrip()
deleteTrip()
```

This keeps route knowledge out of UI components.

---

# 74. Page Responsibility

A page should coordinate a screen.

Example:

```text
TripBuilderPage
```

may:

- Load trip
- Handle selected stop
- Open dialogs
- Call feature mutations

It should not contain all visual markup itself.

---

# 75. Component Responsibility

Components should be small enough to understand but not split into meaningless fragments.

Bad:

```text
TripNameText.tsx
TripDateText.tsx
TripIconWrapper.tsx
```

unless genuinely reusable.

Do not over-componentize.

---

# 76. Naming Convention — Backend

Files:

```text
trip.service.ts
trip.controller.ts
trip.routes.ts
trip.validation.ts
```

Use lowercase singular feature names.

---

# 77. Naming Convention — Frontend

React components:

```text
PascalCase.tsx
```

Examples:

```text
TripCard.tsx
CitySearchModal.tsx
BudgetSummary.tsx
```

---

# 78. Function Naming

Use descriptive verbs:

```text
createTrip()
getTripById()
updateTrip()
deleteTrip()

addStop()
reorderStops()

calculateTripBudget()
publishTrip()
copyPublicTrip()
```

Avoid vague names:

```text
handleData()
processThing()
doTrip()
```

---

# 79. Variable Naming

Use schema/API names consistently.

Locked:

```text
sequenceOrder
plannedBudget
transportCost
stayCost
mealCost
tripStopId
activityId
shareSlug
```

Do not introduce aliases such as:

```text
order
positionIndex
budgetAmount
stopID
```

without reason.

---

# 80. ID Naming

Use:

```text
tripId
stopId
cityId
activityId
itemId
userId
```

Frontend route params should use the same terminology.

---

# 81. Boolean Naming

Use prefixes:

```text
isLoading
isPublic
isOverBudget
hasError
```

Do not name booleans ambiguously:

```text
loadingState
publicValue
```

---

# 82. Shared vs Feature-Specific Rule

Put code in shared folder only if multiple unrelated modules genuinely need it.

Example shared:

```text
ownership.ts
dates.ts
api.ts
Button.tsx
```

Example feature-specific:

```text
calculateTripBudget()
CitySearchModal
TripForm
```

---

# 83. Do Not Create a Generic `helpers.ts`

Avoid:

```text
utils/helpers.ts
```

containing unrelated functions.

Prefer:

```text
utils/dates.ts
utils/slug.ts
utils/ownership.ts
```

---

# 84. Do Not Create a Generic Backend `common.service.ts`

Shared business logic should have a specific purpose.

Generic shared files become dumping grounds and create merge conflicts.

---

# 85. Backend Developer Ownership

Recommended split:

## Person A — Trip Core

Owns:

```text
modules/auth/
modules/trips/
modules/stops/
```

Primary shared responsibility:

```text
utils/ownership.ts
```

---

# 86. Person B — Itinerary Core

Owns:

```text
modules/cities/
modules/activities/
modules/itinerary/
modules/budget/
modules/sharing/
```

---

# 87. Shared Backend Files

Both developers must coordinate before changing:

```text
prisma/schema.prisma

src/app.ts

src/db/prisma.ts

src/middleware/

src/config/

src/utils/ownership.ts

package.json
```

Not because they are forbidden to edit, but because simultaneous edits can conflict.

---

# 88. Schema Coordination Rule

Before changing:

```text
prisma/schema.prisma
```

developer must:

1. Tell teammate.
2. Pull latest branch.
3. Make schema change.
4. Create migration.
5. Commit schema and migration together.

---

# 89. Route Registration Coordination

If both developers need `app.ts`, avoid repeated conflicts.

A simple pattern is to register one top-level router:

```text
src/routes.ts
```

or carefully group route registration.

Optional alternative:

```text
src/modules/index.ts
```

exports module routers.

For a two-person team, direct `app.ts` updates are still manageable if coordinated.

---

# 90. Package Installation Rule

Before installing a dependency ask:

> Does this solve a real requirement?

Do not add packages because they look useful.

Every dependency increases:

- Setup
- Bundle size
- Debugging
- Version risk

---

# 91. Documentation Structure

Final docs directory:

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

---

# 92. README Structure

Root README should remain short.

Recommended:

```text
# GlobeTrotter

Short description

## Stack

## Quick Start

## Repository Structure

## Documentation

See /docs/00_MASTER_INDEX.md
```

Do not paste entire PRD or schema into README.

---

# 93. Gitignored Files

Root `.gitignore` should cover:

```text
node_modules/
.env
dist/
coverage/
.DS_Store
*.log
```

Potential local uploads if used:

```text
uploads/
```

unless demo assets intentionally belong in Git.

---

# 94. Generated Files

Do not manually edit:

```text
node_modules/
dist/
Prisma generated client
```

Only source files belong in normal development changes.

---

# 95. Build Output

Frontend:

```text
apps/web/dist/
```

Backend compile output if used:

```text
apps/api/dist/
```

Neither should normally be committed.

---

# 96. Testing Structure

If tests are added:

Backend:

```text
modules/trips/
├── trip.service.ts
└── trip.service.test.ts
```

or centralized:

```text
tests/
```

Co-located tests are recommended for small feature modules.

---

# 97. Backend Test Naming

```text
*.test.ts
```

Example:

```text
budget.service.test.ts
ownership.test.ts
```

---

# 98. Frontend Test Naming

If used:

```text
TripCard.test.tsx
```

Testing is secondary to shipping the demo, but critical backend rules deserve coverage.

---

# 99. Imports

Prefer stable aliases if setup is easy.

Example:

```text
@/modules/trips
@/db/prisma
@/utils/ownership
```

But do not spend excessive time configuring aliases if relative imports are already manageable.

---

# 100. No Circular Imports

Avoid:

```text
trip.service
 ↓
budget.service
 ↓
trip.service
```

Derived modules may depend on trip data/service helpers, but architecture should stay directional.

---

# 101. Service-to-Service Calls

A service may call another service if it represents real domain reuse.

Example:

```text
sharing.service
 ↓
ownership helper
```

Avoid controllers calling controllers.

---

# 102. Prisma Calls

Prisma should usually appear inside:

```text
*.service.ts
```

Not:

```text
*.routes.ts
```

and preferably not directly inside frontend-facing controllers.

---

# 103. Example Backend Request Path

```text
trip.routes.ts
      ↓
trip.controller.ts
      ↓
trip.service.ts
      ↓
prisma.ts
      ↓
PostgreSQL
```

---

# 104. Example Frontend Request Path

```text
TripBuilderPage.tsx
       ↓
StopList.tsx
       ↓
stop.api.ts
       ↓
lib/api.ts
       ↓
Express API
```

---

# 105. Complete Repository Tree

```text
globe-trotter/
│
├── apps/
│   │
│   ├── api/
│   │   │
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.validation.ts
│   │   │   │   │   └── auth.types.ts
│   │   │   │   │
│   │   │   │   ├── trips/
│   │   │   │   ├── stops/
│   │   │   │   ├── cities/
│   │   │   │   ├── activities/
│   │   │   │   ├── itinerary/
│   │   │   │   ├── budget/
│   │   │   │   └── sharing/
│   │   │   │
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── error.middleware.ts
│   │   │   │   └── validation.middleware.ts
│   │   │   │
│   │   │   ├── db/
│   │   │   │   └── prisma.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── ownership.ts
│   │   │   │   ├── dates.ts
│   │   │   │   ├── slug.ts
│   │   │   │   └── async-handler.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   └── env.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   └── express.d.ts
│   │   │   │
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/
│       │
│       ├── src/
│       │   ├── pages/
│       │   │   ├── auth/
│       │   │   │   ├── LoginPage.tsx
│       │   │   │   └── SignupPage.tsx
│       │   │   │
│       │   │   ├── dashboard/
│       │   │   │   └── DashboardPage.tsx
│       │   │   │
│       │   │   ├── trips/
│       │   │   │   ├── TripsListPage.tsx
│       │   │   │   ├── CreateTripPage.tsx
│       │   │   │   ├── TripBuilderPage.tsx
│       │   │   │   ├── TripViewPage.tsx
│       │   │   │   ├── TripBudgetPage.tsx
│       │   │   │   └── TripCalendarPage.tsx
│       │   │   │
│       │   │   ├── public/
│       │   │   │   └── PublicTripPage.tsx
│       │   │   │
│       │   │   └── profile/
│       │   │       └── ProfilePage.tsx
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   ├── trips/
│       │   │   ├── stops/
│       │   │   ├── cities/
│       │   │   ├── activities/
│       │   │   ├── itinerary/
│       │   │   ├── budget/
│       │   │   └── sharing/
│       │   │
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   ├── layout/
│       │   │   └── feedback/
│       │   │
│       │   ├── routes/
│       │   │   ├── router.tsx
│       │   │   └── ProtectedRoute.tsx
│       │   │
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── auth-storage.ts
│       │   │   └── format.ts
│       │   │
│       │   ├── hooks/
│       │   │   ├── useAuth.ts
│       │   │   └── useDebounce.ts
│       │   │
│       │   ├── context/
│       │   │   └── AuthContext.tsx
│       │   │
│       │   ├── types/
│       │   │   └── common.ts
│       │   │
│       │   ├── assets/
│       │   │
│       │   ├── App.tsx
│       │   └── main.tsx
│       │
│       ├── public/
│       ├── .env
│       ├── .env.example
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
│
├── docs/
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── package.json
```

---

# 106. What We Intentionally Do Not Have

No backend:

```text
global controllers/
global routes/
global services/
```

No:

```text
repositories/
DAO/
microservices/
workers/
queues/
```

unless a future requirement actually needs them.

---

# 107. Folder Creation Rule

Do not create every possible empty file on day one.

Create the required skeleton first, then add files as features begin.

The structure is a convention, not an excuse to create dozens of empty files.

---

# 108. Source-of-Truth Rule

If a developer is unsure where code belongs:

### Ask:

Does this code belong to one product feature?

If yes:

```text
modules/<feature>/
```

or frontend:

```text
features/<feature>/
```

Does it genuinely apply across multiple unrelated features?

If yes:

```text
utils/
middleware/
components/ui/
lib/
```

---

# 109. Final Project Structure Principle

> Features own their own logic; shared folders contain only truly shared infrastructure.

This keeps GlobeTrotter understandable during a fast hackathon and minimizes merge conflicts between teammates.

This project structure is considered **locked for the GlobeTrotter MVP**.