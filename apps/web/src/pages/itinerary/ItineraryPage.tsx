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
  items: ItineraryItem[];
  expenses: { label: string; amount: number }[];
}

const mockDays: ItineraryDay[] = [
  {
    day: 1,
    label: "Day 1",
    items: [
      {
        id: "item-1-1",
        tripStopId: "stop-kyoto",
        activityId: "act-fushimi",
        customName: null,
        customCost: null,
        date: "2026-10-01",
        startTime: "08:00",
        durationMins: 180,
        sequenceOrder: 1,
        notes:
          "Hike through thousands of vermilion torii gates winding up the sacred Mount Inari. Go early to beat the crowds.",
        activity: {
          id: "act-fushimi",
          name: "Fushimi Inari Shrine",
          category: "Cultural",
          estimatedCost: 0,
          durationMins: 180,
        },
      },
      {
        id: "item-1-2",
        tripStopId: "stop-kyoto",
        activityId: null,
        customName: "Lunch at Nishiki Market",
        customCost: 3500,
        date: "2026-10-01",
        startTime: "12:00",
        durationMins: 90,
        sequenceOrder: 2,
        notes:
          "Explore \"Kyoto's Kitchen\" and sample various local street foods, matcha sweets, and fresh seafood.",
        activity: null,
      },
      {
        id: "item-1-3",
        tripStopId: "stop-kyoto",
        activityId: "act-kiyomizu",
        customName: null,
        customCost: null,
        date: "2026-10-01",
        startTime: "14:30",
        durationMins: 150,
        sequenceOrder: 3,
        notes:
          "Visit this historic wooden temple offering stunning views of the city. Walk up through the atmospheric Higashiyama district.",
        activity: {
          id: "act-kiyomizu",
          name: "Kiyomizu-dera Temple",
          category: "Cultural",
          estimatedCost: 400,
          durationMins: 150,
        },
      },
    ],
    expenses: [
      { label: "Train fare", amount: 240 },
      { label: "Street Food", amount: 3500 },
      { label: "Entrance Fee", amount: 400 },
    ],
  },
  {
    day: 2,
    label: "Day 2",
    items: [
      {
        id: "item-2-1",
        tripStopId: "stop-kyoto",
        activityId: "act-bamboo",
        customName: null,
        customCost: null,
        date: "2026-10-02",
        startTime: "07:00",
        durationMins: 150,
        sequenceOrder: 1,
        notes:
          "Walk through the towering bamboo stalks. A peaceful experience if you arrive before the tour buses.",
        activity: {
          id: "act-bamboo",
          name: "Arashiyama Bamboo Grove",
          category: "Nature",
          estimatedCost: 0,
          durationMins: 150,
        },
      },
      {
        id: "item-2-2",
        tripStopId: "stop-kyoto",
        activityId: "act-kinkakuji",
        customName: null,
        customCost: null,
        date: "2026-10-02",
        startTime: "10:30",
        durationMins: 120,
        sequenceOrder: 2,
        notes:
          "Marvel at the Zen Buddhist temple completely covered in gold leaf, reflecting beautifully in the pond.",
        activity: {
          id: "act-kinkakuji",
          name: "Kinkaku-ji (Golden Pavilion)",
          category: "Cultural",
          estimatedCost: 500,
          durationMins: 120,
        },
      },
    ],
    expenses: [
      { label: "Bus fare", amount: 500 },
      { label: "Entrance Fee", amount: 500 },
    ],
  },
];

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

export function ItineraryPage() {
  return (
    <div className="itinerary-page">
      <header className="it-header">
        <div className="it-header-inner">
          <span className="it-brand">Globe Trotter</span>
          <nav className="it-nav">
            <a className="it-nav-link is-active" href="#">
              Itineraries
            </a>
            <a className="it-nav-link" href="#">
              Discover
            </a>
            <a className="it-nav-link" href="#">
              Budget
            </a>
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
            <button className="it-btn it-btn--group" type="button">
              <span className="it-icon">▤</span> Group by
            </button>
            <button className="it-btn it-btn--filter" type="button">
              <span className="it-icon">◫</span> Filter
            </button>
            <button className="it-btn it-btn--sort" type="button">
              <span className="it-icon">⇅</span> Sort by...
            </button>
          </div>
        </section>

        <section className="it-title">
          <h1>Itinerary for Kyoto, Japan</h1>
          <p>A mindful journey through ancient temples and vibrant culture.</p>
        </section>

        <section className="it-grid">
          <div className="it-columns">
            <div className="it-col-day">Day</div>
            <div className="it-col-activity">Physical Activity</div>
            <div className="it-col-expense">Expense</div>
          </div>

          {mockDays.map((day) => (
            <div className="it-day" key={day.day}>
              <div className="it-day-marker-col">
                <div className="it-day-marker">{day.label}</div>
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
                    <span className="it-expense-value">¥ {expense.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <nav className="it-mobile-nav">
        <a className="it-mobile-link is-active" href="#">
          <span className="it-icon">🗺</span>
          <span>Plan</span>
        </a>
        <a className="it-mobile-link" href="#">
          <span className="it-icon">⌖</span>
          <span>Explore</span>
        </a>
        <a className="it-mobile-link" href="#">
          <span className="it-icon">₩</span>
          <span>Wallet</span>
        </a>
        <a className="it-mobile-link" href="#">
          <span className="it-icon">●</span>
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}