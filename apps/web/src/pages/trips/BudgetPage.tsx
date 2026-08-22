import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { budgetApi, tripsApi } from "../../services/client.js";
import type { BudgetSummary, TripDetail } from "../../services/types.js";
import "./BudgetPage.css";

function formatMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BudgetPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [budget, setBudget] = useState<BudgetSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    let cancelled = false;
    Promise.all([tripsApi.get(tripId), budgetApi.get(tripId)])
      .then(([tripData, budgetData]) => {
        if (!cancelled) {
          setTrip(tripData);
          setBudget(budgetData);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load budget");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  if (error) {
    return (
      <div className="bud-page">
        <div className="bud-main">
          <div className="bud-state">{error}</div>
        </div>
      </div>
    );
  }

  if (!budget || !trip) {
    return (
      <div className="bud-page">
        <div className="bud-main">
          <div className="bud-state">Loading budget...</div>
        </div>
      </div>
    );
  }

  const total = budget.estimatedTotal;
  const planned = budget.plannedBudget ?? total;

  const sections = [
    {
      label: "Transport",
      amount: budget.breakdown.transport,
      className: "bud-bar--transport",
    },
    {
      label: "Stay",
      amount: budget.breakdown.stay,
      className: "bud-bar--stay",
    },
    {
      label: "Meals",
      amount: budget.breakdown.meals,
      className: "bud-bar--meals",
    },
    {
      label: "Activities",
      amount: budget.breakdown.activities,
      className: "bud-bar--activities",
    },
  ].filter((section) => section.amount > 0);

  const plannedWidth =
    planned > 0 ? Math.min(100, Math.round((total / planned) * 100)) : 0;

  return (
    <div className="bud-page">
      <header className="bud-header">
        <div className="bud-header-inner">
          <Link className="bud-brand" to="/dashboard">
            Globe Trotter
          </Link>
          <nav className="bud-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link className="is-active" to={`/trips/${trip.id}/budget`}>
              Budget
            </Link>
            <Link to={`/trips/${trip.id}/itinerary`}>Itinerary</Link>
          </nav>
        </div>
      </header>

      <main className="bud-main">
        <div className="bud-title">
          <h1>Budget</h1>
          <p>{trip.name}</p>
        </div>

        <section className="bud-grid">
          <div className="bud-card">
            <h2 className="bud-card-title">Summary</h2>
            <div className="bud-summary">
              <div className="bud-summary-row">
                <span className="bud-summary-label">Estimated Total</span>
                <span className="bud-summary-value">
                  {formatMoney(total, budget.currency)}
                </span>
              </div>
              <div className="bud-summary-row">
                <span className="bud-summary-label">Planned Budget</span>
                <span className="bud-summary-value">
                  {budget.plannedBudget === null
                    ? "Not set"
                    : formatMoney(budget.plannedBudget, budget.currency)}
                </span>
              </div>
              <div className="bud-summary-row">
                <span className="bud-summary-label">Remaining</span>
                <span
                  className={`bud-summary-value ${
                    budget.isOverBudget ? "bud-summary-value--over" : ""
                  }`}
                >
                  {budget.remaining === null
                    ? "—"
                    : budget.isOverBudget
                      ? `${formatMoney(budget.overBudgetAmount, budget.currency)} over`
                      : formatMoney(budget.remaining, budget.currency)}
                </span>
              </div>
              <div className="bud-summary-row">
                <span className="bud-summary-label">Per Day</span>
                <span className="bud-summary-value">
                  {formatMoney(budget.averagePerDay, budget.currency)} / day
                </span>
              </div>
              <div className="bud-summary-row">
                <span className="bud-summary-label">Duration</span>
                <span className="bud-summary-value">
                  {budget.tripDayCount} days
                </span>
              </div>
            </div>

            <div className="bud-bar-track">
              <div
                className={`bud-bar-fill ${
                  budget.isOverBudget ? "bud-bar-fill--over" : ""
                }`}
                style={{ width: `${plannedWidth}%` }}
              />
            </div>
            <p className="bud-bar-caption">
              {budget.isOverBudget
                ? "OVER BUDGET"
                : `${plannedWidth}% of planned budget used`}
            </p>
          </div>

          <div className="bud-card">
            <h2 className="bud-card-title">Breakdown</h2>
            <div className="bud-breakdown">
              {sections.length === 0 ? (
                <p className="bud-state">No costs recorded yet.</p>
              ) : (
                sections.map((section) => (
                  <div className="bud-row" key={section.label}>
                    <div className="bud-row-head">
                      <span className="bud-row-label">{section.label}</span>
                      <span className="bud-row-value">
                        {formatMoney(section.amount, budget.currency)}
                      </span>
                    </div>
                    <div className="bud-row-track">
                      <div
                        className={`bud-row-fill ${section.className}`}
                        style={{
                          width: `${total > 0 ? Math.round((section.amount / total) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="bud-card">
          <h2 className="bud-card-title">By Stop</h2>
          {budget.breakdownByStop.length === 0 ? (
            <p className="bud-state">No stops yet.</p>
          ) : (
            <ul className="bud-stop-list">
              {budget.breakdownByStop.map((stop) => (
                <li className="bud-stop" key={stop.stopId}>
                  <span className="bud-stop-name">{stop.cityName}</span>
                  <span className="bud-stop-value">
                    {formatMoney(stop.cost, budget.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bud-card">
          <h2 className="bud-card-title">By Category</h2>
          {budget.breakdownByCategory.length === 0 ? (
            <p className="bud-state">No activities yet.</p>
          ) : (
            <ul className="bud-stop-list">
              {budget.breakdownByCategory.map((category) => (
                <li className="bud-stop" key={category.category}>
                  <span className="bud-stop-name">{category.category}</span>
                  <span className="bud-stop-value">
                    {formatMoney(category.cost, budget.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}