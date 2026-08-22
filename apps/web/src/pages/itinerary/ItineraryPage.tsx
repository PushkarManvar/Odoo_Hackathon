import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { tripsApi } from "../../services/client.js";
import type { TripDetail, TripItem } from "../../services/types.js";
import "./ItineraryPage.css";

interface ItineraryActivity {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  durationMins: number;
}

interface ItineraryItem {
  id: string;
  tripStopId: string;
  activityId: string | null;
  customName: string | null;
  customCost: number | null;
  date: string;
  startTime: string | null;
  durationMins: number | null;
  sequenceOrder: number;
  notes: string | null;
  activity: ItineraryActivity | null;
}

interface ItineraryDay {
  day: number;
  label: string;
  labelDate?: Date;
  items: ItineraryItem[];
  expenses: { label: string; amount: number }[];
}

function formatTime(value: string | null): string {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  const h = Number(hours);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minutes} ${period}`;
}

function badgeClass(category: string): string {
  const normalized = category.toLowerCase();
  if (normalized.includes("food")) return "it-badge--primary";
  if (normalized.includes("nature")) return "it-badge--fixed";
  return "it-badge--secondary";
}

function itemName(item: ItineraryItem): string {
  return item.customName ?? item.activity?.name ?? "Untitled";
}

function itemCost(item: ItineraryItem): number {
  return item.customCost ?? item.activity?.estimatedCost ?? 0;
}

function toItineraryItem(item: TripItem): ItineraryItem {
  return {
    id: item.id,
    tripStopId: item.activityId ?? "",
    activityId: item.activityId,
    customName: item.customName,
    customCost: item.customCost,
    date: item.date,
    startTime: item.startTime,
    durationMins: item.durationMins,
    sequenceOrder: item.sequenceOrder,
    notes: item.notes,
    activity: item.activity,
  };
}

function buildDays(trip: TripDetail): ItineraryDay[] {
  const byDate = new Map<string, ItineraryItem[]>();
  for (const stop of trip.stops) {
    for (const item of stop.items) {
      const mapped = toItineraryItem(item);
      const list = byDate.get(mapped.date) ?? [];
      list.push(mapped);
      byDate.set(mapped.date, list);
    }
  }

  const sortedDates = [...byDate.keys()].sort();
  if (sortedDates.length === 0) {
    return [];
  }

  const first = new Date(`${sortedDates[0]}T00:00:00`).getTime();
  return sortedDates.map((date) => {
    const dayNumber =
      Math.round((new Date(`${date}T00:00:00`).getTime() - first) / 86400000) + 1;
    const items = (byDate.get(date) ?? []).sort(
      (a, b) => a.sequenceOrder - b.sequenceOrder
    );
    const expenses = items.map((item) => ({
      label: itemName(item),
      amount: itemCost(item),
    }));
    const labelDate = new Date(`${date}T00:00:00`);
    return {
      day: dayNumber,
      label: `Day ${dayNumber}`,
      items,
      expenses,
      labelDate,
    };
  });
}

export function ItineraryPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          setError(err instanceof Error ? err.message : "Failed to load itinerary");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (error) {
    return (
      <div className="itinerary-page">
        <div className="it-empty">{error}</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="itinerary-page">
        <div className="it-empty">Loading itinerary...</div>
      </div>
    );
  }

  const days = buildDays(trip);
  const stopNames = trip.stops
    .map((stop) => stop.city?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="itinerary-page">
      <header className="it-header">
        <div className="it-header-inner">
          <Link className="it-brand" to="/dashboard">
            Globe Trotter
          </Link>
          <nav className="it-nav">
            <Link className="it-nav-link" to={`/trips/${trip.id}/itinerary`}>
              Itineraries
            </Link>
            <Link className="it-nav-link" to="/discover">
              Discover
            </Link>
            <Link className="it-nav-link" to={`/trips/${trip.id}/budget`}>
              Budget
            </Link>
          </nav>
        </div>
      </header>

      <main className="it-page-inner">
        <section className="it-toolbar">
          <div className="it-search">
            <span className="it-search-icon">⌕</span>
            <input
              className="it-search-input"
              type="text"
              placeholder="Search places, activities..."
            />
          </div>
          <div className="it-toolbar-actions">
            <Link className="it-btn it-btn--group" to={`/trips/${trip.id}/build`}>
              <span className="it-icon">+</span> Add activities
            </Link>
          </div>
        </section>

        <section className="it-title">
          <h1>
            Itinerary for{" "}
            {stopNames || trip.name}
          </h1>
          <p>{trip.description ?? trip.name}</p>
        </section>

        {days.length === 0 ? (
          <section className="it-empty">
            No itinerary items yet.{" "}
            <Link to={`/trips/${trip.id}/build`}>Start building your trip.</Link>
          </section>
        ) : (
          <section className="it-grid">
            <div className="it-columns">
              <div className="it-col-day">Day</div>
              <div className="it-col-activity">Physical Activity</div>
              <div className="it-col-expense">Expense</div>
            </div>

            {days.map((day) => (
              <div className="it-day" key={day.day}>
                <div className="it-day-marker-col">
                  <div className="it-day-marker">{day.label}</div>
                  {day.labelDate ? (
                    <div className="it-day-date">
                      {day.labelDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="it-activities">
                  {day.items.map((item, index) => (
                    <div
                      className={`it-card ${
                        index < day.items.length - 1 ? "it-card--arrow" : ""
                      }`}
                      key={item.id}
                    >
                      <div className="it-card-top">
                        <div>
                          <h3 className="it-card-title">{itemName(item)}</h3>
                          <p className="it-card-time">
                            <span className="it-icon">🕐</span>
                            {formatTime(item.startTime)} ·{" "}
                            {item.durationMins
                              ? `${Math.round(item.durationMins / 60)}h ${item.durationMins % 60}m`
                              : "Flexible"}
                          </p>
                        </div>
                        {item.activity ? (
                          <span
                            className={`it-badge ${badgeClass(item.activity.category)}`}
                          >
                            {item.activity.category}
                          </span>
                        ) : (
                          <span className="it-badge it-badge--primary">Custom</span>
                        )}
                      </div>
                      {item.notes && <p className="it-card-desc">{item.notes}</p>}
                    </div>
                  ))}
                </div>

                <div className="it-expenses">
                  {day.expenses.map((expense) => (
                    <div className="it-expense" key={expense.label}>
                      <span className="it-expense-label">{expense.label}</span>
                      <span className="it-expense-value">
                        {trip.currency} {expense.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <nav className="it-mobile-nav">
        <Link className="it-mobile-link is-active" to={`/trips/${trip.id}/itinerary`}>
          <span className="it-icon">🗺</span>
          <span>Plan</span>
        </Link>
        <Link className="it-mobile-link" to="/discover">
          <span className="it-icon">⌖</span>
          <span>Explore</span>
        </Link>
        <Link className="it-mobile-link" to={`/trips/${trip.id}/budget`}>
          <span className="it-icon">₩</span>
          <span>Wallet</span>
        </Link>
        <Link className="it-mobile-link" to="/profile">
          <span className="it-icon">●</span>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}