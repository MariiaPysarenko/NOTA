import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import AnnotationLayer from "../components/AnnotationLayer";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import {
  centsToTunerIndex,
  feedbackToTunerClass,
} from "../utils/musicNotes";
import { ROUTES } from "../navigation/routes";

const LIVE_FEEDBACK = {
  correct: { label: "CORRECT NOTE", className: "green" },
  wrong: { label: "WRONG NOTE", className: "red" },
  pause: { label: "TOO LONG PAUSE", className: "gray-label" },
  rhythm: { label: "WRONG RHYTHM", className: "orange-label" },
  silent: { label: "PLAY A NOTE", className: "gray-label" },
  ready: { label: "READY", className: "gray-label" },
};

export default function PracticeScreen() {
  const {
    selectedInstrument,
    exercise,
    digitizedNotes,
    pieceMeta,
    showToast,
    navigate,
    setPracticeSummary,
    setPracticeSessions,
    annotationsBySheet,
    setActiveTab,
  } = useApp();
  const pitch = usePitchDetector();
  const session = usePracticeSession({ pitch, exercise });
  const sheetAnnotations = annotationsBySheet[pieceMeta.id] || [];

  const activeNoteId = useMemo(() => {
    if (session.currentNoteIndex < 0) return null;
    const note = exercise.notes[session.currentNoteIndex];
    return note?.id ?? digitizedNotes[session.currentNoteIndex]?.id ?? null;
  }, [session.currentNoteIndex, exercise.notes, digitizedNotes]);

  const displayNote =
    session.phase === "practicing" ? pitch.detectedNote || "—" : session.phase === "summary" ? "✓" : "—";

  const targetNote = session.currentTarget ?? exercise.notes[0]?.writtenName ?? "—";
  const targetConcert = session.currentConcertTarget ?? exercise.notes[0]?.concertName ?? "—";
  const feedback = session.phase === "practicing" ? pitch.feedback : "gray";
  const live = session.liveFeedback ?? "ready";
  const liveMeta = LIVE_FEEDBACK[live] ?? LIVE_FEEDBACK.ready;

  const tunerBars = useMemo(() => {
    const center = centsToTunerIndex(pitch.cents);
    return Array.from({ length: 42 }).map((_, i) => {
      const dist = Math.abs(i - center);
      if (dist <= 3) return feedbackToTunerClass(feedback);
      if (dist <= 6)
        return feedback === "green" ? "good" : feedback === "orange" ? "close" : "bad";
      return "bad";
    });
  }, [pitch.cents, feedback]);

  const handleStartPractice = async () => {
    if (session.phase === "practicing") {
      session.finish();
      return;
    }
    if (session.phase === "summary") session.reset();
    await session.startPractice();
    if (pitch.error) showToast(pitch.error);
    else showToast("Listening — play each note!");
  };

  const formatMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

  const tempoValue = 100;

  const openResult = () => {
    if (!session.summary) return;
    setPracticeSummary(session.summary);
    setPracticeSessions((prev) => [
      ...prev,
      {
        id: `session-${Date.now()}`,
        accuracy: session.summary.accuracy,
        durationSeconds: Math.round(session.totalMs / 1000),
        notesPlayed: exercise.notes.length,
        mistakes: session.summary.wrongNotes.length + session.summary.missedNotes.length,
        longestPauseMs: session.summary.longestPauseMs,
        rhythmIssues: session.summary.timingIssues?.length ?? 0,
        instrument: selectedInstrument.name,
        date: new Date().toISOString(),
      },
    ]);
    setActiveTab("progress");
    navigate(ROUTES.RESULT);
  };

  return (
    <main className="screen practice-screen">
      <section className="practice-top">
        <h2>Practice Mode</h2>
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

      <section className="piece-row">
        <div>
          <div className="instrument-image piece-icon">
            <img src={selectedInstrument.image} alt="" />
          </div>
          <p>{selectedInstrument.name}</p>
        </div>
        <div>
          <h4>{pieceMeta.title}</h4>
          <span>{pieceMeta.subtitle}</span>
        </div>
      </section>

      <section className="digital-sheet-card practice-sheet">
        <p className="exercise-label">Digital sheet music</p>
        <div className="sheet-layer-wrap">
          <SheetMusicRenderer
            notes={digitizedNotes}
            activeNoteId={activeNoteId}
            width={330}
            height={130}
          />
          <AnnotationLayer annotations={sheetAnnotations} />
        </div>
        <div className="practice-actions-row">
          <button type="button" className="secondary small-btn" onClick={() => navigate(ROUTES.SHEET_EDITOR)}>
            Edit / Draw
          </button>
          <button
            type="button"
            className="secondary small-btn"
            onClick={() => navigate(ROUTES.REVIEW)}
          >
            Edit Notes
          </button>
        </div>
      </section>

      <section className={`pitch-card pitch-feedback-${feedback}`}>
        <div className="pitch-labels">
          <div className="red">
            TOO LOW
            <br />♭
          </div>
          <div className={liveMeta.className}>{liveMeta.label}</div>
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
            <h1 className={`note-display note-${feedback}`}>{displayNote}</h1>
            <p>YOU PLAY</p>
          </div>
          <div className="target-note">
            <h1>{targetNote}</h1>
            <p>WRITTEN TARGET</p>
          </div>
        </div>
        <div className="practice-pitch-row">
          <p>
            Concert pitch target: <strong>{targetConcert}</strong>
          </p>
          <p>
            Instrument: <strong>{selectedInstrument.name}</strong>
          </p>
        </div>

        <section className="player-card">
          <button type="button" className="play-btn">▶</button>
          <button type="button" className="pause-btn">❚❚</button>
          <div className="tempo">
            <p>Tempo</p>
            <b>{tempoValue} BPM</b>
            <input type="range" min="50" max="150" defaultValue={tempoValue} readOnly />
          </div>
          <button type="button" className="loop-btn">↺</button>
          <div className="waveform">
            <span>Now</span>
            <div className={session.phase === "practicing" ? "wave-active" : ""} />
            <span>{Math.ceil(session.elapsedMs / 1000)}s</span>
          </div>
        </section>

        <button
          type="button"
          className={`mic-btn ${session.phase === "practicing" ? "recording" : ""}`}
          onClick={handleStartPractice}
          aria-label="Toggle microphone listening"
        >
          🎤
        </button>

        <button
          type="button"
          className={`start-practice-btn ${session.phase === "practicing" ? "stop" : ""}`}
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
              <strong>Missed:</strong> {session.summary.missedNotes.join(", ")}
            </p>
          )}
          {session.summary.wrongNotes.length > 0 && (
            <p className="summary-detail">
              <strong>Wrong:</strong> {session.summary.wrongNotes.join("; ")}
            </p>
          )}
          {session.summary.timingIssues?.length > 0 && (
            <p className="summary-detail">
              <strong>Rhythm:</strong> {session.summary.timingIssues.join(", ")}
            </p>
          )}

          <p className="summary-motivation">{session.summary.feedback}</p>
          <div className="buttons">
            <button type="button" className="primary summary-retry" onClick={session.reset}>
              Practice Again
            </button>
            <button type="button" className="secondary summary-retry" onClick={openResult}>
              Result / Analysis
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
