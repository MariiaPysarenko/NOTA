const WEEKS = 12;
const DAYS = 7;

export default function PracticeHeatmap({ sessions = [] }) {
  const counts = {};
  sessions.forEach((s) => {
    const key = (s.date || "").slice(0, 10);
    if (key) counts[key] = (counts[key] || 0) + 1;
  });

  const cells = [];
  const today = new Date();
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const key = date.toISOString().slice(0, 10);
      const count = counts[key] || 0;
      const level = count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : 3;
      cells.push({ key, level, date: key });
    }
  }

  return (
    <div className="heatmap-wrap">
      <p className="exercise-label">Practice calendar</p>
      <div className="heatmap-grid" role="img" aria-label="Practice activity heatmap">
        {cells.map((c) => (
          <span
            key={c.key}
            className={`heatmap-cell level-${c.level}`}
            title={`${c.date}: ${counts[c.date] || 0} sessions`}
          />
        ))}
      </div>
    </div>
  );
}
