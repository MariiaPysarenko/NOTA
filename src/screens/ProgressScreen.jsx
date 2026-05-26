import { useNotaStore } from "../store/useNotaStore";
import GamificationBar from "../components/GamificationBar";
import PracticeHeatmap from "../components/PracticeHeatmap";
import AchievementBadge from "../components/AchievementBadge";
import { levelFromXp, ACHIEVEMENTS } from "../utils/gamification";
import EmptyState from "../components/EmptyState";
import { ROUTES } from "../navigation/routes";

export default function ProgressScreen() {
  const gamification = useNotaStore((s) => s.gamification);
  const practiceSessions = useNotaStore((s) => s.practiceSessions);
  const streak = useNotaStore((s) => s.streak);
  const getProgressStats = useNotaStore((s) => s.getProgressStats);
  const navigate = useNotaStore((s) => s.navigate);

  const stats = getProgressStats();
  const { level, progress } = levelFromXp(gamification.totalXp || 0);
  const unlocked = new Set(gamification.unlockedAchievements || []);

  return (
    <main className="screen progress-screen">
      <section className="hero small">
        <h1>
          Your <span>Progress</span>
        </h1>
        <p>Level {level} · {gamification.totalXp || 0} XP total</p>
      </section>

      <GamificationBar />

      <section className="stats-grid glass-card">
        <div className="stat-tile">
          <span>Current streak</span>
          <strong className="streak-fire">🔥 {streak.current} days</strong>
        </div>
        <div className="stat-tile">
          <span>Longest streak</span>
          <strong>{streak.longest} days</strong>
        </div>
        <div className="stat-tile">
          <span>Total practice</span>
          <strong>{stats.totalPracticeMinutes} min</strong>
        </div>
        <div className="stat-tile">
          <span>Avg accuracy</span>
          <strong>{stats.avgAccuracy}%</strong>
        </div>
      </section>

      <PracticeHeatmap sessions={practiceSessions} />

      <section className="history-section">
        <p className="exercise-label">Recent sessions</p>
        {practiceSessions.length === 0 ? (
          <EmptyState
            compact
            icon="📈"
            title="No practice history yet"
            message="Finish a practice session to track accuracy, streaks, and XP here."
            actionLabel="Start practicing"
            onAction={() => navigate(ROUTES.PRACTICE)}
          />
        ) : (
          <ul className="session-list">
            {practiceSessions.slice(0, 8).map((s) => (
              <li key={s.id} className="session-item glass-card">
                <div className="session-meta">
                  <strong className="text-clamp-1">{s.pieceTitle || "Practice"}</strong>
                  <p className="text-clamp-1">
                    {(s.date || "").slice(0, 10)} · {s.instrument}
                  </p>
                </div>
                <span className="accuracy-pill">{s.accuracy}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="achievements-section">
        <p className="exercise-label">Achievements</p>
        <div className="achievement-list">
          {Object.values(ACHIEVEMENTS).map((badge) => (
            <AchievementBadge key={badge.id} achievement={badge} unlocked={unlocked.has(badge.id)} />
          ))}
        </div>
      </section>

      <div className="level-progress large">
        <span style={{ width: `${progress}%` }} />
      </div>
    </main>
  );
}
