export default function PracticeControls({
  micState,
  isPracticing,
  onMicToggle,
  onPauseToggle,
  onStop,
  micError,
  hasMicrophone = true,
}) {
  const micLabel = {
    idle: "Start",
    listening: "Listening",
    paused: "Paused",
    detecting: "Detecting",
  }[micState] || "Mic";

  const permissionDenied =
    micError &&
    (micError.toLowerCase().includes("denied") ||
      micError.toLowerCase().includes("not available") ||
      !hasMicrophone);

  return (
    <section className="practice-controls glass-card">
      {permissionDenied && (
        <div className="mic-permission-card" role="alert">
          <p>
            <strong>Microphone unavailable</strong>
          </p>
          <p>
            Allow microphone access in your browser settings, then tap Start again. You can still
            review sheet music without live pitch detection.
          </p>
        </div>
      )}

      {micError && !permissionDenied && (
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
          <span aria-hidden>🎤</span>
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
