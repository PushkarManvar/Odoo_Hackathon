# Globe_Trotter

Globe_Trotter is a personalized, empowering, and collaborative travel planning platform. It lets users build multi-city itineraries, budget trips, discover activities, and share travel plans — built by a multi-developer / multi-AI team. This repo enforces a PR + merge workflow so every contributor (human or AI) follows the same rules.

**New to the team?** Read `AGENTS.md` first, then `docs/team-onboarding.md`.

## Stack

- Frontend: React + Vite + TypeScript, React Router
- Backend: Node.js + Express + TypeScript, REST/JSON API
- ORM: Prisma
- Database: PostgreSQL 17 (Docker Compose locally — see `docs/database.md`)
- Auth: JWT + bcrypt password hashing
- Validation: Zod
- Package manager: npm (monorepo)
- Deployment: Local demo (hackathon MVP)

See `docs/GlobeTrotter — Technology Stack & Engineering Decisions.md` for the full rationale.

## Team workflow (short version)

1. Read `AGENTS.md` + `docs/team-onboarding.md` + `docs/current-state.md` + `tasks/in-progress.md`.
2. Work is tracked in `tasks/` with owner stamps — no duplicate work.
3. Work on `feat/task-XXX`, push, open PR to `main`, get review + green CI, then merge.
4. Never work directly on `main`.
5. If a session ends mid-task, write a handoff to `tasks/handoffs/`.
6. The repo is the single source of truth. No important context lives only in a private chat.

## CI

GitHub Actions `.github/workflows/ci.yml` — lint + typecheck + build (PR + push to main). `main` is branch-protected: PR required, 1+ approval, CI must pass, branches up to date.

## Repo layout

```
AGENTS.md        AI/human contract — READ FIRST
README.md        this file
docs/            onboarding, current-state, decisions, limitations, roadmap, tech-stack, DB schema, API contract
tasks/           backlog / in-progress / completed / handoffs
.github/workflows/  CI workflow
apps/web/        frontend app (React + Vite + TypeScript)
apps/api/        backend app (Node.js + Express + TypeScript + Prisma)
```
