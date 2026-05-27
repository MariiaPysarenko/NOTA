import { useEffect } from "react";
import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import {
  exportResultImage,
  downloadBlob,
  shareWithTeacher,
  shareResultCard,
} from "../utils/exportResult";
import EmptyState from "../components/EmptyState";
import { levelFromXp, DAILY_GOAL_MINUTES, minutesPracticedToday } from "../utils/gamification";

function NoteList({ title, items, empty }) {
  return (
    <div className="review-detail-card glass-card">
      <h3>{title}</h3>
      {items?.length ? (
        <ul className="review-note-list">
          {items.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">{empty}</p>
      )}
    </div>
  );
}

export default function ResultAnalysisScreen() {
  const practiceSummary = useNotaStore((s) => s.practiceSummary);
  const lastPracticeResult = useNotaStore((s) => s.lastPracticeResult);
  const aiFeedback = useNotaStore((s) => s.aiFeedback);
  const pieceMeta = useNotaStore((s) => s.pieceMeta);
  const selectedInstrument = useNotaStore((s) => s.selectedInstrument);
  const streak = useNotaStore((s) => s.streak);
  const gamification = useNotaStore((s) => s.gamification);
  const clearNewAchievements = useNotaStore((s) => s.clearNewAchievements);
  const navigate = useNotaStore((s) => s.navigate);
  const showToast = useNotaStore((s) => s.showToast);
  const setRetryMeasures = useNotaStore((s) => s.setRetryMeasures);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const practiceSessions = useNotaStore((s) => s.practiceSessions);

  if (!practiceSummary) {
    return (
      <main className="screen review-screen">
        <EmptyState
          icon="🎼"
          title="No session to review"
          message="Complete a practice run to see your results and coaching feedback."
          actionLabel="Choose music"
          onAction={() => navigate(ROUTES.TRACK_CHOICE)}
        />
      </main>
    );
  }

  const s = practiceSummary;
  const accuracy = s.accuracy ?? 0;
  const xpEarned = lastPracticeResult?.xpEarned ?? 0;
  const durationSec = lastPracticeResult?.durationSeconds ?? 0;
  const durationMin = Math.max(1, Math.round(durationSec / 60));
  const { level, progress } = levelFromXp(gamification.totalXp || 0);
  const dailyMinutes = minutesPracticedToday(practiceSessions);

  useEffect(() => {
    clearNewAchievements();
  }, [clearNewAchievements]);

  const correctNotes = (s.noteResults || [])
    .filter((r) => r.hits > 0 && !r.wrong?.length)
    .map((r) => r.expected);
  const wrongNotes = [
    ...(s.wrongNotes || []),
    ...(s.missedNotes || []),
  ].filter(Boolean);

  const exportPayload = {
    title: pieceMeta.title,
    accuracy,
    xp: xpEarned,
    streak: streak.current,
    instrument: selectedInstrument.name,
    durationSeconds: durationSec,
    durationMinutes: durationMin,
  };

  const handleShare = async () => {
    const blob = await exportResultImage(exportPayload);
    const shared = await shareResultCard(blob, pieceMeta.title);
    if (!shared) {
      if (teacherMode) {
        await shareWithTeacher({
          title: pieceMeta.title,
          accuracy,
          minutes: durationMin,
          instrument: selectedInstrument.name,
          xp: xpEarned,
          streak: streak.current,
        });
      } else {
        downloadBlob(blob, "nota-practice.png");
      }
    }
    showToast("Result shared");
  };

  const handleSave = () => {
    showToast("Result saved to your progress");
  };

  const handleRetryFragment = () => {
    const measures = s.difficultMeasures?.length ? s.difficultMeasures : [1];
    setRetryMeasures(measures);
    navigate(ROUTES.PRACTICE);
    showToast(`Loop measures ${measures.join(", ")}`);
  };

  return (
    <main className="screen review-screen">
      <section className="review-celebrate glass-card">
        <p className="exercise-label">Session complete</p>
        <div
          className="review-accuracy-big"
          data-level={accuracy >= 85 ? "high" : accuracy >= 60 ? "mid" : "low"}
        >
          {accuracy}%
        </div>
        <p className="review-subtitle">{pieceMeta.title}</p>

        <div className="review-reward-row">
          <div>
            <span>XP earned</span>
            <strong>+{xpEarned}</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>{durationMin}m</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>🔥 {streak.current}</strong>
          </div>
        </div>

        <div className="review-streak-bar">
          <div className="level-progress">
            <span style={{ width: `${Math.min(100, (dailyMinutes / DAILY_GOAL_MINUTES) * 100)}%` }} />
          </div>
          <p className="profile-level-caption">
            Daily goal {dailyMinutes}/{DAILY_GOAL_MINUTES}m · Level {level} ({progress}% to next)
          </p>
        </div>
      </section>

      {aiFeedback && (
        <section className="ai-feedback glass-card review-coach">
          <p className="exercise-label">AI Coach</p>
          <p className="ai-message">{aiFeedback.message}</p>
          <ul className="review-coach-lines">
            {(aiFeedback.coachLines || aiFeedback.tips || []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="ai-next">
            <strong>Next:</strong> {aiFeedback.nextStep}
          </p>
        </section>
      )}

      <NoteList title="Correct notes" items={correctNotes.slice(0, 8)} empty="Keep practicing to log hits." />
      <NoteList title="Needs work" items={wrongNotes.slice(0, 8)} empty="Great — no major misses." />

      <div className="review-detail-grid">
        <div className="review-detail-card glass-card">
          <h3>Difficult measures</h3>
          {s.difficultMeasures?.length ? (
            <p>{s.difficultMeasures.map((m) => `M${m}`).join(", ")}</p>
          ) : (
            <p className="muted">None flagged</p>
          )}
        </div>
        <div className="review-detail-card glass-card">
          <h3>Rhythm / timing</h3>
          {s.timingIssues?.length ? (
            <ul className="review-note-list">
              {s.timingIssues.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : (
            <p className="muted">Steady timing</p>
          )}
        </div>
      </div>

      <div className="review-actions">
        <button type="button" className="primary" onClick={handleRetryFragment}>
          Retry fragment
        </button>
        <button type="button" className="secondary" onClick={() => navigate(ROUTES.PRACTICE)}>
          Continue practice
        </button>
        <button type="button" className="secondary" onClick={handleSave}>
          Save result
        </button>
        <button type="button" className="secondary" onClick={handleShare}>
          Share result
        </button>
      </div>
    </main>
  );
}
