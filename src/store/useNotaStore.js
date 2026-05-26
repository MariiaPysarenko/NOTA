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
  setLocalSessions,
  getFavorites,
  setFavorites,
} from "../services/localStore";

let toastTimer;

export const useNotaStore = create((set, get) => ({
  route: ROUTES.INSTRUMENT,
  toast: "",
  selectedInstrument: instruments[0],
  pieceMeta: { id: "demo", title: "Your Piece", subtitle: "" },
  digitizedNotes: [],
  uploadPreview: null,
  annotationsBySheet: getLocalAnnotations(),
  practiceSessions: getLocalSessions(),
  practiceSummary: null,
  favoriteIds: getFavorites(),

  navigate: (route) => set({ route }),

  showToast: (message) => {
    set({ toast: message });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: "" }), 2200);
  },

  setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),

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
      return { annotationsBySheet: next };
    });
  },

  setPracticeSessions: (updater) => {
    set((s) => {
      const next = typeof updater === "function" ? updater(s.practiceSessions) : updater;
      setLocalSessions(next);
      return { practiceSessions: next };
    });
  },

  setPracticeSummary: (summary) => set({ practiceSummary: summary }),

  toggleFavorite: (trackId) => {
    set((s) => {
      const next = s.favoriteIds.includes(trackId)
        ? s.favoriteIds.filter((id) => id !== trackId)
        : [...s.favoriteIds, trackId];
      setFavorites(next);
      return { favoriteIds: next };
    });
  },

  getExercise: () => {
    const { digitizedNotes, pieceMeta } = get();
    if (digitizedNotes.length > 0) {
      return notesToExercise(digitizedNotes, pieceMeta);
    }
    return DEMO_EXERCISE;
  },
}));

/** Selector hook matching legacy useApp shape for screens */
export function useApp() {
  const store = useNotaStore();
  return {
    ...store,
    exercise: store.digitizedNotes.length
      ? notesToExercise(store.digitizedNotes, store.pieceMeta)
      : DEMO_EXERCISE,
    setDigitizedNotes: store.setDigitizedNotes,
  };
}
