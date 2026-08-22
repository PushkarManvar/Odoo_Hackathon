import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import "./ItineraryBuilderPage.css";

interface BuilderSection {
  id: string;
  title: string;
  description: string;
  dateRange: string;
  budget: string;
}

const initialSections: BuilderSection[] = [
  {
    id: "sec-1",
    title: "Section 1: Flight & Arrival",
    description:
      "All the necessary info in this section. This can be anything like travel details, hotel check-in, or initial activities upon arrival.",
    dateRange: "Oct 12 - Oct 14",
    budget: "$450.00",
  },
  {
    id: "sec-2",
    title: "Section 2: City Exploration",
    description:
      "All the necessary information about this section. Details regarding guided tours, museum visits, and local dining experiences.",
    dateRange: "Oct 15 - Oct 18",
    budget: "$600.00",
  },
  {
    id: "sec-3",
    title: "Section 3: Nature Retreat",
    description:
      "All the necessary information about this section. Activities related to hiking, wildlife spotting, and relaxation.",
    dateRange: "Oct 19 - Oct 22",
    budget: "$350.00",
  },
];

export function ItineraryBuilderPage() {
  const [sections, setSections] = useState<BuilderSection[]>(initialSections);

  const addSection = () => {
    setSections((current) => [
      ...current,
      {
        id: `sec-${current.length + 1}`,
        title: `Section ${current.length + 1}: New Section`,
        description:
          "All the necessary information about this section. Details regarding your planned activities.",
        dateRange: "TBD",
        budget: "$0.00",
      },
    ]);
  };

  return (
    <div className="itb-page">
      <header className="itb-header">
        <div className="itb-header-inner">
          <span className="itb-brand">Globe Trotter</span>
          <nav className="itb-nav">
            <a className="itb-nav-link" href="#">
              Dashboard
            </a>
            <a className="itb-nav-link" href="#">
              My Trips
            </a>
            <a className="itb-nav-link is-active" href="#">
              Create Trip
            </a>
            <a className="itb-nav-link" href="#">
              Discovery
            </a>
          </nav>
        </div>
      </header>

      <main className="itb-main">
        <div className="itb-title">
          <h1>Build Itinerary</h1>
          <p>Plan your trip section by section.</p>
        </div>

        <div className="itb-sections">
          {sections.map((section) => (
            <Card key={section.id} className="itb-section">
              <h2 className="itb-section-title">{section.title}</h2>
              <p className="itb-section-desc">{section.description}</p>
              <div className="itb-info-row">
                <div className="itb-info-tile">
                  <span className="itb-info-icon itb-info-icon--primary">
                    &#128197;
                  </span>
                  <div>
                    <span className="itb-info-label">Date Range</span>
                    <span className="itb-info-value">{section.dateRange}</span>
                  </div>
                </div>
                <div className="itb-info-tile">
                  <span className="itb-info-icon itb-info-icon--secondary">
                    &#165;
                  </span>
                  <div>
                    <span className="itb-info-label">Budget of this section</span>
                    <span className="itb-info-value">{section.budget}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <div className="itb-add">
            <Button variant="primary" size="lg" onClick={addSection}>
              <span aria-hidden="true">+</span> Add another Section
            </Button>
          </div>
        </div>
      </main>

      <footer className="itb-footer">
        <div className="itb-footer-inner">
          <span className="itb-footer-brand">Globe Trotter</span>
          <div className="itb-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Support</a>
          </div>
          <span className="itb-footer-copy">
            © 2024 Globe Trotter. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}