import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext.js";
import { tripsApi } from "../../services/client.js";
import type { TripSummary } from "../../services/types.js";
import "./ProfilePage.css";

interface TripCard {
  id: string;
  title: string;
  description: string;
  badge: string;
  action: string;
  color: string;
  to: string;
  grayscale?: boolean;
}

function TripCardView({
  trip,
  headingColor,
}: {
  trip: TripCard;
  headingColor: string;
}) {
  return (
    <Card className="prof-trip-card" variant="tonal">
      <div
        className={`prof-trip-hero${trip.grayscale ? " prof-trip-hero--muted" : ""}`}
        style={{ background: trip.color }}
      >
        <span className="prof-trip-badge">{trip.badge}</span>
      </div>
      <div className="prof-trip-body">
        <div>
          <h3 className="prof-trip-title" style={{ color: headingColor }}>
            {trip.title}
          </h3>
          <p className="prof-trip-desc">{trip.description}</p>
        </div>
        <Link to={trip.to}>
          <Button variant="outline" full>
            {trip.action}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function formatBadge(startDate: string): string {
  const d = new Date(`${startDate}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function tripCard(trip: TripSummary, grayscale = false): TripCard {
  return {
    id: trip.id,
    title: trip.name,
    description: trip.description ?? "No description yet.",
    badge: formatBadge(trip.startDate),
    action: grayscale ? "View Journal" : "View Itinerary",
    color: "var(--secondary-container)",
    to: grayscale
      ? `/trips/${trip.id}`
      : `/trips/${trip.id}/itinerary`,
    grayscale,
  };
}

export function ProfilePage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<TripSummary[]>([]);

  useEffect(() => {
    let cancelled = false;
    tripsApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setTrips(data);
        }
      })
      .catch(() => {
        // keep empty state on failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = trips
    .filter((trip) => new Date(`${trip.startDate}T00:00:00`) >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = trips
    .filter((trip) => new Date(`${trip.endDate}T00:00:00`) < today)
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  const plannedTrips: TripCard[] = upcoming.map((trip) => tripCard(trip));
  const previousTrips: TripCard[] = past.map((trip) => tripCard(trip, true));

  const initials = user
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "GT";

  return (
    <div className="prof-page">
      <nav className="prof-nav">
        <div className="prof-nav-inner">
          <span className="prof-brand">Globe Trotter</span>
          <div className="prof-nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link className="is-active" to="/profile">
              My Trips
            </Link>
            <Link to="/discover">Discovery</Link>
          </div>
          <div className="prof-nav-cta">
            <Link to="/trips/new">
              <Button variant="primary">Plan New Trip</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="prof-main">
        <section className="prof-header">
          <div className="prof-avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="prof-info">
            <div className="prof-info-top">
              <div>
                <h1 className="prof-name">{user?.name ?? "Traveller"}</h1>
                <p className="prof-tagline">
                  {user?.email ?? "Mindful exploration"}
                </p>
              </div>
            </div>
            <p className="prof-bio">
              {user
                ? `${user.name}'s travel journal — plan trips, build itineraries, and share them with the community.`
                : "Plan trips, build itineraries, and share them with the community."}
            </p>
          </div>
        </section>

        <section className="prof-section">
          <h2 className="prof-section-title">Planned Trips</h2>
          {plannedTrips.length === 0 ? (
            <p className="prof-empty">
              No upcoming trips.{" "}
              <Link to="/trips/new">Plan your next adventure.</Link>
            </p>
          ) : (
            <div className="prof-grid">
              {plannedTrips.map((trip) => (
                <TripCardView
                  key={trip.id}
                  trip={trip}
                  headingColor="var(--primary)"
                />
              ))}
            </div>
          )}
        </section>

        <section className="prof-section">
          <h2 className="prof-section-title">Past Trips</h2>
          {previousTrips.length === 0 ? (
            <p className="prof-empty">No past trips yet.</p>
          ) : (
            <div className="prof-grid">
              {previousTrips.map((trip) => (
                <TripCardView
                  key={trip.id}
                  trip={trip}
                  headingColor="var(--on-surface)"
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="prof-footer">
        <div className="prof-footer-inner">
          <span className="prof-footer-brand">Globe Trotter</span>
          <div className="prof-footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link to="/discover">Destinations</Link>
          </div>
          <span className="prof-footer-copy">
            &copy; 2024 Globe Trotter. Mindful Exploration.
          </span>
        </div>
      </footer>
    </div>
  );
}