import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import "./CalendarPage.css";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Month {
  label: string;
  year: number;
  month: number;
}

const eventRange: Record<string, { start: number; end: number; label: string }> =
  {
    "PARIS TRIP": { start: 5, end: 8, label: "PARIS TRIP" },
    "JAPAN ADVENTURE": { start: 9, end: 13, label: "JAPAN ADVENTURE" },
    "NYC GETAWAY": { start: 18, end: 20, label: "NYC GETAWAY" },
  };

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
  const [current, setCurrent] = useState<Month>({
    label: "January 2024",
    year: 2024,
    month: 0,
  });

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

  return (
    <div className="cal-page">
      <header className="cal-header">
        <div className="cal-header-inner">
          <span className="cal-brand">GlobeTrotter</span>
          <div className="cal-tools">
            <div className="cal-search">
              <Input placeholder="Search trips..." aria-label="Search trips" />
            </div>
            <div className="cal-actions">
              <Button variant="outline" size="sm">
                Group by
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort by...
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="cal-main">
        <h2 className="cal-title">Calendar View</h2>

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
              const range = Object.values(eventRange).find((r) =>
                cellDate
                  ? isInRange(day, current.month, current.year, r)
                  : false
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
                    <div className="cal-event">{range.label}</div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </main>
    </div>
  );
}