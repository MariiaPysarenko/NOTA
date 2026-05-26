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

  return (
    <section className="practice-v2-mic-zone">
      <p className="practice-v2-target">
        Target <strong>{targetNote}</strong>
      </p>
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
      {detectedNote && detectedNote !== "—" && (
        <p className={`practice-v2-live mic-live-${micState}`}>
          You play <strong>{detectedNote}</strong>
        </p>
      )}
    </section>
  );
}
