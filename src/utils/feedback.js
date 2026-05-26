export function generatePracticeFeedback(sessionStats) {
  const {
    accuracy = 0,
    timingIssues = [],
    missedNotes = [],
    wrongNotes = [],
    difficultMeasures = [],
  } = sessionStats || {};

  const tips = [];
  if (accuracy < 70) tips.push("Slow tempo down by 15-20% and focus on clean attacks.");
  if (timingIssues.length > 0) tips.push("Use a metronome on subdivisions to tighten rhythm.");
  if (missedNotes.length > 0) tips.push("Loop the missed notes in short 2-note fragments.");
  if (wrongNotes.length > 0) tips.push("Sing target pitches before playing to lock intonation.");

  const motivational =
    accuracy >= 90
      ? "Excellent session. Your control and consistency are improving."
      : accuracy >= 75
        ? "Great effort. You are close to a clean run."
        : "Good work today. Focused repetition will raise your score quickly.";

  const nextExercise =
    difficultMeasures.length > 0
      ? `Repeat measures ${difficultMeasures.slice(0, 2).join(", ")} at 70 BPM.`
      : accuracy < 80
        ? "Practice a 5-note scale pattern with quarter notes at 70 BPM."
        : "Try the same piece at +10 BPM and maintain pitch accuracy.";

  return {
    motivational,
    tips: tips.slice(0, 3),
    nextExercise,
  };
}
