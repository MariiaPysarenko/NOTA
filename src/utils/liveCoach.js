/** Short real-time AI-style coach messages during practice */

export function getLiveCoachMessage({ liveFeedback, currentMeasure, difficultMeasures = [] }) {
  if (liveFeedback === "correct") {
    const msgs = ["Great tone!", "Nice pitch!", "Clean note!", "Great rhythm"];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  if (liveFeedback === "wrong") {
    return currentMeasure ? `Watch measure ${currentMeasure}` : "Check your pitch";
  }
  if (liveFeedback === "rhythm") {
    return currentMeasure ? `Rhythm off in measure ${currentMeasure}` : "Keep steady rhythm";
  }
  if (liveFeedback === "pause") return "Keep the flow — try not to pause";
  if (difficultMeasures.length > 0) {
    return `Focus measure ${difficultMeasures[0]}`;
  }
  return null;
}

export function getSessionCoachLines(summary) {
  const lines = [];
  if (!summary) return lines;
  if (summary.accuracy >= 85) lines.push("Great rhythm");
  if (summary.timingIssues?.length) {
    const m = summary.difficultMeasures?.[0];
    lines.push(m ? `Watch measure ${m}` : "Work on timing with metronome");
  }
  if (summary.missedNotes?.length) lines.push("Slow down on missed notes");
  if (summary.accuracy >= 90) lines.push("Excellent intonation today");
  return lines.slice(0, 3);
}
