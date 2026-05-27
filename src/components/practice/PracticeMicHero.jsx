export default function PracticeMicHero({
  micState,
  isPracticing,
  targetNote,
  detectedNote,
  onPress,
}) {
  const label =
    micState === "detecting"
      ? "Detecting"
      : micState === "listening"
        ? "Listening"
        : micState === "paused"
          ? "Paused"
          : isPracticing
            ? "Finish"
            : "Start";

  const showDetected = detectedNote && detectedNote !== "—";

  return (
    <section className="practice-v2-mic-zone">
      <p className="practice-v2-target">
        Target <strong>{targetNote}</strong>
      </p>
      <div className="mic-hero-slot">
        <button
          type="button"
          className={`mic-hero mic-hero-${micState} ${isPracticing ? "is-active" : ""}`}
          onClick={onPress}
          aria-label={label}
        >
          <span className="mic-hero-ring" aria-hidden />
          <span className="mic-hero-ring mic-hero-ring-2" aria-hidden />
          <span className="mic-hero-icon" aria-hidden>
            🎤
          </span>
          <span className="mic-hero-label">{label}</span>
        </button>
      </div>
      <p className="practice-v2-live" aria-live="polite">
        <span className={showDetected ? "practice-v2-live-text" : "practice-v2-live-placeholder"}>
          {showDetected ? (
            <>
              You play <strong>{detectedNote}</strong>
            </>
          ) : (
            "\u00A0"
          )}
        </span>
      </p>
    </section>
  );
}
