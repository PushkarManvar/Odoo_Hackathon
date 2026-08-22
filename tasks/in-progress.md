# In Progress — claimed tasks

Only one owner per task. No duplicate work.

## Team (owner IDs)
| Owner ID | GitHub |
|----------|--------|
| Pushkar | @PushkarManvar |
| khatikbhagya-cmd | @khatikbhagya-cmd |
| Nishant3634 | @Nishant3634 |
| preetgohilofficial | @preetgohilofficial |

Use these exact IDs in the Owner column. Full roster: `docs/team.md`.

| Task | Owner | Branch | Status | Notes |
|------|-------|--------|--------|-------|
| Monorepo scaffold (root + apps/api + apps/web + Prisma) | Pushkar | feat/scaffold | merged | Per SKELETON_TEMPLATE.md |
| Auth module (signup/login/me) | Pushkar | feat/auth | merged | Person A — Trip Core |
| Trips CRUD | Pushkar | feat/trips | merged | Person A — Trip Core |
| Stops CRUD | Pushkar | feat/stops | in progress | Person A — Trip Core |
| Onboarding setup (C-0) | preetgohilofficial | feat/onboarding-preetgohilofficial | done | Setup checklist §51 verified: npm install, lint, typecheck, build, prisma generate all green |
| Router route table (C-1) | preetgohilofficial | feat/web-router | merged | router.tsx with all locked routes as placeholders |
| City + activity discovery (B-1) | Nishant3634 | feat/city-discovery | merged | Cities + Activities modules, seed data |
| Itinerary module (B-3) | Nishant3634 | feat/itinerary | merged | Person B — item CRUD + validation |
| Budget module (B-4) | Nishant3634 | feat/budget | merged | Person B — derived budget calculation |
| Sharing module (B-5) | Nishant3634 | feat/sharing | in progress | Person B — publish, public view, copy trip |
| DS-1 Apply design tokens (tokens.css + fonts) | preetgohilofficial | feat/ds-1-design-tokens | merged | Per DESIGN.md — must merge before any screen task |
| DS-2 UI primitives (Button/Input/Card/Modal/Badge) | preetgohilofficial | (claim) | allotted | Depends on DS-1 |
| C-2 Login/Signup, C-3 Dashboard, C-4 MyTrips, C-5 NewTrip, C-6 TripPage | preetgohilofficial | (claim) | allotted | Depends on DS-2. See backlog for Stitch screen mapping |
| D-1 Itinerary, D-2 Builder, D-3 Calendar, D-4 Public, D-5 ActivitySearch, D-6 Profile | khatikbhagya-cmd | (claim) | allotted | Depends on DS-2. See backlog for Stitch screen mapping |
| D-1 ItineraryPage | khatikbhagya-cmd | feat/task-d1 | in progress | Mock data per API contract, Stitch itinerary_view_neo_brutalist_style |

*Move completed tasks to `completed.md`.*