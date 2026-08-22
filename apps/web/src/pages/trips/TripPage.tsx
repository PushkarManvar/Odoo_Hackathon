import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../services/api.js";
import "./TripPage.css";

interface TripStopCity {
  id: string;
  name: string;
  country: string;
  region: string | null;
  imageUrl: string | null;
}

interface TripStop {
  id: string;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  notes: string | null;
  city: TripStopCity | null;
}

interface TripDetail {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  coverImageUrl: string | null;
  plannedBudget: number | null;
  transportCost: number | null;
  stayCost: number | null;
  mealCost: number | null;
  currency: string;
  visibility: "PRIVATE" | "PUBLIC";
  shareSlug: string | null;
  stops: TripStop[];
}

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida/AEtjO1US7M4neiocnAZTMJdYNHNW7swlpimtFokBcDrqaneXEizPWreVtznC8Hc-qMVFdboZoFXUJbUqpY1CfujMqL8XcOkFr5Pcc6QDz-Go47Kb1lPsW2VXf8yUE374PVAVWYKuObFj_Z00KFqwAj-3U2DAT4U8mBSy93m6gn1h4FjeWtcxtCAf-avKOhoOsHx865VETE7kyUHf41dOYa6DBBvGpKnTgBRsoj4y4ALUHmpw0uz2ZB3gE79-2jhx";

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function TripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    let cancelled = false;
    apiRequest<TripDetail>(`/trips/${tripId}`)
      .then((data) => {
        if (!cancelled) {
          setTrip(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load trip");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (error) {
    return (
      <div className="gt-trip">
        <div className="gt-trip-state gt-trip-state--error">
          {error}
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="gt-trip">
        <div className="gt-trip-state">Loading trip...</div>
      </div>
    );
  }

  const spent =
    (trip.transportCost ?? 0) + (trip.stayCost ?? 0) + (trip.mealCost ?? 0);
  const budget = trip.plannedBudget ?? 0;
  const budgetPercent =
    budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const remaining = budget - spent;

  const dayCount = Math.max(
    1,
    Math.round(
      (new Date(`${trip.endDate}T00:00:00`).getTime() -
        new Date(`${trip.startDate}T00:00:00`).getTime()) /
        86400000
    ) + 1
  );

  return (
    <div className="gt-trip">
      <header className="gt-trip-header">
        <div className="gt-trip-header-inner">
          <Link className="gt-trip-brand" to="/dashboard">
            <span>&#9873;</span> Globe Trotter
          </Link>
          <nav className="gt-trip-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link to="/trips">Discovery</Link>
          </nav>
          <div className="gt-trip-avatar">U</div>
        </div>
      </header>

      <main className="gt-trip-main">
        <section className="gt-trip-hero">
          <div className="gt-trip-hero-media">
            <img
              alt={trip.name}
              src={trip.coverImageUrl ?? HERO_IMG}
            />
          </div>
          <div className="gt-trip-hero-content">
            <div className="gt-trip-hero-card">
              <h1 className="gt-trip-hero-title">{trip.name}</h1>
              <p className="gt-trip-hero-subtitle">
                {trip.description ??
                  "Curated adventures for mindful exploration."}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="gt-trip-section-title">Trip Overview</h2>
          <div className="gt-trip-dash-grid">
            <div className="gt-trip-card gt-trip-card--span4">
              <h3 className="gt-trip-card-title">
                Trip Details
                <Link className="gt-trip-card-link" to={`/trips/${trip.id}/edit`}>
                  EDIT
                </Link>
              </h3>
              <div className="gt-trip-detail">
                <div className="gt-trip-detail-row">
                  <span className="gt-trip-detail-label">Dates</span>
                  <span className="gt-trip-detail-value">
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                </div>
                <div className="gt-trip-detail-row">
                  <span className="gt-trip-detail-label">Duration</span>
                  <span className="gt-trip-detail-value">
                    {dayCount} Days
                  </span>
                </div>
                <div className="gt-trip-detail-row">
                  <span className="gt-trip-detail-label">Stops</span>
                  <span className="gt-trip-detail-value">
                    {trip.stops.length} Locations
                  </span>
                </div>
                <div className="gt-trip-detail-row">
                  <span className="gt-trip-detail-label">Visibility</span>
                  <span className="gt-trip-detail-value">
                    {trip.visibility === "PUBLIC" ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </div>

            <div className="gt-trip-card gt-trip-card--secondary gt-trip-card--span4">
              <div className="gt-trip-card-title">
                <span>Active Itinerary</span>
              </div>
              <div>
                <p className="gt-trip-upnext-label">UP NEXT</p>
                {trip.stops.length > 0 ? (
                  <>
                    <h4 className="gt-trip-upnext-title">
                      {trip.stops[0].city?.name ?? `Stop ${trip.stops[0].sequenceOrder}`}
                    </h4>
                    <p className="gt-trip-upnext-desc">
                      {trip.stops[0].notes ??
                        "Continue building your itinerary."}
                    </p>
                  </>
                ) : (
                  <p className="gt-trip-upnext-desc">
                    No stops yet. Start planning your itinerary.
                  </p>
                )}
              </div>
              <Link to={`/trips/${trip.id}/itinerary`}>
                <button className="gt-trip-plan-btn" type="button">
                  Continue Planning
                </button>
              </Link>
            </div>

            <div className="gt-trip-card gt-trip-card--span4">
              <h3 className="gt-trip-card-title">
                Budget Planner
                <Link className="gt-trip-card-link" to={`/trips/${trip.id}/budget`}>
                  VIEW
                </Link>
              </h3>
              <div className="gt-trip-budget-stats">
                <div>
                  <p className="gt-trip-budget-cap">Estimated</p>
                  <p className="gt-trip-budget-amount">
                    {formatMoney(budget, trip.currency)}
                  </p>
                </div>
                <div className="gt-trip-budget-stats">
                  <div>
                    <p className="gt-trip-budget-cap">Spent</p>
                    <p className="gt-trip-budget-amount gt-trip-budget-amount--primary">
                      {formatMoney(spent, trip.currency)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="gt-trip-budget-bar">
                <div
                  className="gt-trip-budget-fill"
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
              <div className="gt-trip-budget-status">
                {remaining >= 0
                  ? `ON TRACK: ${formatMoney(remaining, trip.currency)} remaining`
                  : `OVER BUDGET: ${formatMoney(-remaining, trip.currency)} over`}
              </div>
            </div>
          </div>
        </section>

        <section className="gt-trip-stops">
          <div className="gt-trip-section-card">
            <h2 className="gt-trip-section-title">Itinerary Stops</h2>
            {trip.stops.length === 0 ? (
              <p className="gt-trip-state">No stops yet.</p>
            ) : (
              <ul className="gt-trip-stop-list">
                {trip.stops.map((stop) => (
                  <li key={stop.id} className="gt-trip-stop-item">
                    <div className="gt-trip-stop-icon">&#9992;</div>
                    <div>
                      <p className="gt-trip-stop-name">
                        {stop.city?.name ?? `Stop ${stop.sequenceOrder}`}
                      </p>
                      <p className="gt-trip-stop-dates">
                        {formatDate(stop.arrivalDate)} -{" "}
                        {formatDate(stop.departureDate)}
                        {stop.city?.country ? ` • ${stop.city.country}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="gt-trip-community">
            <h2 className="gt-trip-community-title">Community</h2>
            <p className="gt-trip-community-text">
              Join travellers sharing itineraries, budget tips, and hidden
              gems.
            </p>
            <Link to={`/trips/${trip.id}/build`}>
              <button className="gt-trip-community-btn" type="button">
                Explore Trending Trips
              </button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="gt-trip-footer">
        <div className="gt-trip-footer-brand">Globe Trotter</div>
        <nav className="gt-trip-footer-nav">
          <a href="#">Support</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Destinations</a>
        </nav>
        <div className="gt-trip-footer-copy">
          &copy; 2024 Globe Trotter. Mindful Exploration.
        </div>
      </footer>
    </div>
  );
}