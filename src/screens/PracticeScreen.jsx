import { useMemo } from "react";
import { useApp } from "../store/useNotaStore";
import PracticeSheetPanel from "../components/practice/PracticeSheetPanel";
import PracticePitchPanel from "../components/practice/PracticePitchPanel";
import PracticeControls from "../components/practice/PracticeControls";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { ROUTES } from "../navigation/routes";

export default function PracticeScreen() {
  const { exercise, digitizedNotes, pieceMeta, annotationsBySheet, navigate, showToast } =
    useApp();

  const pitch = usePitchDetector();
  const session = usePracticeSession({ pitch, exercise });
  const sheetAnnotations = annotationsBySheet[pieceMeta.id] || [];

  const activeNoteId = useMemo(() => {
    if (session.currentNoteIndex < 0) return null;
    const note = exercise.notes[session.currentNoteIndex];
    return note?.id ?? digitizedNotes[session.currentNoteIndex]?.id ?? null;
  }, [session.currentNoteIndex, exercise.notes, digitizedNotes]);

  const displayNote =
    session.phase === "practicing" ? pitch.detectedNote || "—" : "—";

  const targetNote = session.currentTarget ?? exercise.notes[0]?.writtenName ?? "—";
  const feedback = session.phase === "practicing" ? pitch.feedback : "gray";
  const progressRatio = session.totalMs ? session.elapsedMs / session.totalMs : 0;
  const accuracy =
    session.phase === "summary" && session.summary
      ? session.summary.accuracy
      : session.phase === "practicing"
        ? null
        : null;

  const handleMicToggle = async () => {
    if (session.phase === "practicing") {
      if (pitch.isPaused) pitch.resume();
      else pitch.pause();
      return;
    }
    if (session.phase === "summary") session.reset();
    const ok = await session.startPractice();
    if (!ok && pitch.error) showToast(pitch.error);
    else if (ok) showToast("Listening…");
  };

  const handlePauseToggle = () => {
    if (pitch.isPaused) pitch.resume();
    else pitch.pause();
  };

  const handleStop = () => {
    session.finish();
    showToast("Session complete");
  };

  return (
    <main className="screen practice-screen practice-screen-clean">
      <section className="practice-header-minimal">
        <h2>{pieceMeta.title}</h2>
        <span
          className={
            pitch.micState === "detecting"
              ? "live active-live"
              : pitch.micState === "listening"
                ? "live"
                : ""
          }
        >
          ● {pitch.micState.toUpperCase()}
        </span>
      </section>

      <PracticeSheetPanel
        notes={digitizedNotes}
        annotations={sheetAnnotations}
        activeNoteId={activeNoteId}
        difficultMeasures={session.difficultMeasures}
        progress={progressRatio}
        onEditNotes={() => navigate(ROUTES.LIBRARY)}
      />

      <PracticePitchPanel
        feedback={feedback}
        liveFeedback={session.liveFeedback}
        detectedNote={displayNote}
        targetNote={targetNote}
        cents={pitch.cents}
        accuracy={session.summary?.accuracy ?? accuracy}
      />

      <PracticeControls
        micState={pitch.micState}
        isPracticing={session.phase === "practicing"}
        onMicToggle={handleMicToggle}
        onPauseToggle={handlePauseToggle}
        onStop={handleStop}
        micError={pitch.error}
      />

      {session.phase === "summary" && session.summary && (
        <section className="summary-card glass-card summary-compact">
          <p className="summary-motivation">{session.summary.feedback}</p>
          <button type="button" className="primary" onClick={session.reset}>
            Practice again
          </button>
        </section>
      )}
    </main>
  );
}
