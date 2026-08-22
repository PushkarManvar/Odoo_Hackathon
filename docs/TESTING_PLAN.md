# GlobeTrotter — Testing Plan

## 1. Purpose

This document defines how GlobeTrotter should be tested before the hackathon demo.

The testing strategy focuses on:

- Core user flows
- Authentication
- Authorization
- Business rules
- Data integrity
- API consistency
- Integration between modules
- Demo reliability

The goal is not perfect test coverage.

The goal is:

```text
Critical features work
+
Invalid actions are rejected
+
The demo flow does not break
```

---

# 2. Testing Priorities

Testing should follow this order:

```text
1. Authentication
2. Ownership
3. Trips
4. Stops
5. Date validation
6. Cities
7. Activities
8. Itinerary
9. Budget
10. Calendar
11. Sharing
12. Copy Trip
13. Cascading deletion
14. Full demo flow
```

---

# 3. Test Levels

GlobeTrotter should be tested at several levels.

```text
Unit / Logic Tests
        ↓
API Tests
        ↓
Integration Tests
        ↓
Frontend Flow Tests
        ↓
Full Demo Test
```

For the hackathon, API and integration testing are especially important.

---

# 4. Manual Testing Is Acceptable

The team does not need to build a massive automated test suite before the MVP works.

Manual testing using:

- Postman
- Bruno
- Thunder Client
- curl
- Browser

is acceptable.

Automate high-risk logic where practical.

---

# 5. Test Environment

Before testing:

```text
PostgreSQL running
Backend running
Frontend running
Latest migrations applied
Seed data loaded
```

Recommended local setup:

```text
Frontend → :5173
Backend  → :4000
Postgres → :5432
```

---

# 6. Fresh Database Test

Before major testing:

```bash
npx prisma migrate reset
```

Then:

```bash
npx prisma db seed
```

This ensures tests are not accidentally passing because of old local data.

---

# 7. Authentication — Signup

Test successful signup.

### Input

```text
New email
Valid password
Required user information
```

### Expected

```text
201
```

and:

```json
{
  "success": true,
  "data": {}
}
```

according to `API_CONTRACT.md`.

---

# 8. Signup — Duplicate Email

Flow:

```text
Signup User A
      ↓
Signup again using same email
```

Expected:

```text
409
```

Error code:

```text
EMAIL_ALREADY_EXISTS
```

---

# 9. Signup — Invalid Input

Test:

- Missing email
- Invalid email
- Missing password
- Password below required validation
- Missing required fields

Expected:

```text
400
```

with standard failure response.

---

# 10. Password Storage Test

After signup, inspect database.

Verify:

```text
Stored value != plaintext password
```

Password must be bcrypt-hashed.

---

# 11. Authentication — Login

Test valid login.

Expected:

```text
200
```

and valid JWT according to the API contract.

---

# 12. Login — Wrong Password

Input:

```text
Correct email
Wrong password
```

Expected:

```text
401
```

with:

```text
INVALID_CREDENTIALS
```

---

# 13. Login — Unknown User

Login using an unregistered email.

Expected behavior must match `API_CONTRACT.md`.

Prefer generic:

```text
INVALID_CREDENTIALS
```

rather than exposing whether the account exists.

---

# 14. Protected Route — No Token

Call a protected endpoint without:

```text
Authorization: Bearer <token>
```

Expected:

```text
401
```

---

# 15. Protected Route — Invalid Token

Send malformed or invalid JWT.

Expected:

```text
401
```

---

# 16. Protected Route — Valid Token

Use a valid token.

Expected:

```text
Request reaches protected feature logic.
```

---

# 17. Ownership Test Setup

Create:

```text
User A
User B
```

User A creates:

```text
Trip A
```

User B creates:

```text
Trip B
```

These accounts are then used for authorization testing.

---

# 18. Trip Ownership — Owner Access

User A accesses Trip A.

Test:

- Read
- Update
- Delete

Expected:

```text
Allowed
```

---

# 19. Trip Ownership — Wrong User

User B attempts to:

```text
Update Trip A
```

Expected:

```text
403
```

or the documented not-found behavior.

The response must follow `ERROR_STANDARD.md`.

---

# 20. Private Trip Read

User B attempts to access User A's private trip through a protected/private endpoint.

Expected behavior must follow:

```text
AUTH_AND_AUTHORIZATION.md
API_CONTRACT.md
```

---

# 21. Shared Ownership Helper

Verify that:

```text
assertTripOwnership()
```

is used consistently for owned resources.

Test indirect ownership:

```text
ItineraryItem
      ↓
TripStop
      ↓
Trip
      ↓
User
```

---

# 22. Create Trip

Test valid trip creation.

Example:

```text
Name:
Rajasthan Explorer

Start:
2026-10-10

End:
2026-10-18
```

Expected:

```text
201
```

and trip belongs to authenticated user.

---

# 23. Create Trip — Invalid Dates

Example:

```text
Start:
2026-10-20

End:
2026-10-10
```

Expected:

```text
400
INVALID_TRIP_DATES
```

---

# 24. Trip List

User creates several trips.

Call trip list endpoint.

Expected:

```text
Only that user's private/owned trips according to contract
```

Verify User A does not receive User B's private trips.

---

# 25. Get Trip

Retrieve existing trip.

Verify:

- Correct ID
- Correct owner
- Dates
- Visibility
- Expected nested data if specified in API contract

---

# 26. Get Missing Trip

Use nonexistent trip ID.

Expected:

```text
404
TRIP_NOT_FOUND
```

---

# 27. Update Trip

Test updating:

- Name
- Dates
- Visibility

Expected values persist in database.

---

# 28. Update Trip — Invalid Dates

Attempt:

```text
startDate > endDate
```

Expected rejection.

---

# 29. Trip Date Change With Existing Stops

Create:

```text
Trip:
10 Oct → 20 Oct

Stop:
12 Oct → 15 Oct
```

Then shrink trip to:

```text
16 Oct → 20 Oct
```

This conflicts with the existing stop.

Expected behavior must match `BUSINESS_RULES.md`.

Test exactly what the documented rule requires.

---

# 30. Delete Trip

Delete owned trip.

Expected:

```text
Success
```

Then verify:

```text
GET deleted trip
→ 404
```

---

# 31. Add Stop

Create valid stop inside trip.

Example:

```text
Trip:
10 Oct → 20 Oct

Stop:
12 Oct → 15 Oct
```

Expected:

```text
Created successfully
```

---

# 32. Stop Before Trip

Example:

```text
Trip:
10 Oct → 20 Oct

Stop:
8 Oct → 12 Oct
```

Expected:

```text
400
INVALID_STOP_DATE
```

---

# 33. Stop After Trip

Example:

```text
Trip:
10 Oct → 20 Oct

Stop:
18 Oct → 22 Oct
```

Expected rejection.

---

# 34. Stop Start After Stop End

Example:

```text
Stop:
15 Oct → 12 Oct
```

Expected rejection.

---

# 35. Stop Boundary Dates

Test:

```text
Stop starts exactly on trip start
```

and:

```text
Stop ends exactly on trip end
```

If business rules allow equality, both should succeed.

---

# 36. Stop Ownership

User B tries to modify User A's stop.

Expected:

```text
Rejected through trip ownership.
```

---

# 37. Update Stop

Test changing:

- Dates
- Accommodation cost
- Transport cost
- Other editable fields

Verify persistence.

---

# 38. Delete Stop

Delete a stop.

Verify:

- Stop removed
- Associated itinerary behavior matches schema/business rules
- Remaining stops remain intact

---

# 39. Stop Reordering

Create:

```text
Jaipur position 1
Udaipur position 2
Goa position 3
```

Reorder:

```text
Goa
Jaipur
Udaipur
```

Verify positions persist correctly.

---

# 40. Invalid Stop Reorder

Test invalid input such as:

- Duplicate IDs
- Missing stop
- Stop from another trip
- Invalid position values

Expected behavior follows `API_CONTRACT.md`.

---

# 41. City Search

Search:

```text
Jaipur
```

Expected:

```text
Jaipur returned
```

---

# 42. Partial City Search

Search:

```text
Jai
```

Expected:

```text
Jaipur
```

if partial search is supported.

---

# 43. Case-Insensitive City Search

Search:

```text
jaipur
JAIPUR
JaIpUr
```

Expected consistent results if case-insensitive search is part of the contract.

---

# 44. City Search — No Results

Search:

```text
xyzabc
```

Expected:

```json
{
  "success": true,
  "data": []
}
```

Search with no matches is normally not an error.

---

# 45. Activity Search

Select/search activities for Jaipur.

Expected examples from seed data:

```text
Amber Fort
City Palace
Hawa Mahal
```

---

# 46. Activity City Filter

Request Jaipur activities.

Verify activity from another city is not incorrectly included.

---

# 47. Activity Category Filter

If category filtering exists, test each supported category.

Example:

```text
FOOD
SIGHTSEEING
MUSEUM
```

---

# 48. Activity Search — No Results

Search nonsense query.

Expected:

```text
Successful empty array
```

not server failure.

---

# 49. Add Itinerary Item

Create:

```text
Trip
 ↓
Jaipur Stop
 ↓
Amber Fort
```

Choose a valid date/time.

Expected:

```text
Itinerary item created
```

---

# 50. Itinerary Date Before Stop

Example:

```text
Stop:
12 Oct → 15 Oct

Activity:
11 Oct
```

Expected:

```text
400
INVALID_ITINERARY_DATE
```

---

# 51. Itinerary Date After Stop

Example:

```text
Stop:
12 Oct → 15 Oct

Activity:
16 Oct
```

Expected rejection.

---

# 52. Itinerary Boundary Dates

Test activity:

```text
exactly on stop start
```

and:

```text
exactly on stop end
```

Expected behavior follows business rules.

---

# 53. Activity City Mismatch

Example:

```text
Stop:
Jaipur

Selected Activity:
Paris activity
```

Expected:

```text
ACTIVITY_CITY_MISMATCH
```

if this rule is enforced by `BUSINESS_RULES.md`.

---

# 54. Custom Itinerary Item

If custom activities are supported, test valid:

```text
customName
```

without master activity.

Expected success if allowed.

---

# 55. Invalid Empty Itinerary Activity

If the rule states either:

```text
activityId
OR
customName
```

must exist, test both missing.

Expected rejection.

---

# 56. Edit Itinerary Item

Modify:

- Date
- Time
- Cost
- Notes/custom fields where supported

Verify updated values persist.

---

# 57. Delete Itinerary Item

Delete existing item.

Expected:

```text
Item removed
Budget updates
```

---

# 58. Itinerary Ownership

User B attempts to edit User A's itinerary item.

Expected:

```text
Rejected
```

Ownership must resolve through trip ownership.

---

# 59. Retrieve Itinerary

Create multiple items across several days.

Expected ordering:

```text
Date ascending
Then time ascending
```

where specified.

---

# 60. Budget — Empty Trip

Create trip with no cost values.

Expected:

```text
activities = 0
accommodation = 0
transport = 0
total = 0
```

Zero budget is valid.

---

# 61. Budget — Activity Costs

Example:

```text
Activity A = 500
Activity B = 1000
```

Expected:

```text
Activity total = 1500
```

using the project's integer money representation.

---

# 62. Budget — Stop Costs

Example:

```text
Accommodation = 5000
Transport = 2000
```

Expected:

```text
Stop-related total = 7000
```

---

# 63. Budget — Complete Calculation

Example:

```text
Activities      3,000
Accommodation   8,000
Transport       4,000
```

Expected:

```text
Total = 15,000
```

---

# 64. Budget Recalculation — Add Item

Record current total.

Add activity.

Expected:

```text
Budget total increases correctly.
```

---

# 65. Budget Recalculation — Edit Item

Change activity cost.

Expected updated total immediately on next budget request.

---

# 66. Budget Recalculation — Delete Item

Delete activity.

Expected cost removed from budget.

---

# 67. Budget Ownership

User B requests User A's private trip budget.

Expected behavior follows authorization rules.

---

# 68. Calendar — Multiple Days

Create itinerary across:

```text
Day 1
Day 2
Day 3
```

Verify items appear under correct dates.

---

# 69. Calendar — Time Ordering

Example:

```text
17:00 Activity C
09:00 Activity A
13:00 Activity B
```

Expected presentation:

```text
09:00
13:00
17:00
```

---

# 70. Calendar — Multiple Stops

Example:

```text
Jaipur
12–14 Oct

Udaipur
15–18 Oct
```

Verify calendar correctly represents city/stop transitions.

---

# 71. Calendar — Empty Day

A day within the trip has no itinerary items.

The UI should not crash.

Expected:

```text
Empty day state
```

or omission according to frontend architecture.

---

# 72. Publish Trip

Start with:

```text
PRIVATE
```

Publish.

Expected:

```text
PUBLIC
```

persisted.

---

# 73. Public Trip Access

Open public route without owner authentication.

Expected:

```text
Public trip data returned
```

according to API contract.

---

# 74. Private Trip Public Access

Attempt to open private trip using public route.

Expected:

```text
TRIP_NOT_PUBLIC
```

or documented `404` behavior.

---

# 75. Public Trip Must Be Read-Only

A visitor opens a public trip.

Verify no public endpoint allows modifying:

- Trip
- Stops
- Itinerary

Public sharing is read-only.

---

# 76. Make Public Trip Private Again

If visibility can be changed back:

```text
PUBLIC → PRIVATE
```

Then try the previous public URL.

Expected:

```text
No longer publicly accessible.
```

---

# 77. Copy Trip — Basic Flow

User A owns public trip.

User B:

```text
Open Public Trip
      ↓
Copy Trip
```

Expected:

```text
New Trip owned by User B
```

---

# 78. Copy Trip — Visibility

Copied trip should use the visibility defined by `BUSINESS_RULES.md`.

Expected default:

```text
PRIVATE
```

if that is the locked rule.

---

# 79. Copy Trip — Stops

Verify all intended stops are copied.

Example:

```text
Original:
Jaipur
Udaipur

Copy:
Jaipur
Udaipur
```

---

# 80. Copy Trip — Stop Order

Verify copied stop positions match the source trip.

---

# 81. Copy Trip — Itinerary

Verify intended itinerary items are copied and connected to the new copied stops.

Do not leave copied items connected to the original trip's stop IDs.

---

# 82. Copy Trip — Independence

After copying:

```text
User B modifies copied trip
```

Verify:

```text
User A's original trip remains unchanged.
```

---

# 83. Copy Trip — Ownership

Verify copied:

- Trip
- Stops
- Itinerary items

belong logically to User B through the new trip.

---

# 84. Copy Trip — Private Source

Attempt to copy a private trip through public sharing.

Expected rejection.

---

# 85. Copy Trip Transaction Failure

Simulate or force failure during copy where practical.

Expected:

```text
No partially copied trip remains.
```

The operation should be atomic.

---

# 86. Cascading Delete — Trip

Create:

```text
Trip
├── Stop
│   └── Itinerary Item
```

Delete Trip.

Verify child records are removed according to `DATABASE_SCHEMA.md`.

---

# 87. Cascading Delete — Stop

Create stop with itinerary items.

Delete stop.

Verify itinerary items are removed according to the documented cascade behavior.

---

# 88. Master Activity Delete Behavior

If master Activity deletion behavior is defined, test it exactly according to `DATABASE_SCHEMA.md`.

Do not assume cascade behavior that is not documented.

---

# 89. City Referential Integrity

Ensure a TripStop cannot reference an invalid City ID.

Expected:

```text
Validation or database integrity rejection
```

translated into safe API error.

---

# 90. Invalid IDs

Test malformed/nonexistent IDs across major endpoints.

Examples:

```text
Invalid tripId
Invalid stopId
Invalid activityId
Invalid itineraryItemId
```

Expected:

```text
400 or 404
```

according to endpoint contract.

---

# 91. Missing Required Fields

For each create/update endpoint, test missing required input.

Examples:

```text
Trip without name
Stop without city
Itinerary item without required activity/custom data
```

Expected validation response.

---

# 92. Invalid Enum Values

Attempt:

```text
visibility = "EVERYONE"
```

instead of supported enum.

Expected rejection.

Also test invalid activity category where accepted from client input.

---

# 93. Money Validation

Test:

```text
Negative accommodation cost
Negative transport cost
Negative itinerary cost
```

Expected behavior must follow `BUSINESS_RULES.md`.

---

# 94. Money Precision

If money uses integer minor units, verify no floating-point precision problems occur.

Avoid:

```text
0.1 + 0.2 style inconsistencies
```

in stored values.

---

# 95. Error Shape Test

Every failed endpoint should return:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message."
  }
}
```

No module should return a competing format.

---

# 96. Success Shape Test

Every successful endpoint should follow:

```json
{
  "success": true,
  "data": {}
}
```

with endpoint-specific contents.

---

# 97. 500 Error Safety

Trigger an unexpected backend error where practical.

Verify client does not receive:

- Stack trace
- Prisma internals
- Database credentials
- Filesystem paths
- Secret values

Expected:

```text
INTERNAL_SERVER_ERROR
```

---

# 98. Search Empty State Frontend

Search for nonexistent city/activity.

Expected UI:

```text
No results
```

not:

```text
Broken page
```

---

# 99. No Trips Empty State

Login with user who has no trips.

Expected:

```text
Empty state
+
Create Trip action
```

---

# 100. No Stops Empty State

Open newly created trip.

Expected:

```text
No destinations added
+
Add Destination action
```

---

# 101. No Activities Empty State

Open stop with no itinerary items.

Expected appropriate empty state.

---

# 102. Loading States

For important frontend requests, verify:

```text
Loading indication
```

exists and UI does not appear frozen.

Focus on:

- Login
- Trip loading
- City search
- Activity search
- Budget
- Public trip

---

# 103. API Failure Frontend

Temporarily stop backend or force request failure.

Verify frontend:

```text
Shows error
Does not crash
Does not falsely show success
```

---

# 104. Form State Preservation

Submit invalid trip/stop data.

Expected:

```text
User-entered values remain where practical.
```

Do not wipe entire form because of one validation error.

---

# 105. JWT Persistence

If auth token is persisted according to frontend architecture:

```text
Login
 ↓
Refresh browser
```

Verify expected authentication state.

---

# 106. Logout

Logout.

Expected:

```text
Token/auth state removed
 ↓
Protected page unavailable
 ↓
Return to login
```

---

# 107. Direct Protected URL

While logged out, directly open:

```text
/trips/:tripId
```

Expected:

```text
Redirect/login behavior
```

according to `FRONTEND_ARCHITECTURE.md`.

---

# 108. Invalid Frontend Route

Open nonexistent page.

Expected graceful 404/not-found page if implemented.

---

# 109. Refresh Trip Page

Open trip page and refresh browser.

Verify the application correctly reloads data using the URL trip ID.

Do not rely only on navigation state.

---

# 110. Two-User Browser Test

Useful hackathon test:

```text
Normal browser → User A
Incognito       → User B
```

This makes ownership and sharing tests much easier.

---

# 111. Public Sharing Browser Test

Use incognito/logged-out browser.

Open public trip URL.

Verify:

```text
No accidental dependence on owner's auth token.
```

---

# 112. Browser Console

Before demo, check browser console.

Resolve important:

```text
Errors
Unhandled promises
Repeated failed requests
```

Warnings that do not affect functionality are lower priority.

---

# 113. Backend Console

Watch backend logs while executing demo.

Fix:

```text
Unhandled exceptions
Prisma errors
Repeated 500s
```

before judging.

---

# 114. Database Inspection

Use:

```bash
npx prisma studio
```

to verify relational state after complex operations.

Especially useful for:

- Copy Trip
- Cascading deletes
- Stop reordering
- Ownership
- Budget data

---

# 115. Seed Test

Run seed on fresh database.

Expected:

```text
Seed completes successfully
```

Then verify:

- Demo users exist
- Cities exist
- Activities exist
- Demo trips exist if configured

---

# 116. Seed Idempotency

If the seed is designed to be rerunnable:

```bash
npx prisma db seed
npx prisma db seed
```

Verify duplicates are not created unexpectedly.

---

# 117. Fresh Setup Test

Before final demo, simulate new developer setup:

```text
Fresh code
 ↓
npm install
 ↓
docker compose up
 ↓
migrate
 ↓
seed
 ↓
start backend
 ↓
start frontend
```

Expected:

```text
Application works without undocumented manual fixes.
```

---

# 118. Frontend Build Test

Run:

```bash
npm run build
```

in frontend.

Expected:

```text
No TypeScript/build errors.
```

---

# 119. Backend Build Test

Run configured backend build command.

Expected:

```text
No TypeScript errors.
```

---

# 120. Demo-Critical Flow

This is the most important manual test.

```text
Login
 ↓
Dashboard
 ↓
Create Rajasthan Trip
 ↓
Add Jaipur
 ↓
Add Udaipur
 ↓
Add Activities
 ↓
View Itinerary
 ↓
View Budget
 ↓
View Calendar
 ↓
Publish
 ↓
Open Public Trip
```

Every member should be able to execute this flow without assistance.

---

# 121. Full Demo Flow With Copy

Extended flow:

```text
User A Login
 ↓
Create / Open Rajasthan Trip
 ↓
Jaipur
 ↓
Udaipur
 ↓
Activities
 ↓
Budget
 ↓
Calendar
 ↓
Publish
 ↓
Open Public URL
 ↓
Login as User B
 ↓
Copy Trip
 ↓
Open User B's Copy
```

This is the strongest end-to-end functional test.

---

# 122. Demo Data Verification

Before judging, confirm:

```text
Demo accounts work
Demo passwords known
Seed cities exist
Activities load
Public trip available
Budget values look reasonable
```

Do not rely on last-minute data entry.

---

# 123. Demo Fallback Test

Have at least one pre-seeded complete trip.

If live trip creation fails during demo:

```text
Open seeded trip
 ↓
Show itinerary
 ↓
Show budget
 ↓
Show sharing
```

The exact fallback sequence belongs in `DEMO_PLAN.md`.

---

# 124. Testing By Owner

## Person A

Primary responsibility for testing:

```text
Authentication
Trips
Stops
Ownership
Trip dates
Stop dates
```

## Person B

Primary responsibility for testing:

```text
Cities
Activities
Itinerary
Budget
Sharing
Copy Trip
```

---

# 125. Cross-Testing Rule

Each developer should test at least one major feature owned by the other person.

Reason:

```text
Developer who wrote feature
may unconsciously follow expected path.
```

Fresh testing often exposes integration assumptions.

---

# 126. Merge Test

Before merging a feature branch:

- [ ] Pull latest integration branch
- [ ] Resolve conflicts
- [ ] Run feature happy path
- [ ] Run major failure case
- [ ] Check build
- [ ] Check migrations
- [ ] Check API response shape
- [ ] Verify no unrelated feature broke

---

# 127. Post-Merge Smoke Test

After important merges:

```text
Login
 ↓
Open/Create Trip
 ↓
Load Stops
 ↓
Load Activities
```

This quick test catches major integration regressions immediately.

---

# 128. Regression Checklist

After large changes, verify:

- [ ] Signup
- [ ] Login
- [ ] Token auth
- [ ] Create trip
- [ ] Edit trip
- [ ] Add stop
- [ ] Reorder stop
- [ ] Add activity
- [ ] Edit itinerary
- [ ] Budget
- [ ] Calendar
- [ ] Public page
- [ ] Copy trip
- [ ] Logout

---

# 129. Database Migration Test

When migration changes:

```text
Fresh database
 ↓
Apply all migrations from beginning
```

Expected:

```text
Success
```

Do not test only on a database that already had manually modified schema.

---

# 130. Migration + Seed Test

Run:

```text
Fresh Database
 ↓
Migrations
 ↓
Seed
```

Both must work together.

---

# 131. Cascade Test After Migration

Whenever relationships change, repeat cascading deletion tests.

Schema changes can silently alter delete behavior.

---

# 132. Authorization Regression

Ownership is high-risk.

After major backend changes, re-test:

```text
User A owns resource
User B attempts modification
```

for:

- Trip
- Stop
- Itinerary item

---

# 133. Public/Private Regression

Test both:

```text
PRIVATE → inaccessible publicly
PUBLIC  → accessible publicly
```

after any sharing or visibility change.

---

# 134. Performance Smoke Check

The MVP does not require formal load testing.

However, make sure:

- Dashboard does not take unreasonable time
- Search feels responsive on seed data
- Budget query is quick
- Public itinerary loads normally

If ordinary demo data is slow, investigate.

---

# 135. No Premature Load Testing

Do not spend critical time simulating millions of users before the demo.

The project limitations explicitly exclude production-scale infrastructure.

Functional correctness is higher priority.

---

# 136. Security Smoke Tests

At minimum verify:

```text
Passwords hashed
Protected routes require token
Wrong owner rejected
Private trip unavailable publicly
No secrets returned in errors
```

---

# 137. SQL/ORM Safety

Because Prisma is used, avoid string-building raw SQL for normal feature queries.

If raw queries exist, review carefully.

---

# 138. Sensitive Data Test

Inspect API responses.

Ensure they do not return:

```text
passwordHash
JWT secret
internal database credentials
```

The User object returned to frontend should exclude password hash.

---

# 139. Public User Data Test

Public itinerary should expose only the user/trip information defined in `API_CONTRACT.md`.

Do not accidentally expose private account data through nested Prisma relations.

---

# 140. Copy Trip Data Leak Test

When copying a public trip, ensure User B does not receive private owner-only fields from User A.

---

# 141. Error Code Consistency Test

Search backend for inconsistent patterns such as:

```text
res.status(...).json({ message: ... })
```

where the shared AppError/global response system should be used.

---

# 142. API Contract Verification

For every endpoint implemented, verify:

```text
Method
URL
Authentication
Request body
Response body
Errors
```

against:

```text
API_CONTRACT.md
```

---

# 143. Business Rule Verification

For every validation test, verify expected behavior against:

```text
BUSINESS_RULES.md
```

Do not invent test expectations independently.

---

# 144. Database Verification

For relationships and cascade tests, use:

```text
DATABASE_SCHEMA.md
```

as source of truth.

---

# 145. Test Failure Rule

When a test fails:

```text
Do not immediately change the test expectation.
```

First check:

```text
API_CONTRACT.md
BUSINESS_RULES.md
DATABASE_SCHEMA.md
AUTH_AND_AUTHORIZATION.md
```

Then determine whether:

```text
Implementation is wrong
```

or:

```text
Documentation intentionally needs changing.
```

---

# 146. Bug Priority

## Critical

Fix immediately:

```text
App cannot start
Login broken
Trip creation broken
Database corruption
Ownership bypass
Demo flow blocked
```

## High

Fix before demo:

```text
Budget wrong
Stop date validation wrong
Sharing broken
Copy Trip broken
Major UI crash
```

## Medium

Fix if time permits:

```text
Minor empty-state issue
Small responsive issue
Non-critical message inconsistency
```

## Low

Usually polish:

```text
Tiny spacing issues
Minor animation issues
Cosmetic details
```

---

# 147. Freeze Rule

Before demo:

```text
Stop adding major features.
```

Only accept changes for:

```text
Critical bugs
High-priority bugs
Demo-breaking UI
Data fixes
```

This reduces last-minute regressions.

---

# 148. Final Testing Checklist

- [ ] Fresh database works
- [ ] Migrations work
- [ ] Seed works
- [ ] Signup works
- [ ] Login works
- [ ] Invalid login rejected
- [ ] Protected routes require JWT
- [ ] Ownership works
- [ ] Trip CRUD works
- [ ] Trip date rules work
- [ ] Stop CRUD works
- [ ] Stop date rules work
- [ ] Stop reorder works
- [ ] City search works
- [ ] Activity search works
- [ ] Itinerary CRUD works
- [ ] Activity date validation works
- [ ] City/activity matching works
- [ ] Budget is correct
- [ ] Calendar is correct
- [ ] Public sharing works
- [ ] Private trips stay private
- [ ] Copy Trip works
- [ ] Copy is independent
- [ ] Cascading delete works
- [ ] Error responses are standardized
- [ ] Frontend handles errors
- [ ] Frontend build succeeds
- [ ] Backend build succeeds
- [ ] Full demo flow succeeds
- [ ] Backup demo trip exists

---

# 149. Final Demo Acceptance Test

GlobeTrotter is considered demo-ready when this works from beginning to end:

```text
User A Login
      ↓
Create Trip
      ↓
Add Jaipur
      ↓
Add Udaipur
      ↓
Add Activities
      ↓
View Day-by-Day Itinerary
      ↓
View Budget
      ↓
View Calendar
      ↓
Publish Trip
      ↓
Open Public Trip
      ↓
User B Copies Trip
      ↓
User B Opens Independent Copy
```

and at the same time:

```text
Invalid actions are rejected
+
Private data stays protected
+
No critical errors appear
```

---

# 150. Final Rule

Testing priority is:

```text
Correctness
    ↓
Data Integrity
    ↓
Authorization
    ↓
Core User Flow
    ↓
Demo Stability
    ↓
Polish
```

Do not declare GlobeTrotter finished because every page looks complete.

It is finished for the hackathon only when the **complete user journey works reliably and the important failure cases behave correctly**.