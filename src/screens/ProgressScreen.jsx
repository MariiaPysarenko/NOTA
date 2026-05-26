import { useMemo } from "react";
import { useApp } from "../context/AppContext";

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function ProgressScreen() {
  const { practiceSessions } = useApp();

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

    let currentStreak = 0;
    let longestStreak = 0;
    let walk = new Date(now);
    while (byDay.has(dateKey(walk))) {
      currentStreak += 1;
      walk.setDate(walk.getDate() - 1);
    }

    let streak = 0;
    const sortedDays = [...byDay.keys()].sort();
    for (let i = 0; i < sortedDays.length; i++) {
      const current = new Date(sortedDays[i]);
      const prev = i > 0 ? new Date(sortedDays[i - 1]) : null;
      if (!prev) streak = 1;
      else {
        const diff = (current - prev) / (1000 * 3600 * 24);
        streak = diff === 1 ? streak + 1 : 1;
      }
      longestStreak = Math.max(longestStreak, streak);
    }

    const weekly = Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const key = dateKey(day);
      return { key, minutes: byDay.get(key)?.minutes || 0 };
    });

    return {
      currentStreak,
      longestStreak,
      totalPracticeDays: byDay.size,
      totalMinutes: Math.round(totalSeconds / 60),
      avgAccuracy: practiceSessions.length
        ? Math.round(totalAccuracy / practiceSessions.length)
        : 0,
      weekly,
    };
  }, [practiceSessions]);

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Your <span>Progress</span>
        </h1>
        <p>Track consistency, time, and accuracy streaks.</p>
      </section>

      <section className="stats">
        <div>
          <b>{stats.currentStreak}</b>
          <span>Current streak</span>
        </div>
        <div>
          <b>{stats.longestStreak}</b>
          <span>Longest streak</span>
        </div>
        <div>
          <b>{stats.totalPracticeDays}</b>
          <span>Practice days</span>
        </div>
      </section>

      <section className="progress-card">
        <p>Minutes practiced this week</p>
        <div className="progress-bars">
          {stats.weekly.map((d) => (
            <span key={d.key} style={{ height: `${Math.min(100, d.minutes * 6)}%` }} />
          ))}
        </div>
        <p className="progress-note">
          {stats.totalMinutes} total minutes · {stats.avgAccuracy}% average accuracy
        </p>
      </section>
    </main>
  );
}
