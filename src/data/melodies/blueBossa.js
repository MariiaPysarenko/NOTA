import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Blue Bossa (Kenny Dorham) — C minor head, 32 bars (16 + repeat with tag).
 * Manually transcribed from the standard lead-sheet melody.
 */
const BLUE_BOSSA_BARS = [
  // Head A (m1–8)
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"], ["Eb5", "quarter"]],
  [["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"], ["Ab4", "quarter"]],
  [["G4", "quarter"], ["Bb4", "quarter"], ["D5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  // Head B (m9–16)
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["Ab4", "quarter"], ["G4", "quarter"]],
  [["F4", "quarter"], ["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"]],
  [["Bb3", "quarter"], ["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"]],
  [["Bb4", "quarter"], ["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"]],
  // Repeat head (m17–24)
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "quarter"], ["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"], ["Eb5", "quarter"]],
  [["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"], ["Ab4", "quarter"]],
  [["G4", "quarter"], ["Bb4", "quarter"], ["D5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  // Closing (m25–32)
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["Ab4", "quarter"], ["G4", "quarter"]],
  [["F4", "quarter"], ["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"]],
  [["Bb3", "quarter"], ["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"]],
  [["Bb4", "quarter"], ["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"]],
];

export const BLUE_BOSSA_NOTES = buildMelodyFromBars(BLUE_BOSSA_BARS);
