import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Autumn Leaves — G minor lead sheet (32 bars).
 * Manually engraved contour: pickup phrase, long tones, arpeggiated A, lyrical bridge.
 */
const AUTUMN_LEAVES_BARS = [
  // A1 — lyrical opening (“The falling leaves…”)
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "half"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "quarter"], ["Eb5", "quarter"], ["F5", "half"]],
  [["Bb5", "half"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "half"], ["C5", "quarter"], ["Bb4", "quarter"]],
  // A2 — chord-tone arpeggios (Gm–Cm–F–Bb)
  [["G4", "eighth"], ["C5", "eighth"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "eighth"], ["D5", "eighth"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["G4", "eighth"], ["C5", "eighth"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "eighth"], ["D5", "eighth"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"], ["G3", "half"]],
  // B — bridge (“Since you went away…”)
  [["Bb3", "quarter"], ["D4", "quarter"], ["F4", "quarter"], ["Bb4", "quarter"]],
  [["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["A4", "quarter"], ["D5", "quarter"]],
  [["C5", "quarter"], ["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"]],
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["A3", "quarter"], ["Bb3", "quarter"], ["C4", "quarter"], ["D4", "quarter"]],
  // Final A — return + cadence
  [["G4", "eighth"], ["C5", "eighth"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "eighth"], ["D5", "eighth"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["G4", "eighth"], ["C5", "eighth"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "eighth"], ["D5", "eighth"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"], ["G3", "half"]],
];

export const AUTUMN_LEAVES_NOTES = buildMelodyFromBars(AUTUMN_LEAVES_BARS);
