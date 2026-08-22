# GlobeTrotter
## Authentication & Authorization

**Document:** `07_AUTH_AND_AUTHORIZATION.md`  
**Status:** Locked for MVP  
**Authentication:** JWT  
**Password Hashing:** bcrypt  
**Authorization Model:** Resource ownership through Trip

---

# 1. Purpose

This document defines how GlobeTrotter identifies users and protects private data.

It is the source of truth for:

- Signup
- Login
- Password hashing
- JWT generation
- JWT verification
- `req.user`
- Protected routes
- Public routes
- Trip ownership
- Stop ownership
- Itinerary item ownership
- 401 vs 403 vs 404 behavior
- Public itinerary access
- Account deletion security

The central rule is:

> Authentication determines who the user is. Authorization determines what that user is allowed to access.

---

# 2. Authentication vs Authorization

These concepts must remain separate.

## Authentication

Answers:

```text
Who are you?
```

Example:

```text
JWT
 ↓
User ID
```

---

## Authorization

Answers:

```text
Are you allowed to perform this action?
```

Example:

```text
User ID
 ↓
Trip.userId
 ↓
same?
```

---

# 3. Authentication Architecture

```text
Email + Password
      ↓
Login
      ↓
bcrypt verification
      ↓
JWT generated
      ↓
Frontend stores token
      ↓
Authorization header
      ↓
Backend verifies token
      ↓
req.user.id
```

---

# 4. Signup Flow

Endpoint:

```text
POST /api/auth/signup
```

Flow:

```text
Client
  ↓
name + email + password
  ↓
Validate request
  ↓
Normalize email
  ↓
Check existing user
  ↓
Hash password
  ↓
Create User
  ↓
Generate JWT
  ↓
Return user + token
```

---

# 5. Signup Request

Example:

```json
{
  "name": "Nishant",
  "email": "Nishant@example.com",
  "password": "strongpassword"
}
```

Before database lookup:

```text
Nishant@example.com
```

must become:

```text
nishant@example.com
```

---

# 6. Signup Validation

Required:

```text
name
email
password
```

Validation responsibilities:

```text
name:
non-empty string

email:
valid email format

password:
minimum accepted length
```

Recommended MVP password minimum:

```text
8 characters
```

No advanced password complexity rules are necessary for the hackathon.

---

# 7. Duplicate Email

If email already exists:

```http
409 Conflict
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "An account with this email already exists."
  }
}
```

---

# 8. Password Handling

Plain passwords may exist only temporarily during request processing.

Never:

- Log passwords
- Store plain passwords
- Return passwords
- Put passwords inside JWT
- Put passwords inside error messages

---

# 9. Password Hashing

Use:

```text
bcrypt
```

Flow:

```text
Plain Password
      ↓
bcrypt.hash()
      ↓
Password Hash
      ↓
PostgreSQL
```

Database field:

```text
passwordHash
```

---

# 10. Hash Configuration

Use a reasonable bcrypt work factor.

Recommended:

```text
10–12 rounds
```

For hackathon/local development:

```text
10
```

is sufficient.

The exact value may be stored in configuration if desired, but does not need separate environment management for MVP.

---

# 11. Login Flow

Endpoint:

```text
POST /api/auth/login
```

Flow:

```text
Email + Password
      ↓
Normalize Email
      ↓
Find User
      ↓
bcrypt.compare()
      ↓
Credentials valid?
      ↓
Generate JWT
      ↓
Return safe user + token
```

---

# 12. Invalid Login

Do not reveal:

```text
"Email exists but password is wrong"
```

or:

```text
"Email not found"
```

Return one generic response:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password."
  }
}
```

Status:

```http
401 Unauthorized
```

---

# 13. JWT Purpose

JWT allows the backend to identify the current user on future requests without sending email/password repeatedly.

JWT is not:

- User profile storage
- Permission database
- Trip data storage
- Frontend state replacement

---

# 14. JWT Payload

Keep payload minimal.

Recommended:

```json
{
  "userId": "user-uuid"
}
```

JWT library will also typically include:

```text
iat
exp
```

when configured.

---

# 15. Do Not Put These in JWT

Avoid:

```text
passwordHash
email if unnecessary
user trips
planned budgets
activity lists
full profile
```

JWT should remain small and stable.

---

# 16. JWT Secret

Environment variable:

```text
JWT_SECRET
```

Example `.env.example`:

```text
JWT_SECRET=
```

Actual secret must stay in:

```text
.env
```

and must not be committed.

---

# 17. JWT Expiration

Recommended MVP:

```text
7 days
```

Example conceptual configuration:

```text
expiresIn: "7d"
```

This is sufficient for a local hackathon demo.

No refresh-token architecture is needed for MVP.

---

# 18. JWT Response

Signup/login returns:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Nishant",
      "email": "nishant@example.com"
    },
    "token": "jwt-token"
  }
}
```

Never include:

```text
passwordHash
```

---

# 19. Frontend Token Storage

For local hackathon MVP:

```text
localStorage
```

is acceptable.

Frontend should wrap access inside:

```text
auth-storage.ts
```

rather than using `localStorage` directly everywhere.

---

# 20. Token Storage Interface

Recommended conceptual functions:

```text
getToken()
setToken()
removeToken()
```

Example usage:

```text
Login successful
      ↓
setToken(token)
```

Logout:

```text
removeToken()
```

---

# 21. Authenticated Requests

Frontend sends:

```http
Authorization: Bearer <jwt>
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# 22. Axios Auth Flow

Shared Axios instance should automatically attach token.

Concept:

```text
Request
 ↓
Axios interceptor
 ↓
getToken()
 ↓
Authorization header
 ↓
Backend
```

This avoids repeating token logic inside every feature.

---

# 23. Auth Middleware

File:

```text
src/middleware/auth.middleware.ts
```

Responsibilities:

1. Read Authorization header.
2. Check Bearer format.
3. Verify JWT.
4. Extract `userId`.
5. Attach authenticated identity.
6. Continue request.

---

# 24. Canonical Authenticated User Shape

Use exactly:

```text
req.user.id
```

Example:

```ts
req.user = {
  id: decoded.userId
}
```

Do not introduce:

```text
req.userId
req.currentUser
req.authUser
req.sessionUser
```

in other modules.

One convention reduces bugs.

---

# 25. Express Type Extension

Use:

```text
src/types/express.d.ts
```

to type:

```text
req.user
```

Conceptually:

```ts
interface Request {
  user?: {
    id: string;
  };
}
```

Protected route controllers may then safely use the authenticated identity after middleware.

---

# 26. Missing Authorization Header

Example request:

```text
GET /api/trips
```

without token.

Response:

```http
401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required."
  }
}
```

---

# 27. Invalid Token

Cases:

- Invalid signature
- Malformed JWT
- Expired JWT
- Missing expected userId

Return:

```http
401 Unauthorized
```

Do not distinguish all JWT-internal failure reasons to the client.

---

# 28. GET `/api/auth/me`

Purpose:

Restore authenticated user state after page refresh.

Flow:

```text
Frontend starts
      ↓
Token exists?
      ↓
GET /api/auth/me
      ↓
Backend verifies token
      ↓
Returns safe user
```

---

# 29. Logout

MVP uses stateless JWT.

Therefore logout is primarily a frontend action:

```text
removeToken()
 ↓
clear auth state
 ↓
redirect /login
```

No backend logout endpoint is required.

---

# 30. Protected Route Categories

Require authentication:

```text
/api/auth/me

/api/trips/*
/api/stops/*
/api/items/*
/api/profile

budget endpoints
sharing mutation endpoints
copy trip
```

---

# 31. Public Route Categories

Do not require authentication:

```text
POST /api/auth/signup
POST /api/auth/login

GET /api/cities
GET /api/cities/:cityId
GET /api/cities/:cityId/activities

GET /api/public/:slug
```

City/activity discovery may later be protected, but MVP contract keeps them public.

---

# 32. Copy Trip Route

```text
POST /api/public/:slug/copy
```

is not public despite being under `/public`.

Reason:

A destination owner is required.

Therefore:

```text
Public trip read → no auth
Public trip copy → auth required
```

---

# 33. Authorization Architecture

Ownership is ultimately based on:

```text
Trip.userId
```

There is no separate role system for normal users.

---

# 34. Trip Ownership

For:

```text
GET /api/trips/:tripId
PATCH /api/trips/:tripId
DELETE /api/trips/:tripId
```

backend checks:

```text
Trip.userId === req.user.id
```

---

# 35. Shared Ownership Function

Ownership logic must exist in one shared location.

Recommended:

```text
src/utils/ownership.ts
```

Core function:

```text
assertTripOwnership()
```

Concept:

```ts
async function assertTripOwnership(
  tripId: string,
  userId: string
) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId }
  });

  if (!trip) {
    throw new NotFoundError("TRIP_NOT_FOUND");
  }

  if (trip.userId !== userId) {
    throw new ForbiddenError("FORBIDDEN");
  }

  return trip;
}
```

---

# 36. Why Centralize Ownership

Without a shared implementation:

Person A might do:

```text
missing → 404
wrong owner → 403
```

while Person B might do:

```text
missing → 403
wrong owner → 404
```

or use different request fields.

Centralization guarantees consistent behavior.

---

# 37. Stop Ownership

TripStop does not directly contain `userId`.

Relationship:

```text
TripStop
   ↓
tripId
   ↓
Trip
   ↓
userId
```

---

# 38. Stop Ownership Flow

Example:

```text
PATCH /api/stops/:stopId
```

Backend:

```text
Find Stop
   ↓
Stop exists?
   ↓
Read stop.tripId
   ↓
assertTripOwnership(stop.tripId, req.user.id)
   ↓
Proceed
```

---

# 39. Stop Not Found

If stop ID does not exist:

```http
404 Not Found
```

```json
{
  "success": false,
  "error": {
    "code": "STOP_NOT_FOUND",
    "message": "Trip stop not found."
  }
}
```

---

# 40. Itinerary Item Ownership

Relationship:

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

# 41. Item Ownership Flow

Example:

```text
PATCH /api/items/:itemId
```

Backend:

```text
Find Item
 ↓
Find/resolve Stop
 ↓
Resolve Trip
 ↓
assertTripOwnership()
 ↓
Proceed
```

---

# 42. Budget Authorization

Budget belongs to a Trip.

Endpoint:

```text
GET /api/trips/:tripId/budget
```

Flow:

```text
Authenticate
 ↓
assertTripOwnership()
 ↓
Calculate Budget
```

A user must not inspect another private trip's budget through its raw ID.

---

# 43. Sharing Authorization

Publishing:

```text
POST /api/trips/:tripId/share
```

requires:

```text
Trip owner
```

Unpublishing:

```text
DELETE /api/trips/:tripId/share
```

also requires owner.

---

# 44. Public Itinerary Authorization

Endpoint:

```text
GET /api/public/:slug
```

does not use ownership.

Instead it uses:

```text
shareSlug matches
AND
visibility === PUBLIC
```

---

# 45. Public Trip Is Read-Only

A public viewer must not be able to use public slug to call mutation actions.

For example, there should not be:

```text
PATCH /api/public/:slug
```

or:

```text
DELETE /api/public/:slug
```

Public access is read-only except for copying into a new owned trip.

---

# 46. Copy Trip Authorization

Flow:

```text
Logged-in user
      ↓
Public source trip
      ↓
Copy
      ↓
New Trip.userId = req.user.id
```

No ownership of source trip is required.

Source must simply be public.

---

# 47. 401 vs 403 vs 404

These status codes must remain consistent.

## 401 Unauthorized

Meaning:

```text
We do not have a valid authenticated identity.
```

Examples:

- Token missing
- Token invalid
- Token expired

---

## 403 Forbidden

Meaning:

```text
We know who you are, but you cannot access this resource.
```

Example:

User B attempts to modify User A's private trip.

---

## 404 Not Found

Meaning:

```text
Requested resource does not exist.
```

Examples:

- Unknown trip ID
- Unknown stop ID
- Unknown activity ID

---

# 48. Ownership Error Policy

For this hackathon API, we will use:

```text
Existing resource + wrong owner → 403
Missing resource → 404
```

This policy is locked.

A production security design may intentionally hide existence using 404 in both cases, but consistency and debugging are more valuable for this MVP.

---

# 49. User Identity Must Never Come From Request Body

Bad:

```json
{
  "userId": "someone-else",
  "name": "Trip"
}
```

Backend must not use that `userId`.

Correct:

```text
req.user.id
```

from verified JWT.

---

# 50. Trip Creation Ownership

Flow:

```text
POST /api/trips
 ↓
req.user.id
 ↓
Trip.userId
```

No user selection.

---

# 51. Copy Ownership

New copied trip:

```text
userId = req.user.id
```

Never:

```text
originalTrip.userId
```

---

# 52. Profile Ownership

Profile routes automatically operate on current authenticated user.

Example:

```text
GET /api/profile
```

does not need:

```text
/profile/:userId
```

for MVP.

This prevents users from requesting arbitrary profiles.

---

# 53. Delete Profile

```text
DELETE /api/profile
```

deletes:

```text
req.user.id
```

only.

Frontend cannot specify another account.

---

# 54. Safe User Object

Any response exposing a user should map to:

```json
{
  "id": "uuid",
  "name": "Nishant",
  "email": "nishant@example.com"
}
```

For public view:

```json
{
  "name": "Nishant"
}
```

is sufficient.

---

# 55. Password Hash Must Never Leave Backend

Do not:

```text
return prisma.user.findUnique(...)
```

directly if it includes `passwordHash`.

Use:

- `select`
- Mapping
- Safe-user helper

---

# 56. Recommended Safe User Select

Concept:

```ts
const safeUserSelect = {
  id: true,
  name: true,
  email: true
};
```

Public select:

```ts
const publicUserSelect = {
  name: true
};
```

---

# 57. Security of `GET /api/trips`

Backend query should include:

```text
where userId = req.user.id
```

Not:

```text
findMany()
```

followed by frontend filtering.

---

# 58. Security of `GET /api/trips/:tripId`

Never trust that UUID obscurity provides security.

Even though IDs are UUIDs, ownership must still be checked.

UUIDs are identifiers, not authorization.

---

# 59. Security of Stops

Users should not be able to modify a stop by guessing its UUID.

Every stop mutation must resolve trip owner.

---

# 60. Security of Items

Same principle:

```text
UUID != permission
```

Item ID alone is not enough.

---

# 61. Validation and Authentication Order

Recommended protected request flow:

```text
Request
 ↓
Auth Middleware
 ↓
Request Validation
 ↓
Controller
 ↓
Service
 ↓
Ownership
```

For requests where validating the body first is harmless, validation/auth ordering may differ, but protected resources should fail authentication before expensive business work.

---

# 62. Authentication Does Not Replace Validation

JWT says:

```text
This is User A.
```

It does not prove:

```text
This date is valid.
This activity belongs to Jaipur.
This budget is non-negative.
```

Those remain business/request validation concerns.

---

# 63. Authorization Does Not Belong in Frontend

Frontend can hide buttons.

Example:

```text
Public Trip → no Edit button
```

But that is only UX.

Backend must independently enforce authorization.

---

# 64. ProtectedRoute Responsibility

Frontend:

```text
ProtectedRoute.tsx
```

may redirect unauthenticated user:

```text
/trips
 ↓
/login
```

But backend still verifies JWT on every protected API request.

---

# 65. Expired Token UX

When API returns:

```text
401
```

Axios interceptor may:

1. Remove stored token.
2. Clear auth state.
3. Redirect user to login.

Avoid doing this for:

```text
403
```

because the user is still authenticated.

---

# 66. Axios Error Rules

```text
401
→ session/token invalid

403
→ show permission error

404
→ show missing resource

400/409
→ show domain/validation message
```

---

# 67. JWT Verification Configuration

Backend must verify token using:

```text
JWT_SECRET
```

and expected algorithm defaults from selected library configuration.

Do not decode without verification.

Bad:

```text
jwt.decode()
```

for authentication.

Correct:

```text
jwt.verify()
```

---

# 68. JWT Signing

Only backend signs tokens.

Frontend never has:

```text
JWT_SECRET
```

---

# 69. Secrets Boundary

Frontend `.env` variables beginning with:

```text
VITE_
```

are visible to frontend bundle.

Therefore never put:

```text
JWT_SECRET
DATABASE_URL
database password
```

inside frontend `.env`.

---

# 70. Backend Secrets

Only backend contains:

```text
DATABASE_URL
JWT_SECRET
```

Frontend only needs:

```text
VITE_API_BASE_URL
```

---

# 71. CORS Is Not Authentication

CORS limits browser origins.

It does not replace:

- JWT
- Ownership
- Validation

Even with local frontend origin locked, private APIs still require authentication.

---

# 72. Database Ownership Constraint

Database stores:

```text
Trip.userId
```

as a required relation.

Therefore every persisted trip has an owner.

---

# 73. Orphan Prevention

Because:

```text
Trip.userId
```

is required, the system should never have userless trips.

Copied trips must assign new owner inside transaction.

---

# 74. User Deletion

User relation cascades to Trips.

Therefore:

```text
Delete User
 ↓
Trips deleted
 ↓
Stops deleted
 ↓
Items deleted
```

This prevents private trip data remaining orphaned.

---

# 75. Public Slug After User Delete

Because Trip is deleted through cascade, its public slug disappears with it.

Public URL then returns:

```text
PUBLIC_TRIP_NOT_FOUND
```

---

# 76. Public Slug After Unpublish

Unpublishing sets:

```text
visibility = PRIVATE
shareSlug = null
```

Old public URL becomes invalid.

---

# 77. Public Slug Guessing

Slug should include random collision-resistant suffix.

Example:

```text
rajasthan-trip-a7k92p
```

Do not use only:

```text
rajasthan-trip
```

because duplicate names are common.

---

# 78. Rate Limiting

Production auth endpoints commonly use rate limiting.

For fully local hackathon MVP:

```text
Not required
```

Do not add complexity unless implementation is trivial and does not delay core work.

---

# 79. Email Verification

Not required.

Signup accounts become immediately usable.

Future production system could add email verification.

---

# 80. Forgot Password

The original problem statement mentions Forgot Password. 

However, implementing a real forgot-password flow requires:

- Email delivery
- Reset token
- Token expiry
- Reset page

For local MVP this may be represented in UI but deferred as a limitation unless the team chooses to implement a local-only reset mechanism.

It must not block core functionality.

---

# 81. Password Change

Not required for MVP.

---

# 82. Refresh Tokens

Not required.

One JWT with expiration is enough for local demo.

---

# 83. Roles

MVP does not need:

```text
USER
ADMIN
EDITOR
VIEWER
```

for core functionality.

Every authenticated user has standard user capabilities over their own resources.

Admin is optional and may introduce roles later.

---

# 84. If Admin Is Added Later

Potential future field:

```prisma
role UserRole @default(USER)
```

with:

```text
USER
ADMIN
```

Do not add it until optional admin feature is actually being built.

---

# 85. Friend-Specific Sharing

MVP does not have:

```text
User A shares private trip directly with User B
```

Access is:

```text
PRIVATE
or
PUBLIC
```

Friend-specific permissions require a collaboration/share table and are deferred.

---

# 86. Authentication Service Responsibilities

`auth.service.ts` owns:

```text
signup()
login()
getCurrentUser()
hashPassword()
comparePassword()
generateToken()
```

Some helpers may be private functions.

---

# 87. Auth Controller Responsibilities

`auth.controller.ts` owns HTTP handling only.

Example:

```text
Request
 ↓
authService.login()
 ↓
200 response
```

No bcrypt implementation inside controller.

---

# 88. Ownership Utility Responsibilities

`ownership.ts` should know:

- Prisma
- Resource relation path
- Standard app errors

It should not know:

- HTTP response objects
- React/frontend details

---

# 89. Example Ownership Helpers

Possible final API:

```ts
assertTripOwnership(tripId, userId)

getOwnedStop(stopId, userId)

getOwnedItem(itemId, userId)
```

`getOwnedStop` and `getOwnedItem` may internally resolve the trip and reuse the same ownership rule.

---

# 90. Avoid Repeating User Fetch

JWT contains user ID.

For most requests, middleware does not need to fetch entire User record from database unless necessary.

It can attach:

```text
req.user.id
```

after token verification.

If endpoint needs user data, service can query it.

---

# 91. Deleted User With Old JWT

Possible situation:

1. User has JWT.
2. Account is deleted.
3. Old JWT still exists.

If a protected operation requires an actual user relation, Prisma will naturally fail/create checks.

For `/auth/me`, return:

```text
USER_NOT_FOUND
```

or invalidate session.

For MVP this edge case is low risk but behavior should remain clean.

---

# 92. Recommended Auth Error Codes

```text
UNAUTHORIZED
INVALID_CREDENTIALS
EMAIL_ALREADY_EXISTS
USER_NOT_FOUND
FORBIDDEN
```

---

# 93. Logging Rules

It is safe to log:

```text
user ID
route
status
```

Do not log:

```text
plain password
JWT token
JWT secret
password hash
```

---

# 94. Error Logging

Server may log full internal errors for debugging.

Client receives sanitized response.

Example:

Server:

```text
Prisma error details
stack trace
```

Client:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Something went wrong."
  }
}
```

---

# 95. Postman Testing Sequence

Authentication testing should happen before frontend integration.

Test:

```text
1. Signup
2. Duplicate signup
3. Login correct password
4. Login wrong password
5. GET /auth/me
6. GET /trips without token
7. GET /trips with token
```

---

# 96. Ownership Testing Sequence

Create:

```text
User A
User B
```

User A creates:

```text
Trip A
```

Then verify:

```text
User A GET Trip A → 200
User A PATCH Trip A → 200

User B GET Trip A → 403
User B PATCH Trip A → 403
User B DELETE Trip A → 403
```

---

# 97. Stop Ownership Test

User A adds Stop A to Trip A.

Verify:

```text
User B PATCH Stop A → 403
User B DELETE Stop A → 403
```

---

# 98. Item Ownership Test

User A adds Item A.

Verify:

```text
User B PATCH Item A → 403
User B DELETE Item A → 403
```

---

# 99. Public Sharing Test

User A publishes Trip A.

Verify without token:

```text
GET /api/public/:slug → 200
```

Then unpublish.

Verify:

```text
GET /api/public/:oldSlug → 404
```

---

# 100. Copy Authorization Test

Public trip exists.

Without auth:

```text
POST /api/public/:slug/copy
→ 401
```

With User B:

```text
POST /api/public/:slug/copy
→ 201
```

New trip:

```text
userId = User B
visibility = PRIVATE
```

---

# 101. Security Invariants

The following must always be true:

1. No plain password is stored.
2. No password hash is returned.
3. Protected routes require verified JWT.
4. `req.user.id` is the canonical authenticated identity.
5. Frontend cannot choose trip owner.
6. Every private trip operation checks ownership.
7. Stop ownership resolves through Trip.
8. Item ownership resolves through Stop → Trip.
9. Budget requires trip ownership.
10. Publishing/unpublishing requires ownership.
11. Public itinerary is read-only.
12. Public copy requires authentication.
13. New copied trip belongs to current user.
14. JWT secret never reaches frontend.
15. UUIDs never substitute for authorization.

---

# 102. Authentication Flow Diagram

```text
┌───────────────┐
│    LOGIN      │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Find User     │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ bcrypt.compare│
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Generate JWT  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Frontend      │
│ stores token  │
└───────┬───────┘
        │
        ▼
 Authorization:
 Bearer <JWT>
        │
        ▼
┌───────────────┐
│ Auth          │
│ Middleware    │
└───────┬───────┘
        │
        ▼
   req.user.id
```

---

# 103. Authorization Flow Diagram

```text
Authenticated User
       │
       ▼
Requested Resource
       │
       ▼
Resolve Trip
       │
       ▼
Trip.userId
       │
       ▼
Compare with
req.user.id
       │
    ┌──┴───┐
    │      │
   YES     NO
    │      │
    ▼      ▼
 Continue  403
```

---

# 104. Item Ownership Diagram

```text
Itinerary Item
      │
      ▼
Trip Stop
      │
      ▼
Trip
      │
      ▼
userId
      │
      ▼
req.user.id
```

All authorization eventually reaches the Trip.

---

# 105. MVP Authentication Scope

Must implement:

```text
Signup
Login
JWT
bcrypt
Auth middleware
GET /auth/me
Ownership checks
Frontend auth state
Logout
```

Optional/deferred:

```text
Forgot password backend
Email verification
Refresh tokens
OAuth
Two-factor authentication
Complex roles
```

---

# 106. Final Auth Decision Table

| Topic | Decision |
|---|---|
| Authentication | JWT |
| Password hashing | bcrypt |
| JWT storage | localStorage for MVP |
| JWT payload | `userId` |
| Canonical request user | `req.user.id` |
| Token expiration | ~7 days |
| Refresh token | No |
| OAuth | No |
| Email verification | No |
| Ownership root | `Trip.userId` |
| Wrong owner | 403 |
| Missing resource | 404 |
| Missing/invalid auth | 401 |
| Public trip read | No auth |
| Public trip copy | Auth required |
| Frontend route guard | Yes |
| Backend auth enforcement | Always |

---

# 107. Final Authentication Principle

> Never trust the client to tell the backend who owns a resource.

Identity comes from:

```text
Verified JWT
```

Ownership comes from:

```text
PostgreSQL relations
```

Together:

```text
Verified JWT
     +
Trip.userId
     ↓
Authorization
```

This authentication and authorization design is considered **locked for the GlobeTrotter MVP**.