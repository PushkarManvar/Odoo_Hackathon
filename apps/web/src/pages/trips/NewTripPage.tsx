import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/index.js";
import { apiRequest } from "../../services/api.js";
import "./NewTripPage.css";

interface CreateTripResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const SUGGESTIONS = [
  {
    name: "Tate Modern Annex",
    desc: "Immerse yourself in contemporary installations housed in brutalist architecture.",
    tag: "Culture",
    meta: "2-3 Hours",
    tagClass: "",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpF5OvREYWYxjAY5EBCt7s8eCGiap2INaPVd0EjY2ZJ-gSgC4nTRS-SVHRMZiCHpsD9oo4hgOj5AcKFdTVKG-tJFXc1Z8NIbDIdnxbDwrJja2meo4n0NeRVV4UZlLonOWy5vC454kPO6yVujlWsFy1tcQaJDcBuNSI5Joq_RbS2G12NBQGu4mHXTyGgVuWcyXVqrxG_391Qm93HCy8XmDHBzLpSn2OEyF0mtBHXJ-dPSWMiiKS63bg",
  },
  {
    name: "Atelier Omakase",
    desc: "A mindful dining experience focusing on seasonal, locally sourced ingredients.",
    tag: "Culinary",
    meta: "Reservation Required",
    tagClass: "gt-newtrip-suggestion-tag--culinary",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwJr71YdKo7z4-g7bqK98BY-ksKDutbSoYo9KxuxnAqieReMiJZ63WnCaKVKS5s-GullCJXmmR-ElLuTNtICgqtfxkEdPkkIhJYonWvy7nJoruFSMb9rp9qsyIiJyZ2quHJy6UMSINwdiACQ5jC2rxOxVBbIS21RUItlYbwjfuJp262GZ7_QLf7FqbXkcjl5RhMIAq-YGwFq-OHVima6-4hxefc6hBc_CRBoozyDKrnVy66hL-zFiV",
  },
  {
    name: "Kyoto Botanical Gardens",
    desc: "Wander through meticulously curated landscapes designed for quiet contemplation.",
    tag: "Nature",
    meta: "Half Day",
    tagClass: "gt-newtrip-suggestion-tag--nature",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp_8CSJpP4tYdKTtZBBinfkooFAOBL7yE_hPVz4OK4VeU9SxKgaN38DvdD2jFRndOx_5nxLtc4Ryz059W7TQcP-yPlJ2R1dJaBiJt_TlsJPqkUcHU0J7ps0dAaZ_nAaQDql0Fmgq0rP5GCAQafJB6OPcdT_6CcTnqH0t2PQAyL4ZtncWvVLTfM1Z964IsdJb499lCREXTHAKvCIxCFi8CCnb0MzfeJEUcvikrhXeFqlscxYojf-DgK",
  },
];

const MOOD_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBAfaVPLxHXtKSApIOZD0Dhd3MZxuVmtZ1XXzZC_mkOTkZ02sC8fzZtFKN2qODbT-9ezEYs0dJidiuDEFxDd3k4kZI-nnUeV8iY69fVffoJBdJUScwyXiCcSAHrh5AmjkjpP2XVXCBbxJrJcOWOQ1t6i5gCc3hzWGhyCHliQ-t5cGpzgNoChSahMLqk8zrZpWqw3Asl3BVnRVy8YD1AcX79DrR8B-7YXx6K5FynwJ7sctS4_gjd3Lay";

export function NewTripPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onCreateTrip = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const plannedBudget = budget.trim() ? Number(budget) : null;
    if (plannedBudget !== null && Number.isNaN(plannedBudget)) {
      setError("Budget must be a number");
      return;
    }

    setLoading(true);
    try {
      const trip = await apiRequest<CreateTripResponse>("/trips", {
        method: "POST",
        body: JSON.stringify({
          name,
          startDate,
          endDate,
          plannedBudget,
          currency: "INR",
        }),
      });
      navigate(`/trips/${trip.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-newtrip">
      <header className="gt-newtrip-header">
        <div className="gt-newtrip-header-inner">
          <Link className="gt-newtrip-brand" to="/dashboard">
            Globe Trotter
          </Link>
          <nav className="gt-newtrip-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/trips">My Trips</Link>
            <Link to="/trips">Discovery</Link>
          </nav>
        </div>
      </header>

      <main className="gt-newtrip-main">
        <section className="gt-newtrip-hero">
          <h1 className="gt-newtrip-title">Design Your Journey</h1>
          <p className="gt-newtrip-subtitle">
            Curate your perfect escape with mindful precision. Every detail
            considered, every moment savored.
          </p>
        </section>

        <section className="gt-newtrip-grid">
          <div className="gt-newtrip-form-card">
            <h2 className="gt-newtrip-form-title">Trip Details</h2>

            {error ? (
              <div className="gt-auth-error">{error}</div>
            ) : null}

            <form className="gt-newtrip-form" onSubmit={onCreateTrip}>
              <div className="gt-newtrip-field">
                <label className="gt-newtrip-label" htmlFor="destination">
                  Where to?
                </label>
                <div className="gt-newtrip-input-wrap">
                  <span className="gt-newtrip-input-icon">&#9673;</span>
                  <input
                    className="gt-newtrip-input"
                    id="destination"
                    placeholder="Select a Place (e.g., Kyoto, Japan)"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="gt-newtrip-input-grid">
                <div className="gt-newtrip-field">
                  <label className="gt-newtrip-label" htmlFor="start-date">
                    Start Date
                  </label>
                  <div className="gt-newtrip-input-wrap">
                    <span className="gt-newtrip-input-icon">&#128197;</span>
                    <input
                      className="gt-newtrip-input"
                      id="start-date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="gt-newtrip-field">
                  <label className="gt-newtrip-label" htmlFor="end-date">
                    End Date
                  </label>
                  <div className="gt-newtrip-input-wrap">
                    <span className="gt-newtrip-input-icon">&#128198;</span>
                    <input
                      className="gt-newtrip-input"
                      id="end-date"
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="gt-newtrip-field">
                <label className="gt-newtrip-label" htmlFor="budget">
                  Planned Budget (INR)
                </label>
                <div className="gt-newtrip-input-wrap">
                  <span className="gt-newtrip-input-icon">&#8377;</span>
                  <input
                    className="gt-newtrip-input"
                    id="budget"
                    placeholder="e.g., 100000"
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="gt-newtrip-form-actions">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Creating trip..." : "Create Trip"}
                </Button>
              </div>
            </form>
          </div>

          <div className="gt-newtrip-mood">
            <div className="gt-newtrip-mood-top">
              <span className="gt-newtrip-mood-chip">Inspiration</span>
              <h3 className="gt-newtrip-mood-title">Find your quiet place.</h3>
            </div>
            <div className="gt-newtrip-mood-img">
              <img alt="Serene landscape" src={MOOD_IMG} />
            </div>
          </div>
        </section>

        <section className="gt-newtrip-suggestions">
          <div className="gt-newtrip-suggestions-head">
            <h2 className="gt-newtrip-suggestions-title">
              Curated Suggestions
            </h2>
            <div className="gt-newtrip-carousel-btns">
              <button
                className="gt-newtrip-carousel-btn"
                type="button"
                aria-label="Previous"
              >
                &#8592;
              </button>
              <button
                className="gt-newtrip-carousel-btn"
                type="button"
                aria-label="Next"
              >
                &#8594;
              </button>
            </div>
          </div>

          <div className="gt-newtrip-suggestions-grid">
            {SUGGESTIONS.map((suggestion) => (
              <article
                key={suggestion.name}
                className="gt-newtrip-suggestion"
              >
                <div className="gt-newtrip-suggestion-media">
                  <img alt={suggestion.name} src={suggestion.img} />
                  <span
                    className={`gt-newtrip-suggestion-tag ${suggestion.tagClass}`.trim()}
                  >
                    {suggestion.tag}
                  </span>
                </div>
                <div className="gt-newtrip-suggestion-body">
                  <div>
                    <h3 className="gt-newtrip-suggestion-name">
                      {suggestion.name}
                    </h3>
                    <p className="gt-newtrip-suggestion-desc">
                      {suggestion.desc}
                    </p>
                  </div>
                  <div className="gt-newtrip-suggestion-meta">
                    <span>&#9201;</span>
                    <span>{suggestion.meta}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="gt-newtrip-footer">
        <div className="gt-newtrip-footer-brand">Globe Trotter</div>
        <nav className="gt-newtrip-footer-nav">
          <a href="#">Support</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Destinations</a>
        </nav>
        <div className="gt-newtrip-footer-copy">
          &copy; 2024 Globe Trotter. Mindful Exploration.
        </div>
      </footer>
    </div>
  );
}