import { createNote } from "../utils/noteModel";

/** Pre-digitized library tracks (structured notes, not images) */
export const LIBRARY_TRACKS = [
  {
    id: "autumn-leaves",
    title: "Autumn Leaves",
    subtitle: "Jazz standard · Easy",
    notes: [
      createNote({ pitch: "G4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "C5", duration: "quarter", measure: 1 }),
      createNote({ pitch: "E5", duration: "quarter", measure: 1 }),
      createNote({ pitch: "G5", duration: "quarter", measure: 1 }),
      createNote({ pitch: "F5", duration: "half", measure: 2 }),
      createNote({ pitch: "E5", duration: "half", measure: 2 }),
    ],
  },
  {
    id: "blue-bossa",
    title: "Blue Bossa",
    subtitle: "Latin jazz · Medium",
    notes: [
      createNote({ pitch: "C4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "E4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "G4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "Bb4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "A4", duration: "half", measure: 2 }),
    ],
  },
  {
    id: "summertime",
    title: "Summertime",
    subtitle: "Blues · Beginner",
    notes: [
      createNote({ pitch: "E4", duration: "half", measure: 1 }),
      createNote({ pitch: "G4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "A4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "B4", duration: "half", measure: 2 }),
      createNote({ pitch: "C5", duration: "half", measure: 2 }),
    ],
  },
  {
    id: "warmup-scale",
    title: "C Major Warm-up",
    subtitle: "Technique · 5 notes",
    notes: [
      createNote({ pitch: "C4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "D4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "E4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "F4", duration: "quarter", measure: 1 }),
      createNote({ pitch: "G4", duration: "quarter", measure: 1 }),
    ],
  },
];
