import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import "./ActivitySearchPage.css";

interface Activity {
  id: string;
  cityId: string;
  name: string;
  description: string;
  category: string;
  estimatedCost: number;
  durationMins: number;
}

const mockActivities: Activity[] = [
  {
    id: "activity-1",
    cityId: "city-manali",
    name: "Sunrise Paragliding Over Solang Valley",
    description:
      "Experience the thrill of soaring high above the stunning landscapes. Perfect for beginners and seasoned adventurers alike.",
    category: "Adventure",
    estimatedCost: 150,
    durationMins: 180,
  },
  {
    id: "activity-2",
    cityId: "city-goa",
    name: "Coastal Tandem Paragliding at Sunset",
    description:
      "A scenic tandem flight along the coast, offering unparalleled views of the ocean and dramatic cliffs at sunset.",
    category: "Scenic",
    estimatedCost: 180,
    durationMins: 120,
  },
  {
    id: "activity-3",
    cityId: "city-bir",
    name: "Paragliding Certification Course",
    description:
      "An intensive weekend course for those looking to get certified. Learn the ropes from experienced instructors in a safe environment.",
    category: "Course",
    estimatedCost: 450,
    durationMins: 1440,
  },
  {
    id: "activity-4",
    cityId: "city-rishikesh",
    name: "Gentle Family Glide over Rolling Hills",
    description:
      "A gentle, introductory flight perfect for families or those wanting a calm, floating experience over rolling hills.",
    category: "Relaxing",
    estimatedCost: 120,
    durationMins: 90,
  },
];

export function ActivitySearchPage() {
  const [query, setQuery] = useState("Paragliding");

  const filtered = mockActivities.filter((activity) =>
    activity.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="act-page">
      <nav className="act-nav">
        <div className="act-nav-inner">
          <div className="act-nav-left">
            <a className="act-brand" href="/">
              Globe Trotter
            </a>
            <div className="act-nav-links">
              <a className="is-active" href="#">
                Discover
              </a>
              <a href="#">My Trips</a>
              <a href="#">Plan</a>
              <a href="#">Community</a>
            </div>
          </div>
          <div className="act-nav-actions">
            <button type="button" aria-label="Notifications">
              &#128276;
            </button>
            <button type="button" aria-label="Favorites">
              &#9825;
            </button>
            <div className="act-avatar" aria-hidden="true" />
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
          <div className="act-filters">
            <Button variant="outline" size="sm">
              Group by &#9662;
            </Button>
            <Button variant="outline" size="sm">
              Filter &#9881;
            </Button>
            <Button variant="outline" size="sm">
              Sort by... &#8645;
            </Button>
          </div>
        </div>

        <h1 className="act-title">Results</h1>

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
                  <p className="act-card-desc">{activity.description}</p>
                  <div className="act-card-tags">
                    <Badge variant="secondary">{activity.category}</Badge>
                    <Badge variant="tertiary">
                      {activity.durationMins >= 60
                        ? `${Math.round(activity.durationMins / 60)}h`
                        : `${activity.durationMins}m`}
                    </Badge>
                  </div>
                </div>
                <div className="act-card-price">
                  <span className="act-price">${activity.estimatedCost}</span>
                  <Button variant="primary" size="sm">
                    Book Now
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>

      <nav className="act-mobile-nav">
        <a href="#">Home</a>
        <a className="is-active" href="#">
          Search
        </a>
        <a href="#">Trips</a>
        <a href="#">Profile</a>
      </nav>
    </div>
  );
}