# GlobeTrotter — Limitations & Out-of-Scope

## 1. Purpose

This document defines what GlobeTrotter will **not** build for the hackathon MVP.

Its purpose is to prevent scope creep.

During a hackathon, adding too many ambitious features usually creates:

```text
More bugs
+
More dependencies
+
More integration risk
+
Less demo stability
```

GlobeTrotter should remain focused on its core value:

```text
Plan a multi-city trip
+
Add activities
+
Organize itinerary
+
Estimate budget
+
Share the trip
```

Anything outside this core flow must be treated carefully.

---

# 2. Core Scope Boundary

The MVP includes:

```text
Authentication
Trips
Stops
Cities
Activities
Itinerary
Budget
Calendar
Sharing
Copy Trip
```

The MVP does **not** attempt to become:

```text
Booking.com
Skyscanner
Google Maps
TripAdvisor
Expedia
A payment platform
A full travel marketplace
```

GlobeTrotter is primarily a **trip planning and itinerary management application**.

---

# 3. No Flight Booking

GlobeTrotter will not provide real flight booking.

Out of scope:

- Searching live flight inventory
- Booking flights
- Selecting airline seats
- Airline authentication
- PNR generation
- Flight cancellation
- Flight refunds
- Boarding passes
- Airline payment integration

The application may conceptually allow users to record estimated transport cost.

That is different from actual booking.

---

# 4. No Live Flight Prices

The MVP does not fetch real-time airfare.

No dependency on services such as:

```text
Flight search APIs
Airline APIs
Travel aggregators
```

Transport costs are user-entered or seeded estimates.

Example:

```text
Jaipur → Udaipur Transport
Estimated Cost: ₹2,000
```

This is sufficient for budget planning.

---

# 5. No Hotel Booking

GlobeTrotter does not book accommodation.

Out of scope:

- Hotel availability
- Room selection
- Hotel reservation
- Check-in systems
- Cancellation
- Refunds
- Booking confirmations
- Hotel provider integration

Users may store or enter estimated accommodation cost for a stop.

---

# 6. No Live Hotel Availability

The application does not attempt to answer:

```text
Which hotels have rooms available tonight?
```

or:

```text
What is the current price of this hotel?
```

Accommodation values are estimates.

This avoids reliance on external booking platforms.

---

# 7. No Payment Gateway

The MVP includes no payment processing.

Out of scope:

- Razorpay
- Stripe
- PayPal
- UPI payment flow
- Credit/debit card processing
- Wallets
- Payment confirmation
- Refund handling

There is no reason to introduce payment infrastructure because GlobeTrotter does not sell bookings.

---

# 8. No Financial Transactions

Budget values in GlobeTrotter are informational.

Example:

```text
Estimated Trip Cost
₹42,000
```

This does not mean:

```text
Pay ₹42,000
```

The budget module performs calculation only.

---

# 9. No Real-Time Pricing

The MVP does not promise live pricing for:

- Activities
- Transport
- Accommodation
- Tickets
- Food
- Flights
- Hotels

Any cost displayed should be understood as:

```text
Estimated Cost
```

rather than:

```text
Current Guaranteed Price
```

---

# 10. No Complex Currency Conversion

The MVP does not require a live foreign-exchange system.

Out of scope:

- Real-time exchange rates
- FX APIs
- Historical currency charts
- Automatic currency hedging
- Multi-currency financial settlement

If a single currency is used for the MVP, all trip values remain in that currency.

If currency support exists later, it should remain simple.

---

# 11. No Microservices

GlobeTrotter uses a:

```text
Modular Monolith
```

not microservices.

Out of scope:

```text
Auth Service
Trip Service
Budget Service
Discovery Service
Separate databases
Service mesh
Message broker
Distributed tracing
```

The architecture remains:

```text
React
  ↓
Express
  ↓
Feature Modules
  ↓
Prisma
  ↓
PostgreSQL
```

This is intentional.

---

# 12. No Distributed Infrastructure

The hackathon MVP does not require:

- Kubernetes
- Kafka
- RabbitMQ
- Service discovery
- API gateway clusters
- Distributed caches
- Event sourcing
- CQRS
- Multiple databases

These technologies would increase complexity without improving the core demo.

---

# 13. No Production-Scale Infrastructure

The MVP is not designed for millions of users during the hackathon.

Out of scope:

- Multi-region deployment
- Autoscaling clusters
- CDN architecture design
- Database replication
- Read replicas
- Geo-distributed databases
- High-availability failover
- Enterprise observability

The architecture should still be clean enough to evolve later.

---

# 14. No AI Requirement

Artificial intelligence is **not required** for the GlobeTrotter MVP.

Out of scope for the core implementation:

```text
AI itinerary generator
LLM chatbot
AI destination recommendation
AI budget optimizer
AI travel agent
AI summarization
```

The application should provide meaningful value without AI.

This protects the MVP from unnecessary API dependencies.

---

# 15. AI Can Be Future Scope

An AI feature may be considered later only if:

```text
Core MVP is complete
+
Demo is stable
+
Team has remaining time
```

It should never replace required core functionality.

For example:

```text
Optional:
"Suggest activities for my Jaipur trip"
```

may be added later.

But city search and activity management must work without it.

---

# 16. No Real-Time Collaboration

The MVP does not allow multiple users to simultaneously edit the same trip.

Out of scope:

- Shared live cursors
- Google Docs-style editing
- WebSocket synchronization
- Conflict resolution
- Presence indicators
- Collaborative comments
- Collaborative editing permissions

A trip has one owner.

---

# 17. Sharing Is Read-Or-Copy

Sharing is intentionally simpler.

Supported model:

```text
Owner creates trip
        ↓
Publishes trip
        ↓
Others view it
        ↓
Optional: copy it
```

Not:

```text
Owner + Friend
edit same trip simultaneously
```

This distinction must remain clear.

---

# 18. No Complex Permission System

The MVP does not require roles such as:

```text
Trip Owner
Trip Editor
Trip Viewer
Trip Moderator
Trip Administrator
```

The main permission model is:

```text
Owner
or
Public Viewer
```

This keeps authorization simple.

---

# 19. No Social Network

GlobeTrotter is not a travel social network.

Out of scope:

- Following users
- Followers
- Likes
- Comments
- Direct messaging
- Public profiles with feeds
- User reputation
- Creator rankings

Public trips exist mainly for sharing and copying.

---

# 20. No Full Recommendation Engine

The MVP does not require a sophisticated recommendation engine.

Out of scope:

```text
Machine-learning ranking
Behavioral personalization
Collaborative filtering
User profiling
Recommendation embeddings
```

Basic search and seeded popularity are sufficient.

---

# 21. No Advanced Search Engine

The MVP does not require:

- Elasticsearch
- Algolia
- Vector search
- Semantic search
- Fuzzy ranking infrastructure

City and activity search can be implemented using PostgreSQL queries.

Example:

```text
Search "Jai"
→ Jaipur
```

This is sufficient.

---

# 22. No Mandatory External Travel API

The MVP should not depend on third-party travel APIs to function.

Out of scope as required dependencies:

- Google Places
- TripAdvisor API
- Amadeus
- Skyscanner APIs
- Expedia APIs
- Booking provider APIs

Core discovery should work from local seeded PostgreSQL data.

---

# 23. Why Third-Party Dependency Is Limited

Third-party APIs introduce:

```text
API keys
Rate limits
Network dependency
Unexpected schema changes
Pricing
Quota failures
Demo risk
```

Therefore the hackathon demo should remain functional without them.

---

# 24. No Full Mapping Platform

GlobeTrotter does not attempt to reproduce Google Maps.

Out of scope:

- Turn-by-turn navigation
- Traffic
- Transit routing
- Walking routes
- Driving directions
- Offline navigation
- Map tile infrastructure

A basic map visualization may be considered later, but it is not a core dependency.

---

# 25. No Route Optimization Engine

The application does not automatically calculate the mathematically optimal travel order.

Out of scope:

```text
Travelling Salesman optimization
Distance matrix optimization
Traffic-aware optimization
Automatic route planning
```

Users decide the order of stops.

They can reorder stops manually.

---

# 26. No Automatic Travel-Time Calculation

The MVP does not need to calculate:

```text
Jaipur → Udaipur = exact X hours Y minutes
```

Transport values may be manually entered or represented as estimates.

No routing API is required.

---

# 27. No Ticket Inventory

Activities in GlobeTrotter represent things a user may want to do.

The application does not manage:

- Ticket inventory
- Seat availability
- Time-slot inventory
- Vendor capacity
- Ticket purchasing

Example:

```text
Amber Fort
```

means:

```text
Add Amber Fort to itinerary
```

not:

```text
Buy Amber Fort ticket
```

---

# 28. No Vendor Accounts

The MVP does not include vendor-side portals.

Out of scope:

- Hotels managing listings
- Tour operators
- Activity providers
- Vendor dashboards
- Pricing dashboards
- Merchant settlement

All activity/city master data is controlled by project data.

---

# 29. No Admin Portal Requirement

A full admin application is not required for the MVP.

Out of scope:

```text
Admin dashboard
User moderation
Trip moderation
Analytics administration
Activity CMS
City CMS
```

Seed data handles core discovery data.

If an extremely small internal admin capability is later needed, it should not delay the MVP.

---

# 30. No Complex Analytics

The MVP does not require enterprise analytics.

Out of scope:

- Cohort analysis
- Funnel dashboards
- Revenue analytics
- User retention analytics
- Behavioral event pipelines
- Data warehouse
- BI integration

Simple trip budget calculations are not considered analytics infrastructure.

---

# 31. No Notifications System

The MVP does not require:

- Push notifications
- SMS alerts
- Email reminders
- Activity reminders
- Flight alerts
- Price alerts
- Notification preferences

These may be future enhancements.

---

# 32. No Background Job Infrastructure

Because notifications and scheduled integrations are out of scope, the MVP does not require:

```text
Job queue
Workers
Cron infrastructure
BullMQ
Redis queues
```

Keep the backend request-driven.

---

# 33. No Offline Mode

The web application requires normal connectivity to the backend.

Out of scope:

- Offline-first synchronization
- Local database mirroring
- Conflict merging
- PWA offline itinerary
- Background sync

---

# 34. No Native Mobile App

GlobeTrotter is built as a web application.

Out of scope:

```text
Android app
iOS app
React Native
Flutter
Native push notifications
App Store deployment
Play Store deployment
```

Responsive web design is sufficient.

---

# 35. No Complex Account Management

The MVP authentication system remains simple.

Out of scope unless explicitly added later:

- Google OAuth
- Apple login
- Facebook login
- Multi-factor authentication
- Passwordless authentication
- Account linking
- Enterprise SSO

Core authentication:

```text
Email
+
Password
+
JWT
```

---

# 36. Password Reset Is Not Core

A complete password reset workflow may be excluded from the MVP.

It would require:

```text
Email provider
Reset tokens
Expiry handling
Email templates
```

If time is limited, prioritize signup and login.

---

# 37. No Change-Password Requirement

A full account-security settings suite is not required.

If not explicitly included in the PRD/API contract, do not add:

- Change password
- Session list
- Device management
- Login history

---

# 38. No File Upload System

The MVP does not require users to upload:

- Travel documents
- Passport scans
- Tickets
- Images
- PDFs
- Receipts

This avoids:

```text
Object storage
File validation
Upload security
Large-file handling
```

---

# 39. No Receipt Scanning

Budget management does not include:

- Receipt OCR
- Expense image uploads
- Automated expense extraction
- Invoice scanning

Budget values remain manually entered/derived.

---

# 40. No Expense Splitting

GlobeTrotter is not an expense-splitting application.

Out of scope:

- Group expenses
- Who owes whom
- Settlement calculation
- Splitwise-style balances
- Payment settlements

Budget answers:

```text
How much might this trip cost?
```

not:

```text
Who owes ₹800 to whom?
```

---

# 41. No Group Trip Ownership

The MVP uses one trip owner.

Out of scope:

```text
Multiple owners
Invite members
Member permissions
Group voting
Collaborative planning
```

This keeps ownership checks straightforward.

---

# 42. No Complex Time-Zone Engine

The MVP does not need advanced timezone conversion between destinations.

Out of scope:

- Automatic timezone detection
- Cross-timezone event conversion
- DST calculations
- Local/UTC calendar synchronization

Trip dates/times can be treated according to the application's simplified domain rules.

---

# 43. No Calendar Provider Integration

The Calendar feature is an in-app itinerary view.

It does not require integration with:

```text
Google Calendar
Apple Calendar
Outlook Calendar
```

No external calendar synchronization is part of the MVP.

---

# 44. No Complex Recurring Activities

Itinerary items represent individual planned events.

Out of scope:

```text
Repeat every day
Repeat every Monday
Recurring calendar rules
RRULE processing
```

If an activity happens multiple times, separate items can be created.

---

# 45. No Rich Travel Documents

The MVP does not generate:

- Full travel PDFs
- Visa documents
- Travel insurance documents
- Booking vouchers
- Boarding-pass bundles

Sharing happens through the public itinerary page.

---

# 46. No Visa Management

Out of scope:

- Visa requirements
- Visa applications
- Passport eligibility
- Embassy integration
- Immigration rules

These are complex and country-specific.

---

# 47. No Travel Insurance

GlobeTrotter does not provide:

- Insurance quotations
- Insurance comparison
- Insurance purchase
- Claim handling

---

# 48. No Safety/Legal Guarantee

Seeded destination/activity data is for application demonstration.

The application does not guarantee:

- Safety
- Availability
- Legal entry
- Opening hours
- Weather conditions
- Travel advisories

These would require specialized current data sources.

---

# 49. No Weather Integration Requirement

Live weather is not required for the MVP.

Out of scope:

```text
Forecasts
Rain alerts
Temperature suggestions
Weather-based itinerary optimization
```

Adding weather would introduce another external dependency.

---

# 50. No Real-Time Event Discovery

The MVP does not fetch:

- Concerts
- Sports matches
- Festivals
- Temporary events
- Live entertainment schedules

Activities are static/reference records.

---

# 51. No Live Opening Hours

The MVP does not guarantee that an activity is currently open.

Out of scope:

```text
Live business hours
Holiday schedules
Temporary closures
```

Users are planning an itinerary, not receiving real-time operational guarantees.

---

# 52. No Production Security Claim

The application should follow good security practices such as:

```text
Password hashing
JWT validation
Ownership checks
Input validation
```

However, the hackathon MVP should not be presented as an audited production security platform.

Out of scope:

- Penetration testing certification
- SOC 2
- ISO 27001
- Enterprise security compliance
- Full security audit

---

# 53. No Compliance Platform

The MVP does not implement specialized compliance systems such as:

- GDPR management tooling
- PCI DSS systems
- Financial compliance
- Healthcare compliance

The product does not process payments or sensitive travel documents.

---

# 54. No Massive Data Import

Do not spend hackathon time importing thousands of cities or activities.

Seed target remains intentionally limited.

Example:

```text
10–15 useful cities
40–70 useful activities
```

is enough.

The product's quality does not depend on seed quantity.

---

# 55. No Premature Performance Optimization

Do not optimize for hypothetical millions of records before the MVP exists.

Avoid:

```text
Complex caching layers
Redis everywhere
Custom query engines
Premature denormalization
```

Use sensible indexes defined in `DATABASE_SCHEMA.md`.

Optimize only if a real performance issue appears.

---

# 56. No Premature Abstraction

Do not create complex generalized frameworks for simple hackathon requirements.

Example:

Instead of:

```text
Universal Resource Ownership Engine
```

use:

```text
assertTripOwnership()
```

because GlobeTrotter has a clear ownership model.

Keep abstractions proportional to actual needs.

---

# 57. No Duplicate Architecture

Do not introduce a second way to perform the same function.

Examples to avoid:

```text
JWT authentication
+
separate session authentication
```

or:

```text
REST API
+
GraphQL API
```

or:

```text
Prisma
+
raw ORM layer
```

One clear architecture is enough.

---

# 58. No GraphQL

The API architecture is REST.

Out of scope:

```text
GraphQL
Apollo
GraphQL subscriptions
```

Frontend/backend communication follows `API_CONTRACT.md`.

---

# 59. No Multiple Databases

PostgreSQL is the project database.

Do not add:

```text
MongoDB
Firebase database
MySQL
Redis as primary data storage
```

unless an explicitly approved architectural change occurs.

---

# 60. No Authentication Platform Migration

The locked authentication system uses:

```text
JWT
+
bcrypt
```

Do not randomly move authentication to another platform during implementation.

Examples:

```text
Firebase Auth
Auth0
Supabase Auth
Clerk
```

would change the architecture and API assumptions.

---

# 61. No Database Platform Migration

The locked database is:

```text
PostgreSQL
```

with:

```text
Prisma
```

Do not replace it during the hackathon without a major reason.

---

# 62. No Framework Migration

Frontend:

```text
React + Vite + TypeScript
```

Backend:

```text
Node.js + Express + TypeScript
```

Do not switch mid-project to:

```text
Next.js
NestJS
Django
Flask
Spring
```

unless the entire architecture is deliberately reconsidered.

The hackathon is not the time for unnecessary rewrites.

---

# 63. No Database-Driven CMS

Cities and activities do not need a full content-management system.

For the MVP:

```text
seed.ts
```

is enough to populate reference data.

A CMS could become future scope.

---

# 64. No Advanced Image Pipeline

The application does not require:

- Image upload processing
- Image resizing service
- CDN transformation
- AI image generation
- Image moderation

Use stable/local/static images or placeholders.

---

# 65. No Complex Caching

Redis is not required.

For MVP queries:

```text
Express
 ↓
Prisma
 ↓
PostgreSQL
```

is sufficient.

If performance is acceptable, do not add cache invalidation complexity.

---

# 66. No WebSockets

The application does not require real-time server-to-client communication.

Out of scope:

```text
Socket.IO
WebSocket server
Live trip updates
Presence
```

Normal REST requests are enough.

---

# 67. No Complex Audit Log

The MVP does not need to record every modification forever.

Out of scope:

```text
Trip edit history
Activity edit history
User action audit trail
Restore old versions
```

Normal timestamps such as `createdAt` and `updatedAt` are sufficient if included in the schema.

---

# 68. No Undo/Version Control for Trips

Users do not need:

```text
Undo last 20 changes
Restore yesterday's trip
Compare versions
```

Deletion confirmations should reduce accidental loss.

---

# 69. No Soft Delete Requirement

Unless explicitly specified in `DATABASE_SCHEMA.md`, deleted records may use normal deletion.

Do not add:

```text
deletedAt
archivedAt
isDeleted
```

across every entity without need.

Cascading rules are already defined by the database architecture.

---

# 70. No Advanced Data Export

Out of scope:

- CSV export
- Excel export
- PDF export
- JSON backup
- Import/export pipeline

Public sharing is the main output mechanism.

---

# 71. No Complex Localization

The MVP does not require:

- Multiple interface languages
- Locale-specific content
- Translation infrastructure
- RTL layouts

A single interface language is sufficient.

---

# 72. No Accessibility Certification

The frontend should still follow sensible accessibility practices.

However, the hackathon MVP is not targeting formal certification such as:

```text
WCAG AAA
```

Do not interpret this as permission to ignore accessibility entirely.

Basic semantic and usable UI remains desirable.

---

# 73. No Advanced Responsive Edge Cases

The app should be usable on standard desktop and reasonable smaller screens.

It does not need perfect layouts for every device imaginable.

Do not spend critical backend/integration time chasing tiny visual differences.

---

# 74. No Browser-Specific Optimization

Support modern browsers.

No requirement for:

```text
Internet Explorer
Legacy browser polyfills
Very old mobile browsers
```

---

# 75. No Native Desktop Application

GlobeTrotter remains a web application.

Out of scope:

```text
Electron
Windows app
macOS app
Linux desktop package
```

---

# 76. No Deployment Complexity Requirement

The project may be deployed for demonstration, but deployment architecture should remain simple.

Out of scope:

```text
Multi-cloud
Blue-green deployment
Canary deployment
Infrastructure as Code platform
Complex CI/CD
```

Simple deployment is enough.

---

# 77. No Advanced CI/CD Requirement

A basic build/test workflow is useful.

However, the MVP does not need:

- Multiple staging environments
- Automated production rollbacks
- Deployment approvals
- Release trains

Git workflow remains intentionally simple.

---

# 78. No Complex Observability

Basic logs are enough for the hackathon.

Out of scope:

```text
Distributed tracing
Grafana
Prometheus
Datadog
ELK stack
Full APM
```

Use clear server errors and console logs during development.

---

# 79. No Over-Engineered Testing Infrastructure

Critical flows should absolutely be tested.

But do not block the MVP trying to reach:

```text
100% code coverage
```

Testing priority is:

```text
Authentication
Ownership
Dates
Core CRUD
Budget
Sharing
Demo flow
```

as defined in `TESTING_PLAN.md`.

---

# 80. No Feature Without a User Need

A feature should not be added simply because:

```text
"It would look technically impressive."
```

Instead ask:

```text
Does this improve the GlobeTrotter user journey?
```

and:

```text
Can we finish it without risking the MVP?
```

---

# 81. Scope Change Process

If the team wants to add something currently out of scope:

```text
1. Check MVP status
2. Identify implementation cost
3. Identify dependencies
4. Identify demo value
5. Both developers agree
6. Update documentation if accepted
7. Implement
```

Do not silently expand scope.

---

# 82. Allowed Future Scope

Potential future features include:

```text
AI itinerary suggestions
Maps
Weather
Live pricing
Hotel integrations
Flight integrations
Group collaboration
Notifications
Currency conversion
Advanced recommendations
Mobile application
```

These are valid product ideas.

They are simply not required for the hackathon MVP.

---

# 83. Judge Question Handling

If judges ask:

> Why don't you have live flight/hotel booking?

The product rationale is:

```text
GlobeTrotter focuses on planning and itinerary organization.

Booking platforms already specialize in transactional booking.

The architecture is designed so integrations can be added later without making them a dependency of the core planning experience.
```

---

# 84. Scalability Question Handling

If judges ask:

> Can this scale later?

The correct position is:

```text
The MVP uses a modular monolith because it is simpler and faster to build reliably.

Feature boundaries are separated clearly, so high-load modules could later be extracted if real scaling requirements appear.
```

Do not claim that microservices are automatically necessary.

---

# 85. External API Question Handling

If judges ask:

> Why use seeded activities instead of a live API?

Answer conceptually:

```text
The MVP intentionally removes external API availability and rate-limit risk.

The City and Activity modules expose clear internal contracts, so external providers can later replace or supplement the seeded discovery source.
```

This is an architectural choice, not a missing feature.

---

# 86. AI Question Handling

If judges ask:

> Why didn't you add AI?

The product should be able to answer:

```text
GlobeTrotter's core problem can be solved reliably without AI.

We prioritized a complete planning, budget, itinerary, and sharing workflow first.

AI recommendations can later sit on top of this structured trip data.
```

---

# 87. Hard MVP Boundary

Before optional scope, the following must work:

- [ ] Signup
- [ ] Login
- [ ] Trip creation
- [ ] Trip editing
- [ ] Stops
- [ ] Stop ordering
- [ ] City search
- [ ] Activity search
- [ ] Itinerary management
- [ ] Budget
- [ ] Calendar
- [ ] Public sharing
- [ ] Ownership protection

Preferred:

- [ ] Copy Trip

---

# 88. Scope Priority

When forced to choose between:

```text
Existing feature reliability
```

and:

```text
New feature
```

choose:

```text
Existing feature reliability
```

for the hackathon.

---

# 89. Emergency Scope Reduction

If development falls behind, postpone in this order:

```text
1. Extra animations
2. Advanced filtering
3. Additional seed data
4. Copy Trip
5. Advanced calendar presentation
6. Optional sharing polish
```

Protect:

```text
Auth
Trips
Stops
Activities
Itinerary
Budget
```

---

# 90. Never Cut Ownership

Authorization is not optional polish.

Do not solve time pressure by removing:

```text
Authentication checks
Ownership checks
Input validation
```

A smaller secure-enough demo is better than exposing every user's data.

---

# 91. Never Cut Data Integrity

Do not remove important business rules simply to finish faster.

Protect:

```text
Trip date rules
Stop date rules
Itinerary date rules
Ownership chains
Copy transaction integrity
```

These define the application's correctness.

---

# 92. Final Scope Model

```text
                      GLOBETROTTER MVP

             ┌────────────────────────┐
             │     TRIP PLANNING      │
             │                        │
             │ Trips                  │
             │ Cities / Stops         │
             │ Activities             │
             │ Itinerary              │
             │ Budget                 │
             │ Calendar               │
             │ Sharing                │
             └───────────┬────────────┘
                         │
                 CORE PRODUCT BOUNDARY
                         │
        ─────────────────┼─────────────────
                         │
                         ▼
                  FUTURE / OUT OF SCOPE

              Flights / Hotels
              Payments
              Live Pricing
              AI Planner
              Maps / Routing
              Collaboration
              Notifications
              Mobile Apps
              Advanced Analytics
```

---

# 93. Final Rule

Whenever a new idea appears during the hackathon, ask:

```text
Is it required by PRD.md?
```

If yes:

```text
Build according to roadmap.
```

If no, ask:

```text
Is the complete MVP already stable?
```

If no:

```text
Do not build it yet.
```

The purpose of this document is not to limit future creativity.

It exists to make sure GlobeTrotter becomes a **complete, reliable hackathon product** before it becomes an unnecessarily large one.