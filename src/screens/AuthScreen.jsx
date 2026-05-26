import { useState } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { isDemoMode } from "../services/supabaseClient";

export default function AuthScreen({ mode = "login" }) {
  const login = useNotaStore((s) => s.login);
  const register = useNotaStore((s) => s.register);
  const navigate = useNotaStore((s) => s.navigate);
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
      <section className="hero small">
        <h1>
          {isLogin ? "Welcome to" : "Join"} <span>NOTA</span>
        </h1>
        <p>
          AI-powered music practice for focused daily progress.
          {isDemoMode ? " Running in demo mode — any email works." : ""}
        </p>
      </section>

      <form className="auth-form glass-card" onSubmit={handleSubmit}>
        {!isLogin && (
          <label>
            Display name
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isDemoMode ? "Any password in demo mode" : "At least 6 characters"}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Login" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        className="link-btn"
        onClick={() => navigate(isLogin ? ROUTES.AUTH_REGISTER : ROUTES.AUTH_LOGIN)}
      >
        {isLogin ? "New here? Register" : "Already have an account? Login"}
      </button>
    </main>
  );
}
