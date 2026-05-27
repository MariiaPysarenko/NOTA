import { useMemo, useRef, useEffect, useCallback, useState } from "react";
import { useApp } from "../store/useNotaStore";
import PracticeSheetHero from "../components/practice/PracticeSheetHero";
import PracticeMicHero from "../components/practice/PracticeMicHero";
import FloatingMetronome from "../components/FloatingMetronome";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { useMetronome } from "../hooks/useMetronome";
import { ROUTES } from "../navigation/routes";
import { levelFromXp } from "../utils/gamification";

export default function PracticeScreen() {
  const {
    exercise,
    digitizedNotes,
    pieceMeta,
    annotationsBySheet,
    sheetAssetsById,
    navigate,
    showToast,
    metronomeBpm,
    setMetronomeBpm,
    metronomeRunning,
    setMetronomeRunning,
    recordPracticeSession,
    finishPracticeNavigation,
    streak,
    gamification,
    retryMeasures,
    setRetryMeasures,
  } = useApp();

  const [showMetro, setShowMetro] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const finishingRef = useRef(false);
  const pitch = usePitchDetector();
  const session = usePracticeSession({ pitch, exercise });
  const metro = useMetronome(metronomeBpm, metronomeRunning && showMetro);

  const sheetAnnotations = annotationsBySheet[pieceMeta.id] || [];
  const sheetAsset = sheetAssetsById[pieceMeta.id] || null;

  const activeNoteId = useMemo(() => {
    if (session.phase !== "practicing" || session.currentNoteIndex < 0) return null;
    const note = exercise.notes[session.currentNoteIndex];
    return note?.id ?? digitizedNotes[session.currentNoteIndex]?.id ?? null;
  }, [session.phase, session.currentNoteIndex, exercise.notes, digitizedNotes]);

  const targetNote = session.currentTarget ?? exercise.notes[0]?.writtenName ?? "—";
  const displayNote = session.phase === "practicing" ? pitch.detectedNote || "—" : "—";
  const progressRatio = session.totalMs ? session.elapsedMs / session.totalMs : 0;
  const { level } = levelFromXp(gamification.totalXp || 0);

  const completeAndReview = useCallback(
    async (summary) => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      setMetronomeRunning(false);
      const durationSeconds = Math.max(1, Math.round(session.elapsedMs / 1000));
      await recordPracticeSession(summary, { durationSeconds, completedPiece: true });
      showToast("Session complete");
      finishPracticeNavigation();
    },
    [recordPracticeSession, finishPracticeNavigation, showToast, session.elapsedMs, setMetronomeRunning]
  );

  useEffect(() => {
    if (session.phase === "summary" && session.summary) {
      completeAndReview(session.summary);
    }
  }, [session.phase, session.summary, completeAndReview]);

  useEffect(() => {
    finishingRef.current = false;
  }, [pieceMeta.id]);

  useEffect(() => {
    if (retryMeasures?.length) {
      showToast(`Focus on measures ${retryMeasures.join(", ")}`);
    }
  }, [retryMeasures, showToast]);

  const handleMicPress = async () => {
    if (session.phase === "practicing") {
      const summary = session.finish();
      if (summary) await completeAndReview(summary);
      return;
    }
    finishingRef.current = false;
    const ok = await session.startPractice();
    if (!ok && pitch.error) showToast(pitch.error);
    else if (ok) showToast("Listening…");
  };

  const handlePause = () => {
    if (session.phase !== "practicing") return;
    if (pitch.isPaused) pitch.resume();
    else pitch.pause();
  };

  const toggleMetro = () => {
    setShowMetro((v) => {
      const next = !v;
      if (!next) setMetronomeRunning(false);
      return next;
    });
  };

  return (
    <main className="screen practice-v2">
      <header className="practice-v2-header">
        <h1 className="text-clamp-1">{pieceMeta.title}</h1>
        <button type="button" className="link-btn practice-change" onClick={() => navigate(ROUTES.TRACK_CHOICE)}>
          Change piece
        </button>
      </header>

      <PracticeSheetHero
        notes={digitizedNotes}
        sheetAsset={sheetAsset}
        annotations={sheetAnnotations}
        activeNoteId={activeNoteId}
        difficultMeasures={session.difficultMeasures}
        progress={progressRatio}
        showAnnotations={showAnnotations}
        autoScroll={session.phase === "practicing"}
        onChooseTrack={() => navigate(ROUTES.TRACK_CHOICE)}
      />

      <PracticeMicHero
        micState={pitch.micState}
        isPracticing={session.phase === "practicing"}
        targetNote={targetNote}
        detectedNote={displayNote}
        onPress={handleMicPress}
      />

      <footer className="practice-v2-stats">
        <span>🔥 {streak.current} streak</span>
        <span>Lv {level}</span>
        <span>{gamification.totalXp || 0} XP</span>
      </footer>

      <footer className="practice-v2-bottom">
        <button
          type="button"
          className="secondary practice-bottom-btn"
          onClick={() => setShowAnnotations((v) => !v)}
        >
          {showAnnotations ? "Hide notes" : "Show notes"}
        </button>
        <button type="button" className="secondary practice-bottom-btn" onClick={toggleMetro}>
          {showMetro ? "Hide metro" : "Metronome"}
        </button>
        <button
          type="button"
          className="secondary practice-bottom-btn"
          onClick={handlePause}
          disabled={session.phase !== "practicing"}
        >
          {pitch.isPaused ? "Resume" : "Pause"}
        </button>
      </footer>

      {pitch.error && (
        <p className="mic-error" role="alert">
          {pitch.error}
        </p>
      )}

      <FloatingMetronome
        visible={showMetro}
        bpm={metronomeBpm}
        setBpm={setMetronomeBpm}
        isRunning={metronomeRunning && metro.isRunning}
        onToggle={() => setMetronomeRunning(!metronomeRunning)}
      />
    </main>
  );
}
