import { levelFromXp } from "../utils/gamification";

export default function GamificationBar({ totalXp, streak, dailyMinutes, dailyGoal }) {
  const { level, progress } = levelFromXp(totalXp);
  const goalPct = Math.min(100, Math.round((dailyMinutes / dailyGoal) * 100));

  return (
    <section className="gamification-bar glass-card">
      <div className="gamification-row">
        <div>
          <span className="level-badge">Lv {level}</span>
          <span className="xp-text">{totalXp} XP</span>
        </div>
        <div className="streak-pill">🔥 {streak}</div>
      </div>
      <div className="level-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="daily-goal-text">
        Daily goal: {dailyMinutes}/{dailyGoal} min ({goalPct}%)
      </p>
    </section>
  );
}
