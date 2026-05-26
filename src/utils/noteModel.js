// Structured note model: pitch, duration, measure (+ optional id/annotation)

export const DURATIONS = ["whole", "half", "quarter", "eighth", "sixteenth"];

export const DURATION_MS = {
  whole: 4000,
  half: 2000,
  quarter: 1000,
  eighth: 500,
  sixteenth: 250,
};

export const PITCHES = [
  "C3", "C#3", "D3", "D#3", "Eb3", "E3", "F3", "F#3", "G3", "G#3", "A3", "Bb3", "B3",
  "C4", "C#4", "D4", "D#4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "A4", "Bb4", "B4",
  "C5", "C#5", "D5", "D#5", "Eb5", "E5", "F5", "F#5", "G5",
];

let noteIdCounter = 0;

export function createNote(overrides = {}) {
  return {
    id: `n-${++noteIdCounter}`,
    pitch: "C4",
    duration: "quarter",
    measure: 1,
    beat: 1,
    writtenPitch: "C4",
    concertPitch: "C4",
    annotation: "",
    ...overrides,
  };
}

export function reindexNoteIds(notes) {
  return notes.map((n, i) => ({ ...n, id: n.id || `n-${i + 1}` }));
}

export function durationToMs(duration) {
  return DURATION_MS[duration] ?? DURATION_MS.quarter;
}

/** Convert structured notes → exercise format for practice engine */
export function notesToExercise(notes, meta = {}) {
  const list = reindexNoteIds(notes);
  return {
    id: meta.id ?? "piece",
    title: meta.title ?? "Your Piece",
    subtitle: meta.subtitle ?? "Digitized sheet music",
    notes: list.map((n) => ({
      id: n.id,
      name: n.pitch,
      writtenName: n.writtenPitch || n.pitch,
      concertName: n.concertPitch || n.pitch,
      durationMs: durationToMs(n.duration),
      duration: n.duration,
      measure: n.measure,
      beat: n.beat ?? 1,
      annotation: n.annotation || "",
    })),
  };
}

/** Convert exercise notes back to structured format */
export function exerciseToNotes(exercise) {
  return exercise.notes.map((n, i) =>
    createNote({
      id: n.id,
      pitch: n.name,
      writtenPitch: n.writtenName ?? n.name,
      concertPitch: n.concertName ?? n.name,
      duration: n.duration ?? msToDuration(n.durationMs),
      measure: n.measure ?? Math.floor(i / 4) + 1,
      beat: n.beat ?? 1,
      annotation: n.annotation ?? "",
    })
  );
}

export function msToDuration(ms) {
  const entry = Object.entries(DURATION_MS).find(([, v]) => v === ms);
  return entry ? entry[0] : "quarter";
}

export function getTotalDurationMsFromNotes(notes) {
  return notes.reduce((sum, n) => sum + durationToMs(n.duration), 0);
}
