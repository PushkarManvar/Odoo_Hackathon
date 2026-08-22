import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import "./DashboardPage.css";

const BAR_HEIGHTS = [64, 96, 40, 128, 80, 144, 112];
const BAR_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const BAR_CLASSES = [
  "gt-dash-bar--yellow",
  "gt-dash-bar--yellow",
  "gt-dash-bar--pink",
  "gt-dash-bar--yellow",
  "gt-dash-bar--yellow",
  "gt-dash-bar--yellow",
  "gt-dash-bar--black",
];

const NAV_CARDS = [
  {
    label: "Manage Users",
    icon: "👥",
    className: "gt-dash-navcard--yellow",
    to: "/profile",
  },
  {
    label: "Popular Cities",
    icon: "🏙",
    className: "",
    to: "/trips",
  },
  {
    label: "Popular Activities",
    icon: "🎟",
    className: "gt-dash-navcard--pink",
    to: "/trips",
  },
  {
    label: "User Trends",
    icon: "📈",
    className: "",
    to: "/trips",
  },
];

const STATS = [
  { label: "Total Users", value: "84,592", className: "" },
  { label: "New (24H)", value: "+1,204", className: "gt-dash-stat-value--green" },
  { label: "Active Trips", value: "12,450", className: "" },
  { label: "Server Load", value: "42%", className: "" },
];

const GUIDE_ITEMS = [
  {
    title: "Manage Users",
    dot: "gt-dash-guide-dot",
    text: "Access detailed user profiles, handle support tickets, and manage role assignments.",
  },
  {
    title: "Popular Cities",
    dot: "gt-dash-guide-dot gt-dash-guide-dot--yellow",
    text: "Update destination content, manage local partnerships, and monitor trending locations.",
  },
];

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="gt-dash">
      <header className="gt-dash-header">
        <div className="gt-dash-header-left">
          <h1 className="gt-dash-brand">GlobeTrotter</h1>
          <nav className="gt-dash-nav">
            <a href="#">Explore</a>
            <a href="#">Trips</a>
            <a href="#">Saved</a>
            <Link to="/profile">Profile</Link>
          </nav>
        </div>
        <div className="gt-dash-header-actions">
          <button className="gt-dash-icon-btn" type="button" aria-label="Search">
            &#128269;
          </button>
          <button
            className="gt-dash-icon-btn gt-dash-icon-btn--yellow"
            type="button"
            aria-label="Profile"
          >
            &#128100;
          </button>
        </div>
      </header>

      <main className="gt-dash-main">
        <div className="gt-dash-title-block">
          <h2 className="gt-dash-title">Admin Dashboard</h2>
          <p className="gt-dash-subtitle">
            {user ? `Welcome back, ${user.name}` : "System Overview & Analytics"}
          </p>
        </div>

        <div className="gt-dash-grid">
          <section className="gt-dash-main-col">
            <nav className="gt-dash-navcards">
              {NAV_CARDS.map((card) => (
                <Link
                  key={card.label}
                  to={card.to}
                  className={`gt-dash-navcard ${card.className}`.trim()}
                >
                  <span className="gt-dash-navcard-icon">{card.icon}</span>
                  <span>{card.label}</span>
                </Link>
              ))}
            </nav>

            <div className="gt-dash-analytics">
              <h3 className="gt-dash-analytics-title">System Analytics</h3>
              <div className="gt-dash-charts">
                <div className="gt-dash-chart-box">
                  <h4 className="gt-dash-chart-label">Active Sessions (7D)</h4>
                  <div className="gt-dash-bars">
                    {BAR_HEIGHTS.map((height, index) => (
                      <div
                        key={index}
                        className={`gt-dash-bar ${BAR_CLASSES[index]}`}
                        style={{ height: `${height}px` }}
                      >
                        <span>{BAR_DAYS[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gt-dash-chart-box">
                  <h4 className="gt-dash-chart-label">User Demographics</h4>
                  <div className="gt-dash-donut-wrap">
                    <svg className="gt-dash-donut" viewBox="0 0 100 100" width="144" height="144">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="var(--on-surface)"
                        strokeWidth="6"
                      />
                      <path
                        d="M50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50"
                        fill="none"
                        stroke="var(--gt-yellow)"
                        strokeWidth="15"
                      />
                      <path
                        d="M10,50 A40,40 0 0,1 50,10"
                        fill="none"
                        stroke="var(--gt-pink)"
                        strokeWidth="15"
                      />
                      <path
                        d="M90,50 A40,40 0 0,1 70,84"
                        fill="none"
                        stroke="var(--surface-container-lowest)"
                        strokeWidth="15"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="transparent"
                        stroke="var(--on-surface)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="25"
                        fill="var(--surface-container-lowest)"
                        stroke="var(--on-surface)"
                        strokeWidth="4"
                      />
                    </svg>
                    <div className="gt-dash-donut-center">
                      <span>142K</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gt-dash-stats">
                {STATS.map((stat) => (
                  <div key={stat.label}>
                    <h5 className="gt-dash-stat-label">{stat.label}</h5>
                    <p className={`gt-dash-stat-value ${stat.className}`.trim()}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="gt-dash-aside">
            <div className="gt-dash-guide">
              <h3 className="gt-dash-guide-title">
                <span>ℹ</span> Admin Guide
              </h3>
              <div className="gt-dash-guide-items">
                {GUIDE_ITEMS.map((item) => (
                  <div key={item.title} className="gt-dash-guide-item">
                    <h4 className="gt-dash-guide-item-title">
                      <span className={`gt-dash-guide-dot ${item.dot}`.trim()} />
                      {item.title}
                    </h4>
                    <p>{item.text}</p>
                  </div>
                ))}
                <div className="gt-dash-guide-item">
                  <h4 className="gt-dash-guide-item-title">
                    <span className="gt-dash-guide-dot gt-dash-guide-dot--white" />
                    System Alerts
                  </h4>
                  <ul className="gt-dash-alerts">
                    <li className="gt-dash-alerts--red">
                      <span>⚠</span> API Rate Limit near threshold
                    </li>
                    <li>
                      <span>↻</span> Backup completed successfully
                    </li>
                  </ul>
                </div>
              </div>
              <button className="gt-dash-report-btn" type="button">
                Generate Report
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}