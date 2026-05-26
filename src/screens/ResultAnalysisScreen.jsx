import { useNotaStore } from "../store/useNotaStore";
import { ROUTES } from "../navigation/routes";
import { exportResultImage, downloadBlob, shareWithTeacher } from "../utils/exportResult";

function BarChart({ items, labelKey = "label", valueKey = "value", max = 100 }) {
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div key={item[labelKey]} className="bar-row">
          <span className="bar-label">{item[labelKey]}</span>
          <div className="bar-track">
            <span
              className="bar-fill"
              style={{ width: `${Math.min(100, (item[valueKey] / max) * 100)}%` }}
            />
          </div>
          <span className="bar-value">{item[valueKey]}</span>
        </div>
      ))}
    </div>
  );
}

export default function ResultAnalysisScreen() {
  const practiceSummary = useNotaStore((s) => s.practiceSummary);
  const aiFeedback = useNotaStore((s) => s.aiFeedback);
  const pieceMeta = useNotaStore((s) => s.pieceMeta);
  const selectedInstrument = useNotaStore((s) => s.selectedInstrument);
  const streak = useNotaStore((s) => s.streak);
  const teacherMode = useNotaStore((s) => s.teacherMode);
  const newAchievements = useNotaStore((s) => s.newAchievements);
  const clearNewAchievements = useNotaStore((s) => s.clearNewAchievements);
  const navigate = useNotaStore((s) => s.navigate);
  const showToast = useNotaStore((s) => s.showToast);
  const gamification = useNotaStore((s) => s.gamification);

  if (!practiceSummary) {
    return (
      <main className="screen">
        <p className="muted">No session data. Start practicing first.</p>
        <button type="button" className="primary" onClick={() => navigate(ROUTES.PRACTICE)}>
          Go to Practice
        </button>
      </main>
    );
  }

  const s = practiceSummary;
  const accuracy = s.accuracy ?? 0;

  const measureBars = (s.difficultMeasures || []).map((m) => ({
    label: `M${m}`,
    value: 100,
  }));

  const noteBars = (s.noteResults || [])
    .filter((r) => r.missed || r.wrong?.length || r.earlyLate)
    .slice(0, 6)
    .map((r) => ({
      label: r.expected,
      value: r.hits > 0 ? 40 : 100,
    }));

  const handleExport = async () => {
    const blob = await exportResultImage({
      title: pieceMeta.title,
      accuracy,
      xp: 25,
      streak: streak.current,
      instrument: selectedInstrument.name,
    });
    downloadBlob(blob, "nota-result.png");
    showToast("Image saved");
  };

  const handleShare = async () => {
    const shared = await shareWithTeacher({
      title: pieceMeta.title,
      accuracy,
      minutes: Math.round((s.durationSeconds || 60) / 60) || 1,
      instrument: selectedInstrument.name,
    });
    showToast(shared ? "Shared" : "Copied to clipboard");
  };

  return (
    <main className="screen result-screen">
      <section className="hero small">
        <h1>
          Session <span>Analysis</span>
        </h1>
        <p>{pieceMeta.title}</p>
      </section>

      <section className="result-hero glass-card">
        <div className="accuracy-ring" data-level={accuracy >= 85 ? "high" : accuracy >= 60 ? "mid" : "low"}>
          <strong>{accuracy}%</strong>
          <span>Accuracy</span>
        </div>
        {newAchievements?.length > 0 && (
          <div className="achievement-unlock streak-pulse">
            {newAchievements.map((a) => (
              <p key={a.id}>
                {a.icon} Unlocked: {a.title}
              </p>
            ))}
            <button type="button" className="secondary small-btn" onClick={clearNewAchievements}>
              Dismiss
            </button>
          </div>
        )}
      </section>

      {aiFeedback && (
        <section className="ai-feedback glass-card">
          <p className="exercise-label">AI Coach</p>
          <p className="ai-message">{aiFeedback.message}</p>
          <ul className="ai-tips">
            {aiFeedback.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <p className="ai-next">
            <strong>Next:</strong> {aiFeedback.nextStep}
          </p>
        </section>
      )}

      <section className="analysis-grid">
        <div className="analysis-card glass-card">
          <h3>Missed notes</h3>
          {s.missedNotes?.length ? (
            <ul>{s.missedNotes.map((n) => <li key={n}>{n}</li>)}</ul>
          ) : (
            <p className="muted">None — great focus!</p>
          )}
        </div>
        <div className="analysis-card glass-card">
          <h3>Rhythm issues</h3>
          {s.timingIssues?.length ? (
            <ul>{s.timingIssues.map((n) => <li key={n}>{n}</li>)}</ul>
          ) : (
            <p className="muted">Timing was steady.</p>
          )}
        </div>
        <div className="analysis-card glass-card">
          <h3>Difficult measures</h3>
          {s.difficultMeasures?.length ? (
            <p>{s.difficultMeasures.join(", ")}</p>
          ) : (
            <p className="muted">No repeated trouble spots.</p>
          )}
        </div>
        <div className="analysis-card glass-card">
          <h3>Longest pause</h3>
          <p>{((s.longestPauseMs || 0) / 1000).toFixed(1)}s</p>
        </div>
      </section>

      {noteBars.length > 0 && (
        <section className="glass-card chart-section">
          <h3>Problem notes</h3>
          <BarChart items={noteBars} max={100} />
        </section>
      )}

      {measureBars.length > 0 && (
        <section className="glass-card chart-section">
          <h3>Difficult measures</h3>
          <BarChart items={measureBars} max={100} />
        </section>
      )}

      <section className="glass-card accuracy-chart">
        <h3>Session score</h3>
        <BarChart items={[{ label: "Accuracy", value: accuracy }]} max={100} />
        <p className="muted">Total XP: {gamification.totalXp}</p>
      </section>

      <div className="buttons">
        <button type="button" className="primary" onClick={() => navigate(ROUTES.PRACTICE)}>
          Practice again
        </button>
        <button type="button" className="secondary" onClick={handleExport}>
          Export image
        </button>
        {teacherMode && (
          <button type="button" className="secondary" onClick={handleShare}>
            Share with teacher
          </button>
        )}
      </div>
    </main>
  );
}
