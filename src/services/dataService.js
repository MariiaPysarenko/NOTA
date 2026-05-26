import { isDemoMode, supabase } from "./supabaseClient";
import {
  getGamification,
  getLocalAnnotations,
  getLocalSessions,
  setGamification,
  setLocalAnnotations,
  setLocalSessions,
} from "./localStore";
import { todayKey } from "../utils/gamification";

/** Persist practice session (demo: localStorage; prod: Supabase) */
export async function savePracticeSession(userId, session) {
  const record = {
    id: session.id || `local-${Date.now()}`,
    userId,
    date: session.date || todayKey(),
    pieceTitle: session.pieceTitle,
    instrument: session.instrument,
    accuracy: session.accuracy,
    durationSeconds: session.durationSeconds,
    xpEarned: session.xpEarned,
    completedPiece: session.completedPiece,
    summary: session.summary,
    sheetId: session.sheetId,
  };

  if (isDemoMode) {
    const all = getLocalSessions();
    setLocalSessions([record, ...all].slice(0, 200));
    return record;
  }

  const { data, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: userId,
      sheet_id: session.sheetId || null,
      piece_title: session.pieceTitle,
      instrument: session.instrument,
      accuracy: session.accuracy,
      duration_seconds: session.durationSeconds,
      xp_earned: session.xpEarned,
      completed_piece: session.completedPiece,
      summary_json: session.summary,
      date: record.date,
    })
    .select("id")
    .single();

  if (error) throw error;

  if (session.errors?.length) {
    await supabase.from("practice_errors").insert(
      session.errors.map((e) => ({
        session_id: data.id,
        user_id: userId,
        note_name: e.noteName,
        measure: e.measure,
        error_type: e.errorType,
        detail: e.detail,
      }))
    );
  }

  return { ...record, id: data.id };
}

export async function loadPracticeSessions(userId) {
  if (isDemoMode) return getLocalSessions();

  const { data, error } = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    pieceTitle: row.piece_title,
    instrument: row.instrument,
    accuracy: row.accuracy,
    durationSeconds: row.duration_seconds,
    xpEarned: row.xp_earned,
    completedPiece: row.completed_piece,
    summary: row.summary_json,
    sheetId: row.sheet_id,
  }));
}

export async function saveAnnotations(userId, sheetId, annotations) {
  if (isDemoMode) {
    const all = getLocalAnnotations();
    all[sheetId] = annotations;
    setLocalAnnotations(all);
    return;
  }

  await supabase.from("annotations").delete().eq("user_id", userId).eq("sheet_id", sheetId);
  if (!annotations.length) return;

  await supabase.from("annotations").insert(
    annotations.map((a) => ({
      user_id: userId,
      sheet_id: sheetId,
      note_id: a.noteId,
      measure: a.measure,
      x: a.x,
      y: a.y,
      text: a.text,
      color: a.color,
    }))
  );
}

export async function syncStreak(userId, streak) {
  if (isDemoMode) {
    const g = getGamification() || {};
    setGamification({ ...g, streak });
    return;
  }

  await supabase.from("streaks").upsert({
    user_id: userId,
    current_streak: streak.current,
    longest_streak: streak.longest,
    last_practice_date: todayKey(),
    updated_at: new Date().toISOString(),
  });
}

export async function unlockAchievementRemote(userId, achievementId) {
  if (isDemoMode) return;

  await supabase.from("user_achievements").upsert({
    user_id: userId,
    achievement_id: achievementId,
  });
}

export function loadGamificationLocal() {
  return getGamification();
}

export function saveGamificationLocal(state) {
  setGamification(state);
}
