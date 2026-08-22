# GlobeTrotter
## REST API Contract

**Document:** `05_API_CONTRACT.md`  
**Status:** Locked for MVP  
**API Style:** REST  
**Data Format:** JSON  
**Base URL:** `/api`

---

# 1. Purpose

This document defines the exact contract between the GlobeTrotter frontend and backend.

It is the source of truth for:

- Endpoints
- HTTP methods
- Authentication requirements
- Request bodies
- Query parameters
- Response structures
- Validation behavior
- Status codes
- Error codes
- Public/private route boundaries

The goal is simple:

> Frontend and backend should be able to work independently without guessing each other's data shape.

---

# 2. Base URL

Local backend:

```text
http://localhost:4000
```

API base:

```text
/api
```

Example:

```text
http://localhost:4000/api/trips
```

---

# 3. General Response Format

Successful requests use:

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
    "id": "trip-id",
    "name": "Rajasthan Trip"
  }
}
```

---

# 4. Error Response Format

All errors use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message."
  }
}
```

Optional validation details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": {
      "name": "Trip name is required."
    }
  }
}
```

---

# 5. Authentication Header

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# 6. Authentication Failure

Missing/invalid token:

```http
401 Unauthorized
```

Response:

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

# 7. Authorization Failure

If user is authenticated but doesn't own the requested resource:

```http
403 Forbidden
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource."
  }
}
```

---

# 8. Common Status Codes

```text
200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

# 9. Date Format

All date-only values sent through API use:

```text
YYYY-MM-DD
```

Example:

```text
2026-10-01
```

Do not send timezone timestamps for calendar dates.

---

# 10. Time Format

Activity start time:

```text
HH:mm
```

24-hour format.

Examples:

```text
09:00
13:30
18:45
```

---

# 11. Money Format

Money is sent as integer values.

Example:

```json
{
  "plannedBudget": 50000
}
```

means:

```text
₹50,000
```

for an INR trip.

---

# 12. Authentication Routes

## POST `/api/auth/signup`

Creates a new user.

### Authentication

```text
Public
```

### Request

```json
{
  "name": "Nishant",
  "email": "nishant@example.com",
  "password": "strongpassword"
}
```

### Validation

- `name` required
- `email` valid
- email normalized to lowercase
- password required
- duplicate email rejected

### Success

```http
201 Created
```

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

### Errors

```text
VALIDATION_ERROR
EMAIL_ALREADY_EXISTS
INTERNAL_SERVER_ERROR
```

---

# 13. POST `/api/auth/login`

Authenticates a user.

### Authentication

```text
Public
```

### Request

```json
{
  "email": "nishant@example.com",
  "password": "strongpassword"
}
```

### Success

```http
200 OK
```

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

### Invalid credentials

```http
401 Unauthorized
```

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password."
  }
}
```

---

# 14. GET `/api/auth/me`

Returns the current authenticated user.

### Authentication

```text
Required
```

### Success

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Nishant",
    "email": "nishant@example.com"
  }
}
```

This endpoint helps restore frontend auth state after refresh.

---

# 15. Trip Routes

All trip-management routes require authentication.

---

# 16. GET `/api/trips`

Returns trips owned by the logged-in user.

### Authentication

```text
Required
```

### Optional Query Parameters

```text
status=upcoming|past|current
```

Status filtering is optional for MVP.

### Success

```json
{
  "success": true,
  "data": [
    {
      "id": "trip-1",
      "name": "Rajasthan Heritage Trip",
      "description": "7 day Rajasthan journey",
      "startDate": "2026-10-01",
      "endDate": "2026-10-07",
      "coverImageUrl": null,
      "plannedBudget": 40000,
      "currency": "INR",
      "visibility": "PRIVATE",
      "stopCount": 3,
      "createdAt": "2026-08-22T04:00:00.000Z"
    }
  ]
}
```

### Ordering

Recommended:

```text
startDate ASC
```

for upcoming trips.

Exact dashboard sorting can be handled separately.

---

# 17. POST `/api/trips`

Creates a trip.

### Authentication

```text
Required
```

### Request

```json
{
  "name": "Rajasthan Heritage Trip",
  "description": "7 day Rajasthan journey",
  "startDate": "2026-10-01",
  "endDate": "2026-10-07",
  "coverImageUrl": null,
  "plannedBudget": 40000,
  "transportCost": 8000,
  "stayCost": 12000,
  "mealCost": 6000,
  "currency": "INR"
}
```

### Required Fields

```text
name
startDate
endDate
```

### Optional Fields

```text
description
coverImageUrl
plannedBudget
transportCost
stayCost
mealCost
currency
```

### Important

`userId` must **not** be accepted from frontend.

Owner is always:

```text
authenticated user
```

### Validation

```text
startDate <= endDate
costs >= 0
plannedBudget >= 0 if present
```

### Success

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "id": "trip-id",
    "name": "Rajasthan Heritage Trip",
    "description": "7 day Rajasthan journey",
    "startDate": "2026-10-01",
    "endDate": "2026-10-07",
    "plannedBudget": 40000,
    "transportCost": 8000,
    "stayCost": 12000,
    "mealCost": 6000,
    "currency": "INR",
    "visibility": "PRIVATE",
    "shareSlug": null
  }
}
```

### Errors

```text
VALIDATION_ERROR
INVALID_TRIP_DATE_RANGE
```

---

# 18. GET `/api/trips/:tripId`

Returns full private trip detail.

### Authentication

```text
Required
```

### Ownership

Required.

### Success

```json
{
  "success": true,
  "data": {
    "id": "trip-id",
    "name": "Rajasthan Heritage Trip",
    "description": "7 day Rajasthan journey",
    "startDate": "2026-10-01",
    "endDate": "2026-10-07",
    "coverImageUrl": null,
    "plannedBudget": 40000,
    "transportCost": 8000,
    "stayCost": 12000,
    "mealCost": 6000,
    "currency": "INR",
    "visibility": "PRIVATE",
    "shareSlug": null,
    "stops": [
      {
        "id": "stop-1",
        "sequenceOrder": 1,
        "arrivalDate": "2026-10-01",
        "departureDate": "2026-10-03",
        "notes": null,
        "city": {
          "id": "city-jaipur",
          "name": "Jaipur",
          "country": "India",
          "region": "Rajasthan",
          "imageUrl": null
        },
        "items": [
          {
            "id": "item-1",
            "activityId": "activity-1",
            "customName": null,
            "customCost": 600,
            "date": "2026-10-01",
            "startTime": "09:00",
            "durationMins": 180,
            "sequenceOrder": 1,
            "notes": "Go early",
            "activity": {
              "id": "activity-1",
              "name": "Amber Fort",
              "category": "SIGHTSEEING",
              "estimatedCost": 500,
              "durationMins": 180
            }
          }
        ]
      }
    ]
  }
}
```

This nested response should be sufficient for:

- Builder
- Itinerary view
- Calendar
- Most trip-detail UI

---

# 19. PATCH `/api/trips/:tripId`

Updates trip information.

### Authentication

Required.

### Ownership

Required.

### Request Example

```json
{
  "name": "Updated Rajasthan Trip",
  "endDate": "2026-10-08",
  "plannedBudget": 45000
}
```

All fields are optional.

### Allowed Fields

```text
name
description
startDate
endDate
coverImageUrl
plannedBudget
transportCost
stayCost
mealCost
currency
```

Visibility is not updated through this route.

Sharing has dedicated endpoints.

### Validation

If trip dates change, backend must ensure all existing stops remain valid.

If they would become invalid, reject update.

### Error Example

```json
{
  "success": false,
  "error": {
    "code": "TRIP_DATE_CONFLICT",
    "message": "Existing trip stops fall outside the new trip date range."
  }
}
```

---

# 20. DELETE `/api/trips/:tripId`

Deletes trip.

### Authentication

Required.

### Ownership

Required.

### Behavior

Cascade deletes:

```text
TripStops
ItineraryItems
```

Does not delete:

```text
Cities
Activities
```

### Success

```http
204 No Content
```

---

# 21. City Routes

---

# 22. GET `/api/cities`

Searches/browses cities.

### Authentication

Optional.

For MVP this may remain public.

### Query Parameters

```text
search=
country=
region=
sort=popularity|name
limit=
```

Example:

```text
/api/cities?search=jai&country=India
```

### Success

```json
{
  "success": true,
  "data": [
    {
      "id": "city-jaipur",
      "name": "Jaipur",
      "country": "India",
      "region": "Rajasthan",
      "costIndex": 2,
      "popularityScore": 92,
      "imageUrl": "..."
    }
  ]
}
```

---

# 23. GET `/api/cities/:cityId`

Returns one city.

### Success

```json
{
  "success": true,
  "data": {
    "id": "city-jaipur",
    "name": "Jaipur",
    "country": "India",
    "region": "Rajasthan",
    "costIndex": 2,
    "popularityScore": 92,
    "imageUrl": "..."
  }
}
```

---

# 24. GET `/api/cities/:cityId/activities`

Returns activities belonging to city.

### Query Parameters

```text
search=
category=
maxCost=
maxDuration=
sort=cost|name|duration
```

Example:

```text
/api/cities/city-jaipur/activities?category=SIGHTSEEING&maxCost=700
```

### Success

```json
{
  "success": true,
  "data": [
    {
      "id": "activity-1",
      "cityId": "city-jaipur",
      "name": "Amber Fort",
      "description": "Historic hilltop fort.",
      "category": "SIGHTSEEING",
      "estimatedCost": 500,
      "durationMins": 180,
      "imageUrl": "..."
    }
  ]
}
```

---

# 25. Trip Stop Routes

---

# 26. POST `/api/trips/:tripId/stops`

Adds city stop to trip.

### Authentication

Required.

### Ownership

Required.

### Request

```json
{
  "cityId": "city-jaipur",
  "arrivalDate": "2026-10-01",
  "departureDate": "2026-10-03",
  "notes": "First stop"
}
```

`sequenceOrder` should preferably be determined by backend when appending.

Example:

```text
existing stop count + 1
```

This reduces frontend responsibility.

### Validation

- City exists
- User owns trip
- Arrival ≤ departure
- Dates inside trip range
- Costs not relevant here

### Success

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "id": "stop-id",
    "tripId": "trip-id",
    "sequenceOrder": 1,
    "arrivalDate": "2026-10-01",
    "departureDate": "2026-10-03",
    "notes": "First stop",
    "city": {
      "id": "city-jaipur",
      "name": "Jaipur",
      "country": "India"
    }
  }
}
```

### Errors

```text
TRIP_NOT_FOUND
CITY_NOT_FOUND
FORBIDDEN
INVALID_STOP_DATE_RANGE
STOP_OUTSIDE_TRIP_RANGE
```

---

# 27. PATCH `/api/stops/:stopId`

Updates a stop.

### Authentication

Required.

### Ownership

Resolved through:

```text
Stop → Trip → User
```

### Request

```json
{
  "arrivalDate": "2026-10-02",
  "departureDate": "2026-10-04",
  "notes": "Updated Jaipur stay"
}
```

### Validation

If stop dates change, existing itinerary items must remain inside the new range.

If not, reject.

### Error

```text
STOP_DATE_CONFLICT
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "STOP_DATE_CONFLICT",
    "message": "Existing itinerary items fall outside the new stop date range."
  }
}
```

---

# 28. DELETE `/api/stops/:stopId`

Deletes stop.

### Authentication

Required.

### Ownership

Required.

### Behavior

Deletes:

```text
TripStop
+
its ItineraryItems
```

Remaining stop sequence should be normalized.

Example:

Before:

```text
1 Jaipur
2 Jodhpur
3 Udaipur
```

Delete Jodhpur:

```text
1 Jaipur
2 Udaipur
```

### Success

```http
204 No Content
```

---

# 29. PATCH `/api/trips/:tripId/stops/reorder`

Reorders all stops.

Using a dedicated route is cleaner than repeatedly patching each stop.

### Authentication

Required.

### Ownership

Required.

### Request

```json
{
  "stopIds": [
    "stop-jaipur",
    "stop-udaipur",
    "stop-jodhpur"
  ]
}
```

Array position determines sequence.

Equivalent:

```text
Jaipur  → 1
Udaipur → 2
Jodhpur → 3
```

### Validation

- Every supplied stop belongs to trip
- No duplicate IDs
- No missing trip stops if contract requires full reorder

For MVP, require all trip stops to be included.

### Success

```json
{
  "success": true,
  "data": [
    {
      "id": "stop-jaipur",
      "sequenceOrder": 1
    },
    {
      "id": "stop-udaipur",
      "sequenceOrder": 2
    },
    {
      "id": "stop-jodhpur",
      "sequenceOrder": 3
    }
  ]
}
```

Must run in a transaction.

---

# 30. Itinerary Item Routes

---

# 31. POST `/api/stops/:stopId/items`

Adds itinerary item.

Supports:

- Master Activity
- Custom Item

---

# 32. Add Existing Activity

Request:

```json
{
  "activityId": "activity-amber-fort",
  "date": "2026-10-01",
  "startTime": "09:00",
  "durationMins": 150,
  "customCost": 600,
  "notes": "Arrive early"
}
```

Backend may automatically determine `sequenceOrder`.

---

# 33. Add Custom Item

Request:

```json
{
  "customName": "Dinner with friends",
  "customCost": 900,
  "date": "2026-10-01",
  "startTime": "20:00",
  "durationMins": 120,
  "notes": null
}
```

---

# 34. Itinerary Item Validation

Required:

```text
activityId OR customName
```

At least one.

If `activityId` exists:

```text
Activity.cityId == TripStop.cityId
```

Also:

```text
stop.arrivalDate
<=
item.date
<=
stop.departureDate
```

Cost:

```text
customCost >= 0 if present
```

Duration:

```text
durationMins > 0 if present
```

Time:

```text
HH:mm
```

---

# 35. Itinerary Item Success

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "id": "item-id",
    "tripStopId": "stop-id",
    "activityId": "activity-amber-fort",
    "customName": null,
    "customCost": 600,
    "date": "2026-10-01",
    "startTime": "09:00",
    "durationMins": 150,
    "sequenceOrder": 1,
    "notes": "Arrive early",
    "activity": {
      "id": "activity-amber-fort",
      "name": "Amber Fort",
      "category": "SIGHTSEEING",
      "estimatedCost": 500
    }
  }
}
```

---

# 36. PATCH `/api/items/:itemId`

Updates itinerary item.

### Authentication

Required.

### Ownership

Resolved:

```text
Item
 ↓
Stop
 ↓
Trip
 ↓
User
```

### Request Example

```json
{
  "date": "2026-10-02",
  "startTime": "10:00",
  "customCost": 700,
  "notes": "Updated"
}
```

### Validation

All creation validation still applies.

---

# 37. DELETE `/api/items/:itemId`

Deletes itinerary item.

### Authentication

Required.

### Ownership

Required.

### Success

```http
204 No Content
```

Sequence normalization may be performed for remaining items on that date.

---

# 38. PATCH `/api/stops/:stopId/items/reorder`

Reorders itinerary items for one date.

### Request

```json
{
  "date": "2026-10-01",
  "itemIds": [
    "item-amber",
    "item-lunch",
    "item-hawa-mahal"
  ]
}
```

### Success

```json
{
  "success": true,
  "data": [
    {
      "id": "item-amber",
      "sequenceOrder": 1
    },
    {
      "id": "item-lunch",
      "sequenceOrder": 2
    },
    {
      "id": "item-hawa-mahal",
      "sequenceOrder": 3
    }
  ]
}
```

Optional for first MVP pass, but contract is defined now.

---

# 39. Budget Routes

---

# 40. GET `/api/trips/:tripId/budget`

Returns calculated budget.

### Authentication

Required.

### Ownership

Required.

### Calculation Inputs

```text
Trip.plannedBudget
Trip.transportCost
Trip.stayCost
Trip.mealCost

+

ItineraryItem effective cost
```

Effective item cost:

```text
customCost
??
Activity.estimatedCost
??
0
```

---

# 41. Budget Response

```json
{
  "success": true,
  "data": {
    "currency": "INR",
    "plannedBudget": 40000,
    "estimatedTotal": 31000,
    "remaining": 9000,
    "averagePerDay": 4428.57,
    "isOverBudget": false,
    "breakdown": {
      "transport": 8000,
      "stay": 12000,
      "meals": 6000,
      "activities": 5000
    },
    "breakdownByStop": [
      {
        "stopId": "stop-jaipur",
        "cityName": "Jaipur",
        "cost": 2500
      },
      {
        "stopId": "stop-jodhpur",
        "cityName": "Jodhpur",
        "cost": 1200
      },
      {
        "stopId": "stop-udaipur",
        "cityName": "Udaipur",
        "cost": 1300
      }
    ],
    "breakdownByCategory": [
      {
        "category": "SIGHTSEEING",
        "cost": 3000
      },
      {
        "category": "FOOD",
        "cost": 1000
      },
      {
        "category": "OTHER",
        "cost": 1000
      }
    ]
  }
}
```

---

# 42. Custom Items in Category Breakdown

Custom items have no master category.

For MVP place their costs under:

```text
OTHER
```

This behavior is locked unless schema later adds custom category.

---

# 43. Average Per Day

Calculation:

```text
trip day count =
endDate - startDate + 1
```

Then:

```text
averagePerDay =
estimatedTotal / dayCount
```

---

# 44. No Budget Mutation Endpoint

There is no endpoint such as:

```text
POST /budget
```

Budget is derived.

Trip-level cost values are updated through:

```text
PATCH /api/trips/:tripId
```

---

# 45. Calendar / Timeline Route

A dedicated endpoint is optional because trip detail already contains required information.

For simplicity, the frontend can derive calendar from:

```text
GET /api/trips/:tripId
```

However, if frontend benefits from grouped data:

---

# 46. GET `/api/trips/:tripId/timeline`

Optional convenience endpoint.

### Authentication

Required.

### Response

```json
{
  "success": true,
  "data": {
    "2026-10-01": [
      {
        "id": "item-1",
        "name": "Amber Fort",
        "startTime": "09:00",
        "durationMins": 180,
        "city": "Jaipur",
        "cost": 600
      },
      {
        "id": "item-2",
        "name": "Lunch",
        "startTime": "13:00",
        "durationMins": 60,
        "city": "Jaipur",
        "cost": 500
      }
    ]
  }
}
```

This endpoint is **optional**, not required for first backend pass.

---

# 47. Sharing Routes

---

# 48. POST `/api/trips/:tripId/share`

Publishes a trip.

### Authentication

Required.

### Ownership

Required.

### Request

No body required.

```json
{}
```

### Behavior

If private:

```text
generate unique slug
visibility = PUBLIC
```

If already public:

return current slug rather than generating a new one.

### Success

```json
{
  "success": true,
  "data": {
    "visibility": "PUBLIC",
    "shareSlug": "rajasthan-trip-a7k92p",
    "publicPath": "/public/rajasthan-trip-a7k92p"
  }
}
```

Backend should preferably return a path rather than hard-code frontend host into business logic.

---

# 49. DELETE `/api/trips/:tripId/share`

Makes trip private.

### Authentication

Required.

### Ownership

Required.

### Behavior

Recommended:

```text
visibility = PRIVATE
shareSlug = null
```

This invalidates the previous public URL.

### Success

```json
{
  "success": true,
  "data": {
    "visibility": "PRIVATE",
    "shareSlug": null
  }
}
```

---

# 50. GET `/api/public/:slug`

Returns a public itinerary.

### Authentication

```text
Not required
```

### Requirements

Trip must:

```text
exist
AND
visibility = PUBLIC
```

### Public Response

```json
{
  "success": true,
  "data": {
    "id": "trip-id",
    "name": "Rajasthan Heritage Trip",
    "description": "7 day Rajasthan journey",
    "startDate": "2026-10-01",
    "endDate": "2026-10-07",
    "coverImageUrl": null,
    "currency": "INR",
    "owner": {
      "name": "Nishant"
    },
    "stops": [
      {
        "id": "stop-1",
        "sequenceOrder": 1,
        "arrivalDate": "2026-10-01",
        "departureDate": "2026-10-03",
        "city": {
          "name": "Jaipur",
          "country": "India",
          "region": "Rajasthan"
        },
        "items": [
          {
            "id": "item-1",
            "name": "Amber Fort",
            "date": "2026-10-01",
            "startTime": "09:00",
            "durationMins": 180,
            "cost": 600,
            "category": "SIGHTSEEING"
          }
        ]
      }
    ],
    "budget": {
      "estimatedTotal": 31000,
      "currency": "INR"
    }
  }
}
```

---

# 51. Public Response Security

Never return:

```text
owner.email
passwordHash
JWT
internal ownership metadata
```

unless intentionally added to product later.

---

# 52. POST `/api/public/:slug/copy`

Copies a public trip into current user's account.

### Authentication

Required.

### Source Trip

Must:

```text
exist
AND
visibility = PUBLIC
```

### Request

No body required for MVP.

```json
{}
```

### Behavior

Deep copy:

```text
Trip
TripStops
ItineraryItems
```

Do not duplicate:

```text
Cities
Activities
```

### New Trip

Must have:

```text
new id
current userId
visibility = PRIVATE
shareSlug = null
```

---

# 53. Copy Success

```http
201 Created
```

```json
{
  "success": true,
  "data": {
    "trip": {
      "id": "new-trip-id",
      "name": "Rajasthan Heritage Trip",
      "visibility": "PRIVATE",
      "shareSlug": null
    }
  }
}
```

Frontend can redirect to:

```text
/trips/new-trip-id/edit
```

---

# 54. Copy Transaction Requirement

The entire operation runs inside:

```text
prisma.$transaction()
```

All-or-nothing.

---

# 55. User Profile Routes

The original product includes settings/profile functionality.

For MVP keep this small.

---

# 56. GET `/api/profile`

### Authentication

Required.

### Success

```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "Nishant",
    "email": "nishant@example.com"
  }
}
```

---

# 57. PATCH `/api/profile`

### Authentication

Required.

### Request

MVP:

```json
{
  "name": "Nishant Khatri"
}
```

Email editing may be deferred because it introduces duplicate-email and reauthentication concerns.

---

# 58. DELETE `/api/profile`

Deletes current user's account.

### Authentication

Required.

### Behavior

Cascade:

```text
User
 ↓
Trips
 ↓
Stops
 ↓
Items
```

### Success

```http
204 No Content
```

Frontend must clear token after successful deletion.

---

# 59. Dashboard Endpoint

A dedicated dashboard endpoint is not required initially.

Frontend can use:

```text
GET /api/trips
```

and existing data.

If later needed:

```text
GET /api/dashboard
```

may aggregate:

- Upcoming trips
- Recent trips
- Popular cities
- Budget highlights

Do not build until it saves real frontend complexity.

---

# 60. Admin API

Admin analytics is optional in the original PS.

Therefore no admin endpoints belong to the protected MVP API.

Future routes could include:

```text
/api/admin/stats
/api/admin/users
```

but they are explicitly deferred.

---

# 61. Endpoint Summary

## Authentication

```text
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
```

---

## Trips

```text
GET    /api/trips
POST   /api/trips
GET    /api/trips/:tripId
PATCH  /api/trips/:tripId
DELETE /api/trips/:tripId
```

---

## Stops

```text
POST   /api/trips/:tripId/stops
PATCH  /api/stops/:stopId
DELETE /api/stops/:stopId

PATCH  /api/trips/:tripId/stops/reorder
```

---

## Discovery

```text
GET /api/cities
GET /api/cities/:cityId
GET /api/cities/:cityId/activities
```

---

## Itinerary

```text
POST   /api/stops/:stopId/items
PATCH  /api/items/:itemId
DELETE /api/items/:itemId

PATCH /api/stops/:stopId/items/reorder
```

---

## Budget

```text
GET /api/trips/:tripId/budget
```

---

## Timeline

Optional:

```text
GET /api/trips/:tripId/timeline
```

---

## Sharing

```text
POST   /api/trips/:tripId/share
DELETE /api/trips/:tripId/share

GET    /api/public/:slug
POST   /api/public/:slug/copy
```

---

## Profile

```text
GET    /api/profile
PATCH  /api/profile
DELETE /api/profile
```

---

# 62. Route Authentication Matrix

| Endpoint | Auth |
|---|---|
| Signup | Public |
| Login | Public |
| Auth Me | Required |
| Trip CRUD | Required |
| Add/Edit/Delete Stop | Required |
| City Search | Public |
| Activity Search | Public |
| Itinerary mutations | Required |
| Budget | Required |
| Publish/Unpublish | Required |
| Public Trip | Public |
| Copy Public Trip | Required |
| Profile | Required |

---

# 63. Ownership Matrix

| Resource | Ownership Path |
|---|---|
| Trip | `Trip.userId` |
| TripStop | `TripStop → Trip → userId` |
| ItineraryItem | `Item → Stop → Trip → userId` |
| Budget | `Trip.userId` |
| Publish | `Trip.userId` |
| Public Trip | No ownership required |
| Copy Public | Source is public; destination owner is current user |

---

# 64. Core Error Codes

Authentication:

```text
UNAUTHORIZED
INVALID_CREDENTIALS
```

Authorization:

```text
FORBIDDEN
```

Validation:

```text
VALIDATION_ERROR
INVALID_TRIP_DATE_RANGE
INVALID_STOP_DATE_RANGE
STOP_OUTSIDE_TRIP_RANGE
INVALID_ITEM_DATE
INVALID_ACTIVITY_CITY
INVALID_TIME_FORMAT
INVALID_COST
```

Conflict:

```text
EMAIL_ALREADY_EXISTS
TRIP_DATE_CONFLICT
STOP_DATE_CONFLICT
```

Missing resources:

```text
USER_NOT_FOUND
TRIP_NOT_FOUND
STOP_NOT_FOUND
CITY_NOT_FOUND
ACTIVITY_NOT_FOUND
ITEM_NOT_FOUND
PUBLIC_TRIP_NOT_FOUND
```

System:

```text
INTERNAL_SERVER_ERROR
```

---

# 65. Pagination

The MVP city/activity dataset is small.

Pagination is not mandatory.

Optional query:

```text
limit=
offset=
```

may be added later.

Do not add pagination complexity unless the seed dataset grows enough to need it.

---

# 66. Search Matching

For MVP, city/activity search should be case-insensitive.

Example:

```text
jaipur
JAIPUR
Jaipur
```

should return the same result.

---

# 67. Empty Search

```text
GET /api/cities
```

should return a sensible default list.

Recommended:

```text
popularityScore DESC
```

This powers recommended/popular destinations without another endpoint.

---

# 68. API Ordering Rules

Trip stops:

```text
sequenceOrder ASC
```

Itinerary items:

```text
date ASC
then sequenceOrder ASC
```

Cities default:

```text
popularityScore DESC
```

Activities default:

```text
name ASC
```

unless filters/sort specify otherwise.

---

# 69. Null vs Zero

Important API rule:

```text
null
```

and:

```text
0
```

must remain distinct.

Example:

```json
{
  "customCost": 0
}
```

means explicitly free.

```json
{
  "customCost": null
}
```

means use master activity cost if one exists.

---

# 70. Request Fields Must Be Whitelisted

Backend must ignore or reject unexpected authority fields such as:

```text
userId
createdAt
updatedAt
passwordHash
```

Do not blindly pass:

```text
req.body
```

into Prisma create/update operations.

Use validated DTOs.

---

# 71. Response Data Safety

Never directly serialize whole Prisma User records when password hash is present.

Explicitly select/map:

```text
id
name
email
```

only.

---

# 72. Idempotency Decisions

### `POST /trips/:tripId/share`

Should be effectively idempotent.

If already public:

return existing share slug.

Do not generate a new URL every click.

### `DELETE /trips/:tripId/share`

If already private:

may return current private state rather than error.

This makes frontend interaction easier.

---

# 73. Delete Confirmation

Delete confirmation is a frontend UX responsibility.

Backend should not require a special confirmation string for hackathon MVP.

---

# 74. API Contract Rule

Once frontend integration begins:

> Field names in this document should not change casually.

Bad mid-hackathon changes:

```text
sequenceOrder → order
plannedBudget → budget
tripStopId → stopId
```

because they break frontend/backend integration.

If a change is necessary:

1. Update contract.
2. Update backend.
3. Notify frontend.
4. Update shared types.

---

# 75. Shared Types

If useful in the monorepo, common request/response types may later live in:

```text
packages/shared/
```

Do not move Prisma-generated types directly into frontend.

Frontend contracts should represent API shapes, not DB internals.

---

# 76. API Development Priority

Build endpoints in this order:

```text
1. Signup/Login
2. Trips CRUD
3. City Search
4. Stops
5. Activity Search
6. Itinerary Items
7. Budget
8. Sharing
9. Copy Trip
10. Profile
11. Optional timeline convenience endpoint
```

This follows feature dependencies.

---

# 77. Minimum Backend Demo Contract

If time becomes critical, the following endpoints must work:

```text
POST /api/auth/signup
POST /api/auth/login

GET  /api/trips
POST /api/trips
GET  /api/trips/:tripId

GET  /api/cities

POST /api/trips/:tripId/stops

GET  /api/cities/:cityId/activities

POST /api/stops/:stopId/items

GET  /api/trips/:tripId/budget

POST /api/trips/:tripId/share
GET  /api/public/:slug
```

Those endpoints are enough to demonstrate the main GlobeTrotter product loop from the problem statement.

---

# 78. Final API Principle

> The API should expose product operations, not database tables blindly.

For example, we expose:

```text
/trips/:tripId/stops/reorder
```

because reordering is a product action.

And:

```text
/public/:slug/copy
```

because trip copying is a domain operation requiring a transaction.

The frontend should not have to understand how many Prisma writes are required to perform those actions.

---

# 79. API Contract Lock

The following conventions are now locked:

```text
Base URL      /api
Protocol      HTTP
Style         REST
Format        JSON
Auth          Bearer JWT
Dates         YYYY-MM-DD
Times         HH:mm
Money         integer
Errors        standardized
Ownership     backend enforced
```

Core resource structure:

```text
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

with discovery:

```text
City
 ↓
Activity
```

and domain operations:

```text
Budget
Sharing
Copy Trip
Reorder
```

This document is considered the **frontend/backend contract for the GlobeTrotter MVP**.