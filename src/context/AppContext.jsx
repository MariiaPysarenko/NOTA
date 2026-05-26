import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { instruments } from "../instruments";
import { ROUTES } from "../navigation/routes";
import { notesToExercise, reindexNoteIds } from "../utils/noteModel";
import { DEMO_EXERCISE } from "../utils/exercise";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [route, setRoute] = useState(ROUTES.INSTRUMENT);
  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0]);
  const [pieceMeta, setPieceMeta] = useState({
    id: "demo",
    title: "Your Piece",
    subtitle: "",
  });
  const [digitizedNotes, setDigitizedNotes] = useState([]);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => setToast(""), 2200);
  }, []);

  const navigate = useCallback((nextRoute) => setRoute(nextRoute), []);

  const setNotes = useCallback((notes, meta = {}) => {
    const indexed = reindexNoteIds(notes);
    setDigitizedNotes(indexed);
    if (meta.title) {
      setPieceMeta((m) => ({
        ...m,
        id: meta.id ?? m.id,
        title: meta.title ?? m.title,
        subtitle: meta.subtitle ?? m.subtitle,
      }));
    }
  }, []);

  const exercise = useMemo(() => {
    if (digitizedNotes.length > 0) {
      return notesToExercise(digitizedNotes, pieceMeta);
    }
    return DEMO_EXERCISE;
  }, [digitizedNotes, pieceMeta]);

  const value = useMemo(
    () => ({
      route,
      navigate,
      selectedInstrument,
      setSelectedInstrument,
      digitizedNotes,
      setDigitizedNotes: setNotes,
      uploadPreview,
      setUploadPreview,
      pieceMeta,
      setPieceMeta,
      exercise,
      toast,
      showToast,
    }),
    [
      route,
      navigate,
      selectedInstrument,
      digitizedNotes,
      setNotes,
      uploadPreview,
      pieceMeta,
      exercise,
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
