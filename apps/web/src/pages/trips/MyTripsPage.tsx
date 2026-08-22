import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/index.js";
import { useAuth } from "../../context/AuthContext.js";
import { apiRequest } from "../../services/api.js";
import "./MyTripsPage.css";

interface Trip {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  visibility: "PRIVATE" | "PUBLIC";
  shareSlug: string | null;
  currency: string;
  plannedBudget: number | null;
}

const PLACEHOLDER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBehWKEptSzPfFllTEPeAySG9Khlh97dQQnEBOJ4jBf4hajt5E-qlT95epfIr6XjeXucFvLm1i7h0R1ac3X1Fp2hMF5ire0sOJO4tLOO6YEZ8W9x3kzPWp15KZySUoHtN2om8N2ZbiDezS3Z72pYw0CkOtDpo1-8JZV3BfzFEZYTkzc0AoFIUqCViB1UwmVbbHEyZbld66tZvtUNwvILI8x_Ku7W-g-VM9NnUkD92SFHm9R_wAioaTZ";

function formatDates(start: string, end: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  return `${s.toLocaleDateString("en-US", options)} - ${e.toLocaleDateString("en-US", options)}`;
}

function groupTrips(trips: Trip[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ongoing: Trip[] = [];
  const upcoming: Trip[] = [];
  const completed: Trip[] = [];

  for (const trip of trips) {
    const start = new Date(`${trip.startDate}T00:00:00`);
    const end = new Date(`${trip.endDate}T00:00:00`);

    if (end < today) {
      completed.push(trip);
    } else if (start <= today && end >= today) {
      ongoing.push(trip);
    } else {
      upcoming.push(trip);
    }
  }

  return { ongoing, upcoming, completed };
}

function TripCard({
  trip,
  variant,
}: {
  trip: Trip;
  variant: "row" | "column";
}) {
  return (
    <article className={`gt-trip-card gt-trip-card--${variant}`}>
      <div className="gt-trip-card-media">
        {trip.coverImageUrl ? (
          <img alt={trip.name} src={trip.coverImageUrl} />
        ) : (
          <img alt={trip.name} src={PLACEHOLDER_IMG} />
        )}
        {variant === "row" ? (
          <div className="gt-trip-badge">Active</div>
        ) : null}
      </div>
      <div className="gt-trip-card-body">
        <div>
          <h3 className="gt-trip-title">{trip.name}</h3>
          <p className="gt-trip-dates">
            {formatDates(trip.startDate, trip.endDate)}
          </p>
          {trip.description ? (
            <p className="gt-trip-desc">{trip.description}</p>
          ) : null}
          <div className="gt-trip-tags">
            <span className="gt-trip-tag">
              {trip.visibility === "PUBLIC" ? "Public" : "Private"}
            </span>
            {trip.plannedBudget !== null ? (
              <span className="gt-trip-tag gt-trip-tag--tertiary">
                Budget {trip.currency} {trip.plannedBudget}
              </span>
            ) : null}
          </div>
        </div>
        <Link to={`/trips/${trip.id}`}>
          <button
            type="button"
            className={`gt-trip-view-btn ${
              variant === "row" ? "" : "gt-trip-view-btn--outline"
            }`}
          >
            {variant === "row" ? "View Details" : "View Itinerary"}
          </button>
        </Link>
      </div>
    </article>
  );
}

function TripsSection({
  title,
  trips,
  variant,
}: {
  title: string;
  trips: Trip[];
  variant: "row" | "column";
}) {
  return (
    <section className="gt-trips-section">
      <h2 className="gt-trips-section-title">{title}</h2>
      {trips.length === 0 ? (
        <p className="gt-trips-empty">
          No {title.toLowerCase()} trips yet. Plan your next journey!
        </p>
      ) : (
        <div
          className={`gt-trips-grid ${
            variant === "column" ? "gt-trips-grid--cols" : ""
          }`}
        >
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} variant={variant} />
          ))}
        </div>
      )}
    </section>
  );
}

export function MyTripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest<Trip[]>("/trips")
      .then((data) => {
        if (!cancelled) {
          setTrips(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load trips");
          setTrips([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const all = trips ?? [];
  const filtered = search.trim()
    ? all.filter((trip) =>
        trip.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : all;
  const { ongoing, upcoming, completed } = groupTrips(filtered);

  return (
    <div className="gt-trips">
      <header className="gt-trips-header">
        <div className="gt-trips-header-inner">
          <div className="gt-trips-header-left">
            <Link className="gt-trips-brand" to="/dashboard">
              Globe Trotter
            </Link>
            <nav className="gt-trips-nav">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/trips">My Trips</Link>
              <Link to="/trips">Discovery</Link>
            </nav>
          </div>
          <div className="gt-trips-header-actions">
            <Link to="/trips/new">
              <Button
                className="gt-trips-create-btn"
                variant="primary"
                size="md"
              >
                Create Trip
              </Button>
            </Link>
            <div className="gt-trips-avatar">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          </div>
        </div>
      </header>

      <main className="gt-trips-main">
        <div className="gt-trips-toolbar">
          <div className="gt-trips-search">
            <span className="gt-trips-search-icon">&#128269;</span>
            <input
              type="text"
              placeholder="Search bar ......"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="gt-trips-toolbar-actions">
            <button className="gt-trips-tool-btn" type="button">
              Group by <span>&#9660;</span>
            </button>
            <button className="gt-trips-tool-btn" type="button">
              Filter <span>&#9776;</span>
            </button>
            <button className="gt-trips-tool-btn" type="button">
              Sort by... <span>&#8645;</span>
            </button>
          </div>
        </div>

        {error ? <p className="gt-trips-loading">{error}</p> : null}

        {trips === null ? (
          <p className="gt-trips-loading">Loading your trips...</p>
        ) : (
          <>
            <TripsSection title="Ongoing" trips={ongoing} variant="row" />
            <TripsSection title="Up-coming" trips={upcoming} variant="column" />
            <TripsSection title="Completed" trips={completed} variant="column" />
          </>
        )}
      </main>

      <footer className="gt-trips-footer">
        <div className="gt-trips-footer-inner">
          <div className="gt-trips-footer-brand">Globe Trotter</div>
          <nav className="gt-trips-footer-nav">
            <a href="#">Support</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </nav>
          <div className="gt-trips-footer-copy">
            &copy; 2024 Globe Trotter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}