# GlobeTrotter — Hackathon Demo Plan

## 1. Purpose

This document defines the exact demo flow for GlobeTrotter during judging.

The goal is to ensure the demo is:

- Short
- Clear
- Reliable
- Easy to follow
- Focused on the strongest product value
- Protected by fallback options

The demo should not attempt to show every technical detail.

It should show one complete story.

---

# 2. Demo Goal

The judges should understand GlobeTrotter as:

```text
A multi-city trip planning platform
that helps users:

Create trips
+
Add destinations
+
Plan activities
+
See itinerary
+
Track estimated budget
+
View calendar
+
Share trips
+
Copy public trips
```

The demo should prove that this entire journey works.

---

# 3. Primary Demo Story

Recommended primary story:

```text
Rajasthan Trip
```

Destinations:

```text
Jaipur
   ↓
Udaipur
```

This is simple enough to explain quickly and rich enough to demonstrate the product.

---

# 4. Demo Characters

Use two demo users.

```text
User A
Primary trip creator
```

```text
User B
Second user
```

User B is useful for demonstrating:

```text
Public sharing
+
Copy Trip
+
Ownership separation
```

---

# 5. Demo Environment

Before judging:

```text
Frontend
http://localhost:5173
```

```text
Backend
http://localhost:4000
```

```text
PostgreSQL
localhost:5432
```

or the final deployed environment if deployment is used.

The exact environment used during judging should already be tested.

---

# 6. Pre-Demo Preparation

Before judges arrive:

- [ ] PostgreSQL running
- [ ] Backend running
- [ ] Frontend running
- [ ] Latest migrations applied
- [ ] Seed completed
- [ ] Demo users tested
- [ ] Demo passwords confirmed
- [ ] Browser tabs prepared
- [ ] Public trip tested
- [ ] Copy Trip tested
- [ ] Budget verified
- [ ] No important console errors
- [ ] Backup trip available
- [ ] Repository committed

Do not start the demo with setup commands unless judges specifically ask.

---

# 7. Primary Demo Flow

The main sequence:

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
Show Itinerary
  ↓
Show Budget
  ↓
Show Calendar
  ↓
Publish Trip
  ↓
Open Public Trip
  ↓
Copy Using User B
```

This is the strongest full product story.

---

# 8. Step 1 — Login

Start with User A.

Show the login page briefly.

Explain:

```text
"Users can create an account and securely manage their own trips."
```

Log in using the prepared demo account.

Do not spend a long time discussing authentication unless asked.

---

# 9. What Login Proves

The login step demonstrates:

```text
Authentication
JWT-based session
User-specific data
Protected trip management
```

Keep the visual explanation short.

---

# 10. Step 2 — Dashboard

After login, show the Dashboard.

The judge should immediately see:

- Existing trips
- Create Trip action
- Clear navigation

Explain:

```text
"This is the user's trip dashboard. They can manage existing trips or start planning a new one."
```

Do not click through unrelated settings or secondary screens.

---

# 11. Step 3 — Create Trip

Click:

```text
Create Trip
```

Create:

```text
Rajasthan Explorer
```

Example dates:

```text
10 October 2026
to
18 October 2026
```

Keep visibility:

```text
PRIVATE
```

initially.

Explain:

```text
"The user first defines the overall trip dates. Every destination and activity is validated against this trip window."
```

This naturally introduces the project's business-rule logic.

---

# 12. What Trip Creation Proves

This demonstrates:

```text
Trip CRUD
Ownership
Date validation
Database persistence
```

Do not open developer tools unless a judge asks for technical proof.

---

# 13. Step 4 — Add Jaipur

Add a destination.

Search:

```text
Jaipur
```

Select Jaipur.

Choose valid stop dates within the trip.

Example:

```text
10 October
to
13 October
```

If costs are entered at stop level, add simple believable values.

Example:

```text
Accommodation
₹6,000

Transport
₹1,500
```

---

# 14. Explain City Search

Say something like:

```text
"Destinations come from our local discovery dataset, so the core planner remains reliable even without a third-party travel API."
```

This reinforces the architectural decision without sounding like a limitation.

---

# 15. Step 5 — Add Udaipur

Add:

```text
Udaipur
```

Example dates:

```text
14 October
to
18 October
```

Add estimated stop costs if part of the UI.

Now the trip visually shows:

```text
Jaipur
  ↓
Udaipur
```

---

# 16. What Stops Prove

This demonstrates:

```text
Multi-city trip planning
Stop ordering
Trip-stop relationships
Date constraints
```

If the UI supports drag-and-drop or reorder controls, show it only if stable.

---

# 17. Optional Stop Reorder Demo

Only show stop reordering if it works smoothly.

Example:

```text
Jaipur
Udaipur
```

temporarily reorder and move back.

Explain:

```text
"The user controls the order of destinations, and that sequence is persisted."
```

Skip this if it creates demo risk.

---

# 18. Step 6 — Add Jaipur Activities

Open Jaipur.

Search or browse activities.

Recommended activities:

```text
Amber Fort
City Palace
Hawa Mahal
```

Add at least two or three.

Choose dates and times.

Example:

```text
10 Oct
09:00 — Amber Fort

10 Oct
14:00 — City Palace

11 Oct
17:00 — Hawa Mahal
```

---

# 19. Explain Activities

Say:

```text
"Activities are tied to the selected city and become itinerary items when the user schedules them."
```

This explains the master Activity vs ItineraryItem design simply.

---

# 20. Step 7 — Add Udaipur Activities

Recommended:

```text
City Palace Udaipur
Lake Pichola
Sajjangarh Palace
```

Add two or three.

Example:

```text
15 Oct
10:00 — City Palace Udaipur

16 Oct
17:00 — Lake Pichola
```

The trip now has enough data to make itinerary and budget meaningful.

---

# 21. What Activity Planning Proves

This demonstrates:

```text
Activity discovery
City filtering
Itinerary creation
Date/time scheduling
Activity-to-stop validation
```

This is one of the most important parts of the product demo.

---

# 22. Step 8 — Show Itinerary

Open the itinerary view.

The judge should see a structured schedule such as:

```text
10 October — Jaipur

09:00 Amber Fort
14:00 City Palace


11 October — Jaipur

17:00 Hawa Mahal


15 October — Udaipur

10:00 City Palace Udaipur


16 October — Udaipur

17:00 Lake Pichola
```

Explain:

```text
"GlobeTrotter converts individual selections into one organized day-by-day travel plan."
```

---

# 23. Itinerary Demo Priority

Do not spend time editing every activity during the demo.

The most important thing is to show:

```text
Destinations
+
Dates
+
Times
+
Activities
```

working together.

---

# 24. Optional Itinerary Edit

If stable, edit one activity time.

Example:

```text
14:00
→
15:00
```

Show that the itinerary updates.

This proves the planner is interactive rather than static.

Skip if time is limited.

---

# 25. Step 9 — Show Budget

Open the Budget page.

Show breakdown:

```text
Activities
Accommodation
Transport
Total
```

Example conceptually:

```text
Activities       ₹3,000
Accommodation    ₹8,000
Transport        ₹4,000
------------------------
Total            ₹15,000
```

Explain:

```text
"The budget is automatically derived from the trip instead of being maintained as a separate manual total."
```

---

# 26. What Budget Proves

This demonstrates:

```text
Derived calculations
Data consistency
Cross-module integration
Practical user value
```

This is a strong judge-facing feature because it is immediately understandable.

---

# 27. Budget Demo Rule

Know the expected demo total before judging.

Do not discover during the presentation that:

```text
₹15,000
```

unexpectedly became:

```text
₹150,000
```

because of money-unit mistakes.

Verify demo values beforehand.

---

# 28. Optional Live Budget Update

If stable:

```text
Add one activity
```

then show the budget update.

This visually proves automatic recalculation.

Only do this if it works reliably.

---

# 29. Step 10 — Show Calendar

Open the Calendar or timeline view.

Explain:

```text
"The same itinerary can also be viewed chronologically, making it easier to understand each day of the trip."
```

Show multiple dates and cities.

---

# 30. What Calendar Proves

This demonstrates that GlobeTrotter does not simply store an unordered list.

It organizes:

```text
Trip dates
+
Stop dates
+
Activity dates
+
Activity times
```

into a usable schedule.

---

# 31. Calendar Demo Rule

Keep calendar presentation short.

It is a visualization of itinerary data, not a separate major product workflow.

The judge should understand it within a few seconds.

---

# 32. Step 11 — Publish Trip

Return to trip controls.

Change:

```text
PRIVATE
```

to:

```text
PUBLIC
```

or use the dedicated Publish action.

Explain:

```text
"Once the user is happy with the plan, they can publish it and share the itinerary without giving others edit access."
```

---

# 33. Show Share Link

Copy or open the public trip URL.

Example conceptual route:

```text
/shared/:tripId
```

Open it in:

```text
Incognito
```

or a separate browser session.

This visually proves public access is independent of the owner's authentication.

---

# 34. Step 12 — Public Trip

Show:

- Trip name
- Stops
- Activities
- Itinerary
- Budget

Explain:

```text
"The public version is read-only, so people can use the trip for inspiration without modifying the original."
```

---

# 35. What Public Sharing Proves

This demonstrates:

```text
Visibility
Public endpoint
Read-only sharing
Public/private separation
```

This is an important differentiator from a purely private trip planner.

---

# 36. Step 13 — Copy Trip

Switch to User B.

From the public trip, choose:

```text
Copy Trip
```

Explain:

```text
"Instead of rebuilding someone else's itinerary from scratch, another user can copy the trip into their own account."
```

---

# 37. Copy Result

Open User B's copied trip.

Show that:

```text
Stops copied
Activities copied
Original structure copied
```

and that the new trip belongs to User B.

The copy should normally be:

```text
PRIVATE
```

according to the locked business rules.

---

# 38. Demonstrate Independence

If time allows, change something on User B's copied trip.

Example:

```text
Delete one activity
```

Then explain:

```text
"The copy is completely independent. Editing it does not change the original user's trip."
```

This is a very strong demonstration of the database design.

---

# 39. Main Demo Ending

Finish with the product value.

Recommended message:

```text
"GlobeTrotter brings the entire planning process into one flow — destinations, activities, itinerary, budget, calendar, and sharing — while keeping the architecture simple and reliable enough to extend later."
```

Do not end the demo buried inside a settings page or error state.

---

# 40. Ideal Demo Sequence

```text
LOGIN
  ↓
DASHBOARD
  ↓
CREATE TRIP
  ↓
JAIPUR
  ↓
UDAIPUR
  ↓
ACTIVITIES
  ↓
ITINERARY
  ↓
BUDGET
  ↓
CALENDAR
  ↓
PUBLISH
  ↓
PUBLIC VIEW
  ↓
COPY TRIP
```

This is the primary demo path.

---

# 41. Demo Timing Strategy

If the presentation window is short, prioritize:

```text
Create Trip
Add Stops
Add Activities
Itinerary
Budget
Sharing
```

Secondary:

```text
Calendar
Copy Trip
```

Optional:

```text
Reorder
Activity edit
Detailed settings
```

Do not rush the core story just to show every feature.

---

# 42. Minimum Demo Version

If time is extremely limited:

```text
Login
 ↓
Open/Create Trip
 ↓
Show Jaipur + Udaipur
 ↓
Show Activities
 ↓
Show Itinerary
 ↓
Show Budget
 ↓
Publish
```

This still communicates the core product.

---

# 43. Demo Data Strategy

The demo should not rely entirely on creating everything live.

Keep:

```text
One seeded complete trip
```

available.

Recommended:

```text
Rajasthan Explorer
```

This becomes the main fallback.

---

# 44. Fallback Level 1 — Trip Creation Fails

If creating a new trip fails:

```text
Open pre-seeded Rajasthan Explorer
```

Then continue with:

```text
Stops
Activities
Itinerary
Budget
Sharing
```

Do not spend several minutes debugging in front of judges.

---

# 45. Fallback Level 2 — City Search Fails

If city search fails but seeded trip exists:

```text
Open seeded trip
```

and explain the planning flow from there.

If possible, use already-added destinations.

---

# 46. Fallback Level 3 — Activity Search Fails

Use activities already present on the seeded demo trip.

Continue showing:

```text
Itinerary
Budget
Calendar
Sharing
```

The product can still be demonstrated.

---

# 47. Fallback Level 4 — Budget Live Calculation Fails

If budget page is broken but the rest works:

Do not invent a fake number.

Instead show the rest of the product and explain that budget is derived from the underlying activity/accommodation/transport data.

Only do this if necessary.

Ideally, budget must be fixed before judging because it is a core demo feature.

---

# 48. Fallback Level 5 — Sharing Fails

If public sharing unexpectedly fails:

Continue showing the fully functional private planning flow.

Do not spend the remaining presentation debugging routing.

If possible, keep a previously tested public trip open in another tab as backup.

---

# 49. Fallback Level 6 — Copy Trip Fails

Copy Trip is valuable but can be dropped before the core planner.

If it fails:

```text
Stop after public sharing
```

and finish with the main value proposition.

Do not allow one optional/late-stage feature to damage the entire demo.

---

# 50. Fallback Level 7 — Backend Fails

If backend crashes:

First attempt the simplest tested restart procedure.

If restart is not immediate, use:

```text
already loaded pages
screenshots if prepared
architecture explanation
```

as emergency support.

The goal, however, is to avoid reaching this point through pre-demo testing.

---

# 51. Fallback Level 8 — Internet Fails

The core local application should continue working because:

```text
Cities
+
Activities
+
Trips
```

are stored locally in PostgreSQL.

This is one reason the demo does not depend on live travel APIs.

If running locally, internet loss should not block the main flow.

---

# 52. Fallback Level 9 — Image URLs Fail

If destination images fail:

The frontend should show placeholders.

Continue demo normally.

Images are presentation, not core business logic.

---

# 53. Fallback Level 10 — Deployment Fails

If the deployed version has a problem but local development is stable:

Use the tested local version.

The hackathon demo priority is:

```text
Working product
```

not:

```text
Fancy deployment architecture
```

unless deployment is explicitly required.

---

# 54. Browser Preparation

Before judging, prepare:

```text
Tab 1 → User A application

Tab 2 → Public trip / incognito

Tab 3 → User B if needed
```

Do not waste presentation time repeatedly typing URLs and logging out/in if separate sessions are available.

---

# 55. Incognito Strategy

Recommended:

```text
Normal browser
→ User A
```

```text
Incognito
→ User B / Public visitor
```

This makes sharing and ownership demonstration smoother.

---

# 56. Demo Account Check

Before judges arrive:

```text
Login User A
Login User B
```

at least once.

Confirm credentials are known.

Do not rely on remembering an untested password.

---

# 57. Demo Trip Check

Verify:

```text
Rajasthan Explorer
```

contains:

- Jaipur
- Udaipur
- Multiple activities
- Correct dates
- Costs
- Valid itinerary
- Public visibility if used as public fallback

---

# 58. Demo Budget Check

Manually calculate the expected seeded trip budget.

Write it down for the team.

Example:

```text
Activities        X
Accommodation     Y
Transport         Z
-------------------
Total             X+Y+Z
```

If UI total differs, fix it before demo.

---

# 59. Demo Copy Check

Before judging:

```text
User B
copies public trip
```

Verify:

```text
New trip exists
Stops copied
Items copied
Original unchanged
```

Then reset seed or clean up if necessary.

---

# 60. Demo Ownership Check

Optional technical demonstration if a judge asks:

```text
User B cannot edit User A's original trip.
```

Do not make this part of the primary visual flow unless there is enough time.

It is better explained verbally unless specifically requested.

---

# 61. What Not to Demo

Avoid spending presentation time on:

```text
Prisma Studio
Docker Desktop
Database tables
Git branches
Environment variables
Raw API calls
Code files
```

unless the judges ask technical questions.

The first part of the demo should stay product-focused.

---

# 62. Technical Questions

After the product demo, be ready to explain:

```text
Frontend:
React + Vite + TypeScript

Backend:
Node + Express + TypeScript

Database:
PostgreSQL + Prisma

Auth:
JWT + bcrypt

Architecture:
Modular monolith
```

Keep the first explanation short.

---

# 63. Architecture Explanation

If judges ask:

> How does the application work internally?

Use:

```text
React
 ↓
REST API
 ↓
Express feature modules
 ↓
Prisma
 ↓
PostgreSQL
```

Then mention:

```text
Auth
Trips
Stops
Cities
Activities
Itinerary
Budget
Sharing
```

are separated by feature boundaries.

---

# 64. Why Modular Monolith?

If asked:

```text
"We chose a modular monolith because it gives us clean feature boundaries without the deployment and coordination overhead of microservices. Those boundaries also make future extraction possible if scale actually requires it."
```

This matches the project's architecture decisions.

---

# 65. Why PostgreSQL?

If asked:

```text
"Trips, stops, activities, and itinerary items have strong relationships, so PostgreSQL gives us reliable relational integrity and transactions."
```

Mention Copy Trip transaction as a useful example.

---

# 66. Why Prisma?

If asked:

```text
"Prisma gives us type-safe database access, clear relations, and manageable migrations while keeping the backend implementation fast for a hackathon."
```

---

# 67. Why No External Travel APIs?

If asked:

```text
"We intentionally made discovery work from local seeded data so the core planning flow remains reliable and isn't dependent on rate limits or external API availability. The discovery modules can later connect to external providers."
```

---

# 68. Why No AI?

If asked:

```text
"We focused first on solving the planning workflow itself. Once the structured trip data exists, AI recommendations can be added as an enhancement rather than making the core product dependent on an LLM."
```

---

# 69. Scalability Question

If asked:

> Can this scale?

Explain:

```text
"At MVP scale, a modular monolith and PostgreSQL are the simplest reliable architecture. We already separate modules by feature, so if a particular area becomes high-load later, it can be optimized or extracted without redesigning the entire product."
```

Do not claim unnecessary massive-scale infrastructure already exists.

---

# 70. Security Question

If asked:

Mention:

```text
bcrypt password hashing
JWT authentication
shared ownership checks
protected private routes
public/private visibility
input validation
```

Do not claim production security certification.

---

# 71. Ownership Explanation

Simple explanation:

```text
Every owned resource resolves back to the Trip.

User
 ↓
Trip
 ↓
Stop
 ↓
Itinerary Item
```

The backend verifies trip ownership before allowing modifications.

---

# 72. Copy Trip Explanation

If judges ask why copying is safe:

```text
"We recreate the trip, stops, and itinerary under the new user's ownership inside a transaction, so the copy is independent and partial copies are avoided."
```

This is a strong technical point.

---

# 73. Budget Explanation

If asked how budget works:

```text
Total
=
Activity Costs
+
Accommodation
+
Transport
```

The total is derived from source records.

Do not describe it as a manually stored number if the architecture does not store it that way.

---

# 74. Calendar Explanation

If asked:

```text
"The calendar is derived from the itinerary. We group itinerary items by date and order them by time, so there is no duplicate scheduling database."
```

---

# 75. Business Rule Example

If judges ask about validation, demonstrate verbally:

```text
Trip:
10 Oct → 18 Oct

Jaipur:
10 Oct → 13 Oct

An activity on 14 Oct
cannot be placed inside the Jaipur stop.
```

This makes the data-integrity logic easy to understand.

---

# 76. Scope Explanation

If judges ask why some feature is missing:

Do not say:

```text
"We didn't have time."
```

when there is a deliberate architectural/product reason.

Prefer:

```text
"For the MVP, we focused on the complete planning workflow and intentionally excluded transactional booking and live external-data dependencies."
```

This matches `LIMITATIONS.md`.

---

# 77. Do Not Overclaim

Do not claim GlobeTrotter currently provides:

- Live flight prices
- Live hotel prices
- Real-time maps
- Production-scale infrastructure
- AI planning

if these are not implemented.

Present future scope separately.

---

# 78. Future Scope

If judges ask what comes next, possible future enhancements:

```text
Live travel APIs
Maps
Weather
AI recommendations
Group collaboration
Notifications
Currency conversion
Mobile experience
```

Tie future features to the current modular architecture.

---

# 79. Presentation Responsibility

One teammate should ideally control the demo.

The other should:

```text
Watch for issues
Prepare fallback
Answer technical questions
```

Avoid both teammates clicking around simultaneously.

---

# 80. Recommended Speaker Split

Example:

```text
Person 1:
Problem
Product flow
Frontend demo

Person 2:
Architecture
Backend
Database
Security
Scalability
```

Adapt according to who is most comfortable presenting.

---

# 81. Demo Driver Rule

The person controlling the mouse should already know:

```text
Exact clicks
Exact credentials
Exact demo data
Expected output
```

Do not improvise navigation during judging.

---

# 82. Practice Runs

Perform several complete practice runs.

Practice:

```text
Normal flow
```

and:

```text
Fallback flow
```

The goal is to make recovery automatic.

---

# 83. Practice With Fresh State

At least once, practice after:

```text
database reset
+
migration
+
seed
```

This confirms the demo does not depend on accidental stale data.

---

# 84. Practice With Two Accounts

Run the full:

```text
User A
→ Publish
→ User B
→ Copy
```

flow before judging.

This is one of the easiest places for ownership or authentication bugs to appear.

---

# 85. Avoid Last-Minute Data Changes

Shortly before judging:

```text
Do not randomly edit seed data.
```

A small seed change can break:

```text
IDs
Relations
Budget
Demo credentials
```

Freeze working demo data.

---

# 86. Avoid Last-Minute Schema Changes

Do not change:

```text
schema.prisma
```

shortly before judging unless there is a critical reason.

Schema changes create migration and seed risk.

---

# 87. Avoid Last-Minute Dependency Changes

Do not install a new major package right before demo simply for visual polish.

Every dependency change can introduce:

```text
build problems
lockfile conflicts
runtime issues
```

Protect the stable version.

---

# 88. Demo Freeze

Before judging:

```text
Feature development stops.
```

Allowed:

```text
Critical bug fixes
Demo data fixes
Small presentation fixes
```

Not allowed:

```text
New architecture
New major feature
Framework migration
Database redesign
```

---

# 89. Stable Git State

Before the demo:

```bash
git status
```

should ideally show:

```text
working tree clean
```

All important demo code should be committed and pushed.

---

# 90. Demo Tag

Optional:

```text
demo-v1
```

can mark the stable commit.

If later experiments break the application, the team has a known recovery point.

---

# 91. Demo Recovery Checklist

If something breaks shortly before judging:

```text
1. Stop adding features
2. Check latest stable commit
3. Start database
4. Apply migrations
5. Run seed
6. Start backend
7. Start frontend
8. Test login
9. Test demo trip
10. Test sharing
```

Fix only the actual blocker.

---

# 92. Demo Readiness Gate

Do not call the project demo-ready until:

- [ ] App starts reliably
- [ ] Login works
- [ ] Trip opens
- [ ] Stops load
- [ ] Activities load
- [ ] Itinerary works
- [ ] Budget works
- [ ] Calendar works
- [ ] Publish works
- [ ] Public page works
- [ ] Backup trip exists

Preferred:

- [ ] Copy Trip works

---

# 93. Product Demo Checklist

During the demo, ensure the judges see:

- [ ] Authentication
- [ ] Dashboard
- [ ] Trip creation
- [ ] Multiple destinations
- [ ] Activities
- [ ] Itinerary
- [ ] Budget
- [ ] Calendar
- [ ] Public sharing
- [ ] Copy Trip if time allows

---

# 94. Technical Q&A Checklist

Be ready for:

```text
Why this problem?
Why this architecture?
Why PostgreSQL?
Why Prisma?
How is auth handled?
How is ownership handled?
How does budget work?
How does Copy Trip work?
Why no external API?
Can it scale?
What is future scope?
```

---

# 95. Strongest Technical Points

If technical judging is important, emphasize:

```text
Feature-based modular architecture
Shared ownership helper
Relational database design
Integer money storage
Business-rule validation
Derived budget
Transactional Copy Trip
Public/private access separation
Seeded offline-safe discovery
```

These show deliberate engineering rather than only UI work.

---

# 96. Strongest Product Points

Emphasize:

```text
One planning flow
Multi-city organization
Activity scheduling
Automatic budget
Calendar view
Easy sharing
Reusable public trips
```

---

# 97. Avoid Feature Dumping

Do not present the application like:

```text
"We have login.
We have dashboard.
We have search.
We have budget..."
```

Instead tell one user story:

```text
"I want to plan Rajasthan.
I add Jaipur and Udaipur.
I decide what to do.
The app organizes my days.
It calculates my budget.
Then I share the trip."
```

This is easier for judges to remember.

---

# 98. Demo Story Model

```text
USER PROBLEM
    ↓
"I need to organize a multi-city trip."
    ↓
CREATE TRIP
    ↓
DESTINATIONS
    ↓
ACTIVITIES
    ↓
ITINERARY
    ↓
BUDGET
    ↓
SHARE
    ↓
SOMEONE ELSE REUSES IT
```

This is the complete GlobeTrotter story.

---

# 99. Final Demo Flow

```text
┌───────────────┐
│     LOGIN     │
└───────┬───────┘
        ↓
┌───────────────┐
│   DASHBOARD   │
└───────┬───────┘
        ↓
┌───────────────┐
│  CREATE TRIP  │
└───────┬───────┘
        ↓
┌───────────────┐
│ ADD JAIPUR    │
└───────┬───────┘
        ↓
┌───────────────┐
│ ADD UDAIPUR   │
└───────┬───────┘
        ↓
┌───────────────┐
│ ADD ACTIVITIES│
└───────┬───────┘
        ↓
┌───────────────┐
│   ITINERARY   │
└───────┬───────┘
        ↓
┌───────────────┐
│    BUDGET     │
└───────┬───────┘
        ↓
┌───────────────┐
│   CALENDAR    │
└───────┬───────┘
        ↓
┌───────────────┐
│    PUBLISH    │
└───────┬───────┘
        ↓
┌───────────────┐
│  PUBLIC TRIP  │
└───────┬───────┘
        ↓
┌───────────────┐
│   COPY TRIP   │
└───────────────┘
```

---

# 100. Final Rule

During judging:

```text
Do not demonstrate the amount of code.
Demonstrate the value of the system.
```

The best demo is not the one that shows the most screens.

It is the one where the judges clearly understand:

```text
The problem
+
The user journey
+
Why GlobeTrotter solves it
+
That the implementation actually works
```

If a non-critical feature fails, use the fallback and continue the story.

The demo must remain focused on a **working GlobeTrotter experience**, not live debugging.