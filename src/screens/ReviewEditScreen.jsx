import { useEffect, useState } from "react";
import { useApp } from "../store/useNotaStore";
import SheetMusicRenderer from "../components/SheetMusicRenderer";
import { ROUTES } from "../navigation/routes";
import { createNote, DURATIONS, PITCHES } from "../utils/noteModel";

export default function ReviewEditScreen() {
  const { digitizedNotes, setDigitizedNotes, pieceMeta, navigate, showToast } = useApp();
  const [selectedId, setSelectedId] = useState(digitizedNotes[0]?.id ?? null);
  const [editing, setEditing] = useState(digitizedNotes);

  useEffect(() => {
    setEditing(digitizedNotes);
    setSelectedId(digitizedNotes[0]?.id ?? null);
  }, [digitizedNotes]);

  const selected = editing.find((n) => n.id === selectedId) ?? editing[0];

  const updateNotes = (next) => {
    setEditing(next);
    setDigitizedNotes(next, pieceMeta);
  };

  const updateSelected = (patch) => {
    if (!selected) return;
    const next = editing.map((n) => (n.id === selected.id ? { ...n, ...patch } : n));
    updateNotes(next);
  };

  const addNote = () => {
    const last = editing[editing.length - 1];
    const note = createNote({
      pitch: "C4",
      duration: "quarter",
      measure: last ? last.measure : 1,
    });
    const next = [...editing, note];
    updateNotes(next);
    setSelectedId(note.id);
    showToast("Note added");
  };

  const deleteNote = () => {
    if (editing.length <= 1) {
      showToast("Keep at least one note");
      return;
    }
    const next = editing.filter((n) => n.id !== selectedId);
    updateNotes(next);
    setSelectedId(next[0]?.id ?? null);
    showToast("Note removed");
  };

  const goToPractice = () => {
    setDigitizedNotes(editing, pieceMeta);
    navigate(ROUTES.PRACTICE);
  };

  return (
    <main className="screen review-screen">
      <section className="hero small">
        <h1>
          Review <span>Notes</span>
        </h1>
        <p>{pieceMeta.title} — edit pitch, duration, or add markings before practice.</p>
      </section>

      <section className="digital-sheet-card">
        <p className="exercise-label">Digital sheet music</p>
        <SheetMusicRenderer
          notes={editing}
          activeNoteId={selectedId}
          width={330}
          height={150}
        />
      </section>

      <section className="note-editor">
        <div className="editor-toolbar">
          <button type="button" className="secondary small-btn" onClick={addNote}>
            + Add note
          </button>
          <button type="button" className="secondary small-btn danger" onClick={deleteNote}>
            Delete note
          </button>
        </div>

        {selected && (
          <div className="editor-fields">
            <label>
              Pitch
              <select
                value={selected.pitch}
                onChange={(e) => {
                  updateSelected({ pitch: e.target.value });
                  setSelectedId(selected.id);
                }}
              >
                {PITCHES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Duration
              <select
                value={selected.duration}
                onChange={(e) => updateSelected({ duration: e.target.value })}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Measure
              <input
                type="number"
                min={1}
                max={32}
                value={selected.measure}
                onChange={(e) =>
                  updateSelected({ measure: parseInt(e.target.value, 10) || 1 })
                }
              />
            </label>
            <label>
              Beat
              <input
                type="number"
                min={1}
                max={4}
                value={selected.beat ?? 1}
                onChange={(e) => updateSelected({ beat: parseInt(e.target.value, 10) || 1 })}
              />
            </label>

            <label>
              Annotation / marking
              <input
                type="text"
                placeholder="e.g. staccato, forte"
                value={selected.annotation || ""}
                onChange={(e) => updateSelected({ annotation: e.target.value })}
              />
            </label>
          </div>
        )}

        <div className="note-chip-row">
          {editing.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`note-chip ${selectedId === n.id ? "active" : ""}`}
              onClick={() => setSelectedId(n.id)}
            >
              {n.pitch}
              {n.annotation ? ` · ${n.annotation}` : ""}
            </button>
          ))}
        </div>
      </section>

      <div className="buttons">
        <button type="button" className="primary" onClick={goToPractice}>
          Continue to Practice
        </button>
        <button type="button" className="secondary" onClick={() => navigate(ROUTES.SHEET_EDITOR)}>
          Edit / Draw markings
        </button>
      </div>
    </main>
  );
}
