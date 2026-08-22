# GlobeTrotter
## Database Schema & ER Design

**Document:** `04_DATABASE_SCHEMA.md`  
**Status:** Locked for MVP  
**Database:** PostgreSQL 16  
**ORM:** Prisma  
**Purpose:** Final relational data model for GlobeTrotter

---

# 1. Purpose

This document defines the final database structure for GlobeTrotter.

It is the source of truth for:

- Entities
- Relationships
- Prisma models
- Enums
- Indexes
- Cascading deletes
- Date handling
- Money handling
- Ownership paths
- Trip hierarchy
- Activity references
- Sharing fields
- Budget fields

Any backend code that conflicts with this document should be changed to match this document unless the team explicitly updates the schema decision.

---

# 2. Core Database Principle

GlobeTrotter is built around one hierarchy:

```text id="43tsp7"
USER
  ↓
TRIP
  ↓
TRIP STOP
  ↓
ITINERARY ITEM
```

Reusable discovery entities exist separately:

```text id="ywd5rw"
CITY
  ↓
ACTIVITY
```

Relationships connect them:

```text id="dijh0j"
TripStop ──────→ City

ItineraryItem ─→ Activity
```

---

# 3. High-Level ER Diagram

```text id="ri9e7h"
┌──────────────┐
│     User     │
├──────────────┤
│ id           │
│ name         │
│ email        │
│ passwordHash │
│ createdAt    │
└──────┬───────┘
       │
       │ 1:N
       ▼
┌────────────────────┐
│       Trip         │
├────────────────────┤
│ id                 │
│ userId             │
│ name               │
│ description        │
│ startDate          │
│ endDate            │
│ plannedBudget      │
│ transportCost      │
│ stayCost           │
│ mealCost           │
│ currency           │
│ visibility         │
│ shareSlug          │
│ coverImageUrl      │
│ createdAt          │
│ updatedAt          │
└─────────┬──────────┘
          │
          │ 1:N
          ▼
┌────────────────────┐
│     TripStop       │
├────────────────────┤
│ id                 │
│ tripId             │
│ cityId             │
│ sequenceOrder      │
│ arrivalDate        │
│ departureDate      │
│ notes              │
└──────┬────────┬────┘
       │        │
       │        │ N:1
       │        ▼
       │   ┌────────────────┐
       │   │      City      │
       │   ├────────────────┤
       │   │ id             │
       │   │ name           │
       │   │ country        │
       │   │ region         │
       │   │ costIndex      │
       │   │ popularity     │
       │   │ imageUrl       │
       │   └──────┬─────────┘
       │          │
       │          │ 1:N
       │          ▼
       │   ┌────────────────┐
       │   │    Activity    │
       │   ├────────────────┤
       │   │ id             │
       │   │ cityId         │
       │   │ name           │
       │   │ description    │
       │   │ category       │
       │   │ estimatedCost  │
       │   │ durationMins   │
       │   │ imageUrl       │
       │   └──────┬─────────┘
       │          │
       │          │
       │          │ optional reference
       ▼          ▼
┌──────────────────────────┐
│      ItineraryItem       │
├──────────────────────────┤
│ id                       │
│ tripStopId               │
│ activityId               │
│ customName               │
│ customCost               │
│ date                     │
│ startTime                │
│ durationMins             │
│ sequenceOrder            │
│ notes                    │
└──────────────────────────┘
```

---

# 4. Entity Summary

The MVP contains six main models:

```text id="t6k2ts"
User

Trip

City

TripStop

Activity

ItineraryItem
```

No additional itinerary table is required.

No calendar table is required.

No budget-summary table is required.

No expenses table is required for MVP.

---

# 5. Why No `Itinerary` Table

The itinerary already exists through:

```text id="ewljgm"
Trip
 ↓
TripStop
 ↓
ItineraryItem
```

Creating another table would duplicate the same information.

The UI itinerary is a representation of these records.

---

# 6. Why No Calendar Table

Calendar data is derived from:

```text id="44l1wp"
ItineraryItem.date
+
ItineraryItem.startTime
```

The frontend can group items by date.

Therefore:

```text id="yfsesj"
Calendar = View
```

not:

```text id="c65ggw"
Calendar = Stored Entity
```

---

# 7. Why No Budget Summary Table

Budget totals are calculated from:

```text id="1o9ngd"
Trip-level estimates
+
Itinerary Item costs
```

Storing a total like:

```text id="hqm391"
estimatedTotal
```

would risk becoming stale whenever an itinerary item changed.

Budget is therefore calculated dynamically.

---

# 8. Final Enums

## Trip Visibility

```prisma id="5l1knr"
enum TripVisibility {
  PRIVATE
  PUBLIC
}
```

This prevents invalid strings such as:

```text id="nu1k3b"
"public"
"Public"
"publci"
```

---

# 9. Activity Category

```prisma id="oeqa1s"
enum ActivityCategory {
  SIGHTSEEING
  FOOD
  ADVENTURE
  CULTURE
  SHOPPING
  RELAXATION
  OTHER
}
```

This provides predictable filtering and consistent seed data.

---

# 10. Final Prisma Schema

```prisma id="8m37l0"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TripVisibility {
  PRIVATE
  PUBLIC
}

enum ActivityCategory {
  SIGHTSEEING
  FOOD
  ADVENTURE
  CULTURE
  SHOPPING
  RELAXATION
  OTHER
}

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  trips        Trip[]
}

model Trip {
  id             String         @id @default(uuid())
  userId         String
  name           String
  description    String?
  startDate      DateTime       @db.Date
  endDate        DateTime       @db.Date
  coverImageUrl  String?

  plannedBudget  Int?
  transportCost  Int            @default(0)
  stayCost       Int            @default(0)
  mealCost       Int            @default(0)

  visibility     TripVisibility @default(PRIVATE)
  shareSlug      String?        @unique
  currency       String         @default("INR")

  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  user           User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  stops          TripStop[]

  @@index([userId])
  @@index([startDate])
  @@index([visibility])
}

model City {
  id               String       @id @default(uuid())
  name             String
  country          String
  region           String?
  costIndex        Int?
  popularityScore  Int?
  imageUrl         String?

  stops            TripStop[]
  activities       Activity[]

  @@index([name])
  @@index([country])
  @@index([popularityScore])
}

model TripStop {
  id             String          @id @default(uuid())
  tripId         String
  cityId         String

  sequenceOrder  Int
  arrivalDate    DateTime        @db.Date
  departureDate  DateTime        @db.Date
  notes          String?

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  trip           Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)
  city           City            @relation(fields: [cityId], references: [id])
  items          ItineraryItem[]

  @@index([tripId])
  @@index([cityId])
  @@index([arrivalDate])
  @@unique([tripId, sequenceOrder])
}

model Activity {
  id             String             @id @default(uuid())
  cityId         String

  name           String
  description    String?
  category       ActivityCategory
  estimatedCost  Int
  durationMins   Int
  imageUrl       String?

  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  city           City               @relation(fields: [cityId], references: [id])
  items          ItineraryItem[]

  @@index([cityId])
  @@index([name])
  @@index([category])
  @@index([estimatedCost])
}

model ItineraryItem {
  id             String          @id @default(uuid())
  tripStopId     String
  activityId     String?

  customName     String?
  customCost     Int?

  date           DateTime        @db.Date
  startTime      String?
  durationMins   Int?
  sequenceOrder  Int
  notes          String?

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  tripStop       TripStop        @relation(fields: [tripStopId], references: [id], onDelete: Cascade)
  activity       Activity?       @relation(fields: [activityId], references: [id])

  @@index([tripStopId])
  @@index([activityId])
  @@index([date])
  @@index([tripStopId, date])
}
```

---

# 11. User Model

```prisma id="c4fjsi"
model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  trips        Trip[]
}
```

---

# 12. User ID

Use:

```text id="5c948o"
UUID
```

instead of sequential integers.

Example:

```text id="8xu62j"
550e8400-e29b-41d4-a716-446655440000
```

Benefits:

- Difficult to guess
- Easy generation
- Works well for copied data
- No global integer coordination

---

# 13. User Email

```prisma id="5hq1z4"
email String @unique
```

Email is the login identifier.

Duplicate accounts with the same email must not be allowed.

Normalization such as lowercasing should happen before persistence.

Example:

```text id="2mhm77"
NISHANT@EXAMPLE.COM
```

should be normalized to:

```text id="yajsp3"
nishant@example.com
```

before checking uniqueness.

---

# 14. Password Storage

Only store:

```text id="nozqwd"
passwordHash
```

Never store:

```text id="4q4h7y"
password
confirmPassword
JWT
```

inside the User model.

---

# 15. User-to-Trip Relationship

```text id="v7mk9i"
User 1 ───────── N Trip
```

One user may own many trips.

Every trip has exactly one owner.

---

# 16. User Delete Behavior

Relationship:

```prisma id="yk6ar2"
onDelete: Cascade
```

Meaning:

```text id="2vndnn"
Delete User
     ↓
Delete Trips
     ↓
Delete Stops
     ↓
Delete Items
```

City and Activity master records remain.

---

# 17. Trip Model

Trip is the central entity.

```text id="dsd1n0"
TRIP
```

represents one complete journey.

Example:

```text id="rzpmmx"
Rajasthan Heritage Trip
01 Oct → 07 Oct
```

---

# 18. Trip Ownership

```prisma id="byjoyc"
userId String
```

references:

```text id="st5dpq"
User.id
```

The backend must use this field for authorization.

The frontend must never be trusted to provide the owner.

---

# 19. Trip Date Fields

```prisma id="2s265u"
startDate DateTime @db.Date
endDate   DateTime @db.Date
```

PostgreSQL stores these as:

```text id="07mluc"
DATE
```

not timestamp.

Example:

```text id="ijtx6y"
2026-10-01
```

instead of:

```text id="efmbcm"
2026-09-30T18:30:00.000Z
```

This avoids timezone boundary issues.

---

# 20. Trip Date Rule

Required:

```text id="m1ca85"
startDate <= endDate
```

The database schema itself does not enforce all domain comparisons.

This must also be checked inside the Trip service.

---

# 21. Trip Description

```prisma id="0snmqw"
description String?
```

Optional.

No need to create a separate description entity.

---

# 22. Cover Image

```prisma id="ojp5av"
coverImageUrl String?
```

Optional.

Can contain:

- Seed image URL
- Local static path
- Later uploaded-image URL

No image binary is stored in PostgreSQL.

---

# 23. Currency

```prisma id="jhwfrb"
currency String @default("INR")
```

For MVP:

```text id="w6n2h6"
INR
```

is the primary currency.

The field exists so UI and future extensions do not need schema changes.

---

# 24. Planned Budget

```prisma id="k6v13c"
plannedBudget Int?
```

This is the user's target limit.

Example:

```text id="7a1exj"
₹50,000
```

It is different from calculated total.

---

# 25. Trip-Level Cost Fields

For MVP:

```prisma id="ny8nzp"
transportCost Int @default(0)
stayCost      Int @default(0)
mealCost      Int @default(0)
```

These provide the main budget categories from the product requirement without creating an expenses subsystem.

---

# 26. Why These Costs Live on Trip

For the hackathon, the user may estimate:

```text id="vdcr15"
Transport = ₹8,000
Stay = ₹12,000
Meals = ₹6,000
```

These are overall estimates.

A separate expense ledger would add:

- CRUD
- Categories
- Relationships
- Forms
- More synchronization logic

without being essential to the core MVP.

---

# 27. Activities Cost

There is no:

```prisma id="0x1rz9"
activitiesCost
```

field on Trip.

It is calculated dynamically from itinerary items.

This prevents stale totals.

---

# 28. Visibility

```prisma id="j4u1cm"
visibility TripVisibility @default(PRIVATE)
```

Possible values:

```text id="3mmb4f"
PRIVATE
PUBLIC
```

---

# 29. Share Slug

```prisma id="uqdsah"
shareSlug String? @unique
```

Private trip:

```text id="fow22k"
shareSlug = null
```

Public trip:

```text id="y5hfsu"
shareSlug = "rajasthan-trip-a7k92p"
```

Unique constraint prevents collisions.

---

# 30. Trip Indexes

```prisma id="qwlycm"
@@index([userId])
@@index([startDate])
@@index([visibility])
```

These support:

- User's trip list
- Date-based dashboard filtering
- Public/private filtering

---

# 31. City Model

```prisma id="tjty8g"
model City {
  id               String
  name             String
  country          String
  region           String?
  costIndex        Int?
  popularityScore  Int?
  imageUrl         String?
}
```

Cities are reusable master records.

---

# 32. City Example

```text id="yqjup5"
name:
Jaipur

country:
India

region:
Rajasthan

costIndex:
2

popularityScore:
92
```

---

# 33. Why City Is Separate From TripStop

City describes a real destination.

```text id="g9g5wa"
Jaipur
```

TripStop describes:

> Jaipur inside Nishant's Rajasthan trip.

Example:

```text id="aj5z8n"
Jaipur
02 Oct → 04 Oct
Position 1
```

Different users may reference the same City record.

---

# 34. City Name Is Not Globally Unique

Do not use:

```prisma id="ixvt82"
name String @unique
```

because identical city names can exist in different places.

For local seeded data, duplicate handling can be managed by the seed source.

---

# 35. City Indexes

```prisma id="0j2ccr"
@@index([name])
@@index([country])
@@index([popularityScore])
```

Useful for:

```text id="yyte8h"
search city
filter by country
popular destinations
```

---

# 36. Cost Index

```prisma id="jfd2td"
costIndex Int?
```

Recommended seed scale:

```text id="ioxcrw"
1 = Very Affordable
2 = Affordable
3 = Moderate
4 = Expensive
5 = Very Expensive
```

Business logic should not depend strongly on this value.

It is mainly discovery metadata.

---

# 37. Popularity Score

```prisma id="ll1385"
popularityScore Int?
```

Can be used for:

- Popular destinations
- Dashboard recommendations
- Search sorting

Recommended seed range:

```text id="5go8fi"
0–100
```

---

# 38. TripStop Model

TripStop joins:

```text id="mp42ce"
Trip
+
City
```

and adds journey-specific information.

---

# 39. TripStop Relationship

```text id="uv2gxm"
Trip 1 ───── N TripStop

City 1 ───── N TripStop
```

A city can appear in many trips.

A trip contains many stops.

---

# 40. TripStop Date Fields

```prisma id="r1rf6y"
arrivalDate   DateTime @db.Date
departureDate DateTime @db.Date
```

They represent calendar dates.

---

# 41. Stop Date Rules

Required:

```text id="69l450"
arrivalDate <= departureDate
```

and:

```text id="10nvtl"
trip.startDate
     <=
arrivalDate
     <=
departureDate
     <=
trip.endDate
```

Handled in Stop service.

---

# 42. Stop Sequence

```prisma id="j8bgpn"
sequenceOrder Int
```

Example:

```text id="ay7oeo"
1 Jaipur
2 Jodhpur
3 Udaipur
```

---

# 43. Stop Sequence Constraint

```prisma id="2qsmrs"
@@unique([tripId, sequenceOrder])
```

This prevents:

```text id="9til10"
Trip A

Jaipur position 1
Jodhpur position 1
```

from existing simultaneously.

---

# 44. Reordering Warning

Because the sequence is unique, naive updates can temporarily conflict.

Example:

```text id="rimka9"
1 Jaipur
2 Jodhpur
```

swapping directly:

```text id="pvpsja"
Jaipur 1 → 2
```

fails while Jodhpur still has position 2.

Therefore reorder logic should use a transaction and safe update strategy.

Possible approaches:

- Temporary high numbers
- Reassign all positions in controlled order

The exact implementation belongs in the Stops service.

---

# 45. TripStop Notes

```prisma id="k38v50"
notes String?
```

Examples:

```text id="5lg1j2"
"Train arrives at Jaipur in morning"

"Hotel check-in after 2 PM"
```

Optional.

---

# 46. TripStop Delete Behavior

```prisma id="7zbrhk"
trip @relation(... onDelete: Cascade)
```

Deleting a Trip removes its stops.

TripStop-to-item relation also cascades.

---

# 47. City Delete Behavior

City relation does **not** cascade from TripStop.

Cities are master data.

For MVP, city deletion should normally not be exposed through user APIs.

---

# 48. Activity Model

Activity is reusable discovery data.

Example:

```text id="byvhk8"
Amber Fort
Jaipur
Sightseeing
₹500
180 mins
```

---

# 49. Activity-to-City Relationship

```text id="am7e1r"
City 1 ───────── N Activity
```

Every master activity belongs to one city.

---

# 50. Activity Category

```prisma id="rjg93x"
category ActivityCategory
```

This enables predictable filtering.

---

# 51. Activity Estimated Cost

```prisma id="jhg129"
estimatedCost Int
```

Money is stored as integer.

For current INR-focused MVP:

```text id="m90857"
500 = ₹500
```

---

# 52. Activity Duration

```prisma id="9ixn8s"
durationMins Int
```

Always store duration in minutes.

Examples:

```text id="mx2tt9"
60
120
180
```

Avoid mixing:

```text id="29xcp4"
"2 hours"
"90 min"
"half day"
```

in the database.

Frontend can format minutes for display.

---

# 53. Activity Images

```prisma id="63fj24"
imageUrl String?
```

Optional.

Mainly used for discovery cards.

---

# 54. Activity Indexes

```prisma id="mp8w9t"
@@index([cityId])
@@index([name])
@@index([category])
@@index([estimatedCost])
```

Supports:

- City activity listing
- Search
- Category filters
- Max cost filtering

---

# 55. ItineraryItem Model

This is the most important operational child entity.

An itinerary item represents one scheduled action inside a trip stop.

---

# 56. Two Item Types

An item may be:

## Master Activity Assignment

```text id="xmxdnw"
activityId = Amber Fort ID
customName = null
```

or:

## Custom Item

```text id="xqu551"
activityId = null
customName = "Visit Friend"
```

---

# 57. Itinerary Item Rule

At least one must exist:

```text id="0v9i1y"
activityId
OR
customName
```

The schema cannot express this simple XOR/OR rule directly through standard Prisma fields.

The Itinerary service must validate it.

---

# 58. Item-to-Stop Relationship

```text id="c01cq2"
TripStop 1 ───────── N ItineraryItem
```

Deleting a stop deletes its scheduled items.

---

# 59. Item-to-Activity Relationship

```text id="3zr9oz"
Activity 1 ───────── N ItineraryItem
```

but the activity reference is optional.

This allows custom items.

---

# 60. Item Date

```prisma id="h0tspc"
date DateTime @db.Date
```

Must be within stop dates.

Example:

```text id="xdn7eg"
Stop:
01 Oct → 03 Oct

Item:
02 Oct ✅

Item:
05 Oct ❌
```

---

# 61. Item Start Time

```prisma id="yplyli"
startTime String?
```

Format contract:

```text id="g7sz2i"
HH:mm
```

Examples:

```text id="vaz9td"
09:00
13:30
18:45
```

Store using 24-hour format.

---

# 62. Why Time Is String for MVP

We only need a local time-of-day representation.

We do not need:

- Timezone conversion
- UTC offset
- Date-time instant semantics

Using:

```text id="4ufxr4"
"10:30"
```

is simple and sufficient.

Validation should ensure correct format.

---

# 63. Item Duration

```prisma id="rmfh2o"
durationMins Int?
```

When adding a master Activity, frontend/backend may initially use:

```text id="wwzpvw"
Activity.durationMins
```

but the itinerary item can override it.

---

# 64. Custom Cost Semantics

```prisma id="ge5tgu"
customCost Int?
```

The field serves two cases.

### Existing Activity

If:

```text id="j98464"
customCost = null
```

use:

```text id="85whue"
Activity.estimatedCost
```

If:

```text id="qsz8vt"
customCost = 650
```

use ₹650 instead.

---

### Custom Item

For:

```text id="wew3rx"
customName = "Lunch"
activityId = null
```

`customCost` represents its estimated cost.

---

# 65. Effective Cost Rule

Budget service uses:

```text id="g1lb4c"
IF customCost exists
    use customCost
ELSE IF Activity exists
    use Activity.estimatedCost
ELSE
    use 0
```

Equivalent:

```text id="rr25f6"
effectiveCost =
customCost
?? activity.estimatedCost
?? 0
```

---

# 66. Important `0` Cost Behavior

Zero is a valid cost.

Example:

```text id="jwv8lb"
Marine Drive
₹0
```

Therefore logic must distinguish:

```text id="1x4tyj"
0
```

from:

```text id="hqhyfe"
null
```

Use nullish behavior rather than truthy checks.

Bad:

```text id="o37ktz"
customCost || activityCost
```

because `0` incorrectly falls through.

Correct:

```text id="j92p3q"
customCost ?? activityCost
```

---

# 67. Item Ordering

```prisma id="dyczsj"
sequenceOrder Int
```

Used to control display order.

Example:

```text id="t5zfy9"
October 2

1 Amber Fort
2 Lunch
3 City Palace
```

---

# 68. Item Ordering Scope

Unlike stops, ordering is meaningful primarily per day inside a stop.

Current schema does not enforce uniqueness for:

```text id="mekb72"
tripStopId + date + sequenceOrder
```

because reordering and insertion can be handled in service logic.

If desired later, it could become:

```prisma id="smbtrc"
@@unique([tripStopId, date, sequenceOrder])
```

For MVP, keeping it non-unique reduces migration/reorder friction.

---

# 69. Item Notes

```prisma id="yq75cc"
notes String?
```

Examples:

```text id="u0v82u"
"Book tickets in advance"
"Reach before sunset"
```

---

# 70. Itinerary Item Indexes

```prisma id="shcvoq"
@@index([tripStopId])
@@index([activityId])
@@index([date])
@@index([tripStopId, date])
```

Supports:

- Load items for stop
- Group by date
- Activity lookup
- Timeline generation

---

# 71. Timestamp Fields

Operational entities include:

```text id="rx5j4b"
createdAt
updatedAt
```

These are true timestamps and therefore remain:

```prisma id="ljzabj"
DateTime
```

without:

```text id="w1bykk"
@db.Date
```

---

# 72. Date vs Timestamp Rule

Use:

```text id="ojrnro"
@db.Date
```

for:

- Trip start/end
- Stop arrival/departure
- Itinerary item scheduled date

Use normal DateTime for:

- createdAt
- updatedAt

This distinction is locked.

---

# 73. Money Rules

For MVP, all persisted monetary values use:

```text id="lbnowt"
Int
```

Fields:

```text id="t6cooz"
plannedBudget
transportCost
stayCost
mealCost
estimatedCost
customCost
```

---

# 74. Money Validation

Cost values must normally be:

```text id="ake17p"
>= 0
```

Negative travel costs do not make sense for MVP.

Request validation/service rules should reject negative values.

---

# 75. Currency Scope

The Trip has:

```prisma id="yfi4ht"
currency String @default("INR")
```

But GlobeTrotter MVP does **not** perform currency conversion.

All costs inside a trip are assumed to use the trip's currency.

---

# 76. Relationship Summary

```text id="z0ec8q"
User
1 → N
Trip

Trip
1 → N
TripStop

City
1 → N
TripStop

City
1 → N
Activity

TripStop
1 → N
ItineraryItem

Activity
1 → N
ItineraryItem
```

---

# 77. Cascade Summary

## User → Trip

```text id="wzcrmg"
CASCADE
```

---

## Trip → TripStop

```text id="7zx526"
CASCADE
```

---

## TripStop → ItineraryItem

```text id="q2qgyf"
CASCADE
```

---

## City → Activity

No user-facing city deletion is required.

Do not casually cascade-delete activity master data.

---

# 78. Delete Trip Example

Before:

```text id="98a6id"
Trip
├── Jaipur Stop
│   ├── Amber Fort Item
│   └── Lunch Item
└── Udaipur Stop
    └── Boat Ride Item
```

Delete Trip:

```text id="r3d7go"
Trip ❌
Stops ❌
Items ❌
```

Remaining:

```text id="94d3cc"
Jaipur City ✅
Udaipur City ✅
Amber Fort Activity ✅
Boat Ride Activity ✅
```

---

# 79. Ownership Path

Trip:

```text id="nu3e64"
Trip.userId
```

Stop:

```text id="48u9dc"
TripStop.tripId
      ↓
Trip.userId
```

Item:

```text id="r1oh3p"
ItineraryItem.tripStopId
      ↓
TripStop.tripId
      ↓
Trip.userId
```

This is why all ownership checks ultimately resolve to Trip ownership.

---

# 80. Shared Ownership Query Strategy

For stop or item ownership, services may fetch the relationship directly.

Example conceptual item query:

```text id="b12lc6"
ItineraryItem
 include TripStop
   include Trip
```

Then:

```text id="bsa9wp"
trip.userId === authenticatedUserId
```

Alternatively they may resolve tripId and call shared:

```text id="06qplx"
assertTripOwnership()
```

The important rule is consistent behavior.

---

# 81. Public Sharing Data

Public sharing does not need another table for MVP.

Trip already contains:

```text id="b10ave"
visibility
shareSlug
```

That is enough for:

```text id="auem3j"
PRIVATE
↓
Publish
↓
PUBLIC + unique slug
```

---

# 82. Why No `TripShare` Table

A separate sharing table is useful when supporting:

- Friend-specific permissions
- Multiple share links
- Expiring links
- Read/write roles
- Invitation management

MVP only needs:

```text id="9oijj7"
public vs private
```

so Trip fields are sufficient.

---

# 83. Copy Trip Data Strategy

When copying:

```text id="2faoiu"
Trip
```

must be duplicated.

```text id="c8dvs5"
TripStop
```

records must be duplicated.

```text id="7t0wjj"
ItineraryItem
```

records must be duplicated.

---

# 84. What Is NOT Duplicated During Copy

Do not clone:

```text id="mnsmoq"
City
Activity
```

Those remain global master records.

New stops still point to the same City IDs.

New itinerary items still point to the same Activity IDs where applicable.

---

# 85. Copy Mapping

Example:

```text id="b6gmm1"
Original Stop A → New Stop X
Original Stop B → New Stop Y
```

Then:

```text id="d960pa"
Original Item 1
tripStopId = A
```

becomes:

```text id="mn1svt"
New Item 1
tripStopId = X
```

Therefore copy-trip requires old-to-new stop ID mapping.

---

# 86. Copy Transaction

All cloning must happen inside:

```text id="933e2j"
prisma.$transaction()
```

New trip values:

```text id="nc272y"
userId = authenticated user's ID

visibility = PRIVATE

shareSlug = null
```

---

# 87. Search Strategy

MVP search uses PostgreSQL.

Example:

```text id="k1u3h6"
GET /cities?search=jai
```

Prisma may use case-insensitive contains search.

Activities can filter on:

```text id="jp454y"
cityId
category
estimatedCost
```

No search engine is required.

---

# 88. Seed Data Requirements

Database should initially contain:

```text id="6nar8c"
Cities
Activities
```

Recommended target:

```text id="zxvzqz"
15–25 cities
```

with:

```text id="5dgr4m"
5–10 activities each
```

for a convincing demo.

---

# 89. Suggested Seed Cities

Examples:

```text id="okud6q"
Ahmedabad
Mumbai
Goa
Jaipur
Jodhpur
Udaipur
Delhi
Agra
Manali
Bengaluru
Hyderabad
Kolkata
Varanasi
Paris
Tokyo
```

Exact seed list is defined in `13_SEED_DATA.md`.

---

# 90. Demo Data Philosophy

Seed data should be:

- Small enough to maintain
- Large enough to make search believable
- Deterministic
- Available offline

Avoid relying on external destination APIs for core demonstration.

---

# 91. Database Query for Trip Detail

A normal trip detail request should conceptually load:

```text id="cf2fhs"
Trip
│
├── User safe fields if needed
│
└── Stops
    │
    ├── City
    │
    └── Items
        │
        └── Activity
```

This supports:

- Builder
- Read-only itinerary
- Calendar
- Public page

---

# 92. Ordering When Reading Trip

Stops:

```text id="1hqo4p"
sequenceOrder ASC
```

Items:

primarily:

```text id="ryahss"
date ASC
```

then:

```text id="4b6b5h"
sequenceOrder ASC
```

If startTime is desired for display, UI may also consider it.

The API contract should define one consistent ordering.

---

# 93. Budget Query Requirements

Budget service needs:

```text id="4qx508"
Trip
├── plannedBudget
├── transportCost
├── stayCost
├── mealCost
└── Stops
    └── Items
        └── Activity.estimatedCost
```

Then calculate:

```text id="enmbpn"
activityTotal
estimatedTotal
remaining
averagePerDay
```

---

# 94. Day Count

For budget average:

```text id="e3ba32"
trip duration =
endDate - startDate + 1 day
```

Example:

```text id="ajhrjc"
1 Oct → 7 Oct
```

means:

```text id="4d8ps2"
7 days
```

not six.

---

# 95. Budget Formula

```text id="vl4f1b"
activityCost =
sum(effective itinerary item cost)
```

Then:

```text id="r7dj7p"
estimatedTotal =
transportCost
+
stayCost
+
mealCost
+
activityCost
```

If plannedBudget exists:

```text id="ikseie"
remaining =
plannedBudget - estimatedTotal
```

Negative remaining means over budget.

---

# 96. Over-Budget State

Example:

```text id="8um1ip"
Planned:
₹30,000

Estimated:
₹34,500

Remaining:
-₹4,500
```

Frontend may display:

```text id="8b7x4q"
Over budget by ₹4,500
```

No separate database field is required.

---

# 97. Database Constraints vs Service Validation

Use database constraints for structural guarantees:

```text id="6fjufw"
unique email
unique share slug
foreign keys
unique stop sequence
```

Use services for business rules:

```text id="g98mpk"
trip date order
stop range
item date range
activity city match
cost >= 0
```

Do not expect Prisma schema alone to encode every product rule.

---

# 98. Schema Changes During Hackathon

Once both backend developers begin implementation, schema changes should be coordinated.

Do not independently modify:

```text id="xxctgk"
schema.prisma
```

without notifying the other backend developer.

Reason:

Prisma migration conflicts can be more disruptive than ordinary code conflicts.

---

# 99. Migration Naming

Examples:

```text id="5efnx7"
init

add_trip_budget

add_activity_category

add_sharing
```

Avoid vague names like:

```text id="mx12ie"
changes
update2
fix
```

---

# 100. Initial Migration

After schema is confirmed:

```text id="gckr41"
npx prisma migrate dev --name init
```

This should create all MVP tables and enums.

---

# 101. Prisma Seed

Seed command:

```text id="3ywwuj"
npx prisma db seed
```

Seed script:

```text id="ccfxlh"
prisma/seed.ts
```

should be repeatable where practical.

---

# 102. Database Reset

During early development:

```text id="c2uiqp"
npx prisma migrate reset
```

may be used when everyone understands that local data will be deleted.

Do not run it casually once important demo data has been manually entered.

---

# 103. Database Environment Variable

```text id="6n33nm"
DATABASE_URL
```

Example local format:

```text id="4u2f6u"
postgresql://globe:<YOUR_PASSWORD>@localhost:5432/globetrotter?schema=public
```

Actual secrets belong in `.env`.

---

# 104. No Raw Passwords in Seed

If demo users are seeded, passwords must still be bcrypt-hashed.

Do not store plain-text password values directly in `passwordHash`.

A demo credential can be documented separately for the team.

---

# 105. Possible Future Tables

Not part of MVP but easy to add later:

```text id="5udogn"
SavedDestination
Expense
TripCollaborator
TripComment
FavoriteActivity
TripReaction
Notification
```

None should be added until the core product works.

---

# 106. Future Expense Model

If budget requirements expand, future:

```text id="3dnluf"
Expense
├── tripId
├── category
├── amount
├── date
└── notes
```

could replace/supplement flat trip-level budget fields.

This is explicitly deferred.

---

# 107. Future Collaboration Model

If actual friend sharing/editing is added:

```text id="r3yw3e"
TripCollaborator

tripId
userId
role
```

could support:

```text id="h6m31a"
VIEWER
EDITOR
```

Not required for MVP.

---

# 108. ER Diagram — Relationship View

```text id="q0cnnd"
                        ┌─────────────┐
                        │    USER     │
                        └──────┬──────┘
                               │
                               │ owns
                               │ 1:N
                               ▼
                        ┌─────────────┐
                        │    TRIP     │
                        └──────┬──────┘
                               │
                               │ contains
                               │ 1:N
                               ▼
      ┌───────────────┐  N:1 ┌───────────────┐
      │     CITY      │◄─────│   TRIP STOP   │
      └──────┬────────┘      └───────┬───────┘
             │                       │
             │ has                   │ contains
             │ 1:N                   │ 1:N
             ▼                       ▼
      ┌───────────────┐      ┌──────────────────┐
      │   ACTIVITY    │◄─────│ ITINERARY ITEM   │
      └───────────────┘ 0..1 └──────────────────┘
```

---

# 109. Complete Example

Suppose database contains:

```text id="6gkjqb"
USER
Nishant
```

Trip:

```text id="654xdf"
Rajasthan Trip

01 Oct → 07 Oct
₹40,000 planned budget
```

Stops:

```text id="uchkor"
1 Jaipur
01 Oct → 03 Oct

2 Jodhpur
04 Oct → 05 Oct

3 Udaipur
06 Oct → 07 Oct
```

Jaipur items:

```text id="okn4hb"
Amber Fort
01 Oct
09:00
₹600

Lunch
01 Oct
13:00
₹500

Hawa Mahal
02 Oct
17:00
₹200
```

Those three item records are sufficient to generate:

- Itinerary
- Jaipur timeline
- Calendar
- Activity budget
- Public itinerary

No duplicated representation is stored.

---

# 110. Final Schema Rules

The following rules are now locked:

1. UUID primary keys.
2. PostgreSQL relational database.
3. Prisma ORM.
4. `@db.Date` for calendar dates.
5. Timestamps only for metadata.
6. Integer money fields.
7. Trip owns Stops.
8. Stops reference Cities.
9. Stops own ItineraryItems.
10. Items may reference Activities.
11. Items may alternatively be custom.
12. Budget totals are calculated.
13. Calendar is derived.
14. Itinerary is derived.
15. Sharing is stored on Trip.
16. Copying duplicates Trip/Stops/Items only.
17. Cascading deletion applies to owned trip data.
18. Master City/Activity data survives user trip deletion.
19. Ownership always resolves through Trip.
20. Business validation lives in services.

---

# 111. Database Source of Truth

This document and:

```text id="55vtff"
prisma/schema.prisma
```

must remain synchronized.

If they disagree after implementation begins:

> `schema.prisma` describes what currently runs, but this document describes the agreed architecture.

The discrepancy should be fixed immediately rather than allowed to persist.

---

# 112. Final Database Principle

> Model facts once, represent them many times.

For GlobeTrotter:

```text id="tu3boa"
TripStop
```

stores that a city is part of a trip.

```text id="8tzx57"
ItineraryItem
```

stores that an activity is scheduled.

From those facts, GlobeTrotter can produce:

```text id="45qpbr"
Itinerary
Calendar
Budget
Dashboard
Public View
```

without creating redundant versions of the same information.

This schema is considered **locked for the GlobeTrotter MVP**.