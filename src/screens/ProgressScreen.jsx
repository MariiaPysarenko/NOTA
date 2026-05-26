import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import PracticeHeatmap from "../components/PracticeHeatmap";
import { levelFromXp } from "../utils/gamification";
import { ACHIEVEMENTS } from "../utils/gamification";

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function ProgressScreen() {
  const { practiceSessions, gamification, streak, dailyMinutes, dailyGoalMinutes } = useApp();
  const { level, progress } = levelFromXp(gamification.totalXp || 0);

  const stats = useMemo(() => {
    const now = new Date();
    const byDay = new Map();
    let totalSeconds = 0;
    let totalAccuracy = 0;

    practiceSessions.forEach((s) => {
      totalSeconds += s.durationSeconds || 0;
      totalAccuracy += s.accuracy || 0;
      const key = (s.date || s.created_at || now.toISOString()).slice(0, 10);
      const current = byDay.get(key) || { minutes: 0, count: 0 };
      current.minutes += Math.round((s.durationSeconds || 0) / 60);
      current.count += 1;
      byDay.set(key, current);
    });

    const weekly = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const key = dateKey(day);
      return { key, minutes: byDay.get(key)?.minutes || 0 };
    });

    return {
      totalPracticeDays: byDay.size,
      totalMinutes: Math.round(totalSeconds / 60),
      avgAccuracy: practiceSessions.length
        ? Math.round(totalAccuracy / practiceSessions.length)
        : 0,
      weekly,
    };
  }, [practiceSessions]);

  const unlocked = gamification.unlockedAchievements || [];

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Your <span>Progress</span>
        </h1>
        <p>Level {level} · {gamification.totalXp || 0} XP total</p>
      </section>

      <section className="gamification-bar glass-card">
        <div className="gamification-row">
          <span className="level-badge">Lv {level}</span>
          <span className="streak-pill">🔥 {streak.current} day streak</span>
        </div>
        <div className="level-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="daily-goal-text">
          Today: {dailyMinutes}/{dailyGoalMinutes} min
        </p>
      </section>

      <section className="stats glass-card">
        <div>
          <b>{streak.longest}</b>
          <span>Best streak</span>
        </div>
        <div>
          <b>{stats.totalPracticeDays}</b>
          <span>Practice days</span>
        </div>
        <div>
          <b>{stats.avgAccuracy}%</b>
          <span>Avg accuracy</span>
        </div>
      </section>

      <PracticeHeatmap sessions={practiceSessions} />

      <section className="progress-card glass-card">
        <p>Minutes this week</p>
        <div className="progress-bars">
          {stats.weekly.map((d) => (
            <span key={d.key} style={{ height: `${Math.min(100, d.minutes * 6)}%` }} />
          ))}
        </div>
        <p className="progress-note">{stats.totalMinutes} total minutes practiced</p>
      </section>

      <section className="timeline-card glass-card">
        <p className="exercise-label">Practice history</p>
        <div className="timeline-list">
          {practiceSessions.length === 0 ? (
            <p className="empty-state">No sessions yet — start practicing!</p>
          ) : (
            [...practiceSessions]
              .reverse()
              .slice(0, 8)
              .map((s) => (
                <div key={s.id} className="timeline-item">
                  <div>
                    <h4>{s.title || "Practice session"}</h4>
                    <p>{new Date(s.date).toLocaleDateString()}</p>
                  </div>
                  <b>{s.accuracy}%</b>
                </div>
              ))
          )}
        </div>
      </section>

      <section className="badges-row">
        {Object.values(ACHIEVEMENTS).map((badge) => (
          <div
            key={badge.id}
            className={`badge-chip ${unlocked.includes(badge.id) ? "unlocked" : ""}`}
          >
            <span>{badge.icon}</span>
            <small>{badge.title}</small>
          </div>
        ))}
      </section>
    </main>
  );
}
