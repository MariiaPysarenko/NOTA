// Exercise definitions and practice evaluation

/** Default demo: C4–G4, ~1 second per note */
export const DEMO_EXERCISE = {
  id: "demo-scale",
  title: "C Major Scale",
  subtitle: "Demo Exercise",
  notes: [
    { name: "C4", durationMs: 1000 },
    { name: "D4", durationMs: 1000 },
    { name: "E4", durationMs: 1000 },
    { name: "F4", durationMs: 1000 },
    { name: "G4", durationMs: 1000 },
  ],
};

/** Mock OCR: derive a simple exercise from uploaded image bytes */
export function mockExerciseFromUpload(fileName = "") {
  const pools = [
    ["C4", "E4", "G4", "C5", "G4"],
    ["D4", "F4", "A4", "G4", "E4"],
    ["G4", "A4", "B4", "C5", "D5"],
    ["E4", "F#4", "G#4", "A4", "B4"],
  ];
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) hash = (hash + fileName.charCodeAt(i)) % 997;
  const notes = pools[hash % pools.length].map((name) => ({
    name,
    durationMs: 1000,
  }));
  return {
    id: "upload-mock",
    title: "Uploaded Piece",
    subtitle: "Generated from sheet music",
    notes,
  };
}

export function getTotalDurationMs(exercise) {
  return exercise.notes.reduce((sum, n) => sum + n.durationMs, 0);
}

/** Which note index should be active at elapsedMs */
export function getExpectedNoteIndex(exercise, elapsedMs) {
  let t = 0;
  for (let i = 0; i < exercise.notes.length; i++) {
    t += exercise.notes[i].durationMs;
    if (elapsedMs < t) return i;
  }
  return exercise.notes.length - 1;
}

export function getExpectedNote(exercise, elapsedMs) {
  const idx = getExpectedNoteIndex(exercise, elapsedMs);
  return exercise.notes[idx];
}

/** Motivational copy based on accuracy */
export function getMotivationalFeedback(accuracy) {
  if (accuracy >= 90) return "Outstanding! Your pitch control is really shining.";
  if (accuracy >= 75) return "Great work! A few tweaks and you'll nail every note.";
  if (accuracy >= 55) return "Solid effort — keep practicing and you'll hear the difference.";
  return "Every session counts. Slow down, listen, and try again!";
}

/**
 * Evaluate practice samples after session ends.
 * samples: { elapsedMs, detectedNote, targetNote, cents, isSilent, unstable }[]
 */
export function evaluatePractice(exercise, samples) {
  const noteResults = exercise.notes.map((n) => ({
    expected: n.name,
    hits: 0,
    attempts: 0,
    wrong: [],
    missed: false,
    unstable: false,
    earlyLate: false,
  }));

  let longestPauseMs = 0;
  let pauseStart = null;
  const PAUSE_THRESHOLD_MS = 400;
  const TIMING_TOLERANCE_MS = 250;

  for (const s of samples) {
    const idx = getExpectedNoteIndex(exercise, s.elapsedMs);
    const slot = noteResults[idx];
    slot.attempts += 1;

    if (s.isSilent) {
      if (pauseStart == null) pauseStart = s.elapsedMs;
    } else {
      if (pauseStart != null) {
        const pauseLen = s.elapsedMs - pauseStart;
        longestPauseMs = Math.max(longestPauseMs, pauseLen);
        if (pauseLen > PAUSE_THRESHOLD_MS && idx < exercise.notes.length) {
          slot.missed = slot.missed || slot.hits === 0;
        }
        pauseStart = null;
      }
      if (s.detectedNote === s.targetNote && Math.abs(s.cents ?? 99) <= 35) {
        slot.hits += 1;
      } else if (s.detectedNote && s.detectedNote !== s.targetNote) {
        if (!slot.wrong.includes(s.detectedNote)) slot.wrong.push(s.detectedNote);
      }
      if (s.unstable) slot.unstable = true;
      if (s.timingOff) slot.earlyLate = true;
    }
  }

  // Mark missed notes with no successful hits
  noteResults.forEach((slot) => {
    if (slot.hits === 0 && slot.attempts > 0) slot.missed = true;
  });

  const totalSlots = noteResults.length;
  const correctSlots = noteResults.filter((r) => r.hits > 0 && r.wrong.length === 0).length;
  const accuracy = Math.round((correctSlots / totalSlots) * 100);

  const missedNotes = noteResults.filter((r) => r.missed).map((r) => r.expected);
  const wrongNotes = [
    ...new Set(
      noteResults.flatMap((r) =>
        r.wrong.length ? [`${r.expected} (played ${r.wrong.join(", ")})`] : []
      )
    ),
  ];

  const unstableNotes = noteResults.filter((r) => r.unstable).map((r) => r.expected);
  const timingIssues = noteResults.filter((r) => r.earlyLate).map((r) => r.expected);

  return {
    accuracy,
    missedNotes,
    wrongNotes,
    unstableNotes,
    timingIssues,
    longestPauseMs,
    feedback: getMotivationalFeedback(accuracy),
    noteResults,
  };
}
