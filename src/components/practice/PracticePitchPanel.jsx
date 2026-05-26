import { centsToTunerIndex, feedbackToTunerClass } from "../../utils/musicNotes";

const FEEDBACK_LABEL = {
  correct: "CORRECT",
  wrong: "ADJUST PITCH",
  pause: "KEEP GOING",
  rhythm: "CHECK RHYTHM",
  silent: "PLAY NOTE",
  ready: "READY",
};

export default function PracticePitchPanel({
  feedback,
  liveFeedback,
  detectedNote,
  targetNote,
  cents,
  accuracy,
}) {
  const label = FEEDBACK_LABEL[liveFeedback] || FEEDBACK_LABEL.ready;
  const labelClass =
    feedback === "green"
      ? "green"
      : feedback === "red"
        ? "red"
        : feedback === "orange"
          ? "orange-label"
          : "gray-label";

  const tunerBars = Array.from({ length: 24 }).map((_, i) => {
    const center = centsToTunerIndex(cents);
    const scaled = Math.round((center / 41) * 23);
    const dist = Math.abs(i - scaled);
    if (dist <= 2) return feedbackToTunerClass(feedback);
    if (dist <= 4) return feedback === "green" ? "good" : feedback === "orange" ? "close" : "bad";
    return "bad";
  });

  return (
    <section className={`pitch-card glass-card pitch-feedback-${feedback} pitch-card-minimal`}>
      <div className="accuracy-row">
        <span className="accuracy-label">Accuracy</span>
        <b className="accuracy-value">{accuracy != null ? `${accuracy}%` : "—"}</b>
      </div>

      <p className={`live-feedback-label ${labelClass}`}>{label}</p>

      <div className="tuner tuner-compact">
        {tunerBars.map((cls, i) => (
          <span key={i} className={cls} />
        ))}
        <div
          className="tuner-line"
          style={{
            left: `${(centsToTunerIndex(cents) / 41) * 100}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>

      <div className="dual-notes dual-notes-compact">
        <div className="detected-note">
          <h1 className={`note-display note-${feedback}`}>{detectedNote}</h1>
          <p>YOU PLAY</p>
        </div>
        <div className="target-note">
          <h1>{targetNote}</h1>
          <p>TARGET</p>
        </div>
      </div>
    </section>
  );
}
