import { useMemo, useState } from "react";
import { useApp } from "../store/useNotaStore";
import PracticeSheetPanel from "../components/practice/PracticeSheetPanel";
import PracticePitchPanel from "../components/practice/PracticePitchPanel";
import PracticeControls from "../components/practice/PracticeControls";
import GamificationBar from "../components/GamificationBar";
import FloatingMetronome from "../components/FloatingMetronome";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { useMetronome } from "../hooks/useMetronome";
import { getLiveCoachMessage } from "../utils/liveCoach";
import { ROUTES } from "../navigation/routes";

export default function PracticeScreen() {
  const {
    exercise,
    digitizedNotes,
    pieceMeta,
    annotationsBySheet,
    navigate,
    showToast,
    fullscreenSheet,
    setFullscreenSheet,
    metronomeBpm,
    setMetronomeBpm,
    metronomeRunning,
    setMetronomeRunning,
    recordPracticeSession,
    newAchievements,
  } = useApp();

  const [showMetro, setShowMetro] = useState(false);
  const pitch = usePitchDetector();
  const session = usePracticeSession({ pitch, exercise });
  const metro = useMetronome(metronomeBpm, metronomeRunning);

  const sheetAnnotations = annotationsBySheet[pieceMeta.id] || [];

  const activeNoteId = useMemo(() => {
    if (session.currentNoteIndex < 0) return null;
    const note = exercise.notes[session.currentNoteIndex];
    return note?.id ?? digitizedNotes[session.currentNoteIndex]?.id ?? null;
  }, [session.currentNoteIndex, exercise.notes, digitizedNotes]);

  const displayNote = session.phase === "practicing" ? pitch.detectedNote || "—" : "—";
  const targetNote = session.currentTarget ?? exercise.notes[0]?.writtenName ?? "—";
  const feedback = session.phase === "practicing" ? pitch.feedback : "gray";
  const progressRatio = session.totalMs ? session.elapsedMs / session.totalMs : 0;
  const accuracy =
    session.phase === "summary" && session.summary
      ? session.summary.accuracy
      : session.phase === "practicing"
        ? session.liveAccuracy
        : null;

  const coachLine = getLiveCoachMessage({
    liveFeedback: session.liveFeedback,
    currentMeasure: exercise.notes[session.currentNoteIndex]?.measure,
    difficultMeasures: session.difficultMeasures,
  });

  const completeSession = async (summary) => {
    const durationSeconds = Math.round(session.elapsedMs / 1000);
    const { newAchievements: earned } = await recordPracticeSession(summary, {
      durationSeconds,
      completedPiece: true,
    });
    if (earned?.length) showToast(`Achievement unlocked: ${earned[0].title}`);
  };

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

  const handleStop = async () => {
    const summary = session.finish();
    if (!summary) return;
    setMetronomeRunning(false);
    await completeSession(summary);
    showToast("Session complete");
    navigate(ROUTES.RESULT);
  };

  const toggleMetro = () => {
    setShowMetro((v) => !v);
    setMetronomeRunning(!metronomeRunning);
  };

  return (
    <main
      className={`screen practice-screen practice-screen-clean ${
        fullscreenSheet ? "sheet-fullscreen" : ""
      }`}
    >
      <GamificationBar />

      <section className="practice-header-minimal practice-top">
        <h2 className="text-clamp-1">{pieceMeta.title}</h2>
        <div className="practice-header-actions">
          <button
            type="button"
            className="secondary small-btn"
            onClick={() => setFullscreenSheet(!fullscreenSheet)}
          >
            {fullscreenSheet ? "Exit full" : "Full sheet"}
          </button>
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
        </div>
      </section>

      {coachLine && session.phase === "practicing" && (
        <p className="live-coach-line">{coachLine}</p>
      )}

      <PracticeSheetPanel
        notes={digitizedNotes}
        annotations={sheetAnnotations}
        activeNoteId={activeNoteId}
        difficultMeasures={session.difficultMeasures}
        progress={progressRatio}
        onEditNotes={() => navigate(ROUTES.REVIEW)}
      />

      <PracticePitchPanel
        feedback={feedback}
        liveFeedback={session.liveFeedback}
        detectedNote={displayNote}
        targetNote={targetNote}
        cents={pitch.cents}
        accuracy={accuracy}
      />

      <PracticeControls
        micState={pitch.micState}
        isPracticing={session.phase === "practicing"}
        onMicToggle={handleMicToggle}
        onPauseToggle={handlePauseToggle}
        onStop={handleStop}
        micError={pitch.error}
        hasMicrophone={pitch.hasMicrophone}
      />

      <div className="practice-toolbar">
        <button type="button" className="secondary small-btn" onClick={toggleMetro}>
          {showMetro ? "Hide metronome" : "Metronome"}
        </button>
        <button type="button" className="secondary small-btn" onClick={() => navigate(ROUTES.SHEET_EDITOR)}>
          Edit markings
        </button>
      </div>

      <FloatingMetronome
        visible={showMetro}
        bpm={metronomeBpm}
        setBpm={setMetronomeBpm}
        isRunning={metronomeRunning && metro.isRunning}
        onToggle={() => setMetronomeRunning(!metronomeRunning)}
      />

      {newAchievements?.length > 0 && session.phase !== "practicing" && (
        <p className="achievement-toast streak-pulse">
          {newAchievements[0].icon} {newAchievements[0].title} unlocked!
        </p>
      )}
    </main>
  );
}
