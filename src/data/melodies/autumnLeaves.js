import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Autumn Leaves (Les Feuilles Mortes) — G minor lead-sheet head, 32 bars.
 * Manually transcribed educational version; recognizable AABA contour.
 */
const AUTUMN_LEAVES_BARS = [
  // A1 — “The falling leaves…” (pickup + phrase)
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "half"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "quarter"], ["Eb5", "quarter"], ["F5", "half"]],
  [["Bb5", "half"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["G4", "eighth"], ["A4", "eighth"], ["Bb4", "quarter"], ["C5", "quarter"]],
  [["D5", "half"], ["C5", "quarter"], ["Bb4", "quarter"]],
  // A2 — arpeggios (Gm → Cm → F → Bb)
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"]],
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
  // Final A — return + tag
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["G5", "quarter"]],
  [["F5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"], ["G3", "half"]],
];

export const AUTUMN_LEAVES_NOTES = buildMelodyFromBars(AUTUMN_LEAVES_BARS);
