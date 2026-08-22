import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import "./ProfilePage.css";

interface TripCard {
  id: string;
  title: string;
  description: string;
  badge: string;
  action: string;
  color: string;
  grayscale?: boolean;
}

const plannedTrips: TripCard[] = [
  {
    id: "trip-munnar",
    title: "Munnar Retreat",
    description: "A quiet week exploring the tea gardens and misty hills.",
    badge: "Oct 2024",
    action: "View Itinerary",
    color: "var(--secondary-container)",
  },
  {
    id: "trip-tromso",
    title: "Tromsø Lights",
    description: "Chasing the aurora borealis and experiencing polar night.",
    badge: "Dec 2024",
    action: "View Itinerary",
    color: "var(--tertiary-container)",
  },
];

const previousTrips: TripCard[] = [
  {
    id: "trip-tuscany",
    title: "Tuscan Wander",
    description: "Two weeks of slow travel through rural Italy.",
    badge: "May 2023",
    action: "View Journal",
    color: "var(--secondary-container)",
    grayscale: true,
  },
  {
    id: "trip-canyon",
    title: "Canyonlands",
    description: "A stark, beautiful journey through the high desert.",
    badge: "Sep 2022",
    action: "View Journal",
    color: "var(--secondary-container)",
    grayscale: true,
  },
];

function TripCardView({
  trip,
  headingColor,
}: {
  trip: TripCard;
  headingColor: string;
}) {
  return (
    <Card className="prof-trip-card" variant="tonal">
      <div
        className={`prof-trip-hero${trip.grayscale ? " prof-trip-hero--muted" : ""}`}
        style={{ background: trip.color }}
      >
        <span className="prof-trip-badge">{trip.badge}</span>
      </div>
      <div className="prof-trip-body">
        <div>
          <h3 className="prof-trip-title" style={{ color: headingColor }}>
            {trip.title}
          </h3>
          <p className="prof-trip-desc">{trip.description}</p>
        </div>
        <Button variant="outline" full>
          {trip.action}
        </Button>
      </div>
    </Card>
  );
}

export function ProfilePage() {
  return (
    <div className="prof-page">
      <nav className="prof-nav">
        <div className="prof-nav-inner">
          <span className="prof-brand">Globe Trotter</span>
          <div className="prof-nav-links">
            <a href="#">Dashboard</a>
            <a className="is-active" href="#">
              My Trips
            </a>
            <a href="#">Discovery</a>
          </div>
          <div className="prof-nav-cta">
            <Button variant="primary">Plan New Trip</Button>
          </div>
        </div>
      </nav>

      <main className="prof-main">
        <section className="prof-header">
          <div className="prof-avatar" aria-hidden="true">
            NS
          </div>
          <div className="prof-info">
            <div className="prof-info-top">
              <div>
                <h1 className="prof-name">Nithish S.</h1>
                <p className="prof-tagline">
                  Mindful Explorer | Minimalist Backpacker
                </p>
              </div>
              <Button variant="outline">
                <span aria-hidden="true">&#9998;</span> Edit Profile
              </Button>
            </div>
            <p className="prof-bio">
              Passionate about slow travel and sustainable exploration. I
              prefer train journeys over flights, and local homestays over
              grand hotels. Always looking for the next quiet corner of the
              world to sit and observe.
            </p>
          </div>
        </section>

        <section className="prof-section">
          <h2 className="prof-section-title">Preplanned Trips</h2>
          <div className="prof-grid">
            {plannedTrips.map((trip) => (
              <TripCardView
                key={trip.id}
                trip={trip}
                headingColor="var(--primary)"
              />
            ))}
          </div>
        </section>

        <section className="prof-section">
          <h2 className="prof-section-title">Previous Trips</h2>
          <div className="prof-grid">
            {previousTrips.map((trip) => (
              <TripCardView
                key={trip.id}
                trip={trip}
                headingColor="var(--on-surface)"
              />
            ))}
            <div className="prof-more">
              <span className="prof-more-icon" aria-hidden="true">
                &#128247;
              </span>
              <h3 className="prof-more-title">More Memories</h3>
              <Button variant="outline">View All Past Trips</Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="prof-footer">
        <div className="prof-footer-inner">
          <span className="prof-footer-brand">Globe Trotter</span>
          <div className="prof-footer-links">
            <a href="#">Support</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Destinations</a>
          </div>
          <span className="prof-footer-copy">
            &copy; 2024 Globe Trotter. Mindful Exploration.
          </span>
        </div>
      </footer>
    </div>
  );
}