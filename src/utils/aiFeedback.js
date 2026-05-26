/**
 * Practice feedback — local rules today, OpenAI-ready architecture tomorrow.
 */

const DEFAULT_PROVIDER = "local";

/**
 * @param {object} sessionStats
 * @param {number} sessionStats.accuracy
 * @param {string[]} sessionStats.missedNotes
 * @param {string[]} sessionStats.wrongNotes
 * @param {string[]} sessionStats.timingIssues
 * @param {number[]} sessionStats.difficultMeasures
 * @param {number} sessionStats.longestPauseMs
 * @param {string} sessionStats.pieceTitle
 * @param {string} sessionStats.instrument
 */
export function generatePracticeFeedback(sessionStats) {
  const provider = DEFAULT_PROVIDER;
  const accuracy = sessionStats.accuracy ?? 0;
  const missed = sessionStats.missedNotes?.length ?? 0;
  const rhythm = sessionStats.timingIssues?.length ?? 0;
  const hardMeasures = sessionStats.difficultMeasures ?? [];

  let message;
  if (accuracy >= 90) message = "Outstanding session — your pitch control is concert-ready.";
  else if (accuracy >= 75) message = "Strong progress! You're building reliable muscle memory.";
  else if (accuracy >= 55) message = "Good effort — focused reps will unlock cleaner intonation.";
  else message = "Every session counts. Slow down, listen, and aim for one clean measure at a time.";

  const tips = [];
  if (missed > 0) tips.push(`Review missed notes: ${sessionStats.missedNotes.slice(0, 3).join(", ")}`);
  if (rhythm > 0) tips.push("Practice with the metronome at 60–70% tempo, then speed up.");
  if (hardMeasures.length) tips.push(`Loop measures ${hardMeasures.join(", ")} four times each.`);
  if ((sessionStats.longestPauseMs ?? 0) > 800) tips.push("Reduce long pauses — play through in one breath when possible.");
  if (sessionStats.wrongNotes?.length) tips.push("Use a tuner on problem pitches before full runs.");
  if (!tips.length) tips.push("Maintain today's focus — try a slightly harder piece next.");

  let nextStep = "Run the piece once more at performance tempo.";
  if (accuracy < 70) nextStep = "Slow practice: 50% tempo, 3 clean passes, then increase BPM.";
  else if (hardMeasures.length) nextStep = `Isolate measures ${hardMeasures[0]}–${hardMeasures[hardMeasures.length - 1]} tomorrow.`;
  else if (accuracy >= 85) nextStep = "Add dynamics and record yourself for self-review.";

  const coachLines = [];
  if (accuracy >= 85) coachLines.push("Great rhythm improvement today.");
  else if (rhythm > 0) coachLines.push("Keep steady rhythm — use the metronome on problem spots.");
  else coachLines.push("Your tone is getting more stable — stay focused on intonation.");

  if (hardMeasures.length) {
    coachLines.push(`Measure ${hardMeasures[0]} still needs work.`);
  }
  if (missed > 0) {
    coachLines.push(`Slow down on ${sessionStats.missedNotes[0]} until it feels natural.`);
  }
  if (accuracy >= 90) coachLines.push("Outstanding session — you're performance-ready.");

  return {
    provider,
    message,
    tips: tips.slice(0, 4),
    coachLines: coachLines.slice(0, 3),
    nextStep,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Future OpenAI integration — swap provider without changing UI.
 * @example
 * const feedback = await createAiFeedbackProvider({ provider: 'openai', apiKey })(
 *   sessionStats
 * );
 */
export function createAiFeedbackProvider(config = {}) {
  const { provider = "local", fetchCompletion } = config;

  if (provider === "openai" && typeof fetchCompletion === "function") {
    return async (sessionStats) => {
      const prompt = buildPrompt(sessionStats);
      const text = await fetchCompletion(prompt);
      return parseOpenAiResponse(text, sessionStats);
    };
  }

  return async (sessionStats) => generatePracticeFeedback(sessionStats);
}

function buildPrompt(sessionStats) {
  return `You are NOTA, a music practice coach. Given session stats: accuracy ${sessionStats.accuracy}%, missed ${JSON.stringify(sessionStats.missedNotes)}, rhythm issues ${JSON.stringify(sessionStats.timingIssues)}, difficult measures ${JSON.stringify(sessionStats.difficultMeasures)}. Return JSON: { "message", "tips": [], "nextStep" }.`;
}

function parseOpenAiResponse(text, sessionStats) {
  try {
    const parsed = JSON.parse(text);
    return { provider: "openai", ...parsed, generatedAt: new Date().toISOString() };
  } catch {
    return generatePracticeFeedback(sessionStats);
  }
}
