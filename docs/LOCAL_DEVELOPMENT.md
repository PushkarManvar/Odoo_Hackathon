# GlobeTrotter — Local Development Setup

## 1. Purpose

This document defines the standard local development environment for GlobeTrotter.

Every developer should use the same setup so that:

- The frontend runs on the same port
- The backend runs on the same port
- PostgreSQL runs consistently
- Prisma migrations behave the same
- Environment variables use the same names
- Setup problems are easier to debug
- Both developers can run each other's code without manual changes

The final local architecture is:

```text
Frontend  → http://localhost:5173
Backend   → http://localhost:4000
Postgres  → localhost:5432
```

---

# 2. Required Software

Install the following before starting development:

- Node.js
- npm
- Git
- Docker
- Docker Compose
- VS Code or another editor

PostgreSQL does **not** need to be installed directly on the computer because PostgreSQL runs through Docker.

---

# 3. Recommended Node Version

Use a modern LTS version of Node.js.

Recommended:

```text
Node.js 20+
```

Check Node:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Both developers should use compatible Node versions.

---

# 4. Verify Git

Check Git installation:

```bash
git --version
```

Clone the repository:

```bash
git clone <repository-url>
```

Then:

```bash
cd globe-trotter
```

---

# 5. Project Structure

Expected root structure:

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
├── .gitignore
└── README.md
```

Frontend:

```text
apps/web
```

Backend:

```text
apps/api
```

---

# 6. Local Ports

The project uses fixed local ports.

| Service | Port |
|---|---:|
| Frontend | 5173 |
| Backend | 4000 |
| PostgreSQL | 5432 |

Architecture:

```text
Browser
   ↓
localhost:5173
   ↓
React + Vite
   ↓
localhost:4000
   ↓
Express API
   ↓
localhost:5432
   ↓
PostgreSQL
```

Do not randomly change these ports unless the team agrees.

---

# 7. PostgreSQL Through Docker

PostgreSQL runs inside Docker.

The root project contains:

```text
docker-compose.yml
```

Conceptual configuration:

```yaml
services:
  postgres:
    image: postgres
    ports:
      - "5432:5432"
```

The actual Docker configuration in the repository is the implementation source of truth.

---

# 8. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

This starts PostgreSQL in the background.

Check running containers:

```bash
docker ps
```

You should see the GlobeTrotter PostgreSQL container.

---

# 9. Stop PostgreSQL

To stop the services:

```bash
docker compose down
```

This stops the container without intentionally deleting the database volume.

---

# 10. Database Persistence

PostgreSQL should use a Docker volume.

Conceptually:

```text
PostgreSQL Container
        ↓
Docker Volume
        ↓
Persistent Local Data
```

This prevents local data from disappearing every time the container restarts.

---

# 11. Environment Variables

The backend requires environment variables.

Backend environment file:

```text
apps/api/.env
```

Do not commit this file.

The project should instead include:

```text
apps/api/.env.example
```

---

# 12. Backend `.env`

Minimum expected variables:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"

PORT=4000

JWT_SECRET=<your-local-secret>
```

The exact database username, password, and database name should match `docker-compose.yml`.

---

# 13. Example Local Database Configuration

A typical local setup may conceptually use:

```text
Database Host:
localhost

Database Port:
5432

Database:
globetrotter

User:
postgres
```

The actual credentials must match the repository's Docker configuration.

Do not create different credentials independently between developers.

---

# 14. JWT Secret

Each developer needs a local JWT secret.

Example format:

```env
JWT_SECRET=some-long-random-development-secret
```

Do not hardcode the JWT secret inside source code.

Do not commit real secrets to Git.

---

# 15. Environment Example File

The repository should provide something similar to:

```env
DATABASE_URL=
PORT=4000
JWT_SECRET=
```

in:

```text
.env.example
```

When setting up the project:

```bash
cp .env.example .env
```

On Windows, manually copy the file if necessary.

Then fill in the local values.

---

# 16. Frontend Environment Variables

If the frontend needs the backend URL, use a Vite environment variable.

Example:

```env
VITE_API_URL=http://localhost:4000
```

Frontend environment file:

```text
apps/web/.env
```

Frontend code can access it through:

```ts
import.meta.env.VITE_API_URL
```

Do not hardcode backend URLs throughout components.

---

# 17. Install Dependencies

From the project root, install dependencies according to the repository setup.

If the project uses root-level npm workspaces:

```bash
npm install
```

If each app manages dependencies independently:

```bash
cd apps/api
npm install
```

and:

```bash
cd ../web
npm install
```

The repository `package.json` determines the final command.

---

# 18. Backend Setup

Navigate to:

```bash
cd apps/api
```

Install dependencies if required:

```bash
npm install
```

Confirm `.env` exists.

Then prepare Prisma.

---

# 19. Prisma Client Generation

Run:

```bash
npx prisma generate
```

This generates the Prisma Client based on:

```text
prisma/schema.prisma
```

Run this after:

- Initial setup
- Pulling schema changes
- Changing Prisma models
- Installing dependencies from scratch

---

# 20. Prisma Migration Setup

After PostgreSQL is running:

```bash
npx prisma migrate dev
```

This applies development migrations.

If creating a new migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Example:

```bash
npx prisma migrate dev --name add-trip-visibility
```

Migration names should describe the actual schema change.

---

# 21. Migration Rule

Never delete or rewrite another developer's migration casually.

Before creating a migration:

```text
1. Pull latest code
2. Confirm PostgreSQL is running
3. Check schema.prisma
4. Confirm teammate is not creating a migration
5. Make schema change
6. Create migration
7. Test migration
8. Commit schema + migration together
```

This follows the coordination rules defined in `TEAM_WORK_SPLIT.md`.

---

# 22. Reset Development Database

If the local database becomes inconsistent during development:

```bash
npx prisma migrate reset
```

This resets the development database.

It generally:

```text
Deletes current local data
        ↓
Recreates schema
        ↓
Applies migrations
        ↓
Runs seed if configured
```

Use this only for local development.

Do not run it against production data.

---

# 23. Prisma Studio

To inspect the database visually:

```bash
npx prisma studio
```

Prisma Studio allows developers to inspect:

- Users
- Trips
- Cities
- Stops
- Activities
- Itinerary items

It is useful for debugging during the hackathon.

---

# 24. Seed Data

After migrations are ready, populate local demo/reference data.

Expected command:

```bash
npx prisma db seed
```

Seed behavior is defined in:

```text
SEED_DATA.md
```

Typical seed data includes:

- Cities
- Activities
- Categories
- Demo users
- Demo trips

---

# 25. Seed Data Rule

Seed scripts should be safe for development.

Do not manually add required reference data separately on each developer's computer.

Example:

```text
BAD

Developer A manually adds Jaipur
Developer B manually adds Mumbai
```

Instead:

```text
GOOD

Seed script
   ↓
Both databases receive
same cities and activities
```

---

# 26. Start Backend

From:

```text
apps/api
```

Run the development command defined in `package.json`.

Typical command:

```bash
npm run dev
```

Expected backend:

```text
http://localhost:4000
```

---

# 27. Backend Startup Validation

When the backend starts, verify:

```text
Server running
Database connected
Environment variables loaded
No Prisma errors
Port 4000 available
```

A startup failure should be fixed before frontend integration.

---

# 28. Backend Health Check

If a health endpoint exists, test:

```text
GET /health
```

Expected conceptual response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

The exact endpoint should follow the implemented API contract.

---

# 29. Start Frontend

Open another terminal.

Navigate to:

```bash
cd apps/web
```

Run:

```bash
npm run dev
```

Expected Vite server:

```text
http://localhost:5173
```

Open this URL in the browser.

---

# 30. Frontend API Connection

Frontend requests should use:

```text
VITE_API_URL
```

Example conceptual API client:

```text
Base URL
   ↓
http://localhost:4000
```

Do not write:

```text
http://localhost:4000
```

manually inside every page or component.

Keep the base URL centralized.

---

# 31. CORS Setup

During local development:

```text
Frontend:
http://localhost:5173
```

must be allowed to call:

```text
Backend:
http://localhost:4000
```

The Express backend should configure CORS accordingly.

Conceptually:

```text
Allowed Origin:
http://localhost:5173
```

Do not use unnecessarily broad production CORS settings just to solve a local issue.

---

# 32. Complete Local Startup Order

Recommended startup sequence:

```text
1. Pull latest code
        ↓
2. Start Docker/PostgreSQL
        ↓
3. Install dependencies if needed
        ↓
4. Check .env
        ↓
5. Run Prisma generate
        ↓
6. Apply migrations
        ↓
7. Seed database if needed
        ↓
8. Start backend
        ↓
9. Start frontend
        ↓
10. Test main flow
```

---

# 33. Standard Daily Startup

After the initial setup, normal startup should be simpler.

Terminal 1:

```bash
docker compose up -d
```

Terminal 2:

```bash
cd apps/api
npm run dev
```

Terminal 3:

```bash
cd apps/web
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 34. After Pulling Teammate Changes

After:

```bash
git pull
```

check what changed.

If `package.json` changed:

```bash
npm install
```

If Prisma schema changed:

```bash
npx prisma generate
```

If new migrations were added:

```bash
npx prisma migrate dev
```

If seed data changed:

```bash
npx prisma db seed
```

Do not assume the application can run immediately after every pull.

---

# 35. Recommended Pull Routine

```text
git pull
   ↓
package files changed?
   ↓ YES
npm install
   ↓
Prisma changed?
   ↓ YES
prisma generate
   ↓
Migration added?
   ↓ YES
prisma migrate dev
   ↓
Start application
```

---

# 36. Environment File Git Rules

Must be ignored:

```text
.env
.env.local
.env.*.local
```

Must be committed:

```text
.env.example
```

Never commit:

- Passwords
- JWT secrets
- Database credentials intended for production
- API keys

---

# 37. `.gitignore`

The repository should ignore at minimum:

```text
node_modules/
.env
dist/
coverage/
```

and relevant generated/cache files.

Prisma migration files should **not** be ignored.

---

# 38. Docker Troubleshooting

## PostgreSQL container not starting

Check:

```bash
docker ps -a
```

Then inspect container logs:

```bash
docker compose logs
```

Common causes:

- Port 5432 already in use
- Docker Desktop not running
- Invalid environment variables
- Existing conflicting PostgreSQL container

---

# 39. Port 5432 Already in Use

If another PostgreSQL installation is already using:

```text
5432
```

either:

- Stop the other PostgreSQL service
- Stop the conflicting container

Prefer keeping GlobeTrotter on the documented port instead of changing ports independently.

---

# 40. Port 4000 Already in Use

If backend fails because:

```text
4000
```

is occupied, identify and stop the conflicting process.

Do not silently change the project to another port unless both developers update the agreed configuration.

---

# 41. Port 5173 Already in Use

Vite may automatically attempt another port.

For GlobeTrotter development, avoid relying on a random fallback port because CORS and environment settings expect:

```text
5173
```

Stop the conflicting Vite process and restart GlobeTrotter.

---

# 42. Prisma Cannot Reach Database

Typical error:

```text
Cannot reach database server
```

Check:

```text
Is Docker running?
        ↓
Is PostgreSQL container running?
        ↓
Is port 5432 correct?
        ↓
Does DATABASE_URL match Docker credentials?
        ↓
Is database name correct?
```

---

# 43. Prisma Client Error

If Prisma reports generated-client problems:

```bash
npx prisma generate
```

Then restart the backend.

---

# 44. Migration Conflict

If migrations conflict after pulling teammate changes:

Do not immediately delete migrations.

First:

```text
1. Stop making schema changes
2. Compare schema.prisma
3. Check Git history
4. Identify migration order
5. Coordinate with teammate
```

The safest solution during a hackathon is usually to agree on one canonical migration history rather than allowing both developers to force independent versions.

---

# 45. Database Schema Source of Truth

The intended database model is defined in:

```text
DATABASE_SCHEMA.md
```

The executable implementation exists in:

```text
prisma/schema.prisma
```

If they differ accidentally:

```text
Check documentation
        ↓
Determine intended model
        ↓
Fix implementation/documentation intentionally
```

Do not silently create a third version.

---

# 46. API Testing

Backend endpoints can be tested before frontend integration using:

- Postman
- Bruno
- Thunder Client
- curl

Example:

```bash
curl http://localhost:4000/health
```

For protected APIs:

```text
Login
  ↓
Get JWT
  ↓
Send Authorization header
```

Conceptually:

```text
Authorization: Bearer <token>
```

---

# 47. Authentication Testing

Recommended local authentication test:

```text
Signup
 ↓
Receive token
 ↓
Create Trip
 ↓
Request succeeds
```

Then test invalid access:

```text
No token
 ↓
Protected endpoint
 ↓
401
```

Ownership test:

```text
User A creates Trip
        ↓
User B attempts edit
        ↓
Request rejected
```

---

# 48. Local Demo Accounts

Demo accounts should be created through the seed strategy defined in:

```text
SEED_DATA.md
```

Avoid everyone inventing different credentials unless necessary.

This allows the demo to remain reproducible.

---

# 49. Local Development Data Flow

```text
React
  │
  │ HTTP
  ▼
Express
  │
  │ Prisma Client
  ▼
PostgreSQL
```

Expanded:

```text
Browser
   ↓
React :5173
   ↓
API Request
   ↓
Express :4000
   ↓
Validation
   ↓
Authentication
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL :5432
```

---

# 50. Suggested Terminal Layout

During development:

```text
Terminal 1
Docker / database

Terminal 2
Backend

Terminal 3
Frontend

Terminal 4
Git / Prisma / testing
```

This makes debugging easier because frontend and backend logs remain visible separately.

---

# 51. Initial Setup Checklist (per member, one time)

Every team member runs this once on their machine. Copy-paste each command.

```bash
# 1. Clone + enter
git clone https://github.com/PushkarManvar/Odoo_Hackathon.git
cd Odoo_Hackathon

# 2. Install Docker Desktop first (https://docs.docker.com/get-docker/)
#    then start PostgreSQL
docker compose up -d

# 3. Install dependencies (hoisted to root node_modules)
npm install

# 4. Create env files (never commit these)
#    root .env -> copy from .env.example
#    apps/api/.env -> copy from apps/api/.env.example, set DATABASE_URL + JWT_SECRET
#    apps/web/.env -> copy from apps/web/.env.example
#    (or use native Postgres instead of Docker — see section 7)

# 5. Generate Prisma client + apply migrations + seed
cd apps/api
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ..

# 6. Verify all checks green
npm run build
npm run lint
npm run typecheck
npm run test

# 7. Start apps
cd apps/api && npm run dev      # backend on :4000
cd apps/web && npm run dev      # frontend on :5173

# 8. Verify backend
curl http://localhost:4000/health
```

Checklist form:

- [ ] Clone repository
- [ ] Install Docker Desktop
- [ ] Start PostgreSQL (`docker compose up -d`)
- [ ] Run `npm install`
- [ ] Copy + configure all three `.env` files
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev`
- [ ] Run `npx prisma db seed`
- [ ] Run build/lint/typecheck/test (all green)
- [ ] Start backend + frontend
- [ ] Verify `curl http://localhost:4000/health`
- [ ] Test authentication
- [ ] Test trip creation

---

# 52. Daily Development Checklist

- [ ] Pull latest `develop`
- [ ] Check teammate updates
- [ ] Start Docker
- [ ] Apply new migrations
- [ ] Regenerate Prisma if needed
- [ ] Install dependency changes
- [ ] Start backend
- [ ] Start frontend
- [ ] Work only on claimed feature
- [ ] Test before commit
- [ ] Push feature branch

---

# 53. Before Pushing

Run basic checks.

Frontend:

```bash
npm run build
```

Backend:

Run any configured:

```bash
npm run build
```

or:

```bash
npm test
```

depending on package scripts.

Also verify:

```text
No .env committed
No broken imports
No TypeScript errors
No forgotten debug code
No accidental Prisma schema changes
```

---

# 54. Fresh Machine Setup Test

Before the final hackathon demo, ideally verify the project can be started from a clean environment using only:

```text
Repository
+
Docker
+
.env configuration
```

The expected setup should be:

```text
Clone
 ↓
Install
 ↓
Docker Up
 ↓
Migrate
 ↓
Seed
 ↓
Run Backend
 ↓
Run Frontend
```

If undocumented manual database steps are required, the local setup is incomplete.

---

# 55. Hackathon Recovery Procedure

If the local database breaks close to the demo:

```text
Stop application
      ↓
Confirm latest code
      ↓
docker compose up -d
      ↓
prisma migrate reset
      ↓
seed database
      ↓
restart backend
      ↓
restart frontend
      ↓
verify demo flow
```

Use this only when losing current local data is acceptable.

---

# 56. Final Local Architecture

```text
┌─────────────────────────────┐
│          Browser            │
│                             │
│   http://localhost:5173     │
└──────────────┬──────────────┘
               │
               │ HTTP / REST
               ▼
┌─────────────────────────────┐
│        React + Vite         │
│          Frontend           │
│           :5173             │
└──────────────┬──────────────┘
               │
               │ API requests
               ▼
┌─────────────────────────────┐
│      Node + Express API     │
│           :4000             │
└──────────────┬──────────────┘
               │
               │ Prisma
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│      Docker Container       │
│           :5432             │
└─────────────────────────────┘
```

---

# 57. Final Rule

The goal of local development setup is:

```text
Same Code
+
Same Ports
+
Same Database Schema
+
Same Environment Structure
+
Same Seed Data
=
Same Application Behavior
```

If one developer needs undocumented machine-specific steps for GlobeTrotter to work, those steps should either be removed or documented here.

Local setup should remain reproducible throughout the hackathon.