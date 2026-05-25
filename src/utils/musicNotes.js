// Musical note helpers: frequency ↔ note name, cents deviation, comparison

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/** A4 reference frequency (Hz) */
const A4_FREQ = 440;

/**
 * Convert frequency (Hz) to note name like "C4", "D#4".
 * Returns null if frequency is invalid or out of range.
 */
export function frequencyToNoteName(frequency) {
  if (!frequency || frequency < 50 || frequency > 4000) return null;

  const midi = Math.round(12 * Math.log2(frequency / A4_FREQ) + 69);
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = ((midi % 12) + 12) % 12;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/**
 * Parse "C4" / "D#4" into MIDI number for comparison.
 */
export function noteNameToMidi(noteName) {
  if (!noteName) return null;
  const match = noteName.match(/^([A-G]#?)(\d)$/);
  if (!match) return null;
  const [, name, octaveStr] = match;
  const idx = NOTE_NAMES.indexOf(name);
  if (idx < 0) return null;
  return (parseInt(octaveStr, 10) + 1) * 12 + idx;
}

/** Cents deviation from target note (positive = sharp). */
export function centsFromTarget(frequency, targetNoteName) {
  const targetMidi = noteNameToMidi(targetNoteName);
  if (!frequency || targetMidi == null) return null;
  const playedMidi = 12 * Math.log2(frequency / A4_FREQ) + 69;
  return Math.round((playedMidi - targetMidi) * 100);
}

/**
 * Feedback state for UI coloring.
 * gray = silence, green = in tune, orange = slightly off, red = wrong note
 */
export function getPitchFeedback(detectedNote, targetNote, cents, isSilent) {
  if (isSilent || !detectedNote) return "gray";
  if (detectedNote !== targetNote) return "red";
  const c = Math.abs(cents ?? 0);
  if (c <= 25) return "green";
  if (c <= 50) return "orange";
  return "red";
}

/** Map feedback to tuner bar class */
export function feedbackToTunerClass(feedback) {
  if (feedback === "green") return "good";
  if (feedback === "orange") return "close";
  if (feedback === "red") return "bad";
  return "bad";
}

/** Index 0–41 for tuner needle position from cents (-50 to +50). */
export function centsToTunerIndex(cents) {
  if (cents == null) return 20;
  const clamped = Math.max(-50, Math.min(50, cents));
  return Math.round(((clamped + 50) / 100) * 41);
}

export { NOTE_NAMES };
