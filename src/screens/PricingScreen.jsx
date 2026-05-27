import { useState } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { isDemoMode } from "../services/supabaseClient";

const INDIVIDUAL_FEATURES = [
  "AI feedback on every session",
  "Practice tracking & streaks",
  "Full library access",
  "Progress history & XP",
];

const TEACHER_SINGLE = [
  { range: "1–10 students", price: "€5", unit: "per student / month" },
  { range: "10–20 students", price: "€60", unit: "/ month" },
  { range: "20–30 students", price: "€120", unit: "/ month" },
];

const TEACHER_MULTI = [
  { range: "30–40 students", price: "€200", unit: "/ month" },
  { range: "40–60 students", price: "€300", unit: "/ month" },
  { range: "60–80 students", price: "€400", unit: "/ month" },
  { range: "80–120 students", price: "€500", unit: "/ month" },
  { range: "120–300 students", price: "€600", unit: "/ month" },
];

function TierList({ title, tiers }) {
  return (
    <div className="pricing-tier-group">
      <h4>{title}</h4>
      <ul className="pricing-tier-list">
        {tiers.map((tier) => (
          <li key={tier.range} className="pricing-tier-row">
            <span>{tier.range}</span>
            <strong>
              {tier.price}
              <small>{tier.unit}</small>
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingScreen() {
  const [plan, setPlan] = useState("individual");
  const startFreeTrial = useNotaStore((s) => s.startFreeTrial);
  const continueAsGuest = useNotaStore((s) => s.continueAsGuest);
  const navigate = useNotaStore((s) => s.navigate);
  const pricingReturnRoute = useNotaStore((s) => s.pricingReturnRoute);

  const goBack = () => navigate(pricingReturnRoute || ROUTES.PROFILE);

  return (
    <main className="screen pricing-screen">
      <header className="pricing-hero">
        <button type="button" className="pricing-back link-btn" onClick={goBack}>
          ‹ Back
        </button>
        <h1>Choose your plan</h1>
        <p>Premium practice tools for learners and music classrooms.</p>
      </header>

      <div className="pricing-plan-tabs" role="tablist" aria-label="Plan type">
        <button
          type="button"
          role="tab"
          aria-selected={plan === "individual"}
          className={`pricing-plan-tab ${plan === "individual" ? "active" : ""}`}
          onClick={() => setPlan("individual")}
        >
          Individual
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={plan === "teacher"}
          className={`pricing-plan-tab ${plan === "teacher" ? "active" : ""}`}
          onClick={() => setPlan("teacher")}
        >
          Teacher / School
        </button>
      </div>

      {plan === "individual" ? (
        <article className="pricing-card pricing-card-featured glass-card">
          <p className="pricing-card-label">Individual plan</p>
          <div className="pricing-price-row">
            <span className="pricing-price">€5</span>
            <span className="pricing-period">/ month</span>
          </div>
          <p className="pricing-card-desc">For individual learners building a daily practice habit.</p>
          <ul className="pricing-features">
            {INDIVIDUAL_FEATURES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button type="button" className="primary pricing-cta" onClick={startFreeTrial}>
            Start free trial
          </button>
        </article>
      ) : (
        <article className="pricing-card pricing-card-teacher glass-card">
          <p className="pricing-card-label">For teachers and classes</p>
          <p className="pricing-card-desc">
            Manage students, track class progress, and share practice reports.
          </p>
          <TierList title="Single classes" tiers={TEACHER_SINGLE} />
          <TierList title="Multiple classes" tiers={TEACHER_MULTI} />
          <button type="button" className="primary pricing-cta" onClick={startFreeTrial}>
            Start free trial
          </button>
        </article>
      )}

      <div className="pricing-footer-actions">
        <button type="button" className="secondary" onClick={continueAsGuest}>
          Continue demo
        </button>
        {isDemoMode && (
          <p className="pricing-demo-note">Demo mode — no payment required. Full app stays available.</p>
        )}
      </div>
    </main>
  );
}
