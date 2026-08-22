# Backlog — unclaimed work

Claim a task by moving it to `in-progress.md` with `[OWNER: <name/ai-id>]`.

## Ideas / tasks
- [ ] Add real CI steps matching the chosen stack
- [ ] (add more as brainstormed)

## Frontend tasks — allotted by Pushkar (design-system-first)

Source of truth: `docs/stitch_remix_of_globe_trotter_travel_planner/serene_journeys/DESIGN.md`
(tokens) + each screen folder's `code.html` / `screen.png` (exact layout).

**Dependency rule:** nothing below DS-1 starts until DS-1 is merged. Screen
tasks depend on DS-2 (shared components). Each task = one branch + one commit
+ one PR. Allotted owner is fixed.

Done so far (old C-list): C-0 onboarding and C-1 router table are merged.

### DS — Design system foundation (shared)
- [ ] DS-1 Apply design tokens → `apps/web/src/styles/tokens.css` (colors, typography, rounded, spacing from DESIGN.md) + load Montserrat/Inter in `index.html` — **allotted: preetgohilofficial**
- [ ] DS-2 Build shared UI primitives from tokens: `Button`, `Input`, `Card`, `Modal`, `Badge` (from `globetrotter_complete_travel_dashboard/code.html`) — **allotted: preetgohilofficial**

### Person C — Preet (auth, dashboard, trips) — all allotted: preetgohilofficial
- [ ] C-2 LoginPage + SignupPage (from `login_sign_up_neo_brutalist_style`, `registration_neo_brutalist_style`)
- [ ] C-3 DashboardPage (from `admin_dashboard_refined_style`)
- [ ] C-4 MyTripsPage (from `my_trips_neo_brutalist_style`)
- [ ] C-5 NewTripPage (from `plan_new_trip_neo_brutalist_style`)
- [ ] C-6 TripPage detail (from `globetrotter_complete_travel_dashboard`)

### Person D — Bhagya (itinerary, budget, calendar, public) — all allotted: khatikbhagya-cmd
- [ ] D-1 ItineraryPage (from `itinerary_view_neo_brutalist_style`)
- [ ] D-2 ItineraryBuilder (from `itinerary_builder_neo_brutalist_style`)
- [ ] D-3 CalendarPage (from `calendar_view_neo_brutalist_style`)
- [ ] D-4 PublicTripPage (from `community_tab_neo_brutalist_style`)
- [ ] D-5 ActivitySearchPage (from `activity_search_neo_brutalist_style`)
- [ ] D-6 ProfilePage (from `user_profile_neo_brutalist_style`)
