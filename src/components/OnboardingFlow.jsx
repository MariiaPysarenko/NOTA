import { useState } from "react";

const SLIDES = [
  {
    icon: "🎼",
    title: "AI music practice",
    text: "NOTA turns sheet music into a focused practice session with intelligent feedback.",
  },
  {
    icon: "📄",
    title: "Upload sheet music",
    text: "Import PNG, JPG, or PDF — we digitize your score into playable notes.",
  },
  {
    icon: "🎤",
    title: "Real-time microphone analysis",
    text: "Play into your mic and hear how each note matches the target pitch.",
  },
  {
    icon: "⚡",
    title: "Instant feedback",
    text: "See accuracy, rhythm, and difficult measures the moment you finish.",
  },
  {
    icon: "📈",
    title: "Track your progress",
    text: "Earn XP, build streaks, and unlock achievements as you improve.",
  },
];

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const isLast = step >= SLIDES.length - 1;

  return (
    <div className="onboarding-flow">
      <div className="onboarding-flow-card glass-card">
        <p className="onboarding-brand">
          NOT<span>A</span>
        </p>
        <div className="onboarding-flow-icon">{slide.icon}</div>
        <h2>{slide.title}</h2>
        <p className="onboarding-flow-text">{slide.text}</p>
        <div className="intro-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={i === step ? "active" : ""} />
          ))}
        </div>
        <div className={`onboarding-flow-actions ${step === 0 ? "single" : ""}`}>
          {step > 0 && (
            <button type="button" className="secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={() => {
              if (isLast) onComplete();
              else setStep((s) => s + 1);
            }}
          >
            {isLast ? "Get started" : "Next"}
          </button>
        </div>
        {!isLast && (
          <button type="button" className="link-btn" onClick={onComplete}>
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
