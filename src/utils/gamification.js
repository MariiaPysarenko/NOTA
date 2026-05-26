/** XP, levels, streaks, daily goals, achievements */

export const DAILY_GOAL_MINUTES = 15;
export const XP_PER_SESSION_BASE = 25;
export const XP_PER_ACCURACY_POINT = 2;

export const ACHIEVEMENTS = {
  streak_7: { id: "streak_7", title: "7 Day Streak", icon: "🔥", desc: "Practice 7 days in a row" },
  accuracy_90: { id: "accuracy_90", title: "Pitch Master", icon: "🎯", desc: "Reach 90% accuracy" },
  first_piece: { id: "first_piece", title: "First Piece", icon: "🎵", desc: "Complete your first piece" },
};

export function xpForSession({ accuracy = 0, durationSeconds = 0, notesPlayed = 0 }) {
  const timeBonus = Math.min(40, Math.floor(durationSeconds / 30) * 5);
  const noteBonus = Math.min(30, notesPlayed * 2);
  const accBonus = Math.round((accuracy / 100) * XP_PER_ACCURACY_POINT * 50);
  return XP_PER_SESSION_BASE + timeBonus + noteBonus + accBonus;
}

export function levelFromXp(xp) {
  let level = 1;
  let threshold = 100;
  let remaining = xp;
  while (remaining >= threshold) {
    remaining -= threshold;
    level += 1;
    threshold = Math.round(threshold * 1.35);
  }
  const progress = Math.round((remaining / threshold) * 100);
  return { level, xp, xpInLevel: remaining, xpToNext: threshold, progress };
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function computeStreak(practiceDays) {
  const days = [...new Set(practiceDays)].sort();
  if (!days.length) return { current: 0, longest: 0 };

  let longest = 1;
  let streak = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = (cur - prev) / (86400000);
    streak = diff === 1 ? streak + 1 : 1;
    longest = Math.max(longest, streak);
  }

  let current = 0;
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);

  if (days.includes(today)) {
    let walk = new Date(today);
    while (days.includes(walk.toISOString().slice(0, 10))) {
      current += 1;
      walk.setDate(walk.getDate() - 1);
    }
  } else if (days.includes(yKey)) {
    let walk = new Date(yKey);
    while (days.includes(walk.toISOString().slice(0, 10))) {
      current += 1;
      walk.setDate(walk.getDate() - 1);
    }
  }

  return { current, longest };
}

export function minutesPracticedToday(sessions) {
  const key = todayKey();
  return sessions
    .filter((s) => (s.date || "").slice(0, 10) === key)
    .reduce((sum, s) => sum + Math.round((s.durationSeconds || 0) / 60), 0);
}

export function checkNewAchievements(state, session) {
  const unlocked = new Set(state.unlockedAchievements || []);
  const next = [];

  if (state.streak?.current >= 7 && !unlocked.has("streak_7")) {
    next.push(ACHIEVEMENTS.streak_7);
    unlocked.add("streak_7");
  }
  if (session.accuracy >= 90 && !unlocked.has("accuracy_90")) {
    next.push(ACHIEVEMENTS.accuracy_90);
    unlocked.add("accuracy_90");
  }
  if (session.completedPiece && !unlocked.has("first_piece")) {
    next.push(ACHIEVEMENTS.first_piece);
    unlocked.add("first_piece");
  }

  return { newAchievements: next, unlockedAchievements: [...unlocked] };
}

export const DEFAULT_GAMIFICATION = {
  totalXp: 0,
  unlockedAchievements: [],
  practiceDays: [],
  dailyGoalMinutes: DAILY_GOAL_MINUTES,
};
