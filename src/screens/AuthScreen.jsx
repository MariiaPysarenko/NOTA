import { useState } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { isDemoMode } from "../services/supabaseClient";

export default function AuthScreen({ mode = "login" }) {
  const login = useNotaStore((s) => s.login);
  const register = useNotaStore((s) => s.register);
  const navigate = useNotaStore((s) => s.navigate);
  const authReturnRoute = useNotaStore((s) => s.authReturnRoute);
  const showToast = useNotaStore((s) => s.showToast);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Enter your email");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) await login({ email: email.trim(), password });
      else await register({ email: email.trim(), password, displayName: displayName.trim() });
      showToast(isLogin ? "Welcome back" : "Account created");
    } catch (err) {
      showToast(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="screen auth-screen">
      <div className="auth-screen-inner" key={mode}>
        {authReturnRoute && (
          <button
            type="button"
            className="auth-back link-btn"
            onClick={() => navigate(authReturnRoute)}
          >
            ‹ Back
          </button>
        )}
        <header className="auth-hero">
          <p className="auth-brand">
            NOT<span>A</span>
          </p>
          <h1 className="auth-title">{isLogin ? "Welcome back" : "Join the practice"}</h1>
          <p className="auth-tagline">
            AI-powered music practice for focused daily progress.
          </p>
          {isDemoMode && (
            <span className="auth-demo-pill">Demo mode — any email works</span>
          )}
        </header>

        <div className="auth-mode-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            className={`auth-mode-tab ${isLogin ? "active" : ""}`}
            onClick={() => navigate(ROUTES.AUTH_LOGIN)}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            className={`auth-mode-tab ${!isLogin ? "active" : ""}`}
            onClick={() => navigate(ROUTES.AUTH_REGISTER)}
          >
            Register
          </button>
        </div>

        <form className="auth-form auth-form-card" onSubmit={handleSubmit}>
          {!isLogin && (
            <label className="auth-field">
              <span className="auth-field-label">Display name</span>
              <input
                type="text"
                className="auth-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          )}
          <label className="auth-field">
            <span className="auth-field-label">Email</span>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="auth-field">
            <span className="auth-field-label">Password</span>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isDemoMode ? "Any password in demo" : "At least 6 characters"}
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </label>
          <button type="submit" className="primary auth-submit" disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
