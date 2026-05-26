import { create } from "zustand";
import { instruments } from "../instruments";
import { ROUTES } from "../navigation/routes";
import { notesToExercise, reindexNoteIds } from "../utils/noteModel";
import { enrichNotesWithConcertPitch } from "../utils/transposition";
import { DEMO_EXERCISE } from "../utils/exercise";
import {
  getLocalAnnotations,
  getLocalSessions,
  setLocalAnnotations,
  getGamification,
  setGamification,
  getFavorites,
  setFavorites,
} from "../services/localStore";
import {
  initAuthSession,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  updateUserProfile,
  onAuthStateChange,
} from "../services/authService";
import { isDemoMode } from "../services/supabaseClient";
import {
  savePracticeSession,
  loadPracticeSessions,
  saveGamificationLocal,
  loadGamificationLocal,
  syncStreak,
  unlockAchievementRemote,
  saveAnnotations,
} from "../services/dataService";
import {
  DEFAULT_GAMIFICATION,
  xpForSession,
  computeStreak,
  checkNewAchievements,
  minutesPracticedToday,
  todayKey,
} from "../utils/gamification";
import { generatePracticeFeedback } from "../utils/aiFeedback";

let toastTimer;

const initialGamification = () => loadGamificationLocal() || { ...DEFAULT_GAMIFICATION };

export const useNotaStore = create((set, get) => ({
  route: ROUTES.AUTH_LOGIN,
  toast: "",
  authReady: false,
  user: null,
  isDemoMode,

  selectedInstrument: instruments[0],
  pieceMeta: { id: "demo", title: "Your Piece", subtitle: "" },
  digitizedNotes: [],
  uploadPreview: null,
  annotationsBySheet: getLocalAnnotations(),
  practiceSessions: getLocalSessions(),
  practiceSummary: null,
  aiFeedback: null,
  favoriteIds: getFavorites(),

  gamification: initialGamification(),
  streak: { current: 0, longest: 0 },
  dailyGoalMinutes: 15,
  focusMode: false,
  fullscreenSheet: false,
  teacherMode: false,
  metronomeBpm: 80,
  metronomeRunning: false,
  streakPulse: false,
  newAchievements: [],

  navigate: (route) => set({ route }),

  showToast: (message) => {
    set({ toast: message });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: "" }), 2200);
  },

  initApp: async () => {
    set({ isDemoMode });
    try {
      const { user } = await initAuthSession();
      const sessions = user ? await loadPracticeSessions(user.id) : getLocalSessions();
      const g = initialGamification();
      const streak = computeStreak(g.practiceDays || []);
      set({
        user,
        authReady: true,
        practiceSessions: sessions,
        gamification: g,
        streak,
        route: user ? ROUTES.PRACTICE : ROUTES.AUTH_LOGIN,
        teacherMode: user?.teacherMode || false,
      });

      if (!isDemoMode) {
        onAuthStateChange((nextUser) => {
          if (nextUser) {
            set({ user: nextUser, teacherMode: nextUser.teacherMode });
          } else {
            set({ user: null, route: ROUTES.AUTH_LOGIN });
          }
        });
      }
    } catch {
      set({ authReady: true, route: ROUTES.AUTH_LOGIN });
    }
  },

  login: async (credentials) => {
    const { user } = await authLogin(credentials);
    const sessions = await loadPracticeSessions(user.id);
    const inst = instruments.find((i) => i.name === user.instrument) || instruments[0];
    set({
      user,
      practiceSessions: sessions,
      selectedInstrument: inst,
      teacherMode: user.teacherMode,
      route: ROUTES.PRACTICE,
    });
    return user;
  },

  register: async (payload) => {
    const { user } = await authRegister(payload);
    const inst = instruments.find((i) => i.name === user.instrument) || instruments[0];
    set({ user, selectedInstrument: inst, route: ROUTES.INSTRUMENT });
    return user;
  },

  logout: async () => {
    await authLogout();
    set({
      user: null,
      route: ROUTES.AUTH_LOGIN,
      practiceSummary: null,
      aiFeedback: null,
    });
  },

  updateProfile: async (patch) => {
    const user = await updateUserProfile(patch);
    const inst = patch.instrument
      ? instruments.find((i) => i.name === patch.instrument) || get().selectedInstrument
      : get().selectedInstrument;
    set({ user, selectedInstrument: inst, teacherMode: user.teacherMode });
    return user;
  },

  setSelectedInstrument: (instrument) => {
    set({ selectedInstrument: instrument });
    const { user } = get();
    if (user) get().updateProfile({ instrument: instrument.name });
  },

  setPieceMeta: (meta) =>
    set((s) => ({
      pieceMeta: { ...s.pieceMeta, ...meta },
    })),

  setDigitizedNotes: (notes, meta = {}) => {
    const instrument = get().selectedInstrument;
    const withConcert = enrichNotesWithConcertPitch(notes, instrument.name);
    const indexed = reindexNoteIds(withConcert);
    set((s) => ({
      digitizedNotes: indexed,
      pieceMeta: meta.title
        ? {
            ...s.pieceMeta,
            id: meta.id ?? s.pieceMeta.id,
            title: meta.title ?? s.pieceMeta.title,
            subtitle: meta.subtitle ?? s.pieceMeta.subtitle,
          }
        : s.pieceMeta,
    }));
  },

  setUploadPreview: (url) => set({ uploadPreview: url }),

  setAnnotationsForSheet: (sheetId, annotations) => {
    set((s) => {
      const next = { ...s.annotationsBySheet, [sheetId]: annotations };
      setLocalAnnotations(next);
      const { user } = get();
      if (user) saveAnnotations(user.id, sheetId, annotations);
      return { annotationsBySheet: next };
    });
  },

  toggleFavorite: (trackId) => {
    set((s) => {
      const next = s.favoriteIds.includes(trackId)
        ? s.favoriteIds.filter((id) => id !== trackId)
        : [...s.favoriteIds, trackId];
      setFavorites(next);
      return { favoriteIds: next };
    });
  },

  setPracticeSummary: (summary) => set({ practiceSummary: summary }),
  setAiFeedback: (aiFeedback) => set({ aiFeedback }),

  setFocusMode: (v) => set({ focusMode: v }),
  setFullscreenSheet: (v) => set({ fullscreenSheet: v }),
  setTeacherMode: (v) => {
    set({ teacherMode: v });
    const { user } = get();
    if (user) get().updateProfile({ teacherMode: v });
  },
  setMetronomeBpm: (bpm) => set({ metronomeBpm: bpm }),
  setMetronomeRunning: (v) => set({ metronomeRunning: v }),

  clearNewAchievements: () => set({ newAchievements: [] }),

  recordPracticeSession: async (summary, { durationSeconds = 0, completedPiece = false } = {}) => {
    const state = get();
    const accuracy = summary.accuracy ?? 0;
    const xpEarned = xpForSession({
      accuracy,
      durationSeconds,
      notesPlayed: summary.noteResults?.length ?? 0,
    });

    const sessionRecord = {
      date: todayKey(),
      pieceTitle: state.pieceMeta.title,
      instrument: state.selectedInstrument.name,
      accuracy,
      durationSeconds,
      xpEarned,
      completedPiece,
      sheetId: state.pieceMeta.id,
      summary: {
        ...summary,
        rhythmIssues: summary.timingIssues,
      },
    };

    const errors = buildPracticeErrors(summary);

    if (state.user) {
      await savePracticeSession(state.user.id, { ...sessionRecord, errors });
    }

    const g = { ...state.gamification };
    g.totalXp = (g.totalXp || 0) + xpEarned;
    const days = new Set(g.practiceDays || []);
    days.add(todayKey());
    g.practiceDays = [...days];
    const streak = computeStreak(g.practiceDays);
    const achievementCheck = checkNewAchievements({ ...state, streak, gamification: g }, sessionRecord);
    g.unlockedAchievements = achievementCheck.unlockedAchievements;

    saveGamificationLocal(g);
    if (state.user) {
      await syncStreak(state.user.id, streak);
      for (const a of achievementCheck.newAchievements) {
        await unlockAchievementRemote(state.user.id, a.id);
      }
    }

    const aiFeedback = generatePracticeFeedback({
      ...summary,
      pieceTitle: state.pieceMeta.title,
      instrument: state.selectedInstrument.name,
    });

    const sessions = state.user
      ? await loadPracticeSessions(state.user.id)
      : [sessionRecord, ...state.practiceSessions].slice(0, 200);

    set({
      practiceSessions: sessions,
      gamification: g,
      streak,
      practiceSummary: sessionRecord.summary,
      aiFeedback,
      streakPulse: streak.current > 0,
      newAchievements: achievementCheck.newAchievements,
    });

    return { sessionRecord, aiFeedback, xpEarned, newAchievements: achievementCheck.newAchievements };
  },

  getExercise: () => {
    const { digitizedNotes, pieceMeta } = get();
    if (digitizedNotes.length > 0) {
      return notesToExercise(digitizedNotes, pieceMeta);
    }
    return DEMO_EXERCISE;
  },

  getProgressStats: () => {
    const { practiceSessions, streak, gamification } = get();
    const totalSeconds = practiceSessions.reduce((s, x) => s + (x.durationSeconds || 0), 0);
    const avgAccuracy =
      practiceSessions.length > 0
        ? Math.round(
            practiceSessions.reduce((s, x) => s + (x.accuracy || 0), 0) / practiceSessions.length
          )
        : 0;
    const dailyMinutes = minutesPracticedToday(practiceSessions);
    return {
      totalPracticeMinutes: Math.round(totalSeconds / 60),
      avgAccuracy,
      dailyMinutes,
      streak,
      totalXp: gamification.totalXp || 0,
    };
  },
}));

function buildPracticeErrors(summary) {
  const errors = [];
  (summary.missedNotes || []).forEach((note) =>
    errors.push({ noteName: note, measure: null, errorType: "missed", detail: "Missed note" })
  );
  (summary.timingIssues || []).forEach((note) =>
    errors.push({ noteName: note, measure: null, errorType: "rhythm", detail: "Rhythm issue" })
  );
  (summary.noteResults || [])
    .filter((r) => r.wrong?.length)
    .forEach((r) =>
      errors.push({
        noteName: r.expected,
        measure: r.measure,
        errorType: "wrong",
        detail: r.wrong.join(", "),
      })
    );
  return errors;
}

export function useApp() {
  const store = useNotaStore();
  return {
    ...store,
    exercise: store.digitizedNotes.length
      ? notesToExercise(store.digitizedNotes, store.pieceMeta)
      : DEMO_EXERCISE,
    setDigitizedNotes: store.setDigitizedNotes,
    dailyMinutes: minutesPracticedToday(store.practiceSessions),
  };
}
