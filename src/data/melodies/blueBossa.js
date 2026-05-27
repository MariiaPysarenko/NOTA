import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Blue Bossa — educational lead-sheet melody (16 bars).
 * Manual latin-jazz phrasing in C minor.
 */
const BLUE_BOSSA_BARS = [
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"]],
  [["C5", "half"], ["Bb4", "quarter"], ["G4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "whole"]],
  [["G4", "quarter"], ["C5", "quarter"], ["Eb5", "quarter"], ["D5", "quarter"]],
  [["C5", "half"], ["Bb4", "quarter"], ["G4", "quarter"]],
  [["F4", "quarter"], ["G4", "quarter"], ["Ab4", "quarter"], ["Bb4", "quarter"]],
  [["C5", "whole"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "quarter"], ["F4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["C5", "half"], ["Bb4", "quarter"], ["Ab4", "quarter"]],
  [["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"], ["D4", "quarter"]],
  [["C4", "quarter"], ["Eb4", "quarter"], ["G4", "quarter"], ["Bb4", "quarter"]],
  [["Ab4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["Eb4", "quarter"]],
  [["D4", "half"], ["C4", "half"]],
];

export const BLUE_BOSSA_NOTES = buildMelodyFromBars(BLUE_BOSSA_BARS);
