export default function EmptyState({
  icon = "♪",
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) {
  return (
    <div className={`empty-state-card glass-card ${compact ? "empty-state-compact" : ""}`}>
      <span className="empty-icon" aria-hidden>
        {icon}
      </span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <button type="button" className="primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
