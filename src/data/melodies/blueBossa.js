import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Blue Bossa (Kenny Dorham) — C minor, 32 bars.
 * Bossa rhythm: eighth pickups, syncopated bar 12, lyrical closing.
 */
const BLUE_BOSSA_BARS = [
  // A — head
  [["C4", "eighth"], ["Eb4", "eighth"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "eighth"], ["F4", "eighth"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["Ab4", "quarter"], ["G4", "quarter"]],
  [["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"], ["Eb5", "quarter"]],
  [["D5", "quarter"], ["C5", "eighth"], ["Bb4", "eighth"], ["Ab4", "quarter"]],
  [["G4", "quarter"], ["Bb4", "quarter"], ["D5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "half"]],
  // B — continuation
  [["C4", "eighth"], ["Eb4", "eighth"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["Ab4", "eighth"], ["G4", "eighth"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["C5", "half"]],
  // Repeat + tag
  [["C4", "eighth"], ["Eb4", "eighth"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "eighth"], ["F4", "eighth"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["Ab4", "quarter"], ["G4", "quarter"]],
  [["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"], ["Eb5", "quarter"]],
  [["D5", "quarter"], ["C5", "eighth"], ["Bb4", "eighth"], ["Ab4", "quarter"]],
  [["G4", "quarter"], ["Bb4", "quarter"], ["D5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "half"]],
  // Closing phrase
  [["Bb4", "quarter"], ["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "quarter"], ["Bb3", "quarter"]],
  [["C4", "eighth"], ["Eb4", "eighth"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["Ab4", "quarter"], ["C5", "quarter"]],
  [["Bb4", "half"], ["G4", "quarter"], ["F4", "quarter"]],
  [["Eb4", "quarter"], ["D4", "quarter"], ["C4", "half"]],
];

export const BLUE_BOSSA_NOTES = buildMelodyFromBars(BLUE_BOSSA_BARS);
