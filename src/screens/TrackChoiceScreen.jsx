import { useApp } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { levelFromXp, DAILY_GOAL_MINUTES, minutesPracticedToday } from "../utils/gamification";

export default function TrackChoiceScreen() {
  const {
    selectedInstrument,
    navigate,
    gamification,
    streak,
    practiceSessions,
    pieceMeta,
    digitizedNotes,
  } = useApp();

  const { level, progress } = levelFromXp(gamification.totalXp || 0);
  const dailyMinutes = minutesPracticedToday(practiceSessions);
  const hasPiece = digitizedNotes.length > 0;

  return (
    <main className="screen practice-home">
      <section className="hero small">
        <h1>
          Practice <span>Selection</span>
        </h1>
        <p>
          <strong className="accent-inline">{selectedInstrument.name}</strong> — choose what to
          play today.
        </p>
      </section>

      <section className="home-stats glass-card">
        <div className="home-stat">
          <span>Level</span>
          <strong>{level}</strong>
        </div>
        <div className="home-stat">
          <span>Streak</span>
          <strong>🔥 {streak.current}</strong>
        </div>
        <div className="home-stat">
          <span>Today</span>
          <strong>
            {dailyMinutes}/{DAILY_GOAL_MINUTES}m
          </strong>
        </div>
        <div className="home-stat">
          <span>XP</span>
          <strong>{gamification.totalXp || 0}</strong>
        </div>
        <div className="level-progress home-level-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      {hasPiece && (
        <button
          type="button"
          className="choice-card choice-card-continue"
          onClick={() => navigate(ROUTES.PRACTICE)}
        >
          <div className="choice-icon">🎤</div>
          <div>
            <h3>Continue: {pieceMeta.title}</h3>
            <p>{digitizedNotes.length} notes ready — jump back into practice</p>
          </div>
          <span className="card-action">→</span>
        </button>
      )}

      <button type="button" className="choice-card" onClick={() => navigate(ROUTES.LIBRARY)}>
        <div className="choice-icon">♫</div>
        <div>
          <h3>Library</h3>
          <p>Pre-digitized pieces ready to practice</p>
        </div>
        <span className="card-action">→</span>
      </button>

      <button type="button" className="choice-card" onClick={() => navigate(ROUTES.UPLOAD)}>
        <div className="choice-icon">📄</div>
        <div>
          <h3>Upload sheet music</h3>
          <p>PNG, JPG, or PDF — digitize into playable notes</p>
        </div>
        <span className="card-action">→</span>
      </button>
    </main>
  );
}
