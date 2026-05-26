import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { generatePracticeFeedback } from "../utils/feedback";
import { ROUTES } from "../navigation/routes";

function difficultMeasuresFromSummary(summary) {
  if (!summary?.noteResults) return [];
  const set = new Set();
  summary.noteResults.forEach((item, idx) => {
    if (item.missed || item.wrong.length > 0 || item.earlyLate) {
      set.add(item.measure ?? Math.floor(idx / 4) + 1);
    }
  });
  return [...set];
}

export default function ResultAnalysisScreen() {
  const { practiceSummary, pieceMeta, annotationsBySheet, pieceMeta: meta, navigate } = useApp();
  const summary = practiceSummary;

  const difficultMeasures = useMemo(
    () => difficultMeasuresFromSummary(summary),
    [summary]
  );
  const ai = useMemo(
    () =>
      generatePracticeFeedback({
        ...summary,
        difficultMeasures,
      }),
    [summary, difficultMeasures]
  );

  if (!summary) {
    return (
      <main className="screen">
        <section className="hero small">
          <h1>
            Practice <span>Analysis</span>
          </h1>
          <p>Complete a session first to see your detailed result.</p>
        </section>
        <button className="primary" type="button" onClick={() => navigate(ROUTES.PRACTICE)}>
          Start Practice
        </button>
      </main>
    );
  }

  const linkedAnnotations = annotationsBySheet[meta.id]?.filter((a) => a.linked_measure) ?? [];

  return (
    <main className="screen">
      <section className="hero small">
        <h1>
          Session <span>Analysis</span>
        </h1>
        <p>{pieceMeta.title}</p>
      </section>

      <section className="summary-card">
        <div className="summary-grid">
          <div className="summary-stat highlight">
            <b>{summary.accuracy}%</b>
            <span>Accuracy</span>
          </div>
          <div className="summary-stat">
            <b>{summary.noteResults.length}</b>
            <span>Total notes</span>
          </div>
          <div className="summary-stat">
            <b>{summary.wrongNotes.length}</b>
            <span>Wrong</span>
          </div>
          <div className="summary-stat">
            <b>{Math.round(summary.longestPauseMs / 1000)}s</b>
            <span>Longest pause</span>
          </div>
        </div>

        <p className="summary-detail">
          <strong>Missed notes:</strong> {summary.missedNotes.join(", ") || "None"}
        </p>
        <p className="summary-detail">
          <strong>Rhythm issues:</strong> {summary.timingIssues.join(", ") || "None"}
        </p>
        <p className="summary-detail">
          <strong>Difficult measures:</strong> {difficultMeasures.join(", ") || "None"}
        </p>
      </section>

      <section className="ai-card">
        <h3>
          AI <span>Coach</span>
        </h3>
        <p>{ai.motivational}</p>
        {ai.tips.map((tip) => (
          <p key={tip} className="summary-detail">
            • {tip}
          </p>
        ))}
        <p className="summary-motivation">{ai.nextExercise}</p>
        {linkedAnnotations.length > 0 && (
          <p className="summary-detail">
            You marked measure {linkedAnnotations[0].linked_measure}. Practice this fragment slowly
            with a metronome.
          </p>
        )}
      </section>

      <div className="buttons">
        <button className="primary" type="button" onClick={() => navigate(ROUTES.PRACTICE)}>
          Practice Again
        </button>
        <button className="secondary" type="button" onClick={() => navigate(ROUTES.PROGRESS)}>
          View Progress
        </button>
      </div>
    </main>
  );
}
