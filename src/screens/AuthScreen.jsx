import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ROUTES } from "../navigation/routes";
import { login, register } from "../services/authService";

export default function AuthScreen({ mode = "login" }) {
  const { setUser, navigate, showToast, isDemoMode } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = isLogin
        ? await login({ email: form.email, password: form.password })
        : await register({
            name: form.name,
            email: form.email,
            password: form.password,
            selectedInstrument: "Alto Saxophone",
          });
      setUser(result.user);
      showToast(isLogin ? "Welcome back" : "Account created");
      navigate(ROUTES.INSTRUMENT);
    } catch (error) {
      showToast(error.message || "Authentication failed");
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
          {isDemoMode ? " Running in demo mode." : ""}
        </p>
      </section>

      <form className="auth-card" onSubmit={onSubmit}>
        {!isLogin && (
          <label>
            Name
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </label>
        )}
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          />
        </label>
        <label>
          Password
          <input
            required={!isDemoMode}
            minLength={6}
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            placeholder={isDemoMode ? "Any password in demo mode" : "At least 6 characters"}
          />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Create account"}
        </button>
      </form>

      <button
        type="button"
        className="secondary auth-switch"
        onClick={() => navigate(isLogin ? ROUTES.AUTH_REGISTER : ROUTES.AUTH_LOGIN)}
      >
        {isLogin ? "New here? Register" : "Already have an account? Login"}
      </button>
    </main>
  );
}
