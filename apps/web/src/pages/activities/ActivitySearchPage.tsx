import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { citiesApi } from "../../services/client.js";
import type { Activity, City } from "../../services/types.js";
import "./ActivitySearchPage.css";

function formatDuration(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

export function ActivitySearchPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    citiesApi
      .list()
      .then((data) => {
        if (!cancelled) {
          setCities(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load cities");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedCityId) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    citiesApi
      .activities(selectedCityId)
      .then((data) => {
        if (!cancelled) {
          setActivities(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load activities");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [selectedCityId]);

  const filtered = activities.filter((activity) =>
    activity.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="act-page">
      <nav className="act-nav">
        <div className="act-nav-inner">
          <div className="act-nav-left">
            <Link className="act-brand" to="/dashboard">
              Globe Trotter
            </Link>
            <div className="act-nav-links">
              <Link className="is-active" to="/discover">
                Discover
              </Link>
              <Link to="/trips">My Trips</Link>
              <Link to="/trips/new">Plan</Link>
            </div>
          </div>
          <div className="act-nav-actions">
            <Link to="/profile">
              <div className="act-avatar" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="act-main">
        <div className="act-toolbar">
          <div className="act-search">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search activities..."
              aria-label="Search activities"
            />
          </div>
          <div className="act-city-picker">
            <label htmlFor="act-city" className="act-city-label">
              City
            </label>
            <select
              id="act-city"
              className="act-city-select"
              value={selectedCityId}
              onChange={(event) => setSelectedCityId(event.target.value)}
              aria-label="Select city"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 className="act-title">
          {selectedCityId ? "Results" : "Discover Activities"}
        </h1>

        {error ? <p className="act-empty">{error}</p> : null}

        {!selectedCityId ? (
          <p className="act-empty">Choose a city to browse its activities.</p>
        ) : loading ? (
          <p className="act-empty">Loading activities...</p>
        ) : (
          <div className="act-results">
            {filtered.length === 0 ? (
              <p className="act-empty">No activities match your search.</p>
            ) : (
              filtered.map((activity) => (
                <Card key={activity.id} className="act-card">
                  <div className="act-card-thumb" aria-hidden="true">
                    {activity.category}
                  </div>
                  <div className="act-card-body">
                    <h2 className="act-card-title">{activity.name}</h2>
                    <p className="act-card-desc">
                      {activity.description ?? "No description available."}
                    </p>
                    <div className="act-card-tags">
                      <Badge variant="secondary">{activity.category}</Badge>
                      <Badge variant="tertiary">
                        {formatDuration(activity.durationMins)}
                      </Badge>
                    </div>
                  </div>
                  <div className="act-card-price">
                    <span className="act-price">
                      ${activity.estimatedCost}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      <nav className="act-mobile-nav">
        <Link to="/dashboard">Home</Link>
        <Link className="is-active" to="/discover">
          Search
        </Link>
        <Link to="/trips">Trips</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}