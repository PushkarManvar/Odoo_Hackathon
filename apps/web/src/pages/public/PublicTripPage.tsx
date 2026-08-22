import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import "./PublicTripPage.css";

interface PublicStopItem {
  id: string;
  name: string;
  date: string;
  startTime: string;
  durationMins: number;
  cost: number;
  category: string;
}

interface PublicStop {
  id: string;
  sequenceOrder: number;
  arrivalDate: string;
  departureDate: string;
  city: { name: string; country: string; region: string };
  items: PublicStopItem[];
}

interface PublicTrip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  currency: string;
  owner: { name: string };
  stops: PublicStop[];
  budget: { estimatedTotal: number; currency: string };
}

const mockTrip: PublicTrip = {
  id: "trip-id",
  name: "Rajasthan Heritage Trip",
  description:
    "A 7 day journey through the golden forts, royal palaces, and living heritage of Rajasthan. Found the most incredible hidden gardens and peaceful escapes from the main tourist paths.",
  startDate: "2026-10-01",
  endDate: "2026-10-07",
  currency: "INR",
  owner: { name: "Nishant" },
  stops: [
    {
      id: "stop-1",
      sequenceOrder: 1,
      arrivalDate: "2026-10-01",
      departureDate: "2026-10-03",
      city: { name: "Jaipur", country: "India", region: "Rajasthan" },
      items: [
        {
          id: "item-1",
          name: "Amber Fort",
          date: "2026-10-01",
          startTime: "09:00",
          durationMins: 180,
          cost: 600,
          category: "SIGHTSEEING",
        },
        {
          id: "item-2",
          name: "City Palace",
          date: "2026-10-02",
          startTime: "10:30",
          durationMins: 150,
          cost: 500,
          category: "CULTURAL",
        },
      ],
    },
    {
      id: "stop-2",
      sequenceOrder: 2,
      arrivalDate: "2026-10-04",
      departureDate: "2026-10-05",
      city: { name: "Udaipur", country: "India", region: "Rajasthan" },
      items: [
        {
          id: "item-3",
          name: "Lake Pichola Boat Ride",
          date: "2026-10-04",
          startTime: "17:00",
          durationMins: 90,
          cost: 800,
          category: "LEISURE",
        },
      ],
    },
  ],
  budget: { estimatedTotal: 31000, currency: "INR" },
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function PublicTripPage() {
  return (
    <div className="pub-page">
      <nav className="pub-nav">
        <div className="pub-nav-inner">
          <a className="pub-brand" href="/">
            Globe Trotter
          </a>
          <div className="pub-nav-links">
            <a href="#">Destinations</a>
            <a href="#">Itineraries</a>
            <a href="#">Journal</a>
            <a className="is-active" href="#">
              Explore
            </a>
          </div>
          <div className="pub-nav-cta">
            <Button variant="outline" size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      <main className="pub-main">
        <header className="pub-header">
          <h1 className="pub-title">Community Tab</h1>
          <div className="pub-toolbar">
            <div className="pub-search">
              <Input
                placeholder="Search community..."
                aria-label="Search community"
              />
            </div>
            <div className="pub-filters">
              <Button variant="outline" size="sm">
                Group by &#9662;
              </Button>
              <Button variant="outline" size="sm">
                Filter &#9881;
              </Button>
              <Button variant="outline" size="sm">
                Sort by... &#8597;
              </Button>
            </div>
          </div>
        </header>

        <section className="pub-feed">
          <article className="pub-post">
            <div className="pub-avatar" aria-hidden="true">
              {mockTrip.owner.name.charAt(0)}
            </div>

            <Card className="pub-post-card">
              <div className="pub-post-header">
                <h3 className="pub-post-author">{mockTrip.owner.name}</h3>
                <p className="pub-post-location">
                  {mockTrip.stops.map((stop) => stop.city.name).join(", ")}{" "}
                  &middot; {mockTrip.stops[0]?.city.country}
                </p>
              </div>

              <div className="pub-post-hero" aria-hidden="true">
                {mockTrip.name}
              </div>

              <p className="pub-post-caption">{mockTrip.description}</p>

              <div className="pub-stops">
                {mockTrip.stops.map((stop) => (
                  <div className="pub-stop" key={stop.id}>
                    <div className="pub-stop-head">
                      <h4 className="pub-stop-title">
                        {stop.city.name}, {stop.city.region}
                      </h4>
                      <p className="pub-stop-dates">
                        {formatDate(stop.arrivalDate)} -{" "}
                        {formatDate(stop.departureDate)}
                      </p>
                    </div>
                    <ul className="pub-stop-items">
                      {stop.items.map((item) => (
                        <li className="pub-stop-item" key={item.id}>
                          <div>
                            <span className="pub-item-name">{item.name}</span>
                            <span className="pub-item-meta">
                              {formatDate(item.date)} &middot; {item.startTime}{" "}
                              &middot; {item.category}
                            </span>
                          </div>
                          <span className="pub-item-cost">
                            {mockTrip.currency} {item.cost}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="pub-post-footer">
                <span className="pub-budget">
                  Estimated total: {mockTrip.budget.currency}{" "}
                  {mockTrip.budget.estimatedTotal.toLocaleString()}
                </span>
                <div className="pub-actions">
                  <button className="pub-action" type="button">
                    &#9825; Like (124)
                  </button>
                  <button className="pub-action" type="button">
                    &#128172; Comment (12)
                  </button>
                  <button className="pub-action" type="button">
                    &#128190; Save
                  </button>
                </div>
              </div>
            </Card>
          </article>

          <div className="pub-load-more">
            <Button variant="primary" size="lg">
              Load More Journeys
            </Button>
          </div>
        </section>
      </main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <span className="pub-footer-brand">Globe Trotter</span>
          <div className="pub-footer-links">
            <a href="#">About Us</a>
            <a href="#">Support</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sustainability</a>
          </div>
          <span className="pub-footer-copy">
            &copy; 2024 Globe Trotter. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}