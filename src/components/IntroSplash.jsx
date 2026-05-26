import { useEffect, useState } from "react";

const STEPS = [
  { icon: "🎷", title: "Pick your instrument", text: "Personalize practice for your instrument." },
  { icon: "📄", title: "Upload sheet music", text: "We digitize your score into playable notes." },
  { icon: "🔥", title: "Track your progress", text: "Earn XP, build streaks, and unlock achievements." },
];

export default function IntroSplash({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const current = STEPS[step];

  return (
    <div className="intro-overlay">
      <div className="intro-card glass-card">
        <p className="intro-brand">
          NOT<span>A</span>
        </p>
        <div className="intro-icon">{current.icon}</div>
        <h2>{current.title}</h2>
        <p>{current.text}</p>
        <div className="intro-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? "active" : ""} />
          ))}
        </div>
        <button type="button" className="primary" onClick={onDone}>
          Get Started
        </button>
      </div>
    </div>
  );
}
