# GlobeTrotter — Git Workflow

## 1. Purpose

This document defines how the GlobeTrotter team uses Git and GitHub during the hackathon.

The goal is to:

- Avoid broken shared branches
- Reduce merge conflicts
- Keep feature ownership clear
- Make rollback easier
- Keep Prisma migrations safe
- Prevent accidental overwrites
- Make integration predictable

The workflow is intentionally simple.

The team uses:

```text
main
develop
feature/*
```

---

# 2. Branch Model

## `main`

`main` contains the most stable version of GlobeTrotter.

It should represent:

```text
Demo-safe
+
Integrated
+
Working
```

Do not develop directly on `main`.

---

## `develop`

`develop` is the shared integration branch.

Feature branches are merged into:

```text
develop
```

after they are tested.

Once `develop` is stable enough for the demo, it can be merged into:

```text
main
```

---

## `feature/*`

All normal development happens in feature branches.

Examples:

```text
feature/auth
feature/trips
feature/stops
feature/cities
feature/activities
feature/itinerary
feature/budget
feature/sharing
```

Use separate branches for large isolated features.

---

# 3. Branch Flow

```text
main
  ↑
develop
  ↑
feature/*
```

Normal sequence:

```text
develop
   ↓
create feature branch
   ↓
implement
   ↓
test
   ↓
pull latest develop
   ↓
resolve conflicts
   ↓
merge into develop
```

Later:

```text
develop
   ↓
final integration testing
   ↓
main
```

---

# 4. Never Develop Directly on `main`

Avoid:

```bash
git checkout main
# make changes
git commit
git push
```

Normal development belongs on:

```text
feature/*
```

The only changes merged into `main` should be deliberate stable integration points.

---

# 5. Avoid Direct Development on `develop`

Prefer not to write feature code directly on `develop`.

`develop` exists primarily for integration.

Direct changes may be acceptable only for very small shared fixes such as:

```text
tiny configuration correction
broken import after merge
small documentation fix
```

but feature implementation should remain on feature branches.

---

# 6. Create Feature Branch

Before creating a new feature branch:

```bash
git checkout develop
git pull origin develop
```

Then:

```bash
git checkout -b feature/<feature-name>
```

Example:

```bash
git checkout -b feature/trips
```

---

# 7. Branch Naming Convention

Use lowercase names with hyphens where needed.

Preferred:

```text
feature/auth
feature/trips
feature/stop-reorder
feature/activity-search
feature/public-sharing
feature/copy-trip
```

Avoid:

```text
mybranch
nishant-new
final-final
test123
branch2
```

Branch names should describe the work.

---

# 8. Optional Bug-Fix Branches

For isolated fixes, the team may use:

```text
fix/<name>
```

Examples:

```text
fix/budget-total
fix/stop-date-validation
fix/public-trip-access
```

For a small two-person hackathon team, keeping everything under `feature/*` is also acceptable if consistency is easier.

The important rule is clarity.

---

# 9. Feature Ownership

Branch ownership should align with `TEAM_WORK_SPLIT.md`.

Example:

```text
Person A

feature/auth
feature/trips
feature/stops
```

Person B:

```text
feature/cities
feature/activities
feature/itinerary
feature/budget
feature/sharing
```

This reduces overlapping edits.

---

# 10. One Feature Branch at a Time

Avoid keeping many unfinished long-lived branches.

Preferred:

```text
Start feature
   ↓
Complete usable slice
   ↓
Test
   ↓
Merge
   ↓
Start next
```

instead of:

```text
feature/auth
feature/trips
feature/stops
feature/random
```

all remaining incomplete for hours.

---

# 11. Pull Before Starting Work

At the beginning of a work session:

```bash
git checkout develop
git pull origin develop
```

Then create or update your feature branch.

This reduces later conflicts.

---

# 12. Keep Feature Branch Updated

Before merging:

```bash
git checkout feature/<name>
git fetch origin
git merge origin/develop
```

or use the team's agreed rebase strategy if explicitly chosen.

For this project, normal merging is simpler and safer during the hackathon.

Do not mix merge and rebase strategies randomly.

---

# 13. Recommended Merge Strategy

Use normal merges for the hackathon.

Reason:

```text
Simple
+
Low risk
+
Easy to understand
```

The team does not need a complicated history-rewriting workflow.

---

# 14. Commit Frequently

Commit logical progress.

Good examples:

```text
feat: add trip creation endpoint
feat: add JWT auth middleware
fix: reject stop dates outside trip
feat: add activity city filter
```

Avoid one enormous commit containing hours of unrelated work.

---

# 15. Commit Message Convention

Recommended format:

```text
type: short description
```

Useful types:

```text
feat
fix
docs
refactor
test
chore
```

Examples:

```text
feat: add trip ownership helper

fix: prevent itinerary outside stop dates

docs: update API contract for sharing

test: add ownership integration cases

chore: configure docker postgres
```

---

# 16. Commit Message Rules

Commit messages should explain what changed.

GOOD:

```text
feat: add stop reorder endpoint
```

BAD:

```text
changes
```

BAD:

```text
done
```

BAD:

```text
final
```

BAD:

```text
asdf
```

Clear commits make debugging much easier.

---

# 17. Keep Commits Focused

Prefer:

```text
Commit 1
Add trip service

Commit 2
Add trip validation

Commit 3
Add trip routes
```

over:

```text
One commit:
Trip endpoint
UI changes
seed updates
random README edits
```

unless those changes form one inseparable unit.

---

# 18. Check Git Status Often

Use:

```bash
git status
```

before:

- Starting work
- Switching branches
- Pulling
- Committing
- Merging

This prevents accidentally leaving local changes behind.

---

# 19. Review Changes Before Commit

Use:

```bash
git diff
```

and:

```bash
git status
```

before committing.

Check for:

```text
Accidental debug code
.env
Unrelated files
Generated junk
Unexpected Prisma changes
```

---

# 20. Never Commit `.env`

Do not commit:

```text
.env
.env.local
```

Only commit:

```text
.env.example
```

Secrets must remain outside Git.

---

# 21. Never Commit Secrets

Do not commit:

```text
JWT secrets
database production credentials
API keys
personal passwords
access tokens
```

If a secret is accidentally pushed, do not simply delete the file in a later commit and assume the problem is solved.

Treat the secret as exposed and replace it.

---

# 22. `node_modules` Must Not Be Committed

Ensure:

```text
node_modules/
```

is inside `.gitignore`.

Dependencies should be recreated using:

```bash
npm install
```

---

# 23. Build Files

Generated build output such as:

```text
dist/
```

should usually remain ignored unless deployment specifically requires otherwise.

Source code should remain the primary tracked artifact.

---

# 24. Prisma Migration Files Must Be Committed

Unlike `node_modules`, Prisma migrations are part of the project history.

Commit:

```text
prisma/migrations/
```

along with:

```text
schema.prisma
```

when a migration is created.

---

# 25. Schema + Migration Rule

Never push:

```text
schema.prisma changed
```

without its required migration when a migration is needed.

Preferred commit:

```text
schema.prisma
+
new migration directory
```

together.

---

# 26. Prisma Coordination

`schema.prisma` is a shared high-risk file.

Before editing it:

```text
Tell teammate
   ↓
Confirm they are not editing it
   ↓
Pull latest develop
   ↓
Make change
   ↓
Create migration
   ↓
Test
   ↓
Commit
   ↓
Push
```

Only one person should perform schema migration work at a time.

---

# 27. Never Create Parallel Prisma Migrations Blindly

Avoid:

```text
Person A
creates migration from schema state X

while

Person B
creates another migration from schema state X
```

Then both attempt to merge.

This frequently creates:

```text
Migration order problems
Schema drift
Merge conflicts
Broken fresh setup
```

---

# 28. Migration Ownership

The developer whose feature requires the database change generally creates the migration.

Example:

```text
Person A
adds Trip field
→ Person A creates migration
```

Example:

```text
Person B
adds itinerary field
→ Person B creates migration
```

But coordination is mandatory.

---

# 29. Before Creating Migration

Run:

```bash
git status
git pull
```

Then check:

```text
Latest schema?
Latest migrations?
Teammate currently modifying Prisma?
```

Only proceed when safe.

---

# 30. Migration Naming

Use meaningful names.

GOOD:

```bash
npx prisma migrate dev --name add-trip-visibility
```

GOOD:

```bash
npx prisma migrate dev --name add-itinerary-cost
```

Avoid:

```text
update
change
new
migration2
test
```

---

# 31. Migration Commit Example

```text
feat: add trip visibility

Files:
- prisma/schema.prisma
- prisma/migrations/...
- affected trip module
```

Keeping related schema and feature code together can make the change easier to understand.

---

# 32. After Pulling New Migration

If teammate adds migration:

```bash
git pull origin develop
```

then:

```bash
npx prisma migrate dev
npx prisma generate
```

if required by the current setup.

Do not manually recreate their migration.

---

# 33. Migration Conflict Rule

If a migration conflict appears:

```text
STOP
```

Do not immediately:

```text
delete teammate migration
rename migration folders randomly
edit migration SQL blindly
```

Instead:

```text
Compare both schema changes
      ↓
Determine correct final schema
      ↓
Agree on migration order
      ↓
Use one canonical migration history
```

---

# 34. Fresh Migration Test

After resolving migration changes, test:

```text
fresh database
   ↓
apply all migrations
   ↓
seed
```

If this fails, the migration history is not safe.

---

# 35. Shared Files

High-conflict files include:

```text
prisma/schema.prisma
package.json
package-lock.json
docker-compose.yml
app.ts
server.ts
.env.example
shared middleware
shared utilities
```

Coordinate before making large edits.

---

# 36. Package Dependency Rule

When adding a dependency:

```bash
npm install <package>
```

commit the relevant:

```text
package.json
package-lock.json
```

Do not manually edit only `package.json` and forget the lockfile.

---

# 37. Dependency Coordination

Before introducing a major new library, check whether the project already has an equivalent dependency.

Avoid unnecessary duplication such as:

```text
Axios
+
another HTTP client
```

or:

```text
multiple validation libraries
```

Technology decisions are governed by `TECH_STACK.md`.

---

# 38. Pull Request Use

If the team is using GitHub pull requests, each feature branch should preferably merge through a PR.

A PR should briefly state:

```text
What changed
How it was tested
Any shared files touched
Any migration included
```

For a two-person hackathon team, PR descriptions can remain short.

---

# 39. Example Pull Request

```text
Title:
Add Trip CRUD

Changes:
- create/list/read/update/delete trips
- ownership enforcement
- trip date validation

Tested:
- User A CRUD
- User B denied access
- invalid trip dates rejected

Shared changes:
None

Migration:
None
```

---

# 40. Review Rule

The other teammate should quickly review changes that affect:

```text
Shared architecture
Database schema
API contract
Ownership
Cross-feature logic
```

Tiny isolated feature changes may need lighter review due to hackathon speed.

---

# 41. Do Not Merge Broken Code

Before merging into `develop`:

- App starts
- Feature happy path works
- Important failure path works
- TypeScript/build is not broken
- API contract is followed
- Migration state is valid

`develop` should remain usable.

---

# 42. Pre-Merge Checklist

Before merging:

```text
1. git status
2. commit current work
3. fetch latest
4. merge latest develop into feature
5. resolve conflicts
6. run app
7. test feature
8. check build
9. push feature branch
10. merge/PR into develop
```

---

# 43. Conflict Resolution Rule

Never resolve conflicts by automatically choosing:

```text
Accept Current
```

or:

```text
Accept Incoming
```

without understanding both sides.

Read the conflicting code and reconstruct the intended combined version.

---

# 44. Conflict Ownership

If conflict occurs inside:

```text
Person A-owned feature
```

Person A should usually determine correct feature behavior.

If conflict occurs inside:

```text
Person B-owned feature
```

Person B should usually determine correct behavior.

For shared files:

```text
Both coordinate.
```

---

# 45. API Contract Conflict

If two implementations conflict over endpoint design:

Do not decide based on whose code is newer.

Check:

```text
API_CONTRACT.md
```

The documented contract wins unless the team intentionally changes it.

---

# 46. Database Conflict

If two code versions assume different fields:

Check:

```text
DATABASE_SCHEMA.md
```

Do not preserve both incompatible assumptions.

---

# 47. Business Logic Conflict

If two implementations behave differently:

Check:

```text
BUSINESS_RULES.md
```

The feature-specific source of truth determines the correct behavior.

---

# 48. Ownership Conflict

If authorization behavior differs:

Check:

```text
AUTH_AND_AUTHORIZATION.md
```

and use the shared:

```text
assertTripOwnership()
```

logic.

---

# 49. Do Not Force Push Shared Branches

Avoid:

```bash
git push --force
```

on:

```text
main
develop
```

Force pushing shared branches can erase teammate history.

---

# 50. Force Push on Feature Branch

Even on personal feature branches, avoid force push unless you understand why it is needed.

Normal hackathon workflow rarely requires it.

---

# 51. Never Reset Shared Branch Without Coordination

Commands like:

```bash
git reset --hard
```

can destroy uncommitted work locally.

Never use them as a casual solution to collaboration problems.

---

# 52. Save Work Before Risky Git Actions

Before resolving a complicated Git state:

```bash
git status
```

If necessary, commit or stash legitimate work first.

Do not risk hours of hackathon work.

---

# 53. Using `git stash`

If you need to temporarily save uncommitted work:

```bash
git stash
```

Later:

```bash
git stash pop
```

Use carefully.

Prefer clean commits when possible because they are easier to track.

---

# 54. Switching Tasks

Before switching to another feature:

```text
Commit stable progress
```

or intentionally stash.

Do not leave undocumented modifications spread across several branches.

---

# 55. Delete Finished Feature Branches

After a feature is successfully merged:

```bash
git branch -d feature/<name>
```

Remote branch may also be removed.

This keeps the repository cleaner.

Do not delete until the merge is confirmed.

---

# 56. Main Branch Protection

If convenient, configure GitHub so:

```text
main
```

cannot be casually force-pushed.

Formal enterprise protection is not required, but avoiding accidental direct changes is useful.

---

# 57. Develop Branch Protection

Similarly, the team should avoid accidental destructive pushes to:

```text
develop
```

The workflow depends on this branch being the integration source.

---

# 58. Documentation Changes

Documentation changes should also be committed.

Example:

```text
docs: update business rule for trip dates
```

If implementation behavior intentionally changes, update the relevant source-of-truth document.

---

# 59. Code and Documentation Must Stay Aligned

Bad:

```text
Code:
POST /stops

Docs:
POST /trips/:tripId/stops
```

Preferred:

```text
One agreed contract
```

If the code needs to change from the documentation:

```text
Discuss
 ↓
Update source of truth
 ↓
Update implementation
```

---

# 60. Do Not Commit Temporary Debugging

Before commit, remove temporary code such as:

```text
console.log("HEREEEEE")
console.log(password)
random test objects
temporary hardcoded user IDs
```

Useful structured development logging may remain where appropriate.

Sensitive logs must never remain.

---

# 61. Hardcoded IDs

Do not commit local database IDs into feature logic.

Example BAD:

```text
userId = "123"
tripId = "abc"
```

Demo data belongs in:

```text
seed.ts
```

not production feature logic.

---

# 62. Temporary Frontend Data

If frontend mock data is used while backend is unfinished, clearly isolate it.

Before final integration:

```text
remove mock dependency
```

and connect the real API.

Do not leave hidden dummy data that makes the demo appear functional when backend state is disconnected.

---

# 63. Feature Branch Scope

A branch should have a clear purpose.

Example:

```text
feature/budget
```

should primarily contain budget-related work.

Avoid mixing:

```text
budget
auth rewrite
CSS redesign
schema experiment
```

in one branch.

---

# 64. Small Integration Commits

Sometimes integration requires a small shared change after feature branches merge.

Example:

```text
chore: register itinerary routes
```

This is acceptable.

Keep it obvious and tested.

---

# 65. Route Registration Coordination

Because central route files may be shared, prefer a pattern that minimizes repeated edits.

Example structure:

```text
modules/auth/auth.routes.ts
modules/trips/trip.routes.ts
modules/stops/stop.routes.ts
```

with a small central registration layer.

Feature folders remain independently owned.

---

# 66. Shared Helper Changes

Changes to shared utilities such as:

```text
ownership helper
error handler
auth middleware
```

can impact many modules.

Before changing behavior:

```text
Check dependent features
Discuss with teammate
Run regression tests
```

---

# 67. Emergency Hotfix

If a critical demo bug is found in `main`:

```text
create fix branch from main
```

Example:

```bash
git checkout main
git pull
git checkout -b fix/demo-login
```

Fix and test.

Then merge appropriately into:

```text
main
```

and also back into:

```text
develop
```

so branches do not drift.

---

# 68. Normal Hackathon Fix

Before final release, most fixes should still happen through:

```text
feature/fix branch
   ↓
develop
```

Only use direct main hotfix workflow when the demo-stable branch truly requires it.

---

# 69. Final Integration

When `develop` contains the complete MVP:

```text
Freeze new feature work
      ↓
Run testing plan
      ↓
Fix blockers
      ↓
Fresh database test
      ↓
Full demo test
      ↓
Merge develop → main
```

---

# 70. Final Merge to Main

Before merging:

- Frontend build passes
- Backend build passes
- Migrations work
- Seed works
- Demo accounts work
- Main user journey works
- No critical bugs remain

Then:

```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

or perform the equivalent GitHub PR merge.

---

# 71. Demo Freeze

Once `main` contains the stable demo version:

```text
Do not casually merge new features.
```

After freeze, changes should mainly be:

```text
critical bug fixes
demo data fixes
small UI fixes
```

Avoid architecture changes.

---

# 72. Tagging the Demo Version

Optionally create a Git tag:

```bash
git tag demo-v1
git push origin demo-v1
```

This gives the team a known working checkpoint.

---

# 73. Why Tag the Demo

If later work breaks something:

```text
Known stable commit
```

remains easy to identify.

This can be valuable during a hackathon.

---

# 74. Commit Before Demo

Before judging begins:

```text
git status
```

should ideally show:

```text
working tree clean
```

Do not run the final demo from important uncommitted code if avoidable.

---

# 75. Backup Rule

Both developers should push their meaningful work regularly.

A feature that exists only on one laptop is a risk.

Preferred:

```text
Useful checkpoint
   ↓
Commit
   ↓
Push
```

---

# 76. Push Frequency

Do not wait until the end of the hackathon to push everything.

Push after meaningful stable checkpoints.

Examples:

```text
Auth working
Trip CRUD working
Itinerary working
Budget working
```

This gives the team recovery points.

---

# 77. Do Not Push Every Broken Keystroke

Regular pushing is good.

But do not intentionally push unusable code into shared branches.

Personal feature branch can contain work-in-progress if needed, but:

```text
develop
```

should remain healthier.

---

# 78. WIP Commits

If necessary on a personal branch:

```text
wip: itinerary creation in progress
```

may be used temporarily.

Before final merge, prefer cleaning obvious incomplete work.

Do not merge known WIP state into `develop`.

---

# 79. Merge Ownership Sequence

For major cross-feature integrations:

```text
Feature owner tests own feature
      ↓
Other developer performs quick review
      ↓
Merge
      ↓
Both test integration boundary
```

Example:

```text
Stops + Itinerary
```

should be tested by both sides because the dependency crosses ownership boundaries.

---

# 80. Integration Communication

When a feature becomes ready, tell teammate:

```text
Branch
Endpoint
Main behavior
Migration?
Shared file changed?
Anything they need to pull/run?
```

Example:

```text
feature/trips merged into develop

Added:
POST /trips
GET /trips/:tripId

No migration.

Run:
npm install not needed
```

---

# 81. Migration Communication

If migration is included, explicitly say:

```text
New Prisma migration added.
Pull develop and run migration.
```

Do not make teammate discover this only through a runtime error.

---

# 82. Dependency Communication

If `package.json` changes, tell teammate:

```text
Run npm install after pull.
```

This saves debugging time.

---

# 83. `.env.example` Changes

If a new environment variable is required:

```text
Update .env.example
```

and tell teammate what they need to add to their local `.env`.

Never commit their actual `.env`.

---

# 84. Example Feature Completion Flow

```text
Person A starts feature/trips
        ↓
Implements Trip CRUD
        ↓
Tests
        ↓
Commits
        ↓
Pulls latest develop
        ↓
Resolves any conflict
        ↓
Runs tests again
        ↓
Pushes branch
        ↓
Merge into develop
        ↓
Person B pulls develop
```

---

# 85. Example Parallel Workflow

```text
Person A
feature/stops

Person B
feature/activities
```

Because these mostly touch separate feature folders:

```text
Low conflict risk
```

After both merge:

```text
Integration test
Stops + Activities + Itinerary
```

---

# 86. Bad Parallel Workflow

Avoid:

```text
Person A
editing schema.prisma

Person B
editing schema.prisma

both create migrations

both edit app.ts
```

at the same time without coordination.

This creates unnecessary merge risk.

---

# 87. Repository Health Rule

At any important checkpoint, the repository should answer yes to:

```text
Can teammate pull it?
Can they install it?
Can migrations run?
Can seed run?
Can app start?
```

If not, shared development becomes fragile.

---

# 88. Git Does Not Replace Communication

Git handles code history.

It does not eliminate the need to say:

```text
I'm changing schema.prisma.
```

or:

```text
I'm changing the shared auth middleware.
```

The highest-conflict changes still require coordination.

---

# 89. Do Not Change Locked Architecture Silently

Never silently switch:

```text
REST → GraphQL
JWT → sessions
PostgreSQL → another database
feature folders → layered architecture
```

inside a feature branch.

Architecture changes require explicit agreement and documentation updates.

---

# 90. Git History Should Tell the Story

Good project history might look like:

```text
feat: initialize express api
feat: add prisma schema
feat: add authentication
feat: add trip CRUD
feat: add stop management
feat: add city search
feat: add activity search
feat: add itinerary
feat: add budget calculation
feat: add public sharing
fix: enforce copy trip ownership
docs: finalize demo plan
```

That makes the project easier to understand and debug.

---

# 91. Before Pulling With Local Changes

If `git status` shows local modifications, do not blindly run operations that may conflict.

Either:

```text
Commit
```

or:

```text
Stash
```

first.

---

# 92. Never Delete Teammate Code Because of Conflict

If you do not understand a conflicting section, ask/check the owning documentation and feature owner.

Merge conflicts represent competing changes.

They are not permission to choose whichever version looks easier.

---

# 93. Source-of-Truth Conflict Resolution

When code conflicts conceptually:

| Conflict | Check |
|---|---|
| Product behavior | `PRD.md` |
| Technology | `TECH_STACK.md` |
| Architecture | `SYSTEM_ARCHITECTURE.md` |
| Database | `DATABASE_SCHEMA.md` |
| Endpoint | `API_CONTRACT.md` |
| Folder | `PROJECT_STRUCTURE.md` |
| Auth | `AUTH_AND_AUTHORIZATION.md` |
| Validation | `BUSINESS_RULES.md` |
| Error behavior | `ERROR_STANDARD.md` |
| Work ownership | `TEAM_WORK_SPLIT.md` |

Do not resolve architecture disputes based only on code age.

---

# 94. Final Branch Model

```text
                       ┌────────────┐
                       │    main    │
                       │ Demo-safe  │
                       └─────▲──────┘
                             │
                             │ stable merge
                             │
                       ┌─────┴──────┐
                       │  develop   │
                       │Integration │
                       └─────▲──────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
         ┌──────┴─────┐ ┌────┴─────┐ ┌────┴──────┐
         │feature/auth│ │feature/...│ │feature/...│
         └────────────┘ └──────────┘ └───────────┘
```

---

# 95. Daily Git Routine

At the start:

```bash
git checkout develop
git pull origin develop
```

Create/update feature branch.

During work:

```bash
git status
git add <files>
git commit -m "feat: ..."
git push
```

Before merge:

```bash
git fetch origin
git merge origin/develop
```

Then:

```text
resolve conflicts
test
push
merge
```

---

# 96. Final Pre-Merge Checklist

- [ ] Feature matches documentation
- [ ] `git status` reviewed
- [ ] No `.env`
- [ ] No secrets
- [ ] No unrelated changes
- [ ] Latest `develop` merged
- [ ] Conflicts correctly resolved
- [ ] Frontend/backend still start
- [ ] Relevant tests pass
- [ ] API shape correct
- [ ] Migration included if required
- [ ] Seed updated if required
- [ ] Shared-file changes communicated

---

# 97. Final Demo Branch Checklist

Before final `develop → main` merge:

- [ ] All P0 features complete
- [ ] Required P1 features stable
- [ ] Fresh migration works
- [ ] Seed works
- [ ] Frontend build passes
- [ ] Backend build passes
- [ ] Ownership tested
- [ ] Public/private behavior tested
- [ ] Budget verified
- [ ] Demo flow tested
- [ ] Backup demo data ready
- [ ] No critical bug known

---

# 98. Emergency Rule

If Git becomes confusing during the hackathon:

```text
Do not run destructive commands randomly.
```

First:

```bash
git status
git log --oneline -10
git branch
```

Understand:

```text
Which branch am I on?
What is committed?
What is uncommitted?
What changed?
```

Then fix the state deliberately.

---

# 99. Core Collaboration Rule

The workflow is:

```text
Own Feature
    ↓
Small Commits
    ↓
Push Regularly
    ↓
Pull Latest
    ↓
Test
    ↓
Merge into Develop
    ↓
Integrate
    ↓
Stable Develop
    ↓
Main
```

---

# 100. Final Rule

The team should optimize Git for:

```text
Safety
+
Clarity
+
Fast Integration
```

not for having the most sophisticated Git history.

The most important rules are:

```text
Do not code directly on main.
Do not silently change shared contracts.
Do not create competing Prisma migrations.
Do not merge broken code into develop.
Do not overwrite teammate work during conflicts.
Push stable checkpoints regularly.
```

If these rules are followed, Git should support the hackathon instead of becoming another problem to solve.