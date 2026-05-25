import { useMemo, useState } from "react";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { DEMO_EXERCISE } from "../utils/exercise";
import {
  centsToTunerIndex,
  feedbackToTunerClass,
} from "../utils/musicNotes";
import SheetMusicUpload from "./SheetMusicUpload";

/**
 * Live practice: mic pitch detection, timed exercise, summary, sheet upload.
 */
export default function PracticeScreen({ selected, showToast }) {
  const [exercise, setExercise] = useState(DEMO_EXERCISE);
  const pitch = usePitchDetector();
  const session = usePracticeSession({ pitch, exercise });

  const displayNote =
    session.phase === "practicing"
      ? pitch.detectedNote || "—"
      : session.phase === "summary"
        ? "✓"
        : "—";

  const targetNote = session.currentTarget ?? exercise.notes[0]?.name ?? "—";
  const feedback = session.phase === "practicing" ? pitch.feedback : "gray";

  const tunerBars = useMemo(() => {
    const center = centsToTunerIndex(pitch.cents);
    return Array.from({ length: 42 }).map((_, i) => {
      const dist = Math.abs(i - center);
      let cls = "bad";
      if (feedback === "gray") cls = dist > 20 ? "bad" : "bad";
      else if (dist <= 3) cls = feedbackToTunerClass(feedback);
      else if (dist <= 6) cls = feedback === "green" ? "good" : feedback === "orange" ? "close" : "bad";
      else cls = "bad";
      return cls;
    });
  }, [pitch.cents, feedback]);

  const feedbackLabel = {
    green: "IN TUNE",
    orange: "SLIGHTLY OFF",
    red: "WRONG NOTE",
    gray: "SILENCE",
  }[feedback];

  const noteRingClass = `note-display note-${feedback}`;

  const handleStartPractice = async () => {
    if (session.phase === "practicing") {
      session.finish();
      return;
    }
    if (session.phase === "summary") {
      session.reset();
    }
    await session.startPractice();
    if (pitch.error) showToast?.(pitch.error);
    else showToast?.("Listening — play each note!");
  };

  const handleUploadExercise = (ex) => {
    setExercise(ex);
    session.setExercise(ex);
    session.reset();
  };

  const formatMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

  return (
    <main className="screen practice-screen">
      <section className="practice-top">
        <h2>Practice Session</h2>
        <span className={pitch.isListening ? "live active-live" : "live"}>
          ● {pitch.isListening ? "LIVE" : "READY"}
        </span>
      </section>

      <div className="practice-stats">
        <div>
          <b>{session.summary ? session.summary.accuracy : "—"}</b>
          <span>{session.summary ? "%" : "PTS"}</span>
          <small>{session.summary ? "Accuracy" : "Score"}</small>
        </div>
        <div>
          <b>{session.barProgress}</b>
          <span>Notes</span>
        </div>
        <div>
          <b>{session.progress}%</b>
          <span>Progress</span>
        </div>
        <div>
          <b>{Math.ceil((session.totalMs - session.elapsedMs) / 1000)}s</b>
          <span>Left</span>
        </div>
      </div>

      <SheetMusicUpload
        onExerciseGenerated={handleUploadExercise}
        showToast={showToast}
      />

      <section className="piece-row">
        <div>
          <div className="instrument-image piece-icon">
            <img src={selected.image} alt="" />
          </div>
          <p>{selected.name}</p>
        </div>
        <div>
          <h4>{exercise.title}</h4>
          <span>{exercise.subtitle}</span>
        </div>
      </section>

      {/* Expected note sequence */}
      <section className="exercise-notes-card">
        <p className="exercise-label">Expected notes</p>
        <div className="exercise-note-chips">
          {exercise.notes.map((n, i) => (
            <span
              key={`${n.name}-${i}`}
              className={`note-chip ${
                session.phase === "practicing" &&
                session.currentTarget === n.name
                  ? "active"
                  : ""
              }`}
            >
              {n.name}
            </span>
          ))}
        </div>
      </section>

      <section className="sheet-music sheet-music-mini">
        <div className="staff">
          <span className="clef">𝄞</span>
          <span className="notes">
            {exercise.notes.map((n) => "♩").join(" ")}
          </span>
        </div>
        <div
          className={`playhead ${session.phase === "practicing" ? "playing" : ""}`}
          style={{
            left: `${20 + (session.progress / 100) * 60}%`,
          }}
        />
      </section>

      <section className={`pitch-card pitch-feedback-${feedback}`}>
        <div className="pitch-labels">
          <div className="red">
            TOO LOW
            <br />♭
          </div>
          <div className={feedback === "green" ? "green" : feedback === "orange" ? "orange-label" : feedback === "red" ? "red" : "gray-label"}>
            {feedbackLabel}
          </div>
          <div className="red">
            TOO HIGH
            <br />#
          </div>
        </div>

        <div className="tuner">
          {tunerBars.map((cls, i) => (
            <span key={i} className={cls} />
          ))}
          <div
            className="tuner-line"
            style={{
              left: `${(centsToTunerIndex(pitch.cents) / 41) * 100}%`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        <div className="dual-notes">
          <div className="detected-note">
            <h1 className={noteRingClass}>{displayNote}</h1>
            <p>YOU PLAY</p>
          </div>
          <div className="target-note">
            <h1>{targetNote}</h1>
            <p>TARGET</p>
          </div>
        </div>

        <button
          type="button"
          className={`start-practice-btn ${session.phase === "practicing" ? "stop" : "primary"}`}
          onClick={handleStartPractice}
          disabled={!!pitch.error && !pitch.isListening}
        >
          {session.phase === "practicing" ? "Stop & See Results" : "Start Practice"}
        </button>
      </section>

      {session.phase === "summary" && session.summary && (
        <section className="summary-card">
          <h3>
            Session <span>Summary</span>
          </h3>
          <div className="summary-grid">
            <div className="summary-stat highlight">
              <b>{session.summary.accuracy}%</b>
              <span>Accuracy</span>
            </div>
            <div className="summary-stat">
              <b>{session.summary.missedNotes.length}</b>
              <span>Missed</span>
            </div>
            <div className="summary-stat">
              <b>{session.summary.wrongNotes.length}</b>
              <span>Wrong</span>
            </div>
            <div className="summary-stat">
              <b>{formatMs(session.summary.longestPauseMs)}</b>
              <span>Longest pause</span>
            </div>
          </div>

          {session.summary.missedNotes.length > 0 && (
            <p className="summary-detail">
              <strong>Missed:</strong> {session.summary.missedNotes.join(", ") || "—"}
            </p>
          )}
          {session.summary.wrongNotes.length > 0 && (
            <p className="summary-detail">
              <strong>Wrong:</strong> {session.summary.wrongNotes.join("; ")}
            </p>
          )}
          {session.summary.unstableNotes?.length > 0 && (
            <p className="summary-detail">
              <strong>Unstable pitch:</strong> {session.summary.unstableNotes.join(", ")}
            </p>
          )}
          {session.summary.timingIssues?.length > 0 && (
            <p className="summary-detail">
              <strong>Early/late:</strong> {session.summary.timingIssues.join(", ")}
            </p>
          )}

          <p className="summary-motivation">{session.summary.feedback}</p>

          <button type="button" className="primary summary-retry" onClick={session.reset}>
            Practice Again
          </button>
        </section>
      )}

      <section className="goal-card">
        <div className="music-icon">♪</div>
        <div>
          <h4>Today&apos;s Goal</h4>
          <p>
            {exercise.notes.length} notes · ~
            {Math.round(session.totalMs / 1000)}s exercise
          </p>
          <div className="goal-line">
            <span style={{ width: `${session.progress}%` }} />
          </div>
        </div>
      </section>
    </main>
  );
}
