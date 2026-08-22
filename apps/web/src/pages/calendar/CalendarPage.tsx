import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { tripsApi } from "../../services/client.js";
import type { TripSummary } from "../../services/types.js";
import "./CalendarPage.css";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Month {
  label: string;
  year: number;
  month: number;
}

interface TripRange {
  start: number;
  end: number;
  label: string;
  tripId: string;
}

interface CalendarCell {
  day: number;
  inMonth: boolean;
}

function buildCalendarCells(month: number, year: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const leading: CalendarCell[] = Array.from(
    { length: firstDay },
    (_, i) => ({
      day: prevMonthDays - firstDay + 1 + i,
      inMonth: false,
    })
  );
  const monthDays: CalendarCell[] = Array.from(
    { length: daysInMonth },
    (_, i) => ({ day: i + 1, inMonth: true })
  );
  const total = leading.length + monthDays.length;
  const trailing: CalendarCell[] = Array.from(
    { length: total % 7 === 0 ? 0 : 7 - (total % 7) },
    (_, i) => ({ day: i + 1, inMonth: false })
  );
  return [...leading, ...monthDays, ...trailing];
}

function isInRange(
  day: number,
  month: number,
  year: number,
  range: { start: number; end: number }
): boolean {
  const cellDate = new Date(year, month, day);
  const startDate = new Date(year, month, range.start);
  const endDate = new Date(year, month, range.end);
  return cellDate >= startDate && cellDate <= endDate;
}

export function CalendarPage() {
  const [current, setCurrent] = useState<Month>(() => {
    const now = new Date();
    return {
      label: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  });
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
          setError(err instanceof Error ? err.message : "Failed to load trips");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const changeMonth = (delta: number) => {
    const next = new Date(current.year, current.month + delta, 1);
    setCurrent({
      label: next.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
      year: next.getFullYear(),
      month: next.getMonth(),
    });
  };

  const cells = buildCalendarCells(current.month, current.year);

  const ranges: TripRange[] = trips.flatMap((trip) => {
    const start = new Date(`${trip.startDate}T00:00:00`);
    const end = new Date(`${trip.endDate}T00:00:00`);
    if (
      start.getFullYear() !== current.year ||
      start.getMonth() !== current.month
    ) {
      return [];
    }
    const startDay = Math.min(start.getDate(), 31);
    const endDay = Math.min(end.getDate(), 31);
    return [
      {
        start: startDay,
        end: endDay,
        label: trip.name.toUpperCase(),
        tripId: trip.id,
      },
    ];
  });

  const filteredTrips = trips.filter((trip) =>
    trip.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="cal-page">
      <header className="cal-header">
        <div className="cal-header-inner">
          <Link className="cal-brand" to="/dashboard">
            GlobeTrotter
          </Link>
          <div className="cal-tools">
            <div className="cal-search">
              <Input
                placeholder="Search trips..."
                aria-label="Search trips"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="cal-actions">
              <Link to="/trips/new">
                <Button variant="primary" size="sm">
                  Plan New Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="cal-main">
        <h2 className="cal-title">Calendar View</h2>

        {error ? <p className="cal-empty">{error}</p> : null}

        <Card className="cal-container">
          <div className="cal-nav">
            <button
              type="button"
              className="cal-nav-btn"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
            >
              &#10094;
            </button>
            <h3 className="cal-month">{current.label}</h3>
            <button
              type="button"
              className="cal-nav-btn"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
            >
              &#10095;
            </button>
          </div>

          <div className="cal-grid">
            {WEEKDAYS.map((day) => (
              <div className="cal-header-cell" key={day}>
                {day}
              </div>
            ))}

            {cells.map((cell, index) => {
              const { day, inMonth } = cell;
              const cellDate = inMonth
                ? new Date(current.year, current.month, day)
                : null;
              const range = ranges.find((r) =>
                cellDate ? isInRange(day, current.month, current.year, r) : false
              );
              const isStart =
                range && cellDate ? cellDate.getDate() === range.start : false;

              return (
                <div
                  className={`cal-cell${!inMonth ? " cal-cell--muted" : ""}${
                    range ? " cal-cell--in-range" : ""
                  }${isStart ? " cal-cell--event-start" : ""}`}
                  key={index}
                >
                  <span className="cal-cell-day">{day}</span>
                  {isStart && range ? (
                    <Link className="cal-event" to={`/trips/${range.tripId}`}>
                      {range.label}
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        <section className="cal-trips">
          <h3 className="cal-trips-title">My Trips</h3>
          {filteredTrips.length === 0 ? (
            <p className="cal-empty">
              {query ? "No trips match your search." : "No trips yet."}
            </p>
          ) : (
            <ul className="cal-trips-list">
              {filteredTrips.map((trip) => (
                <li key={trip.id}>
                  <Link className="cal-trip-item" to={`/trips/${trip.id}`}>
                    <span className="cal-trip-name">{trip.name}</span>
                    <span className="cal-trip-dates">
                      {trip.startDate} - {trip.endDate}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}