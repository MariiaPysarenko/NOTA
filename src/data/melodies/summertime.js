import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Summertime — educational lead-sheet melody (16 bars).
 * Manual lullaby phrasing in A minor.
 */
const SUMMERTIME_BARS = [
  [["E5", "half"], ["C5", "quarter"], ["A4", "quarter"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["A4", "quarter"], ["C5", "quarter"], ["B4", "quarter"]],
  [["A4", "whole"]],
  [["E5", "half"], ["C5", "quarter"], ["A4", "quarter"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["E4", "quarter"], ["G4", "quarter"], ["A4", "quarter"]],
  [["A4", "whole"]],
  [["C5", "quarter"], ["D5", "quarter"], ["E5", "quarter"], ["C5", "quarter"]],
  [["B4", "quarter"], ["A4", "quarter"], ["G4", "half"]],
  [["E4", "quarter"], ["G4", "quarter"], ["A4", "quarter"], ["C5", "quarter"]],
  [["B4", "half"], ["A4", "quarter"], ["G4", "quarter"]],
  [["E5", "half"], ["C5", "quarter"], ["A4", "quarter"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["A4", "quarter"], ["C5", "quarter"], ["B4", "quarter"]],
  [["A4", "half"], ["E4", "half"]],
];

export const SUMMERTIME_NOTES = buildMelodyFromBars(SUMMERTIME_BARS);
