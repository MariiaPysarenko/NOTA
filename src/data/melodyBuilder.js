import { createNote } from "../utils/noteModel";

const BEATS = { whole: 4, half: 2, quarter: 1, eighth: 0.5, sixteenth: 0.25 };

/** Turn [pitch, duration] pairs into structured notes with measure/beat in 4/4. */
export function buildMelody(entries) {
  let measure = 1;
  let beat = 1;
  return entries.map(([pitch, duration]) => {
    const note = createNote({ pitch, duration, measure, beat });
    beat += BEATS[duration] ?? 1;
    while (beat > 4.0001) {
      beat -= 4;
      measure += 1;
    }
    return note;
  });
}
