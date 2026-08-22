import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/index.js";
import { useAuth } from "../../context/AuthContext.js";
import { apiRequest } from "../../services/api.js";
import "./auth.css";

interface LoginResponse {
  user: { id: string; name: string; email: string };
  token: string;
}

const ILLUSTRATION_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCIAsTeYuuXtUk-kXt59t7s7yIuyIPREas3HtD9wlPlIOirwlwLAwWrK551sUIHpRBUgU4GR2t8pUBBSACHQ8kmK3BNtaaEd8lJMr9cK-hH4z9w8FMumYXVOcug7_q4wuGQlay-GATYRmbs_yp2Miso46JeEvcS3OFINti615OfLAIy_DyjtySPDpGSq4SF-qvhfysq3Er_SH1E-1pkZY-qjnq8P_jlENBjTwg4hJVDnHu6-rYI50OBCkPvNxS7rh8Wzkq_KeqjPQ9RrLg";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gt-auth">
      <div className="gt-auth-card">
        <div className="gt-auth-visual">
          <div className="gt-auth-frame" />
          <div className="gt-auth-dot gt-auth-dot--primary" />
          <div className="gt-auth-dot gt-auth-dot--tertiary" />
          <div className="gt-auth-visual-image">
            <img alt="Winter village illustration" src={ILLUSTRATION_URL} />
          </div>
        </div>

        <div className="gt-auth-form-panel">
          <h1 className="gt-auth-brand">Globe Trotter</h1>
          <div className="gt-auth-form-inner">
            <h2 className="gt-auth-title">Welcome back</h2>
            <p className="gt-auth-subtitle">
              Continue your journey of mindful exploration.
            </p>

            {error ? <div className="gt-auth-error">{error}</div> : null}

            <form className="gt-auth-form" onSubmit={onLogin}>
              <div className="gt-field-float">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="email">Email address</label>
              </div>

              <div className="gt-field-float">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  className="gt-input-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="gt-auth-links">
                <a className="gt-auth-link" href="#">
                  Forgot Password?
                </a>
              </div>

              <Button type="submit" variant="primary" size="lg" full disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="gt-auth-divider">
              <div className="gt-auth-divider-line" />
              <div className="gt-auth-divider-label">
                <span>Or continue with</span>
              </div>
            </div>

            <div className="gt-auth-social">
              <button type="button">Google</button>
              <button type="button">Apple</button>
            </div>

            <p className="gt-auth-switch">
              Don't have an account?
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}