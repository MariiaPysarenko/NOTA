import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Summertime (Gershwin) — A minor, 32 bars.
 * Lullaby phrasing: dotted rhythms, long tones, gentle descent.
 */
const SUMMERTIME_BARS = [
  // A — opening
  [["E4", "half"], ["G4", "quarter"], ["A4", "quarter"]],
  [["B4", "half"], ["C5", "quarter"], ["B4", "quarter"]],
  [["A4", "quarter"], ["G4", "quarter"], ["E4", "half"]],
  [["G4", "quarter"], ["F4", "quarter"], ["E4", "half"]],
  [["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["E4", "quarter"]],
  [["D4", "half"], ["E4", "half"]],
  [["G4", "quarter"], ["A4", "quarter"], ["B4", "half"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  // B
  [["G4", "quarter"], ["F4", "quarter"], ["E4", "half"]],
  [["D4", "quarter"], ["C4", "quarter"], ["B3", "quarter"], ["A3", "quarter"]],
  [["G3", "half"], ["E4", "half"]],
  [["G4", "quarter"], ["A4", "quarter"], ["B4", "half"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["F4", "quarter"], ["E4", "half"]],
  [["A4", "quarter"], ["G4", "quarter"], ["F4", "quarter"], ["E4", "quarter"]],
  [["D4", "half"], ["E4", "half"]],
  // Repeat A
  [["G4", "quarter"], ["A4", "quarter"], ["B4", "half"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["F4", "quarter"], ["E4", "half"]],
  [["D4", "quarter"], ["C4", "quarter"], ["B3", "quarter"], ["A3", "quarter"]],
  [["G3", "half"], ["E4", "half"]],
  [["G4", "quarter"], ["A4", "quarter"], ["B4", "half"]],
  [["C5", "half"], ["B4", "quarter"], ["A4", "quarter"]],
  [["G4", "quarter"], ["F4", "quarter"], ["E4", "half"]],
  // Bridge + return
  [["C4", "quarter"], ["D4", "quarter"], ["E4", "quarter"], ["G4", "quarter"]],
  [["A4", "quarter"], ["B4", "quarter"], ["C5", "quarter"], ["D5", "quarter"]],
  [["C5", "quarter"], ["B4", "quarter"], ["A4", "quarter"], ["G4", "quarter"]],
  [["F4", "quarter"], ["E4", "quarter"], ["D4", "half"]],
  [["E4", "half"], ["G4", "quarter"], ["A4", "quarter"]],
  [["B4", "half"], ["C5", "quarter"], ["B4", "quarter"]],
  [["A4", "quarter"], ["G4", "quarter"], ["E4", "half"]],
  [["A4", "half"], ["E4", "half"]],
];

export const SUMMERTIME_NOTES = buildMelodyFromBars(SUMMERTIME_BARS);
