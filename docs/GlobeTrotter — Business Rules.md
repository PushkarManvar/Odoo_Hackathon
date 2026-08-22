# GlobeTrotter
## Business Rules & Domain Validation

**Document:** `08_BUSINESS_RULES.md`  
**Status:** Locked for MVP  
**Purpose:** Define all non-negotiable application behavior

---

# 1. Purpose

This document defines the rules that the backend must enforce regardless of what the frontend does.

These rules protect:

- Trip consistency
- Date consistency
- Ownership
- Budget correctness
- Activity scheduling
- Ordering
- Public sharing
- Copy-trip behavior
- Delete behavior

The main rule is:

> The frontend can request an action, but the backend decides whether that action is valid.

---

# 2. Business Rules vs Request Validation

These are different.

## Request validation

Checks structure.

Example:

```text
startDate exists
plannedBudget is a number
name is a string
```

Handled by Zod.

## Business validation

Checks whether the action makes sense in the current state.

Example:

```text
stop date must lie inside trip date range
```

Handled by services.

---

# 3. Core Domain Hierarchy

All rules follow this hierarchy:

```text
User
 ↓
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

Reusable master data:

```text
City
 ↓
Activity
```

---

# 4. Trip Creation Rules

A trip requires:

```text
name
startDate
endDate
```

Optional:

```text
description
coverImageUrl
plannedBudget
transportCost
stayCost
mealCost
currency
```

---

# 5. Trip Name Rule

Trip name must:

- Be non-empty
- Be trimmed
- Have a reasonable maximum length

Recommended:

```text
1–120 characters
```

Example valid:

```text
Rajasthan Heritage Trip
```

Invalid:

```text
"     "
```

---

# 6. Trip Date Rule

Required:

```text
startDate <= endDate
```

Valid:

```text
01 Oct → 07 Oct
```

Valid one-day trip:

```text
01 Oct → 01 Oct
```

Invalid:

```text
07 Oct → 01 Oct
```

Error:

```text
INVALID_TRIP_DATE_RANGE
```

---

# 7. Trip Date Storage

Trip dates are date-only values.

API:

```text
YYYY-MM-DD
```

Database:

```prisma
DateTime @db.Date
```

Do not use timestamps for trip boundaries.

---

# 8. Trip Ownership Rule

Trip owner is always:

```text
req.user.id
```

The backend must never use a frontend-provided `userId` to create or transfer ownership.

---

# 9. Trip Budget Rules

Fields:

```text
plannedBudget
transportCost
stayCost
mealCost
```

must be:

```text
>= 0
```

if provided.

Invalid:

```text
transportCost = -100
```

Error:

```text
INVALID_COST
```

---

# 10. Currency Rule

Every trip has one currency.

Default:

```text
INR
```

All monetary values in that trip are interpreted using the same currency.

No currency conversion occurs in MVP.

---

# 11. Trip Update Rules

Users may update:

- Name
- Description
- Start date
- End date
- Cover image
- Planned budget
- Transport cost
- Stay cost
- Meal cost
- Currency

Sharing state is managed separately.

---

# 12. Trip Date Update Rule

If trip dates are changed, all existing stops must remain inside the new trip range.

Example current trip:

```text
01 Oct → 10 Oct
```

Existing stop:

```text
Jaipur
01 Oct → 03 Oct
```

Updating trip to:

```text
02 Oct → 10 Oct
```

would invalidate Jaipur.

Backend must reject the update.

Error:

```text
TRIP_DATE_CONFLICT
```

---

# 13. No Silent Stop Adjustment

When trip dates shrink, backend must not silently change stop dates.

Bad:

```text
Trip start moved from Oct 1 to Oct 2
→ backend silently moves Jaipur to Oct 2
```

Correct:

```text
Reject update
→ user explicitly fixes affected stops
```

This preserves user intent.

---

# 14. Trip Deletion Rule

Deleting a Trip must delete:

```text
Trip
 ↓
TripStops
 ↓
ItineraryItems
```

Through cascade behavior.

It must not delete:

```text
City
Activity
```

---

# 15. City Rules

Cities are reusable master data.

Users do not create or modify cities in MVP.

City records are seeded.

---

# 16. City Search Rule

Search should be case-insensitive.

These should behave equivalently:

```text
jaipur
Jaipur
JAIPUR
```

---

# 17. City Deletion Rule

Normal user-facing endpoints must not support city deletion.

Reason:

City records may be referenced by many trips.

---

# 18. TripStop Creation Rules

A new stop requires:

```text
tripId
cityId
arrivalDate
departureDate
```

Sequence is preferably assigned by backend.

---

# 19. TripStop Ownership Rule

Before adding a stop:

```text
assertTripOwnership(tripId, req.user.id)
```

must succeed.

---

# 20. Stop Date Order Rule

Required:

```text
arrivalDate <= departureDate
```

Invalid:

```text
05 Oct → 03 Oct
```

Error:

```text
INVALID_STOP_DATE_RANGE
```

---

# 21. Stop Must Be Inside Trip

Required:

```text
trip.startDate
    <=
stop.arrivalDate
    <=
stop.departureDate
    <=
trip.endDate
```

Example:

Trip:

```text
01 Oct → 07 Oct
```

Valid stop:

```text
02 Oct → 04 Oct
```

Invalid stop:

```text
08 Oct → 09 Oct
```

Error:

```text
STOP_OUTSIDE_TRIP_RANGE
```

---

# 22. Stop Boundary Dates Are Valid

If trip is:

```text
01 Oct → 07 Oct
```

then stop:

```text
01 Oct → 07 Oct
```

is valid.

Comparisons are inclusive.

---

# 23. Duplicate City Rule

For MVP, the same City may appear more than once in a Trip.

Example:

```text
1 Mumbai
2 Goa
3 Mumbai
```

This may represent returning to a city later.

Do not enforce:

```text
unique(tripId, cityId)
```

---

# 24. Stop Sequence Rule

Each stop in the same trip must have a unique sequence.

Example:

```text
1 Jaipur
2 Jodhpur
3 Udaipur
```

Database enforces:

```prisma
@@unique([tripId, sequenceOrder])
```

---

# 25. New Stop Sequence

When appending a new stop:

```text
sequenceOrder = current maximum + 1
```

The frontend should not be responsible for calculating this during normal add-stop flow.

---

# 26. Stop Reorder Rule

Reorder request must contain all current stop IDs for that trip exactly once.

Example current:

```text
A
B
C
```

Valid:

```json
["B", "A", "C"]
```

Invalid:

```json
["B", "A"]
```

Invalid:

```json
["A", "A", "C"]
```

Invalid:

```json
["A", "B", "foreign-stop"]
```

---

# 27. Reorder Transaction Rule

Stop reordering must run inside a transaction.

Reason:

Partial ordering must never persist.

---

# 28. Stop Delete Rule

Deleting a stop deletes:

```text
TripStop
+
its ItineraryItems
```

Then remaining stop sequence should be normalized.

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

---

# 29. Stop Update Rule

Stop updates may change:

- Arrival date
- Departure date
- Notes

Sequence changes should preferably use reorder endpoint rather than ordinary PATCH.

---

# 30. Stop Date Update Conflict

If a stop already contains itinerary items, changing stop dates must not leave those items outside the new range.

Example current:

```text
Stop:
01 Oct → 04 Oct

Item:
03 Oct
```

Attempt:

```text
Stop:
01 Oct → 02 Oct
```

must fail.

Error:

```text
STOP_DATE_CONFLICT
```

---

# 31. No Silent Item Deletion

Backend must not solve a stop-date conflict by deleting affected itinerary items.

Reject the operation instead.

---

# 32. Activity Rules

Activities are reusable master records.

Every Activity belongs to exactly one City.

Example:

```text
Amber Fort → Jaipur
```

---

# 33. Activity Estimated Cost Rule

`estimatedCost` must be:

```text
>= 0
```

---

# 34. Activity Duration Rule

`durationMins` should be:

```text
> 0
```

for seeded master activities.

---

# 35. Activity Category Rule

Must be one of:

```text
SIGHTSEEING
FOOD
ADVENTURE
CULTURE
SHOPPING
RELAXATION
OTHER
```

---

# 36. Activity Search Rules

Allowed filters:

- Search text
- Category
- Maximum cost
- Maximum duration

Filters should combine using logical AND.

Example:

```text
city = Jaipur
category = SIGHTSEEING
maxCost = 500
```

returns only activities matching all applicable conditions.

---

# 37. ItineraryItem Creation

An item must belong to one TripStop.

It can be either:

```text
master Activity assignment
```

or:

```text
custom item
```

---

# 38. Activity or Custom Name Rule

Required:

```text
activityId OR customName
```

At least one must exist.

Invalid:

```json
{
  "activityId": null,
  "customName": null
}
```

Error:

```text
INVALID_ITINERARY_ITEM
```

---

# 39. Both Activity and Custom Name

For MVP, if `activityId` is provided, `customName` should normally be absent.

Recommended rule:

```text
activityId XOR customName
```

Exactly one should identify the item.

Why:

It avoids ambiguous display naming.

Valid:

```text
activityId = activity-123
customName = null
```

Valid:

```text
activityId = null
customName = "Visit Friend"
```

Invalid:

```text
activityId = activity-123
customName = "Different Name"
```

If custom renaming of activities is needed later, add a dedicated override field instead.

---

# 40. Item Date Rule

Required:

```text
stop.arrivalDate
    <=
item.date
    <=
stop.departureDate
```

Example:

Stop:

```text
01 Oct → 03 Oct
```

Valid:

```text
02 Oct
```

Invalid:

```text
04 Oct
```

Error:

```text
INVALID_ITEM_DATE
```

---

# 41. Item Date Boundary

Item may occur exactly on:

```text
arrivalDate
```

or:

```text
departureDate
```

Both are valid.

---

# 42. Activity-City Rule

If an item references an Activity:

```text
activity.cityId
```

must equal:

```text
tripStop.cityId
```

Example:

TripStop:

```text
Jaipur
```

Activity:

```text
Amber Fort / Jaipur ✅
Gateway of India / Mumbai ❌
```

Error:

```text
INVALID_ACTIVITY_CITY
```

---

# 43. Custom Items Ignore Activity-City Rule

Custom item:

```text
Visit Friend
```

has no `activityId`.

Therefore activity-city validation does not apply.

---

# 44. Item Start Time Rule

Optional.

If provided:

```text
HH:mm
```

24-hour format.

Valid:

```text
09:00
13:45
23:30
```

Invalid:

```text
9 AM
25:00
13:70
```

Error:

```text
INVALID_TIME_FORMAT
```

---

# 45. Item Duration Rule

If provided:

```text
durationMins > 0
```

Invalid:

```text
0
-20
```

---

# 46. Default Item Duration

When adding a master activity:

If request does not provide `durationMins`:

```text
use Activity.durationMins
```

The resulting itinerary item may store this copied duration or allow null and resolve it dynamically.

For MVP, recommended:

> Copy the default duration into the ItineraryItem on creation.

Reason:

Later edits to master Activity should not unexpectedly change an existing user's planned schedule.

---

# 47. Cost Rule

`customCost` is optional.

If present:

```text
customCost >= 0
```

---

# 48. Effective Cost Rule

Budget calculation uses:

```text
customCost
??
activity.estimatedCost
??
0
```

This rule is mandatory.

---

# 49. Zero Cost Rule

`0` is a valid cost.

Example:

```text
Marine Drive = ₹0
```

Code must use:

```text
??
```

not:

```text
||
```

for cost fallback.

---

# 50. Custom Item Cost Rule

For a custom item with:

```text
activityId = null
```

if:

```text
customCost = null
```

effective cost is:

```text
0
```

---

# 51. Item Sequence Rule

Items are ordered within a date using:

```text
sequenceOrder
```

Read ordering:

```text
date ASC
then sequenceOrder ASC
```

---

# 52. New Item Sequence

When appending an item for a given stop/date:

```text
sequenceOrder = maximum sequence for that date + 1
```

---

# 53. Item Reorder Rule

Reordering occurs for one:

```text
TripStop + Date
```

at a time.

Request must contain all items for that date exactly once.

---

# 54. Item Reorder Transaction

Reorder should run inside a transaction.

Partial item ordering must never persist.

---

# 55. Item Update Rules

Allowed fields:

- Date
- Start time
- Duration
- Custom cost
- Notes

Switching between master activity and custom item is not necessary for MVP.

If the user wants a different type, delete and recreate the item.

This keeps update logic simpler.

---

# 56. Item Delete Rule

Deleting an item removes only that ItineraryItem.

It must not delete its master Activity.

---

# 57. Budget Rules

Budget is derived from authoritative trip/item data.

No manual total field exists.

---

# 58. Activity Budget Formula

For every item:

```text
effectiveCost =
customCost
??
Activity.estimatedCost
??
0
```

Then:

```text
activitiesTotal =
sum(all effective item costs)
```

---

# 59. Total Budget Formula

```text
estimatedTotal =
transportCost
+
stayCost
+
mealCost
+
activitiesTotal
```

---

# 60. Remaining Budget Formula

If plannedBudget exists:

```text
remaining =
plannedBudget - estimatedTotal
```

If plannedBudget is null:

```text
remaining = null
```

Do not pretend the user has a budget of zero.

---

# 61. Over-Budget Rule

If:

```text
remaining < 0
```

then:

```text
isOverBudget = true
```

Over-budget amount:

```text
abs(remaining)
```

---

# 62. Trip Day Count Rule

Inclusive duration:

```text
endDate - startDate + 1
```

Example:

```text
01 Oct → 07 Oct
```

equals:

```text
7 days
```

---

# 63. Average Cost Per Day

```text
averagePerDay =
estimatedTotal / tripDayCount
```

This may be decimal in API response.

Do not store it.

---

# 64. Category Budget Rule

Master activities contribute to their Activity category.

Custom items contribute to:

```text
OTHER
```

for MVP.

---

# 65. Stop Budget Rule

Each stop's activity cost is:

```text
sum(effective cost of its itinerary items)
```

Trip-level:

```text
transport
stay
meals
```

are not allocated among stops in MVP.

---

# 66. Calendar Rules

Calendar is not stored.

It is derived from:

```text
ItineraryItem.date
ItineraryItem.startTime
```

---

# 67. Calendar Ordering

For each date:

```text
sequenceOrder ASC
```

If desired, display may also consider `startTime`.

However `sequenceOrder` remains the explicit user-controlled ordering.

---

# 68. Itinerary View Rule

Itinerary derives from:

```text
Trip
 ↓
Stops ordered by sequenceOrder
 ↓
Items ordered by date and sequenceOrder
```

---

# 69. No Duplicate Itinerary State

Do not persist a second copy of itinerary content for:

```text
read-only view
calendar
public page
```

All derive from the same source records.

---

# 70. Publishing Rule

Only trip owner may publish.

Private:

```text
visibility = PRIVATE
shareSlug = null
```

Publish:

```text
visibility = PUBLIC
shareSlug = unique slug
```

---

# 71. Publish Idempotency

If trip is already public:

```text
POST /share
```

returns the existing slug.

It should not create a new slug every time.

---

# 72. Unpublish Rule

Unpublish:

```text
visibility = PRIVATE
shareSlug = null
```

Old link becomes invalid.

---

# 73. Public Read Rule

A public trip is accessible only when:

```text
visibility = PUBLIC
AND
shareSlug matches
```

If either fails:

```text
PUBLIC_TRIP_NOT_FOUND
```

---

# 74. Public Data Rule

Public response may expose:

- Trip information
- Stops
- Cities
- Items
- Activity details
- Estimated budget summary
- Owner display name

Must not expose:

- Email
- Password hash
- Private account metadata

---

# 75. Public Editing Rule

Public visitors cannot edit source trip.

There are no public mutation routes for:

- Stop
- Item
- Budget
- Trip

---

# 76. Copy Trip Rule

A public trip may be copied only by an authenticated user.

---

# 77. Copy Transaction Rule

Copy operation must be:

```text
all-or-nothing
```

Use:

```text
prisma.$transaction()
```

---

# 78. Copy Trip Data

Duplicate:

```text
Trip
TripStops
ItineraryItems
```

Reuse:

```text
City
Activity
```

---

# 79. Copied Trip Ownership

New trip:

```text
userId = req.user.id
```

Never preserve source owner.

---

# 80. Copied Trip Visibility

Always:

```text
PRIVATE
```

---

# 81. Copied Trip Share Slug

Always:

```text
null
```

A copied trip must not automatically expose the original share URL.

---

# 82. Copied Trip Name

For MVP, preserve original name.

Optional frontend may later display:

```text
Copy of Rajasthan Trip
```

but backend does not need to rename it automatically.

---

# 83. Copy Stop Mapping Rule

Old stop IDs cannot be reused.

Need:

```text
oldStopId → newStopId
```

mapping.

All copied items must reference new stop IDs.

---

# 84. Copy Item Rule

ItineraryItem gets:

- New item ID
- New tripStopId
- Same activityId where applicable
- Same customName
- Same customCost
- Same date
- Same startTime
- Same duration
- Same order
- Same notes

---

# 85. Copy City/Activity Rule

Do not copy City and Activity records.

They are global seed/master data.

---

# 86. Copy Failure Rule

If any write fails:

```text
rollback entire copy
```

No partial copied trip remains.

---

# 87. Ownership Rule

Private mutations require ownership.

Root:

```text
Trip.userId
```

---

# 88. Wrong Owner Rule

Existing resource + authenticated wrong owner:

```text
403 FORBIDDEN
```

---

# 89. Missing Resource Rule

Missing:

```text
404
```

with resource-specific code.

Examples:

```text
TRIP_NOT_FOUND
STOP_NOT_FOUND
ITEM_NOT_FOUND
CITY_NOT_FOUND
ACTIVITY_NOT_FOUND
```

---

# 90. Authentication Rule

Missing/invalid token:

```text
401 UNAUTHORIZED
```

---

# 91. Delete User Rule

Deleting current account removes:

```text
User
 ↓
Trips
 ↓
Stops
 ↓
Items
```

Master City/Activity data remains.

---

# 92. User Cannot Delete Another User

Profile delete always applies to:

```text
req.user.id
```

No user ID is accepted from request.

---

# 93. Email Rule

Email must be normalized before:

- Signup duplicate check
- Login lookup

Recommended:

```text
trim
lowercase
```

---

# 94. Profile Name Rule

Name update:

- Trim value
- Must not be empty
- Same max length as signup name

---

# 95. Shared Error Behavior

Business services should throw standardized errors.

Example:

```text
throw new AppError(
  "STOP_OUTSIDE_TRIP_RANGE",
  400,
  "Stop dates must be inside the trip date range."
)
```

Controllers should not invent their own error format.

---

# 96. Transaction Rules Summary

Transactions are required for:

```text
Copy Trip
Stop Reorder
```

Strongly recommended for:

```text
Item Reorder
Delete + sequence normalization
```

Single-row CRUD normally does not require manual transaction.

---

# 97. Read Consistency Rule

Normal reads should return nested trip data ordered consistently.

Stops:

```text
sequenceOrder ASC
```

Items:

```text
date ASC
sequenceOrder ASC
```

---

# 98. Master Data Mutation Rule

Normal user APIs do not create/update/delete:

```text
City
Activity
```

These are managed through seed data for MVP.

---

# 99. No External API Dependency Rule

Core business rules must work with local PostgreSQL data.

Failure of an optional external integration must never make core trip planning unusable.

---

# 100. No Silent Correction Principle

The backend should reject invalid domain operations instead of silently altering user data.

Examples:

Do not silently:

- Change stop dates
- Delete invalid items
- Change trip dates
- Change activity city
- Convert negative cost to zero

Return an explicit error.

---

# 101. Client Cannot Override Protected Fields

Do not allow request bodies to directly set:

```text
id
userId
createdAt
updatedAt
visibility
shareSlug
sequenceOrder
```

unless a specific domain endpoint explicitly controls that concept.

Examples:

- Sharing controls visibility.
- Reorder endpoints control sequence.

---

# 102. Unknown Fields Rule

Validated DTOs should whitelist allowed fields.

Do not pass raw:

```text
req.body
```

directly to Prisma.

---

# 103. String Trimming Rule

Trim user-entered:

```text
name
description where appropriate
customName
notes if desired
email
```

At minimum, required name fields must be trimmed before empty-string validation.

---

# 104. Custom Name Rule

Custom item name:

- Required when no activityId
- Trimmed
- Non-empty
- Recommended max:

```text
120 characters
```

---

# 105. Notes Rule

Notes are optional.

Recommended maximum:

```text
1000 characters
```

This prevents accidental huge input.

---

# 106. Description Rule

Trip description optional.

Recommended maximum:

```text
2000 characters
```

---

# 107. Cost Integer Rule

All incoming persisted costs must be integers.

Reject:

```text
₹500.75
```

for current MVP representation.

If decimal currencies become necessary later, architecture should migrate to smallest currency unit.

---

# 108. Duration Integer Rule

All durations are integer minutes.

Reject:

```text
90.5
```

---

# 109. Sequence Integer Rule

Sequence values are positive integers.

Backend-controlled reorder logic should generate:

```text
1, 2, 3, ...
```

No gaps should remain after normalization.

---

# 110. Public Copy and Same User

The owner of a public trip may also copy their own trip.

This is allowed.

Result is simply another independent private trip.

---

# 111. Trip With No Stops

A Trip may exist with zero stops.

This supports the natural creation flow:

```text
Create Trip
 ↓
Open Builder
 ↓
Add First Stop
```

---

# 112. Stop With No Items

A Stop may exist with zero itinerary items.

This is valid during planning.

---

# 113. Planned Budget Optional

Trip may have:

```text
plannedBudget = null
```

Budget service should still calculate estimated total.

Response:

```text
remaining = null
isOverBudget = false
```

or another agreed neutral representation.

Recommended:

```text
remaining = null
isOverBudget = false
```

---

# 114. Empty Budget Rule

Trip with:

```text
transport = 0
stay = 0
meals = 0
no items
```

has:

```text
estimatedTotal = 0
```

This is valid.

---

# 115. Deleted Master Activity Edge Case

Since Activity deletion is not user-facing in MVP, this should rarely occur.

If master activity management is later added, do not delete an Activity that existing ItineraryItems reference unless a clear strategy is chosen.

For MVP:

> Treat seeded Activity records as stable.

---

# 116. Trip Date Change and Itinerary Items

Trip date validation only needs to check Stops directly because every valid Item is already constrained inside its Stop.

Therefore if all Stops remain inside the new Trip range, Items remain valid.

---

# 117. Stop City Change

Changing `cityId` of an existing stop is not supported through ordinary PATCH in MVP.

Reason:

Existing activities may belong to old city.

If a user wants another city:

```text
delete stop
+
add new stop
```

This avoids complicated activity migration.

---

# 118. Currency Change Rule

Changing Trip currency after costs exist is technically allowed by schema but dangerous because no conversion occurs.

Recommended MVP rule:

If trip contains any non-zero cost or itinerary item:

```text
reject currency change
```

unless frontend explicitly warns that values will not be converted.

Simplest locked behavior:

> Currency can be selected during trip creation but should not be editable after creation in MVP.

---

# 119. Sharing With Incomplete Trip

A trip may be published even if:

- No stops
- No activities

unless product UX chooses to block it.

Recommended MVP:

Allow publishing any owned trip.

Reason:

No need for additional completeness state.

---

# 120. Delete Confirmation

Backend does not enforce confirmation strings.

Frontend should request user confirmation for destructive actions.

---

# 121. Error Code Summary

## Trip

```text
TRIP_NOT_FOUND
INVALID_TRIP_DATE_RANGE
TRIP_DATE_CONFLICT
```

## Stop

```text
STOP_NOT_FOUND
INVALID_STOP_DATE_RANGE
STOP_OUTSIDE_TRIP_RANGE
STOP_DATE_CONFLICT
INVALID_STOP_ORDER
```

## City

```text
CITY_NOT_FOUND
```

## Activity

```text
ACTIVITY_NOT_FOUND
INVALID_ACTIVITY_CITY
```

## Item

```text
ITEM_NOT_FOUND
INVALID_ITINERARY_ITEM
INVALID_ITEM_DATE
INVALID_TIME_FORMAT
INVALID_ITEM_ORDER
```

## Money

```text
INVALID_COST
```

## Sharing

```text
PUBLIC_TRIP_NOT_FOUND
```

## Auth

```text
UNAUTHORIZED
FORBIDDEN
```

---

# 122. Domain Invariants

These conditions must always be true in valid application state:

1. Every Trip belongs to a User.
2. Trip start date is not after end date.
3. Every TripStop belongs to a Trip.
4. Every TripStop references a City.
5. Every Stop lies inside its Trip dates.
6. Stop arrival is not after departure.
7. Stop sequence is unique within Trip.
8. Every ItineraryItem belongs to a Stop.
9. Every Item lies inside its Stop date range.
10. Every master-activity item references an Activity from the same City as its Stop.
11. Every item has either an Activity or custom name.
12. Costs are never negative.
13. Durations are positive when provided.
14. Public trips have valid unique share slugs.
15. Private trips have no active public slug.
16. Copied trips belong to copying user.
17. Copied trips are private.
18. Deleting a Trip removes owned child records.
19. Deleting a user does not delete master City/Activity data.
20. Derived values are never treated as authoritative stored state.

---

# 123. Backend Validation Order

Recommended for adding itinerary item:

```text
1. Authenticate
2. Validate request shape
3. Find Stop
4. Verify ownership
5. Validate item date
6. Resolve Activity if provided
7. Validate activity city
8. Validate cost/duration
9. Determine sequence
10. Create item
```

---

# 124. Backend Validation Order — Stop

```text
1. Authenticate
2. Validate request shape
3. Verify Trip ownership
4. Verify City exists
5. Validate arrival/departure
6. Validate dates inside Trip
7. Determine sequence
8. Create Stop
```

---

# 125. Backend Validation Order — Trip Update

```text
1. Authenticate
2. Validate request
3. Verify ownership
4. Calculate proposed new dates
5. Validate date order
6. Check existing Stops
7. Validate budget values
8. Update Trip
```

---

# 126. Backend Validation Order — Copy

```text
1. Authenticate
2. Resolve public Trip by slug
3. Confirm visibility PUBLIC
4. Load Stops and Items
5. Start transaction
6. Create copied Trip
7. Create copied Stops
8. Build old→new stop map
9. Create copied Items
10. Commit
11. Return new Trip
```

---

# 127. Business Rule Priority

If frontend behavior conflicts with these rules:

> Backend rules win.

Example:

Frontend accidentally allows:

```text
Item date = Oct 10
```

inside:

```text
Stop = Oct 1–3
```

Backend rejects it.

---

# 128. MVP Simplicity Rule

When choosing between:

```text
complex automatic behavior
```

and:

```text
clear rejection + explicit user correction
```

prefer the second for MVP.

This makes the system predictable and safer during a hackathon.

---

# 129. Final Business Rule Principle

> Invalid data should never enter the database merely because the UI failed to prevent it.

The frontend provides convenience.

The backend provides correctness.

These business rules are considered **locked for the GlobeTrotter MVP**.