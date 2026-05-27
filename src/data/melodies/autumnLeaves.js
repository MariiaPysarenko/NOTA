import { buildMelodyFromBars } from "../melodyBuilder";

/**
 * Autumn Leaves — educational lead-sheet melody (16 bars).
 * Manual phrasing in G minor / Bb major feel.
 */
const AUTUMN_LEAVES_BARS = [
  [["C5", "quarter"], ["F5", "quarter"], ["Bb5", "quarter"], ["Eb5", "quarter"]],
  [["A5", "half"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["A4", "whole"]],
  [["D5", "quarter"], ["G5", "quarter"], ["C6", "quarter"], ["Bb5", "quarter"]],
  [["A5", "half"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["G4", "whole"]],
  [["C5", "quarter"], ["F5", "quarter"], ["Bb5", "quarter"], ["Eb5", "quarter"]],
  [["A5", "half"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["A4", "half"], ["D5", "half"]],
  [["Eb5", "quarter"], ["F5", "quarter"], ["G5", "quarter"], ["F5", "quarter"]],
  [["Eb5", "quarter"], ["D5", "quarter"], ["C5", "quarter"], ["Bb4", "quarter"]],
  [["A4", "quarter"], ["Bb4", "quarter"], ["C5", "quarter"], ["D5", "quarter"]],
  [["G4", "half"], ["G4", "half"]],
];

export const AUTUMN_LEAVES_NOTES = buildMelodyFromBars(AUTUMN_LEAVES_BARS);
