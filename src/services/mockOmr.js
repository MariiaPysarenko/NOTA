import { createNote } from "../utils/noteModel";

/** Simulated processing delay (ms) */
const OMR_DELAY_MS = 1400;

const MOCK_OUTPUTS = [
  [
    { pitch: "C4", duration: "quarter", measure: 1 },
    { pitch: "E4", duration: "quarter", measure: 1 },
    { pitch: "G4", duration: "quarter", measure: 1 },
    { pitch: "C5", duration: "quarter", measure: 1 },
  ],
  [
    { pitch: "D4", duration: "quarter", measure: 1 },
    { pitch: "F4", duration: "quarter", measure: 1 },
    { pitch: "A4", duration: "quarter", measure: 1 },
    { pitch: "D5", duration: "half", measure: 2 },
  ],
  [
    { pitch: "G4", duration: "eighth", measure: 1 },
    { pitch: "A4", duration: "eighth", measure: 1 },
    { pitch: "B4", duration: "quarter", measure: 1 },
    { pitch: "C5", duration: "quarter", measure: 1 },
    { pitch: "D5", duration: "half", measure: 2 },
  ],
  [
    { pitch: "E4", duration: "quarter", measure: 1 },
    { pitch: "F#4", duration: "quarter", measure: 1 },
    { pitch: "G#4", duration: "quarter", measure: 1 },
    { pitch: "A4", duration: "quarter", measure: 2 },
    { pitch: "B4", duration: "half", measure: 2 },
  ],
];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h + str.charCodeAt(i) * (i + 1)) % 997;
  return h;
}

/**
 * Mock OMR pipeline — converts upload metadata into structured notes.
 * Replace with real OMR API via `digitizeWithApi` in omrApi.js later.
 */
export async function mockDigitizeSheetMusic(file) {
  const seed = `${file.name}-${file.size}-${file.lastModified}`;
  await new Promise((r) => setTimeout(r, OMR_DELAY_MS));
  const pattern = MOCK_OUTPUTS[hashString(seed) % MOCK_OUTPUTS.length];
  return pattern.map((n) => createNote(n));
}
