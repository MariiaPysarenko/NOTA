import { levelFromXp, minutesPracticedToday } from "../utils/gamification";
import { useNotaStore } from "../store/useNotaStore";

export default function GamificationBar() {
  const gamification = useNotaStore((s) => s.gamification);
  const streak = useNotaStore((s) => s.streak);
  const practiceSessions = useNotaStore((s) => s.practiceSessions);
  const dailyMinutes = minutesPracticedToday(practiceSessions);
  const dailyGoalMinutes = useNotaStore((s) => s.dailyGoalMinutes);
  const streakPulse = useNotaStore((s) => s.streakPulse);

  const { level, progress } = levelFromXp(gamification.totalXp || 0);

  return (
    <section className={`gamification-bar glass-card ${streakPulse ? "streak-pulse" : ""}`}>
      <div className="gamification-row">
        <div className="gam-stat">
          <span className="gam-label">Level</span>
          <strong>{level}</strong>
        </div>
        <div className="gam-stat">
          <span className="gam-label">XP</span>
          <strong>{gamification.totalXp || 0}</strong>
        </div>
        <div className="gam-stat">
          <span className="gam-label">Streak</span>
          <strong className="streak-fire">🔥 {streak.current}</strong>
        </div>
        <div className="gam-stat">
          <span className="gam-label">Today</span>
          <strong>
            {dailyMinutes}/{dailyGoalMinutes}m
          </strong>
        </div>
      </div>
      <div className="level-progress">
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
