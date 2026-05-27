import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";

const BENEFITS = [
  { icon: "⚡", text: "Save your XP and level progress" },
  { icon: "🔥", text: "Keep your practice streak alive" },
  { icon: "🤖", text: "Store AI feedback from every session" },
  { icon: "📊", text: "Access your full practice history" },
];

export default function RegistrationPromptScreen() {
  const navigate = useNotaStore((s) => s.navigate);
  const openAuth = useNotaStore((s) => s.openAuth);
  const continueAsGuest = useNotaStore((s) => s.continueAsGuest);
  const openPricing = useNotaStore((s) => s.openPricing);

  return (
    <main className="screen registration-prompt-screen">
      <header className="registration-prompt-hero">
        <p className="registration-prompt-brand">
          NOT<span>A</span>
        </p>
        <h1>Create your account to save progress</h1>
        <p className="registration-prompt-tagline">
          Save your XP, streak, AI feedback, and practice history across devices.
        </p>
      </header>

      <ul className="registration-benefits">
        {BENEFITS.map((item) => (
          <li key={item.text} className="registration-benefit glass-card">
            <span aria-hidden>{item.icon}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>

      <div className="registration-prompt-actions">
        <button
          type="button"
          className="primary registration-cta"
          onClick={() => openAuth("register", ROUTES.REGISTRATION_PROMPT)}
        >
          Create account
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => openAuth("login", ROUTES.REGISTRATION_PROMPT)}
        >
          Sign in
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => openPricing(ROUTES.REGISTRATION_PROMPT)}
        >
          View plans & pricing
        </button>
        <button type="button" className="link-btn muted-link" onClick={continueAsGuest}>
          Continue with free trial
        </button>
      </div>
    </main>
  );
}
