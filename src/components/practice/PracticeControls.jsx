export default function PracticeControls({
  micState,
  isPracticing,
  onMicToggle,
  onPauseToggle,
  onStop,
  micError,
}) {
  const micLabel = {
    idle: "Start",
    listening: "Listening",
    paused: "Paused",
    detecting: "Detecting",
  }[micState] || "Mic";

  return (
    <section className="practice-controls glass-card">
      {micError && (
        <p className="mic-error" role="alert">
          {micError}
        </p>
      )}

      <div className="practice-control-row">
        <button
          type="button"
          className={`mic-btn ${micState === "detecting" ? "mic-glow" : ""} ${
            isPracticing ? "recording" : ""
          }`}
          onClick={onMicToggle}
          aria-label="Microphone"
        >
          🎤
          <span>{micLabel}</span>
        </button>

        {isPracticing && (
          <>
            <button type="button" className="secondary control-btn" onClick={onPauseToggle}>
              {micState === "paused" ? "Resume" : "Pause"}
            </button>
            <button type="button" className="secondary control-btn" onClick={onStop}>
              Stop
            </button>
          </>
        )}
      </div>
    </section>
  );
}
