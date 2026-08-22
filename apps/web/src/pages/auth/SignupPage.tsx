import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/index.js";
import { useAuth } from "../../context/AuthContext.js";
import { apiRequest } from "../../services/api.js";
import "./auth.css";

interface SignupResponse {
  user: { id: string; name: string; email: string };
  token: string;
}

export function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSignup = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const data = await apiRequest<SignupResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      login(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-auth-page">
      <header className="gt-auth-nav">
        <div className="gt-auth-nav-inner">
          <Link className="gt-auth-nav-brand" to="/login">
            Globe Trotter
          </Link>
        </div>
      </header>

      <main className="gt-auth-main">
        <div className="gt-auth-signup-card">
          <div className="gt-auth-signup-header">
            <h1 className="gt-auth-title">Create Your Profile</h1>
            <p className="gt-auth-subtitle">
              Join the community of mindful explorers.
            </p>
          </div>

          <div className="gt-auth-avatar">
            <div className="gt-auth-avatar-circle" title="Upload photo">
              <div className="gt-auth-avatar-main">
                <span>&#43;</span>
              </div>
              <div className="gt-auth-avatar-badge">
                <span>&#8593;</span>
              </div>
            </div>
            <span className="gt-auth-avatar-label">Upload Photo</span>
          </div>

          {error ? <div className="gt-auth-error">{error}</div> : null}

          <form className="gt-auth-signup-form" onSubmit={onSignup}>
            <div className="gt-auth-grid">
              <div className="gt-auth-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  className="gt-auth-input"
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="gt-auth-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  className="gt-auth-input"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="gt-auth-field">
                <label htmlFor="email">Email Address</label>
                <input
                  className="gt-auth-input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="gt-auth-field">
                <label htmlFor="password">Password</label>
                <input
                  className="gt-auth-input"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="gt-auth-submit">
              <Button type="submit" variant="primary" size="lg" full disabled={loading}>
                {loading ? "Creating account..." : "Register User"}
              </Button>
            </div>

            <p className="gt-auth-switch" style={{ marginTop: 8 }}>
              Already have an account?
              <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </main>

      <footer className="gt-auth-footer">
        <div className="gt-auth-footer-brand">Globe Trotter</div>
        <nav className="gt-auth-footer-nav">
          <a href="#">Support</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Destinations</a>
        </nav>
        <div className="gt-auth-footer-copy">
          &copy; 2024 Globe Trotter. Mindful Exploration.
        </div>
      </footer>
    </div>
  );
}