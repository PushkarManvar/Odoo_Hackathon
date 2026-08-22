# GlobeTrotter — API Error & Response Standard

## 1. Purpose

This document defines the standard API response and error format for GlobeTrotter.

Every backend module must use the same convention.

This prevents different modules from returning different structures such as:

```json
{
  "message": "Trip created"
}
```

while another returns:

```json
{
  "data": {}
}
```

and another returns:

```json
{
  "error": "Something went wrong"
}
```

Instead, GlobeTrotter uses one predictable response format across the entire API.

---

# 2. Core Rule

Every API response should follow one of two shapes:

```text
SUCCESS
```

or:

```text
FAILURE
```

The frontend should not need custom parsing logic for every feature.

---

# 3. Standard Success Response

Successful API responses use:

```json
{
  "success": true,
  "data": {}
}
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "trip_123",
    "name": "Rajasthan Explorer"
  }
}
```

---

# 4. Standard Failure Response

Failed API responses use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message."
  }
}
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STOP_DATE",
    "message": "Stop must be inside trip dates."
  }
}
```

---

# 5. Response Shape Must Be Stable

Do not return errors like:

```json
{
  "error": "Unauthorized"
}
```

or:

```json
{
  "message": "Unauthorized"
}
```

or:

```json
{
  "errors": []
}
```

unless the API contract explicitly extends the standard structure.

Prefer:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

---

# 6. Success Response Structure

Base type:

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
};
```

The `data` property contains the endpoint-specific result.

---

# 7. Error Response Structure

Base type:

```ts
type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
```

This should remain consistent across modules.

---

# 8. Optional Error Details

If validation requires additional structured information, the error object may optionally include:

```ts
details?: unknown;
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": {
      "startDate": "Start date is required."
    }
  }
}
```

Do not expose internal implementation details through `details`.

---

# 9. HTTP Status Codes

The API should use HTTP status codes correctly.

Primary statuses:

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 204 | Successful request with no body where intentionally used |
| 400 | Invalid request / business validation |
| 401 | Authentication required or invalid |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 409 | Conflict |
| 422 | Optional structured validation usage |
| 500 | Unexpected server failure |

The exact endpoint status remains defined by `API_CONTRACT.md`.

---

# 10. 200 — OK

Use `200 OK` for successful read or update operations.

Examples:

```text
GET /trips
GET /trips/:tripId
PATCH /trips/:tripId
GET /budget
```

Example:

```json
{
  "success": true,
  "data": {
    "name": "Rajasthan Explorer"
  }
}
```

---

# 11. 201 — Created

Use `201 Created` when a new resource is successfully created.

Examples:

```text
POST /auth/signup
POST /trips
POST /trips/:tripId/stops
POST itinerary item
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "trip_123"
  }
}
```

---

# 12. 204 — No Content

Use `204` only when the endpoint intentionally returns no response body.

However, GlobeTrotter may prefer returning a normal success body for consistency.

Example alternative:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

The final behavior must follow `API_CONTRACT.md`.

Do not randomly mix styles between modules.

---

# 13. 400 — Bad Request

Use `400` when the request is syntactically valid HTTP but violates input or domain rules.

Examples:

```text
Trip start date after end date
Stop outside trip dates
Invalid itinerary date
Missing required field
Invalid enum value
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TRIP_DATES",
    "message": "Trip start date must be before or equal to trip end date."
  }
}
```

---

# 14. 401 — Unauthorized

Use `401` when authentication is missing or invalid.

Examples:

```text
No JWT
Malformed JWT
Expired JWT
Invalid JWT
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

Do not use `403` when the user has not authenticated.

---

# 15. 403 — Forbidden

Use `403` when the user is authenticated but is not permitted to perform the action.

Example:

```text
User B attempts to modify User A's trip.
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

Authorization behavior must remain aligned with `AUTH_AND_AUTHORIZATION.md`.

---

# 16. 404 — Not Found

Use `404` when a requested resource does not exist or when the project's authorization rules intentionally expose the resource as not found.

Examples:

```text
Trip not found
Stop not found
Activity not found
Public itinerary not found
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip not found."
  }
}
```

---

# 17. 409 — Conflict

Use `409` for conflicts with existing state.

Common example:

```text
Signup with an email that already exists
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

Other conflicts should only use `409` where the API contract defines them.

---

# 18. 500 — Internal Server Error

Use `500` for unexpected failures.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

Never expose:

```text
Database password
Raw SQL
JWT secret
Stack trace
Internal filesystem paths
```

to the client.

---

# 19. Business Errors vs Server Errors

A validation failure is not a server crash.

Example:

```text
Stop date outside trip
```

should be:

```text
400
```

not:

```text
500
```

Likewise:

```text
Trip does not exist
```

should be:

```text
404
```

not:

```text
500
```

Use `500` only when the system encounters an unexpected failure.

---

# 20. Error Codes

Error codes are machine-readable identifiers.

Examples:

```text
UNAUTHORIZED
FORBIDDEN
TRIP_NOT_FOUND
INVALID_TRIP_DATES
INVALID_STOP_DATE
ACTIVITY_NOT_FOUND
EMAIL_ALREADY_EXISTS
```

Frontend code may use these codes to decide what UI behavior to show.

---

# 21. Error Code Naming

Use uppercase snake case.

GOOD:

```text
TRIP_NOT_FOUND
INVALID_STOP_DATE
EMAIL_ALREADY_EXISTS
```

Avoid:

```text
tripNotFound
trip-not-found
404_TRIP
TripMissing
```

Consistency matters.

---

# 22. Error Messages

Messages should be understandable to users and developers.

GOOD:

```text
"Stop must be inside trip dates."
```

Avoid:

```text
"Validation error in line 83."
```

or:

```text
"Prisma constraint P2003 failed."
```

Internal implementation errors must remain server-side.

---

# 23. Error Code Categories

Recommended categories:

```text
Authentication
Authorization
Validation
Resource
Conflict
Server
```

---

# 24. Authentication Error Codes

Recommended:

```text
UNAUTHORIZED
INVALID_CREDENTIALS
INVALID_TOKEN
TOKEN_EXPIRED
```

Exact usage must align with the auth implementation and API contract.

---

# 25. Signup/Login Errors

Examples:

```text
EMAIL_ALREADY_EXISTS
INVALID_CREDENTIALS
INVALID_EMAIL
INVALID_PASSWORD
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

Do not reveal whether an account exists during login unless the product explicitly requires it.

---

# 26. Authorization Errors

Recommended:

```text
FORBIDDEN
TRIP_ACCESS_DENIED
```

Prefer a small set of stable codes.

Do not create dozens of nearly identical authorization codes unless needed.

---

# 27. Trip Error Codes

Recommended:

```text
TRIP_NOT_FOUND
INVALID_TRIP_DATES
INVALID_TRIP_VISIBILITY
TRIP_ACCESS_DENIED
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TRIP_DATES",
    "message": "Trip start date must be before or equal to trip end date."
  }
}
```

---

# 28. Stop Error Codes

Recommended:

```text
STOP_NOT_FOUND
INVALID_STOP_DATE
INVALID_STOP_ORDER
STOP_OUTSIDE_TRIP
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STOP_DATE",
    "message": "Stop must be inside trip dates."
  }
}
```

---

# 29. City Errors

Recommended:

```text
CITY_NOT_FOUND
```

City search returning no results is not necessarily an error.

Example:

```json
{
  "success": true,
  "data": []
}
```

is usually better for search with zero matches.

---

# 30. Activity Errors

Recommended:

```text
ACTIVITY_NOT_FOUND
ACTIVITY_CITY_MISMATCH
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_CITY_MISMATCH",
    "message": "The selected activity does not belong to this stop's city."
  }
}
```

---

# 31. Itinerary Error Codes

Recommended:

```text
ITINERARY_ITEM_NOT_FOUND
INVALID_ITINERARY_DATE
INVALID_ACTIVITY_SELECTION
INVALID_CUSTOM_ACTIVITY
```

Business rules are defined in:

```text
BUSINESS_RULES.md
```

Error responses should represent those rules consistently.

---

# 32. Budget Errors

Budget calculation should usually fail only when required trip data cannot be retrieved or is inconsistent.

Possible code:

```text
BUDGET_CALCULATION_FAILED
```

Do not use this for ordinary zero-cost trips.

A trip with no costs may validly return:

```json
{
  "success": true,
  "data": {
    "activities": 0,
    "accommodation": 0,
    "transport": 0,
    "total": 0
  }
}
```

---

# 33. Sharing Errors

Recommended:

```text
TRIP_NOT_PUBLIC
PUBLIC_TRIP_NOT_FOUND
COPY_TRIP_FAILED
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_PUBLIC",
    "message": "This trip is not publicly accessible."
  }
}
```

---

# 34. Validation Error Strategy

Input validation should happen before business logic whenever possible.

Request flow:

```text
Request
  ↓
Schema/Input Validation
  ↓
Authentication
  ↓
Ownership
  ↓
Business Rules
  ↓
Service
```

The exact order may vary where authentication must happen first, but invalid data should not unnecessarily reach database operations.

---

# 35. Validation Library

If the project uses a validation library, every feature should use the same approach.

Do not mix:

```text
Manual validation
Zod
Joi
Yup
Custom schema system
```

randomly across modules.

The selected implementation must follow the project stack decisions.

---

# 36. Validation Response

A general validation error may look like:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid fields.",
    "details": {
      "name": "Trip name is required."
    }
  }
}
```

Or a specific domain code may be returned where more useful.

Example:

```text
INVALID_STOP_DATE
```

The API contract determines the preferred behavior per endpoint.

---

# 37. Shared Error Class

The backend should define a reusable application error class.

Conceptually:

```ts
class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
```

This is conceptual architecture.

Exact implementation belongs in the backend.

---

# 38. Throwing Application Errors

Feature services may throw:

```ts
throw new AppError(
  404,
  "TRIP_NOT_FOUND",
  "Trip not found."
);
```

or:

```ts
throw new AppError(
  400,
  "INVALID_STOP_DATE",
  "Stop must be inside trip dates."
);
```

This removes repetitive response-building logic from every service/controller.

---

# 39. Global Error Middleware

Express should have one global error-handling middleware.

Conceptual flow:

```text
Controller
   ↓
Service
   ↓
Error thrown
   ↓
Global Error Middleware
   ↓
Standard JSON response
```

This is preferable to every controller implementing separate error formatting.

---

# 40. Global Error Middleware Shape

Conceptually:

```ts
app.use(errorHandler);
```

The handler should:

```text
Recognize AppError
        ↓
Use status + code + message
        ↓
Return standard failure response
```

Unexpected errors:

```text
Unknown Error
     ↓
Log internally
     ↓
Return generic 500
```

---

# 41. Expected Application Error

Example:

```ts
if (!trip) {
  throw new AppError(
    404,
    "TRIP_NOT_FOUND",
    "Trip not found."
  );
}
```

Global middleware returns:

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip not found."
  }
}
```

---

# 42. Unexpected Error

Suppose Prisma/database throws an unexpected error.

Server:

```text
Log actual error internally
```

Client:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

Do not send the raw exception to the frontend.

---

# 43. Prisma Error Translation

Prisma-specific errors should not leak directly into the API.

Example raw internal error:

```text
P2002
```

should be translated where applicable into something meaningful like:

```text
EMAIL_ALREADY_EXISTS
```

or another domain-level conflict.

The API contract speaks in application terms, not ORM terms.

---

# 44. Database Constraint Errors

If the database catches something the application should have validated earlier:

```text
Database constraint failure
        ↓
Translate or handle safely
```

But ideally:

```text
Application validation
        ↓
Prevent invalid DB call
```

The database remains the final integrity layer.

---

# 45. Async Route Errors

Async controller errors must reach the global error middleware.

Do not leave rejected promises unhandled.

The project may use a shared async wrapper if needed.

Conceptually:

```ts
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Use one standard pattern across the backend.

---

# 46. Controllers

Controllers should remain thin.

Preferred:

```text
Read request
   ↓
Call service
   ↓
Return success
```

Errors should be thrown/forwarded to the global handler.

Avoid large `try/catch` blocks duplicated in every controller unless technically necessary.

---

# 47. Service Layer

Business-rule errors usually belong close to the business logic.

Example:

```text
Trip Service
   ↓
Validate trip dates
   ↓
Throw INVALID_TRIP_DATES
```

This keeps domain behavior reusable.

---

# 48. Ownership Error Flow

Example:

```text
PATCH /trips/:tripId
        ↓
Auth middleware
        ↓
assertTripOwnership()
        ↓
User does not own trip
        ↓
AppError
        ↓
Global middleware
        ↓
403 response
```

Use the shared ownership behavior defined in `AUTH_AND_AUTHORIZATION.md`.

---

# 49. Public Resource Error Flow

Example:

```text
GET /public/trips/:tripId
        ↓
Trip exists?
        ↓
Is PUBLIC?
```

If unavailable:

```text
Return behavior defined by API_CONTRACT.md
```

Do not create inconsistent public-resource behavior in the sharing module.

---

# 50. Error Logging

The server should log unexpected errors.

Useful internal log information may include:

```text
Timestamp
Request method
Request path
Error message
Stack trace
```

Do not log sensitive data unnecessarily.

---

# 51. Sensitive Information in Logs

Avoid logging:

```text
Passwords
Password hashes
JWT tokens
JWT secret
Full authorization headers
Database passwords
```

Especially around authentication failures.

---

# 52. Development vs Production Errors

Development logs may be more detailed.

Client response should still remain stable.

Example:

```text
Development Console:
Full Prisma error
```

while client receives:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

---

# 53. Frontend Error Handling

Frontend API code should expect:

```ts
{
  success: false,
  error: {
    code: string,
    message: string
  }
}
```

Then pages/components can display:

```text
error.message
```

instead of manually decoding every HTTP response.

---

# 54. Frontend Error Flow

```text
User Action
    ↓
API Request
    ↓
Success?
```

If yes:

```text
Update UI
```

If no:

```text
Read error.message
    ↓
Display useful feedback
```

---

# 55. Authentication Error Handling Frontend

For:

```text
401
```

the frontend may:

```text
Clear invalid auth state
        ↓
Redirect to login
```

where appropriate.

Do not redirect on ordinary `400` validation failures.

---

# 56. Forbidden Error Frontend

For:

```text
403
```

the frontend should not pretend the operation succeeded.

Possible behavior:

```text
Show permission error
```

or navigate away depending on the page.

---

# 57. Not Found Frontend

For:

```text
404
```

show an appropriate:

```text
Trip not found
Activity not found
Page unavailable
```

state.

Do not display a blank page.

---

# 58. Validation Error Frontend

For:

```text
400
```

keep user input where possible.

Example:

```text
Create Trip form
        ↓
Invalid dates
        ↓
Show error
        ↓
Keep trip name + entered values
```

Do not wipe the entire form unnecessarily.

---

# 59. User-Friendly Messages

API messages should usually be displayable directly.

GOOD:

```text
"Trip start date must be before or equal to trip end date."
```

Avoid technical messages:

```text
"startDate failed lt comparator against endDate"
```

---

# 60. Do Not Hide All Errors

Avoid frontend behavior like:

```text
Something went wrong
```

for every failure.

If the backend provides:

```text
INVALID_STOP_DATE
```

with:

```text
"Stop must be inside trip dates."
```

show that useful message.

---

# 61. Avoid Exposing Security Details

Authentication errors should remain sufficiently generic.

Example login failure:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

Prefer this over exposing:

```text
This email exists but password is wrong.
```

---

# 62. Delete Errors

If a resource is already missing:

```text
DELETE /trips/:id
```

should behave exactly as defined in `API_CONTRACT.md`.

Do not have one module return `404` while another silently treats it as successful unless that difference is intentional and documented.

---

# 63. Search Responses

No search results is usually a successful response.

Example:

```json
{
  "success": true,
  "data": []
}
```

Do not return:

```text
404
```

simply because:

```text
city search produced zero matches
```

unless specifically documented otherwise.

---

# 64. Empty Collections

Similarly:

```text
User has no trips
```

should usually return:

```json
{
  "success": true,
  "data": []
}
```

rather than an error.

An empty collection is valid application state.

---

# 65. Zero Budget

A budget of:

```text
0
```

is not an error.

Example:

```json
{
  "success": true,
  "data": {
    "activities": 0,
    "accommodation": 0,
    "transport": 0,
    "total": 0
  }
}
```

---

# 66. Request IDs

A request ID system is optional for the hackathon.

Do not add complex observability solely for error tracing unless needed.

If introduced later, it may be included safely without changing the core error contract.

---

# 67. Error Consistency Across Developers

Person A and Person B must not define competing error systems.

BAD:

```text
Person A:
throw new AppError(...)

Person B:
res.status(...).json({
  message: ...
})
```

Preferred:

```text
Both:
shared AppError
+
global error middleware
+
standard API response
```

---

# 68. Shared Error Files

The implementation may include shared files conceptually like:

```text
common/
├── errors/
│   ├── AppError.ts
│   └── errorCodes.ts
│
└── middleware/
    └── errorHandler.ts
```

Exact file locations must follow `PROJECT_STRUCTURE.md`.

---

# 69. Error Code Constants

Prefer defining reusable constants if it improves consistency.

Conceptually:

```ts
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
  INVALID_STOP_DATE: "INVALID_STOP_DATE"
} as const;
```

Do not create a giant abstraction if simple constants are sufficient.

---

# 70. Error Codes Are Contracts

Once frontend behavior depends on:

```text
INVALID_STOP_DATE
```

do not silently rename it to:

```text
STOP_DATE_INVALID
```

without updating:

```text
API_CONTRACT.md
Frontend
Tests
Documentation
```

Error codes are part of the frontend/backend contract.

---

# 71. Core Recommended Error Codes

Initial shared set:

```text
VALIDATION_ERROR

UNAUTHORIZED
INVALID_CREDENTIALS
INVALID_TOKEN
TOKEN_EXPIRED

FORBIDDEN

EMAIL_ALREADY_EXISTS

TRIP_NOT_FOUND
INVALID_TRIP_DATES
INVALID_TRIP_VISIBILITY

STOP_NOT_FOUND
INVALID_STOP_DATE
INVALID_STOP_ORDER

CITY_NOT_FOUND

ACTIVITY_NOT_FOUND
ACTIVITY_CITY_MISMATCH

ITINERARY_ITEM_NOT_FOUND
INVALID_ITINERARY_DATE
INVALID_ACTIVITY_SELECTION
INVALID_CUSTOM_ACTIVITY

TRIP_NOT_PUBLIC
PUBLIC_TRIP_NOT_FOUND
COPY_TRIP_FAILED

INTERNAL_SERVER_ERROR
```

Only use codes that correspond to real project behavior.

---

# 72. Business Rule Errors

`BUSINESS_RULES.md` defines whether an action is valid.

`ERROR_STANDARD.md` defines how an invalid action is communicated.

Example:

```text
BUSINESS_RULES.md

Activity date must be inside stop dates.
```

becomes:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ITINERARY_DATE",
    "message": "Activity date must be inside stop dates."
  }
}
```

---

# 73. Database Errors

`DATABASE_SCHEMA.md` defines integrity.

If a database constraint is violated unexpectedly:

```text
Prisma/Database Error
        ↓
Translate if recognized
        ↓
Otherwise 500
```

Do not expose Prisma internals.

---

# 74. API Contract Priority

Endpoint-specific behavior is defined in:

```text
API_CONTRACT.md
```

This document defines the shared convention.

Therefore:

```text
ERROR_STANDARD.md
→ How errors look
```

while:

```text
API_CONTRACT.md
→ Which error applies to which endpoint
```

---

# 75. Testing Error Responses

Every major feature should test:

```text
Happy path
Validation failure
Missing authentication
Wrong ownership
Missing resource
Unexpected failure where practical
```

Detailed testing belongs in:

```text
TESTING_PLAN.md
```

---

# 76. Authentication Test

Test:

```text
GET protected route
without token
```

Expected:

```text
401
```

with:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}
```

---

# 77. Ownership Test

Test:

```text
User B
PATCH User A's trip
```

Expected:

```text
403
```

or the specifically documented not-found behavior.

The response body must still follow the standard failure shape.

---

# 78. Date Validation Test

Example:

```text
Trip:
10 Oct → 15 Oct

Stop:
8 Oct → 12 Oct
```

Expected:

```text
400
```

with an appropriate code such as:

```text
INVALID_STOP_DATE
```

---

# 79. Not Found Test

Example:

```text
GET /trips/nonexistent-id
```

Expected:

```text
404
```

and:

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip not found."
  }
}
```

---

# 80. Conflict Test

Signup twice using the same email.

Expected:

```text
409
```

with:

```text
EMAIL_ALREADY_EXISTS
```

---

# 81. Copy Trip Error Safety

If Copy Trip fails midway:

```text
Create Trip
    ↓
Create Stops
    ↓
FAIL
```

the transaction should roll back.

Client receives a standard failure response.

It must not receive a successful response containing a partially created trip.

---

# 82. Do Not Swallow Errors

Avoid code like:

```ts
try {
  // ...
} catch {
  return null;
}
```

when the caller needs to know that the operation failed.

Errors should propagate to the correct layer and be translated into the standard response.

---

# 83. Do Not Over-Catch

Do not wrap every tiny function in `try/catch`.

Use:

```text
Domain validation
+
Shared AppError
+
Global handler
```

to keep control flow understandable.

---

# 84. Development Debugging

During development, server console logs should make it possible to identify:

```text
Which request failed
Which module failed
Actual error
```

while still returning safe client responses.

---

# 85. Success Helper

A small response helper may optionally be used.

Conceptually:

```ts
return res.status(200).json({
  success: true,
  data
});
```

Do not over-engineer a large response framework.

---

# 86. Error Helper

Errors should normally flow through:

```text
AppError
+
Global Error Middleware
```

rather than manually building error responses everywhere.

---

# 87. Response Data Naming

Use endpoint-specific fields inside `data` only where useful.

Example:

```json
{
  "success": true,
  "data": {
    "trip": {}
  }
}
```

or:

```json
{
  "success": true,
  "data": {}
}
```

The exact nested structure must match `API_CONTRACT.md`.

Do not change it casually.

---

# 88. Pagination Errors

If pagination is later introduced, invalid query values should follow the same validation convention.

Example:

```text
page = -3
```

could return:

```text
400 VALIDATION_ERROR
```

Pagination itself is not a reason to invent a new error format.

---

# 89. Query Parameter Errors

Invalid:

```text
category
sort
date
search filters
```

should use standard validation responses.

Unknown optional search values may instead return empty results where appropriate according to the API contract.

---

# 90. Unknown Routes

Express should eventually include a fallback for unknown API routes.

Example:

```text
GET /does-not-exist
```

Response may use:

```text
404
```

with:

```json
{
  "success": false,
  "error": {
    "code": "ROUTE_NOT_FOUND",
    "message": "API route not found."
  }
}
```

If used, `ROUTE_NOT_FOUND` should be part of the shared error-code set.

---

# 91. Malformed JSON

Malformed request JSON should produce a safe client error rather than crash the server.

Use the global Express error flow to normalize it where possible.

Do not expose parser stack traces.

---

# 92. Large Request Bodies

The project does not require large uploads.

Reasonable body-size limits may be configured.

If exceeded, return a safe standardized failure instead of crashing.

This is secondary to the core hackathon functionality.

---

# 93. Security Error Rule

Never send detailed security internals to clients.

Client needs:

```text
What happened
+
What they can understand
```

not:

```text
How the security implementation works internally
```

---

# 94. Client Should Not Depend on English Message

Frontend logic should primarily use:

```text
error.code
```

when conditional behavior is needed.

Messages are for display.

Example:

```text
401 + UNAUTHORIZED
```

may trigger login behavior.

Do not write logic like:

```text
if message === "Authentication is required."
```

---

# 95. Error Response Example — Auth

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect."
  }
}
```

---

# 96. Error Response Example — Trip

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_FOUND",
    "message": "Trip not found."
  }
}
```

---

# 97. Error Response Example — Ownership

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action."
  }
}
```

---

# 98. Error Response Example — Stop

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STOP_DATE",
    "message": "Stop must be inside trip dates."
  }
}
```

---

# 99. Error Response Example — Activity

```json
{
  "success": false,
  "error": {
    "code": "ACTIVITY_CITY_MISMATCH",
    "message": "The selected activity does not belong to this stop's city."
  }
}
```

---

# 100. Error Response Example — Itinerary

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ITINERARY_DATE",
    "message": "Activity date must be inside stop dates."
  }
}
```

---

# 101. Error Response Example — Sharing

```json
{
  "success": false,
  "error": {
    "code": "TRIP_NOT_PUBLIC",
    "message": "This trip is not publicly accessible."
  }
}
```

---

# 102. Error Response Example — Server

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred."
  }
}
```

---

# 103. Shared Backend Flow

```text
Incoming Request
       ↓
Validation
       ↓
Authentication
       ↓
Authorization
       ↓
Controller
       ↓
Service
       ↓
Prisma
       ↓
Success
```

Any expected error:

```text
AppError
   ↓
Global Error Handler
   ↓
Standard Failure Response
```

Unexpected error:

```text
Unknown Exception
      ↓
Internal Log
      ↓
Global Error Handler
      ↓
500 Standard Failure
```

---

# 104. Final Response Model

```text
                  API RESPONSE

              ┌───────────────┐
              │    success    │
              └───────┬───────┘
                      │
            ┌─────────┴─────────┐
            │                   │
           true                false
            │                   │
            ▼                   ▼
      ┌──────────┐        ┌──────────┐
      │   data   │        │  error   │
      └──────────┘        │          │
                          │ code     │
                          │ message  │
                          │ details? │
                          └──────────┘
```

---

# 105. Final Rule

Every endpoint must answer these questions consistently:

```text
Did it succeed?
        ↓
success
```

If yes:

```text
What data should the client receive?
        ↓
data
```

If no:

```text
What kind of error occurred?
        ↓
error.code
```

and:

```text
What should the user understand?
        ↓
error.message
```

The core standard is therefore:

```json
{
  "success": true,
  "data": {}
}
```

or:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message."
  }
}
```

No backend module should invent a competing response convention.