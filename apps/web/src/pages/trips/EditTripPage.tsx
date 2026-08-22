import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { tripsApi } from "../../services/client.js";
import type { TripDetail } from "../../services/types.js";
import "./EditTripPage.css";

export function EditTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [plannedBudget, setPlannedBudget] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [stayCost, setStayCost] = useState("");
  const [mealCost, setMealCost] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) {
      return;
    }
    let cancelled = false;
    tripsApi
      .get(tripId)
      .then((trip: TripDetail) => {
        if (cancelled) {
          return;
        }
        setName(trip.name);
        setDescription(trip.description ?? "");
        setStartDate(trip.startDate);
        setEndDate(trip.endDate);
        setPlannedBudget(
          trip.plannedBudget === null ? "" : String(trip.plannedBudget)
        );
        setTransportCost(String(trip.transportCost ?? 0));
        setStayCost(String(trip.stayCost ?? 0));
        setMealCost(String(trip.mealCost ?? 0));
        setCurrency(trip.currency);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load trip");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!tripId) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await tripsApi.update(tripId, {
        name,
        description: description || null,
        startDate,
        endDate,
        plannedBudget: plannedBudget === "" ? null : Number(plannedBudget),
        transportCost: transportCost === "" ? 0 : Number(transportCost),
        stayCost: stayCost === "" ? 0 : Number(stayCost),
        mealCost: mealCost === "" ? 0 : Number(mealCost),
        currency,
      });
      navigate(`/trips/${tripId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-page">
      <header className="edit-header">
        <div className="edit-header-inner">
          <Link className="edit-brand" to="/dashboard">
            Globe Trotter
          </Link>
          <nav className="edit-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            {tripId ? <Link to={`/trips/${tripId}`}>Trip</Link> : null}
          </nav>
        </div>
      </header>

      <main className="edit-main">
        <div className="edit-title">
          <h1>Edit Trip</h1>
          <p>Update trip details, dates, and budget.</p>
        </div>

        {error ? <div className="edit-error">{error}</div> : null}

        {loading ? (
          <div className="edit-state">Loading...</div>
        ) : (
          <form className="edit-form" onSubmit={onSave}>
            <label className="edit-field">
              <span className="edit-label">Trip name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Trip name"
              />
            </label>

            <label className="edit-field">
              <span className="edit-label">Description</span>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                aria-label="Description"
              />
            </label>

            <div className="edit-row">
              <label className="edit-field">
                <span className="edit-label">Start date</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  aria-label="Start date"
                />
              </label>
              <label className="edit-field">
                <span className="edit-label">End date</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  aria-label="End date"
                />
              </label>
            </div>

            <div className="edit-row">
              <label className="edit-field">
                <span className="edit-label">Planned budget</span>
                <Input
                  type="number"
                  min={0}
                  value={plannedBudget}
                  onChange={(e) => setPlannedBudget(e.target.value)}
                  aria-label="Planned budget"
                />
              </label>
              <label className="edit-field">
                <span className="edit-label">Currency</span>
                <Input
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  maxLength={10}
                  aria-label="Currency"
                />
              </label>
            </div>

            <div className="edit-row">
              <label className="edit-field">
                <span className="edit-label">Transport cost</span>
                <Input
                  type="number"
                  min={0}
                  value={transportCost}
                  onChange={(e) => setTransportCost(e.target.value)}
                  aria-label="Transport cost"
                />
              </label>
              <label className="edit-field">
                <span className="edit-label">Stay cost</span>
                <Input
                  type="number"
                  min={0}
                  value={stayCost}
                  onChange={(e) => setStayCost(e.target.value)}
                  aria-label="Stay cost"
                />
              </label>
              <label className="edit-field">
                <span className="edit-label">Meal cost</span>
                <Input
                  type="number"
                  min={0}
                  value={mealCost}
                  onChange={(e) => setMealCost(e.target.value)}
                  aria-label="Meal cost"
                />
              </label>
            </div>

            <div className="edit-actions">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Link to={tripId ? `/trips/${tripId}` : "/trips"}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}