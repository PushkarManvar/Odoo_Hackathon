# Local Database Setup — PostgreSQL

Decision DEC-003: the team uses **local PostgreSQL**. No cloud DB required.

## Requirements
- PostgreSQL 17 (recommended; 15+ fine)
- psql CLI (ships with PostgreSQL)

## Connection
| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Database | `postgres` (create a project-specific DB once the idea is decided) |

Connection string:
```
postgresql://postgres:<PASSWORD>@localhost:5432/postgres
```

> **Never commit the real password.** Copy `.env.example` to `.env`, fill in your
> local password, and keep `.env` out of git (it is gitignored).

## Verify it works
```bash
psql -U postgres -h localhost -c "select version();"
```

## If Postgres is not installed
Option A — native install: download from postgresql.org, install, note the
password you set during install.

Option B — Docker (same Postgres, no install):
```bash
docker run --name pg -e POSTGRES_PASSWORD=<your-password> -p 5432:5432 -d postgres:17
```

## Team notes
- Everyone runs their own local Postgres with the **same schema** (migrations
  go in the repo, applied by each member).
- Schema changes land via PR + migration file, so all four databases stay in sync.
- Supabase MCP remains connected as a fallback; primary is local Postgres.