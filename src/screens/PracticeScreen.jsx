import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import AnnotationLayer from "../components/AnnotationLayer";
import GamificationBar from "../components/GamificationBar";
import FloatingMetronome from "../components/FloatingMetronome";
import AchievementBadge from "../components/AchievementBadge";
import { usePitchDetector } from "../hooks/usePitchDetector";
import { usePracticeSession } from "../hooks/usePracticeSession";
import { useMetronome } from "../hooks/useMetronome";
import { useNoteAutoplay } from "../hooks/useNoteAutoplay";
import { centsToTunerIndex, feedbackToTunerClass } from "../utils/musicNotes";
import { getLiveCoachMessage } from "../utils/liveCoach";
import { ROUTES } from "../navigation/routes";
import { ACHIEVEMENTS } from "../utils/gamification";

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
    gamification,
    streak,
    dailyMinutes,
    dailyGoalMinutes,
    recordSessionRewards,
    lastSessionXp,
    newAchievements,
    setNewAchievements,
    focusMode,
    setFocusMode,
    fullscreenSheet,
    setFullscreenSheet,
    fragmentRange,
    setFragmentRange,
  } = useApp();

  const [showMetronome, setShowMetronome] = useState(false);
  const [coachMsg, setCoachMsg] = useState("");
  const pitch = usePitchDetector();
  const metronome = useMetronome(100);
  const autoplay = useNoteAutoplay(digitizedNotes, metronome.bpm / 100);

  const practiceNotes = useMemo(() => {
    if (!fragmentRange) return digitizedNotes;
    const [start, end] = fragmentRange;
    return digitizedNotes.filter((n) => n.measure >= start && n.measure <= end);
  }, [digitizedNotes, fragmentRange]);

  const session = usePracticeSession({ pitch, exercise });
  const sheetAnnotations = annotationsBySheet[pieceMeta.id] || [];

  const activeNoteId = useMemo(() => {
    if (autoplay.isPlaying && autoplay.activeIndex >= 0) {
      return practiceNotes[autoplay.activeIndex]?.id ?? null;
    }
    if (session.currentNoteIndex < 0) return null;
    const note = exercise.notes[session.currentNoteIndex];
    return note?.id ?? practiceNotes[session.currentNoteIndex]?.id ?? null;
  }, [
    autoplay.isPlaying,
    autoplay.activeIndex,
    session.currentNoteIndex,
    exercise.notes,
    practiceNotes,
  ]);

  const currentMeasure =
    practiceNotes[session.currentNoteIndex]?.measure ??
    exercise.notes[session.currentNoteIndex]?.measure ??
    1;

  const displayNote =
    session.phase === "practicing"
      ? pitch.detectedNote || "—"
      : session.phase === "summary"
        ? "✓"
        : "—";

  const targetNote = session.currentTarget ?? exercise.notes[0]?.writtenName ?? "—";
  const targetConcert = session.currentConcertTarget ?? exercise.notes[0]?.concertName ?? "—";
  const feedback = session.phase === "practicing" ? pitch.feedback : "gray";
  const live = session.liveFeedback ?? "ready";
  const liveMeta = LIVE_FEEDBACK[live] ?? LIVE_FEEDBACK.ready;
  const micActive = pitch.isListening && pitch.detectedNote;

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

  useEffect(() => {
    const msg = getLiveCoachMessage({
      liveFeedback: live,
      currentMeasure,
      difficultMeasures: session.difficultMeasures,
    });
    if (msg) setCoachMsg(msg);
  }, [live, currentMeasure, session.difficultMeasures]);

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

  const repeatFragment = () => {
    const m = session.difficultMeasures[0] || currentMeasure;
    setFragmentRange([m, m]);
    session.reset();
    showToast(`Repeating measure ${m}`);
  };

  const openResult = () => {
    if (!session.summary) return;
    setPracticeSummary(session.summary);
    const payload = {
      accuracy: session.summary.accuracy,
      durationSeconds: Math.round(session.totalMs / 1000),
      notesPlayed: exercise.notes.length,
      completedPiece: session.summary.accuracy >= 60,
    };
    const { xp, unlocked } = recordSessionRewards(payload);
    setPracticeSessions((prev) => [
      ...prev,
      {
        id: `session-${Date.now()}`,
        ...payload,
        xp,
        mistakes: session.summary.wrongNotes.length + session.summary.missedNotes.length,
        longestPauseMs: session.summary.longestPauseMs,
        rhythmIssues: session.summary.timingIssues?.length ?? 0,
        instrument: selectedInstrument.name,
        title: pieceMeta.title,
        date: new Date().toISOString(),
        difficultMeasures: session.summary.difficultMeasures,
      },
    ]);
    if (unlocked.length) showToast(`Achievement unlocked: ${unlocked[0].title}`);
    else showToast(`+${xp} XP earned`);
    setActiveTab("progress");
    navigate(ROUTES.RESULT);
  };

  const formatMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);
  const progressRatio = session.totalMs ? session.elapsedMs / session.totalMs : 0;

  return (
    <main className={`screen practice-screen ${focusMode ? "focus-mode" : ""}`}>
      {!focusMode && (
        <GamificationBar
          totalXp={gamification.totalXp || 0}
          streak={streak.current}
          dailyMinutes={dailyMinutes}
          dailyGoal={dailyGoalMinutes}
        />
      )}

      {!focusMode && (
        <section className="practice-top">
          <h2>Practice Mode</h2>
          <span className={pitch.isListening ? "live active-live" : "live"}>
            ● {pitch.isListening ? "LIVE" : "READY"}
          </span>
        </section>
      )}

      {!focusMode && (
        <div className="practice-stats glass-card">
          <div>
            <b>{session.summary ? session.summary.accuracy : lastSessionXp || "—"}</b>
            <span>{session.summary ? "%" : "XP"}</span>
            <small>{session.summary ? "Accuracy" : "Last gain"}</small>
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
      )}

      <section
        className={`digital-sheet-card practice-sheet glass-card ${
          fullscreenSheet ? "sheet-fullscreen" : ""
        }`}
      >
        {!focusMode && <p className="exercise-label">Digital sheet music</p>}
        <div className="sheet-layer-wrap">
          <SheetMusicRenderer
            notes={practiceNotes}
            activeNoteId={activeNoteId}
            difficultMeasures={session.difficultMeasures}
            progress={progressRatio}
            width={fullscreenSheet ? 360 : 330}
            height={fullscreenSheet ? 200 : 130}
          />
          <AnnotationLayer annotations={sheetAnnotations} />
        </div>
        <div className="practice-actions-row">
          <button
            type="button"
            className="secondary small-btn"
            onClick={() => navigate(ROUTES.SHEET_EDITOR)}
          >
            Edit / Draw
          </button>
          <button
            type="button"
            className="secondary small-btn"
            onClick={() => setFullscreenSheet(!fullscreenSheet)}
          >
            {fullscreenSheet ? "Exit full" : "Fullscreen"}
          </button>
          <button
            type="button"
            className="secondary small-btn"
            onClick={() => setFocusMode(!focusMode)}
          >
            {focusMode ? "Exit focus" : "Focus"}
          </button>
          <button type="button" className="secondary small-btn" onClick={autoplay.toggle}>
            {autoplay.isPlaying ? "Stop demo" : "Autoplay demo"}
          </button>
        </div>
        {session.difficultMeasures.length > 0 && (
          <button type="button" className="secondary repeat-fragment-btn" onClick={repeatFragment}>
            Repeat this fragment (m.{session.difficultMeasures[0]})
          </button>
        )}
      </section>

      <section className={`pitch-card glass-card pitch-feedback-${feedback}`}>
        {coachMsg && <p className="coach-bubble">{coachMsg}</p>}
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

        {!focusMode && (
          <div className="practice-pitch-row">
            <p>
              Concert: <strong>{targetConcert}</strong>
            </p>
            <button
              type="button"
              className="inline-chip"
              onClick={() => setShowMetronome(!showMetronome)}
            >
              Metronome
            </button>
          </div>
        )}

        <button
          type="button"
          className={`mic-btn ${session.phase === "practicing" ? "recording" : ""} ${
            micActive ? "mic-glow" : ""
          }`}
          onClick={handleStartPractice}
          aria-label="Toggle microphone"
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

      {newAchievements.map((id) => (
        <AchievementBadge key={id} achievement={ACHIEVEMENTS[id]} />
      ))}

      {session.phase === "summary" && session.summary && !focusMode && (
        <section className="summary-card glass-card">
          <h3>
            Session <span>Summary</span>
          </h3>
          <div className="summary-grid">
            <div className="summary-stat highlight">
              <b>{session.summary.accuracy}%</b>
              <span>Accuracy</span>
            </div>
            <div className="summary-stat">
              <b>+{lastSessionXp}</b>
              <span>XP</span>
            </div>
            <div className="summary-stat">
              <b>{session.summary.wrongNotes.length}</b>
              <span>Wrong</span>
            </div>
            <div className="summary-stat">
              <b>{formatMs(session.summary.longestPauseMs)}</b>
              <span>Pause</span>
            </div>
          </div>
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

      <FloatingMetronome
        visible={showMetronome}
        bpm={metronome.bpm}
        setBpm={metronome.setBpm}
        isRunning={metronome.isRunning}
        onToggle={metronome.toggle}
      />
    </main>
  );
}
