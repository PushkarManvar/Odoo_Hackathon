import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { citiesApi, itemsApi, stopsApi, tripsApi } from "../../services/client.js";
import type { City, TripDetail } from "../../services/types.js";
import "./ItineraryBuilderPage.css";

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ItineraryBuilderPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [cities, setCities] = useState<City[]>([]);
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [stopNotes, setStopNotes] = useState("");
  const [addingStop, setAddingStop] = useState(false);

  const [addItemForStop, setAddItemForStop] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemDate, setItemDate] = useState("");
  const [itemTime, setItemTime] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    let cancelled = false;
    tripsApi
      .get(tripId)
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

  useEffect(() => {
    let cancelled = false;
    citiesApi
      .list({ limit: 50 })
      .then((data) => {
        if (!cancelled) {
          setCities(data);
        }
      })
      .catch(() => {
        // cities are optional for the builder
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const searchCities = (query: string): City[] => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return cities;
    }
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(q) ||
        city.country.toLowerCase().includes(q)
    );
  };

  const onAddStop = async (event: FormEvent) => {
    event.preventDefault();
    if (!tripId || !selectedCity || !arrivalDate || !departureDate) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await stopsApi.create(tripId, {
        cityId: selectedCity.id,
        arrivalDate,
        departureDate,
        notes: stopNotes || null,
      });
      const updated = await tripsApi.get(tripId);
      setTrip(updated);
      setSelectedCity(null);
      setCityQuery("");
      setArrivalDate("");
      setDepartureDate("");
      setStopNotes("");
      setAddingStop(false);
      setMessage("Stop added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add stop");
    } finally {
      setSaving(false);
    }
  };

  const onAddItem = async (event: FormEvent) => {
    event.preventDefault();
    if (!addItemForStop || !itemName || !itemDate) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await itemsApi.create(addItemForStop, {
        customName: itemName,
        customCost: itemCost ? Number(itemCost) : undefined,
        date: itemDate,
        startTime: itemTime || null,
        notes: itemNotes || null,
      });
      const updated = await tripsApi.get(tripId ?? "");
      setTrip(updated);
      setAddItemForStop(null);
      setItemName("");
      setItemDate("");
      setItemTime("");
      setItemCost("");
      setItemNotes("");
      setMessage("Activity added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add activity");
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="itb-page">
        <div className="itb-main">
          <div className="itb-title">
            <h1>Build Itinerary</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="itb-page">
        <div className="itb-main">
          <div className="itb-title">
            <h1>Build Itinerary</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="itb-page">
      <header className="itb-header">
        <div className="itb-header-inner">
          <Link className="itb-brand" to="/dashboard">
            Globe Trotter
          </Link>
          <nav className="itb-nav">
            <Link className="itb-nav-link" to="/dashboard">
              Dashboard
            </Link>
            <Link className="itb-nav-link" to="/trips">
              My Trips
            </Link>
            <Link className="itb-nav-link is-active" to={`/trips/${trip.id}/build`}>
              Create Trip
            </Link>
            <Link className="itb-nav-link" to="/discover">
              Discovery
            </Link>
          </nav>
        </div>
      </header>

      <main className="itb-main">
        <div className="itb-title">
          <h1>Build Itinerary</h1>
          <p>{trip.name}</p>
        </div>

        {message ? <p className="itb-message">{message}</p> : null}

        <div className="itb-sections">
          {trip.stops.length === 0 ? (
            <p className="itb-empty">
              No stops yet. Add your first destination below.
            </p>
          ) : (
            trip.stops.map((stop) => (
              <Card key={stop.id} className="itb-section">
                <h2 className="itb-section-title">
                  Stop {stop.sequenceOrder}: {stop.city?.name ?? "Untitled"}
                </h2>
                <p className="itb-section-desc">
                  {stop.notes ?? "No notes for this stop."}
                </p>
                <div className="itb-info-row">
                  <div className="itb-info-tile">
                    <span className="itb-info-icon itb-info-icon--primary">
                      &#128197;
                    </span>
                    <div>
                      <span className="itb-info-label">Date Range</span>
                      <span className="itb-info-value">
                        {formatDate(stop.arrivalDate)} -{" "}
                        {formatDate(stop.departureDate)}
                      </span>
                    </div>
                  </div>
                  <div className="itb-info-tile">
                    <span className="itb-info-icon itb-info-icon--secondary">
                      &#128336;
                    </span>
                    <div>
                      <span className="itb-info-label">Activities</span>
                      <span className="itb-info-value">
                        {stop.items.length} item{stop.items.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>

                {stop.items.length > 0 ? (
                  <ul className="itb-items">
                    {stop.items.map((item) => (
                      <li className="itb-item" key={item.id}>
                        <span className="itb-item-name">
                          {item.customName ?? item.activity?.name ?? "Activity"}
                        </span>
                        <span className="itb-item-meta">
                          {formatDate(item.date)}
                          {item.startTime ? ` • ${item.startTime}` : ""}
                          {item.customCost !== null && item.customCost !== undefined
                            ? ` • ${trip.currency} ${item.customCost}`
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {addItemForStop === stop.id ? (
                  <form className="itb-form" onSubmit={onAddItem}>
                    <Input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Activity name"
                      aria-label="Activity name"
                      required
                    />
                    <Input
                      type="date"
                      value={itemDate}
                      onChange={(e) => setItemDate(e.target.value)}
                      aria-label="Date"
                      required
                    />
                    <Input
                      type="time"
                      value={itemTime}
                      onChange={(e) => setItemTime(e.target.value)}
                      aria-label="Start time"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={itemCost}
                      onChange={(e) => setItemCost(e.target.value)}
                      placeholder={`Cost (${trip.currency})`}
                      aria-label="Cost"
                    />
                    <Input
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      placeholder="Notes (optional)"
                      aria-label="Notes"
                    />
                    <div className="itb-form-actions">
                      <Button type="submit" variant="primary" disabled={saving}>
                        {saving ? "Saving..." : "Add Activity"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAddItemForStop(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="itb-add">
                    <Button
                      variant="outline"
                      onClick={() => setAddItemForStop(stop.id)}
                    >
                      + Add Activity
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}

          <div className="itb-add">
            {addingStop ? (
              <form className="itb-form itb-form--wide" onSubmit={onAddStop}>
                <Input
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Search city..."
                  aria-label="Search city"
                />
                {selectedCity ? (
                  <p className="itb-selected">
                    Selected: {selectedCity.name}, {selectedCity.country}
                  </p>
                ) : (
                  <ul className="itb-city-list">
                    {searchCities(cityQuery).map((city) => (
                      <li key={city.id}>
                        <button
                          type="button"
                          className="itb-city-option"
                          onClick={() => {
                            setSelectedCity(city);
                            setCityQuery("");
                          }}
                        >
                          {city.name}, {city.country}
                          {city.region ? ` • ${city.region}` : ""}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <Input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  aria-label="Arrival date"
                  required
                />
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  aria-label="Departure date"
                  required
                />
                <Input
                  value={stopNotes}
                  onChange={(e) => setStopNotes(e.target.value)}
                  placeholder="Notes (optional)"
                  aria-label="Notes"
                />
                <div className="itb-form-actions">
                  <Button type="submit" variant="primary" disabled={saving || !selectedCity}>
                    {saving ? "Saving..." : "Add Stop"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setAddingStop(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <Button variant="primary" size="lg" onClick={() => setAddingStop(true)}>
                <span aria-hidden="true">+</span> Add Destination
              </Button>
            )}
          </div>
        </div>
      </main>

      <footer className="itb-footer">
        <div className="itb-footer-inner">
          <span className="itb-footer-brand">Globe Trotter</span>
          <div className="itb-footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link to={`/trips/${trip.id}/itinerary`}>View Itinerary</Link>
          </div>
          <span className="itb-footer-copy">
            © 2024 Globe Trotter. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}