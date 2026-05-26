import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { instruments } from "../instruments";
import { ROUTES } from "../navigation/routes";
import { notesToExercise, reindexNoteIds } from "../utils/noteModel";
import { DEMO_EXERCISE } from "../utils/exercise";
import { enrichNotesWithConcertPitch } from "../utils/transposition";
import { getInitialAuthState } from "../services/authService";
import {
  getLocalAnnotations,
  getLocalSessions,
  setLocalAnnotations,
  setLocalSessions,
} from "../services/localStore";
import { isDemoMode } from "../services/supabaseClient";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const initialUser = getInitialAuthState();
  const [user, setUser] = useState(initialUser);
  const [route, setRoute] = useState(initialUser ? ROUTES.INSTRUMENT : ROUTES.AUTH_LOGIN);
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const [pieceMeta, setPieceMeta] = useState({
    id: "demo",
    title: "Your Piece",
    subtitle: "",
  });
  const [digitizedNotes, setDigitizedNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("practice");
  const [uploadPreview, setUploadPreview] = useState(null);
  const [practiceSummary, setPracticeSummary] = useState(null);
  const [practiceSessions, setPracticeSessionsState] = useState(getLocalSessions());
  const [annotationsBySheet, setAnnotationsBySheetState] = useState(getLocalAnnotations());
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const navigate = useCallback((nextRoute) => setRoute(nextRoute), []);

  const setNotes = useCallback((notes, meta = {}) => {
    const withConcert = enrichNotesWithConcertPitch(notes, selectedInstrument.name);
    const indexed = reindexNoteIds(withConcert);
    setDigitizedNotes(indexed);
    if (meta.title) {
      setPieceMeta((m) => ({
        ...m,
        id: meta.id ?? m.id,
        title: meta.title ?? m.title,
        subtitle: meta.subtitle ?? m.subtitle,
      }));
    }
  }, [selectedInstrument.name]);

  const setPracticeSessions = useCallback((updater) => {
    setPracticeSessionsState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (isDemoMode) setLocalSessions(next);
      return next;
    });
  }, []);

  const setAnnotationsForSheet = useCallback((sheetId, annotations) => {
    setAnnotationsBySheetState((prev) => {
      const next = { ...prev, [sheetId]: annotations };
      if (isDemoMode) setLocalAnnotations(next);
      return next;
    });
  }, []);

  const exercise = useMemo(() => {
    if (digitizedNotes.length > 0) {
      return notesToExercise(digitizedNotes, pieceMeta);
    }
    return DEMO_EXERCISE;
  }, [digitizedNotes, pieceMeta]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      route,
      navigate,
      selectedInstrument,
      setSelectedInstrument,
      digitizedNotes,
      setDigitizedNotes: setNotes,
      activeTab,
      setActiveTab,
      uploadPreview,
      setUploadPreview,
      pieceMeta,
      setPieceMeta,
      exercise,
      practiceSummary,
      setPracticeSummary,
      practiceSessions,
      setPracticeSessions,
      annotationsBySheet,
      setAnnotationsForSheet,
      toast,
      showToast,
      isDemoMode,
    }),
    [
      user,
      route,
      navigate,
      selectedInstrument,
      digitizedNotes,
      setNotes,
      activeTab,
      uploadPreview,
      pieceMeta,
      exercise,
      practiceSummary,
      practiceSessions,
      setPracticeSessions,
      annotationsBySheet,
      setAnnotationsForSheet,
      toast,
      showToast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
