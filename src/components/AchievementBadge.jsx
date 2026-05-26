export default function AchievementBadge({ achievement, unlocked = true }) {
  return (
    <div className={`achievement-badge glass-card ${unlocked ? "unlocked" : "locked"}`}>
      <span className="ach-icon">{achievement.icon}</span>
      <div>
        <strong>{achievement.title}</strong>
        <p>{achievement.desc}</p>
      </div>
    </div>
  );
}
