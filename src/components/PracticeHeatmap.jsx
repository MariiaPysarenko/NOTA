function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export default function PracticeHeatmap({ sessions = [] }) {
  const days = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const key = dateKey(d);
    const mins = sessions
      .filter((s) => (s.date || "").slice(0, 10) === key)
      .reduce((sum, s) => sum + Math.round((s.durationSeconds || 0) / 60), 0);
    return { key, mins };
  });

  return (
    <section className="heatmap-card glass-card">
      <p className="exercise-label">Practice calendar</p>
      <div className="heatmap-grid">
        {days.map((d) => (
          <span
            key={d.key}
            className="heatmap-cell"
            style={{ opacity: d.mins ? Math.min(1, 0.35 + d.mins / 20) : 0.15 }}
            title={`${d.key}: ${d.mins} min`}
          />
        ))}
      </div>
    </section>
  );
}
