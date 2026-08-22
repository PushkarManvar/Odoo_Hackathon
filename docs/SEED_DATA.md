# GlobeTrotter — Seed Data Strategy

## 1. Purpose

This document defines the seed data strategy for GlobeTrotter.

Seed data gives every developer the same predictable local dataset.

It also ensures the hackathon demo works even if:

- Internet access is unstable
- Third-party APIs fail
- External API rate limits are reached
- Search providers are unavailable
- Demo preparation time is limited

The application should be able to demonstrate the complete MVP using local seeded data.

---

# 2. Seed Data Goals

Seed data should provide enough information to test:

- Authentication
- Trip creation
- City selection
- Activity discovery
- Itinerary creation
- Budget calculation
- Public sharing
- Copy Trip
- Search
- Filtering
- Empty states
- Demo flows

The seed should remain:

```text
Small
+
Useful
+
Predictable
+
Repeatable
```

It should not attempt to reproduce a real global travel database.

---

# 3. Seed Data Categories

The seed should contain:

```text
Users
Cities
Activities
Trips
TripStops
ItineraryItems
```

Optional supporting information may include:

```text
Categories
Popularity values
Images
Descriptions
Estimated costs
Duration
```

---

# 4. Seed Execution

The expected seed command is:

```bash
npx prisma db seed
```

The seed script should live with the backend Prisma setup.

Conceptually:

```text
apps/api/
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

The exact repository structure follows `PROJECT_STRUCTURE.md`.

---

# 5. Seed Philosophy

Seed data must be deterministic enough that both developers know what data exists.

Avoid:

```text
Random city names
Random prices every run
Random relationships
Random demo users
```

Prefer:

```text
Known cities
Known activities
Known demo accounts
Known example trips
Known costs
```

This makes debugging much easier.

---

# 6. Core City Seed

The MVP does not require every city in the world.

Seed a focused set of recognizable destinations.

Recommended initial cities:

```text
Jaipur
Udaipur
Delhi
Mumbai
Goa
Ahmedabad
Bengaluru
Agra
Paris
Amsterdam
Berlin
London
Rome
Tokyo
Dubai
```

This provides:

- Indian destinations for the primary demo
- International destinations for broader product presentation
- Enough variety for search and filtering

---

# 7. Minimum City Fields

Each seeded City should follow `DATABASE_SCHEMA.md`.

Typical fields may include:

```text
id
name
country
imageUrl
description
popularity
```

Only fields actually present in the final Prisma schema should be seeded.

Do not add seed-only fields that are not part of the documented database model.

---

# 8. City Naming Rule

Use consistent canonical names.

GOOD:

```text
Jaipur
New Delhi
Amsterdam
```

Avoid multiple inconsistent records like:

```text
Delhi
New Delhi
Delhi City
NCR Delhi
```

unless the database intentionally models them separately.

---

# 9. City Uniqueness

The seed should prevent duplicate cities.

If the database defines a uniqueness constraint such as:

```text
name + country
```

the seed should respect it.

Repeated seed execution should not create duplicate city records.

---

# 10. Activity Seed

Each city should contain multiple activities.

Recommended:

```text
4–8 activities per core demo city
```

This is enough for meaningful discovery without creating unnecessary seed complexity.

Example:

```text
Jaipur
├── Amber Fort
├── City Palace
├── Hawa Mahal
├── Jantar Mantar
├── Nahargarh Fort
└── Local Food Walk
```

---

# 11. Activity Categories

Use the categories defined in `DATABASE_SCHEMA.md` and `BUSINESS_RULES.md`.

Example conceptual categories:

```text
SIGHTSEEING
FOOD
MUSEUM
ADVENTURE
SHOPPING
ENTERTAINMENT
```

Do not create category strings independently if an enum already exists.

---

# 12. Activity Fields

Typical activity seed fields may include:

```text
name
cityId
category
description
estimatedCost
durationMinutes
imageUrl
popularity
```

Again, only seed fields defined by the final schema.

---

# 13. Activity Cost Rule

All money values must follow the database money rule.

If the database stores money as integer minor units:

```text
₹500.00
```

should be stored according to the exact rule defined in `DATABASE_SCHEMA.md`.

Do not use floating-point values for money if the project has locked integer storage.

---

# 14. Estimated Costs

Seed activity costs should be believable enough for the demo.

They do not need to represent exact live market prices.

Their purpose is to support:

```text
Activity selection
+
Budget calculation
+
Demo presentation
```

The UI should present them as estimated values.

---

# 15. Example Jaipur Activities

Conceptual seed:

```text
Amber Fort
Category: SIGHTSEEING

City Palace
Category: SIGHTSEEING

Hawa Mahal
Category: SIGHTSEEING

Jantar Mantar
Category: MUSEUM / SIGHTSEEING

Nahargarh Fort
Category: SIGHTSEEING

Jaipur Food Walk
Category: FOOD
```

Exact category values must match the schema enum.

---

# 16. Example Udaipur Activities

Recommended:

```text
City Palace Udaipur
Lake Pichola
Jag Mandir
Sajjangarh Palace
Bagore Ki Haveli
Udaipur Food Walk
```

---

# 17. Example Goa Activities

Recommended:

```text
Baga Beach
Calangute Beach
Basilica of Bom Jesus
Dudhsagar Falls
Goa Food Tour
Water Sports
```

---

# 18. Example Agra Activities

Recommended:

```text
Taj Mahal
Agra Fort
Mehtab Bagh
Itmad-ud-Daulah
Local Food Tour
```

---

# 19. International Activities

International cities should also have enough data to demonstrate broader product capability.

Example:

```text
Paris
├── Eiffel Tower
├── Louvre Museum
├── Seine Cruise
├── Montmartre
└── Notre-Dame Area
```

Example:

```text
Amsterdam
├── Rijksmuseum
├── Van Gogh Museum
├── Canal Cruise
├── Anne Frank House
└── Jordaan Walk
```

Example:

```text
Berlin
├── Brandenburg Gate
├── Museum Island
├── Berlin Wall Memorial
├── Reichstag
└── Alexanderplatz
```

---

# 20. Activity Search Coverage

Seed data should intentionally support search examples.

Example:

Search:

```text
Fort
```

should return several relevant records.

Search:

```text
Museum
```

should produce multiple activity results.

Search:

```text
Food
```

should return activities across several cities.

This helps test frontend search behavior.

---

# 21. Popularity Values

If the schema supports activity or city popularity, seed predictable values.

Example conceptually:

```text
Amber Fort        → high
Hawa Mahal        → high
Food Walk         → medium
```

Popularity may help sort discovery results.

Do not over-engineer ranking for the MVP.

---

# 22. Images

If City or Activity records include image URLs, seeded URLs should be stable.

Do not make the application depend on fragile temporary image links.

Possible strategies:

```text
Static assets bundled with frontend
```

or:

```text
Stable remote image URLs
```

For maximum demo reliability, local/static assets are safer.

---

# 23. Image Failure Handling

The frontend should still work if an image fails.

Fallback concept:

```text
Image URL unavailable
        ↓
Show placeholder
```

Image failure should never make city or activity discovery unusable.

---

# 24. Demo Users

The seed should create predictable demo accounts.

At minimum:

```text
Demo User A
Demo User B
```

This supports:

- Normal trip ownership
- Authorization testing
- Public sharing
- Copy Trip demonstration

---

# 25. Demo Account Purpose

User A:

```text
Primary demo owner
```

User B:

```text
Second-account testing
Copy Trip demonstration
Ownership testing
```

Their exact credentials should be documented for the team but should only be development/demo credentials.

---

# 26. Demo Password Storage

Even seeded demo users should follow real application security behavior.

Do not insert plaintext passwords directly into the `passwordHash` field.

Seed flow:

```text
Known Demo Password
        ↓
bcrypt hash
        ↓
Store hash
```

This ensures login behaves exactly like normal user accounts.

---

# 27. Demo Account Example

Conceptually:

```text
User A
email: demo1@globetrotter.local
password: <documented demo password>

User B
email: demo2@globetrotter.local
password: <documented demo password>
```

The final credential values should be consistent across the team.

Do not use personal passwords.

---

# 28. Demo Trips

At least one complete seeded trip should exist.

Recommended:

```text
Rajasthan Explorer
```

Possible stops:

```text
Jaipur
   ↓
Udaipur
```

This trip should demonstrate:

- Multiple stops
- Multiple activities
- Dates
- Accommodation costs
- Transport costs
- Budget total
- Public visibility if needed

---

# 29. Primary Demo Trip

Suggested primary seeded trip:

```text
Rajasthan Explorer
```

Structure:

```text
Rajasthan Explorer
│
├── Jaipur
│   ├── Amber Fort
│   ├── City Palace
│   └── Hawa Mahal
│
└── Udaipur
    ├── City Palace Udaipur
    ├── Lake Pichola
    └── Sajjangarh Palace
```

This gives the demo a clear and understandable journey.

---

# 30. International Demo Trip

Optionally seed:

```text
Europe Adventure
```

Example:

```text
Paris
   ↓
Amsterdam
   ↓
Berlin
```

This can demonstrate that GlobeTrotter is not limited to domestic travel.

It is optional if seed complexity becomes too high.

---

# 31. Demo Trip Dates

Seed trip dates must satisfy all rules from `BUSINESS_RULES.md`.

Example structure:

```text
Trip:
10 Oct → 18 Oct

Jaipur:
10 Oct → 13 Oct

Udaipur:
14 Oct → 18 Oct
```

Every itinerary date must remain inside its stop.

---

# 32. TripStop Seed

Each seeded TripStop should include the fields required by `DATABASE_SCHEMA.md`.

Conceptually:

```text
tripId
cityId
startDate
endDate
position
accommodationCost
transportCost
```

The exact fields must match the final Prisma schema.

---

# 33. Stop Ordering

The sequence must be deterministic.

Example:

```text
Jaipur
position = 1

Udaipur
position = 2
```

Never depend on database insertion order to represent the journey.

---

# 34. Seeded Itinerary Items

Each demo stop should have multiple itinerary items.

Example:

```text
Jaipur — Day 1

09:00 Amber Fort
14:00 City Palace
17:00 Hawa Mahal
```

These records should connect:

```text
Trip
 ↓
TripStop
 ↓
ItineraryItem
 ↓
Activity
```

according to the final schema.

---

# 35. Custom Activities

If the schema supports custom itinerary items through something like:

```text
customName
```

seed at least one example.

Example:

```text
Dinner with local cuisine
```

This helps verify that the app supports both:

```text
Master Activity
```

and:

```text
Custom Itinerary Activity
```

if that behavior is part of the locked business rules.

---

# 36. Public Demo Trip

At least one seeded trip may be set to:

```text
PUBLIC
```

This supports instant testing of:

```text
Public itinerary
Share link
Copy Trip
```

without having to manually create a trip every time.

---

# 37. Private Demo Trip

Also maintain a private trip.

This helps test authorization.

Example:

```text
User A owns PRIVATE Trip
        ↓
User B attempts access
        ↓
Request denied
```

---

# 38. Copy Trip Testing

Seed data should make this flow easy to test:

```text
User A
owns Public Trip
      ↓
User B
opens Public Trip
      ↓
Copy Trip
      ↓
New Private Trip
owned by User B
```

The original trip must remain unchanged.

---

# 39. Ownership Test Data

The seed should support:

```text
User A → Trip A
User B → Trip B
```

Then tests can verify:

```text
User A edits Trip A
→ allowed
```

```text
User A edits Trip B
→ rejected
```

This is important for testing `assertTripOwnership()`.

---

# 40. Seed Idempotency

Running:

```bash
npx prisma db seed
```

multiple times should ideally not create duplicate reference data.

Possible strategies include:

```text
upsert()
```

for:

```text
Users
Cities
Activities
```

The exact implementation depends on available unique keys.

---

# 41. Upsert Strategy

Conceptually:

```text
Find City by unique field
        ↓
Exists?
├── YES → update/leave
└── NO  → create
```

This is especially useful for master data.

---

# 42. Demo Trip Re-Seeding

Trips are more complex because they contain nested relational data.

Possible strategy:

```text
Find known seeded demo trip
        ↓
Delete existing seeded version
        ↓
Recreate predictable structure
```

or use carefully designed nested upserts.

For hackathon reliability, simple deterministic recreation is acceptable in local development.

---

# 43. Seed Dependency Order

Records must be created in relationship order.

Recommended:

```text
1. Users
2. Cities
3. Activities
4. Trips
5. TripStops
6. ItineraryItems
```

Because:

```text
Activity needs City
Trip needs User
TripStop needs Trip + City
ItineraryItem needs Stop
```

---

# 44. Seed Flow

```text
Start Seed
    ↓
Create Users
    ↓
Create Cities
    ↓
Create Activities
    ↓
Create Trips
    ↓
Create Stops
    ↓
Create Itinerary Items
    ↓
Seed Complete
```

---

# 45. Development Seed vs Production Data

The seed exists for:

```text
Development
Testing
Demo
```

It is not intended as production travel data.

Do not make claims that:

```text
Costs are live
Activities are exhaustive
Popularity is real-time
Availability is current
```

Seed data is deliberately static.

---

# 46. No Third-Party Dependency

The core demo must work using:

```text
PostgreSQL
+
Seed Data
```

without requiring:

```text
Google Places
TripAdvisor
Booking APIs
Flight APIs
Live hotel APIs
```

External APIs may be considered later, but they must not be required for the MVP demo.

---

# 47. City Discovery Flow Using Seed Data

```text
User types "Jai"
        ↓
Frontend calls API
        ↓
Backend searches City table
        ↓
Jaipur returned
```

No external request is required.

---

# 48. Activity Discovery Flow

```text
User selects Jaipur
        ↓
Activity search
        ↓
Backend queries Activity
WHERE cityId = Jaipur
        ↓
Return seeded activities
```

This makes activity discovery reliable and fast.

---

# 49. Search Behavior

Seed records should contain enough variety to test:

```text
Exact search
Partial search
Case-insensitive search
City filtering
Category filtering
```

where supported by the API contract.

---

# 50. Search Empty State

The seed should also make it possible to search nonsense text.

Example:

```text
"xyzabc"
```

Expected:

```text
No results
```

This verifies frontend empty-state behavior.

---

# 51. Budget Test Data

Seed trip costs should make budget calculations easy to verify manually.

Example:

```text
Activities        ₹3,000
Accommodation     ₹8,000
Transport         ₹4,000
-------------------------
Total             ₹15,000
```

Choose numbers that are easy to cross-check during development.

---

# 52. Budget Calculation Test

The seeded demo should allow developers to manually verify:

```text
Sum activity items
+
Sum accommodation
+
Sum transport
=
API total
```

This catches budget errors quickly.

---

# 53. Calendar Test Coverage

Seed itinerary items across multiple dates.

Avoid putting every activity on one day.

Example:

```text
Day 1 → 3 items
Day 2 → 2 items
Day 3 → 2 items
```

This makes the calendar/timeline view meaningful.

---

# 54. Category Test Coverage

Make sure multiple categories are present.

Example:

```text
SIGHTSEEING
FOOD
MUSEUM
ADVENTURE
```

Do not seed 30 activities that all belong to a single category.

---

# 55. Cost Diversity

Seed activities with different estimated costs.

Example conceptually:

```text
Free / very low-cost activity
Low-cost activity
Medium-cost activity
Higher-cost activity
```

This makes budget visualization more useful.

---

# 56. Seed Images Strategy

Preferred order:

```text
1. Local project assets
2. Stable hosted assets
3. Placeholder
```

Do not build the demo around unknown third-party image availability.

---

# 57. Seed Data Ownership

Person B primarily owns:

```text
Cities
Activities
```

because these belong to discovery/itinerary work.

Demo users and demo trips affect both developers.

Therefore changes to:

```text
seed.ts
```

should be coordinated when they affect shared demo data.

---

# 58. Seed Changes Rule

When changing seed data:

```text
Check schema
      ↓
Update seed
      ↓
Reset/test database
      ↓
Verify complete demo flow
      ↓
Commit
```

Do not change seed fields that no longer exist in Prisma.

---

# 59. After Schema Changes

Whenever `schema.prisma` changes:

```text
Review seed.ts
```

because:

```text
Renamed field
Required field added
Enum changed
Relationship changed
```

may cause the seed to fail.

---

# 60. Seed Failure Handling

If seeding fails:

```text
Read first failing record
        ↓
Check Prisma schema
        ↓
Check enum values
        ↓
Check unique constraints
        ↓
Check relationship IDs
        ↓
Fix root cause
```

Avoid manually patching the database after every seed run.

---

# 61. Demo Reliability Rule

Before judging begins:

```text
Reset local database
      ↓
Apply migrations
      ↓
Run seed
      ↓
Run application
      ↓
Execute full demo
```

If the complete demo works from fresh seed data, the project is in a much safer state.

---

# 62. Recommended MVP Seed Size

A practical target:

```text
2 demo users

10–15 cities

40–70 activities

2–3 demo trips

5–10 trip stops

15–30 itinerary items
```

This is enough for a convincing MVP.

Do not spend valuable hackathon time creating hundreds of records manually.

---

# 63. Minimum Viable Seed

If time becomes very limited:

```text
2 users
3 cities
5 activities per city
1 complete public trip
1 private trip
```

This is enough to demonstrate the core system.

---

# 64. Suggested Demo Dataset

Recommended core hackathon data:

```text
Users
├── Demo User A
└── Demo User B


Cities
├── Jaipur
├── Udaipur
├── Goa
├── Agra
├── Ahmedabad
├── Delhi
├── Paris
├── Amsterdam
└── Berlin


Primary Trip
Rajasthan Explorer

Jaipur
├── Amber Fort
├── City Palace
└── Hawa Mahal

Udaipur
├── City Palace Udaipur
├── Lake Pichola
└── Sajjangarh Palace
```

Optional:

```text
Europe Adventure
Paris → Amsterdam → Berlin
```

---

# 65. Final Seed Rule

Seed data exists to make GlobeTrotter:

```text
Easy to Run
+
Easy to Test
+
Easy to Demo
```

The priority is not data quantity.

The priority is having a small, stable dataset that exercises the complete application flow.

If the entire hackathon demo can run from a fresh database using only:

```text
prisma migrate
+
prisma seed
```

then the seed strategy is successful.