export default function AchievementBadge({ achievement }) {
  if (!achievement) return null;
  return (
    <div className="achievement-badge glass-card">
      <span>{achievement.icon}</span>
      <div>
        <b>{achievement.title}</b>
        <p>{achievement.desc}</p>
      </div>
    </div>
  );
}
