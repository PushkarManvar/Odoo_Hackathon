import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import { tripsApi } from "../services/client.js";
import type { TripSummary } from "../services/types.js";
import "./DashboardPage.css";

const NAV_CARDS = [
  {
    label: "My Trips",
    icon: "🗺",
    className: "gt-dash-navcard--yellow",
    to: "/trips",
  },
  {
    label: "Plan New Trip",
    icon: "✈️",
    className: "",
    to: "/trips/new",
  },
  {
    label: "Discover",
    icon: "🎟",
    className: "gt-dash-navcard--pink",
    to: "/discover",
  },
  {
    label: "Profile",
    icon: "👤",
    className: "",
    to: "/profile",
  },
];

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DashboardPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [tripsError, setTripsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    tripsApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setTrips(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setTripsError(err instanceof Error ? err.message : "Failed to load trips");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentTrips = trips.slice(0, 4);

  return (
    <div className="gt-dash">
      <header className="gt-dash-header">
        <div className="gt-dash-header-left">
          <h1 className="gt-dash-brand">GlobeTrotter</h1>
          <nav className="gt-dash-nav">
            <Link to="/discover">Explore</Link>
            <Link to="/trips">Trips</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
        <div className="gt-dash-header-actions">
          <button className="gt-dash-icon-btn" type="button" aria-label="Search">
            &#128269;
          </button>
          <Link className="gt-dash-icon-btn gt-dash-icon-btn--yellow" to="/profile" aria-label="Profile">
            &#128100;
          </Link>
        </div>
      </header>

      <main className="gt-dash-main">
        <div className="gt-dash-title-block">
          <h2 className="gt-dash-title">My Dashboard</h2>
          <p className="gt-dash-subtitle">
            {user ? `Welcome back, ${user.name}` : "Your travel planning hub"}
          </p>
        </div>

        <div className="gt-dash-grid">
          <section className="gt-dash-main-col">
            <nav className="gt-dash-navcards">
              {NAV_CARDS.map((card) => (
                <Link
                  key={card.label}
                  to={card.to}
                  className={`gt-dash-navcard ${card.className}`.trim()}
                >
                  <span className="gt-dash-navcard-icon">{card.icon}</span>
                  <span>{card.label}</span>
                </Link>
              ))}
            </nav>

            <div className="gt-dash-analytics">
              <h3 className="gt-dash-analytics-title">My Trips</h3>
              {tripsError ? (
                <p className="gt-dash-state">{tripsError}</p>
              ) : trips.length === 0 ? (
                <p className="gt-dash-state">
                  No trips yet.{" "}
                  <Link to="/trips/new">Plan your first adventure.</Link>
                </p>
              ) : (
                <ul className="gt-dash-trip-list">
                  {recentTrips.map((trip) => (
                    <li key={trip.id}>
                      <Link className="gt-dash-trip-item" to={`/trips/${trip.id}`}>
                        <span className="gt-dash-trip-name">{trip.name}</span>
                        <span className="gt-dash-trip-meta">
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          {trip.stopCount > 0 ? ` • ${trip.stopCount} stops` : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {trips.length > 0 ? (
                <Link className="gt-dash-trip-all" to="/trips">
                  View all trips
                </Link>
              ) : null}
            </div>

            <div className="gt-dash-analytics">
              <h3 className="gt-dash-analytics-title">Overview</h3>
              <div className="gt-dash-stats">
                <div>
                  <h5 className="gt-dash-stat-label">Total Trips</h5>
                  <p className="gt-dash-stat-value">{trips.length}</p>
                </div>
                <div>
                  <h5 className="gt-dash-stat-label">Upcoming</h5>
                  <p className="gt-dash-stat-value">
                    {trips.filter(
                      (trip) => new Date(`${trip.startDate}T00:00:00`) >= new Date()
                    ).length}
                  </p>
                </div>
                <div>
                  <h5 className="gt-dash-stat-label">Completed</h5>
                  <p className="gt-dash-stat-value">
                    {trips.filter(
                      (trip) => new Date(`${trip.endDate}T00:00:00`) < new Date()
                    ).length}
                  </p>
                </div>
                <div>
                  <h5 className="gt-dash-stat-label">Public Trips</h5>
                  <p className="gt-dash-stat-value">
                    {trips.filter((trip) => trip.visibility === "PUBLIC").length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="gt-dash-aside">
            <div className="gt-dash-guide">
              <h3 className="gt-dash-guide-title">
                <span>ℹ</span> Getting Started
              </h3>
              <div className="gt-dash-guide-items">
                <div className="gt-dash-guide-item">
                  <h4 className="gt-dash-guide-item-title">
                    <span className="gt-dash-guide-dot" />
                    Plan a trip
                  </h4>
                  <p>
                    Create a trip, add destinations, and start building your
                    itinerary section by section.
                  </p>
                </div>
                <div className="gt-dash-guide-item">
                  <h4 className="gt-dash-guide-item-title">
                    <span className="gt-dash-guide-dot gt-dash-guide-dot--yellow" />
                    Discover
                  </h4>
                  <p>
                    Browse popular cities and activities to inspire your next
                    adventure.
                  </p>
                </div>
                <div className="gt-dash-guide-item">
                  <h4 className="gt-dash-guide-item-title">
                    <span className="gt-dash-guide-dot gt-dash-guide-dot--white" />
                    Share
                  </h4>
                  <p>
                    Publish a trip to get a public link and let others copy your
                    itinerary.
                  </p>
                </div>
              </div>
              <Link className="gt-dash-report-btn" to="/trips/new">
                Plan New Trip
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}