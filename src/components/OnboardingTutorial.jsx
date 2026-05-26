const STEPS = [
  "Choose Alto Saxophone to start your MVP journey.",
  "Pick a library track or upload your own sheet music.",
  "Review digitized notes, then practice with live feedback.",
  "Use the mic to start — pause anytime without losing your place.",
];

export default function OnboardingTutorial({ step, onNext, onSkip }) {
  return (
    <div className="onboarding-tip glass-card">
      <p className="exercise-label">Quick tip {step + 1}/{STEPS.length}</p>
      <p>{STEPS[step]}</p>
      <div className="practice-actions-row">
        <button type="button" className="secondary small-btn" onClick={onSkip}>
          Skip
        </button>
        <button type="button" className="primary small-btn" onClick={onNext}>
          {step >= STEPS.length - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
